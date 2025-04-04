import express from "express";
import { addEquipment, getAllEquipment, searchEquipment, updateEquipment,getEquipmentById,deleteEquipment } from "../controllers/equipmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/equipment", protect, addEquipment);
router.get("/equipment", protect, getAllEquipment);
router.get("/equipment/search", protect, searchEquipment);
router.get("/equipment/:id", protect, getEquipmentById); // Assuming you have a getEquipmentById function in your controller
router.put("/equipment/:id", protect, updateEquipment);
router.put("/equipment/delect/:id", protect, deleteEquipment); // Assuming you have a deleteEquipment function in your controller

export default router;
