import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Transaction = db.define(
  "Transactions",
  {
    TransactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TransactionType: {
      type: DataTypes.ENUM("deposit", "withdraw"),
      allowNull: false,
    },
    Amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Transaction;
