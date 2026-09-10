
import { apiFetch } from "./api.js";
import { logout } from "./auth.js";
import { renderBreadcrumb } from "./breadcrumb.js";

console.log("Account page running");



// ==========================================
// DOM ELEMENTS
// ==========================================

const accountMessage =
    document.getElementById(
        "account-message"
    );

const accountName =
    document.getElementById(
        "account-name"
    );

const accountEmail =
    document.getElementById(
        "account-email"
    );

const accountRole =
    document.getElementById(
        "account-role"
    );

const totalProducts =
    document.getElementById(
        "total-products"
    );

const totalViews =
    document.getElementById(
        "total-views"
    );

const myProductsContainer =
    document.getElementById(
        "my-products-container"
    );



renderBreadcrumb([
    {
        label: "Home",
        href: "home.html"
    },
    {
        label: "My Account"
    }
]);




    // ==========================================
// LOGOUT
// ==========================================

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            logoutButton.disabled = true;

            const success = await logout();

            if (success) {
                window.location.href = "home.html";
                return;
            }

            showMessage(
                "Failed to log out. Please try again.",
                true
            );

            logoutButton.disabled = false;

        } catch (error) {
            console.error("Logout failed:", error);

            showMessage(
                "Failed to log out. Please try again.",
                true
            );

            logoutButton.disabled = false;
        }
    });
}


// ==========================================
// RENDER MY PRODUCTS
// ==========================================

const renderMyProducts = (
    products
) => {

    myProductsContainer.innerHTML = "";

    if (!products.length) {

        myProductsContainer.innerHTML =
            "<p>You haven't posted any products yet.</p>";

        return;
    }



    products.forEach(
        (product) => {

            const productElement =
                document.createElement(
                    "article"
                );

            const image =
                product.images?.[0]?.url ||
                "";



            const category =
                product.category?.name ||
                "Unknown";



            productElement.innerHTML = `

                <hr>

                ${
                    image
                        ? `
                            <img
                                src="${image}"
                                alt="${product.name}"
                                width="180"
                            >
                        `
                        : `
                            <p>
                                No image available
                            </p>
                        `
                }

                <h3>
                    ${product.name}
                </h3>

                <p>
                    Category:
                    ${category}
                </p>

                <p>
                    Price:
                    KSh
                    ${Number(
                        product.price
                    ).toLocaleString()}
                </p>

                <p>
                    Condition:
                    ${product.condition}
                </p>

                <p>
                    Views:
                    ${product.views}
                </p>

                <p>
                    Listing:
                    ${product.listingCode}
                </p>

                <button
                    type="button"
                    class="view-my-product-button"
                    data-id="${product._id}"
                >
                    View
                </button>

                <button
                    type="button"
                    class="edit-my-product-button"
                    data-id="${product._id}"
                >
                    Edit
                </button>

            `;



            myProductsContainer.appendChild(
                productElement
            );

        }
    );

};



// ==========================================
// MY PRODUCT BUTTON EVENTS
// ==========================================

myProductsContainer.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "button"
            );

        if (!button) {
            return;
        }



        const productId =
            button.dataset.id;

        if (!productId) {
            return;
        }



        // ==================================
        // VIEW
        // ==================================

        if (
            button.classList.contains(
                "view-my-product-button"
            )
        ) {

            openMyProductModal(
                productId
            );

            return;
        }



        // ==================================
        // EDIT
        // ==================================

        if (
            button.classList.contains(
                "edit-my-product-button"
            )
        ) {

            window.location.href =
                `edit-product.html?id=${productId}`;

            return;
        }

    }
);



// ==========================================
// VIEW MY PRODUCT MODAL
// ==========================================

const openMyProductModal = async (productId) => {
    try {
        const data = await apiFetch(
            `/api/products/${productId}`
        );

        renderMyProductModal(data.product);
    } catch (error) {
        console.error(
            "Failed to load product details:",
            error
        );

        alert(
            error.message ||
            "Failed to load product details."
        );
    }
};



// ==========================================
// RENDER MY PRODUCT MODAL
// ==========================================

