const { sendDocumentNotification, sendAcceptanceNotification } = require('../services/emailService');
const Organization = require('../models/Organization');
const User = require('../models/UsersModel');

const notificationHandler = {
  sendDocumentNotification: async (document) => {
    try {
      if (!document || !document.recipient) {
        console.error('Invalid document data:', document);
        return false;
      }

      // Find recipient organization (SSC)
      const recipientOrg = await Organization.findOne({
        name: { $regex: new RegExp(`^${document.recipient}$`, 'i') }
      });

      if (!recipientOrg) {
        console.error('Recipient organization not found:', document.recipient);
        return false;
      }

      // Find recipient officers
      const officers = await User.find({
        organization: recipientOrg.name,
        role: 'officer'
      }).select('email');

      if (!officers || officers.length === 0) {
        console.error('No officers found for organization:', recipientOrg.name);
        return false;
      }

      // Send notifications to all recipient officers
      let successCount = 0;
      for (const officer of officers) {
        if (!officer.email) continue;

        const success = await sendDocumentNotification(
          officer.email,
          [document],
          recipientOrg.name
        );

        if (success) successCount++;
      }

      return successCount > 0;
    } catch (error) {
      console.error('Error in document notification:', error);
      return false;
    }
  },

  sendAcceptanceNotification: async (document) => {
    try {
      if (!document || !document.originalSender) {
        console.error('Invalid document data:', document);
        return false;
      }

      // Find sender organization
      const senderOrg = await Organization.findOne({
        name: { $regex: new RegExp(`^${document.originalSender}$`, 'i') }
      });

      if (!senderOrg) {
        console.error('Sender organization not found:', document.originalSender);
        return false;
      }

      // Find only the officers from the sender organization
      const senderOfficers = await User.find({
        organization: document.originalSender,  // Use exact organization name
        role: 'officer'
      }).select('email');

      if (!senderOfficers || senderOfficers.length === 0) {
        console.error('No officers found for sender organization:', document.originalSender);
        return false;
      }

      console.log('Found sender officers:', senderOfficers.map(o => o.email));

      // Send notifications only to sender organization officers
      let successCount = 0;
      for (const officer of senderOfficers) {
        if (!officer.email) continue;

        console.log('Sending acceptance notification to sender:', officer.email);
        const success = await sendAcceptanceNotification(
          officer.email,
          [document],
          document.recipient // accepting organization
        );

        if (success) {
          successCount++;
          console.log('Acceptance notification sent successfully to:', officer.email);
        } else {
          console.error('Failed to send acceptance notification to:', officer.email);
        }
      }

      return successCount > 0;
    } catch (error) {
      console.error('Error in acceptance notification:', error);
      return false;
    }
  }
};

module.exports = notificationHandler; 