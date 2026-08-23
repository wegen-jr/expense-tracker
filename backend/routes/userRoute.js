const express=require('express');
const router=express.Router();
const {protect}=require('../middleware/authMiddleware');
const {getProfile, updateProfile}=require('../controller/userController')

router.get('/profile',protect,getProfile);
router.put('/update',protect,updateProfile);

module.exports=router;