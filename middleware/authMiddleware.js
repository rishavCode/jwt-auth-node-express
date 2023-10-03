const jwt=require('jsonwebtoken');
const User = require('../models/User');
const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt

    //check jwt is exist & is  verfied
    if(token){
    jwt.verify(token,'rishav secret',(err,decodedToken)=>{
        if(err){
            console.log(err.message);
            res.redirect('/login')
        }else{
           // console.log(decodedToken);
            next()  //it will take us to the smoothe page 
        }
    })
    }
    else{
    res.redirect('/login')
    }
    
}
//check current user
const checkUser=(req,res,next)=>{
    const token=req.cookies.jwt
    if(token){
        jwt.verify(token,'rishav secret',async(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
               next()
            }else{
                //console.log(`decoded token`,decodedToken);
                let user =await User.findById(decodedToken.id);
                res.locals.user=user//res.locals is an object that is used to store data that is specific to the current request/response cycle.
                next()  
            }
        })
    }
     else{
        res.locals.user=null
        next()
    }
}


module.exports={requireAuth,checkUser}