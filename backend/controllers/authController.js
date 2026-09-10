const generateToken = require("../utils/generateToken");

/**
 * Called after a successful Google login.
 * Generates a JWT and returns the authenticated user.
 */
const googleCallback = async (req, res) => {
    try {

        const token = generateToken(req.user);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect("/home.html");

    } catch (error) {

        console.error("Google authentication failed:", error);

        res.status(500).json({
            success: false,
            message: "Authentication failed.",
        });

    }
};
/**
 * Returns the currently authenticated user.
 * Requires the protect middleware.
 */
const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                profilePicture: req.user.profilePicture,
                role: req.user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch current user.",
        });
    }
};


const logout = async (req, res) => {
    try {

        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });

    } catch (error) {

        console.error("Logout failed:", error);

        return res.status(500).json({
            success: false,
            message: "Logout failed.",
        });

    }
};

module.exports = {
    googleCallback,
    getCurrentUser,
    logout,
};