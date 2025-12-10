const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  getMe,
  changePassword,
  deleteAccount
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

router.post("/change-password", authMiddleware, changePassword);
router.delete("/delete", authMiddleware, deleteAccount);

module.exports = router;
