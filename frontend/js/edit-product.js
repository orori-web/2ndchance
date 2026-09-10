import { apiFetch } from "./api.js";
import { renderBreadcrumb } from "./breadcrumb.js";

renderBreadcrumb([
    {
        label: "Home",
        href: "home.html"
    },
    {
        label: "My Account",
        href: "account.html"
    },
    {
        label: "Edit Product"
    }
]);

console.log("Edit product page running");

// ==========================================
// DOM ELEMENTS
// ==========================================

const editProductMessage =
document.getElementById("edit-product-message");

const editProductForm =
document.getElementById("edit-product-form");

const productName =
document.getElementById("product-name");

const productPrice =
document.getElementById("product-price");

const productCategory =
document.getElementById("product-category");

const productCondition =
document.getElementById("product-condition");

const productDescription =
document.getElementById("product-description");

const productBrand =
document.getElementById("product-brand");

const productNegotiable =
document.getElementById("product-negotiable");

const productImages =
document.getElementById("product-images");

const cancelEditButton =
document.getElementById("cancel-edit-button");

// ==========================================
// GET PRODUCT ID FROM URL
// ==========================================

const urlParams =
new URLSearchParams(window.location.search);

const productId =
urlParams.get("id");

console.log("Product ID:", productId);

// ==========================================
// VALIDATE PRODUCT ID
// ==========================================

if (!productId) {

editProductMessage.textContent =
    "Product ID is missing.";

editProductMessage.style.color =
    "red";

editProductForm.style.display =
    "none";

throw new Error("Product ID is missing.");


}

// ==========================================
// LOAD CATEGORIES
// ==========================================

const loadCategories = async () => {


try {

    const data =
        await apiFetch("/api/categories");

    const categories =
        data.categories || [];

    productCategory.innerHTML = `
        <option value="">
            Select category
        </option>
    `;

    categories.forEach((category) => {

        const option =
            document.createElement("option");

        option.value =
            category._id;

        option.textContent =
            category.name;

        productCategory.appendChild(
            option
        );

    });

} catch (error) {

    console.error(
        "Failed to load categories:",
        error
    );

    throw error;
}


};


// ==========================================
// LOAD CONDITIONS
// ==========================================

const loadConditions = () => {


const conditions = [
    "New",
    "Like New",
    "Good",
    "Fair",
    "Needs Repair"
];

productCondition.innerHTML = `
    <option value="">
        Select condition
    </option>
`;

conditions.forEach((condition) => {

    const option =
        document.createElement("option");

    option.value = condition;
    option.textContent = condition;

    productCondition.appendChild(option);

});


};


// ==========================================
// LOAD PRODUCT
// ==========================================

const loadProduct = async () => {


try {

    editProductMessage.textContent =
        "Loading product...";

    editProductMessage.style.color =
        "#555";


    /*
     * Temporary product loading route.
     *
     * We will replace this with the
     * protected edit-product endpoint
     * once we add it to the backend.
     */

    const data =
        await apiFetch(
            `/api/products/${productId}`
        );

    const product =
        data.product;

    if (!product) {

        throw new Error(
            "Product information not found."
        );

    }


    console.log(
        "Product loaded:",
        product
    );


    // ==================================
    // AUTOFILL FORM
    // ==================================

    productName.value =
        product.name || "";

    productPrice.value =
        product.price ?? "";

    productDescription.value =
        product.description || "";

    productBrand.value =
        product.brand || "";

    productNegotiable.value =
        String(
            product.isNegotiable
        );


    // ==================================
    // CATEGORY
    // ==================================

    if (product.category) {

        productCategory.value =
            product.category._id ||
            product.category;

    }


    // ==================================
    // CONDITION
    // ==================================

    if (product.condition) {

        productCondition.value =
            product.condition;

    }


    editProductMessage.textContent =
        "";

} catch (error) {

    console.error(
        "Failed to load product:",
        error
    );

    editProductMessage.textContent =
        error.message ||
        "Failed to load product.";

    editProductMessage.style.color =
        "red";
}


};

// ==========================================
// CANCEL
// ==========================================

cancelEditButton.addEventListener(
"click",
() => {


    window.location.href =
        "account.html";

}


);

// ==========================================
// INITIALIZE
// ==========================================

const initializeEditPage = async () => {


try {

await loadCategories();
loadConditions();
await loadProduct();


} catch (error) {

    console.error(
        "Failed to initialize edit page:",
        error
    );

}


};

initializeEditPage();




// ==========================================
// SAVE CHANGES
// ==========================================

editProductForm.addEventListener(
"submit",
async (event) => {


    event.preventDefault();

    try {

        editProductMessage.textContent =
            "Saving changes...";

        editProductMessage.style.color =
            "#555";


        // ==================================
        // BUILD FORM DATA
        // ==================================

        const formData =
            new FormData();

        formData.append(
            "name",
            productName.value.trim()
        );

        formData.append(
            "price",
            productPrice.value
        );

        formData.append(
            "category",
            productCategory.value
        );

        formData.append(
            "condition",
            productCondition.value
        );

        formData.append(
            "description",
            productDescription.value.trim()
        );

        formData.append(
            "brand",
            productBrand.value.trim()
        );

        formData.append(
            "isNegotiable",
            productNegotiable.value
        );


        // ==================================
        // NEW IMAGES
        // ==================================

        if (
            productImages.files &&
            productImages.files.length > 0
        ) {

            if (
                productImages.files.length > 2
            ) {

                throw new Error(
                    "You can upload a maximum of 2 images."
                );

            }

            for (
                const file of productImages.files
            ) {

                formData.append(
                    "images",
                    file
                );

            }

        }


        // ==================================
        // SEND UPDATE
        // ==================================

        const response =
            await apiFetch(
                `/api/products/${productId}`,
                {
                    method: "PUT",
                    body: formData
                }
            );


        console.log(
            "Update response:",
            response
        );


        // ==================================
        // SUCCESS
        // ==================================

        editProductMessage.textContent =
            "Product updated successfully.";

        editProductMessage.style.color =
            "green";


        // Give the user a moment to see
        // the success message.

        setTimeout(() => {

            window.location.href =
                "account.html";

        }, 1000);


    } catch (error) {

        console.error(
            "Failed to update product:",
            error
        );

        editProductMessage.textContent =
            error.message ||
            "Failed to update product.";

        editProductMessage.style.color =
            "red";

    }

}


);
