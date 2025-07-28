require('dotenv').config();
const listing=require("./models/listing.js");
const express=require('express');
const app=express()
const mongoose=require('mongoose');
const port=8080;
const path=require('path');
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js"); 
const usersRouter=require("./routes/user.js");
const middleware=require("./middleware.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local')
const user=require("./models/user.js");
const { env } = require('process');
const secretcode=process.env.SECRET_CODE;
const dburl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:secretcode
    },
    touchAfter:24*3600,
})
const sessionOptions={
    store,
    secret:secretcode,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(flash());
app.use(session(sessionOptions));
ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodOverrirde=require('method-override');
const ExpressError = require('./utils/expressError.js');

app.use(methodOverrirde('_method'));
app.use(express.static(path.join(__dirname,'public')));
main().then(()=>{
    console.log("db connected");
})
.catch(err => console.log(err));
// mongourl=mongodb://127.0.0.1:27017/snugspot

async function main() {
  await mongoose.connect(dburl);
  

}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(async(req,res,next)=>{
   
    res.locals.success=req.flash('success');
    res.locals.error=req.flash("error");
    res.locals.CurrUser=req.user;

    next();
})
app.use(middleware.countries);
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter)
app.get('/', (req, res) => {
  res.redirect('/listings');
});
app.use("",(req,res,next)=>
{   

    next( new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>
{   
    let {statusCode=500,message}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
})

app.listen(port,()=>{
    console.log('listening at',port);
}) 