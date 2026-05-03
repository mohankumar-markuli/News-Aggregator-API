const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { viewUser, editUser, changePassword } = require("../controllers/userController");
const { validateChangePassword } = require("../middlewares/validator");

userRouter.use(userAuth);

userRouter.get('/profile', viewUser);
userRouter.patch('/profile', editUser);
userRouter.patch('/password', validateChangePassword, changePassword);

module.exports = userRouter;