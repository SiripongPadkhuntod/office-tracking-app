import express from "express";
import { getAllUsers, getUserByName, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",protect, getAllUsers);
// router.get("/:id", getUserByName);
router.get("/search/:name",protect, getUserByName);
router.put("/:id",protect, updateUser);

export default router;
