const express = require('express');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');


const authroute=require('./routes/authRoutes');
const { requireAuth,checkUser } = require('./middleware/authmiddleware');


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');



// database connection
const dbURI = 'mongodb+srv://singhrishavkumar7:R2lE73zhchTpGBnz@cluster0.ojnw1sa.mongodb.net/node-auth';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(5000,()=>{
  console.log(`up and running`);
  }))

  .catch((err) => console.log(err));

// routes
 app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authroute)

app.get('/set-cookies',(req,res)=>{
res.cookie('newUser',false)
res.cookie('isEmployee',true,{maxAge:1000*60*60*24,httpOnly:true}) //10000 ml* 60 sec=1min*60 =60 min 60*24->one day
res.send('you got the cookie!')
})

app.get('/read-cookie',(req,res)=>{
  const cookie=req.cookies
  console.log(cookie);
  res.json(cookie)
})