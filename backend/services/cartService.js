const Cart = require("../models/Cart");
const Product = require("../models/Product");


const populateCart = async (cart) => {

    await cart.populate({

        path: "items.product",

        select: "listingCode name price images isActive",

        populate: {

            path: "category",

            select: "name slug",

        },

    });

    return cart;

};


const findCart = async ({
    userId,
    guestCartId,
}) => {

    if (userId) {

        return Cart.findOne({
            user: userId,
        });

    }

    if (guestCartId) {

        return Cart.findOne({
            guestCartId,
        });

    }

    return null;
};


const addToCart = async ({
    userId,
    guestCartId,
    productId,
}) => {

    const product = await Product.findOne({
        _id: productId,
        isActive: true,
    });

    if (!product) {
        throw new Error("Product not found.");
    }

    if (!userId && !guestCartId) {
    throw new Error("Cart identity is required.");
}

    let cart = await findCart({
    userId,
    guestCartId,
});

    if (!cart) {

       cart = new Cart({

    user: userId || null,

    guestCartId: userId
        ? null
        : guestCartId,

    items: [],

});

    }

    const alreadyExists = cart.items.some(

        (item) => item.product.toString() === productId

    );

   if (alreadyExists) {

       await populateCart(cart);

    return {

        message: "Product already exists in cart.",

        cart,

    };

}

    cart.items.push({

        product: productId,

    });

    await cart.save();

  await populateCart(cart);

    return {

        message: "Product added to cart.",

        cart,

    };

};



const getCart = async ({
    userId,
    guestCartId,
}) => {

    let cart = await findCart({
    userId,
    guestCartId,
});

    // User has never created a cart

    if (!cart) {

        return {

            cart: {

                items: [],

            },

            recommendations: [],

        };

    }

    await populateCart(cart);

    // Remove deleted or inactive products

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(

        (item) => item.product && item.product.isActive

    );

    if (cart.items.length !== originalLength) {

        await cart.save();

    }

    // Prepare clean cart items

    const cleanItems = cart.items.map((item) => {

        const product = item.product.toObject();

        delete product.isActive;

        return {

            _id: item._id,

            addedAt: item.addedAt,

            product,

        };

    });

    // -----------------------------
    // Recommendation Engine
    // -----------------------------

    const cartProductIds = cleanItems.map(

        (item) => item.product._id.toString()

    );

    const categoryIds = [

        ...new Set(

            cleanItems.map(

                (item) => item.product.category._id.toString()

            )

        ),

    ];

    let recommendations = [];

    for (const categoryId of categoryIds) {

        const products = await Product.find({

            category: categoryId,

            isActive: true,

            _id: {

                $nin: [

                    ...cartProductIds,

                    ...recommendations.map(

                        (product) => product._id.toString()

                    ),

                ],

            },

        })
       .select("listingCode name description brand price images category isNegotiable condition status views createdAt")

        .populate("category", "name slug")
        .limit(2);

        recommendations.push(...products);

        if (recommendations.length >= 8) {

            recommendations = recommendations.slice(0, 8);

            break;

        }

    }


    // Fill remaining recommendations with most viewed products

if (recommendations.length < 8) {

    const extraProducts = await Product.find({

        isActive: true,

        _id: {

            $nin: [

                ...cartProductIds,

                ...recommendations.map(

                    (product) => product._id.toString()

                ),

            ],

        },

    })
   .select(
    "listingCode name description brand price images category isNegotiable condition status views createdAt"
)
    .populate("category", "name slug")
    .sort({

        views: -1,

        createdAt: -1,

    })
    .limit(8 - recommendations.length);

    recommendations.push(...extraProducts);

}


    return {

        cart: {

            items: cleanItems,

        },

        recommendations,

    };

};









const removeFromCart = async ({
    userId,
    guestCartId,
    productId,
}) => {

    const cart = await findCart({
    userId,
    guestCartId,
});

    // No cart yet

    if (!cart) {

        return {

            message: "Cart is empty.",

            items: [],

        };

    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(

        (item) => item.product.toString() !== productId

    );

    // Product wasn't in cart

    if (cart.items.length === originalLength) {

        await populateCart(cart);

        return {

            message: "Product not found in cart.",

            cart,

        };

    }

    await cart.save();

    await populateCart(cart);

    return {

        message: "Product removed from cart.",

        cart,

    };

};


const clearCart = async ({
    userId,
    guestCartId,
}) => {

    const cart = await findCart({
    userId,
    guestCartId,
});

    // User has no cart yet

    if (!cart) {

        return {

            message: "Cart is already empty.",

            cart: {

                items: [],

            },

        };

    }

    cart.items = [];

    await cart.save();

    return {

        message: "Cart cleared successfully.",

        cart: {

            items: [],

        },

    };

};


const placeOrder = async ({
    userId,
    guestCartId,
}) => {

    const cart = await findCart({
    userId,
    guestCartId,
});

if (!cart || cart.items.length === 0) {

    throw new Error("Your cart is empty.");

}

await populateCart(cart);

    if (!cart || cart.items.length === 0) {

        throw new Error("Your cart is empty.");

    }

    const availableItems = cart.items.filter(

        (item) => item.product && item.product.isActive

    );

    if (availableItems.length === 0) {

        throw new Error("No available products in your cart.");

    }

    let message = "Hello, I'd like to order the following items:\n\n";

    availableItems.forEach((item, index) => {

       message += `${index + 1}. ${item.product.name}\n`;

message += `Listing: ${item.product.listingCode}\n`;

message += `Price: KSh ${item.product.price.toLocaleString()}\n\n`;

    });

    return {

        message,

    };

};

const mergeGuestCart = async ({
    guestCartId,
    userId,
}) => {

    if (!guestCartId || !userId) {
        throw new Error("Guest cart ID and user ID are required.");
    }

    const guestCart = await Cart.findOne({
        guestCartId,
    });

    // Nothing to merge
    if (!guestCart || guestCart.items.length === 0) {
        return {
            message: "No guest cart to merge.",
        };
    }

    let userCart = await Cart.findOne({
        user: userId,
    });

    // User has no cart yet
    if (!userCart) {

        userCart = new Cart({
            user: userId,
            guestCartId: null,
            items: [],
        });

    }

    // Existing product IDs in user's cart
    const existingProductIds = new Set(
        userCart.items.map(
            (item) => item.product.toString()
        )
    );

    // Add guest products that aren't already present
    for (const item of guestCart.items) {

        const productId =
            item.product.toString();

        if (!existingProductIds.has(productId)) {

            userCart.items.push({
                product: item.product,
                addedAt: item.addedAt,
            });

            existingProductIds.add(productId);
        }
    }

    await userCart.save();

    // Guest cart is no longer needed
    await Cart.deleteOne({
        _id: guestCart._id,
    });

    await populateCart(userCart);

    return {
        message: "Guest cart merged successfully.",
        cart: userCart,
    };
};


module.exports = {

    addToCart,

    getCart,

    removeFromCart,

    clearCart,

    placeOrder,

    mergeGuestCart,

};