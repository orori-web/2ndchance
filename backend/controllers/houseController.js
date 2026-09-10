const {
    getHouses,
    getHouseById,
} = require("../services/houseService");

// ==========================================
// PUBLIC — Get Houses
// ==========================================

const getAllHouses = async (req, res) => {

    try {

        const result = await getHouses(
            req.query
        );

        return res.status(200).json({

            success: true,

            ...result,

        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};


// ==========================================
// PUBLIC — Get Single House
// ==========================================

const getSingleHouse = async (req, res) => {

    try {

        const house = await getHouseById(
            req.params.houseId
        );

        return res.status(200).json({

            success: true,

            house,

        });

    } catch (error) {

        console.error(error);

        return res.status(404).json({

            success: false,

            message: error.message,

        });

    }

};


module.exports = {
    getAllHouses,
    getSingleHouse,
};