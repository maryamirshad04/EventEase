const express = require('express');
const router = express.Router();
const { getTemplates, sendInvitations } = require('../controllers/invitationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/templates', getTemplates);
router.post('/send', protect, sendInvitations);

module.exports = router;