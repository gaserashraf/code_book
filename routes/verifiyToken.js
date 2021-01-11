const jwt=require('jsonwebtoken');
module.exports =function(req,res,next)
{
    const token = req.cookies.token || '';
    //console.log(token);
    if(token){
        try{
            const verfied=jwt.verify(token,"1234");
            req.user=verfied;
            //console.log(req.user);
            next();
        } catch(err){
            res.status(400).send('invalid token');
        }
    }
    else
        next();

}
