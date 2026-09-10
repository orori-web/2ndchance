const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {

        businessName: {

            type: String,

            default: "Second Chance",

        },

        whatsAppNumber: {

            type: String,

            required: true,

        },

        supportEmail: {

            type: String,

            default: "",

        },

        supportPhone: {

            type: String,

            default: "",

        },

    },
    {

        timestamps: true,

    }
);

module.exports = mongoose.model("Settings", settingsSchema);