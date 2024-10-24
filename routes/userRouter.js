const express = require('express');
// const multer = require('multer');
const userController = require('../controller/userController');

const router = express.Router();
// // Multer setup for file upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage });
// ,upload.single('imageUrl ')


router.post('/register',userController.userRegister);
router.post('/verify', userController.verifyEmail);
router.post('/login', userController.userLogin);
router.get('/all-users',userController.getallusers);
router.get('/single-user/id',userController.getuserById);

module.exports = router;
