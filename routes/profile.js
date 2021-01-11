const router = require('express').Router();
const verify = require('./verifiyToken');
const connection = require('./server');
const bcrypt=require('bcryptjs');


router.get('/profile', verify, (req, res) => {
    //console.log(req.user);
    if (!req.user)
        res.redirect('/login');
    let ProfileOwner = req.user.user.Handle;
    let profile;
    let ProfileQuery;
    if (req.user.user.Acsess == "developer") {
        ProfileQuery = `SELECT 
                            (
                                SELECT COUNT(*)
                                FROM Nyzaka.friends
                                WHERE Follower = '${ProfileOwner}'
                            ) AS NumFriends,
                            (
                                SELECT COUNT(*)
                                FROM Nyzaka.friends
                                WHERE Followee = '${ProfileOwner}'
                            ) AS NumFollowee,
                            (
                                SELECT COUNT(*)
                                FROM Nyzaka.Articles
                                WHERE Writer = '${ProfileOwner}'
                            ) AS NumArticles,
                            (
                                SELECT COUNT(*)
                                FROM Nyzaka.Documentation
                                WHERE Writer = '${ProfileOwner}'
                            ) AS NumDocumentations,
                            (
                                SELECT COUNT(Distinct Problem_ID)
                                FROM Nyzaka.Submissions
                                WHERE User_ = '${ProfileOwner}' AND Submission_Status = 'Accepted'
                            ) AS NumSolvedProblem,
                            (
                                SELECT COUNT(*)
                                FROM Nyzaka.Problem
                                WHERE Writer = '${ProfileOwner}'
                            ) AS NumMadeProblem,
                            (
                                SELECT SUM(Score)
                                FROM
                                (
                                    SELECT distinct prob.Problem_ID, prob.score
                                    FROM Nyzaka.Submissions AS sub , NyZaka.Problem AS prob
                                    WHERE sub.User_ = '${ProfileOwner}' AND sub.Submission_Status = 'Accepted' AND sub.Problem_ID = prob.Problem_ID
                                ) AS ProblemsSolved
                                
                            ) AS Rating;`;
    } else if (req.user.user.Acsess == "student") {
        ProfileQuery = `SELECT 
                            (
                                SELECT COUNT(*)
                                FROM Nyzaka.friends
                                WHERE Follower = '${ProfileOwner}'
                            ) AS NumFriends,
                            (
                                SELECT COUNT(*)
                                FROM Nyzaka.friends
                                WHERE Followee = '${ProfileOwner}'
                            ) AS NumFollowee,
                            (
                                SELECT COUNT(Distinct Problem_ID)
                                FROM Nyzaka.Submissions
                                WHERE User_ = '${ProfileOwner}' AND Submission_Status = 'Accepted'
                            ) AS NumSolvedProblem,
                            (
                                SELECT SUM(Score)
                                FROM
                                (
                                    SELECT distinct prob.Problem_ID, prob.score
                                    FROM Nyzaka.Submissions AS sub , NyZaka.Problem AS prob
                                    WHERE sub.User_ = '${ProfileOwner}' AND sub.Submission_Status = 'Accepted' AND sub.Problem_ID = prob.Problem_ID
                                ) AS ProblemsSolved
                                
                            ) AS Rating;`;
    }
    connection.query(ProfileQuery, (error, results, fields) => {
        if (error) throw error;

        if (req.user.user.Acsess == "developer") {
            Profile = {
                NumArticles: results[0].NumArticles,
                NumFriends: results[0].NumFriends,
                NumFollowee: results[0].NumFollowee,
                NumDocumentations: results[0].NumDocumentations,
                NumSolvedProblem: results[0].NumSolvedProblem,
                NumMadeProblem: results[0].NumMadeProblem,
                Rating: results[0].Rating
            };
        } else if (req.user.user.Acsess == "student") {
            Profile = {
                NumFriends: results[0].NumFriends,
                NumFollowee: results[0].NumFollowee,
                NumSolvedProblem: results[0].NumSolvedProblem,
                Rating: results[0].Rating
            }
        }
        res.render('profile', { user: req.user, Profile, Current_Nav: '__' });
    });

})
router.get('/profile/myfriends', verify, (req, res) => {
    //console.log(req.user);
    if (!req.user)
        res.send("access dened please login");
    req.user.Current_Nav = '__';
    let queryCountFollowing = `SELECT Followee FROM NyZaKa.friends WHERE Follower="${req.user.user.Handle}"`;
    connection.query(queryCountFollowing, (error, results, fields) => {
        if (error) throw error;

        let arrFollowing = [];
        results.forEach(element => {
            arrFollowing.push(element.Followee);
        });

        let queryCountFollowers = `SELECT Follower FROM NyZaKa.friends WHERE Followee="${req.user.user.Handle}"`;
        connection.query(queryCountFollowers, (error, results, fields) => {
            if (error) throw error;
    
            let arrFollowers = [];
            results.forEach(element => {
                arrFollowers.push(element.Follower);
            });
            res.render('myfriends', { user: req.user, listFollowers: arrFollowers,listFollowing:arrFollowing, Current_Nav: '__' });
        });

    });


})
router.get('/profile/updateProfile',verify, (req, res) => {
    if (!req.user)
        res.redirect('/login');
    res.render('updateProfile', { user: req.user, Current_Nav: '__' });

});
router.post('/profile/updateProfile',verify, async(req, res) => {
    if (!req.user)
        res.redirect('/login');
    
        
    const isvaildpass=await bcrypt.compare(req.body.oldpassword,req.user.user.Password_);
    
    if(!isvaildpass&&req.body.oldpassword!=req.user.user.Password_)
        res.status(400).send("invalid old password");
    else if(isvaildpass || req.body.oldpassword == req.user.user.Password_)
    {
       
        
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(req.body.newpassword,salt);
        let newuser={
            email:req.body.email,
            fname:req.body.fname,
            lname:req.body.lname,
            password:hashedpassword,
        }
        console.log(newuser);
        let query =`update NyZaKa.Users set E_mail='${newuser.email}', Fname='${newuser.fname}' ,Lname='${newuser.lname}', Password_='${newuser.password}' where Handle='${req.user.user.Handle}';`;
        connection.query(query,  async(error, results, fields)=> {
            if (error) res.send(error);
            res.clearCookie("token").redirect('/login');
            //res.redirect(`/profile`);
        });
    }
  //  console.log(isvaildpass, req.body.oldpassword == req.user.user.Password_);
    //res.render('updateProfile', { user: req.user, Current_Nav: '__' });

});
router.get('/profile/:handle', verify, (req, res) => {
    //console.log(req.user);
    let handle = req.params.handle;
    if (req.user && handle == req.user.user.Handle)
        res.redirect('/profile');

    let ProfileOwner = handle;
    let profile;
    let ProfileQuery;
    let query = `SELECT * FROM NyZaKa.Users WHERE handle="${handle}"`;
    connection.query(query, (error, results, fields) => {

        if (!results.length)
            res.render('404', { user: req.user, Current_Nav: '__' });
            let userTemp = {
                Handle: results[0].Handle,
                Acsess: results[0].Acsess,
                E_mail: results[0].E_mail,
                Fname: results[0].Fname,
                Lname: results[0].Lname,
                Rate_max: results[0].Rate_max,
                Curr_Rate: results[0].Rate_cur
            }
            
            if (userTemp.Acsess == "developer") {
                ProfileQuery = `SELECT
                                    (
                                        SELECT COUNT(*)
                                        FROM Nyzaka.friends
                                        WHERE Follower = '${ProfileOwner}'
                                    ) AS NumFriends,
                                    (
                                        SELECT COUNT(*)
                                        FROM Nyzaka.friends
                                        WHERE Followee = '${ProfileOwner}'
                                    ) AS NumFollowee,
                                    (
                                        SELECT COUNT(*)
                                        FROM Nyzaka.Articles
                                        WHERE Writer = '${ProfileOwner}'
                                    ) AS NumArticles,
                                    (
                                        SELECT COUNT(*)
                                        FROM Nyzaka.Documentation
                                        WHERE Writer = '${ProfileOwner}'
                                    ) AS NumDocumentations,
                                    (
                                        SELECT COUNT(Distinct Problem_ID)
                                        FROM Nyzaka.Submissions
                                        WHERE User_ = '${ProfileOwner}' AND Submission_Status = 'Accepted'
                                    ) AS NumSolvedProblem,
                                    (
                                        SELECT COUNT(*)
                                        FROM Nyzaka.Problem
                                        WHERE Writer = '${ProfileOwner}'
                                    ) AS NumMadeProblem,
                                    (
                                        SELECT SUM(Score)
                                        FROM
                                        (
                                            SELECT distinct prob.Problem_ID, prob.score
                                            FROM Nyzaka.Submissions AS sub , NyZaka.Problem AS prob
                                            WHERE sub.User_ = '${ProfileOwner}' AND sub.Submission_Status = 'Accepted' AND sub.Problem_ID = prob.Problem_ID
                                        ) AS ProblemsSolved
                                        
                                    ) AS Rating;`;
            } else if (userTemp.Acsess == "student") {
                ProfileQuery = `SELECT 
                                    (
                                        SELECT COUNT(*)
                                        FROM Nyzaka.friends
                                        WHERE Follower = '${ProfileOwner}'
                                    ) AS NumFriends,
                                    (
                                        SELECT COUNT(*)
                                        FROM Nyzaka.friends
                                        WHERE Followee = '${ProfileOwner}'
                                    ) AS NumFollowee,
                                    (
                                        SELECT COUNT(Distinct Problem_ID)
                                        FROM Nyzaka.Submissions
                                        WHERE User_ = '${ProfileOwner}' AND Submission_Status = 'Accepted'
                                    ) AS NumSolvedProblem,
                                    (
                                        SELECT SUM(Score)
                                        FROM
                                        (
                                            SELECT distinct prob.Problem_ID, prob.score
                                            FROM Nyzaka.Submissions AS sub , NyZaka.Problem AS prob
                                            WHERE sub.User_ = '${ProfileOwner}' AND sub.Submission_Status = 'Accepted' AND sub.Problem_ID = prob.Problem_ID
                                        ) AS ProblemsSolved
                                        
                                    ) AS Rating;`;
            }
            //console.log(ProfileQuery);
            connection.query(ProfileQuery, (error, results, fields) => {
                if (error) throw error;

                
                if (!results.length)
                    res.render('404', { user: req.user, Current_Nav: '__' });
                if (userTemp.Acsess == "developer") {
                    userProfile = {
                        Handle:userTemp.Handle,
                        Acsess:userTemp.Acsess,
                        E_mail:userTemp.E_mail,
                        Fname:userTemp.Fname,
                        Lname:userTemp.Lname,
                        Rate_max:userTemp.Rate_max,
                        NumArticles: results[0].NumArticles,
                        NumFriends: results[0].NumFriends,
                        NumFollowee: results[0].NumFollowee,
                        NumDocumentations: results[0].NumDocumentations,
                        NumSolvedProblem: results[0].NumSolvedProblem,
                        NumMadeProblem: results[0].NumMadeProblem,
                        Rating: results[0].Rating,
                        IsFriend: false
                    };
                } else if (userTemp.Acsess == "student") {
                    userProfile = {
                        Handle:userTemp.Handle,
                        Acsess:userTemp.Acsess,
                        E_mail:userTemp.E_mail,
                        Fname:userTemp.Fname,
                        Lname:userTemp.Lname,
                        Rate_max:userTemp.Rate_max,
                        NumFriends: results[0].NumFriends,
                        NumFollowee: results[0].NumFollowee,
                        NumSolvedProblem: results[0].NumSolvedProblem,
                        Rating: results[0].Rating,
                        IsFriend: false
                    }
                }
                
                
                    if (req.user) {
                        let queryCheckFriend = `SELECT * FROM NyZaKa.friends WHERE Follower="${req.user.user.Handle}" and Followee="${handle}"`;
                        connection.query(queryCheckFriend, (error, results, fields) => {
                            if (error) throw error;
                            //res.render('/Blogs'); 
                            if (results.length)
                                userProfile.IsFriend = true;
                                //console.log(userProfile);
                            res.render('user', { user: req.user, Current_Nav: '__', currUser: userProfile });
                            
                        });
                    }
                    else {
                        res.render('user', { user: req.user, Current_Nav: '__', currUser: userProfile });
                    }
                });
        //res.render('profile', { user: req.user, userProfile, Current_Nav: '__' });
    });

   
    
            

    
    // res.render('user',{user:req.user, Current_Nav: '__'});
})

router.post('/profile/:handle', verify, (req, res) => {
    let handle = req.params.handle;
    if (!req.user)
        res.json({ redirect: '/profile/' + handle });
    req.user.Current_Nav = '__';

    let query = `INSERT INTO NyZaKa.Friends VALUES("${req.user.user.Handle}","${handle}")`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        //console.log(query, results);
        //res.render('/Blogs'); 
        res.json({ redirect: '/profile/' + handle });

    });
    // res.render('user',{user:req.user, Current_Nav: '__'});
})
router.delete('/profile/:handle', verify, (req, res) => {
    let handle = req.params.handle;
    /* if(handle==req.user.user.Handle)
         res.redirect('/profile');*/
    req.user.Current_Nav = '__';
    let query = `delete from NyZaKa.Friends WHERE Follower="${req.user.user.Handle}" and Followee="${handle}"`;
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        //console.log(query, results);
        //res.render('/Blogs'); 
        res.json({ redirect: '/profile/' + handle });

    });
    // res.render('user',{user:req.user, Current_Nav: '__'});
})

module.exports = router;