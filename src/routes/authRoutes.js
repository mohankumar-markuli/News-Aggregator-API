const express = require("express");
const authRouter = express.Router();

const { userSignUp, userLogin } = require("../controllers/authController");
const { validateSignUpData } = require("../middlewares/validator");

authRouter.post('/signup', validateSignUpData, userSignUp);
authRouter.post('/login', userLogin);

module.exports = authRouter;