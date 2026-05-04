const { errorHandler } = require("../../src/middlewares/errorHandler");

describe("error handler middleware tests", () => {

    let req, res;

    beforeEach(() => {
        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test("should use statusCode if provided", () => {
        const err = {
            message: "bad request",
            statusCode: 400
        };

        errorHandler(err, req, res, () => { });

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "bad request"
        });
    });

    test("should use status if statusCode not provided", () => {
        const err = {
            message: "not found",
            status: 404
        };

        errorHandler(err, req, res, () => { });

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "not found"
        });
    });

    test("should default to 500 if no status", () => {
        const err = {
            message: "error"
        };

        errorHandler(err, req, res, () => { });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "error"
        });
    });

    test("should default message if not provided", () => {
        const err = {
            status: 500
        };

        errorHandler(err, req, res, () => { });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal Server Error"
        });
    });

});