const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const {
    validateCreateProduct,
    validateUpdateProduct,
    handleValidationErrors,
} = require("../validators/productValidator");

const upload = require("../middleware/upload");


const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put(
    "/:id",
    protect,
    upload.array("images", 2),
    validateUpdateProduct,
    handleValidationErrors,
    updateProduct
);

router.delete(
    "/:id",
    protect,
    deleteProduct
);

router.post(
    "/",
    protect,
    upload.array("images", 2),
    validateCreateProduct,
    handleValidationErrors,
    createProduct
);
module.exports = router;