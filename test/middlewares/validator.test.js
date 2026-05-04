// mocks
jest.mock("bcrypt");
const bcrypt = require("bcrypt");

const {
    validateSignUpData,
    validatePassword,
    validateChangePassword,
    validateEditUserData,
    validateEditUserPreferencesData
} = require("../../src/middlewares/validator");

describe("validator middleware tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            user: { password: "hashed" }
        };

        res = {};
        next = jest.fn();

        jest.clearAllMocks();
    });

    describe("validateSignUpData", () => {

        test("should pass valid data", () => {
            req.body = {
                firstName: "test",
                emailId: "test@test.com",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail if firstName missing", () => {
            req.body = {
                emailId: "test@test.com",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail if email invalid", () => {
            req.body = {
                firstName: "test",
                emailId: "invalid",
                password: "Strong@123"
            };

            validateSignUpData(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail if password weak", () => {
            req.body = {
                firstName: "test",
                emailId: "test@test.com",
                password: "123"
            };

            validateSignUpData(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

    });

    describe("validatePassword", () => {

        test("should return true if password matches", async () => {
            bcrypt.compare.mockResolvedValue(true);

            const result = await validatePassword(
                { password: "hashed" },
                "input"
            );

            expect(result).toBe(true);
        });

        test("should return false if password does not match", async () => {
            bcrypt.compare.mockResolvedValue(false);

            const result = await validatePassword(
                { password: "hashed" },
                "input"
            );

            expect(result).toBe(false);
        });

    });

    describe("validateChangePassword", () => {

        test("should pass valid password change", async () => {
            req.body = {
                password: "Old@123",
                newPassword: "New@123"
            };

            bcrypt.compare
                .mockResolvedValueOnce(true)   // old password valid
                .mockResolvedValueOnce(false); // new password different

            await validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail if passwords missing", async () => {
            req.body = {};

            await validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail if new password weak", async () => {
            req.body = {
                password: "Old@123",
                newPassword: "123"
            };

            await validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail if old password incorrect", async () => {
            req.body = {
                password: "wrong",
                newPassword: "New@123"
            };

            bcrypt.compare.mockResolvedValue(false);

            await validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail if new password same as old", async () => {
            req.body = {
                password: "Old@123",
                newPassword: "Old@123"
            };

            bcrypt.compare
                .mockResolvedValueOnce(true)  // old valid
                .mockResolvedValueOnce(true); // new same

            await validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

    });

    describe("validateEditUserData", () => {

        test("should pass valid fields", () => {
            req.body = { firstName: "test" };

            validateEditUserData(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail if empty body", () => {
            req.body = {};

            validateEditUserData(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail restricted fields", () => {
            req.body = { emailId: "test@test.com" };

            validateEditUserData(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

    });

    describe("validateEditUserPreferencesData", () => {

        test("should pass valid preferences", () => {
            req.body = { categories: ["tech"] };

            validateEditUserPreferencesData(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test("should fail if empty body", () => {
            req.body = {};

            validateEditUserPreferencesData(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        test("should fail restricted fields", () => {
            req.body = { emailId: "test@test.com" };

            validateEditUserPreferencesData(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

    });

});