import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define(
  "users",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      //allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      //allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    Password: {
      type: DataTypes.STRING,
      //allowNull: false,
    },

    Role: {
      type: DataTypes.ENUM("admin", "customers"),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);
export default User;
