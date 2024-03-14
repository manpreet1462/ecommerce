const mongoose=require('mongoose')
const ReviewSchema= new mongoose.Schema({
    rating:{
        type:Number,
        min:0,
        max:5
    },
    comment:{
        type:String,
        trim:true
    }
},{timestamps:true})


//model/collection-->Js class --> objects/documents
//modelname should be  --> singular and capital letter
let Review=mongoose.model("Review",ReviewSchema)
module.exports=Review



