const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/', locationController.updateLocation);
router.get('/history/:userId', locationController.getLocationHistory);
router.get('/latest/:userId', locationController.getLatestLocation);
router.post('/preferences', locationController.updatePreferences);
router.get('/preferences/:userId', locationController.getPreferences);

module.exports = router;
