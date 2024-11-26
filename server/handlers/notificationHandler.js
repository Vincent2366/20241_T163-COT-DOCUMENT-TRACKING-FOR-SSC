const { sendDocumentNotification } = require('../services/emailService');
const Organization = require('../models/Organization');
const User = require('../models/UsersModel');

const notificationHandler = {
  sendDocumentNotification: async (document) => {
    try {
      if (!document || !document.recipient) {
        console.error('Invalid document data:', document);
        return false;
      }

      // Log the incoming document data
      console.log('Document data:', {
        recipient: document.recipient,
        documentName: document.documentName,
        status: document.status
      });
      
      // First try to find the organization
      const organization = await Organization.findOne({
        name: { $regex: new RegExp(`^${document.recipient}$`, 'i') }
      });

      if (!organization) {
        console.error('Organization not found for:', document.recipient);
        return false;
      }
      console.log('Found organization:', organization.name, 'with ID:', organization._id);

      // Find all officers for this organization
      const officers = await User.find({
        organization: organization.name,
        role: 'officer'
      }).select('name email role');

      if (!officers || officers.length === 0) {
        console.error('No officers found for organization:', organization.name);
        return false;
      }

      console.log(`Found ${officers.length} officers for organization:`, organization.name);

      // Send notifications to all officers
      let successCount = 0;
      for (const officer of officers) {
        if (!officer.email) {
          console.warn(`Officer ${officer.name} has no email address`);
          continue;
        }

        console.log('Attempting to send email notification to:', officer.email);
        const success = await sendDocumentNotification(
          officer.email,
          [document],
          organization.name
        );

        if (success) {
          successCount++;
          console.log('Email notification sent successfully to:', officer.email);
        } else {
          console.error('Failed to send email notification to:', officer.email);
        }
      }

      // Return true if at least one notification was sent successfully
      return successCount > 0;

    } catch (error) {
      console.error('Error in notification process:', {
        message: error.message,
        stack: error.stack,
        document: document?.recipient,
        errorName: error.name
      });
      return false;
    }
  }
};

module.exports = notificationHandler; 