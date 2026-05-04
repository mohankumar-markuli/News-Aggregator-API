jest.setTimeout(20000);

process.env.JWT_SECRET_KEY = "testsecret";

// mocks
jest.mock("../../src/services/newsServices", () => ({
    fetchNews: jest.fn(),
    fetchNewsByKeyword: jest.fn()
}));

const {
    fetchNews,
    fetchNewsByKeyword
} = require("../../src/services/newsServices");

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../utils/testApp");

let mongoServer;
let authCookie;

describe("news routes integration tests", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri(), {
            dbName: "test-db"
        });

        // signup
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "news",
                emailId: "news@test.com",
                password: "Strong@123"
            });

        // login
        const login = await request(app)
            .post("/api/v1/auth/login")
            .send({
                emailId: "news@test.com",
                password: "Strong@123"
            });

        authCookie = login.headers["set-cookie"];
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    test("should get news", async () => {
        fetchNews.mockResolvedValue({ articles: [] });

        const res = await request(app)
            .get("/api/v1/news")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(fetchNews).toHaveBeenCalled();
    });

    test("should get news by keyword", async () => {
        fetchNewsByKeyword.mockResolvedValue({ articles: [] });

        const res = await request(app)
            .get("/api/v1/news/search/tech")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(fetchNewsByKeyword).toHaveBeenCalledWith("tech");
    });

    test("should fail without auth", async () => {
        const res = await request(app)
            .get("/api/v1/news");

        expect(res.status).toBe(401);
    });

});