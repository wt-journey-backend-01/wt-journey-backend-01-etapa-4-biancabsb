import express from "express";
import authController from  "../controllers/authController.js";
import validateSchema from "../middlewares/validateSchema.js";




const router = express.Router();

router.post("/register", validateSchema(signup), authController.signup);
router.post("/login", validateSchema(login), authController.login);
router.post("/logout", validateSchema(logout), authController.logout);


export default router;
