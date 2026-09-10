import {
    addToCart,
    getCart
} from "./cart.js";

import {
    openProductModal
} from "./product-modal.js";

import { renderBreadcrumb } from "./breadcrumb.js";

import {
    showProductSkeletons,
    clearSkeletons
} from "./skeleton.js";

renderBreadcrumb([
    {
        label: "Home",
        href: "home.html"
    },
    {
        label: "Products"
    }
]);

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : window.location.origin;

console.log(
    "Second Chance Store products page running"
);


// ==========================================
// DOM ELEMENTS
// ==========================================

const productsContainer =
    document.getElementById(
        "products-container"
    );



const productsError =
    document.getElementById(
        "products-error"
    );

const productsErrorMessage =
    document.getElementById(
        "products-error-message"
    );

const productsEmpty =
    document.getElementById(
        "products-empty"
    );


const pagination =
    document.getElementById(
        "pagination"
    );

const categoryFilter =
    document.getElementById(
        "category-filter"
    );

const conditionFilter =
    document.getElementById(
        "condition-filter"
    );

const minPriceInput =
    document.getElementById(
        "min-price"
    );

const maxPriceInput =
    document.getElementById(
        "max-price"
    );

const sortFilter =
    document.getElementById(
        "sort-filter"
    );

const clearFiltersButton =
    document.getElementById(
        "clear-filters-button"
    );

const retryButton =
    document.getElementById(
        "retry-button"
    );

const cartCount =
    document.getElementById(
        "cart-count"
    );


// ==========================================
// URL PARAMETERS
// ==========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const initialSearch =
    urlParams.get("search") || "";

const initialCategory =
    urlParams.get("category") || "";

const initialProductId =
    urlParams.get("id") || "";


// ==========================================
// STATE
// ==========================================

const state = {

    page: 1,

    limit: 20,

    search: initialSearch,

    category: initialCategory,

    productId: initialProductId,

    condition: "",

    minPrice: "",

    maxPrice: "",

    sort: "latest"

};


// ==========================================
// LOAD PRODUCTS
// ==========================================

