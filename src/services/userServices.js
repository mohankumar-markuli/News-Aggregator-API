const getUserProfileService = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
    };
};

const updateUserService = async (user, updateData) => {
    Object.keys(updateData).forEach((key) => {
        user[key] = updateData[key];
    });

    await user.save();

    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
    };
};

const changePasswordService = async (user, newPassword) => {
    const newPasswordHash = await getHashPassword(newPassword);

    user.password = newPasswordHash;
    await user.save();

    return true;
};

module.exports = {
    getUserProfileService,
    updateUserService,
    changePasswordService
}