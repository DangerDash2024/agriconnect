const express = require('express');
const router = express.Router();
const db = require('../db');

// 💬 1. SEND A MESSAGE (POST: http://localhost:5000/api/messages/send)
router.post('/send', async (req, res) => {
    const { sender_id, receiver_id, message_text } = req.body;

    // Basic Validation
    if (!sender_id || !receiver_id || !message_text) {
        return res.status(400).json({ success: false, message: 'Missing sender_id, receiver_id, or message text.' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`
        , [sender_id, receiver_id, message_text]);

        res.status(201).json({
            success: true,
            message: '✉️ Message sent successfully!',
            messageId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while sending message', error: error.message });
    }
});

// 📥 2. FETCH CHAT HISTORY BETWEEN TWO USERS (GET: http://localhost:5000/api/messages/chat/:user1/:user2)
router.get('/chat/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        const [conversation] = await db.query(`
            SELECT m.*, 
                   sender.username AS sender_name, 
                   receiver.username AS receiver_name
            FROM messages m
            JOIN users sender ON m.sender_id = sender.user_id
            JOIN users receiver ON m.receiver_id = receiver.user_id
            WHERE (m.sender_id = ? AND m.receiver_id = ?) 
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.timestamp ASC
        `, [user1, user2, user2, user1]);

        res.json({
            success: true,
            count: conversation.length,
            messages: conversation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching chat', error: error.message });
    }
});

module.exports = router;