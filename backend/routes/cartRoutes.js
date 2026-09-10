const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    addProductToCart,
    getUserCart,
    removeProductFromCart,
    clearUserCart,
    placeUserOrder,
    mergeGuestCartController,
} = require("../controllers/cartController");

const optionalAuth =
    require("../middleware/optionalAuth");


    console.log("optionalAuth:", typeof optionalAuth);
console.log("getUserCart:", typeof getUserCart);

router.get(
    "/",
    optionalAuth,
    getUserCart
);

router.post(
    "/place-order",
    optionalAuth,
    placeUserOrder
);

router.post(
    "/merge",
    protect,
    mergeGuestCartController
);

router.post(
    "/:productId",
    optionalAuth,
    addProductToCart
);

router.delete(
    "/:productId",
    optionalAuth,
    removeProductFromCart
);

router.delete(
    "/",
    optionalAuth,
    clearUserCart
);



module.exports = router;