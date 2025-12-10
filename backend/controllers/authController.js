const bcrypt = require("bcryptjs"); // hashing library
const jwt = require("jsonwebtoken"); // token generation
const User = require("../models/User"); // User model
const Watchlist = require("../models/Watchlist"); // Watchlist model

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body; // get credentials from request

    let user = await User.findOne({ email }); // check if user exists
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10); // create salt
    const hashed = await bcrypt.hash(password, salt); // hash password

    user = new User({ email, password: hashed }); // create new user
    await user.save(); // save user to DB

    const payload = { user: { id: user.id, email: user.email } }; // token payload
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }); // create JWT

    res.json({ token }); // return token
  } catch (err) {
    console.error("Register error:", err.message); // log error
    res.status(500).json({ message: "Server error" }); // server error response
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // get credentials from request

    const user = await User.findOne({ email }); // lookup user
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password); // verify password
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const payload = { user: { id: user.id, email: user.email } }; // token 
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }); // create JWT

    res.json({ token }); // return token
  } catch (err) {
    console.error("Login error:", err.message); // log error
    res.status(500).json({ message: "Server error" }); // server error response
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({ email: req.user.email }); // return authenticated user info
  } catch (err) {
    res.status(500).json({ message: "Server error" }); // server error response
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body; // extract passwords

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Both passwords required" });

    const user = await User.findById(req.user.id); // retrieve user
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password); // compare old password
    if (!match)
      return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10); // create salt for new password
    user.password = await bcrypt.hash(newPassword, salt); // hash new password
    await user.save(); // update user in DB

    res.json({ message: "Password updated successfully" }); // success response
  } catch (err) {
    console.error("Password change error:", err.message); // log error
    res.status(500).json({ message: "Server error" }); // server error response
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // get user ID

    await Watchlist.deleteOne({ user: userId }); // delete associated watchlist
    await User.findByIdAndDelete(userId); // delete user

    res.json({ message: "Account deleted" }); // success response
  } catch (err) {
    console.error("Delete account error:", err.message); // log error
    res.status(500).json({ message: "Server error" }); // server error response
  }
};
