const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // <-- This is the Step 3 line! It imports your database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('AgriConnect Backend Server is Running Successfully!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});