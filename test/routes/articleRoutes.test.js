jest.setTimeout(20000);

process.env.JWT_SECRET_KEY = "testsecret";

// mocks
jest.mock("../../src/utils/cache", () => ({
    get: jest.fn()
}));

const cache = require("../../src/utils/cache");

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../utils/testApp");

let mongoServer;
let authCookie;

describe("article routes integration tests", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri(), {
            dbName: "test-db"
        });

        // signup
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "article",
                emailId: "article@test.com",
                password: "Strong@123"
            });

        // login
        const login = await request(app)
            .post("/api/v1/auth/login")
            .send({
                emailId: "article@test.com",
                password: "Strong@123"
            });

        authCookie = login.headers["set-cookie"];
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    test("should mark article as read", async () => {
        cache.get.mockReturnValue({
            title: "test",
            url: "http://test.com"
        });

        const res = await request(app)
            .post("/api/v1/news/abc/read")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

    test("should mark article as favorite", async () => {
        cache.get.mockReturnValue({
            title: "test",
            url: "http://test.com"
        });

        const res = await request(app)
            .post("/api/v1/news/abc/favorite")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

    test("should fail if no article data", async () => {
        cache.get.mockReturnValue(undefined);

        const res = await request(app)
            .post("/api/v1/news/abc/read")
            .set("Cookie", authCookie)
            .send(null);

        expect(res.status).toBe(400);
    });

    test("should get read articles", async () => {
        const res = await request(app)
            .get("/api/v1/news/read")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

    test("should get favorite articles", async () => {
        const res = await request(app)
            .get("/api/v1/news/favorite")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
    });

    test("should fail without auth", async () => {
        const res = await request(app)
            .get("/api/v1/news/read");

        expect(res.status).toBe(401);
    });

});