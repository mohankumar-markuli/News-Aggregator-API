// mocks
jest.mock("jsonwebtoken");
jest.mock("../../src/models/userModel");

const jwt = require("jsonwebtoken");
const User = require("../../src/models/userModel");

const { userAuth } = require("../../src/middlewares/userAuth");

describe("user auth middleware tests", () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        next = jest.fn();

        process.env.JWT_SECRET_KEY = "test_secret";

        jest.clearAllMocks();
    });

    test("should authenticate user and call next", async () => {
        req.cookies.token = "validToken";

        const mockUser = { _id: "123", firstName: "test" };

        jwt.verify.mockReturnValue({ _id: "123" });
        User.findById.mockResolvedValue(mockUser);

        await userAuth(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            "validToken",
            "test_secret"
        );

        expect(User.findById).toHaveBeenCalledWith("123");

        expect(req.user).toBe(mockUser);
        expect(next).toHaveBeenCalled();
    });

    test("should return 401 if token missing", async () => {
        req.cookies = {};

        await userAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Plase login");
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 if token invalid", async () => {
        req.cookies.token = "invalidToken";

        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid token");
        });

        await userAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Invalid token");
    });

    test("should return 401 if user not found", async () => {
        req.cookies.token = "validToken";

        jwt.verify.mockReturnValue({ _id: "123" });
        User.findById.mockResolvedValue(null);

        await userAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("User not found");
    });

});