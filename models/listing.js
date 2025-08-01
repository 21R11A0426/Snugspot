const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");
const user=require("./user.js");
let listingSchema=new Schema({
    title:
    {
        type:String,
        required:true,
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
    },
    country:{
        type:String
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    },],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    geometry:{
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
    
});
listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const listing=new mongoose.model('listing',listingSchema);
module.exports=listing;