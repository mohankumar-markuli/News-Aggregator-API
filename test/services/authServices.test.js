// mocks
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    getHashPassword,
    getJWT
} = require("../../src/services/authServices");

describe("auth services tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SALT_ROUNDS = "10";
        process.env.JWT_SECRET_KEY = "testsecret";
    });

    describe("getHashPassword", () => {

        test("should hash password correctly", async () => {
            bcrypt.hash.mockResolvedValue("hashed_password");

            const result = await getHashPassword("plain");

            expect(bcrypt.hash).toHaveBeenCalledWith("plain", 10);
            expect(result).toBe("hashed_password");
        });

        test("should throw if hashing fails", async () => {
            bcrypt.hash.mockRejectedValue(new Error("hash error"));

            await expect(
                getHashPassword("plain")
            ).rejects.toThrow("hash error");
        });

    });

    describe("getJWT", () => {

        test("should generate jwt token", async () => {
            jwt.sign.mockReturnValue("token");

            const user = { _id: "123" };

            const result = await getJWT(user);

            expect(jwt.sign).toHaveBeenCalledWith(
                { _id: "123" },
                "testsecret",
                { expiresIn: "7d" }
            );

            expect(result).toBe("token");
        });

        test("should throw if jwt fails", async () => {
            jwt.sign.mockImplementation(() => {
                throw new Error("jwt error");
            });

            const user = { _id: "123" };

            await expect(
                getJWT(user)
            ).rejects.toThrow("jwt error");
        });

    });

});