const renderMyProductModal =
    (product) => {

        const modal =
            document.getElementById(
                "my-product-modal"
            );

        const modalBody =
            document.getElementById(
                "my-product-modal-body"
            );



        if (!modal || !modalBody) {

            console.error(
                "My product modal elements not found."
            );

            return;
        }



        modalBody.innerHTML = "";



        // ==========================================
        // IMAGES
        // ==========================================

        const imagesContainer =
            document.createElement(
                "div"
            );

        imagesContainer.className =
            "my-product-modal-images";



        if (
            product.images &&
            product.images.length > 0
        ) {

            product.images.forEach(
                (image) => {

                    const img =
                        document.createElement(
                            "img"
                        );

                    img.src =
                        image.url;

                    img.alt =
                        product.name;

                    imagesContainer.appendChild(
                        img
                    );

                }
            );

        } else {

            const noImage =
                document.createElement(
                    "p"
                );

            noImage.textContent =
                "No images available.";

            imagesContainer.appendChild(
                noImage
            );

        }



        // ==========================================
        // PRODUCT DETAILS
        // ==========================================

        const name =
            document.createElement(
                "h2"
            );

        name.textContent =
            product.name;



        const listing =
            document.createElement(
                "p"
            );

        listing.textContent =
            `Listing: ${
                product.listingCode || "N/A"
            }`;



        const price =
            document.createElement(
                "p"
            );

        price.textContent =
            `Price: KSh ${
                Number(
                    product.price
                ).toLocaleString()
            }`;



        const description =
            document.createElement(
                "p"
            );

        description.textContent =
            `Description: ${
                product.description ||
                "No description available."
            }`;



        const category =
            document.createElement(
                "p"
            );

        category.textContent =
            `Category: ${
                product.category?.name ||
                "N/A"
            }`;



        const condition =
            document.createElement(
                "p"
            );

        condition.textContent =
            `Condition: ${
                product.condition ||
                "N/A"
            }`;



        const brand =
            document.createElement(
                "p"
            );

        brand.textContent =
            `Brand: ${
                product.brand ||
                "N/A"
            }`;



        const negotiable =
            document.createElement(
                "p"
            );

        negotiable.textContent =
            product.isNegotiable
                ? "Price is negotiable"
                : "Price is fixed";



        const status =
            document.createElement(
                "p"
            );

        status.textContent =
            `Status: ${
                product.status ||
                "N/A"
            }`;



        const views =
            document.createElement(
                "p"
            );

        views.textContent =
            `Views: ${
                product.views || 0
            }`;



        // ==========================================
        // APPEND DETAILS
        // ==========================================

        modalBody.appendChild(
            imagesContainer
        );

        modalBody.appendChild(
            name
        );

        modalBody.appendChild(
            listing
        );

        modalBody.appendChild(
            price
        );

        modalBody.appendChild(
            description
        );

        modalBody.appendChild(
            category
        );

        modalBody.appendChild(
            condition
        );

        modalBody.appendChild(
            brand
        );

        modalBody.appendChild(
            negotiable
        );

        modalBody.appendChild(
            status
        );

        modalBody.appendChild(
            views
        );



        // ==========================================
        // SHOW MODAL
        // ==========================================

        modal.hidden =
            false;

    };



// ==========================================
// MESSAGE
// ==========================================

const showMessage = (
    text,
    isError = false
) => {

    accountMessage.textContent =
        text;

    accountMessage.style.color =
        isError
            ? "red"
            : "green";

};



// ==========================================
// CLOSE MY PRODUCT MODAL
// ==========================================

const closeMyProductModal =
    document.getElementById(
        "close-my-product-modal"
    );

const myProductModal =
    document.getElementById(
        "my-product-modal"
    );

const myProductModalOverlay =
    document.querySelector(
        ".my-product-modal-overlay"
    );



closeMyProductModal.addEventListener(
    "click",
    () => {

        myProductModal.hidden =
            true;

    }
);



if (myProductModalOverlay) {

    myProductModalOverlay.addEventListener(
        "click",
        () => {

            myProductModal.hidden =
                true;

        }
    );

}



// ==========================================
// LOAD ACCOUNT
// ==========================================

const loadAccount =
    async () => {

        try {

            // ==================================
            // LOAD ACCOUNT DATA
            // ==================================

            const data =
                await apiFetch(
                    "/api/users/me/account"
                );



            console.log(
                "Account response:",
                data
            );



            const account =
                data.account;



            if (!account) {

                throw new Error(
                    "Account information not found."
                );

            }



            const user =
                account.user;

            const statistics =
                account.statistics;

            const products =
                account.products || [];



            // ==================================
            // USER INFORMATION
            // ==================================
// ==================================
// USER INFORMATION
// ==================================

accountName.textContent =
    user.fullName ||
    "Not provided";

accountEmail.textContent =
    user.email ||
    "Not provided";

accountRole.textContent =
    user.role ||
    "customer";


// Remove skeleton state
accountName.classList.remove("skeleton");
accountEmail.classList.remove("skeleton");
accountRole.classList.remove("skeleton");



            // ==================================
            // ACCOUNT STATISTICS
            // ==================================

// ==================================
// ACCOUNT STATISTICS
// ==================================

totalProducts.textContent =
    statistics.totalProducts || 0;

totalViews.textContent =
    statistics.totalViews || 0;


// Remove skeleton state
totalProducts.classList.remove("skeleton");
totalViews.classList.remove("skeleton");


            // ==================================
            // USER PRODUCTS
            // ==================================

            renderMyProducts(
                products
            );



            console.log(
                "Account statistics:",
                account.statistics
            );



            console.log(
                "My products:",
                account.products
            );



            // ==================================
            // CLEAR MESSAGE
            // ==================================

            accountMessage.textContent =
                "";

        } catch (error) {

            console.error(
                "Failed to load account:",
                error
            );



            if (
                error.status === 401
            ) {

                window.location.href =
                    "login.html";

                return;
            }



            showMessage(
                error.message ||
                "Failed to load account.",
                true
            );

        }

    };



// ==========================================
// INITIALIZE
// ==========================================

loadAccount();

