const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            required: true,
            unique: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        profilePicture: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);