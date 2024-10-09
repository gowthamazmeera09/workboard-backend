const userController = require('../controller/userController');

const express = require('express');

const router = express.Router();

router.post('/register',userController.userRegister);
router.post('/verify',userController.verifyEmail)
router.post('/login',userController.userLogin);

module.exports = router