const mongoose=require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');




const userSchema= new mongoose.Schema({
    //username and password will be handled by passport-local-mongoose so we dont add that here
    email:{
        type:String,
        trim:true,
        required:true
    },
    role:{
        type:String,
        default:'buyer'
    },
    gender:{
        type:String,
        trim:true,
        required:true
    }

})



userSchema.plugin(passportLocalMongoose); //always apply on schema


//model/collection-->Js class --> objects/documents
//modelname should be  --> singular and capital letter
let User=mongoose.model("User",userSchema)
module.exports=User;



