const express = require('express');
const router = express.Router();
const notificationHandler = require('../handlers/notificationHandler');

// For new document notifications
router.post('/document-notification', async (req, res) => {
  const { documents } = req.body;

  try {
    if (!documents || !documents.length) {
      return res.status(400).json({ error: 'No documents provided' });
    }

    const results = await Promise.all(
      documents.map(doc => notificationHandler.sendDocumentNotification(doc))
    );

    if (results.every(result => result)) {
      res.status(200).json({ message: 'Document notifications sent successfully' });
    } else {
      res.status(500).json({ error: 'Some notifications failed to send' });
    }
  } catch (error) {
    console.error('Document notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// For acceptance notifications
router.post('/acceptance-notification', async (req, res) => {
  console.log('Received acceptance notification request:', req.body);
  const { documents } = req.body;

  try {
    if (!documents || !documents.length) {
      console.log('No documents provided in request');
      return res.status(400).json({ error: 'No documents provided' });
    }

    console.log('Processing documents for notification:', documents);

    const results = await Promise.all(
      documents.map(doc => {
        console.log('Sending notification for document:', doc);
        return notificationHandler.sendAcceptanceNotification(doc);
      })
    );

    console.log('Notification results:', results);

    if (results.every(result => result)) {
      res.status(200).json({ message: 'Acceptance notifications sent successfully' });
    } else {
      res.status(500).json({ error: 'Some notifications failed to send' });
    }
  } catch (error) {
    console.error('Acceptance notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 