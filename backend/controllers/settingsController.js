const {
    getSettings,
    updateSettings,
} = require("../services/settingsService");

const getBusinessSettings = async (req, res) => {

    try {

        const settings = await getSettings();

        return res.status(200).json({

            success: true,

            settings,

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

const updateBusinessSettings = async (req, res) => {

    try {

        const settings = await updateSettings(req.body);

        return res.status(200).json({

            success: true,

            message: "Business settings updated successfully.",

            settings,

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

module.exports = {

    getBusinessSettings,

    updateBusinessSettings,

};