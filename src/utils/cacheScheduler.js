const updateCache = require("./cacheUpdater");

let isRunning = false;

const safeUpdateCache = async () => {
    if (isRunning) return;
    isRunning = true;

    try {
        await updateCache();
    } catch (err) {
        console.error("Cache update failed:", err.message);
    } finally {
        isRunning = false;
    }
};

const startCacheScheduler = () => {
    safeUpdateCache();
    setInterval(safeUpdateCache, 15 * 60 * 1000);
};

module.exports = {
    startCacheScheduler,
    safeUpdateCache // required for tests
};