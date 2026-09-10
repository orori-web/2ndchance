const Settings = require("../models/Settings");
const validateKenyanPhone = require("../utils/validateKenyanPhone");

const getSettings = async () => {

    let settings = await Settings.findOne();

    if (!settings) {

        settings = await Settings.create({

            whatsAppNumber: "254700000000",

        });

    }

    return settings;

};

const updateSettings = async (data) => {

    let settings = await Settings.findOne();

    if (!settings) {

        settings = await Settings.create({

            whatsAppNumber: "254700000000",

        });

    }

    if (data.businessName !== undefined) {

        settings.businessName = data.businessName;

    }

    if (data.whatsAppNumber !== undefined) {

        settings.whatsAppNumber = validateKenyanPhone(
    data.whatsAppNumber
);

    }

    if (data.supportEmail !== undefined) {

        settings.supportEmail = data.supportEmail;

    }

    if (data.supportPhone !== undefined) {

        settings.supportPhone = data.supportPhone;

    }

    await settings.save();

    return settings;

};

module.exports = {

    getSettings,

    updateSettings,

};