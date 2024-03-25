const express=require('express');
const User = require('../models/User');
const passport = require('passport');
const router=express.Router( )


// -------LOGOUT---------
router.get('/logout',(req,res)=>{
    try{
        req.logout(()=>{
            req.flash('success','logged out successfully');
        })
        res.redirect('/login')

    }
    catch(e){
        res.render('error',{err:e.message})
    }
   
})


//--------Signup--------------
router.get('/register',(req,res)=>{
    res.render('auth')
})
router.post('/register',async (req,res)=>{
    let {username,password,email,role,gender}=req.body;
    let user=new User({username,email,gender,role});    
    let newUser=await User.register(user,password);
    res.redirect('/login');
})


//---------LOGIN------------
router.get('/login',(req,res)=>
        res.render('login')
)


router.post('/login',  passport.authenticate('local', 
  { failureRedirect: '/login', 
  failureMessage: true }),
  function(req, res){
    req.flash('success',`Welcome back!! ${req.user.username}`)
    res.redirect('/products');
    
});


module.exports= router;