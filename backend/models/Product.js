const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        // Google account that owns this listing
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

listingCode: {

    type: String,

    unique: true,

    index: true,

    },

        // Product name
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        // Product description
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        // Optional brand
        brand: {
            type: String,
            trim: true,
            default: "",
            maxlength: 50,
        },

        // Product category
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        // Selling price
        price: {
            type: Number,
            required: true,
            min: 0,
        },

        // Is price negotiable?
        isNegotiable: {
            type: Boolean,
            default: false,
        },

        // Product condition
        condition: {
            type: String,
            enum: [
                "New",
                "Like New",
                "Good",
                "Fair",
                "Needs Repair",
            ],
            required: true,
        },

        // Maximum 2 images
       images: {
    type: [
        {
            url: String,
            publicId: String,
        },
    ],
    default: [],
},

        // Seller contact
        sellerPhone: {
            type: String,
            required: true,
            trim: true,
        },

        // Product availability
        status: {
            type: String,
            enum: [
                "available",
                "reserved",
                "sold",
            ],
            default: "available",
        },

        // Show or hide listing
        isActive: {
            type: Boolean,
            default: true,
        },

        // Product popularity
        views: {
            type: Number,
            default: 0,
        },

       
    },
    {
        timestamps: true,
    }


    

);


// Prevent more than 2 images
// Prevent more than 2 images
productSchema.pre("save", function () {
    if (this.images.length > 2) {
        throw new Error("Maximum of 2 images allowed.");
    }
});

module.exports = mongoose.model("Product", productSchema);