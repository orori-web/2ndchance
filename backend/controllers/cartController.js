const {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    placeOrder,
    mergeGuestCart,
} = require("../services/cartService");


const getCartIdentity = (req) => {

    const userId =
        req.user?._id || null;

    const guestCartId =
        req.headers["x-cart-id"] || null;

    if (!userId && !guestCartId) {

        throw new Error(
            "Cart identity is required."
        );

    }

    return {
        userId,
        guestCartId,
    };

};

const addProductToCart = async (req, res) => {

    try {

        const { productId } = req.params;

        const result = await addToCart({

    ...getCartIdentity(req),

    productId,

});

        return res.status(200).json({

            success: true,

            message: result.message,

            cart: result.cart,

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const getUserCart = async (req, res) => {

    try {

        const result = await getCart(
    getCartIdentity(req)
);

        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



const removeProductFromCart = async (req, res) => {

    try {

        const result = await removeFromCart({

    ...getCartIdentity(req),

    productId: req.params.productId,

});

        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



const clearUserCart = async (req, res) => {

    try {

        const result = await clearCart(
    getCartIdentity(req)
);

        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

const placeUserOrder = async (req, res) => {

    try {

        const result = await placeOrder(
    getCartIdentity(req)
);

        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const mergeGuestCartController = async (req, res) => {

    try {

        // This endpoint must be used by
        // an authenticated customer.
        if (!req.user?._id) {

            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });

        }

        const guestCartId =
            req.headers["x-cart-id"] || null;

        if (!guestCartId) {

            return res.status(400).json({
                success: false,
                message: "Guest cart ID is required.",
            });

        }

        const result = await mergeGuestCart({

            guestCartId,

            userId: req.user._id,

        });

        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        console.error(
            "Guest cart merge failed:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



module.exports = {

    addProductToCart,

    getUserCart,

    removeProductFromCart,

    clearUserCart,

    placeUserOrder,

    mergeGuestCartController

};