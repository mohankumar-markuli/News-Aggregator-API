const updateCache = require("./cacheUpdater");

let isRunning = false;

const startCacheScheduler = () => {
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

    safeUpdateCache(); // initial run

    setInterval(safeUpdateCache, 15 * 60 * 1000);
};

module.exports = startCacheScheduler;