const getUserProfileService = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        preferences: user.preferences
    };
};

module.exports = {
    getUserProfileService
}