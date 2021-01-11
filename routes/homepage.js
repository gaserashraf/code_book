const router = require('express').Router();
const verify=require('./verifiyToken');
const connection = require('./server');
router.get('/',verify, async(req,res)=>{
    if(!req.user)
        res.render('homepage2', { user:req.user , Current_Nav: 'Home'});
    else
    {
        let arrArticles=[],arrFollowers=[];
        let queryGetFriends=`SELECT followee from nyzaka.friends where follower = '${req.user.user.Handle}'`;

        connection.query(queryGetFriends, (error, results, fields)=> {
            if (error) res.send(error);
            results.forEach(element => {
                arrFollowers.push(element.followee);
            });
            
            if(arrFollowers.length == 0)     
                res.render('homepage', { user:req.user ,arrArticles, Current_Nav: 'Home'});
            else
            {
                let queryGetArt="SELECT * from nyzaka.Articles where Writer = ";
                arrFollowers.forEach((element,index)=>{

                    if(index!=arrFollowers.length-1)
                        queryGetArt+=`'${element}' or Writer = `;
                    else
                        queryGetArt+=`'${element}'`;
                })
                connection.query(queryGetArt, (error, results, fields)=> {
                    if (error) res.send(error);
                    results.forEach(e=>{
                        e.date = e.Art_date;
                        delete e.Art_date;
                        e.type="Article"
                        arrArticles.push(e);
                    })
                    

                    let queryGetDoc="SELECT * from nyzaka.Documentation where Writer = ";
                    arrFollowers.forEach((element,index)=>{

                        if(index!=arrFollowers.length-1)
                        queryGetDoc+=`'${element}' or Writer = `;
                        else
                        queryGetDoc+=`'${element}'`;
                    })
                    connection.query(queryGetDoc, (error, results, fields)=> {
                        if (error) res.send(error);

                        results.forEach(e=>{
                            e.date = e.Doc_date;
                            delete e.Doc_date;
                            e.type="Documentation"
                            arrArticles.push(e);
                        })
                        arrArticles.sort((a, b) => (a.date < b.date) ? 1 : -1)
                        console.log(arrArticles);
                        res.render('homepage', { user:req.user ,arrArticles, Current_Nav: 'Home'});
                    });
                })
            }
        });
    }
});
module.exports = router;