require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/users");
const sequelize = require("./utils/database");
const expenseRoutes = require("./routes/expenses");
const purchaseRoutes = require("./routes/orders");
const userModel = require("./models/user");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/orders", ordersRouter);
app.use("/");

// Define associations
User.hasMany(Expense);
Expense.belongsTo(User);
Order.belongsTo(User); // Order belongs to a user
User.hasMany(Order); // User has many orders
ForgotPasswordRequest.belongsTo(User); // ForgotPasswordRequest belongs to a user
User.hasMany(ForgotPasswordRequest); // User has many forgot password requests

sequelize
  .sync()
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.error(err));
