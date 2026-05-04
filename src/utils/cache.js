const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 300,   // 5 minutes
    checkperiod: 60
});

module.exports = cache;