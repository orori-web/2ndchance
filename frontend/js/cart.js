import { apiFetch } from "./api.js";

import { renderBreadcrumb } from "./breadcrumb.js";

renderBreadcrumb([
    {
        label: "Home",
        href: "home.html"
    },
    {
        label: "cart"
    }
]);

const GUEST_CART_KEY = "secondChanceGuestCartId";


// ------------------------------------------
// Guest cart identity
// ------------------------------------------

const generateGuestCartId = () => {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return (
        "guest-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).substring(2, 10)
    );
};


const getGuestCartId = () => {

    let guestCartId =
        localStorage.getItem(GUEST_CART_KEY);

    if (!guestCartId) {

        guestCartId =
            generateGuestCartId();

        localStorage.setItem(
            GUEST_CART_KEY,
            guestCartId
        );
    }

    return guestCartId;
};




// ------------------------------------------
// Cart headers
// ------------------------------------------

const getCartHeaders = () => {

    const headers = {};

    headers["x-cart-id"] =
        getGuestCartId();

    return headers;
};


// ------------------------------------------
// Cart API
// ------------------------------------------

const getCart = async () => {

    return await apiFetch(
        "/api/cart",
        {
            headers: getCartHeaders(),
        }
    );

};


const addToCart = async (productId) => {

    return await apiFetch(
        `/api/cart/${productId}`,
        {
            method: "POST",
            headers: getCartHeaders(),
        }
    );

};


const removeFromCart = async (productId) => {

    return await apiFetch(
        `/api/cart/${productId}`,
        {
            method: "DELETE",
            headers: getCartHeaders(),
        }
    );

};


const clearCart = async () => {

    return await apiFetch(
        "/api/cart",
        {
            method: "DELETE",
            headers: getCartHeaders(),
        }
    );

};


const placeOrder = async () => {

    return await apiFetch(
        "/api/cart/place-order",
        {
            method: "POST",
            headers: getCartHeaders(),
        }
    );

};


const mergeGuestCart = async () => {

    return await apiFetch(
        "/api/cart/merge",
        {
            method: "POST",
            headers: getCartHeaders(),
        }
    );

};


export {
    getGuestCartId,
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    placeOrder,
    mergeGuestCart,
};