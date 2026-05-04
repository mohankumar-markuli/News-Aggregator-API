// mocks
jest.mock("../../src/services/authServices", () => ({
    getHashPassword: jest.fn()
}));

const { getHashPassword } = require("../../src/services/authServices");

const {
    getUserProfileService,
    updateUserService,
    changePasswordService,
    getUserPreferenceService,
    updateUserPreferencesService
} = require("../../src/services/userServices");

describe("user services tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getUserProfileService", () => {

        test("should return formatted user profile", () => {
            const user = {
                _id: "123",
                firstName: "test",
                lastName: "user",
                emailId: "test@test.com",
                preferences: {}
            };

            const result = getUserProfileService(user);

            expect(result).toEqual({
                _id: "123",
                firstName: "test",
                lastName: "user",
                emailId: "test@test.com",
                preferences: {}
            });
        });

    });

    describe("updateUserService", () => {

        test("should update user and return updated data", async () => {
            const user = {
                _id: "123",
                firstName: "old",
                lastName: "name",
                emailId: "test@test.com",
                save: jest.fn().mockResolvedValue(true)
            };

            const result = await updateUserService(user, {
                firstName: "new"
            });

            expect(user.firstName).toBe("new");
            expect(user.save).toHaveBeenCalled();

            expect(result.firstName).toBe("new");
        });

        test("should handle empty update data", async () => {
            const user = {
                _id: "123",
                firstName: "test",
                lastName: "user",
                emailId: "test@test.com",
                save: jest.fn().mockResolvedValue(true)
            };

            const result = await updateUserService(user, {});

            expect(user.save).toHaveBeenCalled();
            expect(result.firstName).toBe("test");
        });

        test("should throw if save fails", async () => {
            const user = {
                save: jest.fn().mockRejectedValue(new Error("db error"))
            };

            await expect(
                updateUserService(user, { firstName: "fail" })
            ).rejects.toThrow("db error");
        });

    });

    describe("changePasswordService", () => {

        test("should hash password and save", async () => {
            getHashPassword.mockResolvedValue("hashed");

            const user = {
                password: "old",
                save: jest.fn().mockResolvedValue(true)
            };

            const result = await changePasswordService(user, "new");

            expect(getHashPassword).toHaveBeenCalledWith("new");
            expect(user.password).toBe("hashed");
            expect(user.save).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test("should throw if hashing fails", async () => {
            getHashPassword.mockRejectedValue(new Error("hash error"));

            const user = { save: jest.fn() };

            await expect(
                changePasswordService(user, "new")
            ).rejects.toThrow("hash error");
        });

        test("should throw if save fails", async () => {
            getHashPassword.mockResolvedValue("hashed");

            const user = {
                save: jest.fn().mockRejectedValue(new Error("db error"))
            };

            await expect(
                changePasswordService(user, "new")
            ).rejects.toThrow("db error");
        });

    });

    describe("getUserPreferenceService", () => {

        test("should return preferences", () => {
            const prefs = {
                categories: ["tech"],
                languages: ["en"],
                country: "in"
            };

            const result = getUserPreferenceService(prefs);

            expect(result).toEqual(prefs);
        });

    });

    describe("updateUserPreferencesService", () => {

        test("should update all fields", () => {
            const prefs = {
                categories: [],
                languages: [],
                country: "in"
            };

            const result = updateUserPreferencesService(prefs, {
                categories: ["tech"],
                languages: ["en"],
                country: "us"
            });

            expect(result.categories).toEqual(["tech"]);
            expect(result.languages).toEqual(["en"]);
            expect(result.country).toBe("us");
        });

        test("should update partial fields", () => {
            const prefs = {
                categories: [],
                languages: [],
                country: "in"
            };

            const result = updateUserPreferencesService(prefs, {
                categories: ["tech"]
            });

            expect(result.categories).toEqual(["tech"]);
            expect(result.languages).toEqual([]);
        });

    });

});