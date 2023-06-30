const express = require("express");
const { Expense } = require("../Models/expense");
const { User } = require("../Models/users");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    const user = await User.findByPk(req.user.userId); // Find the authenticated user

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
    });

    await expense.setUser(user); // Associate the expense with the user

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { UserId: req.user.userId }, // Fetch expenses for the authenticated user only
      order: [["createdAt", "DESC"]], // Sort expenses by creation date in descending order
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;

    const expense = await Expense.findOne({
      where: { id, UserId: req.user.userId }, // Find the expense by ID and user ID
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Update the expense properties
    expense.amount = amount;
    expense.description = description;
    expense.category = category;

    await expense.save(); // Save the updated expense

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOne({
      where: { id, UserId: req.user.userId }, // Find the expense by ID and user ID
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await expense.destroy(); // Delete the expense

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
