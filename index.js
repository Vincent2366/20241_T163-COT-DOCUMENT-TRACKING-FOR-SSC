const express = require('express');

const app = express();
app.use(express.json());


// API Routes

// Add Student
app.post('/api/documents', (req, res) => {
   
});

// Get all documents
app.get('/api/documents/all', (req, res) => {
   
});

// Get by ID
app.get('/api/documents/i/:id', (req, res) => {
    
});

// Get by Name
app.get('/api/documents/n/:name', (req, res) => {
    
});