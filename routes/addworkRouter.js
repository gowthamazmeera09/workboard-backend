const addworkController = require('../controller/addworkController');
const express = require('express');
const VerifyToken = require('../middleware/VerifyToken');

const router = express.Router();

router.post('/workadding/:userId', VerifyToken, addworkController.workadding);
router.delete('/deletework/:workId', addworkController.workdelete);

module.exports = router;