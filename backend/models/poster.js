const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema(
    {
        // Poster image
        image: {
            url: {
                type: String,
                required: true,
                trim: true,
            },

            publicId: {
                type: String,
                required: true,
                trim: true,
            },
        },




        // Optional poster title
        title: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },

        // Optional destination when poster is clicked
        link: {
            type: String,
            trim: true,
            default: "",
        },

        // Where the poster appears on the homepage
placement: {
    type: String,
    required: true,
    enum: [
        "top-banner",
        "banner-2",
        "banner-3",
        "banner-4",
    ],
},

        // Whether the poster appears on the homepage
        isActive: {
            type: Boolean,
            default: true,
        },

        // Controls poster position
        displayOrder: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Poster", posterSchema);