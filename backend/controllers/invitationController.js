const nodemailer = require('nodemailer');
const Event = require('../models/Event');

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getTemplates = (req, res) => {
  res.json(TEMPLATES);
};

const sendInvitations = async (req, res) => {
  try {
    const { eventId, templateId, templateData, guests } = req.body;

    console.log('Received request:', { eventId, templateId, guestsCount: guests?.length });
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const guestsWithEmail = guests.filter(g => g && g.email);
    
    if (guestsWithEmail.length === 0) {
      return res.status(400).json({ message: 'No guests have email addresses' });
    }

    const generateEmailHTML = (guest, templateData, templateId) => {
      return `
        <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto; background: linear-gradient(160deg, #3D0B1A 0%, #5C1A2E 100%); color: #FAF7F2; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 2px; background: #D4A849; margin: 0 auto 20px;"></div>
            <p style="color: #D4A849; font-size: 12px; letter-spacing: 4px; margin: 0;">YOU ARE CORDIALLY INVITED</p>
            <div style="width: 60px; height: 2px; background: #D4A849; margin: 20px auto 0;"></div>
          </div>
          
          <h2 style="font-size: 24px; text-align: center; margin-bottom: 20px;">Dear ${guest.name},</h2>
          
          <h1 style="font-size: 28px; text-align: center; margin-bottom: 20px;">${templateData.eventName || 'Event Invitation'}</h1>
          
          ${templateData.hostName ? `<p style="text-align: center; font-size: 14px; opacity: 0.8;">Hosted by ${templateData.hostName}</p>` : ''}
     
          <div style="background: rgba(212,168,73,0.1); padding: 20px; border-radius: 12px; margin: 30px 0;">
            ${templateData.date ? `<p><strong>📅 Date:</strong> ${new Date(templateData.date).toLocaleDateString()}</p>` : ''}
            ${templateData.time ? `<p><strong>⏰ Time:</strong> ${templateData.time}</p>` : ''}
            ${templateData.location ? `<p><strong>📍 Location:</strong> ${templateData.location}</p>` : ''}
          </div>
          
          ${templateData.message ? `<p style="font-style: italic; text-align: center; margin: 20px 0;">"${templateData.message}"</p>` : ''}
          
          ${templateData.rsvp ? `
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(212,168,73,0.3);">
              <p style="font-size: 12px;">Please RSVP by: ${templateData.rsvp}</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-family: 'Amiri', serif; font-size: 14px;">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(212,168,73,0.3);">
            <p style="font-size: 10px; opacity: 0.6;">We look forward to celebrating with you!</p>
          </div>
        </div>
      `;
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not configured in .env file');
      return res.status(500).json({ 
        message: 'Email service not configured. Please contact support.',
        details: 'Missing EMAIL_USER or EMAIL_PASSWORD in environment variables'
      });
    }
    try {
      await transporter.verify();
      console.log('Email transporter is ready');
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError);
      return res.status(500).json({
        message: 'Email service configuration error',
        details: verifyError.message
      });
    }

    const results = [];
    for (const guest of guestsWithEmail) {
      try {
        const mailOptions = {
          from: `"${templateData.hostName || 'EventEase'}" <${process.env.EMAIL_USER}>`,
          to: guest.email,
          subject: `✨ You're Invited: ${templateData.eventName}`,
          html: generateEmailHTML(guest, templateData, templateId),
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${guest.email}:`, info.messageId);
        results.push({ guest: guest.name, email: guest.email, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${guest.email}:`, error.message);
        results.push({ guest: guest.name, email: guest.email, status: 'failed', error: error.message });
      }
    }

    const sentCount = results.filter(r => r.status === 'sent').length;
    
    res.json({
      message: `Sent ${sentCount} out of ${guestsWithEmail.length} invitations`,
      results,
    });
  } catch (error) {
    console.error('Failed to send invitations:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTemplates,
  sendInvitations,
};