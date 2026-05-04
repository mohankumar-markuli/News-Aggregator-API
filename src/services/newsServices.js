const axios = require("axios");
const cache = require("../utils/cache");

const fetchNews = async (req) => {

    const { categories = [], languages = [], country } = req.user.preferences;

    const query = categories?.length
        ? categories.join(" OR ")
        : "latest";

    const lang = languages?.[0] || "en";

    const cacheKey = `news:${[...categories].sort().join("-")}:${languages[0] || "en"}:${country || "none"}`;

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

    // store in cache (query cache)
    if (!cache.has(cacheKey)) {
        cache.set(cacheKey, articles);
    }

    // also store individual articles (important)
    articles.forEach(article => {
        const key = `article:${article.id}`;
        if (!cache.has(key)) {
            cache.set(key, article);
        }
    });

    return { source: "api", articles };
};

const fetchNewsByKeyword = async (keyword) => {

    const cacheKey = `search:${keyword}`;

    // cache check
    const cached = cache.get(cacheKey);
    if (cached) {
        return { source: "cache", articles: cached };
    }

    // API call
    const res = await axios.get("https://gnews.io/api/v4/search", {
        params: {
            q: keyword,
            lang: "en",
            max: 10,
            apikey: process.env.GNEWS_API_KEY
        }
    });

    const articles = res.data.articles;

    // store in cache (query cache)
    if (!cache.has(cacheKey)) {
        cache.set(cacheKey, articles);
    }

    // also store individual articles (important)
    articles.forEach(article => {
        const key = `article:${article.id}`;
        if (!cache.has(key)) {
            cache.set(key, article);
        }
    });

    return { source: "api", articles };
};

module.exports = { fetchNews, fetchNewsByKeyword };