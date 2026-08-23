const User=require('../model/userModel');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const signUp=async (req,res)=>{
   try{
    const {firstName,lastName,email,password,confirmPassword}=req.body;
   if(!firstName || !lastName || !email || !password || !confirmPassword){
   return res.status(400).json({
        success:false,
        message:"please insert all fields."
    })
   }
   if(password.length >14 ){
        return res.status(400).json({
        success:false,
        message:"password length must not exceed 14."
    })
   }
   if(password!==confirmPassword){
    return res.status(400).json({
        success:false,
        message:"password miss match."
    })
   }
   if(password.length<8){
    return res.status(400).json({
        success:false,
        message:"password must be more than or equal to 8."
    })
   }
   const userExist=await User.findOne({email});
   if(userExist){
    return res.status(400).json({
        success:false,
        message:"user already exist."
    })
   }
   const hashedPassword=await bcrypt.hash(password,10);
   console.log(hashedPassword.length)
   const user=await User.create({
    firstName:firstName,
    lastName:lastName,
    email:email,
    password:hashedPassword
   });
   if(user){
   return res.status(201).json({
    success:true,
    message:"user is created successfully.",
    token:generateToken(user._id)

   });
}else{
    return res.status(400).json({
    success:true,
    message:"invalid user data"
   });
}
}catch(e){
    return res.status(500).json({
        success:false,
        message:e.message
    })
}
}
const login=async (req,res)=>{
try{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"please fill the fields."
        })
    }
    const user=await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        return res.status(200).json({
            success:true,
            message:"user loged in successfully.",
            token:generateToken(user._id)
        })
    }else{
        return res.status(401).json({
            success:false,
            message:"invalid credentials."
        })
    }
}catch(e){
    return res.status(500).json({
            success:false,
            message:e.message
        })
}
}
const verifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified.",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
const resetPassword = async (req, res) => {
  const {
    email,
    password,
    confirmPassword,
  } = req.body;

  try {
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
const generateToken=(id)=>{
   return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'1h'
    })
}
const sendData=(req,res)=>{
    return res.json({
        success:true,
        message:"hi there"
    })
}
module.exports={
    signUp,
    login,
    sendData,
    resetPassword,
    verifyEmail
}
