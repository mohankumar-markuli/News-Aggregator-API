const User = require("../models/userModel")

const { getJWT, getHashPassword } = require("../services/authServices");
const { validatePassword } = require("../middlewares/validator");

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

const userLogin = async (req, res, next) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            const err = new Error("Email and password are required");
            err.statusCode = 400;
            throw err;
        }

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            const err = new Error("User not found. Please sign up.");
            err.statusCode = 404;
            throw err;
        }

        // compare pwd with the hash pwd in DB 
        const isPasswordValid = await validatePassword(user, password);
        if (isPasswordValid) {
            const token = await getJWT(user);

            const userResponse = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                preferences: user.preferences
            };


            // Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 8 * 60 * 60 * 1000
            });

            res.status(200).json({
                message: `${user.firstName} Logged In Successfully`,
                data: userResponse
            });
        }
        else {
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            throw err;
        }

    } catch (err) {
        next(err);
    }
};

const userlogout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
        });
        res.json({
            message: `Logout Successful`,
        });;
    } catch (err) {
        next(err);
    }
}

module.exports = {
    userSignUp, userLogin, userlogout
}