const addworkController = require('../controller/addworkController');
const { upload } = require('../controller/addworkController');
const express = require('express');
const VerifyToken = require('../middleware/VerifyToken');

const router = express.Router();
router.post('/workadding/:userId', VerifyToken, upload.array('photos', 5), addworkController.workadding);
router.delete('/deletework/:workId', VerifyToken, addworkController.workdelete);
router.post('/deleteimage', VerifyToken, addworkController.deleteImage);
router.post('/addimages/:workId', VerifyToken, upload.array('photos', 5), addworkController.addImagesToWork);

module.exports = router;
