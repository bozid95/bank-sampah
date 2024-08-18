import express from "express";
import { register, login, logout, me } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/admin/me", auth, me);

export default router;
