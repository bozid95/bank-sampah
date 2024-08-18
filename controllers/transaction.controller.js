import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";

const getAll = async (req, res) => {
  try {
    // Membuat kondisi where untuk filter
    const whereConditions = {};

    // Jika pengguna bukan admin, tambahkan kondisi untuk hanya melihat transaksi mereka sendiri
    if (req.user.role !== "admin") {
      whereConditions.UserID = req.user.id;
    }

    // Menghitung jumlah total transaksi
    const totalTransactions = await Transaction.count({
      where: whereConditions,
    });

    // Menghitung total deposit
    const totalDeposit = await Transaction.sum("amount", {
      where: {
        ...whereConditions,
        transactionType: "deposit",
      },
    });

    // Menghitung total penarikan
    const totalWithdrawal = await Transaction.sum("amount", {
      where: {
        ...whereConditions,
        transactionType: "withdraw",
      },
    });

    // Menghitung saldo
    const balance = totalDeposit - totalWithdrawal;

    // Mendapatkan semua transaksi
    const transactions = await Transaction.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          attributes: ["Name"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Transactions found",
      data: transactions,
      totalTransactions,
      totalDeposit,
      totalWithdrawal,
      balance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["Name"],
        },
      ],
    });
    // Jika pengguna bukan admin dan transaksi bukan milik mereka, kembalikan kesalahan
    if (req.user.role !== "admin" && transaction.UserID !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }
    return res.status(200).json({
      success: true,
      message: "Transaction found",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const createTransaction = async (req, res) => {
  const { name, amount, transactionType, date, description } = req.body;

  try {
    const transaction = await Transaction.create({
      UserID: name,
      Amount: amount,
      TransactionType: transactionType,
      Date: date,
      Description: description,
    });
    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findByPk(req.params.id);
  const { name, amount, transactionType, date, description } = req.body;
  if (!name || !amount || !transactionType || !description || !date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Transaction not found",
    });
  }
  try {
    const transaction = await Transaction.update(
      {
        UserID: req.body.name || transaction.UserID,
        Amount: req.body.amount || transaction.Amount,
        Date: req.body.date || transaction.Date,
        TransactionType:
          req.body.transactionType || transaction.TransactionType,
        Description: req.body.description || transaction.Description,
      },
      {
        where: {
          TransactionID: req.params.id,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findByPk(req.params.id);
  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Transaction not found",
    });
  }
  try {
    const transaction = await Transaction.destroy({
      where: {
        TransactionID: req.params.id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export {
  getAll,
  getOne,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
