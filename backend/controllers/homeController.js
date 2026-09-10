const {
    getHomeData: getHomeDataService,
} = require("../services/homeService");

const getHomeData = async (req, res) => {
    try {

        const home = await getHomeDataService();

        return res.status(200).json({
            success: true,
            home,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    getHomeData,
};