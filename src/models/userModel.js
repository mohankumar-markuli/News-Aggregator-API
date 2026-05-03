const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a Strong Password");
            }
        }
    },
    preferences: {
        categories: {
            type: [String],
            default: []
        },
        languages: {
            type: [String],
            default: []
        },
        country: {
            type: String,
            default: "in"
        }
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);