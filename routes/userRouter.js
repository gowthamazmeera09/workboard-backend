const express = require('express');
const multer = require('multer');
const userController = require('../controller/userController');

const router = express.Router();
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


router.post('/register',upload.single('image'),userController.userRegister);
router.post('/verify', userController.verifyEmail);
router.post('/login', userController.userLogin);

module.exports = router;
