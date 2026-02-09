const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');

router.post('/', sosController.sendSOS);
router.post('/trigger-sos', sosController.triggerSOS);
router.get('/', sosController.getAlerts);

module.exports = router;
