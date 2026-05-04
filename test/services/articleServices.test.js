// mocks
jest.mock("../../src/models/articlesModel", () => ({
    findOneAndUpdate: jest.fn(),
    find: jest.fn()
}));

const Article = require("../../src/models/articlesModel");

const {
    saveArticle,
    getArticlesByType
} = require("../../src/services/articleServices");

describe("article services tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("saveArticle", () => {

        const userId = "user123";
        const articleId = "a1";

        const article = {
            title: "test",
            description: "desc",
            content: "content",
            url: "url",
            image: "img",
            publishedAt: new Date(),
            source: { name: "source" }
        };

        test("should save read article", async () => {
            Article.findOneAndUpdate.mockResolvedValue({ success: true });

            const result = await saveArticle(userId, articleId, article, "read");

            expect(Article.findOneAndUpdate).toHaveBeenCalledWith(
                { userId, articleId },
                expect.objectContaining({
                    articleId,
                    title: "test",
                    isRead: true
                }),
                { upsert: true, returnDocument: "after" }
            );

            expect(result).toEqual({ success: true });
        });

        test("should save favorite article", async () => {
            Article.findOneAndUpdate.mockResolvedValue({ success: true });

            const result = await saveArticle(userId, articleId, article, "favorite");

            expect(Article.findOneAndUpdate).toHaveBeenCalledWith(
                { userId, articleId },
                expect.objectContaining({
                    articleId,
                    title: "test",
                    isFavorite: true
                }),
                { upsert: true, returnDocument: "after" }
            );

            expect(result).toEqual({ success: true });
        });

        test("should save article without type flags", async () => {
            Article.findOneAndUpdate.mockResolvedValue({ success: true });

            await saveArticle(userId, articleId, article, "other");

            expect(Article.findOneAndUpdate).toHaveBeenCalledWith(
                { userId, articleId },
                expect.not.objectContaining({
                    isRead: true,
                    isFavorite: true
                }),
                { upsert: true, returnDocument: "after" }
            );
        });

        test("should handle missing optional fields", async () => {
            const minimal = { title: "only" };

            Article.findOneAndUpdate.mockResolvedValue({ success: true });

            await saveArticle(userId, articleId, minimal, "read");

            expect(Article.findOneAndUpdate).toHaveBeenCalled();
        });

    });

    describe("getArticlesByType", () => {

        test("should return read articles", async () => {
            Article.find.mockResolvedValue([{ id: "1" }]);

            const result = await getArticlesByType("user123", "read");

            expect(Article.find).toHaveBeenCalledWith({
                userId: "user123",
                isRead: true
            });

            expect(result).toEqual([{ id: "1" }]);
        });

        test("should return favorite articles", async () => {
            Article.find.mockResolvedValue([{ id: "1" }]);

            const result = await getArticlesByType("user123", "favorite");

            expect(Article.find).toHaveBeenCalledWith({
                userId: "user123",
                isFavorite: true
            });

            expect(result).toEqual([{ id: "1" }]);
        });

        test("should return all articles if type unknown", async () => {
            Article.find.mockResolvedValue([]);

            const result = await getArticlesByType("user123", "other");

            expect(Article.find).toHaveBeenCalledWith({
                userId: "user123"
            });

            expect(result).toEqual([]);
        });

    });

});