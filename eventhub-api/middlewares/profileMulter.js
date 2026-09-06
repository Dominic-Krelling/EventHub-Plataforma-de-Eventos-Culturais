const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(
    __dirname,
    '../public/uploads/profiles'
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension =
            path.extname(file.originalname).toLowerCase();

        const uniqueName =
            `profile-${Date.now()}-${Math.round(
                Math.random() * 1E9
            )}${extension}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        const error = new Error(
            'A foto de perfil deve ser JPG, PNG ou WEBP.'
        );

        error.status = 400;

        return cb(error);
    }

    cb(null, true);
};

const profileUpload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = profileUpload;