const { body, validationResult } = require("express-validator");

const validateCreateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required.")
        .isLength({ max: 100 })
        .withMessage("Product name cannot exceed 100 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ max: 2000 })
        .withMessage("Description cannot exceed 2000 characters."),

    body("brand")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Brand cannot exceed 50 characters."),

    body("category")
        .notEmpty()
        .withMessage("Category is required."),

    body("price")
        .notEmpty()
        .withMessage("Price is required.")
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than or equal to zero."),

    body("condition")
        .isIn([
            "New",
            "Like New",
            "Good",
            "Fair",
            "Needs Repair",
        ])
        .withMessage("Invalid product condition."),

    body("sellerPhone")
        .trim()
        .notEmpty()
        .withMessage("Seller phone number is required."),

    body("isNegotiable")
        .optional()
        .isBoolean()
        .withMessage("Negotiable must be true or false."),
];



const validateUpdateProduct = [
    body("name")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Product name cannot exceed 100 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Description cannot exceed 2000 characters."),

    body("brand")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Brand cannot exceed 50 characters."),

    body("category")
        .optional()
        .notEmpty()
        .withMessage("Category cannot be empty."),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than or equal to zero."),

    body("condition")
        .optional()
        .isIn([
            "New",
            "Like New",
            "Good",
            "Fair",
            "Needs Repair",
        ])
        .withMessage("Invalid product condition."),

    body("sellerPhone")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Seller phone number cannot be empty."),

    body("isNegotiable")
        .optional()
        .isBoolean()
        .withMessage("Negotiable must be true or false."),
];



const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
};







module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
    handleValidationErrors,
};