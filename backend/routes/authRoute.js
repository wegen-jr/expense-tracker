const express=require('express');
const {signUp,login, verifyEmail, resetPassword}=require('../controller/authController')
const router=express.Router();


router.post('/signUp',signUp);
router.post('/login',login);
router.put('/reset-password',resetPassword);
router.post('/verify-email',verifyEmail);


module.exports=router;