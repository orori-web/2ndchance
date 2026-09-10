import { apiFetch } from "../../js/api.js";
import { getCurrentUser } from "../../js/auth.js";

console.log("Admin products page running");

// ==========================================
// DOM ELEMENTS
// ==========================================

const productsContainer =
    document.getElementById("products-container");

const searchInput =
    document.getElementById("product-search");

const searchButton =
    document.getElementById("search-button");

const refreshButton =
    document.getElementById("load-products-button");

const message =
    document.getElementById("products-message");


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
// MESSAGE
// ==========================================

const showMessage = (
    text,
    isError = false
) => {

    message.textContent =
        text;

    message.style.color =
        isError
            ? "red"
            : "green";
};


// ==========================================
// LOAD PRODUCTS
// ==========================================

const loadProducts = async () => {

    try {

        showMessage(
            "Loading products..."
        );

        productsContainer.innerHTML =
            "";

        const search =
            searchInput.value.trim();

        let endpoint =
            "/api/admin/products";

        if (search) {

            endpoint +=
                `?search=${encodeURIComponent(search)}`;

        }

        const data =
            await apiFetch(endpoint);

        console.log(
            "Admin products response:",
            data
        );

        const products =
            data.products || [];

        renderProducts(
            products
        );

        showMessage(
            `${products.length} product(s) loaded.`
        );

    } catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

        showMessage(
            error.message ||
            "Failed to load products.",
            true
        );
    }

};


// ==========================================
// RENDER PRODUCTS
// ==========================================

const renderProducts = (products) => {

    productsContainer.innerHTML = "";

    if (!products.length) {

        productsContainer.innerHTML = `
            <div class="admin-products-empty">
                <span class="material-symbols-outlined">
                    inventory_2
                </span>

                <h3>
                    No products found
                </h3>

                <p>
                    There are no products matching your search.
                </p>
            </div>
        `;

        return;
    }


    const grid =
        document.createElement("div");

    grid.className =
        "admin-products-grid";


    products.forEach((product) => {

        const productElement =
            document.createElement("article");

        productElement.className =
            "admin-product-card";

        productElement.dataset.id =
            product._id;


        const image =
            product.images?.[0]?.url ||
            "";


        const category =
            product.category?.name ||
            "Unknown";


        const owner =
            product.owner?.fullName ||
            "Unknown";


        const status =
            product.isActive
                ? "ACTIVE"
                : "INACTIVE";


        const statusClass =
            product.isActive
                ? "active"
                : "inactive";


        const price =
            Number(product.price || 0)
                .toLocaleString();


        productElement.innerHTML = `

            <!-- PRODUCT IMAGE -->

            <div class="admin-product-image">

                ${
                    image
                        ? `
                            <img
                                src="${image}"
                                alt="${product.name || "Product"}"
                                loading="lazy"
                            >
                        `
                        : `
                            <div class="admin-product-no-image">
                                <span class="material-symbols-outlined">
                                    image
                                </span>

                                <span>
                                    No image
                                </span>
                            </div>
                        `
                }

                <span
                    class="admin-product-status ${statusClass}"
                >
                    ${status}
                </span>

            </div>


            <!-- PRODUCT INFORMATION -->

            <div class="admin-product-body">

                <div class="admin-product-heading">

                    <div>

                        <h3>
                            ${product.name || "Unnamed product"}
                        </h3>

                        <span class="admin-product-code">
                            ${product.listingCode || "No listing code"}
                        </span>

                    </div>

                </div>


                <div class="admin-product-price">

                    KSh ${price}

                </div>


                <div class="admin-product-details">

                    <div class="admin-product-detail">

                        <span class="material-symbols-outlined">
                            category
                        </span>

                        <div>
                            <small>
                                Category
                            </small>

                            <strong>
                                ${category}
                            </strong>
                        </div>

                    </div>


                    <div class="admin-product-detail">

                        <span class="material-symbols-outlined">
                            verified
                        </span>

                        <div>
                            <small>
                                Condition
                            </small>

                            <strong>
                                ${product.condition || "Not specified"}
                            </strong>
                        </div>

                    </div>


                    <div class="admin-product-detail">

                        <span class="material-symbols-outlined">
                            person
                        </span>

                        <div>
                            <small>
                                Seller
                            </small>

                            <strong>
                                ${owner}
                            </strong>
                        </div>

                    </div>

                    <div class="admin-product-detail">
    <span class="material-symbols-outlined">
        phone
    </span>
    <div>
        <small>
            Seller Phone
        </small>
       <strong>
    ${
        product.sellerPhone
            ? `
                <a
    href="https://wa.me/${product.sellerPhone}"
    target="_blank"
    rel="noopener noreferrer"
    class="admin-seller-phone"
>
    ${product.sellerPhone}
</a>
            `
            : "Not provided"
    }
</strong>
    </div>
</div>


                    <div class="admin-product-detail">

                        <span class="material-symbols-outlined">
                            visibility
                        </span>

                        <div>
                            <small>
                                Views
                            </small>

                            <strong>
                                ${Number(product.views || 0).toLocaleString()}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>


            <!-- ACTIONS -->

            <div class="admin-product-actions">

                <button
                    type="button"
                    class="toggle-product-button"
                    data-id="${product._id}"
                    data-active="${product.isActive}"
                >

                    <span class="material-symbols-outlined">
                        ${
                            product.isActive
                                ? "visibility_off"
                                : "visibility"
                        }
                    </span>

                    ${
                        product.isActive
                            ? "Deactivate"
                            : "Activate"
                    }

                </button>


                <button
                    type="button"
                    class="edit-product-button"
                    data-id="${product._id}"
                >

                    <span class="material-symbols-outlined">
                        edit
                    </span>

                    Edit

                </button>


                <button
                    type="button"
                    class="delete-product-button"
                    data-id="${product._id}"
                >

                    <span class="material-symbols-outlined">
                        delete
                    </span>

                    Delete

                </button>

            </div>

        `;


        grid.appendChild(
            productElement
        );

    });


    productsContainer.appendChild(
        grid
    );

};




