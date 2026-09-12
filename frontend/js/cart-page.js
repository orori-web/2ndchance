import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    placeOrder,
} from "./cart.js";

import {
    openProductModal
} from "./product-modal.js";
console.log(
    "Second Chance Store cart page running"
);


// ------------------------------------------
// DOM elements
// ------------------------------------------

const cartSkeleton =
    document.getElementById(
        "cart-skeleton"
    );

    const cartSummarySkeleton =
    document.getElementById(
        "cart-summary-skeleton"
    );

const cartSummaryContent =
    document.getElementById(
        "cart-summary-content"
    );

const cartItemsContainer =
    document.getElementById(
        "cart-items-container"
    );

const cartItemCount =
    document.getElementById(
        "cart-item-count"
    );

const cartTotal =
    document.getElementById(
        "cart-total"
    );

const emptyCart =
    document.getElementById(
        "empty-cart"
    );

const cartSection =
    document.getElementById(
        "cart-section"
    );

const recommendationsContainer =
    document.getElementById(
        "recommendations-container"
    );

const clearCartButton =
    document.getElementById(
        "clear-cart-button"
    );

const placeOrderButton =
    document.getElementById(
        "place-order-button"
    );


// ------------------------------------------
// Load cart
// ------------------------------------------

const loadCart = async () => {

    try {

        const result =
            await getCart();

        console.log(
            "Cart API response:",
            result
        );

        renderCart(
            result.cart
        );

        renderRecommendations(
            result.recommendations
        );

    } catch (error) {

        console.error(
            "Failed to load cart:",
            error
        );

    } finally {

        // ------------------------------------------
        // Cart loading finished
        // ------------------------------------------

        cartSkeleton.hidden = true;

        cartSummarySkeleton.hidden = true;

        cartSummaryContent.hidden = false;

    }

};


// ------------------------------------------
// Render cart
// ------------------------------------------

const renderCart = (cart) => {

    cartItemsContainer.innerHTML = "";

    const items =
        cart?.items || [];

    // Empty cart
    if (items.length === 0) {

        cartSection.hidden = true;

        emptyCart.hidden = false;

        cartItemCount.textContent = "0";

        cartTotal.textContent =
            "KSh 0";

        return;

    }

    cartSection.hidden = false;

    emptyCart.hidden = true;


    let total = 0;


    items.forEach((item) => {

        const product =
            item.product;

        if (!product) {
            return;
        }


        total += product.price;


        const itemElement =
            document.createElement("article");

        itemElement.className =
            "cart-item";


        // Product image

        const image =
            document.createElement("img");

        if (
            product.images &&
            product.images.length > 0
        ) {

            image.src =
                product.images[0].url;

            image.alt =
                product.name;

        } else {

            image.alt =
                "No image available";

        }


        // Product name

        const name =
            document.createElement("h3");

        name.textContent =
            product.name;


        // Listing code

        const listingCode =
            document.createElement("p");

        listingCode.textContent =
            `Listing: ${
                product.listingCode || "N/A"
            }`;


        // Category

        const category =
            document.createElement("p");

        category.textContent =
            `Category: ${
                product.category?.name ||
                "N/A"
            }`;


        // Price

        const price =
            document.createElement("p");

        price.textContent =
            `KSh ${
                product.price.toLocaleString()
            }`;


        // Remove button

        const removeButton =
            document.createElement("button");

        removeButton.type = "button";

        removeButton.textContent =
            "Remove";


        removeButton.addEventListener(
            "click",
            async () => {

                try {

                    removeButton.disabled =
                        true;

                    removeButton.textContent =
                        "Removing...";


                    await removeFromCart(
                        product._id
                    );


                    await loadCart();

                } catch (error) {

                    console.error(
                        "Failed to remove product:",
                        error
                    );

                    alert(
                        error.message ||
                        "Failed to remove product."
                    );

                    removeButton.disabled =
                        false;

                    removeButton.textContent =
                        "Remove";

                }

            }
        );


        // Build item

        itemElement.appendChild(image);

        itemElement.appendChild(name);

        itemElement.appendChild(
            listingCode
        );

        itemElement.appendChild(
            category
        );

        itemElement.appendChild(price);

        itemElement.appendChild(
            removeButton
        );


        cartItemsContainer.appendChild(
            itemElement
        );

    });


    // Summary

    cartItemCount.textContent =
        items.length;


    cartTotal.textContent =
        `KSh ${total.toLocaleString()}`;

};






// ------------------------------------------
// Recommendations
// ------------------------------------------

