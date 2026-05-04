// mocks
jest.mock("axios");
jest.mock("../../src/utils/cache", () => ({
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn()
}));

const axios = require("axios");
const cache = require("../../src/utils/cache");

const updateCache = require("../../src/utils/cacheUpdater");

describe("cache updater tests", () => {

    let logSpy;
    let errorSpy;

    beforeEach(() => {
        jest.clearAllMocks();

        process.env.GNEWS_API_KEY = "testkey";

        logSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        errorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        logSpy.mockRestore();
        errorSpy.mockRestore();
    });

    test("should fetch and cache articles", async () => {
        cache.has.mockReturnValue(false);

        axios.get.mockResolvedValue({
            data: {
                articles: [
                    { id: "1", title: "a" },
                    { id: "2", title: "b" }
                ]
            }
        });

        await updateCache();

        expect(axios.get).toHaveBeenCalled();

        expect(cache.set).toHaveBeenCalledWith(
            "news:technology:en",
            expect.any(Array)
        );

        expect(cache.set).toHaveBeenCalledWith(
            "article:1",
            expect.objectContaining({ id: "1" })
        );

        expect(cache.set).toHaveBeenCalledWith(
            "article:2",
            expect.objectContaining({ id: "2" })
        );

        expect(logSpy).toHaveBeenCalledWith("Cache updated");
    });

    test("should not overwrite existing cache", async () => {
        cache.has.mockReturnValue(true);

        axios.get.mockResolvedValue({
            data: {
                articles: [{ id: "1" }]
            }
        });

        await updateCache();

        expect(cache.set).not.toHaveBeenCalled();
    });

    test("should handle rate limit error", async () => {
        axios.get.mockRejectedValue({
            response: { status: 429 }
        });

        await updateCache();

        expect(logSpy).toHaveBeenCalledWith(
            "Rate limit hit. Skipping cycle."
        );
    });

    test("should handle generic error", async () => {
        axios.get.mockRejectedValue(new Error("fail"));

        await updateCache();

        expect(errorSpy).toHaveBeenCalledWith(
            "Cache update failed:",
            "fail"
        );
    });

});