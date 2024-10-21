const express = require('express');

const app = express();
app.use(express.json());


// API Routes
// Get all documents
app.get('/api/transferIn/all', (req, res) => {
   
});

// Get document by ID
app.get('/api/transferIn/i/:id', (req, res) => {

});

app.get('/api/transferIn//:name', (req, res) => {

});

// Create a new document
app.post('/api/transferIn', async (req, res) => {

});