const renderRecommendations = (products = []) => {

    recommendationsContainer.innerHTML = "";

    products.forEach((product) => {

        // ==========================================
        // PRODUCT CARD
        // ==========================================

        const productCard =
            document.createElement("article");

        productCard.className =
            "product-card";


        // ==========================================
        // PRODUCT IMAGE
        // ==========================================

        const image =
            document.createElement("img");

        image.className =
            "product-card-image";


        if (
            product.images &&
            product.images.length > 0
        ) {

            image.src =
                product.images[0].url;

            image.alt =
                product.name;

        } else {

            image.alt =
                "No image available";

        }


        // ==========================================
        // PRODUCT CONTENT
        // ==========================================

        const content =
            document.createElement("div");

        content.className =
            "product-card-content";


        // ==========================================
        // PRODUCT NAME
        // ==========================================

        const name =
            document.createElement("h2");

        name.textContent =
            product.name;


        // ==========================================
        // PRODUCT PRICE
        // ==========================================

        const price =
            document.createElement("p");

        price.className =
            "product-price";


        const currency =
            document.createElement("span");

        currency.className =
            "price-currency";

        currency.textContent =
            "KES";


        const amount =
            document.createElement("span");

        amount.className =
            "price-amount";

        amount.textContent =
            Number(
                product.price
            ).toLocaleString();


        price.appendChild(
            currency
        );

        price.appendChild(
            amount
        );


        // ==========================================
        // PRODUCT CONDITION
        // ==========================================

        const condition =
            document.createElement("p");

        condition.className =
            "product-condition";

        condition.textContent =
            `Condition: ${
                product.condition ||
                "N/A"
            }`;


        // ==========================================
        // ADD TO CART BUTTON
        // ==========================================

        const addButton =
            document.createElement("button");

        addButton.type =
            "button";

        addButton.className =
            "add-to-cart-button";

        addButton.innerHTML = `
            <span class="material-symbols-outlined">
                add
            </span>
        `;


        addButton.addEventListener(
            "click",
            async (event) => {

                event.stopPropagation();

                try {

                    addButton.disabled =
                        true;


                   await addToCart(
                   product._id
                   );


                    addButton.innerHTML = `
                        <span class="material-symbols-outlined">
                            check
                        </span>
                    `;


                    setTimeout(
                        () => {

                            addButton.disabled =
                                false;

                            addButton.innerHTML = `
                                <span class="material-symbols-outlined">
                                    add
                                </span>
                            `;

                        },
                        1500
                    );


                } catch (error) {

                    console.error(
                        "Failed to add product to cart:",
                        error
                    );


                    alert(
                        error.message ||
                        "Failed to add product to cart."
                    );


                    addButton.disabled =
                        false;

                }

            }
        );


        // ==========================================
        // OPEN PRODUCT
        // ==========================================

       productCard.addEventListener(
    "click",
    () => {

        openProductModal(
            product._id
        );

    }
);


 


        // ==========================================
        // BUILD CARD
        // ==========================================

        content.appendChild(
            name
        );

        content.appendChild(
            price
        );

        content.appendChild(
            condition
        );

        content.appendChild(
            addButton
        );


        productCard.appendChild(
            image
        );

        productCard.appendChild(
            content
        );


        recommendationsContainer.appendChild(
            productCard
        );

    });

};
// ------------------------------------------
// Clear cart
// ------------------------------------------

clearCartButton.addEventListener(
    "click",
    async () => {

        const confirmed =
            confirm(
                "Are you sure you want to clear your cart?"
            );

        if (!confirmed) {
            return;
        }


        try {

            clearCartButton.disabled =
                true;

            await clearCart();

            await loadCart();

        } catch (error) {

            console.error(
                "Failed to clear cart:",
                error
            );

            alert(
                error.message ||
                "Failed to clear cart."
            );

        } finally {

            clearCartButton.disabled =
                false;

        }

    }
);



// ------------------------------------------
// Proceed to WhatsApp
// ------------------------------------------

placeOrderButton.addEventListener(
    "click",
    async () => {

        try {

            placeOrderButton.disabled = true;

            placeOrderButton.textContent =
                "Preparing order...";

            const result =
                await placeOrder();

            if (!result?.message) {
                throw new Error(
                    "Unable to prepare your order."
                );
            }

            // ------------------------------------------
            // Clear cart after successful order preparation
            // ------------------------------------------

            await clearCart();

            // Refresh cart UI
            await loadCart();

            // ------------------------------------------
            // Open WhatsApp
            // ------------------------------------------

            const whatsappNumber =
                "254710988812";

            const whatsappUrl =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    result.message
                )}`;

            window.open(
                whatsappUrl,
                "_blank"
            );

        } catch (error) {

            console.error(
                "Failed to place order:",
                error
            );

            alert(
                error.message ||
                "Unable to place order."
            );

        } finally {

            placeOrderButton.disabled =
                false;

            placeOrderButton.textContent =
                "Proceed to Order";

        }
    }
);



// ------------------------------------------
// Initial load
// ------------------------------------------

loadCart();