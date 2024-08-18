import { Op } from "sequelize";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";

const report = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.query;

    // Membuat kondisi where untuk filter
    const whereConditions = {};

    if (name) {
      whereConditions["$User.Name$"] = { [Op.like]: `%${name}%` };
    }

    if (startDate && endDate) {
      // Menambahkan satu hari ke endDate untuk memastikan transaksi pada endDate juga disertakan
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

      whereConditions.Date = {
        [Op.between]: [new Date(startDate), adjustedEndDate],
      };
    }
    // Jika pengguna bukan admin, tambahkan kondisi untuk hanya melihat transaksi mereka sendiri
    if (req.user.role !== "admin") {
      whereConditions.UserID = req.user.id;
    }

    // Menghitung jumlah total transaksi
    const totalTransactions = await Transaction.count({
      include: [
        {
          model: User,
          attributes: [],
          where: name ? { Name: { [Op.like]: `%${name}%` } } : {},
        },
      ],
      where: whereConditions,
    });

    // Menghitung total deposit
    const totalDeposit = await Transaction.sum("Amount", {
      include: [
        {
          model: User,
          attributes: [],
          where: name ? { Name: { [Op.like]: `%${name}%` } } : {},
        },
      ],
      where: {
        ...whereConditions,
        TransactionType: "deposit",
      },
    });

    // Menghitung total penarikan
    const totalWithdrawal = await Transaction.sum("Amount", {
      include: [
        {
          model: User,
          attributes: [],
          where: name ? { Name: { [Op.like]: `%${name}%` } } : {},
        },
      ],
      where: {
        ...whereConditions,
        TransactionType: "withdraw",
      },
    });

    // Menghitung saldo
    const balance = totalDeposit - totalWithdrawal;

    // Mendapatkan semua transaksi
    const transactions = await Transaction.findAll({
      where: whereConditions,
      attributes: [
        "TransactionID",
        "UserID",
        "TransactionType",
        "Date",
        "Amount",
        "Description",
        "createdAt",
      ],
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

export default report;