const loadProducts = async () => {

    try {

        // ==========================================
        // LOAD SPECIFIC PRODUCT
        // ==========================================

        if (state.productId) {

            showLoading();

            await openProductModal(
                state.productId
            );

            hideLoading();

            return;
        }


        showLoading();


        const params =
            new URLSearchParams();


        params.set(
            "page",
            state.page
        );

        params.set(
            "limit",
            state.limit
        );


        if (state.search) {

            params.set(
                "search",
                state.search
            );

        }


        if (state.category) {

            params.set(
                "category",
                state.category
            );

        }


        if (state.condition) {

            params.set(
                "condition",
                state.condition
            );

        }


        if (state.minPrice !== "") {

            params.set(
                "minPrice",
                state.minPrice
            );

        }


        if (state.maxPrice !== "") {

            params.set(
                "maxPrice",
                state.maxPrice
            );

        }


        if (state.sort) {

            params.set(
                "sort",
                state.sort
            );

        }


        const response =
            await fetch(
                `${API_URL}/api/products?${params.toString()}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data?.message ||
                "Failed to load products."
            );

        }


        console.log(
            "Products API response:",
            data
        );


        renderProducts(
            data.products || []
        );


        renderPagination(
            data.currentPage,
            data.totalPages
        );


     


        hideLoading();


    } catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

        showError(
            error.message
        );

    }

};


// ==========================================
// RENDER PRODUCTS
// ==========================================

const renderProducts = (
    products
) => {

    productsContainer.innerHTML = "";

    productsEmpty.hidden =
        products.length !== 0;


    if (products.length === 0) {

        return;

    }


    products.forEach(
        (product) => {

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
                product.name;


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
                    product.price
                ).toLocaleString();


            price.appendChild(
                currency
            );

            price.appendChild(
                amount
            );


            // ==========================================
            // CONDITION
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
            // ADD TO CART
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


            addButton.addEventListener(
                "click",
                async (event) => {

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


                        addButton.innerHTML = `
                            <span class="material-symbols-outlined">
                                check
                            </span>
                        `;


                        await updateCartCount();


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


                        addButton.innerHTML = `
                            <span class="material-symbols-outlined">
                                add
                            </span>
                        `;

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


            productsContainer.appendChild(
                productCard
            );

        }
    );

};


// ==========================================
// OPEN PRODUCT
// ==========================================

const openProduct = async (
    productId
) => {

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

};


// ==========================================
// PAGINATION
// ==========================================

const renderPagination = (
    currentPage,
    totalPages
) => {

    pagination.innerHTML = "";


    if (
        !totalPages ||
        totalPages <= 1
    ) {

        return;

    }


    const createButton = (
        text,
        page,
        disabled = false
    ) => {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.textContent =
            text;


        button.disabled =
            disabled;


        button.addEventListener(
            "click",
            () => {

                state.page =
                    page;


                loadProducts();


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );


        return button;

    };


    pagination.appendChild(
        createButton(
            "Previous",
            currentPage - 1,
            currentPage === 1
        )
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        pagination.appendChild(
            createButton(
                page,
                page,
                page === currentPage
            )
        );

    }


    pagination.appendChild(
        createButton(
            "Next",
            currentPage + 1,
            currentPage === totalPages
        )
    );

};


// ==========================================
// FILTER EVENTS
// ==========================================

categoryFilter.addEventListener(
    "change",
    () => {

        state.category =
            categoryFilter.value;

        state.page = 1;

        loadProducts();

    }
);


conditionFilter.addEventListener(
    "change",
    () => {

        state.condition =
            conditionFilter.value;

        state.page = 1;

        loadProducts();

    }
);


minPriceInput.addEventListener(
    "change",
    () => {

        state.minPrice =
            minPriceInput.value;

        state.page = 1;

        loadProducts();

    }
);


maxPriceInput.addEventListener(
    "change",
    () => {

        state.maxPrice =
            maxPriceInput.value;

        state.page = 1;

        loadProducts();

    }
);


sortFilter.addEventListener(
    "change",
    () => {

        state.sort =
            sortFilter.value;

        state.page = 1;

        loadProducts();

    }
);


clearFiltersButton.addEventListener(
    "click",
    () => {

        categoryFilter.value =
            "";

        conditionFilter.value =
            "";

        minPriceInput.value =
            "";

        maxPriceInput.value =
            "";

        sortFilter.value =
            "latest";


        state.search =
            "";

        state.category =
            "";

        state.condition =
            "";

        state.minPrice =
            "";

        state.maxPrice =
            "";

        state.sort =
            "latest";

        state.page =
            1;


        loadProducts();

    }
);


retryButton.addEventListener(
    "click",
    loadProducts
);


// ==========================================
// CART COUNT
// ==========================================

const updateCartCount =
    async () => {

        try {

            const result =
                await getCart();


            const count =
                result?.cart?.items?.length ||
                0;


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

    };


// ==========================================
// UI STATES
// ==========================================

const showLoading = () => {

    productsError.hidden =
        true;

    productsEmpty.hidden =
        true;

    showProductSkeletons(
        productsContainer,
        10
    );

};


const hideLoading = () => {

    clearSkeletons(
        productsContainer
    );

};
const showError = (
    message
) => {

    

    productsError.hidden =
        false;


    productsErrorMessage.textContent =
        message ||
        "Failed to load products.";


    productsContainer.innerHTML =
        "";

    pagination.innerHTML =
        "";

};


// ==========================================
// LOAD CATEGORIES
// ==========================================

const loadCategories =
    async () => {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/home`
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to load categories."
                );

            }


            const categories =
                data?.home?.categories ||
                [];


            categories.forEach(
                (category) => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        category.slug;


                    option.textContent =
                        category.name;


                    categoryFilter.appendChild(
                        option
                    );

                }
            );


            categoryFilter.value =
                state.category;


        } catch (error) {

            console.error(
                "Failed to load categories:",
                error
            );

        }

    };


// ==========================================
// INITIALIZE
// ==========================================

const initializeProductsPage =
    async () => {

        await loadCategories();


        await Promise.all([

            loadProducts(),

            updateCartCount()

        ]);

    };


initializeProductsPage();