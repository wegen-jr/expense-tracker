const express=require('express');
const {signUp,login, verifyEmail, resetPassword,verifyOTP}=require('../controller/authController')
const router=express.Router();


router.post('/signup',signUp);
router.post('/login',login);
router.put('/reset-password',resetPassword);
router.post('/verify-email',verifyEmail);
router.post('/verify-OTP', verifyOTP);


module.exports=router;
