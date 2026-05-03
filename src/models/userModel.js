const mongoose = require("mongoose");
const validator = require("validator");

const CATEGORY_ENUM = ["business", "technology", "sports", "health", "science", "entertainment"];
const LANGUAGE_ENUM = ["en", "hi", "fr", "de"];
const COUNTRY_ENUM = ["in", "us", "uk"];

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
            enum: CATEGORY_ENUM,
            default: []
        },
        languages: {
            type: [String],
            enum: LANGUAGE_ENUM,
            default: []
        },
        countries: {
            type: String,
            enum: COUNTRY_ENUM,
            default: "in"
        }
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);