const router = require('express').Router();
const connection=require('./server');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const verifiyToken = require('./verifiyToken');
router.get('/login',verifiyToken,(req,res)=>{
    if(req.user)
        res.redirect('profile');
    res.render('login',{user:req.user,Current_Nav:'_'});
})
router.post('/login',async(req,res)=>{

    //1- check there are not exist email
    let user={"username":req.body.username,
              "email":req.body.email,
              };
              //console.log(req.body.inlineRadioOptions);
    let emailExist =`select * from NyZaKa.Users where Handle="${req.body.username}"`;
    connection.query(emailExist, async (error, results, fields)=> {
        if (error) res.send(error);
        //res.render('/Blogs'); 
        if(results[0])// if exist
        {
            let user=results[0];
            //TO DO
            // need validations here
          
            //compare password
            
            const isvaildpass=await bcrypt.compare(req.body.password,user.Password_);
            
            if(!isvaildpass&&req.body.password!=user.Password_)
                res.status(400).send("invalid password");
            else if(isvaildpass||req.body.password==user.Password_){
                //create token
                const token = jwt.sign({user},"1234");
                res.cookie('token', token, {
                    secure: false, // set to true if your using https
                    httpOnly: true,
                });
                //console.log(res.header('authorization'));
                res.send("login in success");
            }
        }
        else
            res.send("email doesn't exists please sign up");

    });    
});
module.exports = router;