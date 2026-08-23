const Expenses = require("../model/expensesModel");

// ADD
const addExpenses = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      description,
      date
    } = req.body;

    const userId = req.user.id;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill the required fields."
      });
    }

    if (
      description !== undefined &&
      description.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a maximum of 50 characters."
      });
    }

    const expense = await Expenses.create({
      userId,
      title,
      amount,
      category,
      description,
      date
    });

    return res.status(201).json({
      success: true,
      message: "Expense added successfully.",
      data: expense
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};


// GET ALL + FILTER
const getExpenses = async (req, res) => {
  const {
    category,
    minAmount,
    maxAmount,
    startDate,
    endDate
  } = req.query;

  try {
    const userId = req.user.id;

    const filter = {
      userId
    };

    if (category) {
      filter.category = category;
    }

    if (minAmount || maxAmount) {
      filter.amount = {};

      if (minAmount) {
        filter.amount.$gte = Number(minAmount);
      }

      if (maxAmount) {
        filter.amount.$lte = Number(maxAmount);
      }
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filter.date.$lte = end;
      }
    }

    const expenses = await Expenses.find(filter)
      .sort({ date: -1 });

    if (expenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Expense not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: expenses
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};


// GET ONE EXPENSE
const getExpenseById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const expense = await Expenses.findOne({
      _id: id,
      userId
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: expense
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};


// GET RECENT
const getRecentExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expenses.find({
      userId
    })
      .sort({ date: -1 })
      .limit(5);

    if (expenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Expense not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: expenses
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};


// UPDATE
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const updatedExpense = await Expenses.findOneAndUpdate(
      {
        _id: id,
        userId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: updatedExpense
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};


// DELETE
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedExpense = await Expenses.findOneAndDelete({
      _id: id,
      userId
    });

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully."
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};


module.exports = {
  addExpenses,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getRecentExpenses
};