const express = require('express');
const router = express.Router();
const { sendDocumentNotification } = require('../services/emailService');
const Organization = require('../models/Organization'); // You'll need to import your Organization model

router.post('/document-notification', async (req, res) => {
  const { documents, organizationId } = req.body;

  try {
    // Get organization details
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Send email notification
    const success = await sendDocumentNotification(
      organization.email,
      documents,
      organization.name
    );

    if (success) {
      res.status(200).json({ message: 'Notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 