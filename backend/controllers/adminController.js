const {
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
} = require("../services/adminService");



const getDashboard = async (req, res) => {

    try {

        const dashboard = await getDashboardData();

        return res.status(200).json({

            success: true,

            dashboard,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

const getProducts = async (req, res) => {

    try {

        const products = await getAllProducts();

        return res.status(200).json({

            success: true,

            products,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

const getProduct = async (req, res) => {

    try {

        const product = await getProductById(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            product,

        });

    } catch (error) {

        console.error(error);

        return res.status(404).json({

            success: false,

            message: error.message,

        });

    }

};

const updateStatus = async (req, res) => {

    try {

        const product = await updateProductStatus(
            req.params.id,
            req.body.isActive
        );

        return res.status(200).json({

            success: true,

            message: product.isActive
                ? "Product activated successfully."
                : "Product deactivated successfully.",

            product,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const editProduct = async (req, res) => {

    try {

        const product = await updateProduct(
            req.params.id,
            req.body
        );

        return res.status(200).json({

            success: true,

            message: "Product updated successfully.",

            product,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

const removeProduct = async (req, res) => {

    try {

        const product = await deleteProduct(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message: "Product deleted successfully.",

            product: {

                _id: product._id,

                listingCode: product.listingCode,

                name: product.name,

            },

        });

    } catch (error) {

        console.error(error);

        return res.status(404).json({

            success: false,

            message: error.message,

        });

    }

};

const getUsers = async (req, res) => {

    try {

        const result = await getAllUsers({

            page: req.query.page,

            limit: req.query.limit,

            search: req.query.search,

            role: req.query.role,

            status: req.query.status,

        });

        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const getUser = async (req, res) => {

    try {

        const result = await getUserById(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        console.error(error);

        return res.status(404).json({

            success: false,

            message: error.message,

        });

    }

};

const updateUserAccountStatus = async (req, res) => {

    try {

        const { isActive } = req.body;

        const user = await updateUserStatus(

            req.params.id,

            isActive,

            req.user._id

        );

        return res.status(200).json({

            success: true,

            message: isActive
                ? "User account activated successfully."
                : "User account disabled successfully.",

            user,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const getCategories = async (req, res) => {

    try {

        const categories =
            await getAllCategories();

        return res.status(200).json({

            success: true,

            categories,

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

const addCategory = async (req, res) => {

    try {

        const category =
            await createCategory(
                req.body.name
            );

        return res.status(201).json({

            success: true,

            message:
                "Category created successfully.",

            category,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

const editCategory = async (req, res) => {

    try {

        const category =
            await updateCategory(

                req.params.id,

                req.body.name

            );

        return res.status(200).json({

            success: true,

            message:
                "Category updated successfully.",

            category,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

const changeCategoryStatus = async (
    req,
    res
) => {

    try {

        const category =
            await updateCategoryStatus(

                req.params.id,

                req.body.isActive

            );

        return res.status(200).json({

            success: true,

            message: req.body.isActive
                ? "Category activated successfully."
                : "Category disabled successfully.",

            category,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


// ==========================================
// ADMIN — Create House
// ==========================================

const createHouseListing = async (req, res) => {

    try {

        // ------------------------------------------
        // Validate uploaded images
        // ------------------------------------------

        if (!req.files || req.files.length === 0) {

            throw new Error(
                "At least one house image is required."
            );

        }


        // ------------------------------------------
        // Convert Cloudinary files
        // to our House image structure
        // ------------------------------------------

        const images = req.files.map((file) => ({

            url: file.path,

            publicId: file.filename,

        }));


        // ------------------------------------------
        // Create house
        // ------------------------------------------

        const house = await createHouse({

            ...req.body,

            images,

        });


        return res.status(201).json({

            success: true,

            message: "House created successfully.",

            house,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const getHouses = async (req, res) => {

    try {

        const result =
            await getAllHouses({

                page: req.query.page,

                limit: req.query.limit,

                search: req.query.search,

                availabilityStatus:
                    req.query.availabilityStatus,

                houseType:
                    req.query.houseType,

                area:
                    req.query.area,

            });


        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const getHouse = async (req, res) => {

    try {

        const house =
            await getHouseById(
                req.params.houseId
            );

        return res.status(200).json({

            success: true,

            house,

        });

    } catch (error) {

        console.error(error);

        return res.status(404).json({

            success: false,

            message: error.message,

        });

    }

};


const updateHouseListing = async (req, res) => {

    try {

        // ------------------------------------------
        // Prepare uploaded images
        // ------------------------------------------

        let images;

        if (req.files && req.files.length > 0) {

            images = req.files.map((file) => ({

                url: file.path,

                publicId: file.filename,

            }));

        }


        // ------------------------------------------
        // Prepare update data
        // ------------------------------------------

        const updateData = {

            ...req.body,

        };


        // Only include images when new images
        // were actually uploaded
        if (images) {

            updateData.images = images;

        }


        // ------------------------------------------
        // Update house
        // ------------------------------------------

        const house = await updateHouse(

            req.params.houseId,

            updateData

        );


        return res.status(200).json({

            success: true,

            message: "House updated successfully.",

            house,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const updateAvailability = async (req, res) => {

    try {

        const {
            availabilityStatus,
        } = req.body;

        const house =
            await updateHouseAvailability(
                req.params.houseId,
                availabilityStatus
            );

        return res.status(200).json({

            success: true,

            message:
                "House availability updated successfully.",

            house,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


const deactivateHouseListing = async (req, res) => {

    try {

        const house =
            await deactivateHouse(
                req.params.houseId
            );

        return res.status(200).json({

            success: true,

            message:
                "House listing deactivated successfully.",

            house,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


module.exports = {
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
};