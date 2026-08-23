const mongoose=require('mongoose');
const userSchema = require('./userModel');

const expensesSchema=new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true
  },
  title:{
        type:String,
        required:[true,"enter title of expense"],
        minLength:4,
        maxLength:25,
        trim:true
  },
  amount:{
    type:Number,
    min:1,
    required:true
  },
  category:{
  type: String,
  required: true,
  enum: [
    "Food",
    "Transport",
    "Education",
    "Entertainment",
    "Bills",
    "Shopping",
    "Health",
    "Other"
  ]
},
  description:{
    type:String,
    maxLength:50,
    trim:true
  },
  date:{
    type:Date,
    default:Date.now
  }
},{
  timestamps:true
})
module.exports=mongoose.model('Expenses',expensesSchema);