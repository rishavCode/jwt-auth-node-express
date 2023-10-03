const User=require('../models/User')
const jwt=require('jsonwebtoken')
//hanlde error
const handleErrors=(err)=>{
    console.log(err.message,err.code);
    let errors={email:'',password:''}

    //incorrect email
    if(err.message===`incorrect Email`){
        errors.email=`that email is not registered`
    }
  //incorrect password
  if(err.message===`incorrect password`){
    errors.password=`that password is incorrect`
}


    //Duplicate error code 
    if(err.code===11000){
        errors.email='Email already registered';
        return errors
    }

    //validation errors                               // log error ko dekh kr design krna h 
    if(err.message.includes('user validation failed')){ //inside error object we have errors properties 
        Object.values(err.errors).forEach(({properties})=>{//for fetching the property of errors [key:value]
           errors[properties.path]=properties.message                         //we have to values of that errors propery 
        });
    }
    return errors
}
const maxAge=3*24*60*60 ; //3 days in seconds it takes args in second
const createToken=(id)=>{
    return jwt.sign({id},'rishav secret',{
        expiresIn:maxAge
    })
}



exports.getSigup=(req,res)=>{
    res.render('signup');
}
exports.getLogin=(req,res)=>{
    res.render('login');
}
exports.postSignup=(req,res)=>{
    const email=req.body.email
    const  password=req.body.password
    const user=new User({
        email:email,
        password:password,
     })
   
   user.save()
   .then((result)=>{
    //console.log(result);
  //})
   const token=createToken(user._id)
   res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000}) //creating cookie to store jwt
   res.status(201).json({ user: user._id })
})
   .catch((err)=>{
   const errors= handleErrors(err)
    res.status(400).json({errors})
   
   })
}

exports.postLogin=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.login(email,password)
        const token=createToken(user._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
        res.status(200).json({user:user._id})    
    }
    catch(err){
        const errors= handleErrors(err)
        res.status(400).json({errors})
       

    }
}
exports.getLogout=(req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/')
}
