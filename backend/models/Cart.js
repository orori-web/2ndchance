const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        guestCartId: {
            type: String,
            default: null,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

cartSchema.index(
    { user: 1 },
    {
        unique: true,
        partialFilterExpression: {
            user: { $type: "objectId" },
        },
    }
);

cartSchema.index(
    { guestCartId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            guestCartId: { $type: "string" },
        },
    }
);

module.exports = mongoose.model(
    "Cart",
    cartSchema
);