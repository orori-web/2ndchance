const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "second-chance/products",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "avif",
        ],

        public_id: `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`,
    }),
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        return cb(null, true);
    }

    cb(new Error("Only image files are allowed."));
};

const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 2,
    },
});

module.exports = upload;