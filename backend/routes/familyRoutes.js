const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

router.get('/:userId', familyController.getFamilyRisk);
router.post('/connect', familyController.addConnectMember);
router.post('/invite', familyController.createInvite);
router.get('/invite/:code', familyController.getInviteDetail);
router.post('/accept/:code', familyController.acceptInvite);
router.delete('/:userId/:memberId', familyController.deleteMember);

module.exports = router;
