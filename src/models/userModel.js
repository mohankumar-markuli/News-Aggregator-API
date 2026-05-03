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

    lastLogin: Date,

    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    // only hash if not already hashed
    if (this.password.startsWith("$2b$")) return next();

    const bcrypt = require("bcrypt");
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", userSchema);