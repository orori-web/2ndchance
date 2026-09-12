import {
    getCurrentUser,
    loginWithGoogle,
} from "./auth.js";

import {
    getCart
} from "./cart.js";

import {
    apiFetch
} from "./api.js";

// ==========================================
// CONFIGURATION
// ==========================================



console.log("Shared header running");



// ==========================================
// HEADER SEARCH
// ==========================================

const setupHeaderSearch = () => {

    const searchForm =
        document.getElementById(
            "header-search-form"
        );

    const searchInput =
        document.getElementById(
            "header-search-input"
        );

    const suggestionsContainer =
        document.getElementById(
            "search-suggestions"
        );

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const currentSearch =
        urlParams.get("search") || "";

    if (searchInput) {
        searchInput.value =
            currentSearch;
    }

    if (
        !searchForm ||
        !searchInput ||
        !suggestionsContainer
    ) {
        return;
    }


    // ==========================================
    // SEARCH SUBMIT
    // ==========================================

    searchForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const search =
                searchInput.value.trim();

            if (!search) {
                return;
            }

            suggestionsContainer.hidden = true;

            window.location.href =
                `products.html?search=${encodeURIComponent(search)}`;
        }
    );


    // ==========================================
    // SEARCH SUGGESTIONS
    // ==========================================

    searchInput.addEventListener(
        "input",
        async () => {

            const query =
                searchInput.value.trim();

                console.log("Search query:", query);

            // Hide suggestions when empty
            if (!query) {
                suggestionsContainer.innerHTML = "";
                suggestionsContainer.hidden = true;
                return;
            }

            try {

                const result =
                    await apiFetch(
                        `/api/products/suggestions?q=${encodeURIComponent(query)}`
                    );

                const suggestions =
                    result?.suggestions || [];

                    console.log("Suggestions:", suggestions);

                // No results
                if (!suggestions.length) {
                    suggestionsContainer.innerHTML = "";
                    suggestionsContainer.hidden = true;
                    return;
                }


                // ==========================================
                // BUILD SUGGESTIONS
                // ==========================================

                suggestionsContainer.innerHTML =
                    suggestions.map(product => {

                      return `
    <button
        type="button"
        class="search-suggestion-item"
        data-product-name="${product.name}"
    >
        <span class="search-suggestion-name">
            ${product.name}
        </span>

        ${
            product.brand
                ? `
                    <span class="search-suggestion-brand">
                        ${product.brand}
                    </span>
                `
                : ""
        }
    </button>
`;

                    }).join("");


                suggestionsContainer.hidden = false;


                // ==========================================
                // SUGGESTION CLICK
                // ==========================================

                const suggestionItems =
                    suggestionsContainer.querySelectorAll(
                        ".search-suggestion-item"
                    );

                suggestionItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            () => {

                const productName =
                    item.dataset.productName;

                if (!productName) {
                    return;
                }

                window.location.href =
                    `products.html?search=${encodeURIComponent(productName)}`;

            }
        );

    }
);


            } catch (error) {

                console.error(
                    "Failed to load search suggestions:",
                    error
                );

                suggestionsContainer.innerHTML = "";
                suggestionsContainer.hidden = true;
            }
        }
    );


    // ==========================================
    // HIDE SUGGESTIONS WHEN CLICKING OUTSIDE
    // ==========================================

    document.addEventListener(
        "click",
        (event) => {

            if (
                !searchForm.contains(event.target)
            ) {
                suggestionsContainer.hidden = true;
            }

        }
    );

};


// ==========================================
// LOAD SHARED HEADER
// ==========================================

const loadHeader = async () => {

    const headerContainer =
        document.getElementById("site-header");

    if (!headerContainer) {
        return;
    }

    try {

        const response =
            await fetch("./components/header.html");

        if (!response.ok) {

            throw new Error(
                `Failed to load header: ${response.status}`
            );

        }

        const headerHTML =
            await response.text();

        headerContainer.innerHTML =
            headerHTML;

            setupHeaderSearch();


        // ==========================================
        // HEADER IS NOW READY
        // ==========================================

        initializeHeader();

        document.dispatchEvent(
            new CustomEvent("headerLoaded")
        );


    } catch (error) {

        console.error(
            "Failed to load shared header:",
            error
        );

    }

};


// ==========================================
// INITIALIZE HEADER
// ==========================================

const initializeHeader = async () => {
    setupLogin();
    await renderCurrentUser();
    await updateCartCount();
    await initializeMobileBottomNav();
};



// ==========================================
// LOGIN
// ==========================================

const setupLogin = () => {

    const loginButton =
        document.getElementById(
            "login-button"
        );


    if (!loginButton) {
        return;
    }


    loginButton.addEventListener(
        "click",
        loginWithGoogle
    );

};




// ==========================================
// CURRENT USER
// ==========================================

const renderCurrentUser = async () => {

    const loginButton =
        document.getElementById(
            "login-button"
        );

    const userName =
        document.getElementById(
            "user-name"
        );

    const headerUserName =
        document.getElementById(
            "header-user-name"
        );




    if (
        !loginButton ||
        !userName
    ) {
        return;
    }


    const user =
        await getCurrentUser();


    if (user) {

        // Hide Google login
        loginButton.style.display =
            "none";


        // Show user area
        userName.style.display =
            "flex";


        // Display name
        if (headerUserName) {

            headerUserName.textContent =
                user.fullName;

        } else {

            userName.textContent =
                user.fullName;

        }





    } else {

        // Show Google login
        loginButton.style.display =
            "inline-block";


        // Hide user area
        userName.style.display =
            "none";



    }

};



// ==========================================
// MOBILE BOTTOM NAVIGATION
// ==========================================

const initializeMobileBottomNav = async () => {

    const bottomNav =
        document.getElementById(
            "mobile-bottom-nav"
        );

    if (!bottomNav) {
        return;
    }


    // ==========================================
    // CURRENT PAGE
    // ==========================================

    const currentPath =
        window.location.pathname;

    const currentPage =
        currentPath
            .split("/")
            .pop()
            .toLowerCase();


    // ==========================================
    // ACTIVE PAGE
    // ==========================================

    const navItems =
        bottomNav.querySelectorAll(
            ".mobile-bottom-nav-item"
        );


    navItems.forEach((item) => {

        const href =
            item.getAttribute("href");

        if (!href) {
            return;
        }


        const linkPage =
            href
                .split("/")
                .pop()
                .split("?")[0]
                .split("#")[0]
                .toLowerCase();


        const isActive =
            linkPage === currentPage;


        item.classList.toggle(
            "active",
            isActive
        );

    });


    // ==========================================
    // ADMIN VISIBILITY
    // ==========================================

    const adminNav =
        document.getElementById(
            "mobile-admin-nav"
        );

    if (!adminNav) {
        return;
    }


    try {

        const user =
            await getCurrentUser();


        if (
            user &&
            user.role === "admin"
        ) {

            adminNav.hidden = false;

        } else {

            adminNav.hidden = true;

        }

    } catch (error) {

        console.error(
            "Failed to determine admin navigation visibility:",
            error
        );

        adminNav.hidden = true;
    }

};







// ==========================================
// CART COUNT
// ==========================================

const updateCartCount = async () => {

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

};







// ==========================================
// START
// ==========================================

loadHeader();


