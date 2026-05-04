const mongoose = require("mongoose");
const connectDb = require("../../src/config/database");

// mock mongoose
jest.mock("mongoose");

describe("Database Connection", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should call mongoose.connect with MONGODB_URI", async () => {
        process.env.MONGODB_URI = "mongodb://localhost:27017/test-db";

        mongoose.connect.mockResolvedValue(true);

        await connectDb();

        expect(mongoose.connect).toHaveBeenCalledWith(
            "mongodb://localhost:27017/test-db"
        );
    });

    test("should throw error if connection fails", async () => {
        process.env.MONGODB_URI = "mongodb://localhost:27017/test-db";

        mongoose.connect.mockRejectedValue(new Error("Connection failed"));

        await expect(connectDb()).rejects.toThrow("Connection failed");
    });

});