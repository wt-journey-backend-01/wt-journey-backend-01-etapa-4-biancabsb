import express from "express";
const router = express.Router();
import casosController from "../controllers/casosController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
router.use(authMiddleware);
router.get("/", casosController.getAllCasos);
router.get("/:id", casosController.getCasoById);
router.post("/", casosController.createCaso);
router.put("/:id", casosController.updateCaso);
router.patch("/:id", casosController.updateCasoPartial);
router.delete("/:id", casosController.deleteCaso);

export default router;
