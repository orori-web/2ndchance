const Product = require("../models/Product");
const Category = require("../models/Category");

const productCardFields =
    "-sellerPhone -owner -isActive -updatedAt -__v";


const getHomeData = async () => {

    // ==========================================
    // 1. RECENT PRODUCTS
    // ==========================================

    const recentProducts =
        await Product.find({
            isActive: true,
        })
            .select(productCardFields)
            .populate("category", "name slug")
            .sort({
                createdAt: -1,
            })
            .limit(8);


    // ==========================================
    // 2. MOST VIEWED PRODUCTS
    //    Exclude recent products
    // ==========================================

    const recentProductIds =
        recentProducts.map(
            (product) => product._id
        );


    const mostViewedProducts =
        await Product.find({

            isActive: true,

            _id: {
                $nin: recentProductIds,
            },

        })
            .select(productCardFields)
            .populate("category", "name slug")
            .sort({
                views: -1,
                createdAt: -1,
            })
            .limit(8);


    // ==========================================
    // 3. GENERAL CATEGORIES
    //
    // This is your normal category navigation.
    // It is NOT affected by duplicate filtering.
    // ==========================================

    const categories =
        await Category.find({
            isActive: true,
        })
            .sort({
                order: 1,
            });


    // ==========================================
    // 4. ALL PRODUCTS ALREADY FEATURED
    // ==========================================

    const mostViewedProductIds =
        mostViewedProducts.map(
            (product) => product._id
        );


    const featuredProductIds = [
        ...recentProductIds,
        ...mostViewedProductIds,
    ];


    // ==========================================
// 5. CATEGORY PRODUCT SECTIONS
//
// Categories with more qualifying products
// get higher priority.
// If product counts are equal, category
// order is used as the tie-breaker.
// ==========================================

const categoryProductCategories =
    await Category.find({
        isActive: true,
    }).sort({
        order: 1,
    });

// ==========================================
// 6. LOAD PRODUCTS FOR EACH CATEGORY
// ==========================================

const categoriesWithProducts =
    await Promise.all(
        categoryProductCategories.map(
            async (category) => {

                const products =
                    await Product.find({
                        category:
                            category._id,
                        isActive: true,
                        _id: {
                            $nin:
                                featuredProductIds,
                        },
                    })
                        .select(
                            productCardFields
                        )
                        .populate(
                            "category",
                            "name slug"
                        )
                        .sort({
                            createdAt: -1,
                        })
                        .limit(8);

                return {
                    _id:
                        category._id,
                    name:
                        category.name,
                    slug:
                        category.slug,
                    image:
                        category.image,
                    products,
                    productCount:
                        products.length,
                    order:
                        category.order,
                };
            }
        )
    );

// ==========================================
// 7. REMOVE EMPTY CATEGORIES
// ==========================================

const filteredCategorySections =
    categoriesWithProducts.filter(
        (category) =>
            category.products.length > 0
    );

// ==========================================
// 8. PRIORITIZE CATEGORIES
//
// More products = higher priority.
// Same number of products = lower
// category order wins.
// ==========================================

filteredCategorySections.sort(
    (a, b) => {

        if (
            b.productCount !==
            a.productCount
        ) {
            return (
                b.productCount -
                a.productCount
            );
        }

        return (
            a.order -
            b.order
        );
    }
);

// ==========================================
// 9. SELECT TOP 4 CATEGORIES
// ==========================================

const selectedCategorySections =
    filteredCategorySections.slice(0, 4);
    // ==========================================
    // 8. RETURN HOMEPAGE DATA
    // ==========================================

    return {

        recentProducts,

        mostViewedProducts,

        // General category navigation
        categories,

        // Category sections containing products
       categoriesSections:
    selectedCategorySections,

    };

};


module.exports = {
    getHomeData,
};