const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // This allows our server to parse JSON data sent by the frontend

// Import Routes
const authRoutes = require('./routes/auth');

// Use Routes (This prefixes all auth endpoints with /api/auth)
app.use('/api/auth', authRoutes);

// Home Route
app.get('/', (req, res) => {
    res.send('AgriConnect Backend Server is Running Successfully!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});