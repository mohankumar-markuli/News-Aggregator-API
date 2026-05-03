const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { viewUser, editUser, changePassword, viewUserPreferences, editUserPreferences } = require("../controllers/userController");
const { validateEditUserData, validateEditUserPreferencesData, validateChangePassword } = require("../middlewares/validator");

userRouter.use(userAuth);

userRouter.get('/profile', viewUser);
userRouter.patch('/profile', validateEditUserData, editUser);
userRouter.patch('/password', validateChangePassword, changePassword);

userRouter.get("/preferences", viewUserPreferences);
userRouter.put("/preferences", validateEditUserPreferencesData, editUserPreferences);


module.exports = userRouter; 