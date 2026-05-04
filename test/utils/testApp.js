require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const { errorHandler } = require("../../src/middlewares/errorHandler");

const authRouter = require("../../src/routes/authRoutes");
const userRouter = require("../../src/routes/userRoutes");
const newsRouter = require("../../src/routes/newsRoutes");
const articleRouter = require("../../src/routes/articleRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/news", newsRouter);
app.use("/api/v1/news", articleRouter);

// error handler
app.use(errorHandler);

module.exports = app;