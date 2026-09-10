const cloudinary = require("../config/cloudinary");


// ==========================================
// UPLOAD POSTER
// ==========================================

const uploadPoster = async (file) => {

    if (!file) {
        throw new Error("Poster image is required.");
    }

    const result =
        await cloudinary.uploader.upload(
            file.path,
            {
                folder: "second-chance-store/posters",
                resource_type: "image",
            }
        );

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };

};


// ==========================================
// DELETE POSTER IMAGE
// ==========================================

const deletePosterImage = async (
    publicId
) => {

    if (!publicId) {
        return;
    }

    await cloudinary.uploader.destroy(
        publicId,
        {
            resource_type: "image",
        }
    );

};


module.exports = {

    uploadPoster,
    deletePosterImage,

};