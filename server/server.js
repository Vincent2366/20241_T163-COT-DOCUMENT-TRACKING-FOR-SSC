require('dotenv').config();
// Import routes

const api = require('./routes/api')

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true
}));
app.use(express.json());


// Use routes
app.use('/api', api);


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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads and profiles directories if they don't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
const profilesDir = path.join(__dirname, 'uploads/profiles');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir);
}

const PORT = process.env.PORT || 2000 || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});