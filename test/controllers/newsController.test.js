// mocks
jest.mock("../../src/services/newsServices", () => ({
    fetchNews: jest.fn(),
    fetchNewsByKeyword: jest.fn()
}));

const {
    fetchNews,
    fetchNewsByKeyword
} = require("../../src/services/newsServices");

const {
    getNews,
    getNewsByKeyword
} = require("../../src/controllers/newsController");

describe("news controller unit tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            params: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    describe("getNews", () => {

        test("should return news successfully", async () => {
            const mockResult = { articles: [] };

            fetchNews.mockResolvedValue(mockResult);

            await getNews(req, res, next);

            expect(fetchNews).toHaveBeenCalledWith(req);

            expect(res.json).toHaveBeenCalledWith({
                result: mockResult
            });
        });

        test("should handle axios error response", async () => {
            const error = {
                response: {
                    status: 429,
                    data: "rate limit"
                }
            };

            fetchNews.mockRejectedValue(error);

            await getNews(req, res, next);

            expect(res.status).toHaveBeenCalledWith(429);
            expect(res.json).toHaveBeenCalledWith({
                message: "rate limit"
            });
        });

        test("should call next on unknown error", async () => {
            const error = new Error("unexpected");

            fetchNews.mockRejectedValue(error);

            await getNews(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });

    });

    describe("getNewsByKeyword", () => {

        test("should return news by keyword", async () => {
            const mockResult = { articles: [] };

            req.params.keyword = "tech";

            fetchNewsByKeyword.mockResolvedValue(mockResult);

            await getNewsByKeyword(req, res, next);

            expect(fetchNewsByKeyword).toHaveBeenCalledWith("tech");

            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        test("should call next on error", async () => {
            const error = new Error("error");

            req.params.keyword = "tech";

            fetchNewsByKeyword.mockRejectedValue(error);

            await getNewsByKeyword(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });

    });

});