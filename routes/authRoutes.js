import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.delete("/users/:id", authController.deleteUser);

export default router;
