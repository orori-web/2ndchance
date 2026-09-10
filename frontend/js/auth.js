import { apiFetch } from "./api.js";


// ------------------------------------------
// Current authenticated user
// ------------------------------------------

let currentUser = null;


// ------------------------------------------
// Get current user from backend
// ------------------------------------------

const getCurrentUser = async () => {

    try {

        const data = await apiFetch("/api/auth/me");

        currentUser = data.user || null;

        return currentUser;

    } catch (error) {

        if (
            error.status === 401 ||
            error.status === 403
        ) {
            currentUser = null;
        }

        console.error(
            "Failed to fetch current user:",
            error
        );

        return null;

    }

};


// ------------------------------------------
// Get user already loaded in memory
// ------------------------------------------

const getStoredUser = () => {

    return currentUser;

};


// ------------------------------------------
// Check authentication status
// ------------------------------------------

const isAuthenticated = () => {

    return currentUser !== null;

};


// ------------------------------------------
// Start Google login
// ------------------------------------------

const loginWithGoogle = () => {

    window.location.href =
        "/api/auth/google";

};


// ------------------------------------------
// Public authentication API
// ------------------------------------------

const logout = async () => {

    try {

        await apiFetch("/api/auth/logout", {
            method: "POST",
        });

        currentUser = null;

        return true;

    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

        return false;

    }

};

export {

    getCurrentUser,
    getStoredUser,
    isAuthenticated,
    loginWithGoogle,
    logout,

};