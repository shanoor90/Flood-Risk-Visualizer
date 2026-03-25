const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

// Bypass all firestore restrictions by routing requests via Node.js
router.get('/:userId', familyController.getFamilyRisk);
router.post('/invite', familyController.createInvite);
router.post('/accept/:code', familyController.acceptInvite);
router.post('/connect-member', familyController.addConnectMember);

module.exports = router;