// ==========================================
// TOGGLE PRODUCT STATUS
// ==========================================

const toggleProductStatus = async (
    productId,
    currentStatus
) => {

    const newStatus =
        !currentStatus;

    const confirmation =
        confirm(
            newStatus
                ? "Activate this product?"
                : "Deactivate this product?"
        );

    if (!confirmation) {

        return;
    }


    try {

        showMessage(
            "Updating product..."
        );

        const data =
            await apiFetch(
                `/api/admin/products/${productId}/status`,
                {
                    method: "PATCH",

                    body: JSON.stringify({
                        isActive:
                            newStatus
                    })
                }
            );


        console.log(
            "Status update:",
            data
        );


        showMessage(
            data.message ||
            "Product status updated."
        );


        await loadProducts();

    } catch (error) {

        console.error(
            "Failed to update product status:",
            error
        );

        showMessage(
            error.message ||
            "Failed to update product status.",
            true
        );
    }

};


// ==========================================
// EDIT PRODUCT
// ==========================================

const editProduct = (productId) => {

    console.log("EDIT BUTTON CLICKED");
    console.log("Product ID:", productId);

    window.location.href =
        `product-edit.html?id=${productId}`;

};

// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = async (
    productId
) => {

    const confirmation =
        confirm(
            "Are you sure you want to permanently delete this product?"
        );

    if (!confirmation) {

        return;
    }


    try {

        showMessage(
            "Deleting product..."
        );


        const data =
            await apiFetch(
                `/api/admin/products/${productId}`,
                {
                    method: "DELETE"
                }
            );


        console.log(
            "Delete response:",
            data
        );


        showMessage(
            data.message ||
            "Product deleted successfully."
        );


        await loadProducts();

    } catch (error) {

        console.error(
            "Failed to delete product:",
            error
        );

        showMessage(
            error.message ||
            "Failed to delete product.",
            true
        );
    }

};


// ==========================================
// BUTTON EVENTS
// ==========================================

productsContainer.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                "button"
            );

        if (!button) {

            return;
        }


        const productId =
            button.dataset.id;


       


        // ------------------------------
        // TOGGLE STATUS
        // ------------------------------

        if (
            button.classList.contains(
                "toggle-product-button"
            )
        ) {

            const currentStatus =
                button.dataset.active ===
                "true";

            await toggleProductStatus(
                productId,
                currentStatus
            );

            return;
        }


        // ------------------------------
        // EDIT
        // ------------------------------

        if (
            button.classList.contains(
                "edit-product-button"
            )
        ) {

            editProduct(
                productId
            );

            return;
        }


        // ------------------------------
        // DELETE
        // ------------------------------

        if (
            button.classList.contains(
                "delete-product-button"
            )
        ) {

            await deleteProduct(
                productId
            );

        }

    }
);


// ==========================================
// SEARCH
// ==========================================

searchButton.addEventListener(
    "click",
    loadProducts
);


searchInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            loadProducts();

        }

    }
);


// ==========================================
// REFRESH
// ==========================================

refreshButton.addEventListener(
    "click",
    loadProducts
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

    await loadProducts();

};

initialize();