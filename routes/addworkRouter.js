const addworkController = require('../controller/addworkController');
const { upload } = require('../controller/addworkController');
const express = require('express');
const VerifyToken = require('../middleware/VerifyToken');

const router = express.Router();
router.post('/workadding/:userId', VerifyToken, upload.array('photos', 5), addworkController.workadding);
router.delete('/deletework/:workId', addworkController.workdelete);
router.post('/deleteimage', addworkController.deleteImage);

module.exports = router;