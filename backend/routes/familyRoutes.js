const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

router.post('/add', familyController.addFamilyMember);
router.get('/risk/:userId', familyController.getFamilyRisk);

module.exports = router;
