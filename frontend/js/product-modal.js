const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : window.location.origin;


console.log(
    "Second Chance Store product modal component running"
);


// ==========================================
// LOAD PRODUCT MODAL COMPONENT
// ==========================================

const loadProductModal = async () => {

    try {

        const container =
            document.getElementById(
                "product-modal-container"
            );

        if (!container) {

            console.error(
                "Product modal container not found."
            );

            return;
        }


        const response =
            await fetch(
                "./components/product-modal.html"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load product modal component."
            );

        }


        const html =
            await response.text();


        container.innerHTML =
            html;


        console.log(
            "Product modal component loaded."
        );


        // ==========================================
        // SETUP MODAL CLOSE
        // ==========================================

        setupProductModalClose();


        // ==========================================
        // TELL OTHER SCRIPTS MODAL IS READY
        // ==========================================

        document.dispatchEvent(
            new CustomEvent(
                "productModalReady"
            )
        );


    } catch (error) {

        console.error(
            "Failed to load product modal:",
            error
        );

    }

};


// ==========================================
// CLOSE PRODUCT MODAL
// ==========================================

const setupProductModalClose = () => {

    const closeButton =
        document.getElementById(
            "close-product-modal"
        );


    const productModalOverlay =
        document.querySelector(
            ".product-modal-overlay"
        );


    // ==========================================
    // CLOSE BUTTON
    // ==========================================

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                closeProductModal();

            }
        );

    }


    // ==========================================
    // CLOSE WHEN CLICKING OUTSIDE MODAL
    // ==========================================

    if (productModalOverlay) {

        productModalOverlay.addEventListener(
            "click",
            (event) => {

                // Only close if the actual
                // overlay was clicked.

                if (
                    event.target ===
                    productModalOverlay
                ) {

                    closeProductModal();

                }

            }
        );

    }

};


// ==========================================
// CLOSE MODAL
// ==========================================

const closeProductModal = () => {

    const modal =
        document.getElementById(
            "product-modal"
        );


    if (!modal) {

        return;

    }


    modal.hidden = true;

};


// ==========================================
// OPEN PRODUCT
// ==========================================

const openProductModal = async (
    productId
) => {

    try {

        const response =
    await fetch(
        `${API_URL}/api/products/${productId}`
    );


        if (!response.ok) {

            throw new Error(
                "Failed to load product details."
            );

        }


        const data =
            await response.json();


        console.log(
            "Selected product:",
            data
        );


        renderProductModal(
            data.product
        );


    } catch (error) {

        console.error(
            "Failed to load product:",
            error
        );


        alert(
            error.message ||
            "Failed to load product details."
        );

    }

};


// ==========================================
// RENDER PRODUCT MODAL
// ==========================================

