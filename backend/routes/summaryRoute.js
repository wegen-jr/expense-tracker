const express=require('express');
const router=express.Router();
const {protect}=require('../middleware/authMiddleware');
const { getDashboardSummary } = require('../controller/summaryController');

router.get('/',protect,getDashboardSummary);

module.exports=router;