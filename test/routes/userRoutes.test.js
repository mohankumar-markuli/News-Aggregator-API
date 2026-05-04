jest.setTimeout(20000);

process.env.JWT_SECRET_KEY = "testsecret";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../utils/testApp");

let mongoServer;
let authCookie;

describe("user routes integration tests", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri(), {
            dbName: "test-db"
        });

        // signup
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "test",
                emailId: "user@test.com",
                password: "Strong@123"
            });

        // login
        const login = await request(app)
            .post("/api/v1/auth/login")
            .send({
                emailId: "user@test.com",
                password: "Strong@123"
            });

        authCookie = login.headers["set-cookie"];
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    test("should get user profile", async () => {
        const res = await request(app)
            .get("/api/v1/users/profile")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(res.body.data.emailId).toBe("user@test.com");
    });

    test("should update user profile", async () => {
        const res = await request(app)
            .patch("/api/v1/users/profile")
            .set("Cookie", authCookie)
            .send({
                firstName: "updated"
            });

        expect(res.status).toBe(200);
        expect(res.body.data.firstName).toBe("updated");
    });

    test("should fail update with restricted field", async () => {
        const res = await request(app)
            .patch("/api/v1/users/profile")
            .set("Cookie", authCookie)
            .send({
                emailId: "hack@test.com"
            });

        expect(res.status).toBe(500);
    });

    test("should change password", async () => {
        const res = await request(app)
            .patch("/api/v1/users/password")
            .set("Cookie", authCookie)
            .send({
                password: "Strong@123",
                newPassword: "NewStrong@123"
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Password Changed Successfully");
    });

    test("should get user preferences", async () => {
        const res = await request(app)
            .get("/api/v1/users/preferences")
            .set("Cookie", authCookie);

        expect(res.status).toBe(200);
        expect(res.body.preferences).toBeDefined();
    });

    test("should update user preferences", async () => {
        const res = await request(app)
            .put("/api/v1/users/preferences")
            .set("Cookie", authCookie)
            .send({
                categories: ["technology"],
                languages: ["en"],
                country: "in"
            });

        expect(res.status).toBe(200);
        expect(res.body.preferences.categories).toContain("technology");
    });

});