jest.setTimeout(20000);

process.env.JWT_SECRET_KEY = "testsecret";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../utils/testApp");

let mongoServer;

describe("auth routes integration tests", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri(), {
            dbName: "test-db"
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    test("should signup user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "test",
                emailId: "test@test.com",
                password: "Strong@123"
            });

        expect(res.status).toBe(201);
        expect(res.body.data.emailId).toBe("test@test.com");
    });

    test("should not signup duplicate user", async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "test",
                emailId: "dup@test.com",
                password: "Strong@123"
            });

        const res = await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "test",
                emailId: "dup@test.com",
                password: "Strong@123"
            });

        expect(res.status).toBe(400);
    });

    test("should login user", async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "login",
                emailId: "login@test.com",
                password: "Strong@123"
            });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                emailId: "login@test.com",
                password: "Strong@123"
            });

        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("should fail login with wrong password", async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "wrong",
                emailId: "wrong@test.com",
                password: "Strong@123"
            });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                emailId: "wrong@test.com",
                password: "Wrong@123"
            });

        expect(res.status).toBe(401);
    });

    test("should logout user", async () => {
        await request(app)
            .post("/api/v1/auth/signup")
            .send({
                firstName: "logout",
                emailId: "logout@test.com",
                password: "Strong@123"
            });

        const login = await request(app)
            .post("/api/v1/auth/login")
            .send({
                emailId: "logout@test.com",
                password: "Strong@123"
            });

        const cookie = login.headers["set-cookie"];

        const res = await request(app)
            .post("/api/v1/auth/logout")
            .set("Cookie", cookie);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Logout Successful");
    });

});