const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"enter name"],
        minLength:4,
        maxLength:15
    },
    lastName:{
        type:String,
        required:[true,"enter last name"],
        minLength:4,
        maxLength:15
    },
    email:{
        type:String,
        required:[true,"enter email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"enter password"],
        minLength:8,
        
    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    OTP:{
        type:Number
    },
    OTP_expiry:{
        type:Date
    }
},{timestamps:true})
module.exports=mongoose.model('Users',userSchema);