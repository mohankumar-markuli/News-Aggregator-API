const express = require("express");
const newsRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { getNews } = require("../controllers/newsController");

newsRouter.use(userAuth);

newsRouter.get("/", getNews);

module.exports = newsRouter;