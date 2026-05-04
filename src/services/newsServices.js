const axios = require("axios");

const fetchNews = async (query, lang = "en") => {
    const res = await axios.get("https://gnews.io/api/v4/search", {
        params: {
            q: query,
            lang,
            max: 10,
            apikey: process.env.GNEWS_API_KEY
        }
    });

    return res.data.articles;
};

module.exports = { fetchNews };