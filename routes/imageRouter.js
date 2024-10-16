const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, getImages } = require('../controller/imageController');

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('image'), uploadImage);
router.get('/upload', getImages);

module.exports = router;
