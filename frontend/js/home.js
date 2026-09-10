import {
    getCurrentUser,
    loginWithGoogle,
    logout
} from "./auth.js";

import {
    addToCart,
    getCart
} from "./cart.js";

import {
    openProductModal
} from "./product-modal.js";

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : window.location.origin;

console.log("Second Chance Store home running");

// ==========================================
// POSTER SLIDESHOW TIMERS
// ==========================================

const posterSlideshowTimers = {};


// ==========================================
// DOM ELEMENTS
// ==========================================

const homeSearchForm =
    document.getElementById(
        "home-search-form"
    );

const homeSearchInput =
    document.getElementById(
        "home-search-input"
    );


// ==========================================
// LOAD ACTIVE POSTERS
// ==========================================

async function loadActivePosters() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/posters`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data?.message ||
                "Failed to load posters."
            );

        }

        console.log(
            "Posters API response:",
            data
        );

        return (data.posters || []).filter(
            poster =>
                poster.isActive === true
        );

    } catch (error) {

        console.error(
            "Failed to load posters:",
            error
        );

        return [];

    }

}


// ==========================================
// RENDER POSTERS
// ==========================================
//
// Used for poster placements that have
// containers in the HTML.
//
// Currently:
//
// - top-banner
// - banner-2
//
// If a placement has:
//
// 1 poster  -> static poster
// 2+ posters -> automatic slideshow
// ==========================================

function renderPosters(
    posters,
    placement
) {
    const container =
        document.getElementById(
            `poster-${placement}-container`
        );

    if (!container) {
        return;
    }

    // ==========================================
    // CLEAR PREVIOUS SLIDESHOW TIMER
    // ==========================================

    if (posterSlideshowTimers[placement]) {
        clearInterval(
            posterSlideshowTimers[placement]
        );

        delete posterSlideshowTimers[placement];
    }

    // ==========================================
    // CLEAR CONTAINER
    // ==========================================

    container.innerHTML = "";

    // ==========================================
    // FILTER BY PLACEMENT
    // ==========================================

    const placementPosters =
        posters
            .filter(
                poster =>
                    poster.placement === placement &&
                    poster.isActive === true
            )
            .sort(
                (a, b) =>
                    (a.displayOrder || 0) -
                    (b.displayOrder || 0)
            );

    // ==========================================
    // NO POSTERS
    // ==========================================

    if (placementPosters.length === 0) {
        return;
    }

    // ==========================================
    // ONE POSTER
    // ==========================================
    //
    // Keep it completely static.
    // ==========================================

    if (placementPosters.length === 1) {
        const poster =
            placementPosters[0];

        const posterLink =
            document.createElement("a");

        posterLink.className =
            "poster-link";

        posterLink.href =
            poster.link || "#";

        const image =
            document.createElement("img");

        image.className =
            "poster-image";

        image.src =
            poster.image?.url || "";

        image.alt =
            poster.title ||
            "Second Chance Store";

        posterLink.appendChild(
            image
        );

        container.appendChild(
            posterLink
        );

        return;
    }

    // ==========================================
    // MULTIPLE POSTERS
    // ==========================================
    //
    // Create automatic slideshow.
    // ==========================================

    const slider =
        document.createElement("div");

    slider.className =
        "poster-slider";

    // ==========================================
    // CREATE SLIDES
    // ==========================================

    placementPosters.forEach(
        (poster, index) => {

            const slide =
                document.createElement("div");

            slide.className =
                "poster-slide";

            // First slide is visible
            if (index === 0) {
                slide.classList.add(
                    "active"
                );
            }

            const posterLink =
                document.createElement("a");

            posterLink.className =
                "poster-link";

            posterLink.href =
                poster.link || "#";

            const image =
                document.createElement("img");

            image.className =
                "poster-image";

            image.src =
                poster.image?.url || "";

            image.alt =
                poster.title ||
                "Second Chance Store";

            posterLink.appendChild(
                image
            );

            slide.appendChild(
                posterLink
            );

            slider.appendChild(
                slide
            );
        }
    );

    container.appendChild(
        slider
    );

    // ==========================================
    // SLIDESHOW STATE
    // ==========================================

    let currentSlide = 0;

    const slides =
        slider.querySelectorAll(
            ".poster-slide"
        );

    // ==========================================
    // CHANGE SLIDE
    // ==========================================

    function showNextSlide() {

        slides[currentSlide].classList.remove(
            "active"
        );

        currentSlide =
            (currentSlide + 1) %
            slides.length;

        slides[currentSlide].classList.add(
            "active"
        );
    }

    // ==========================================
    // START AUTOMATIC SLIDESHOW
    // ==========================================
    //
    // Change every 5 seconds.
    // ==========================================

    posterSlideshowTimers[placement] =
        setInterval(
            showNextSlide,
            5000
        );
}
// ==========================================
// LOAD HOME DATA
// ==========================================

async function loadHomeData() {

    try {

        // ==========================================
        // LOAD HOME DATA
        // ==========================================

        const response =
            await fetch(
                `${API_URL}/api/home`
            );

        const data =
            await response.json();


        // ==========================================
        // CHECK HOME RESPONSE
        // ==========================================

        if (!response.ok) {

            throw new Error(
                data?.message ||
                "Failed to load home data."
            );

        }


        // ==========================================
        // LOAD POSTERS
        // ==========================================

        const posters =
            await loadActivePosters();


        console.log(
            "Home API response:",
            data
        );

        console.log(
            "Active posters:",
            posters
        );


        // ==========================================
        // RENDER CATEGORIES
        // ==========================================

        renderCategories(
            data.home?.categories || []
        );


        // ==========================================
        // RENDER RECENT PRODUCTS
        // ==========================================

        renderRecentProducts(
            data.home?.recentProducts || []
        );


        // ==========================================
        // RENDER MOST VIEWED PRODUCTS
        // ==========================================

        renderMostViewedProducts(
            data.home?.mostViewedProducts || []
        );


        // ==========================================
        // RENDER CATEGORY SECTIONS
        //
        // This also inserts:
        // - banner-3 after category 1
        // - banner-4 after category 2
        // ==========================================

        renderCategoryProductSections(
            data.home?.categoriesSections || [],
            posters
        );


        // ==========================================
        // RENDER TOP BANNER
        // ==========================================

        renderPosters(
            posters,
            "top-banner"
        );


        // ==========================================
        // RENDER BANNER 2
        // ==========================================

        renderPosters(
            posters,
            "banner-2"
        );


        // ==========================================
        // RENDER CURRENT USER
        // ==========================================

        renderCurrentUser();


    } catch (error) {

        console.error(
            "Failed to load home data:",
            error
        );

    }

}

loadHomeData();


// ==========================================
// RENDER CATEGORIES
// ==========================================

function renderCategories(
    categories
) {

    const container =
        document.getElementById(
            "categories-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    // ==========================================
    // SECTION
    // ==========================================

    const section =
        document.createElement(
            "section"
        );

    section.className =
        "categories-home-section";


    // ==========================================
    // SECTION HEADER
    // ==========================================

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "categories-home-section-header";


    // ==========================================
    // TITLE
    // ==========================================

    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        "Shop by Categories";


    header.appendChild(
        title
    );


    // ==========================================
    // CATEGORY GRID
    // ==========================================

    const categoriesGrid =
        document.createElement(
            "div"
        );

    categoriesGrid.className =
        "categories-grid";


    // ==========================================
    // CATEGORY CARDS
    // ==========================================

    categories.forEach(
        category => {

            const categoryCard =
                document.createElement(
                    "div"
                );

            categoryCard.className =
                "category-card";


            // ==========================================
            // CATEGORY LINK
            // ==========================================

            const categoryLink =
                document.createElement(
                    "a"
                );

            categoryLink.className =
                "category-card-link";

            categoryLink.href =
                `products.html?category=${encodeURIComponent(
                    category.slug
                )}`;


            // ==========================================
            // IMAGE CONTAINER
            // ==========================================

            const imageContainer =
                document.createElement(
                    "div"
                );

            imageContainer.className =
                "category-card-image";


            // ==========================================
            // IMAGE
            // ==========================================

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                category.image || "";

            image.alt =
                category.name ||
                "Category";


            imageContainer.appendChild(
                image
            );


            // ==========================================
            // CATEGORY NAME
            // ==========================================

            const categoryName =
                document.createElement(
                    "span"
                );

            categoryName.className =
                "category-card-name";

            categoryName.textContent =
                category.name || "";


            // ==========================================
            // BUILD CARD
            // ==========================================

            categoryLink.appendChild(
                imageContainer
            );

            categoryLink.appendChild(
                categoryName
            );

            categoryCard.appendChild(
                categoryLink
            );

            categoriesGrid.appendChild(
                categoryCard
            );

        }
    );


    // ==========================================
    // BUILD SECTION
    // ==========================================

    section.appendChild(
        header
    );

    section.appendChild(
        categoriesGrid
    );

    container.appendChild(
        section
    );

}


// ==========================================
// OPEN PRODUCT
// ==========================================

async function openProduct(
    productId
) {

    try {

        await openProductModal(
            productId
        );

    } catch (error) {

        console.error(
            "Failed to open product:",
            error
        );

        alert(
            error.message ||
            "Failed to load product."
        );

    }

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

async function updateCartCount() {

    try {

        const result =
            await getCart();

        const count =
            result?.cart?.items?.length || 0;

        const cartCount =
            document.getElementById(
                "cart-count"
            );

        if (cartCount) {

            cartCount.textContent =
                count;

        }

    } catch (error) {

        console.error(
            "Failed to update cart count:",
            error
        );

    }

}


// ==========================================
// CREATE PRODUCT CARD
// ==========================================

function createProductCard(
    product
) {

    // ==========================================
    // PRODUCT CARD
    // ==========================================

    const productCard =
        document.createElement(
            "article"
        );

    productCard.className =
        "product-card";


    // ==========================================
    // PRODUCT IMAGE
    // ==========================================

    const image =
        document.createElement(
            "img"
        );

    image.className =
        "product-card-image";


    if (
        product.images &&
        product.images.length > 0 &&
        product.images[0]?.url
    ) {

        image.src =
            product.images[0].url;

        image.alt =
            product.name ||
            "Product";

    } else {

        image.alt =
            "No image available";

    }


    // ==========================================
    // PRODUCT CONTENT
    // ==========================================

    const content =
        document.createElement(
            "div"
        );

    content.className =
        "product-card-content";


    // ==========================================
    // PRODUCT NAME
    // ==========================================

    const name =
        document.createElement(
            "h2"
        );

    name.textContent =
        product.name ||
        "Unnamed product";


    // ==========================================
    // PRODUCT PRICE
    // ==========================================

    const price =
        document.createElement(
            "p"
        );

    price.className =
        "product-price";


    const currency =
        document.createElement(
            "span"
        );

    currency.className =
        "price-currency";

    currency.textContent =
        "KES";


    const amount =
        document.createElement(
            "span"
        );

    amount.className =
        "price-amount";

    amount.textContent =
        Number(
            product.price || 0
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
        document.createElement(
            "p"
        );

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
        document.createElement(
            "button"
        );

    addButton.type =
        "button";

    addButton.className =
        "add-to-cart-button";

    addButton.innerHTML = `
        <span class="material-symbols-outlined">
            add
        </span>
    `;


    // ==========================================
    // ADD TO CART EVENT
    // ==========================================

    addButton.addEventListener(
        "click",
        async event => {

            // Prevent product modal
            event.stopPropagation();


            try {

                addButton.disabled =
                    true;


                const result =
                    await addToCart(
                        product._id
                    );


                console.log(
                    "Add to cart response:",
                    result
                );


                // ==========================================
                // SUCCESS ICON
                // ==========================================

                addButton.innerHTML = `
                    <span class="material-symbols-outlined">
                        check
                    </span>
                `;


                // ==========================================
                // UPDATE CART COUNT
                // ==========================================

                await updateCartCount();


                // ==========================================
                // RESTORE BUTTON
                // ==========================================

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
    // OPEN PRODUCT MODAL
    // ==========================================

    productCard.addEventListener(
        "click",
        () => {

            openProduct(
                product._id
            );

        }
    );


    // ==========================================
    // BUILD PRODUCT CARD
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


    return productCard;

}


// ==========================================
// RENDER RECENT PRODUCTS
// ==========================================

function renderRecentProducts(
    products
) {

    const container =
        document.getElementById(
            "recent-products-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    // ==========================================
    // SECTION
    // ==========================================

    const section =
        document.createElement(
            "section"
        );

    section.className =
        "home-product-section";


    // ==========================================
    // HEADER
    // ==========================================

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "home-product-section-header";


    // ==========================================
    // TITLE
    // ==========================================

    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        "Recent Products";


    // ==========================================
    // PRODUCTS CONTAINER
    // ==========================================

    const productsContainer =
        document.createElement(
            "div"
        );

    productsContainer.className =
        "home-products-container";


    // ==========================================
    // PRODUCTS
    // ==========================================

    products.forEach(
        product => {

            productsContainer.appendChild(
                createProductCard(
                    product
                )
            );

        }
    );


    // ==========================================
    // BUILD
    // ==========================================

    header.appendChild(
        title
    );

    section.appendChild(
        header
    );

    section.appendChild(
        productsContainer
    );

    container.appendChild(
        section
    );

}


// ==========================================
// RENDER MOST VIEWED PRODUCTS
// ==========================================

function renderMostViewedProducts(
    products
) {

    const container =
        document.getElementById(
            "most-viewed-products-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    // ==========================================
    // SECTION
    // ==========================================

    const section =
        document.createElement(
            "section"
        );

    section.className =
        "home-product-section";


    // ==========================================
    // HEADER
    // ==========================================

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "home-product-section-header";


    // ==========================================
    // TITLE
    // ==========================================

    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        "Most Viewed Products";


    // ==========================================
    // PRODUCTS CONTAINER
    // ==========================================

    const productsContainer =
        document.createElement(
            "div"
        );

    productsContainer.className =
        "home-products-container";


    // ==========================================
    // PRODUCTS
    // ==========================================

    products.forEach(
        product => {

            productsContainer.appendChild(
                createProductCard(
                    product
                )
            );

        }
    );


    // ==========================================
    // BUILD
    // ==========================================

    header.appendChild(
        title
    );

    section.appendChild(
        header
    );

    section.appendChild(
        productsContainer
    );

    container.appendChild(
        section
    );

}


// ==========================================
// RENDER CATEGORY PRODUCT SECTIONS
// ==========================================
//
// banner-3 is inserted after category 1.
//
// banner-4 is inserted after category 2.
//
// There are NO HTML containers required
// for these two posters.
// ==========================================

function renderCategoryProductSections(
    categories,
    posters
) {

    const container =
        document.getElementById(
            "category-product-sections"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    categories.forEach(
        (category, index) => {

            // ==========================================
            // CATEGORY SECTION
            // ==========================================

            const section =
                document.createElement(
                    "section"
                );

            section.className =
                "category-product-section";


            // ==========================================
            // SECTION HEADER
            // ==========================================

            const header =
                document.createElement(
                    "div"
                );

            header.className =
                "category-product-section-header";


            // ==========================================
            // SECTION TITLE
            // ==========================================

            const title =
                document.createElement(
                    "h2"
                );

            title.textContent =
                `${category.name} Deals`;


            // ==========================================
            // VIEW ALL LINK
            // ==========================================

            const viewAll =
                document.createElement(
                    "a"
                );

            viewAll.href =
                `products.html?category=${encodeURIComponent(
                    category.slug
                )}`;

            viewAll.textContent =
                "View all";

            viewAll.className =
                "category-view-all";


            // ==========================================
            // BUILD HEADER
            // ==========================================

            header.appendChild(
                title
            );

            header.appendChild(
                viewAll
            );


            // ==========================================
            // PRODUCTS CONTAINER
            // ==========================================

            const productsContainer =
                document.createElement(
                    "div"
                );

            productsContainer.className =
                "category-products-container";


            // ==========================================
            // CATEGORY PRODUCTS
            // ==========================================

            const products =
                category.products || [];


            products.forEach(
                product => {

                    productsContainer.appendChild(
                        createProductCard(
                            product
                        )
                    );

                }
            );


            // ==========================================
            // BUILD CATEGORY SECTION
            // ==========================================

            section.appendChild(
                header
            );

            section.appendChild(
                productsContainer
            );

            container.appendChild(
                section
            );


            // ==========================================
            // BANNER 3
            // AFTER CATEGORY 1
            // ==========================================

            if (index === 0) {

                renderPosterPlacement(
                    "banner-3",
                    posters,
                    container
                );

            }


            // ==========================================
            // BANNER 4
            // AFTER CATEGORY 2
            // ==========================================

            if (index === 1) {

                renderPosterPlacement(
                    "banner-4",
                    posters,
                    container
                );

            }

        }
    );

}


// ==========================================
// RENDER DYNAMIC POSTER PLACEMENT
// ==========================================
//
// This creates the HTML structure for:
//
// - banner-3
// - banner-4
//
// If there is:
//
// 1 poster  -> static
// 2+ posters -> automatic slideshow
// ==========================================

function renderPosterPlacement(
    placement,
    posters,
    parent
) {

    // ==========================================
    // CLEAR PREVIOUS SLIDESHOW TIMER
    // ==========================================

    if (posterSlideshowTimers[placement]) {
        clearInterval(
            posterSlideshowTimers[placement]
        );

        delete posterSlideshowTimers[placement];
    }

    // ==========================================
    // FILTER POSTERS
    // ==========================================

    const placementPosters =
        posters
            .filter(
                poster =>
                    poster.placement === placement &&
                    poster.isActive === true
            )
            .sort(
                (a, b) =>
                    (a.displayOrder || 0) -
                    (b.displayOrder || 0)
            );

    // ==========================================
    // NO POSTERS
    // ==========================================

    if (placementPosters.length === 0) {
        return;
    }

    // ==========================================
    // POSTER SECTION
    // ==========================================

    const section =
        document.createElement("section");

    section.className =
        "poster-section";

    section.dataset.placement =
        placement;

    // ==========================================
    // ONE POSTER
    // ==========================================

    if (placementPosters.length === 1) {

        const poster =
            placementPosters[0];

        const posterContainer =
            document.createElement("div");

        posterContainer.className =
            "poster-container";

        const posterLink =
            document.createElement("a");

        posterLink.className =
            "poster-link";

        posterLink.href =
            poster.link || "#";

        const image =
            document.createElement("img");

        image.className =
            "poster-image";

        image.src =
            poster.image?.url || "";

        image.alt =
            poster.title ||
            "Second Chance Store";

        posterLink.appendChild(
            image
        );

        posterContainer.appendChild(
            posterLink
        );

        section.appendChild(
            posterContainer
        );

        parent.appendChild(
            section
        );

        return;
    }

    // ==========================================
    // MULTIPLE POSTERS
    // ==========================================

    const slider =
        document.createElement("div");

    slider.className =
        "poster-slider";

    // ==========================================
    // CREATE SLIDES
    // ==========================================

    placementPosters.forEach(
        (poster, index) => {

            const slide =
                document.createElement("div");

            slide.className =
                "poster-slide";

            if (index === 0) {
                slide.classList.add(
                    "active"
                );
            }

            const posterLink =
                document.createElement("a");

            posterLink.className =
                "poster-link";

            posterLink.href =
                poster.link || "#";

            const image =
                document.createElement("img");

            image.className =
                "poster-image";

            image.src =
                poster.image?.url || "";

            image.alt =
                poster.title ||
                "Second Chance Store";

            posterLink.appendChild(
                image
            );

            slide.appendChild(
                posterLink
            );

            slider.appendChild(
                slide
            );
        }
    );

    section.appendChild(
        slider
    );

    parent.appendChild(
        section
    );

    // ==========================================
    // SLIDESHOW STATE
    // ==========================================

    let currentSlide = 0;

    const slides =
        slider.querySelectorAll(
            ".poster-slide"
        );

    // ==========================================
    // CHANGE SLIDE
    // ==========================================

    function showNextSlide() {

        slides[currentSlide].classList.remove(
            "active"
        );

        currentSlide =
            (currentSlide + 1) %
            slides.length;

        slides[currentSlide].classList.add(
            "active"
        );
    }

    // ==========================================
    // START AUTOMATIC SLIDESHOW
    // ==========================================

    posterSlideshowTimers[placement] =
        setInterval(
            showNextSlide,
            5000
        );
}


// ==========================================
// RENDER CURRENT USER
// ==========================================

async function renderCurrentUser() {

    try {

        const user =
            await getCurrentUser();


        const loginButton =
            document.getElementById(
                "login-button"
            );

        const userName =
            document.getElementById(
                "user-name"
            );

        const logoutButton =
            document.getElementById(
                "logout-button"
            );


        if (
            !loginButton ||
            !userName
        ) {

            return;

        }


        // ==========================================
        // LOGIN BUTTON
        // ==========================================

        loginButton.addEventListener(
            "click",
            loginWithGoogle
        );


        // ==========================================
        // USER STATE
        // ==========================================

        if (user) {

            loginButton.style.display =
                "none";

            userName.textContent =
                user.fullName || "";


            if (logoutButton) {

                logoutButton.style.display =
                    "inline-block";

            }

        } else {

            loginButton.style.display =
                "inline-block";

            userName.textContent =
                "";


            if (logoutButton) {

                logoutButton.style.display =
                    "none";

            }

        }


        // ==========================================
        // LOGOUT
        // ==========================================

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async () => {

                    const success =
                        await logout();


                    if (success) {

                        userName.textContent =
                            "";

                        loginButton.style.display =
                            "inline-block";

                        logoutButton.style.display =
                            "none";

                    }

                }
            );

        }


    } catch (error) {

        console.error(
            "Failed to render current user:",
            error
        );

    }

}


// ==========================================
// HOME SEARCH
// ==========================================

if (
    homeSearchForm &&
    homeSearchInput
) {

    homeSearchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const search =
                homeSearchInput.value.trim();


            if (!search) {
                return;
            }


            window.location.href =
                `products.html?search=${encodeURIComponent(
                    search
                )}`;

        }
    );

}


// ==========================================
// INITIAL CART COUNT
// ==========================================

updateCartCount();





if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then((registration) => {
                console.log(
                    "Service Worker registered:",
                    registration.scope
                );
            })
            .catch((error) => {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}