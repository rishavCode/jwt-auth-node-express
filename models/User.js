const mongoose =require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')

const Schema =mongoose.Schema

const Usershema=new Schema({
    email:{
        type:String,
        required:[true,'please enter a email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please enter a valid email'],  //custom validator takes a array inside that we pass a function with 
                                                            //custom message here we are using npm validator package .
                                          
    },
    password:{
        type:String,
        required:[true,'please enter a password'],
        minlength:[6,'minimum password length is 6 character'] 
        
    }
})

//fire a function after doc saved to db
Usershema.post('save',function(doc,next){    // hook->post mongoose middleware are executed after the hooked method and all of its pre middleware have completed
    console.log(`new user was created & saved`,doc);
    next()
})
//fire a function before doc saved to db   //Pre middleware functions are executed one after another, when each middleware calls next.
Usershema.pre('save',async function(next){
const salt=await bcrypt.genSalt(); 
this.password=await bcrypt.hash(this.password,salt)
    //console.log(`user about to be created & saved`,this); //this refers to instance of the user we are not using arrow method because this is undefined
next()                                                 // user.save() ,user.create() -class refrence of this    
})
 //note--> functionality of middleware hook execution phase[pre >> post] 1st pre will complete i.e data is about to store in db post data is saved in db 
//why we are using middleware hook 
//to hash the password before savving to the database

//static method of user model
Usershema.statics.login= async function(email,password){
const user =await this.findOne({email})
if(user){
   const auth= await bcrypt.compare(password,user.password)
   if(auth){
    return user
   }
 throw Error('incorrect password')
} 
throw Error('incorrect Email')
 }

module.exports=mongoose.model('user',Usershema)