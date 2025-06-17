import express from "express";
import { getTransactionsByuserId, createTransaction, deleteTransaction, getTransactionSummary } from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:user_id", getTransactionsByuserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:user_id", getTransactionSummary);

export default router;