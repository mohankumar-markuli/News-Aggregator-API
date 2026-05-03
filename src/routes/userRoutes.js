const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { viewUser, editUser } = require("../controllers/userController");

userRouter.use(userAuth);

userRouter.get('/profile', viewUser);
userRouter.patch('/profile', editUser);

module.exports = userRouter;