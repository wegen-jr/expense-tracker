const Income = require("../model/incomeModel");
const Expenses = require("../model/expensesModel");
const mongoose = require("mongoose");

const getDashboardSummary = async (req, res) => {
  try {
const userId = new mongoose.Types.ObjectId(req.user.id);
    // -------------------------
    // TOTAL INCOME
    // -------------------------
    const incomeResult = await Income.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalIncome = incomeResult[0]?.total || 0;


    // -------------------------
    // TOTAL EXPENSE
    // -------------------------
    const expenseResult = await Expenses.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalExpense = expenseResult[0]?.total || 0;


    // -------------------------
    // CURRENT BALANCE
    // -------------------------
    const currentBalance = totalIncome - totalExpense;


    // -------------------------
    // WEEK DATES
    // -------------------------
    const now = new Date();

    // Start of current week (Monday)
    const currentWeekStart = new Date(now);
    const day = currentWeekStart.getDay();

    const daysFromMonday = day === 0 ? 6 : day - 1;

    currentWeekStart.setDate(
      currentWeekStart.getDate() - daysFromMonday
    );

    currentWeekStart.setHours(0, 0, 0, 0);


    // Start of previous week
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(
      previousWeekStart.getDate() - 7
    );

    // -------------------------
    // THIS WEEK'S EXPENSE
    // -------------------------
    const thisWeekResult = await Expenses.aggregate([
      {
        $match: {
          userId: userId,
          date: {
            $gte: currentWeekStart,
            $lt: now,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const thisWeekExpense =
      thisWeekResult[0]?.total || 0;


    // -------------------------
    // LAST WEEK'S EXPENSE
    // -------------------------
    const lastWeekResult = await Expenses.aggregate([
      {
        $match: {
          userId: userId,
          date: {
            $gte: previousWeekStart,
            $lt: currentWeekStart,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const lastWeekExpense =
      lastWeekResult[0]?.total || 0;


    // -------------------------
    // DIFFERENCE
    // -------------------------
    const difference =
      thisWeekExpense - lastWeekExpense;


    return res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        currentBalance,
        thisWeekExpense,
        lastWeekExpense,
        difference,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get dashboard summary",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};