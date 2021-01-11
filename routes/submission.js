const router = require('express').Router();
const verify = require('./verifiyToken');
const connection = require('./server');

router.post('/problems/:id', verify, (req, res) => {
    if (!req.user)
        res.status(403).send("Access Denied");
    else {
        let submissionstatus = "Rejected";
        let outputquery = `select output,score from nyzaka.problem where problem_ID = ${req.params.id};`;
        connection.query(outputquery, (error, problemoutput) => {
            if (error) res.send(error);

            if (req.body.output == problemoutput[0].output)
                submissionstatus = "Accepted";

            let thisproblemscore = 0;
            if (submissionstatus == "Accepted")
                thisproblemscore = problemoutput[0].score;


            let submissionquery = `insert into nyzaka.submissions(problem_id,user_,time_ , output, submission_status) values 
                (${req.params.id},'${req.user.user.Handle}',now(),'${req.body.output}','${submissionstatus}');`;
            connection.query(submissionquery, (error2, results) => {
                if (error2) res.send(error2);
                connection.query(`select contest_id from nyzaka.contest_problems where problem_id = ${req.params.id};`, (error3, contestrow) => {
                    if (error3) res.send(error3);
                    if (!contestrow[0])  //problem not in contest
                        res.send(submissionstatus);

                    else // problem in contest
                    {
                        connection.query(`SELECT *  FROM nyzaka.participate where contest_id = ${contestrow[0].contest_id} and participant = '${req.user.user.Handle}';`, (error4, participationrow) => {
                            if (error4) res.send(error4);

                            if (!participationrow[0])   //user didn't participate before
                            {
                                connection.query(`insert into nyzaka.participate values(${contestrow[0].contest_id},'${req.user.user.Handle}',${thisproblemscore});`, (error5, resulltt) => {
                                    if (error5) res.send(error5);
                                    res.send(`${submissionstatus} .. your score in contest #${contestrow[0].contest_id} become ${thisproblemscore}`);
                                })
                            }

                            else //user participated before 

                            {
                                if (submissionstatus == "Accepted"){
                                    connection.query(`select count(*) as numsubmissions from nyzaka.submissions where problem_id = ${req.params.id} and user_ = '${req.user.user.Handle}' and Submission_Status = 'Accepted';`
                                    , (error6,usersubmissions) => {
                                        if(error6)  res.send(error6);

                                        if (usersubmissions[0].numsubmissions == 1){    //user didn't solve the problem before
                                            connection.query(`update nyzaka.participate set score = score + ${thisproblemscore} where contest_id = ${contestrow[0].contest_id} and participant = '${req.user.user.Handle}'; `
                                            , (error7,abbbb)=>{
                                                if(error7)  res.send(error7);

                                                res.send(`${submissionstatus} .. your score in contest #${contestrow[0].contest_id} become ${participationrow[0].Score + thisproblemscore}`);
                                            });
                                        }
                                        else {  //user solved the problem before
                                            res.send(`${submissionstatus} .. your score in contest #${contestrow[0].contest_id} become ${participationrow[0].Score}`);
                                        }

                                    });
                                }
                                else{
                                    res.send(`${submissionstatus} .. your score in contest #${contestrow[0].contest_id} become ${participationrow[0].Score}`);
                                }
                            }

                        });
                    }

                });

            });
        });
    }
});

router.get('/problems/:id/submissions', verify, (req, res) => {
    let query = `select nyzaka.submissions.*, nyzaka.problem.NameProblem from nyzaka.submissions join nyzaka.problem on  nyzaka.submissions.Problem_ID = nyzaka.problem.Problem_ID 
    where nyzaka.submissions.problem_ID = ${req.params.id}  order by Time_ desc ;`;
    connection.query(query, (error, results) => {
        if (error) res.send(error)
        let submissions = [];
        for (let i = 0; i < results.length; i++) {
            let submission = {
                ID: results[i].ID,
                Problem_ID: results[i].Problem_ID,
                Problem_Name: results[i].NameProblem,
                User: results[i].User_,
                Day: results[i].Time_.toISOString().split('T')[0],
                Time: results[i].Time_.toTimeString().split(' ')[0],
                output: results[i].Output,
                status: results[i].Submission_Status
            };
            submissions.push(submission);
        }
        res.render('problemsubmissions', { user: req.user, Current_Nav: 'problemset', submissions });
    })
});

module.exports = router;