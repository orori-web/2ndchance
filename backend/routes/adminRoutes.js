const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const uploadHouseImages = require("../middleware/houseUpload");
const {
    getDashboard,

    getProducts,
    getProduct,
    updateStatus,
    editProduct,
    removeProduct,

    getUsers,
    getUser,
    updateUserAccountStatus,

    getCategories,
    addCategory,
    editCategory,
    changeCategoryStatus,

   createHouseListing,
   getHouses,
   getHouse,
   updateHouseListing,
   updateAvailability,
   deactivateHouseListing,
} = require("../controllers/adminController");
const router = express.Router();

router.get(
    "/dashboard",
    protect,
    adminOnly,
    getDashboard
);

router.get(
    "/products",
    protect,
    adminOnly,
    getProducts
);

router.get(
    "/products/:id",
    protect,
    adminOnly,
    getProduct
);

router.patch(
    "/products/:id",
    protect,
    adminOnly,
    editProduct
);

router.patch(
    "/products/:id/status",
    protect,
    adminOnly,
    updateStatus
);

router.delete(
    "/products/:id",
    protect,
    adminOnly,
    removeProduct
);

router.get(
    "/users",
    protect,
    adminOnly,
    getUsers
);

router.get(
    "/users/:id",
    protect,
    adminOnly,
    getUser
);

router.patch(
    "/users/:id/status",
    protect,
    adminOnly,
    updateUserAccountStatus
);

router.get(
    "/categories",
    protect,
    adminOnly,
    getCategories
);

router.post(
    "/categories",
    protect,
    adminOnly,
    addCategory
);

router.patch(
    "/categories/:id",
    protect,
    adminOnly,
    editCategory
);

router.patch(
    "/categories/:id/status",
    protect,
    adminOnly,
    changeCategoryStatus
);


router.post(
    "/houses",
    protect,
    adminOnly,
    uploadHouseImages.array("images", 5),
    createHouseListing
);

router.get(
    "/houses",
    protect,
    adminOnly,
    getHouses
);

router.get(
    "/houses/:houseId",
    protect,
    adminOnly,
    getHouse
);

router.patch(
    "/houses/:houseId",
    protect,
    adminOnly,
    uploadHouseImages.array("images", 5),
    updateHouseListing
);

router.patch(
    "/houses/:houseId/availability",
    protect,
    adminOnly,
    updateAvailability
);

router.delete(
    "/houses/:houseId",
    protect,
    adminOnly,
    deactivateHouseListing
);

module.exports = router;