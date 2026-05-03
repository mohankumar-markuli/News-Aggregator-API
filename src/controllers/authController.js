const User = require("../models/userModel")

const { getJWT, getHashPassword } = require("../services/authServices");

const userSignUp = async (req, res, next) => {
    try {

        const { firstName, lastName, emailId, password, preferences } = req.body;

        const existingUser = await User.findOne({ emailId });

        if (existingUser) {
            const err = new Error("User already exists");
            err.statusCode = 400;
            throw err;
        }

        const passwordHash = await getHashPassword(password);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            preferences
        });

        const savedUser = await user.save();

        const token = await getJWT(savedUser);

        const userResponse = {
            _id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            emailId: savedUser.emailId,
            currency: savedUser.preferences
        };

        // Add the token to cookie and send the response back to the user
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: `User ${savedUser.firstName} registered successfully`,
            data: userResponse
        });
    }
    catch (err) {
        next(err);
    }
};

module.exports = {
    userSignUp,
}