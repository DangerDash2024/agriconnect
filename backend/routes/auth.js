const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db'); // Reaches up one folder to find db.js

// 📝 REAL REGISTRATION ENDPOINT: http://localhost:5000/api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    // Basic Validation
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    try {
        // 1. Check if the user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }

        // 2. Hash the password securely (never store plain text!)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Insert the new user into the database
        // Default role to 'customer' if not provided or invalid
        const userRole = ['admin', 'farmer', 'customer'].includes(role) ? role : 'customer';

        await db.query(
            `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`
        , [username, email, passwordHash, userRole]);

        res.status(201).json({
            success: true,
            message: '🎉 User registered successfully!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
    }
});
// 🔐 REAL LOGIN ENDPOINT: http://localhost:5000/api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic Validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        // 1. Check if the user exists in the database
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid credentials (email not found)' });
        }

        const user = users[0]; // Get the user record

        // 2. Compare the incoming plain text password with the database password_hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials (wrong password)' });
        }

        // 3. Login successful! Return user details (excluding the password hash for safety)
        res.json({
            success: true,
            message: `👋 Welcome back, ${user.username}!`,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
});
module.exports = router;