const {
    getMyAccount: getMyAccountService,
} = require("../services/userService");

const getMyAccount = async (req, res) => {
    try {

        const account = await getMyAccountService(
            req.user._id
        );

        return res.status(200).json({
            success: true,
            account,
        });

    } catch (error) {
        console.error(error);

        if (error.message === "User not found.") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getMyAccount,
};