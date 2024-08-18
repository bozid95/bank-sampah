import express from "express";
import dotenv from "dotenv";
import authRoute from "./routers/auth.router.js";
import userRoute from "./routers/user.router.js";
import transactionRoute from "./routers/transaction.router.js";
import reportRouter from "./routers/report.router.js";
import articleRouter from "./routers/article.router.js";
import { Transaction, User, Article } from "./models/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(
  "/api/v1",
  authRoute,
  userRoute,
  transactionRoute,
  articleRouter,
  reportRouter
);

// Handle 404
app.all("*", (req, res, next) => {
  res.send("Url Not Found");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
