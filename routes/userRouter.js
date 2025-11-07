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
// In your userRouter.js
router.post('/add-location', userController.addUserLocation);
// In your userRouter.js
router.get('/user-location/:id', userController.getuserById);

router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/verify-otp', userController.verifyOTP);
router.post('/reset-password', userController.resetPasswordWithOTP);
// Test email route (sends using configured mailer or Ethereal fallback)
router.post('/test-email', userController.testEmail);




module.exports = router;
