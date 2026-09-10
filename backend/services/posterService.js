const Poster = require("../models/poster");
const cloudinary = require("../config/cloudinary");


// ==========================================
// GET ACTIVE POSTERS
// PUBLIC
// ==========================================

const getActivePosters = async () => {

    return await Poster.find({
        isActive: true,
    })
        .sort({
            displayOrder: 1,
            createdAt: -1,
        })
        .select("-__v");

};


// ==========================================
// GET ALL POSTERS
// ADMIN
// ==========================================

const getAllPosters = async () => {

    return await Poster.find()
        .sort({
            displayOrder: 1,
            createdAt: -1,
        })
        .select("-__v");

};


// ==========================================
// GET SINGLE POSTER
// ADMIN
// ==========================================

const getPosterById = async (posterId) => {

    const poster =
        await Poster.findById(posterId)
            .select("-__v");

    if (!poster) {

        throw new Error(
            "Poster not found."
        );

    }

    return poster;

};


// ==========================================
// CREATE POSTER
// ADMIN
// ==========================================

const createPoster = async ({
    file,
    title,
    link,
    placement,
    displayOrder,
}) => {

    if (!file) {

        throw new Error(
            "Poster image is required."
        );

    }

    const poster =
        await Poster.create({

            image: {

                url: file.path,

                publicId: file.filename,

            },

            title:
                title || "",

            link:
                link || "",

            placement,    

            displayOrder:
                Number(displayOrder) || 0,

            isActive: true,

            

        });

    return poster;

};


// ==========================================
// UPDATE POSTER
// ADMIN
// ==========================================

const updatePoster = async (
    posterId,
    {
        file,
        title,
        link,
        placement,
        displayOrder,
    }
) => {

    const poster =
        await Poster.findById(
            posterId
        );

    if (!poster) {

        throw new Error(
            "Poster not found."
        );

    }


    // --------------------------------------
    // Update text fields
    // --------------------------------------

    if (title !== undefined) {

        poster.title =
            title;

    }


    if (link !== undefined) {

        poster.link =
            link;

    }


    if (placement !== undefined) {
    poster.placement = placement;
}


    if (
        displayOrder !== undefined
    ) {

        poster.displayOrder =
            Number(displayOrder) || 0;

    }


    // --------------------------------------
    // Replace image
    // --------------------------------------

    if (file) {

        const oldPublicId =
            poster.image.publicId;


        // Save new Cloudinary image
        poster.image = {

            url: file.path,

            publicId: file.filename,

        };


        // Delete old image
        if (oldPublicId) {

            await cloudinary.uploader.destroy(
                oldPublicId
            );

        }

    }


    await poster.save();

    return poster;

};


// ==========================================
// TOGGLE POSTER STATUS
// ADMIN
// ==========================================

const togglePosterStatus = async (
    posterId
) => {

    const poster =
        await Poster.findById(
            posterId
        );

    if (!poster) {

        throw new Error(
            "Poster not found."
        );

    }


    poster.isActive =
        !poster.isActive;


    await poster.save();

    return poster;

};


// ==========================================
// DELETE POSTER
// ADMIN
// ==========================================

const deletePoster = async (
    posterId
) => {

    const poster =
        await Poster.findById(
            posterId
        );

    if (!poster) {

        throw new Error(
            "Poster not found."
        );

    }


    // --------------------------------------
    // Delete image from Cloudinary
    // --------------------------------------

    if (
        poster.image &&
        poster.image.publicId
    ) {

        await cloudinary.uploader.destroy(
            poster.image.publicId
        );

    }


    // --------------------------------------
    // Delete database record
    // --------------------------------------

    await Poster.findByIdAndDelete(
        posterId
    );

    return true;

};


module.exports = {

    getActivePosters,
    getAllPosters,
    getPosterById,
    createPoster,
    updatePoster,
    togglePosterStatus,
    deletePoster,

};