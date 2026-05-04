const { fetchNews } = require("../services/newsServices");

const getNews = async (req, res, next) => {
    try {
        const { categories, languages } = req.user.preferences;

        const query = categories?.[0] || "latest";
        const lang = languages?.[0] || "en";

        const articles = await fetchNews(query, lang);

        res.json({ articles });
    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data
            });
        }
        next(err);
    }
};

module.exports = { getNews };