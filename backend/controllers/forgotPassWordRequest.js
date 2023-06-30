const ForgotPasswordRequest = require("../Models/forgotPassWordRequest");
const dotenv = require("dotenv");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.PostForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique reset token or ID (e.g., using a UUID library)
    const resetToken = generateResetToken();

    // Create a new entry in the ForgotPasswordRequests table
    const forgotPasswordRequest = await ForgotPasswordRequest.create({
      userId: user.id,
      resetToken,
      isActive: true,
    });

    // Compose the email content
    const mailOptions = {
      from: "sandeepkumarrana49@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: http://localhost:8080/password/resetpassword/${forgotPasswordRequest.resetToken}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset password email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getForgotPassword = async (req, res) => {
  const { id } = req.params;
  try {
    const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(id, {
      include: User,
    });

    if (!forgotPasswordRequest || !forgotPasswordRequest.isActive) {
      return res
        .status(404)
        .json({ message: "Invalid or expired reset password request" });
    }

    res.render("resetpassword", { requestId: forgotPasswordRequest.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postResetPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(id, {
      include: User,
    });

    if (!forgotPasswordRequest || !forgotPasswordRequest.isActive) {
      return res.status(404).json({ error: "Invalid or expired reset token" });
    }

    const user = forgotPasswordRequest.User;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await encryptPassword(password);

    await user.update({ password: hashedPassword });

    // Deactivate the reset token
    await forgotPasswordRequest.update({ isActive: false });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Generate reset token
const generateResetToken = () => {
  const resetToken = uuidv4();
  return resetToken;
};

// Encrypt password
const encryptPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};
