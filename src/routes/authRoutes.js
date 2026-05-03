const express = require("express");
const authRouter = express.Router();

const { userSignUp } = require("../controllers/authController");
const { validateSignUpData } = require("../middlewares/validator");

authRouter.post('/signup', validateSignUpData, userSignUp);

module.exports = authRouter;