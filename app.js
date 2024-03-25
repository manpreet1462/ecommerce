//WHAT TO DO IN THIS ECOMMERCE->
//1.BASIC SERVER 
//2.MONGOOSE CONNECTION
//3.MODEL -> SEED DATA
//4.ROUTES-> VIEWS
//5.RATING SCHEMA->PRODUCT CHANGE-> form to add the rating and comment (show.ejs)
//
//
const express=require('express')
const app=express();
const productRoutes=require('./routes/product')
const reviewRoute= require('./routes/review')
const authRoute= require('./routes/auth')
const cartRoute= require('./routes/cart')
const path=require('path')
const mongoose = require('mongoose');
const seedDB=require('./seed')
const methodOverride = require('method-override')
const flash = require('connect-flash');
const productApi=require('./routes/api/product-api')  //API
const session = require('express-session');
const passport = require('passport');    //passport
const LocalStrategy = require('passport-local');     //passport
const User = require('./models/User');     //passport
const dotenv=require('dotenv').config();
let configSession={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    }
}

let url='mongodb+srv://manpreet274:1234@cluster0.z4ysecm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(url)
.then(()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log("error is:",err)
});



//middleware for post request of adding a new product
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
// app.use(express.cookieParser('hee'))
app.use(session(configSession))
app.use(flash())     //flash hamesha baad mei hoga because flash is dependent on session 
let {Schema}=mongoose;
// seedDB()                //to comment it after using once if not it will run again and again due to nodemon 

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))


app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


app.get('/',(req,res)=>{
    res.render("home");
})
    
app.use(authRoute)  
app.use(productRoutes)
app.use(reviewRoute)
app.use(productApi);
app.use(cartRoute);

// use static serialize and deserialize of model for passport session support

passport.serializeUser(User.serializeUser());  //passport
passport.deserializeUser(User.deserializeUser());  //passport

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));  //passport



// const port = process.env.PORT 

app.listen(7000 , () => {
  console.log(`Successfully listening at port 7000`);
});