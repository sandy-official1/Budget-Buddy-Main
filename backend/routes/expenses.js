const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../Controllers/expense");

const router = express.Router();

router.post("/", authenticateToken, addExpense);
router.get("/", authenticateToken, getExpenses);
router.put("/:id", authenticateToken, updateExpense);
router.delete("/:id", authenticateToken, deleteExpense);

module.exports = router;
