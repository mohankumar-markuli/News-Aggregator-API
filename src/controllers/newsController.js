const { fetchNews, fetchNewsByKeyword } = require("../services/newsServices");

const getNews = async (req, res, next) => {
    try {
        const result = await fetchNews(req);

        res.json({ result });

    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data
            });
        }
        next(err);
    }
};

const getNewsByKeyword = async (req, res, next) => {
    try {
        const keyword = req.params.keyword;

        const result = await fetchNewsByKeyword(keyword);

        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { getNews, getNewsByKeyword };