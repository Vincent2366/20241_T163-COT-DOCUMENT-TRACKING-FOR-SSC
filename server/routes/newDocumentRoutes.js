const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

router.post('/', async function(req, res) {
  try {
    const {
      serialNumber,
      documentName,
      recipient,
      userId,
      remarks,
      status,
      createdAt
    } = req.body;

    // Validate required fields
    if (!serialNumber || !documentName || !recipient || !userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Please fill all required fields' 
      });
    }

    // Create new document with parsed date
    const newDocument = new Document({
      serialNumber,
      documentName,
      recipient,
      userId,
      remarks,
      status: status || 'pending',
      createdAt: createdAt ? new Date(createdAt) : new Date(), // Parse the date
      createdBy: "64f1f3c1e2c1e123456789ab" // Temporary
    });

    await newDocument.save();

    res.status(201).json({
      success: true,
      document: newDocument,
      message: 'Document created successfully'
    });

  } catch (error) {
    console.error('Error creating document:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This Serial Number is already in use. Please use a different Serial Number.',
        error: error
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
        error: error
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'An error occurred while creating the document.',
      error: error
    });
  }
});

module.exports = router;