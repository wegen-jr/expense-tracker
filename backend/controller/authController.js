const User=require('../model/userModel');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
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
    const generatedOTP=generateOTP();
    const OTPExpiresIn=new Date(Date.now() + 90*1000);  
    const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    OTP: generatedOTP,
    OTP_expiry: OTPExpiresIn    
});

console.log("USER CREATED");

if(user){
    const message = `Your OTP is ${generatedOTP}. It will expire in 90 seconds.`;
    const subject = "OTP Verification";

    console.log("ABOUT TO SEND EMAIL");

    await sendEmail(email, message, subject);

    console.log("EMAIL SENT");

    return res.status(201).json({
        success: true,
        message: "user is created successfully.",
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
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit OTP
}
const sendEmail = async (email, message, subject) => {
    console.log("Trying to send email...");

    const { data, error } = await resend.emails.send({
        from: "Expense Tracker <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        text: message
    });

    if (error) {
        console.error("RESEND ERROR:", error);
        throw new Error(error.message);
    }

    console.log("Email sent successfully");
    console.log("Resend ID:", data.id);
};
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
      if(!otp) {
          return res.status(400).json({
              success: false,
              message: " OTP is required.",
          });
      }
      if( typeof otp !== 'number' || otp < 100000 || otp > 999999) {
          return res.status(400).json({
              success: false,
              message: "OTP must be 6 digits number.",
          });
      }
      
      const user = await User.findOne({ email });

      if(!user) {
          return res.status(404).json({
              success: false,
              message: "No account found with this email.",
          });
      }
      
      if(user.OTP !== otp) {
          return res.status(400).json({
              success: false,
              message: "Invalid OTP.",
          });
      }

      if(user.OTP_expiry < new Date()) {
          return res.status(400).json({
              success: false,
              message: "OTP has expired.",
          });
      }
      user.emailVerified = true;
      user.OTP = null; 
      user.OTP_expiry = null; 
      await user.save();
      return res.status(200).json({
          success: true,
          message: "OTP verified successfully.",
      });
      
  }catch (e) {
      return res.status(500).json({
          success: false,
          message: e.message,
      });
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
      message: "Email authenticated.",
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
   return jwt.sign(
    {id},
    process.env.JWT_SECRET,
    {
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
    verifyEmail,
    verifyOTP
}
