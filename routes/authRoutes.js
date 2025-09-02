const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.signup);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.delete("/users/:id", authController.deleteUser);

module.exports = router;