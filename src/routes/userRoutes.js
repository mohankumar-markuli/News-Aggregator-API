const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { viewUser, editUser, changePassword } = require("../controllers/userController");
const { validateEditUserData, validateChangePassword } = require("../middlewares/validator");

userRouter.use(userAuth);

userRouter.get('/profile', viewUser);
userRouter.patch('/profile', validateEditUserData, editUser);
userRouter.patch('/password', validateChangePassword, changePassword);

module.exports = userRouter;