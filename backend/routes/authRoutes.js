const express = require("express");
const passport = require("passport");
const {
    googleCallback,
    getCurrentUser,
    logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Redirect user to Google
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get("/me", protect, getCurrentUser);

// Google redirects here after authentication
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/api/auth/failed",
    }),
    googleCallback
);


router.post("/logout", logout);


// Authentication failed
router.get("/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Google authentication failed.",
    });
});

module.exports = router;