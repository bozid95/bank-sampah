import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Article = db.define(
  "articles",
  {
    ArticleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);
export default Article;
