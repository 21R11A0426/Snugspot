const express=require('express');
const router=express.Router();
const user=require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport=require("passport");
const {savedUrl,returnTo}=require("../middleware.js");
//user get route
router.get('/signup',(req,res)=>{
    res.render("./users/signup.ejs");

})

//user post route
router.post('/signup',wrapAsync(async (req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new user({ username,email })
    const registereduser=await user.register(newuser,password);
    req.logIn(registereduser,(error)=>{
        if(error){
            return next(error);
        }
        req.flash("success","Welcome to Snugspot");
        
    res.redirect("/listings");
    })
    
    }
    catch(error){
   
     req.flash("error",`${error.message}`);
     res.redirect("/signup");
    };

}));
//login get route
router.get("/login",(req,res)=>{
  
    res.render("./users/login.ejs");
})

//login post route
router.post("/login",savedUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to Snugspot");

    const redirecturl=res.locals.redirecturl || "/listings"
    res.redirect(redirecturl);
})

//logout get route
router.get("/logout",(req,res,next)=>{
    req.logOut((error)=>{
        if(error){
        return next(error);}
 
    req.flash("success","You succesfully logged out!");
    res.redirect("/listings");   })
})
module.exports=router;