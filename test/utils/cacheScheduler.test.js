describe("cache scheduler tests", () => {

    let consoleSpy;
    let safeUpdateCache;
    let updateCacheMock;

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

        updateCacheMock = jest.fn();

        jest.doMock("../../src/utils/cacheUpdater", () => updateCacheMock);

        const scheduler = require("../../src/utils/cacheScheduler");
        safeUpdateCache = scheduler.safeUpdateCache;
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test("should call updateCache", async () => {
        updateCacheMock.mockResolvedValue();

        await safeUpdateCache();

        expect(updateCacheMock).toHaveBeenCalledTimes(1);
    });

    test("should prevent overlapping executions", async () => {
        // simulate slow async but auto-resolve
        updateCacheMock.mockImplementation(
            () => new Promise(res => setTimeout(res, 10))
        );

        const p1 = safeUpdateCache(); // starts running

        // immediately call again (should be skipped)
        await safeUpdateCache();

        expect(updateCacheMock).toHaveBeenCalledTimes(1);

        await p1; // let first finish

        await safeUpdateCache();

        expect(updateCacheMock).toHaveBeenCalledTimes(2);
    });

    test("should handle errors", async () => {
        updateCacheMock.mockRejectedValue(new Error("fail"));

        await safeUpdateCache();

        expect(consoleSpy).toHaveBeenCalledWith(
            "Cache update failed:",
            "fail"
        );
    });

});