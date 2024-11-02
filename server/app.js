const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); 
const adminRoutes = require('./routes/admin');
const documentRoutes = require('./routes/document');
const userRoutes = require('./routes/userRoutes'); // Ensure this path is correct
const testUserRoutes = require('./routes/testUser');
const cors = require('cors');
const newDocumentRoutes = require('./routes/newDocumentRoutes');

require('dotenv').config(); 
const app = express();

app.use(express.json()); 
app.use(cors());

// Routes
app.use('/auth', authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/documents', documentRoutes);
app.use('/api/users', userRoutes); // Ensure this line is present
app.use('/api/testUser', testUserRoutes);
app.use('/api/documents/new', newDocumentRoutes);

console.log(process.env.MONGODB_URI);

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Optional: How long to wait for a server to be available
  socketTimeoutMS: 45000, // Optional: Close sockets after 45 seconds
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});


// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 2000 || 3000 || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
