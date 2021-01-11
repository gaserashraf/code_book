const router = require('express').Router();
const { promiseImpl } = require('ejs');
const connection = require('./server');
const verify = require('./verifiyToken');
router.get('/contests', verify, (req, res) => {
    let token = req.user;
    
    let Contests = [];

    let query = `select * from NyZaKa.contest;`;
    connection.query(query, async (error, results, fields) => {

        if (error) res.send(error);

        if (results.length == 0)
            res.render('contests', { user: req.user, Current_Nav: 'contests', Contests });
        
        results.forEach((element, index) => {
            let query2 = `select COUNT(*) AS Problems_Count FROM Contest_Problems WHERE Contest_ID = ${element.Contest_ID};`;
            connection.query(query2, (err, result, ff) => {
                if (err) res.send(err);
                let Num_Problems = result[0].Problems_Count;

                let Contest = {
                    ID: element.Contest_ID,
                    Day: element.Day_.toLocaleDateString("en-US").split("-"),
                    Hour: element.Hour_,
                    Duration: element.Duration,
                    Num_Problems
                }
                Contests.push(Contest);
                // console.log(arrArticles);
                if (index === results.length - 1)
                    res.render('contests', { user: req.user, Current_Nav: 'contests', Contests });
            });
        });


    });



})
router.get('/Contest/:id', verify, (req, res) => {
    let token = req.user;

    let query1 = `SELECT * FROM nyzaka.contest_problems WHERE Contest_ID=${req.params.id}`;
    connection.query(query1, (error, results, fields) => {
        if (error) throw error;
        let All_Problems = [];
        results.forEach((contest_problem, index) => {
            let problemquery = `select * from Nyzaka.problem where problem_ID = ${contest_problem.Problem_ID};`
            connection.query(problemquery, (error2, problem_row) => {
                if (error2) res.send(error2);
                    let SingleProblem = {
                        Name: problem_row[0].NameProblem,
                        statement: problem_row[0].statment,
                        ID: problem_row[0].Problem_ID
                    };
                    All_Problems.push(SingleProblem);
                if (index === results.length - 1) {
                    res.render('contest', { user: req.user, Current_Nav: 'contests', All_Problems, ContestID: req.params.id });
                }
            });
        });
    });

});

router.get('/createcontest', verify, (req, res) => {
    let token = req.user;
    if ( !req.user||token.user.Acsess == "student")
        res.status(403).send("access denied");
    res.render('createcontest_problemsnum', { user: req.user, Current_Nav: 'contests' });
});

let ProblemsNumber;
let startdate, starttime, duration;
router.post('/createcontest', verify, (req, res) => {
    let token = req.user;
    var posttype = req.body.vote;
    if (posttype == "Next") {
        ProblemsNumber = req.body.NumProblems;
        startdate = req.body.startdate;
        starttime = req.body.starttime;
        duration = req.body.duration;
        res.render('createcontest_problems', { user: req.user, Current_Nav: 'contests', ProblemsNumber });
    }
    else if (posttype == "Submit") {

        let i = -1;
        let abbas = [];
        for (prop in req.body) {
            i++;
            abbas.push(req.body[prop]);
        }
        let Problemsquery = `INSERT INTO NyZaKa.Problem (NameProblem, statment, Input_Format, Output_Format, Sample_Input, Sample_Output, input, output, Topic, score, difficulty, writer)values`;
        for (let j = 0; j < i / 11; j++) {
            Problemsquery += `('${abbas[0 + j * 11]}', '${abbas[1 + j * 11]}', '${abbas[2 + j * 11]}', '${abbas[3 + j * 11]}', '${abbas[4 + j * 11]}', '${abbas[5 + j * 11]}', '${abbas[6 + j * 11]}', '${abbas[7 + j * 11]}', '${abbas[8 + j * 11]}', '${abbas[9 + j * 11]}', '${abbas[10 + j * 11]}', '${token.user.Handle}')`;
            if (j == i / 11 - 1) Problemsquery += ";";
            else Problemsquery += ",";
        }
        connection.query(Problemsquery, async (error, resul, fields) => {
            if (error) res.send(error);
            let lastproblemid = `SELECT LAST_INSERT_ID() as problems_start_ID;`
            connection.query(lastproblemid, async (er, last_inserted_problems_start_index) => {
                if (er) res.send(er);
                let contestquery = `insert into NyZaKa.contest (Day_,Hour_,Duration) values('${startdate}','${starttime}','${duration}'); `;
                connection.query(contestquery, async (err, last_insert_contest, fields) => {
                    if (err) res.send(err);
                    let lastcontestid = `SELECT LAST_INSERT_ID() as Contest_ID;`;
                    connection.query(lastcontestid, async (error2, last_inserted_contest) => {
                        if (error2) res.send(error2);
                        let contest_problems = `insert into NyZaka.contest_problems (Contest_ID,Problem_ID) values`;
                        for (let k = 0; k < i / 11; k++) {
                            contest_problems += `(${last_inserted_contest[0].Contest_ID},${last_inserted_problems_start_index[0].problems_start_ID + k})`;
                            if (k == i / 11 - 1) contest_problems += ";";
                            else contest_problems += ",";
                        }
                        connection.query(contest_problems, async (error3, Last_Query) => {
                            if (error3) res.send(error3);
                            res.send("contest added successfully");
                        });
                    });

                });
            });

        });
    }
});

router.get('/Contest/:id/standing' , verify , (req,res) => {
    let token = req.user;
    let StandingQuery = `SELECT * FROM nyzaka.participate where contest_id = ${req.params.id} order by score desc;`;
    connection.query(StandingQuery , (error,standing) =>{
        if(error)   res.send(error);
        res.render('conteststanding', { user: req.user, Current_Nav: 'contests' , standing});
    });
});




module.exports = router;