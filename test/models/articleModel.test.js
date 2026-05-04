const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Article = require("../../src/models/articlesModel");

let mongoServer;
let userId;

describe("article model tests", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri(), {
            dbName: "test-db"
        });

        await Article.init(); // ensure indexes are created
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        userId = new mongoose.Types.ObjectId();

        await Article.init(); // re-create indexes after drop
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    test("should create article with valid data", async () => {
        const article = await Article.create({
            userId,
            articleId: "a1",
            title: "test article"
        });

        expect(article._id).toBeDefined();
        expect(article.userId.toString()).toBe(userId.toString());
        expect(article.isRead).toBe(false);
        expect(article.isFavorite).toBe(false);
    });

    test("should fail if required fields missing", async () => {
        await expect(
            Article.create({})
        ).rejects.toThrow();
    });

    test("should enforce unique userId + articleId", async () => {
        await Article.create({
            userId,
            articleId: "a1"
        });

        await expect(
            Article.create({
                userId,
                articleId: "a1"
            })
        ).rejects.toThrow();
    });

    test("should allow same articleId for different users", async () => {
        const user2 = new mongoose.Types.ObjectId();

        const a1 = await Article.create({
            userId,
            articleId: "same"
        });

        const a2 = await Article.create({
            userId: user2,
            articleId: "same"
        });

        expect(a1.articleId).toBe(a2.articleId);
    });

    test("should update isRead and isFavorite flags", async () => {
        const article = await Article.create({
            userId,
            articleId: "a1"
        });

        article.isRead = true;
        article.isFavorite = true;

        const saved = await article.save();

        expect(saved.isRead).toBe(true);
        expect(saved.isFavorite).toBe(true);
    });

    test("should store optional fields", async () => {
        const article = await Article.create({
            userId,
            articleId: "a2",
            title: "title",
            description: "desc",
            content: "content",
            url: "http://test.com",
            image: "img.jpg",
            publishedAt: new Date(),
            sourceName: "source"
        });

        expect(article.title).toBe("title");
        expect(article.url).toBe("http://test.com");
        expect(article.sourceName).toBe("source");
    });

});