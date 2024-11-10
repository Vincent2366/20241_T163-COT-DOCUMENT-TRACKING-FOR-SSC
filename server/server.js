require('dotenv').config();
// Import routes
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/document');
const newDocumentRoutes = require('./routes/newDocumentRoutes');
const organizationRoutes = require('./routes/organizationRoutes');


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/documents/new', newDocumentRoutes);
app.use('/api/organizations', organizationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 2000 || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});