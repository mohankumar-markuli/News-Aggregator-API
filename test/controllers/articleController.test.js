// mocks
jest.mock("../../src/utils/cache", () => ({
    get: jest.fn()
}));

jest.mock("../../src/services/articleServices", () => ({
    saveArticle: jest.fn(),
    getArticlesByType: jest.fn()
}));

const cache = require("../../src/utils/cache");
const {
    saveArticle,
    getArticlesByType
} = require("../../src/services/articleServices");

const {
    postReadNews,
    postFavoriteNews,
    getReadNews,
    getFavoriteNews
} = require("../../src/controllers/articleController");

describe("article controller unit tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            user: { id: "user123" },
            params: {},
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    describe("postReadNews", () => {

        test("should save read article from cache", async () => {
            const article = { title: "test" };

            req.params.id = "a1";
            cache.get.mockReturnValue(article);

            saveArticle.mockResolvedValue({ success: true });

            await postReadNews(req, res, next);

            expect(saveArticle).toHaveBeenCalledWith(
                "user123",
                "a1",
                article,
                "read"
            );

            expect(res.json).toHaveBeenCalledWith({ success: true });
        });

        test("should use request body if cache miss", async () => {
            const article = { title: "body" };

            req.params.id = "a1";
            req.body = article;

            cache.get.mockReturnValue(undefined);

            saveArticle.mockResolvedValue({ success: true });

            await postReadNews(req, res, next);

            expect(saveArticle).toHaveBeenCalledWith(
                "user123",
                "a1",
                article,
                "read"
            );
        });

        test("should return 400 if no article data", async () => {
            req.params.id = "a1";

            cache.get.mockReturnValue(undefined);
            req.body = null;

            await postReadNews(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Article data missing"
            });
        });

        test("should call next on error", async () => {
            req.params.id = "a1";

            cache.get.mockReturnValue({});

            saveArticle.mockRejectedValue(new Error("error"));

            await postReadNews(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    describe("postFavoriteNews", () => {

        test("should save favorite article", async () => {
            const article = { title: "fav" };

            req.params.id = "a1";
            cache.get.mockReturnValue(article);

            saveArticle.mockResolvedValue({ success: true });

            await postFavoriteNews(req, res, next);

            expect(saveArticle).toHaveBeenCalledWith(
                "user123",
                "a1",
                article,
                "favorite"
            );

            expect(res.json).toHaveBeenCalledWith({ success: true });
        });

        test("should return 400 if no article data", async () => {
            req.params.id = "a1";

            cache.get.mockReturnValue(undefined);
            req.body = null;

            await postFavoriteNews(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test("should call next on error", async () => {
            req.params.id = "a1";

            cache.get.mockReturnValue({});

            saveArticle.mockRejectedValue(new Error("error"));

            await postFavoriteNews(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    describe("getReadNews", () => {

        test("should return read articles", async () => {
            const data = [{ id: "1" }];

            getArticlesByType.mockResolvedValue(data);

            await getReadNews(req, res, next);

            expect(getArticlesByType).toHaveBeenCalledWith("user123", "read");

            expect(res.json).toHaveBeenCalledWith(data);
        });

        test("should call next on error", async () => {
            getArticlesByType.mockRejectedValue(new Error("error"));

            await getReadNews(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    describe("getFavoriteNews", () => {

        test("should return favorite articles", async () => {
            const data = [{ id: "1" }];

            getArticlesByType.mockResolvedValue(data);

            await getFavoriteNews(req, res, next);

            expect(getArticlesByType).toHaveBeenCalledWith("user123", "favorite");

            expect(res.json).toHaveBeenCalledWith(data);
        });

        test("should call next on error", async () => {
            getArticlesByType.mockRejectedValue(new Error("error"));

            await getFavoriteNews(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

});