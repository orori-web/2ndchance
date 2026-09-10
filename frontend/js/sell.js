import { getCurrentUser } from "./auth.js";
import { apiFetch } from "./api.js";
import { renderBreadcrumb } from "./breadcrumb.js";

renderBreadcrumb([
    {
        label: "Home",
        href: "home.html"
    },
    {
        label: "Sell an Item"
    }
]);

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : window.location.origin;

console.log("Second Chance Store sell page running");



// ==========================================
// DOM ELEMENTS
// ==========================================

const sellForm =
    document.getElementById("sell-form");

const categorySelect =
    document.getElementById("category");

const imagesInput =
    document.getElementById("images");

const submitButton =
    document.getElementById("sell-submit-button");

const message =
    document.getElementById("sell-message");


// ==========================================
// LOAD CATEGORIES
// ==========================================

const loadCategories = async () => {

    try {

       const response =
    await fetch(
        `${API_URL}/api/categories`
    );

const data =
    await response.json();
if (!response.ok) {

    throw new Error(
        data?.message ||
        "Failed to load categories."
    );

}
        

        console.log(
            "Categories API response:",
            data
        );


        const categories =
            data.categories || [];


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

                categorySelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Failed to load categories:",
            error
        );

        showMessage(
            error.message ||
            "Failed to load categories.",
            true
        );

    }

};


// ==========================================
// IMAGE VALIDATION
// ==========================================

const validateImages = () => {

    const files =
        Array.from(
            imagesInput.files
        );


    // Maximum 2 images

    if (files.length > 2) {

        throw new Error(
            "You can upload a maximum of 2 images."
        );

    }


    // Maximum 5MB per image

    const maxSize =
        5 * 1024 * 1024;


    for (const file of files) {

        if (file.size > maxSize) {

            throw new Error(
                `${file.name} is larger than 5MB.`
            );

        }


        if (!file.type.startsWith("image/")) {

            throw new Error(
                "Only image files are allowed."
            );

        }

    }

};


// ==========================================
// SUBMIT PRODUCT
// ==========================================

sellForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        try {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Posting...";


            showMessage(
                "Posting your product...",
                false
            );


            // Validate images

            validateImages();


            // ==================================
            // CREATE FORMDATA
            // ==================================

            const formData =
                new FormData();


            formData.append(
                "name",
                document.getElementById(
                    "name"
                ).value.trim()
            );


            formData.append(
                "description",
                document.getElementById(
                    "description"
                ).value.trim()
            );


            formData.append(
                "brand",
                document.getElementById(
                    "brand"
                ).value.trim()
            );


            formData.append(
                "category",
                categorySelect.value
            );


            formData.append(
                "price",
                document.getElementById(
                    "price"
                ).value
            );


            formData.append(
                "condition",
                document.getElementById(
                    "condition"
                ).value
            );


            formData.append(
                "sellerPhone",
                document.getElementById(
                    "sellerPhone"
                ).value.trim()
            );


            formData.append(
                "isNegotiable",
                document.getElementById(
                    "isNegotiable"
                ).checked
            );


            // ==================================
            // ADD IMAGES
            // ==================================

            const files =
                Array.from(
                    imagesInput.files
                );


            files.forEach(
                (file) => {

                    formData.append(
                        "images",
                        file
                    );

                }
            );


           


            // ==================================
// CHECK AUTHENTICATION
// ==================================

const user =
    await getCurrentUser();

if (!user) {

    throw new Error(
        "You must be logged in to post a product."
    );

}


// ==================================
// SEND REQUEST
// ==================================

const data =
    await apiFetch(
        "/api/products",
        {
            method: "POST",
            body: formData,
        }
    );
    
     // ==================================
        // SUCCESS
        // ==================================

        const createdProduct =
            data.product;

        console.log(
            "Created product:",
            createdProduct
        );

       showMessage(
    `Product posted successfully! 🎉 Listing: ${
        createdProduct?.listingCode ||
        "N/A"
    }`,
    false
);

sellForm.reset();

setTimeout(() => {
    window.location.href = "products.html";
}, 1200);

    } catch (error) {

        console.error(
            "Failed to post product:",
            error
        );

        showMessage(
            error.message ||
            "Failed to post product.",
            true
        );

    } finally {

        submitButton.disabled =
            false;

        submitButton.textContent =
            "Post Product";

    }

}

);

// ==========================================
// MESSAGE
// ==========================================

const showMessage = (
text,
isError
) => {

message.hidden = false;

message.textContent =
    text;

message.dataset.type =
    isError
        ? "error"
        : "success";

};

// ==========================================
// INITIALIZE
// ==========================================

loadCategories();