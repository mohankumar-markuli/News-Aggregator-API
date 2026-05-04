// mocks
jest.mock("../../src/services/userServices", () => ({
    getUserProfileService: jest.fn(),
    updateUserService: jest.fn(),
    changePasswordService: jest.fn(),
    getUserPreferenceService: jest.fn(),
    updateUserPreferencesService: jest.fn()
}));

const {
    getUserProfileService,
    updateUserService,
    changePasswordService,
    getUserPreferenceService,
    updateUserPreferencesService
} = require("../../src/services/userServices");

const {
    viewUser,
    editUser,
    changePassword,
    viewUserPreferences,
    editUserPreferences
} = require("../../src/controllers/userController");

describe("user controller unit tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            user: {
                _id: "123",
                firstName: "test",
                preferences: {},
                save: jest.fn()
            },
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };

        next = jest.fn();

        jest.clearAllMocks();
    });

    describe("viewUser", () => {

        test("should return user profile", async () => {
            const mockData = { name: "test" };

            getUserProfileService.mockReturnValue(mockData);

            await viewUser(req, res, next);

            expect(getUserProfileService).toHaveBeenCalledWith(req.user);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "User test fetched successfully",
                data: mockData
            });
        });

        test("should call next on error", async () => {
            getUserProfileService.mockImplementation(() => {
                throw new Error("error");
            });

            await viewUser(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    describe("editUser", () => {

        test("should update user", async () => {
            const updated = { firstName: "updated" };

            updateUserService.mockResolvedValue(updated);

            req.body = { firstName: "updated" };

            await editUser(req, res, next);

            expect(updateUserService).toHaveBeenCalledWith(req.user, req.body);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Profile Updated Successfully",
                data: updated
            });
        });

        test("should call next on error", async () => {
            updateUserService.mockRejectedValue(new Error("error"));

            await editUser(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    describe("changePassword", () => {

        test("should change password", async () => {
            changePasswordService.mockResolvedValue(true);

            req.body = { newPassword: "New@123" };

            await changePassword(req, res, next);

            expect(changePasswordService).toHaveBeenCalledWith(
                req.user,
                "New@123"
            );

            expect(res.clearCookie).toHaveBeenCalledWith("token", {
                httpOnly: true,
                sameSite: "strict"
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Password Changed Successfully"
            });
        });

        test("should call next on error", async () => {
            changePasswordService.mockRejectedValue(new Error("error"));

            await changePassword(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    describe("viewUserPreferences", () => {

        test("should return preferences", async () => {
            const mockPrefs = { categories: [] };

            getUserPreferenceService.mockReturnValue(mockPrefs);

            await viewUserPreferences(req, res, next);

            expect(getUserPreferenceService).toHaveBeenCalledWith(req.user.preferences);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "User test fetched successfully",
                preferences: mockPrefs
            });
        });

        test("should call next on error", async () => {
            getUserPreferenceService.mockImplementation(() => {
                throw new Error("error");
            });

            await viewUserPreferences(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

    describe("editUserPreferences", () => {

        test("should update preferences", async () => {
            const updatedPrefs = { categories: ["tech"] };

            updateUserPreferencesService.mockResolvedValue(updatedPrefs);

            req.body = { categories: ["tech"] };

            await editUserPreferences(req, res, next);

            expect(updateUserPreferencesService).toHaveBeenCalledWith(
                req.user.preferences,
                req.body
            );

            expect(req.user.save).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Profile Updated Successfully",
                preferences: updatedPrefs
            });
        });

        test("should call next on error", async () => {
            updateUserPreferencesService.mockRejectedValue(new Error("error"));

            await editUserPreferences(req, res, next);

            expect(next).toHaveBeenCalled();
        });

    });

});