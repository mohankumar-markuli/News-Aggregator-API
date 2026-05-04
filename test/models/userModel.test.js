const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const User = require("../../src/models/userModel");

let mongoServer;

describe("user model tests", () => {

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

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    test("should create user with valid data", async () => {
        const user = await User.create({
            firstName: "test",
            emailId: "test@test.com",
            password: "Strong@123"
        });

        expect(user._id).toBeDefined();
        expect(user.emailId).toBe("test@test.com");
        expect(user.preferences.languages).toEqual(["en"]);
        expect(user.preferences.country).toBe("in");
    });

    test("should fail if email invalid", async () => {
        await expect(
            User.create({
                firstName: "test",
                emailId: "invalid",
                password: "Strong@123"
            })
        ).rejects.toThrow("Email is not valid");
    });

    test("should fail if password weak", async () => {
        await expect(
            User.create({
                firstName: "test",
                emailId: "test@test.com",
                password: "123"
            })
        ).rejects.toThrow("Enter a Strong Password");
    });

    test("should fail if required fields missing", async () => {
        await expect(
            User.create({})
        ).rejects.toThrow();
    });

    test("should allow valid enum values", async () => {
        const user = await User.create({
            firstName: "test",
            emailId: "enum@test.com",
            password: "Strong@123",
            preferences: {
                categories: ["technology", "sports"],
                languages: ["en", "hi"],
                country: "us"
            }
        });

        expect(user.preferences.categories).toContain("technology");
        expect(user.preferences.languages).toContain("hi");
        expect(user.preferences.country).toBe("us");
    });

    test("should fail for invalid category enum", async () => {
        await expect(
            User.create({
                firstName: "test",
                emailId: "cat@test.com",
                password: "Strong@123",
                preferences: {
                    categories: ["invalid"]
                }
            })
        ).rejects.toThrow();
    });

    test("should fail for invalid language enum", async () => {
        await expect(
            User.create({
                firstName: "test",
                emailId: "lang@test.com",
                password: "Strong@123",
                preferences: {
                    languages: ["xx"]
                }
            })
        ).rejects.toThrow();
    });

    test("should fail for invalid country enum", async () => {
        await expect(
            User.create({
                firstName: "test",
                emailId: "country@test.com",
                password: "Strong@123",
                preferences: {
                    country: "xx"
                }
            })
        ).rejects.toThrow();
    });

});