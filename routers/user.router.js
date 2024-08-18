import express from "express";
import {
  getAll,
  getOne,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import checkAdmin from "../middleware/checkAdmin.middleware.js";

const router = express.Router();

router.get("/admin/user", auth, getAll);
router.get("/admin/user/:id", auth, getOne);
router.post("/admin/user/", auth, checkAdmin, createUser);
router.patch("/admin/user/:id", auth, checkAdmin, updateUser);
router.delete("/admin/user/:id", auth, checkAdmin, deleteUser);

export default router;
