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
        minLength:14,
        maxLength:25,
        unique:true
    },
    password:{
        type:String,
        required:[true,"enter password"],
        minLength:8,
        
    }
},{timestamps:true})
module.exports=mongoose.model('Users',userSchema);