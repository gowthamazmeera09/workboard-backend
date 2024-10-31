const addworkController = require('../controller/addworkController');
const express = require('express');
const VerifyToken = require('../middleware/VerifyToken');

const router = express.Router();
router.post('/workadding',VerifyToken,addworkController.workadding);
router.delete('/:workdelete',addworkController.workdelete);

module.exports = router;