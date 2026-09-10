const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const validateKenyanPhone = require("../utils/validateKenyanPhone");
const House = require("../models/House");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");


const getDashboardData = async () => {

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const activeProducts = await Product.countDocuments({
        isActive: true,
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const productsToday = await Product.countDocuments({
        createdAt: {
            $gte: today,
        },
    });


const recentProducts = await Product.find({
    isActive: true,
})
.select("listingCode name category price images views createdAt")
.populate("category", "name")
.sort({ createdAt: -1 })
.limit(5);


const mostViewedProducts = await Product.find({
    isActive: true,
})
.select("listingCode name price views images")
.populate("category", "name")
.sort({
    views: -1,
    createdAt: -1,
})
.limit(5);

const categoryStats = await Product.aggregate([

    {
        $match: {
            isActive: true,
        },
    },

    {
        $group: {
            _id: "$category",
            totalProducts: {
                $sum: 1,
            },
        },
    },

    {
        $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
        },
    },

    {
        $unwind: "$category",
    },

    {
        $project: {
            _id: 0,
            categoryId: "$category._id",
            name: "$category.name",
            slug: "$category.slug",
            totalProducts: 1,
        },
    },

    {
        $sort: {
            totalProducts: -1,
        },
    },

]);




    return {

        stats: {

            totalUsers,

            totalProducts,

            activeProducts,

            productsToday,

        },

        recentProducts,
        mostViewedProducts,
        categoryStats,

    };

};



const getAllProducts = async () => {

    const products = await Product.find()

        .select(
            "listingCode name description brand category price condition sellerPhone isNegotiable images views isActive createdAt updatedAt"
        )

        .populate(
            "category",
            "name slug"
        )

        .populate(
            "owner",
            "fullName email"
        )

        .sort({
            createdAt: -1,
        });

    return products;

};


const getProductById = async (productId) => {

    const product = await Product.findById(productId)

        .select(
            "listingCode name description brand category price condition sellerPhone isNegotiable images views isActive owner createdAt updatedAt"
        )

        .populate(
            "category",
            "name slug"
        )

        .populate(
            "owner",
            "fullName email role isActive createdAt"
        );

    if (!product) {

        throw new Error("Product not found.");

    }

    return product;

};


const updateProductStatus = async (productId, isActive) => {

    const product = await Product.findById(productId);

    if (!product) {

        throw new Error("Product not found.");

    }

    if (typeof isActive !== "boolean") {

        throw new Error("isActive must be true or false.");

    }

    product.isActive = isActive;

    await product.save();

    return product;

};


const updateProduct = async (productId, data) => {

    const product = await Product.findById(productId);

    if (!product) {

        throw new Error("Product not found.");

    }

    const allowedFields = [
        "name",
        "description",
        "brand",
        "category",
        "price",
        "condition",
        "sellerPhone",
        "isNegotiable",
        "images",
    ];

    for (const field of allowedFields) {

        if (data[field] !== undefined) {

            product[field] = data[field];

        }

    }

    if (data.category !== undefined) {

        const categoryExists = await Category.findById(
            data.category
        );

        if (!categoryExists) {

            throw new Error("Category not found.");

        }

    }

    if (data.condition !== undefined) {

        const allowedConditions = [
            "New",
            "Like New",
            "Good",
            "Fair",
            "Needs Repair",
        ];

        if (!allowedConditions.includes(data.condition)) {

            throw new Error("Invalid product condition.");

        }

    }

    if (data.price !== undefined) {

        const price = Number(data.price);

        if (Number.isNaN(price) || price < 0) {

            throw new Error("Invalid product price.");

        }

        product.price = price;

    }

    if (data.sellerPhone !== undefined) {

        product.sellerPhone = validateKenyanPhone(
            data.sellerPhone
        );

    }

    await product.save();

    await product.populate(
        "category",
        "name slug"
    );

    await product.populate(
        "owner",
        "fullName email role isActive"
    );

    return product;

};


const deleteProduct = async (productId) => {

    const product = await Product.findById(productId);

    if (!product) {

        throw new Error("Product not found.");

    }

    await Product.findByIdAndDelete(productId);

    return product;

};



const getAllUsers = async ({
    page = 1,
    limit = 20,
    search = "",
    role = "",
    status = "",
}) => {

    page = Number(page);
    limit = Number(limit);

    if (page < 1) {
        page = 1;
    }

    if (limit < 1) {
        limit = 20;
    }

    const skip = (page - 1) * limit;

    const filter = {};

    // -----------------------------
    // Search users
    // -----------------------------

    if (search) {

        filter.$or = [
            {
                fullName: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];

    }

    // -----------------------------
    // Filter by role
    // -----------------------------

    if (role) {

        const allowedRoles = [
            "admin",
            "waiter",
            "customer",
        ];

        if (!allowedRoles.includes(role)) {

            throw new Error("Invalid user role.");

        }

        filter.role = role;

    }

    // -----------------------------
    // Filter by account status
    // -----------------------------

    if (status) {

        if (status === "active") {

            filter.isActive = true;

        } else if (status === "disabled") {

            filter.isActive = false;

        } else {

            throw new Error("Invalid user status.");

        }

    }

    // -----------------------------
    // Get users + total count
    // -----------------------------

    const [users, totalUsers] = await Promise.all([

        User.find(filter)
            .select(
                "fullName email role profilePicture isActive createdAt"
            )
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

        User.countDocuments(filter),

    ]);

    // -----------------------------
    // Return clean user data
    // -----------------------------

    const cleanUsers = users.map((user) => {

        return {

            _id: user._id,

            fullName: user.fullName,

            email: user.email,

            role: user.role,

            profilePicture: user.profilePicture,

            isActive: user.isActive,

            createdAt: user.createdAt,

        };

    });

    return {

        users: cleanUsers,

        pagination: {

            page,

            limit,

            totalUsers,

            totalPages: Math.ceil(
                totalUsers / limit
            ),

        },

    };

};


const getUserById = async (userId) => {

    const user = await User.findById(userId)
        .select(
            "fullName email role profilePicture isActive createdAt"
        );

    if (!user) {

        throw new Error("User not found.");

    }

    const products = await Product.find({
        owner: userId,
    })
        .select(
            "listingCode name price images category isActive createdAt"
        )
        .populate(
            "category",
            "name slug"
        )
        .sort({
            createdAt: -1,
        });

    const totalProducts = products.length;

    const activeProducts = products.filter(
        (product) => product.isActive
    ).length;

    const inactiveProducts = products.filter(
        (product) => !product.isActive
    ).length;

    return {

        user: {

            _id: user._id,

            fullName: user.fullName,

            email: user.email,

            role: user.role,

            profilePicture: user.profilePicture,

            isActive: user.isActive,

            createdAt: user.createdAt,

        },

        productStats: {

            totalProducts,

            activeProducts,

            inactiveProducts,

        },

        products,

    };

};


const updateUserStatus = async (userId, isActive, adminUserId) => {

    const user = await User.findById(userId);

    if (!user) {

        throw new Error("User not found.");

    }

    // Prevent admin from disabling their own account
    if (
        user._id.toString() ===
        adminUserId.toString()
    ) {

        throw new Error(
            "You cannot change your own account status."
        );

    }

    if (typeof isActive !== "boolean") {

        throw new Error(
            "isActive must be true or false."
        );

    }

    user.isActive = isActive;

    await user.save();

    return {

        _id: user._id,

        fullName: user.fullName,

        email: user.email,

        role: user.role,

        isActive: user.isActive,

    };

};


const getAllCategories = async () => {

    const categories = await Category.find()
        .sort({
            order: 1,
        });

    const categoriesWithStats = await Promise.all(

        categories.map(async (category) => {

            const totalProducts =
                await Product.countDocuments({
                    category: category._id,
                });

            const activeProducts =
                await Product.countDocuments({
                    category: category._id,
                    isActive: true,
                });

            return {

                _id: category._id,

                name: category.name,

                slug: category.slug,

                order: category.order,

                isActive: category.isActive,

                totalProducts,

                activeProducts,

                createdAt: category.createdAt,

            };

        })

    );

    return categoriesWithStats;

};






const createCategory = async (name) => {

    if (!name || !name.trim()) {

        throw new Error(
            "Category name is required."
        );

    }

    const cleanName = name.trim();

    const existingCategory =
        await Category.findOne({
            name: {
                $regex: `^${cleanName}$`,
                $options: "i",
            },
        });

    if (existingCategory) {

        throw new Error(
            "Category already exists."
        );

    }

    const slug = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Find the highest existing order
    const lastCategory =
        await Category.findOne()
            .sort({
                order: -1,
            });

    const nextOrder = lastCategory
        ? lastCategory.order + 1
        : 1;

    const category = await Category.create({

        name: cleanName,

        slug,

        order: nextOrder,

        isActive: true,

    });

    return category;

};







const updateCategory = async (
    categoryId,
    name
) => {

    if (!name || !name.trim()) {

        throw new Error(
            "Category name is required."
        );

    }

    const category =
        await Category.findById(categoryId);

    if (!category) {

        throw new Error(
            "Category not found."
        );

    }

    const cleanName = name.trim();

    const duplicate =
        await Category.findOne({

            name: {
                $regex: `^${cleanName}$`,
                $options: "i",
            },

            _id: {
                $ne: categoryId,
            },

        });

    if (duplicate) {

        throw new Error(
            "Category already exists."
        );

    }

    const slug = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    category.name = cleanName;

    category.slug = slug;

    await category.save();

    return category;

};





const updateCategoryStatus = async (
    categoryId,
    isActive
) => {

    if (typeof isActive !== "boolean") {

        throw new Error(
            "isActive must be true or false."
        );

    }

    const category =
        await Category.findById(categoryId);

    if (!category) {

        throw new Error(
            "Category not found."
        );

    }

    category.isActive = isActive;

    await category.save();

    return category;

};


const createHouse = async (houseData) => {

    const {
        title,
        houseType,
        description,
        rent,
        deposit,
        area,
        landmark,
        distanceFromCampus,
        bathroomType,
        waterAvailability,
        electricityType,
        securityFeatures,
        parkingAvailable,
        images,
        caretakerName,
        caretakerPhone,
        exactLocation,
    } = houseData;


    // -----------------------------
    // Validate images
    // -----------------------------

    if (!Array.isArray(images)) {

        throw new Error(
            "House images are required."
        );

    }

    if (images.length === 0) {

        throw new Error(
            "At least one house image is required."
        );

    }

    if (images.length > 5) {

        throw new Error(
            "A maximum of 5 images is allowed."
        );

    }


    // -----------------------------
    // Validate caretaker phone
    // -----------------------------

    const normalizedPhone =
        validateKenyanPhone(caretakerPhone);


    // -----------------------------
    // Generate house code
    // -----------------------------

    const lastHouse =
        await House.findOne()
            .sort({
                createdAt: -1,
            })
            .select("houseCode");

    let nextNumber = 1;

    if (
        lastHouse &&
        lastHouse.houseCode
    ) {

        const match =
            lastHouse.houseCode.match(
                /^HC-(\d+)$/
            );

        if (match) {

            nextNumber =
                Number(match[1]) + 1;

        }

    }

    const houseCode =
        `HC-${String(nextNumber).padStart(6, "0")}`;


    // -----------------------------
    // Create house
    // -----------------------------

    const house = await House.create({

        houseCode,

        title,

        houseType,

        description,

        rent,

        deposit,

        area,

        landmark,

        distanceFromCampus,

        bathroomType,

        waterAvailability,

        electricityType,

        securityFeatures,

        parkingAvailable,

        images,

        caretakerName,

        caretakerPhone:
            normalizedPhone,

        exactLocation,

    });


    return house;

};


const getAllHouses = async ({
    page = 1,
    limit = 20,
    search = "",
    availabilityStatus = "",
    houseType = "",
    area = "",
}) => {

    page = Number(page);
    limit = Number(limit);

    if (page < 1) {
        page = 1;
    }

    if (limit < 1) {
        limit = 20;
    }

    if (limit > 50) {
        limit = 50;
    }

    const skip = (page - 1) * limit;

    const filter = {
        isActive: true,
    };


    // -----------------------------
    // Search
    // -----------------------------

    if (search) {

        filter.$or = [

            {
                title: {
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
                area: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                landmark: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                houseCode: {
                    $regex: search,
                    $options: "i",
                },
            },

        ];

    }


    // -----------------------------
    // Availability filter
    // -----------------------------

    if (availabilityStatus) {

        const allowedStatuses = [
            "Available",
            "Occupied",
            "Unknown",
        ];

        if (
            !allowedStatuses.includes(
                availabilityStatus
            )
        ) {

            throw new Error(
                "Invalid availability status."
            );

        }

        filter.availabilityStatus =
            availabilityStatus;

    }


    // -----------------------------
    // House type filter
    // -----------------------------

    if (houseType) {

        const allowedHouseTypes = [
            "Single Room",
            "Bedsitter",
            "1 Bedroom",
            "2 Bedroom",
            "Other",
        ];

        if (
            !allowedHouseTypes.includes(
                houseType
            )
        ) {

            throw new Error(
                "Invalid house type."
            );

        }

        filter.houseType = houseType;

    }


    // -----------------------------
    // Area filter
    // -----------------------------

    if (area) {

        filter.area = {
            $regex: area,
            $options: "i",
        };

    }


    // -----------------------------
    // Get houses + total
    // -----------------------------

    const [
        houses,
        total,
    ] = await Promise.all([

        House.find(filter)

            .sort({
                createdAt: -1,
            })

            .skip(skip)

            .limit(limit),

        House.countDocuments(filter),

    ]);


    return {

        houses,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),

        },

    };

};

const getHouseById = async (houseId) => {

    const house = await House.findById(houseId);

    if (!house) {

        throw new Error("House not found.");

    }

    return house;

};


const updateHouse = async (houseId, updateData) => {

    const house = await House.findById(houseId);

    if (!house) {

        throw new Error("House not found.");

    }

    const oldImages = [...house.images];

    const allowedFields = [
        "title",
        "houseType",
        "description",
        "rent",
        "deposit",
        "area",
        "landmark",
        "distanceFromCampus",
        "bathroomType",
        "waterAvailability",
        "electricityType",
        "securityFeatures",
        "parkingAvailable",
        "images",
        "caretakerName",
        "caretakerPhone",
        "exactLocation",
    ];


    for (const field of allowedFields) {

        if (updateData[field] !== undefined) {

            house[field] = updateData[field];

        }

    }


   // ------------------------------------------
// Validate images
// ------------------------------------------

if (updateData.images !== undefined) {

    if (!Array.isArray(updateData.images)) {

        throw new Error(
            "Images must be an array."
        );

    }

    if (updateData.images.length === 0) {

        throw new Error(
            "At least one house image is required."
        );

    }

    if (updateData.images.length > 5) {

        throw new Error(
            "A maximum of 5 images is allowed."
        );

    }

    for (const image of updateData.images) {

        if (
            !image ||
            typeof image !== "object" ||
            !image.url ||
            !image.publicId
        ) {

            throw new Error(
                "Each image must contain a url and publicId."
            );

        }

    }

}

    // ------------------------------------------
    // Validate caretaker phone
    // ------------------------------------------

    if (
        updateData.caretakerPhone !== undefined
    ) {

        house.caretakerPhone =
            validateKenyanPhone(
                updateData.caretakerPhone
            );

    }


    // ------------------------------------------
    // Don't allow house code modification
    // ------------------------------------------

    if (updateData.houseCode !== undefined) {

        delete updateData.houseCode;

    }


    await house.save();

    // ------------------------------------------
// Delete old Cloudinary images
// ------------------------------------------

if (updateData.images !== undefined) {

    for (const image of oldImages) {

        if (image.publicId) {

            await deleteFromCloudinary(
                image.publicId
            );

        }

    }

}


    return house;

};


const updateHouseAvailability = async (
    houseId,
    availabilityStatus
) => {

    const allowedStatuses = [
        "Available",
        "Occupied",
        "Unknown",
    ];

    if (!allowedStatuses.includes(availabilityStatus)) {

        throw new Error(
            "Invalid availability status."
        );

    }

    const house = await House.findById(houseId);

    if (!house) {

        throw new Error(
            "House not found."
        );

    }

    house.availabilityStatus =
        availabilityStatus;

    house.lastAvailabilityCheck =
        new Date();

    if (
        availabilityStatus === "Available"
    ) {

        house.isVerified = true;

        house.lastVerifiedAt =
            new Date();

    }

    await house.save();

    return house;
};


const deactivateHouse = async (houseId) => {

    const house = await House.findById(houseId);

    if (!house) {

        throw new Error("House not found.");

    }

    house.isActive = false;

    await house.save();

    return house;

};



module.exports = {
    getDashboardData,

    getAllProducts,
    getProductById,
    updateProductStatus,
    updateProduct,
    deleteProduct,

    getAllUsers,
    getUserById,
    updateUserStatus,

    getAllCategories,
    createCategory,
    updateCategory,
    updateCategoryStatus,

    createHouse,
    getAllHouses,
    getHouseById,
    updateHouse,
    updateHouseAvailability,
    deactivateHouse,
};