const axios = require("axios");
const cache = require("../utils/cache");

const fetchNews = async (req) => {

    const { categories = [], languages = [], country } = req.user.preferences;

    const query = categories?.length
        ? categories.join(" OR ")
        : "latest";

    const lang = languages?.[0] || "en";

    const cacheKey = `news:${categories.join("-")}:${lang}:${country || "none"}`;

    console.log(cacheKey)

    const cached = cache.get(cacheKey);
    if (cached) {
        return { source: "cache", articles: cached };
    }

    const res = await axios.get("https://gnews.io/api/v4/search", {
        params: {
            q: query,
            lang,
            max: 10,
            apikey: process.env.GNEWS_API_KEY
        }
    });

    const articles = res.data.articles;

    cache.set(cacheKey, articles);

    return { source: "api", articles };
};

module.exports = { fetchNews };