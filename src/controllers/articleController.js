const cache = require("../utils/cache");
const {
    saveArticle,
    getArticlesByType
} = require("../services/articleServices");

const postReadNews = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.id;

        let article = cache.get(`article:${articleId}`) || req.body;

        if (!article) {
            return res.status(400).json({ message: "Article data missing" });
        }

        const result = await saveArticle(userId, articleId, article, "read");

        res.json(result);
    } catch (err) {
        next(err);
    }
};

const postFavoriteNews = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.id;

        let article = cache.get(`article:${articleId}`) || req.body;

        if (!article) {
            return res.status(400).json({ message: "Article data missing" });
        }

        const result = await saveArticle(userId, articleId, article, "favorite");

        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getReadNews = async (req, res, next) => {
    try {
        const data = await getArticlesByType(req.user.id, "read");
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const getFavoriteNews = async (req, res, next) => {
    try {
        const data = await getArticlesByType(req.user.id, "favorite");
        res.json(data);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    postReadNews,
    postFavoriteNews,
    getReadNews,
    getFavoriteNews
};