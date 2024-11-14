const documentHandler = {};

const Document = require('../models/Document');
const DocumentHistory = require('../models/DocumentHistory');



documentHandler.debug = async (req, res)=>{
    try {
        const documents = await Document.find({});
        console.log('Debug documents found:', documents);
        const org = 'Supreme Student Council';
        const orgDocs = documents.filter(doc => doc.recipient === org);
        console.log('Documents for org:', orgDocs);
        res.json({
            count: documents.length,
            orgCount: orgDocs.length,
            documents: documents
        });
    } catch (error) {
        console.error('Debug route error:', error);
        res.status(500).json({ error: error.message });
    }
}

documentHandler.newDocument = async(req, res)=>{
    try {
        const {
          serialNumber,
          documentName,
          description,
          recipient,
          userId,
          remarks,
          currentOffice,
          originalSender
        } = req.body;
    
        // Validate required fields
        if (!serialNumber || !documentName || !recipient || !userId || !currentOffice || !originalSender) {
          return res.status(400).json({ 
            success: false,
            message: 'Please fill all required fields (including currentOffice and originalSender)' 
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
          createdAt: new Date(),
          currentOffice,
          originalSender,
          previousOffices: []
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
}

documentHandler.getAll = async (req, res) => {
    try {
        console.log('Fetching all documents...');
        const documents = await Document.find({}).sort({ createdAt: -1 });
        console.log(`Found ${documents.length} documents`);
        console.log(documents)
        res.json(documents);
    } catch (error) {
        console.error('Error in /documents/all:', error);
        res.status(500).json({ error: error.message });
    }
}

documentHandler.statusCount = async (req, res) =>{
    try {
        const userOrganization = req.query.organization;
        
        if (!userOrganization) {
          return res.status(400).json({ 
            error: 'Organization parameter is required'
          });
        }
    
        console.log('Checking counts for organization:', userOrganization);
    
        const acceptCount = await Document.countDocuments({ 
          recipient: userOrganization,
          status: 'Accept'
        });
    
        const pendingCount = await Document.countDocuments({ 
          recipient: userOrganization,
          status: 'pending'
        });
    
        const keepingCount = await Document.countDocuments({ 
          recipient: userOrganization,
          status: 'Keeping the Document'
        });
        
        const finishedCount = await Document.countDocuments({ 
          recipient: userOrganization,
          status: 'Delivered'
        });
    
        const transferredCount = await Document.countDocuments({ 
          recipient: userOrganization,
          status: 'Rejected'
        });
        
        console.log('Counts:', {
          accept: acceptCount,
          pending: pendingCount,
          keeping: keepingCount,
          finished: finishedCount,
          transferred: transferredCount
        });
    
        res.json({
          accept: acceptCount,
          pending: pendingCount,
          keeping: keepingCount,
          finished: finishedCount,
          transferred: transferredCount
        });
      } catch (error) {
        console.error('Error in status-counts:', error);
        res.status(500).json({ error: error.message });
      }
}

documentHandler.historyID = async (req, res) =>{
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
          return res.status(404).json({ message: 'Document not found' });
        }
    
        // Get all history entries from DocumentHistory collection
        const historyEntries = await DocumentHistory.find({ documentId: req.params.id })
          .sort({ date: -1 });
    
        // Create initial history array with document creation
        const history = [
          {
            date: document.createdAt,
            action: 'Document Created',
            description: `Document "${document.documentName}" was created`,
            actionsTaken: `Document "${document.documentName}" was created`,
            details: {
              documentName: document.documentName,
              serialNumber: document.serialNumber,
              description: document.description || '',
              remarks: document.remarks || ''
            }
          },
          ...historyEntries.map(entry => ({
            date: entry.date,
            action: entry.action,
            description: entry.description,
            actionsTaken: entry.details?.remarks 
              ? `${entry.description} - Remarks: ${entry.details.remarks}`
              : entry.description,
            details: {
              ...entry.details,
              description: entry.description,
              remarks: entry.details?.remarks || ''
            }
          }))
        ];
    
        res.json(history);
      } catch (error) {
        console.error('Error fetching document history:', error);
        res.status(500).json({ message: 'Error retrieving document history' });
      }
}

documentHandler.updateStatus = async(req, res)=>{
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        
        // First, get the current document to access its current status
        const currentDocument = await Document.findById(id);
        if (!currentDocument) {
          return res.status(404).json({ error: 'Document not found' });
        }
    
        // Then update the document
        const updatedDocument = await Document.findByIdAndUpdate(
          id,
          { 
            status,
            remarks: remarks || currentDocument.remarks,
            updatedAt: new Date()
          },
          { new: true }
        );
    
        // Create history entry for status change
        const history = new DocumentHistory({
          documentId: updatedDocument._id,
          action: 'Status Updated',
          description: `Document status changed to "${status}"${remarks ? ` - Remarks: ${remarks}` : ''}`,
          details: {
            previousStatus: currentDocument.status,
            newStatus: status,
            remarks: remarks
          }
        });
        await history.save();
    
        res.json(updatedDocument);
      } catch (error) {
        console.error('Error updating document status:', error);
        res.status(500).json({ error: 'Failed to update document status' });
      }
}

documentHandler.forward = async(req, res)=>{
    try {
        const { status, forwardTo, remarks, documentCopy, routePurpose, forwardedBy, forwardedAt } = req.body;
        
        // First get the current document to preserve the current recipient
        const currentDocument = await Document.findById(req.params.id);
        if (!currentDocument) {
          return res.status(404).json({ error: 'Document not found' });
        }
    
        const forwardedFrom = currentDocument.recipient; // Store the current recipient as forwardedFrom
        
        // Update document status and details
        const document = await Document.findByIdAndUpdate(
          req.params.id,
          {
            status,
            recipient: forwardTo,
            remarks,
            documentCopy,
            routePurpose,
            updatedAt: new Date()
          },
          { new: true }
        );
    
        // Create history entry for forwarding
        const history = new DocumentHistory({
          documentId: document._id,
          action: 'Forward Document',
          description: `Document forwarded from ${forwardedFrom} to ${forwardTo}`,
          details: {
            forwardedFrom, // Add the previous recipient
            forwardedBy,
            forwardTo,
            remarks,
            documentCopy,
            routePurpose,
            description: `Document forwarded from ${forwardedFrom} to ${forwardTo}` // Add description
          },
          date: forwardedAt
        });
        await history.save();
    
        res.json(document);
      } catch (error) {
        console.error('Error forwarding document:', error);
        res.status(500).json({ error: 'Failed to forward document' });
      }
}



module.exports = documentHandler;