import express from "express";
import {
  getAll,
  getOne,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import checkAdmin from "../middleware/checkAdmin.middleware.js";

const router = express.Router();

router.get("/admin/article", auth, getAll);
router.get("/admin/article/:id", auth, getOne);
router.post("/admin/article", auth, checkAdmin, createArticle);
router.patch("/admin/article/:id", auth, checkAdmin, updateArticle); 
router.delete("/admin/article/:id", auth, checkAdmin, deleteArticle);

export default router;
