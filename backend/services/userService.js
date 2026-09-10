const User = require("../models/User");
const Product = require("../models/Product");

const getMyAccount = async (userId) => {

    const user = await User.findById(userId)
.select(
    "-googleId -__v -updatedAt -lastLogin -isActive"
);

    if (!user) {
        throw new Error("User not found.");
    }

    const products = await Product.find({
    owner: userId,
    isActive: true,
})
.select("-sellerPhone -isActive -__v -owner")
.populate("category", "name slug")
.sort({ createdAt: -1 });


const statistics = {

    totalProducts: products.length,

    totalViews: products.reduce(
        (sum, product) => sum + product.views,
        0
    ),

};



    return {
        user,
        statistics,
        products,

    };
};

module.exports = {
    getMyAccount,
};