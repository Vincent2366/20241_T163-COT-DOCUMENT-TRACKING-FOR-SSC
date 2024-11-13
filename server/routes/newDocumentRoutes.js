const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const DocumentHistory = require('../models/DocumentHistory');

router.post('/', async function(req, res) {
  try {
    const {
      serialNumber,
      documentName,
      description,
      recipient,
      userId,
      remarks
    } = req.body;

    // Validate required fields
    if (!serialNumber || !documentName || !recipient || !userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Please fill all required fields' 
      });
    }

    // Create new document
    const newDocument = new Document({
      serialNumber,
      documentName,
      description: description || '',
      recipient,
      userId,
      remarks: remarks || '',
      status: 'Accept',
      createdAt: new Date()
    });

    await newDocument.save();

    // Create history entry
    const history = new DocumentHistory({
      documentId: newDocument._id,
      action: 'Document Created',
      description: `Document "${documentName}" was created by ${userId}`
    });
    await history.save();

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
        message: 'This Serial Number is already in use.',
        error: error.message
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'An error occurred while creating the document.',
      error: error.message
    });
  }
});

module.exports = router;