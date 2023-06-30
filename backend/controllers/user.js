const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../Models/users");
const jwt = require("jsonwebtoken");

exports.postSignupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, "sandybhai");

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postSigninUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Verify the user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, "sandybhai");

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
