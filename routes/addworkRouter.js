const express = require('express');
const addworkController = require('../controller/addworkController');
const VerifyToken = require('../middleware/VerifyToken');

const router = express.Router();

// Add work route
router.post('/workadding/:userId', VerifyToken, addworkController.workadding);

// Delete work route
router.delete('/deletework/:workId', addworkController.workdelete);

module.exports = router;
