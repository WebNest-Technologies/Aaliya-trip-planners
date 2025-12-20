const express = require('express');
const router = express.Router();
const { getPublicData } = require('../controllers/publicController');
const { createEnquiry } = require('../controllers/enquiryController');

router.get('/data', getPublicData);
router.post('/enquiry', createEnquiry);

module.exports = router;
