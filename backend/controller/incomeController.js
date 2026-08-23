const Income = require("../model/incomeModel");

const createIncome = async (req, res) => {
  try {
    const { source, amount, description, date } = req.body;

    if (!source || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Source and amount are required",
      });
    }

    const income = await Income.create({
      userId: req.user.id,
      source,
      amount,
      description,
      date,
    });

    return res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: income,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create income",
      error: error.message,
    });
  }
};


const getIncomes = async (req, res) => {
  try {
    const {
      source,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      sort,
    } = req.query;

    const filter = {
      userId: req.user.id,
    };

    if (source) {
      filter.source = source;
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

    let query = Income.find(filter);

    if (sort === "asc") {
      query = query.sort({ amount: 1 });
    } else if (sort === "desc") {
      query = query.sort({ amount: -1 });
    } else {
      query = query.sort({ date: -1 });
    }

    const incomes = await query;

    return res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get incomes",
      error: error.message,
    });
  }
};


const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get income",
      error: error.message,
    });
  }
};


const updateIncome = async (req, res) => {
  try {
    const { source, amount, description, date } = req.body;

    const updateData = {};

    if (source !== undefined) {
      updateData.source = source;
    }

    if (amount !== undefined) {
      updateData.amount = Number(amount);
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (date !== undefined) {
      updateData.date = new Date(date);
    }

    const income = await Income.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: income,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update income",
      error: error.message,
    });
  }
};


const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete income",
      error: error.message,
    });
  }
};


module.exports = {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
};