const renderProductModal = (
    product
) => {

    const modal =
        document.getElementById(
            "product-modal"
        );


    const modalBody =
        document.getElementById(
            "product-modal-body"
        );


    if (!modal || !modalBody) {

        console.error(
            "Product modal elements not found."
        );

        return;

    }


    // Clear previous product

    modalBody.innerHTML = "";



    // ==========================================
    // PRODUCT IMAGE GALLERY
    // ==========================================

    const imagesContainer =
        document.createElement("div");

    imagesContainer.className =
        "product-image-gallery";


    // ==========================================
    // MAIN IMAGE CONTAINER
    // ==========================================

    const mainImageContainer =
        document.createElement("div");

    mainImageContainer.className =
        "product-main-image-container";


    // ==========================================
    // MAIN IMAGE
    // ==========================================

    const mainImage =
        document.createElement("img");

    mainImage.className =
        "product-main-image";


    // ==========================================
    // THUMBNAILS CONTAINER
    // ==========================================

    const thumbnailsContainer =
        document.createElement("div");

    thumbnailsContainer.className =
        "product-image-thumbnails";


    // ==========================================
    // LOAD PRODUCT IMAGES
    // ==========================================

    if (
        product.images &&
        product.images.length > 0
    ) {

        // ==========================================
        // FIRST IMAGE
        // ==========================================

        mainImage.src =
            product.images[0].url;

        mainImage.alt =
            product.name;


        mainImageContainer.appendChild(
            mainImage
        );


        // ==========================================
        // THUMBNAILS
        // ==========================================

        product.images.forEach(
            (image, index) => {

                const thumbnailButton =
                    document.createElement(
                        "button"
                    );


                thumbnailButton.type =
                    "button";


                thumbnailButton.className =
                    "product-image-thumbnail";


                // ==========================================
                // THUMBNAIL IMAGE
                // ==========================================

                const thumbnail =
                    document.createElement(
                        "img"
                    );


                thumbnail.src =
                    image.url;


                thumbnail.alt =
                    `${product.name} image ${index + 1}`;


                thumbnailButton.appendChild(
                    thumbnail
                );


                // ==========================================
                // FIRST IMAGE ACTIVE
                // ==========================================

                if (index === 0) {

                    thumbnailButton.classList.add(
                        "active"
                    );

                }


                // ==========================================
                // CHANGE MAIN IMAGE
                // ==========================================

                thumbnailButton.addEventListener(
                    "click",
                    () => {

                        mainImage.src =
                            image.url;


                        // Remove active state
                        // ONLY from thumbnails
                        // belonging to this gallery.

                        thumbnailsContainer
                            .querySelectorAll(
                                ".product-image-thumbnail"
                            )
                            .forEach(
                                (button) => {

                                    button.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        // Activate clicked thumbnail

                        thumbnailButton.classList.add(
                            "active"
                        );

                    }
                );


                thumbnailsContainer.appendChild(
                    thumbnailButton
                );

            }
        );


    } else {

        mainImage.alt =
            "No image available";


        mainImageContainer.appendChild(
            mainImage
        );

    }


    // ==========================================
    // ADD MAIN IMAGE TO GALLERY
    // ==========================================

    imagesContainer.appendChild(
        mainImageContainer
    );


    // ==========================================
    // ADD THUMBNAILS
    // ONLY IF MORE THAN ONE IMAGE
    // ==========================================

    if (
        product.images &&
        product.images.length > 1
    ) {

        imagesContainer.appendChild(
            thumbnailsContainer
        );

    }



    // ==========================================
    // PRODUCT NAME
    // ==========================================

    const name =
        document.createElement(
            "h2"
        );


    name.className =
        "product-modal-name";


    name.textContent =
        product.name;



    // ==========================================
    // PRICE
    // ==========================================

    const price =
        document.createElement(
            "p"
        );


    price.className =
        "product-modal-price";


    price.textContent =
        `KSh ${
            Number(product.price)
                .toLocaleString()
        }`;



    // ==========================================
    // DESCRIPTION SECTION
    // ==========================================

    const descriptionSection =
        document.createElement(
            "div"
        );


    descriptionSection.className =
        "product-modal-description";


    // ==========================================
    // DESCRIPTION TITLE
    // ==========================================

    const descriptionTitle =
        document.createElement(
            "h3"
        );


    descriptionTitle.className =
        "product-modal-description-title";


    descriptionTitle.textContent =
        "Description";



    // ==========================================
    // DESCRIPTION TEXT
    // ==========================================

    const description =
        document.createElement(
            "p"
        );


    description.className =
        "product-modal-description-text";


    description.textContent =
        product.description;



    // ==========================================
    // BUILD DESCRIPTION SECTION
    // ==========================================

    descriptionSection.appendChild(
        descriptionTitle
    );


    descriptionSection.appendChild(
        description
    );



    // ==========================================
    // LISTING CODE
    // ==========================================

    const listingCode =
        document.createElement(
            "p"
        );


    listingCode.className =
        "product-modal-info";


    listingCode.textContent =
        `Listing: ${
            product.listingCode || "N/A"
        }`;



    // ==========================================
    // CONDITION
    // ==========================================

    const condition =
        document.createElement(
            "p"
        );


    condition.className =
        "product-modal-info";


    condition.textContent =
        `Condition: ${
            product.condition || "N/A"
        }`;



    // ==========================================
    // BRAND
    // ==========================================

    const brand =
        document.createElement(
            "p"
        );


    brand.className =
        "product-modal-info";


    brand.textContent =
        `Brand: ${
            product.brand || "N/A"
        }`;



    // ==========================================
    // CATEGORY
    // ==========================================

    const category =
        document.createElement(
            "p"
        );


    category.className =
        "product-modal-info";


    category.textContent =
        `Category: ${
            product.category?.name || "N/A"
        }`;



    // ==========================================
    // NEGOTIABLE
    // ==========================================

    const negotiable =
        document.createElement(
            "p"
        );


    negotiable.className =
        "product-modal-negotiable";


    negotiable.textContent =
        product.isNegotiable
            ? "Price is negotiable"
            : "Price is fixed";



    // ==========================================
    // STATUS
    // ==========================================

    const status =
        document.createElement(
            "p"
        );


    status.className =
        "product-modal-info";


    status.textContent =
        `Status: ${
            product.status || "N/A"
        }`;



    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCartButton =
        document.createElement(
            "button"
        );


    addToCartButton.type =
        "button";


    addToCartButton.className =
        "add-to-cart-button";


    addToCartButton.innerHTML = `
        <span class="material-symbols-outlined">
            add
        </span>
    `;



    // ==========================================
    // ADD TO CART FUNCTION
    // ==========================================

    addToCartButton.addEventListener(
        "click",
        async (event) => {

            event.stopPropagation();


            try {

                addToCartButton.disabled =
                    true;


                // Import cart function dynamically

                const {
                    addToCart
                } = await import(
                    "./cart.js"
                );


                await addToCart(
                    product._id
                );


                // Show success icon

                addToCartButton.innerHTML = `
                    <span class="material-symbols-outlined">
                        check
                    </span>
                `;


                // Reset button

                setTimeout(
                    () => {

                        addToCartButton.disabled =
                            false;


                        addToCartButton.innerHTML = `
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


                addToCartButton.disabled =
                    false;

            }

        }
    );



    // ==========================================
    // PRODUCT DETAILS CONTAINER
    // ==========================================

    const detailsContainer =
        document.createElement(
            "div"
        );


    detailsContainer.className =
        "product-modal-details";



    // ==========================================
    // PRIMARY DETAILS
    // ==========================================

    const primaryDetails =
        document.createElement(
            "div"
        );


    primaryDetails.className =
        "product-primary-details";


    primaryDetails.appendChild(
        name
    );


    primaryDetails.appendChild(
        price
    );



    // ==========================================
    // PRODUCT INFORMATION
    // ==========================================

    const productInfo =
        document.createElement(
            "div"
        );


    productInfo.className =
        "product-info-grid";


    productInfo.appendChild(
        listingCode
    );


    productInfo.appendChild(
        condition
    );


    productInfo.appendChild(
        brand
    );


    productInfo.appendChild(
        category
    );


    productInfo.appendChild(
        negotiable
    );


    productInfo.appendChild(
        status
    );



    // ==========================================
    // BUILD DETAILS
    // ==========================================

    detailsContainer.appendChild(
        primaryDetails
    );


    detailsContainer.appendChild(
        descriptionSection
    );


    detailsContainer.appendChild(
        productInfo
    );


    detailsContainer.appendChild(
        addToCartButton
    );



    // ==========================================
    // BUILD MODAL
    // ==========================================

    modalBody.appendChild(
        imagesContainer
    );


    modalBody.appendChild(
        detailsContainer
    );



    // ==========================================
    // SHOW MODAL
    // ==========================================

    modal.hidden =
        false;

};


// ==========================================
// START COMPONENT
// ==========================================

loadProductModal();


// ==========================================
// EXPORT
// ==========================================

export {

    openProductModal,

    closeProductModal

};