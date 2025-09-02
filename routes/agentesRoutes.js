import express from "express";
import agentesController from "../controllers/agentesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", agentesController.getAllAgentes);
router.get("/:id", agentesController.getAgenteById);
router.post("/", agentesController.createAgente);
router.put("/:id", agentesController.updateAgente);
router.patch("/:id", agentesController.updateAgentePartial);
router.delete("/:id", agentesController.deleteAgente);

export default router;