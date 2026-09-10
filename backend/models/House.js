const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
    {
        houseCode: {
            type: String,
            unique: true,
            trim: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        houseType: {
            type: String,
            required: true,
            enum: [
                "Single Room",
                "Bedsitter",
                "1 Bedroom",
                "2 Bedroom",
                "Other",
            ],
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        rent: {
            type: Number,
            required: true,
            min: 0,
        },

        deposit: {
            type: Number,
            required: true,
            min: 0,
        },

        area: {
            type: String,
            required: true,
            trim: true,
        },

        landmark: {
            type: String,
            trim: true,
        },

        distanceFromCampus: {
            type: String,
            trim: true,
        },

        bathroomType: {
            type: String,
            enum: [
                "Private",
                "Shared",
            ],
            default: "Private",
        },

        waterAvailability: {
            type: String,
            enum: [
                "Available",
                "Unreliable",
                "Not Available",
                "Unknown",
            ],
            default: "Unknown",
        },

        electricityType: {
            type: String,
            enum: [
                "Token",
                "Included in rent",
                "Separate Meter",
                "Landlord Managed",
                "Unknown",
            ],
            default: "Unknown",
        },

        securityFeatures: [
            {
                type: String,
                trim: true,
            },
        ],

        parkingAvailable: {
            type: Boolean,
            default: false,
        },

        images: [
            {
                url: {
                    type: String,
                    required: true,
                },

                publicId: {
                    type: String,
                    required: true,
                },
            },
        ],

        availabilityStatus: {
            type: String,
            enum: [
                "Available",
                "Occupied",
                "Unknown",
            ],
            default: "Unknown",
            index: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
            index: true,
        },

        lastVerifiedAt: {
            type: Date,
            default: null,
        },

        caretakerName: {
            type: String,
            trim: true,
        },

        caretakerPhone: {
            type: String,
            required: true,
            trim: true,
        },

        exactLocation: {
            type: String,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        lastAvailabilityCheck: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("House", houseSchema);