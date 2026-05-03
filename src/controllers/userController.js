const { getUserProfileService } = require("../services/userServices");

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

module.exports = { viewUser };