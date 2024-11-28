const nodemailer = require('nodemailer');

// Add debug logging for email configuration
console.log('Email configuration:', {
  service: 'gmail',
  user: process.env.EMAIL_USER ? 'Set' : 'Not set',
  pass: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set'
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Verification Code',
    html: `
      <h1>Password Reset Request</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  } 
};

const sendDocumentNotification = async (orgEmail, documents, organization) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: orgEmail,
    subject: 'New Documents Received',
    html: `
      <h2>New Documents Received</h2>
      <p>The following documents have been received for ${organization}:</p>
      <ul>
        ${documents.map(doc => `
          <li>
            Document: ${doc.documentName}<br>
            Serial Number: ${doc.serialNumber}<br>
            From: ${doc.originalSender}
          </li>
        `).join('')}
      </ul>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const sendAcceptanceNotification = async (senderEmail, documents, acceptingOrg) => {
  console.log('Sending acceptance notification:', {
    to: senderEmail,
    documentsCount: documents.length,
    acceptingOrg
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: senderEmail,
    subject: 'Documents Accepted',
    html: `
      <h2>Documents Accepted</h2>
      <p>The following documents have been accepted by ${acceptingOrg}:</p>
      <ul>
        ${documents.map(doc => `
          <li>
            Document: ${doc.documentName}<br>
            Serial Number: ${doc.serialNumber}<br>
            Date Accepted: ${new Date().toLocaleDateString()}
          </li>
        `).join('')}
      </ul>
      <p>This is an automated notification. Please do not reply to this email.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return true;
  } catch (error) {
    console.error('Email sending error:', {
      error: error.message,
      stack: error.stack,
      mailOptions
    });
    return false;
  }
};

module.exports = { 
  sendVerificationCode,
  sendDocumentNotification,
  sendAcceptanceNotification
}; 