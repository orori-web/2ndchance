const Category = require("../models/Category");

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            isActive: true,
        }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getCategories,
};