const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const validateKenyanPhone = require("../utils/validateKenyanPhone");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");
const Counter = require("../models/Counter");

const createProduct = async (productData) => {
    const {
        owner,
        name,
        description,
        brand,
        category,
        price,
        condition,
        sellerPhone,
        isNegotiable,
        images,
    } = productData;

    // Check that the owner exists
    const user = await User.findById(owner);

    if (!user) {
        throw new Error("User not found.");
    }

    // Check that the category exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
        throw new Error("Category not found.");
    }

    // Validate and normalize phone number
    const normalizedPhone = validateKenyanPhone(sellerPhone);

    const counter = await Counter.findOneAndUpdate(

    {
        name: "listingCode",
    },

    {
        $inc: {
            value: 1,
        },
    },

    {
        new: true,
        upsert: true,
    }

);

const listingCode = `SC-${String(counter.value).padStart(6, "0")}`;

    // Create the product
    const product = await Product.create({
        owner,
        listingCode,
        name,
        description,
        brand,
        category,
        price,
        condition,
        sellerPhone: normalizedPhone,
        isNegotiable,
        images,
    });

    return product;
};




const getProducts = async ({
    page = 1,
    limit = 20,
    search = "",
    category = "",
    condition = "",
    minPrice,
    maxPrice,
    brand = "",
    sort = "latest",
}) => {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

const filter = {
    isActive: true,
};

if (search) {
    filter.$or = [
        {
            name: {
                $regex: search,
                $options: "i",
            },
        },
        {
            description: {
                $regex: search,
                $options: "i",
            },
        },
        {
            brand: {
                $regex: search,
                $options: "i",
            },
        },
    ];
}


if (category) {
    const categoryDoc = await Category.findOne({
        slug: category,
        isActive: true,
    });

    if (!categoryDoc) {
        throw new Error("Category not found.");
    }

    filter.category = categoryDoc._id;
}

if (condition) {
    const allowedConditions = [
        "New",
        "Like New",
        "Good",
        "Fair",
        "Needs Repair",
    ];

    if (!allowedConditions.includes(condition)) {
        throw new Error("Invalid product condition.");
    }

    filter.condition = condition;
}


if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
    }

    if (
        Number.isNaN(filter.price.$gte) ||
        Number.isNaN(filter.price.$lte)
    ) {
        throw new Error("Invalid price range.");
    }

    if (
        filter.price.$gte !== undefined &&
        filter.price.$lte !== undefined &&
        filter.price.$gte > filter.price.$lte
    ) {
        throw new Error("Minimum price cannot be greater than maximum price.");
    }
}

if (brand) {
    filter.brand = {
        $regex: `^${brand}$`,
        $options: "i",
    };
}


let sortOption = {
    createdAt: -1,
};

switch (sort) {
    case "oldest":
        sortOption = {
            createdAt: 1,
        };
        break;

    case "priceLow":
        sortOption = {
            price: 1,
        };
        break;

    case "priceHigh":
        sortOption = {
            price: -1,
        };
        break;

    case "popular":
        sortOption = {
            views: -1,
        };
        break;

    case "latest":
    default:
        sortOption = {
            createdAt: -1,
        };
}


   const totalProducts = await Product.countDocuments(filter);

 const products = await Product.find(
    filter,
    "-sellerPhone -__v -isActive"
)
    .populate("category", "name slug")
    .populate("owner", "fullName profilePicture")
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

    return {
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
    };
};



const getProductById = async (productId) => {
    const product = await Product.findOneAndUpdate(
        {
            _id: productId,
            isActive: true,
        },
        {
            $inc: {
                views: 1,
            },
        },
        {
            new: true,
        }
    )
        .select("-sellerPhone -__v -isActive")
        .populate("category", "name slug")
        .populate("owner", "fullName profilePicture");

    if (!product) {
        throw new Error("Product not found.");
    }

    return product;
};


const updateProduct = async (
    productId,
    userId,
    userRole,
    updateData,
    images
) => {
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
        throw new Error("Product not found.");
    }

  const isOwner =
    product.owner.toString() === userId.toString();

const isAdmin = userRole === "admin";

if (!isOwner && !isAdmin) {
    throw new Error("You are not allowed to edit this product.");
}

    // Allowed fields only
    const allowedFields = [
        "name",
        "description",
        "brand",
        "category",
        "price",
        "condition",
        "sellerPhone",
        "isNegotiable",
    ];

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            product[field] = updateData[field];
        }
    }

    // Revalidate phone if it changes
    if (updateData.sellerPhone) {
        product.sellerPhone = validateKenyanPhone(
            updateData.sellerPhone
        );
    }

    // Check category if it changes
    if (updateData.category) {
        const categoryExists = await Category.findById(
            updateData.category
        );

        if (!categoryExists) {
            throw new Error("Category not found.");
        }
    }

// Replace images only if new ones were uploaded
if (images && images.length > 0) {

    // Delete old images from Cloudinary
    for (const image of product.images) {
        await deleteFromCloudinary(image.publicId);
    }

    // Save new images
    product.images = images;
}



    await product.save();

    return product.populate("category", "name slug");
};


const deleteProduct = async (
    productId,
    userId,
    userRole
) => {
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
        throw new Error("Product not found.");
    }

  const isOwner =
    product.owner.toString() === userId.toString();

const isAdmin = userRole === "admin";

if (!isOwner && !isAdmin) {
    throw new Error("You are not allowed to delete this product.");
}


// Delete all product images from Cloudinary
for (const image of product.images) {
    await deleteFromCloudinary(image.publicId);
}


    product.isActive = false;

    await product.save();

    return;
};





module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};