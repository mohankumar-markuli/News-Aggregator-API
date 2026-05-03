const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getHashPassword = async (password) => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    return passwordHash;
};

const getJWT = async (user) => {
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
    return token;
};

module.exports = { getHashPassword, getJWT };