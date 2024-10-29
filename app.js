const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); 
const adminRoutes = require('./routes/admin');
const documentRoutes = require('./routes/document');
require('dotenv').config(); 

const app = express();

app.use(express.json()); 

// Routes
app.use('/auth', authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/documents', documentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
