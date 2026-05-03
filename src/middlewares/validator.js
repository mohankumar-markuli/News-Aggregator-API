const validator = require("validator");

const validateSignUpData = (req, res, next) => {
    try {
        const { firstName, lastName, emailId, password, preferences } = req.body;

        if (!firstName) {
            throw new Error("First name is required");
        }

        if (!emailId || !validator.isEmail(emailId)) {
            throw new Error("Valid email is required");
        }

        if (!password || !validator.isStrongPassword(password)) {
            throw new Error("Strong password is required");
        }

        next();

    } catch (err) {
        next(err);
    }
}

module.exports = {
    validateSignUpData
};