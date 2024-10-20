const express = require('express');

const app = express();
app.use(express.json());


// API Routes
// Get all documents
app.get('/api/documents', (req, res) => {
   
});

// Get document by ID
app.get('/api/documents/i/:id', (req, res) => {

});

// Create a new document
app.post('/api/documents', async (req, res) => {

});


// 4. Update a document by ID
app.put('/api/documents/:id', async (req, res) => {

});

// Delete a document by ID
app.delete('/api/documents/:id', async (req, res) => {

});