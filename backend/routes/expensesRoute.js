const express = require("express");

const router = express.Router();

const {
  addExpenses,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getRecentExpenses
} = require("../controller/expenseController");

const {protect}=require('../middleware/authMiddleware')
router.post("/add", protect, addExpenses);

router.get("/recent", protect, getRecentExpenses);

router.get("/", protect, getExpenses);

router.get("/:id", protect, getExpenseById);

router.put("/:id", protect, updateExpense);

router.delete("/:id", protect, deleteExpense);

module.exports = router;