// utils/cacheUpdater.js

const axios = require("axios");
const cache = require("./cache");

const updateCache = async () => {
    try {

        const queries = ["technology"];

        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        for (let q of queries) {

            await delay(1000); // 1 second gap
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

            if (!cache.has(cacheKey)) {
                cache.set(cacheKey, articles);
            }

            articles.forEach(article => {
                const key = `article:${article.id}`;
                if (!cache.has(key)) {
                    cache.set(key, article);
                }
            });
        }

        console.log("Cache updated");

    } catch (err) {
        if (err.response?.status === 429) {
            console.log("Rate limit hit. Skipping cycle.");
            return;
        }
        console.error("Cache update failed:", err.message);
    }
};

module.exports = updateCache;