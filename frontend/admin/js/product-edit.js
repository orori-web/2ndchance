import { apiFetch } from "../../js/api.js";
import { getCurrentUser } from "../../js/auth.js";

console.log("Admin product edit page running");

// ==========================================
// DOM ELEMENTS
// ==========================================

const form =
    document.getElementById("product-edit-form");

const message =
    document.getElementById(
        "product-edit-message"
    );

const productName =
    document.getElementById("product-name");

const productPrice =
    document.getElementById("product-price");

const productBrand =
    document.getElementById("product-brand");

const productCondition =
    document.getElementById(
        "product-condition"
    );

const productCategory =
    document.getElementById(
        "product-category"
    );

const productListingCode =
    document.getElementById(
        "product-listing-code"
    );

const productDescription =
    document.getElementById(
        "product-description"
    );

const productNegotiable =
    document.getElementById(
        "product-negotiable"
    );

const sellerName =
    document.getElementById("seller-name");

const sellerPhone =
    document.getElementById("seller-phone");

const productActive =
    document.getElementById("product-active");


// ==========================================
// PRODUCT ID
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const productId =
    params.get("id");


// ==========================================
// MESSAGE
// ==========================================

const showMessage = (
    text,
    isError = false
) => {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className =
        isError
            ? "product-edit-message error"
            : "product-edit-message success";
};


// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

const checkAdminAccess = async () => {

    try {

        const user =
            await getCurrentUser();

        if (!user) {

            window.location.href =
                "../home.html";

            return false;
        }

        if (user.role !== "admin") {

            alert(
                "Admin access only."
            );

            window.location.href =
                "../home.html";

            return false;
        }

        return true;

    } catch (error) {

        console.error(
            "Admin authentication failed:",
            error
        );

        window.location.href =
            "../home.html";

        return false;
    }
};


// ==========================================
// LOAD CATEGORIES
// ==========================================

const loadCategories = async () => {

    try {

        const data =
            await apiFetch(
                "/api/admin/categories"
            );

        const categories =
            data.categories || [];

        productCategory.innerHTML = `
            <option value="">
                Select category
            </option>
        `;

        categories.forEach(
            (category) => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category._id;

                option.textContent =
                    category.name;

                productCategory.appendChild(
                    option
                );
            }
        );

    } catch (error) {

        console.error(
            "Failed to load categories:",
            error
        );

        productCategory.innerHTML = `
            <option value="">
                Unable to load categories
            </option>
        `;

        throw error;
    }
};


// ==========================================
// LOAD PRODUCT
// ==========================================

const loadProduct = async () => {

    if (!productId) {

        showMessage(
            "Product ID is missing.",
            true
        );

        return false;
    }

    try {

        showMessage(
            "Loading product..."
        );

        const data =
            await apiFetch(
                `/api/admin/products/${productId}`
            );

        console.log(
            "Admin product response:",
            data
        );

        const product =
            data.product;

        if (!product) {

            throw new Error(
                "Product was not found."
            );
        }


        // ==================================
        // PRODUCT INFORMATION
        // ==================================

        productName.value =
            product.name || "";

        productPrice.value =
            product.price ?? "";

        productBrand.value =
            product.brand || "";

        productCondition.value =
            product.condition || "";

        productDescription.value =
            product.description || "";

        productNegotiable.checked =
            Boolean(
                product.isNegotiable
            );

        productListingCode.value =
            product.listingCode || "";


        // ==================================
        // SELLER INFORMATION
        // ==================================

        sellerName.value =
            product.owner?.fullName ||
            "Unknown";

        sellerPhone.value =
            product.sellerPhone || "";


        // ==================================
        // PRODUCT STATUS
        // ==================================

        productActive.checked =
            Boolean(
                product.isActive
            );


        // ==================================
        // CATEGORY
        // ==================================

        if (product.category?._id) {

            productCategory.value =
                product.category._id;

        }


        showMessage(
            "Product loaded successfully."
        );

        return true;

    } catch (error) {

        console.error(
            "Failed to load product:",
            error
        );

        showMessage(
            error.message ||
            "Failed to load product.",
            true
        );

        return false;
    }
};





// ==========================================
// SAVE PRODUCT CHANGES
// ==========================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        if (!productId) {

            showMessage(
                "Product ID is missing.",
                true
            );

            return;
        }

        try {

            showMessage(
                "Saving changes..."
            );

            // ==================================
            // COLLECT FORM DATA
            // ==================================

            const updateData = {

                name:
                    productName.value.trim(),

                price:
                    Number(
                        productPrice.value
                    ),

                brand:
                    productBrand.value.trim(),

                condition:
                    productCondition.value,

                category:
                    productCategory.value,

                description:
                    productDescription.value.trim(),

                isNegotiable:
                    productNegotiable.checked,

                sellerPhone:
                    sellerPhone.value.trim(),

                isActive:
                    productActive.checked
            };


            console.log(
                "Product update data:",
                updateData
            );


            // ==================================
            // UPDATE PRODUCT
            // ==================================

            const data =
                await apiFetch(
                    `/api/admin/products/${productId}`,
                    {
                        method: "PATCH",

                        body:
                            JSON.stringify(
                                updateData
                            )
                    }
                );


            console.log(
                "Product update response:",
                data
            );


            showMessage(
    data.message ||
    "Product updated successfully."
);

setTimeout(() => {
    window.location.href = "products.html";
}, 800);


            // ==================================
            // RELOAD PRODUCT
            // ==================================

            await loadProduct();

        } catch (error) {

            console.error(
                "Failed to update product:",
                error
            );

            showMessage(
                error.message ||
                "Failed to update product.",
                true
            );
        }
    }
);




// ==========================================
// INITIALIZE
// ==========================================

const initialize = async () => {

    const allowed =
        await checkAdminAccess();

    if (!allowed) {
        return;
    }

    if (!productId) {

        showMessage(
            "No product ID was provided.",
            true
        );

        return;
    }

    try {

        // Load categories first
        await loadCategories();

        // Then load the product
        await loadProduct();

    } catch (error) {

        console.error(
            "Product edit initialization failed:",
            error
        );

        showMessage(
            error.message ||
            "Failed to initialize product editor.",
            true
        );
    }
};

initialize();

