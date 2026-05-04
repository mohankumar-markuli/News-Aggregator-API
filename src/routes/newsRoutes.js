const express = require("express");
const newsRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { getNews, getNewsByKeyword } = require("../controllers/newsController");

newsRouter.use(userAuth);

newsRouter.get("/", getNews);
newsRouter.get("/search/:keyword", getNewsByKeyword);

module.exports = newsRouter;