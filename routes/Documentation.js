const router = require('express').Router();
const verify=require('./verifiyToken');
const connection=require('./server');
router.get('/documentations',verify,(req,res)=>{
    let token = req.user;
    let arrDocumentation=[];
    
    let query =`select * from NyZaKa.Documentation;`;
     connection.query(query,  async (error, results, fields)=> {
        if (error) res.send(error);
        //res.render('/Blogs'); 
        
        results.forEach(element => {
            let documentation={
                ID:element.ID,
                DocName:element.DocName,
                Topic:element.Topic,
                Statment:element.Statment,
                Doc_date:element.Doc_date.toLocaleDateString("en-US").split("-")
            }
            arrDocumentation.push(documentation);
        });
        let arrTopics=[];
       let getTopic=`select DISTINCT Topic from NyZaKa.Documentation`
       connection.query(getTopic,  async (error, results, fields)=> {
            if (error) res.send(error);
            if(results.length!=0)
            {
                results.forEach(t=>{
                    arrTopics.push(t.Topic);
                });
            }
            res.render('documentations',{user:req.user,arrTopics, Current_Nav:'Documentation',documentations:arrDocumentation});
       });
       // console.log(arrArticles);
        
    });
    
});

router.get('/Documentation/:id',verify,(req,res)=>{
    let token = req.user;


    let query=`SELECT * FROM NyZaKa.Documentation WHERE id=${req.params.id}`;
    connection.query(query,  (error, results, fields)=> {
        if (error) throw error;
        //res.render('/Blogs'); 
        if(!results.length)
            res.render('404',{user:req.user, Current_Nav:'__'});
        else{
            let documentation={
                ID:results[0].ID,
                DocName:results[0].DocName,
                Topic:results[0].Topic,
                Statment:results[0].Statment,
                Doc_date:results[0].Doc_date.toLocaleDateString("en-US").split("-"),
                Writer:results[0].Writer
            }
        
            res.render('Documentation',{user:req.user, Current_Nav:'Documentation',documentation:documentation});
        }
    });
});

router.delete('/Documentation/:id',verify,(req,res)=>{
    let token = req.user;
    let query=`DELETE FROM NyZaKa.Documentation WHERE id=${parseInt(req.params.id)}`;
    connection.query(query,  (error, results, fields)=> {
        if (error) throw error;
        res.json({redirect:'/documentations'});
    });
});

router.get('/Documentation/edit/:id',verify,(req,res)=>{
    let token = req.user;
    let query=`SELECT * FROM NyZaKa.Documentation WHERE id=${req.params.id}`;
    connection.query(query,  (error, results, fields)=> {
        if (error) throw error;
        //res.render('/Blogs'); 
        if(!results.length)
            res.render('404',{user:req.user, Current_Nav:'__'});
        else{
            let documentation={
                ID:results[0].ID,
                DocName:results[0].DocName,
                Topic:results[0].Topic,
                Statment:results[0].Statment,
                Doc_date:results[0].Doc_date.toLocaleDateString("en-US").split("-"),
                Writer:results[0].Writer
            }
        
            res.render('editdocumentation',{user:req.user, Current_Nav:'Documentation',documentation:documentation});
        }
    });
});
router.post('/Documentation/edit/:id',verify,(req,res)=>{
    let token = req.user;
    if(!req.user||token.user.Acsess=="student")
        res.status(403).send("access denied");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let documentation={
        id:parseInt(req.params.id),
        name: req.body.title,
        Topic:req.body.Topic,
        body:req.body.body,
        date:new Date().toISOString().slice(0, 19).replace('T', ' '),
        writer:token.user.Handle
    };
    let query =`update NyZaKa.Documentation set DocName='${documentation.name}', Topic='${documentation.Topic}' ,Statment='${documentation.body}', Doc_date='${documentation.date}' where ID=${documentation.id};`;
    connection.query(query,  async(error, results, fields)=> {
        if (error) res.send(error);
        res.redirect(`/documentations`);
    });
    //res.render('createarticle',{user:req.user, Current_Nav:'articles'});
});
router.get('/createdocumentation',verify,(req,res)=>{
    let token = req.user;
    if(!req.user||token.user.Acsess=="student")
        res.status(403).send("access denied");
    res.render('createdocumentation',{user:req.user, Current_Nav:'Documentation'});
});
router.post('/createdocumentation',verify,(req,res)=>{
    let token = req.user;
    if(!req.user||token.user.Acsess=="student")
        res.status(403).send("access denied");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let documentation={
        name: req.body.title,
        Topic:req.body.Topic,
        body:req.body.body,
        date:new Date().toISOString().slice(0, 19).replace('T', ' '),
        writer:token.user.Handle
    };
    let query =`insert into NyZaKa.Documentation(DocName,Topic,Statment,Doc_date,Writer) values("${documentation.name}","${documentation.Topic}","${documentation.body}","${documentation.date}","${documentation.writer}");`;
    connection.query(query,  async(error, results, fields)=> {
        if (error) res.send(error);
        //res.render('/Blogs'); 
        //res.redirect('/documentations');
        res.send("documentation added successfully");
    });
    //res.render('createarticle',{user:req.user, Current_Nav:'articles'});
});
router.get('/documentations/Topics/:topic',verify,(req,res)=>{
    let token = req.user;
    let query=`SELECT * FROM NyZaKa.Documentation WHERE Topic='${req.params.topic}'`;
    let arrDocumentation=[];
    //console.log(req.params.id);
    connection.query(query,  (error, results, fields)=> {
        if (error) throw error;
        //res.render('/Blogs'); 
        //console.log(results.length)
        if(!results.length)
            res.render('404',{user:req.user, Current_Nav:'__'});
        else
        {
            results.forEach(element => {
                let documentation={
                    ID:element.ID,
                    DocName:element.DocName,
                    Topic:element.Topic,
                    Statment:element.Statment,
                    Doc_date:element.Doc_date.toLocaleDateString("en-US").split("-")
                }
                arrDocumentation.push(documentation);
            });
                
            let arrTopics=[];
            let getTopic=`select DISTINCT Topic from NyZaKa.Documentation`
            connection.query(getTopic,  async (error, results, fields)=> {
                 if (error) res.send(error);
                 if(results.length!=0)
                 {
                     results.forEach(t=>{
                         arrTopics.push(t.Topic);
                     });
                 }
                 //console.log(arrTopics);
                 res.render('documentations',{user:req.user,arrTopics, Current_Nav:'Documentation',documentations:arrDocumentation});
            });
            

        }
    });

});
module.exports = router;