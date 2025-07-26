const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const user=require("./user.js");
let reviewSchema=new Schema({
    comment:{
        type:String
    },
    rating:{
        type:Number,
        min:0,
        max:5

    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }

    
})
module.exports=mongoose.model("Review",reviewSchema);