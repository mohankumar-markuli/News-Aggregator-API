const express = require("express");
const articleRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { postReadNews,
    postFavoriteNews,
    getReadNews,
    getFavoriteNews } = require("../controllers/articleController");

articleRouter.use(userAuth);

articleRouter.post("/:id/read", postReadNews);
articleRouter.post("/:id/favorite", postFavoriteNews);
articleRouter.get("/read", getReadNews);
articleRouter.get("/favorite", getFavoriteNews);

module.exports = articleRouter;