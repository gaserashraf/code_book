const router = require('express').Router();
const verify=require('./verifiyToken');
const connection=require('./server');
router.get('/articles',verify,(req,res)=>{
    let token = req.user;
    let arrArticles=[];
    
    let query =`select * from NyZaKa.Articles;`;
     connection.query(query,  async (error, results, fields)=> {
        if (error) res.send(error);
        //res.render('/Blogs'); 
        
        results.forEach(element => {
            let article={
                ID:element.ID,
                ArtName:element.ArtName,
                Topic:element.Topic,
                Statment:element.Statment,
                Art_date:element.Art_date.toLocaleDateString("en-US").split("-")
            }
            arrArticles.push(article);
        });
       // console.log(arrArticles);
       let arrTopics=[];
       let getTopic=`select DISTINCT Topic from NyZaKa.Articles`
       connection.query(getTopic,  async (error, results, fields)=> {
            if (error) res.send(error);
            if(results.length!=0)
            {
                results.forEach(t=>{
                    arrTopics.push(t.Topic);
                });
            }
            //console.log(arrTopics);
            res.render('articles',{user:req.user,arrTopics, Current_Nav:'articles',articles:arrArticles});
       });
        
    });
    
});
router.get('/article',verify,(req,res)=>{
    let token = req.user;
    
        res.render('article',{user:req.user, Current_Nav:'articles'});
    
    
});
router.get('/articles/:id',verify,(req,res)=>{
    let token = req.user;


    let query=`SELECT * FROM NyZaKa.Articles WHERE id=${req.params.id}`;
    //console.log(req.params.id);
    connection.query(query,  (error, results, fields)=> {
        if (error) throw error;
        //res.render('/Blogs'); 
        //console.log(results.length)
        if(!results.length)
            res.render('404',{user:req.user, Current_Nav:'__'});
        else
        {
            let article={
                ID:results[0].ID,
                ArtName:results[0].ArtName,
                Topic:results[0].Topic,
                Statment:results[0].Statment,
                Art_date:results[0].Art_date.toLocaleDateString("en-US").split("-"),
                Writer:results[0].Writer
            }
                //console.log(req.user.user.Handle);
                //console.log(results[0].Writer);
            res.render('article',{user:req.user, Current_Nav:'articles',article:article});
        }
    });

});
router.get('/articles/edit/:id',verify,(req,res)=>{
    if(!req.user||req.user.user.Acsess=="student")
        res.status(403).send("access denied");
    let token = req.user;
    let query=`SELECT * FROM NyZaKa.Articles WHERE id=${req.params.id}`;
    connection.query(query,  (error, results, fields)=> {
        if (error) throw error;
        //res.render('/Blogs'); 
        if(!results.length)
            res.render('404',{user:req.user, Current_Nav:'__'});
        else{
            let article={
                ID:results[0].ID,
                ArtName:results[0].ArtName,
                Topic:results[0].Topic,
                Statment:results[0].Statment,
                Art_date:results[0].Art_date.toLocaleDateString("en-US").split("-"),
                Writer:results[0].Writer
            }
        
            res.render('editarticle',{user:req.user, Current_Nav:'articles',article:article});
        }
    });
});
router.post('/articles/edit/:id',verify,(req,res)=>{
    let token = req.user;
    if(!req.user||token.user.Acsess=="student")
        res.status(403).send("access denied");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let article={
        id:parseInt(req.params.id),
        name: req.body.title,
        Topic:req.body.Topic,
        body:req.body.body,
        date:new Date().toISOString().slice(0, 19).replace('T', ' '),
        writer:token.user.Handle
    };
    let query =`update NyZaKa.Articles set ArtName='${article.name}', Topic='${article.Topic}' ,Statment='${article.body}', Art_date='${article.date}' where ID=${article.id};`;
    connection.query(query,  async(error, results, fields)=> {
        if (error) res.send(error);
        res.redirect(`/articles`);
    });
    //res.render('createarticle',{user:req.user, Current_Nav:'articles'});
});
router.delete('/articles/:id',verify,(req,res)=>{
    let token = req.user;
    let query=`DELETE FROM NyZaKa.Articles WHERE id=${parseInt(req.params.id)}`;
    connection.query(query,  (error, results, fields)=> {
        if (error) throw error;
        /*if(!results.length)
            res.render('404',{user:req.user, Current_Nav:'__'});
        else
        {
        }*/
        res.json({redirect:'/articles'});
    });
});

router.get('/createarticle',verify,(req,res)=>{
    let token = req.user;
    if(!req.user||token.user.Acsess=="student")
        res.status(403).send("access denied");
    res.render('createarticle',{user:req.user, Current_Nav:'articles'});
});
router.post('/createarticle',verify,(req,res)=>{
    let token = req.user;
    if(!req.user||token.user.Acsess=="student")
        res.status(403).send("access denied");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let article={

        name: req.body.title,
        Topic:req.body.Topic,
        body:req.body.body,
        date:new Date().toISOString().slice(0, 19).replace('T', ' '),
        writer:token.user.Handle
    };
    console.log(article);
    let query =`insert into NyZaKa.Articles(ArtName,Topic,Statment,Art_date,Writer) values("${article.name}","${article.Topic}","${article.body}","${article.date}","${article.writer}");`;
    connection.query(query,  async(error, results, fields)=> {
        if (error) res.send(error);
        //res.render('/Blogs'); 
        //res.redirect('/articles');
        res.send("Articles added successfully");
    });
    //res.render('createarticle',{user:req.user, Current_Nav:'articles'});
});


router.get('/articles/Topics/:topic',verify,(req,res)=>{
    let token = req.user;



    let query=`SELECT * FROM NyZaKa.Articles WHERE Topic='${req.params.topic}'`;
    let arrArticles=[];
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
                let article={
                    ID:element.ID,
                    ArtName:element.ArtName,
                    Topic:element.Topic,
                    Statment:element.Statment,
                    Art_date:element.Art_date.toLocaleDateString("en-US").split("-")
                }
                arrArticles.push(article);
            });
                
            let arrTopics=[];
            let getTopic=`select DISTINCT Topic from NyZaKa.Articles`
            connection.query(getTopic,  async (error, results, fields)=> {
                 if (error) res.send(error);
                 if(results.length!=0)
                 {
                     results.forEach(t=>{
                         arrTopics.push(t.Topic);
                     });
                 }
                 //console.log(arrTopics);
                 res.render('articles',{user:req.user,arrTopics, Current_Nav:'articles',articles:arrArticles});
            });
            

        }
    });

});

module.exports = router;