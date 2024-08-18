import express from "express";
import {
  getAll,
  getOne,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import checkAdmin from "../middleware/checkAdmin.middleware.js";

const router = express.Router();

router.get("/admin/transaction", auth, getAll);
router.get("/admin/transaction/:id", auth, getOne);
router.post("/admin/transaction", auth, checkAdmin, createTransaction);
router.patch("/admin/transaction/:id", auth, checkAdmin, updateTransaction);
router.delete("/admin/transaction/:id", auth, checkAdmin, deleteTransaction);

export default router;
