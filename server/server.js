require('dotenv').config();
// Import routes
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/document');
const newDocumentRoutes = require('./routes/newDocumentRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const userRoutes = require ('./routes/userRoutes')

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true
}));
app.use(express.json());


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/documents/new', newDocumentRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/users',userRoutes);

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