const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { viewUser } = require("../controllers/userController");

userRouter.use(userAuth);

userRouter.get('/profile', viewUser);

module.exports = userRouter;