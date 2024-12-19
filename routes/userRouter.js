const express = require('express');

const userController = require('../controller/userController');

const router = express.Router();

const {upload} = require('../controller/userController');



router.post('/register', upload.single('photo'), userController.userRegister);
router.post('/verify', userController.verifyEmail);
router.post('/login', userController.userLogin);
router.get('/all-users',userController.getallusers);
router.get('/single-user/:id',userController.getuserById);
router.get('/users/role/:role',userController.getUsersByRole);

module.exports = router;
