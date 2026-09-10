const express = require("express");

const {
    getActivePostersController,
    getAllPostersController,
    getPosterByIdController,
    createPosterController,
    updatePosterController,
    togglePosterStatusController,
    deletePosterController,
} = require("../controllers/posterController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const posterUpload = require("../middleware/posterUpload");

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

// Get active posters for homepage
router.get(
    "/",
    getActivePostersController
);


// ==========================================
// ADMIN
// ==========================================

// Get all posters
router.get(
    "/admin",
    protect,
    adminOnly,
    getAllPostersController
);


// Get one poster
router.get(
    "/admin/:id",
    protect,
    adminOnly,
    getPosterByIdController
);


// Create poster
router.post(
    "/admin",
    protect,
    adminOnly,
    posterUpload.single("image"),
    createPosterController
);


// Update poster
router.put(
    "/admin/:id",
    protect,
    adminOnly,
    posterUpload.single("image"),
    updatePosterController
);


// Activate / deactivate poster
router.patch(
    "/admin/:id/status",
    protect,
    adminOnly,
    togglePosterStatusController
);


// Delete poster
router.delete(
    "/admin/:id",
    protect,
    adminOnly,
    deletePosterController
);


module.exports = router;