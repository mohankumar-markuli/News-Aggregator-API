const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 600,   // 10 minutes
    checkperiod: 60
});

module.exports = cache;