// utils/cacheUpdater.js

const axios = require("axios");
const cache = require("./cache");

const updateCache = async () => {
    try {
        const queries = ["technology", "sports", "business"];

        for (let q of queries) {
            const cacheKey = `news:${q}:en`;

            const res = await axios.get("https://gnews.io/api/v4/search", {
                params: {
                    q,
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

        }

        console.log("Cache updated");
    } catch (err) {
        console.error("Cache update failed:", err.message);
    }
};

module.exports = updateCache;