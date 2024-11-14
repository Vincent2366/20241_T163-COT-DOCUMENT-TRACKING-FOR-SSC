const mongoose = require('mongoose');

const documentHistorySchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  details: {
    previousStatus: String,
    newStatus: String,
    remarks: String,
    forwardedFrom: String,
    description: String,
    forwardTo: String
  }
});

module.exports = mongoose.model('DocumentHistory', documentHistorySchema);
 