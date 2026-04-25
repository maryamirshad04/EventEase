const express = require('express');
const router = express.Router();
const { getTemplates, sendInvitation } = require('../controllers/invitationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/templates', getTemplates);
router.post('/send', protect, sendInvitation);

module.exports = router;
