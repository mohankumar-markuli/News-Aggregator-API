const { getUserProfileService,
    updateUserService,
    changePasswordService
} = require("../services/userServices");

const viewUser = async (req, res, next) => {
    try {
        const data = getUserProfileService(req.user);

        return res.status(200).json({
            message: `User ${req.user.firstName} fetched successfully`,
            data
        });

    } catch (err) {
        return next(err);
    }
};

const editUser = async (req, res, next) => {
    try {
        const data = await updateUserService(req.user, req.body);

        return res.status(200).json({
            message: "Profile Updated Successfully",
            data
        });

    } catch (err) {
        return next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {

        await changePasswordService(
            req.user,
            req.body.newPassword,
        );

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Password Changed Successfully",
        });

    } catch (err) {
        return next(err);
    }
};

module.exports = { viewUser, editUser, changePassword };