import express from "express";
import { getAllUsers, getUserByName, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
// router.get("/:id", getUserByName);
router.get("/search/:name", getUserByName);
router.put("/:id", updateUser);

export default router;
