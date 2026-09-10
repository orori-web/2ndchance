const {
    getActivePosters,
    getAllPosters,
    getPosterById,
    createPoster,
    updatePoster,
    togglePosterStatus,
    deletePoster,
} = require("../services/posterService");


// ==========================================
// GET ACTIVE POSTERS
// PUBLIC
// ==========================================

const getActivePostersController = async (req, res) => {
    try {

        const posters =
            await getActivePosters();

        return res.status(200).json({
            success: true,
            posters,
        });

    } catch (error) {

        console.error(
            "Failed to get active posters:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load posters.",
        });
    }
};


// ==========================================
// GET ALL POSTERS
// ADMIN
// ==========================================

const getAllPostersController = async (req, res) => {
    try {

        const posters =
            await getAllPosters();

        return res.status(200).json({
            success: true,
            posters,
        });

    } catch (error) {

        console.error(
            "Failed to get all posters:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load posters.",
        });
    }
};


// ==========================================
// GET SINGLE POSTER
// ADMIN
// ==========================================

const getPosterByIdController = async (req, res) => {
    try {

        const poster =
            await getPosterById(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            poster,
        });

    } catch (error) {

        console.error(
            "Failed to get poster:",
            error
        );

        if (
            error.message ===
            "Poster not found."
        ) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to load poster.",
        });
    }
};


// ==========================================
// CREATE POSTER
// ADMIN
// ==========================================

const createPosterController = async (req, res) => {
    try {

        const poster =
            await createPoster({
                file: req.file,
                title: req.body.title,
                link: req.body.link,
                placement: req.body.placement,
                displayOrder:
                    req.body.displayOrder,
            });

        return res.status(201).json({
            success: true,
            message: "Poster created successfully.",
            poster,
        });

    } catch (error) {

        console.error(
            "Failed to create poster:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message ||
                "Failed to create poster.",
        });
    }
};


// ==========================================
// UPDATE POSTER
// ADMIN
// ==========================================

const updatePosterController = async (req, res) => {
    try {

        const poster =
            await updatePoster(
                req.params.id,
                {
                    file: req.file,
                    title: req.body.title,
                    link: req.body.link,
                    placement: req.body.placement,
                    displayOrder:
                        req.body.displayOrder,
                }
            );

        return res.status(200).json({
            success: true,
            message: "Poster updated successfully.",
            poster,
        });

    } catch (error) {

        console.error(
            "Failed to update poster:",
            error
        );

        if (
            error.message ===
            "Poster not found."
        ) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message ||
                "Failed to update poster.",
        });
    }
};


// ==========================================
// TOGGLE POSTER STATUS
// ADMIN
// ==========================================

const togglePosterStatusController = async (req, res) => {
    try {

        const poster =
            await togglePosterStatus(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message: poster.isActive
                ? "Poster activated successfully."
                : "Poster deactivated successfully.",
            poster,
        });

    } catch (error) {

        console.error(
            "Failed to toggle poster status:",
            error
        );

        if (
            error.message ===
            "Poster not found."
        ) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message ||
                "Failed to update poster status.",
        });
    }
};


// ==========================================
// DELETE POSTER
// ADMIN
// ==========================================

const deletePosterController = async (req, res) => {
    try {

        await deletePoster(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Poster deleted successfully.",
        });

    } catch (error) {

        console.error(
            "Failed to delete poster:",
            error
        );

        if (
            error.message ===
            "Poster not found."
        ) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete poster.",
        });
    }
};


module.exports = {

    getActivePostersController,
    getAllPostersController,
    getPosterByIdController,
    createPosterController,
    updatePosterController,
    togglePosterStatusController,
    deletePosterController,

};