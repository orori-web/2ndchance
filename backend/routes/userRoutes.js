const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
    getMyAccount,
} = require("../controllers/userController");

const router = express.Router();

router.get(
    "/me/account",
    protect,
    getMyAccount
);

module.exports = router;