const express = require("express");
const router = express.Router();
const agentesController = require('../controllers/agentesController');
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, agentesController.getAllAgentes);
router.get("/:id", agentesController.getAgenteById);
router.post("/", agentesController.createAgente);
router.put("/:id", agentesController.updateAgente);
router.patch("/:id", agentesController.updateAgentePartial);
router.delete("/:id", agentesController.deleteAgente);

module.exports = router;