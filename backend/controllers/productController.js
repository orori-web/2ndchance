const {
    createProduct: createProductService,
    getProducts: getProductsService,
    getProductById: getProductByIdService,
    updateProduct: updateProductService,
    deleteProduct: deleteProductService,
} = require("../services/productService");


const createProduct = async (req, res) => {
    try {


console.log("BODY:");
console.log(req.body);

console.log("FILES:");
console.log(req.files);

        const images =
            req.files?.map(file => ({
                url: file.path,
                publicId: file.filename,
            })) || [];

        const product = await createProductService({
            owner: req.user._id,

            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            category: req.body.category,
            price: req.body.price,
            condition: req.body.condition,
            sellerPhone: req.body.sellerPhone,
            isNegotiable: req.body.isNegotiable,

            images,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product,
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
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;


const result = await getProductsService({
    page,
    limit,
    search: req.query.search,
    category: req.query.category,
    condition: req.query.condition,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    brand: req.query.brand,
    sort: req.query.sort,
});

        return res.status(200).json({
            success: true,
            ...result,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await getProductByIdService(id);

        return res.status(200).json({
            success: true,
            product,
        });

    } catch (error) {
        console.error(error);

        if (error.message === "Product not found.") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

      const images =
    req.files?.map(file => ({
        url: file.path,
        publicId: file.filename,
    })) || [];

const product = await updateProductService(
    id,
    req.user._id,
    req.user.role,
    req.body,
    images
);
        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product,
        });

    } catch (error) {
        console.error(error);

        if (
            error.message === "Product not found."
        ) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (
            error.message ===
            "You are not allowed to edit this product."
        ) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteProductService(
            id,
            req.user._id,
            req.user.role
        );

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });

    } catch (error) {
        console.error(error);

        if (error.message === "Product not found.") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (
            error.message ===
            "You are not allowed to delete this product."
        ) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};