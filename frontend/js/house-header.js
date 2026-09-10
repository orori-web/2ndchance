
import {
    getCurrentUser,
    loginWithGoogle,
    logout
} from "./auth.js";

import {
    getCart
} from "./cart.js";


console.log(
    "House header running"
);


// ==========================================
// LOAD HOUSE HEADER
// ==========================================

const loadHouseHeader = async () => {

    const container =
        document.getElementById(
            "house-site-header"
        );


    if (!container) {

        console.error(
            "House header container not found."
        );

        return;

    }


    try {

        const response =
            await fetch(
                "./components/house-header.html"
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load house header: ${response.status}`
            );

        }


        const html =
            await response.text();


        container.innerHTML =
            html;


        console.log(
            "House header loaded."
        );


        setupHouseHeaderSearch();

        setupHouseLogin();

        setupHouseLogout();

        await renderHouseCurrentUser();

        await updateHouseCartCount();


        document.dispatchEvent(
            new CustomEvent(
                "houseHeaderLoaded"
            )
        );


    } catch (error) {

        console.error(
            "Failed to load house header:",
            error
        );

    }

};


// ==========================================
// HOUSE SEARCH
// ==========================================

const setupHouseHeaderSearch = () => {

    const searchForm =
        document.getElementById(
            "house-header-search-form"
        );


    const searchInput =
        document.getElementById(
            "house-header-search-input"
        );


    if (
        !searchForm ||
        !searchInput
    ) {

        return;

    }


    // ==========================================
    // RESTORE SEARCH FROM URL
    // ==========================================

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const currentSearch =
        urlParams.get("search") || "";


    searchInput.value =
        currentSearch;


    // ==========================================
    // SUBMIT SEARCH
    // ==========================================

    searchForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const search =
                searchInput.value.trim();


            // ==========================================
            // SEND SEARCH TO HOUSES.JS
            // ==========================================

            document.dispatchEvent(
                new CustomEvent(
                    "houseHeaderSearch",
                    {
                        detail: {
                            search
                        }
                    }
                )
            );

        }
    );

};


// ==========================================
// LOGIN
// ==========================================

const setupHouseLogin = () => {

    const loginButton =
        document.getElementById(
            "house-login-button"
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
// LOGOUT
// ==========================================

const setupHouseLogout = () => {

    const logoutButton =
        document.getElementById(
            "house-logout-button"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        async () => {

            const success =
                await logout();


            if (!success) {

                return;

            }


            await renderHouseCurrentUser();

        }
    );

};


// ==========================================
// CURRENT USER
// ==========================================

const renderHouseCurrentUser = async () => {

    const loginButton =
        document.getElementById(
            "house-login-button"
        );


    const userLink =
        document.getElementById(
            "house-user-name"
        );


    const userName =
        document.getElementById(
            "house-header-user-name"
        );


    const logoutButton =
        document.getElementById(
            "house-logout-button"
        );


    if (
        !loginButton ||
        !userLink
    ) {

        return;

    }


    const user =
        await getCurrentUser();


    if (user) {

        // Hide login

        loginButton.style.display =
            "none";


        // Show user

        userLink.style.display =
            "flex";


        // Set name

        if (userName) {

            userName.textContent =
                user.fullName || "Account";

        }


        // Logout remains hidden
        // to match the existing header

        if (logoutButton) {

            logoutButton.style.display =
                "none";

        }

    } else {

        // Show login

        loginButton.style.display =
            "inline-block";


        // Hide user

        userLink.style.display =
            "none";


        // Hide logout

        if (logoutButton) {

            logoutButton.style.display =
                "none";

        }

    }

};


// ==========================================
// CART COUNT
// ==========================================

const updateHouseCartCount = async () => {

    try {

        const result =
            await getCart();


        const count =
            result?.cart?.items?.length || 0;


        const cartCount =
            document.getElementById(
                "house-cart-count"
            );


        if (cartCount) {

            cartCount.textContent =
                count;

        }


    } catch (error) {

        console.error(
            "Failed to update house cart count:",
            error
        );

    }

};


// ==========================================
// START
// ==========================================

loadHouseHeader();

