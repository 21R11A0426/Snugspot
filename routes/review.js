const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/expressError.js')
const {validateReview,loggedIn,isAuthor, savedUrl}=require('../middleware.js');
const flash=require('connect-flash');
const listing=require('../models/listing.js');
const Review=require('../models/review.js')



// review 
// reviewpost route
router.post("/",loggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listings1=await listing.findById(req.params.id);
    let review1=new Review(req.body.review);
    review1.author=req.user._id;
    listings1.reviews.push(review1);
    if (!listings1.geometry || !listings1.geometry.type || !listings1.geometry.coordinates) {
        listings1.geometry = {
            type: "Point",
            coordinates: [78.4867, 17.3850] // Default to Hyderabad
        };
    }
   await listings1.save();
   await  review1.save();
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${req.params.id}`);
}))
//review delete route
router.delete("/:reviewId",loggedIn,savedUrl,isAuthor,async (req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
})
module.exports=router;