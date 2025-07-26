const listing=require("./models/listing.js");
const Review=require('./models/review.js')
const ExpressError=require('./utils/expressError.js')
const {listingSchema}=require("./schema.js")
const {reviewSchema}=require("./schema.js")
module.exports.loggedIn= async(req,res,next)=>{

    if(! req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","You must be logged in !");
        return res.redirect("/login");
    }
    next();
}
module.exports.savedUrl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next()
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let newlisting=await listing.findById(id);
    if(!newlisting.owner._id.equals(res.locals.CurrUser._id)){
        req.flash("error","you are not the owner of Listing!");
        return res.redirect(`/listings/${id}`);

    }
    next();
}
module.exports.isAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let newReview=await Review.findById(reviewId);
    if(!newReview.author._id.equals(res.locals.CurrUser._id)){
        req.flash("error","you are not the owner of this Review!");
        return res.redirect(`/listings/${id}`);

    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
     let {error} =listingSchema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(',');

    throw new ExpressError(400,errmsg);
   }
   else{
    next();
   }
}
module.exports.validateReview=(req,res,next)=>{
     let {error} =reviewSchema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(',');

    throw new ExpressError(400,errmsg);
   }
   else{
    next();
   }
}
module.exports.countries=async(req,res,next)=>{
 try {
    const allCountries = await listing.distinct("country");
    res.locals.allCountries = allCountries;
    next();
  } catch (err) {
    console.error("Error fetching distinct countries:", err.message);
    res.locals.allCountries = [];
    next();
  }



}

