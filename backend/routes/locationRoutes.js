const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/', locationController.updateLocation);
router.get('/history/:userId', locationController.getLocationHistory);

module.exports = router;
