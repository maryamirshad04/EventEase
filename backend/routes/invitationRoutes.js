const express = require('express');
const router = express.Router();
const { getTemplates } = require('../controllers/invitationController');

router.get('/templates', getTemplates);

module.exports = router;
