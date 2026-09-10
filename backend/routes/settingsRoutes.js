const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
    getBusinessSettings,
    updateBusinessSettings,
} = require("../controllers/settingsController");

// Public
router.get(
    "/",
    getBusinessSettings
);

router.put(
    "/",
    protect,
    adminOnly,
    updateBusinessSettings
);
module.exports = router;