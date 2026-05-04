// mocks
jest.mock("axios");
jest.mock("../../src/utils/cache", () => ({
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn()
}));

const axios = require("axios");
const cache = require("../../src/utils/cache");

const {
    fetchNews,
    fetchNewsByKeyword
} = require("../../src/services/newsServices");

describe("news services tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.GNEWS_API_KEY = "testkey";
    });

    describe("fetchNews", () => {

        const buildReq = (prefs = {}) => ({
            user: {
                preferences: prefs
            }
        });

        test("should return cached data", async () => {
            const cachedData = [{ id: "1" }];

            cache.get.mockReturnValue(cachedData);

            const result = await fetchNews(
                buildReq({ categories: ["tech"], languages: ["en"], country: "in" })
            );

            expect(result.source).toBe("cache");
            expect(result.articles).toEqual(cachedData);
        });

        test("should fetch from api and cache data", async () => {
            cache.get.mockReturnValue(null);
            cache.has.mockReturnValue(false);

            axios.get.mockResolvedValue({
                data: {
                    articles: [{ id: "1", title: "test" }]
                }
            });

            const result = await fetchNews(
                buildReq({ categories: ["tech"], languages: ["en"], country: "in" })
            );

            expect(axios.get).toHaveBeenCalled();
            expect(cache.set).toHaveBeenCalled();
            expect(result.source).toBe("api");
        });

        test("should handle empty preferences", async () => {
            cache.get.mockReturnValue(null);
            cache.has.mockReturnValue(false);

            axios.get.mockResolvedValue({
                data: { articles: [] }
            });

            const result = await fetchNews(buildReq({}));

            expect(axios.get).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    params: expect.objectContaining({
                        q: "latest",
                        lang: "en"
                    })
                })
            );

            expect(result.source).toBe("api");
        });

    });

    describe("fetchNewsByKeyword", () => {

        test("should return cached search result", async () => {
            const cached = [{ id: "1" }];

            cache.get.mockReturnValue(cached);

            const result = await fetchNewsByKeyword("tech");

            expect(result.source).toBe("cache");
            expect(result.articles).toEqual(cached);
        });

        test("should fetch from api and cache search result", async () => {
            cache.get.mockReturnValue(null);
            cache.has.mockReturnValue(false);

            axios.get.mockResolvedValue({
                data: {
                    articles: [{ id: "1" }]
                }
            });

            const result = await fetchNewsByKeyword("tech");

            expect(axios.get).toHaveBeenCalled();
            expect(cache.set).toHaveBeenCalled();
            expect(result.source).toBe("api");
        });

    });

});