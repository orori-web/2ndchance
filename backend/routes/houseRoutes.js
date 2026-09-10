const express = require("express");

const {
    getAllHouses,
    getSingleHouse,
} = require("../controllers/houseController");

const router = express.Router();

// ==========================================
// PUBLIC — Get Houses
// ==========================================

router.get(
    "/",
    getAllHouses
);

router.get(
    "/:houseId",
    getSingleHouse
);


module.exports = router;