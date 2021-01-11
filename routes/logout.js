const router = require('express').Router();
const connection=require('./server');
router.get('/logout',(req,res)=>{
    res.clearCookie("token");
    res.render("homepage2",{user:req.user, Current_Nav: 'Home'});
});

module.exports = router;