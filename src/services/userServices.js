const { getHashPassword } = require("../services/authServices");

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

const getUserPreferenceService = (preferences) => {
    return {
        categories: preferences.categories,
        languages: preferences.languages,
        country: preferences.country,
    };
};

const updateUserPreferencesService = (preferences, body) => {
    if (body.categories !== undefined) {
        preferences.categories = body.categories;
    }

    if (body.languages !== undefined) {
        preferences.languages = body.languages;
    }

    if (body.country !== undefined) {
        preferences.country = body.country;
    }

    return preferences;
};

module.exports = {
    getUserProfileService,
    updateUserService,
    changePasswordService,
    getUserPreferenceService,
    updateUserPreferencesService
}