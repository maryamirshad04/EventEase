// Hardcoded templates from frontend InvitationBuilder.jsx
const TEMPLATES = [
  {
    id: 'wedding',
    name: 'Royal Wedding',
    bgColor: '#5C1A2E',
    primaryColor: '#FAF7F2',
    accentColor: '#D4A849',
    fontFamily: 'Playfair Display, serif',
    sampleLine1: 'Wedding Ceremony',
    sampleLine2: 'Cordially Invites You',
    type: 'wedding',
  },
  {
    id: 'birthday',
    name: 'Birthday Bash',
    bgColor: '#FAF7F2',
    primaryColor: '#5C1A2E',
    accentColor: '#C47D3E',
    fontFamily: 'Dancing Script, cursive',
    sampleLine1: "Birthday Celebration",
    sampleLine2: "You're Invited!",
    type: 'birthday',
  },
  {
    id: 'dinner',
    name: 'Elegant Dinner',
    bgColor: '#2C1810',
    primaryColor: '#FAF7F2',
    accentColor: '#D4A849',
    fontFamily: 'Cormorant Garamond, serif',
    sampleLine1: 'A Dinner Evening',
    sampleLine2: 'Your Company Requested',
    type: 'dinner',
  },
];

// @desc    Get invitation templates
// @route   GET /api/invitations/templates
// @access  Public
const getTemplates = (req, res) => {
  res.json(TEMPLATES);
};

// @desc    Send invitation via email
// @route   POST /api/invitations/send
// @access  Private
const sendInvitation = async (req, res) => {
  const { eventId, guestId, templateId, message } = req.body;
  // Mock email sending
  console.log(`Sending invitation for event ${eventId} to guest ${guestId} using template ${templateId}`);
  res.status(200).json({ message: 'Invitation sent successfully' });
};

module.exports = {
  getTemplates,
  sendInvitation,
};
