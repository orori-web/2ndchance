const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");


// ==========================================
// CLOUDINARY STORAGE
// ==========================================

const storage = new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => ({

        folder: "second-chance/posters",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "avif",
            "gif",
            "svg",
        ],

        public_id:
            `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`,

    }),

});


// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {
    console.log("POSTER FILE RECEIVED:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
    });

    // Normal case: browser/client correctly identifies the image
    if (file.mimetype.startsWith("image/")) {
        return cb(null, true);
    }

    // Fallback for clients such as Postman sending application/octet-stream
    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".avif",
        ".gif",
        ".bmp",
        ".tiff",
        ".tif",
        ".svg",
    ];

    const extension = require("path")
        .extname(file.originalname)
        .toLowerCase();

    if (
        file.mimetype === "application/octet-stream" &&
        allowedExtensions.includes(extension)
    ) {
        return cb(null, true);
    }

    return cb(
        new Error("Only image files are allowed.")
    );
};

// ==========================================
// MULTER
// ==========================================

const posterUpload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024, // 5 MB

        files: 1,

    },

});


module.exports = posterUpload;