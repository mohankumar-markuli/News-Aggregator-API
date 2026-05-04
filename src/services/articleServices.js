const Article = require("../models/articlesModel");

const saveArticle = async (userId, articleId, article, type) => {
    const update = {
        articleId,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        sourceName: article.source?.name
    };

    if (type === "read") update.isRead = true;
    if (type === "favorite") update.isFavorite = true;

    return Article.findOneAndUpdate(
        { userId, articleId },
        update,
        { upsert: true, returnDocument: 'after' }
    );
};

const getArticlesByType = async (userId, type) => {
    const filter = { userId };

    if (type === "read") filter.isRead = true;
    if (type === "favorite") filter.isFavorite = true;

    return Article.find(filter);
};

module.exports = {
    saveArticle,
    getArticlesByType
};