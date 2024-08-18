import express from "express";
import report from "../controllers/report.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/admin/report",auth, report);

export default router;
