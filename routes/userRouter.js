const express = require('express');

const userController = require('../controller/userController');

const router = express.Router();



router.post('/register',userController.userRegister);
router.post('/verify', userController.verifyEmail);
router.post('/login', userController.userLogin);
router.get('/all-users',userController.getallusers);
router.get('/single-user/:id',userController.getuserById);

module.exports = router;
