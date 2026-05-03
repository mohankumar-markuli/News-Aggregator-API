const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignUpData = (req, res, next) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

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

const validatePassword = async (user, userInputPassword) => {

    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        userInputPassword,
        passwordHash
    );
    return isPasswordValid;
};

const validateChangePassword = async (req, res, next) => {
    try {
        const { password, newPassword } = req.body;

        if (!password || !newPassword) {
            throw new Error("Both old and new passwords are required");
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("New password must be strong");
        }

        const isOldPasswordValid = await validatePassword(req.user, password);
        if (!isOldPasswordValid) {
            throw new Error("Incorrect current password");
        }

        const isNewPasswordSame = await validatePassword(req.user, newPassword);
        if (isNewPasswordSame) {
            throw new Error("New password cannot be same as old password");
        }
        next();

    } catch (err) {
        next(err);
    }
}

module.exports = {
    validateSignUpData,
    validatePassword,
    validateChangePassword
};