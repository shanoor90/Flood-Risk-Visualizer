const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

router.get('/', guideController.getSurvivalGuide);
router.get('/shelters', guideController.getShelters);
router.post('/mark-safe', guideController.markSafe);

module.exports = router;
