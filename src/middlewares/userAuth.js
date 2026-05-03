const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const userAuth = async (req, res, next) => {
    try {
        // extract token from cookies send by request
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Plase login");
        }

        //validate the token
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY,);
        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports = {
    userAuth
};