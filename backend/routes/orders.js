const express = require('express');
const router = express.Router();
const db = require('../db');

// 📦 1. PLACE A NEW ORDER (POST: http://localhost:5000/api/orders/place)
router.post('/place', async (req, res) => {
    const { customer_id, total_amount, transaction_id } = req.body;

    // Basic Validation
    if (!customer_id || !total_amount) {
        return res.status(400).json({ success: false, message: 'Missing customer_id or total_amount.' });
    }

    try {
        // Insert the order into the orders table
        // We'll mark payment_status as 'paid' if a transaction_id is provided (simulating a Mobile Money payment success)
        const paymentStatus = transaction_id ? 'paid' : 'pending';

        const [result] = await db.query(
            `INSERT INTO orders (customer_id, total_amount, payment_status, transaction_id) 
             VALUES (?, ?, ?, ?)`
        , [customer_id, total_amount, paymentStatus, transaction_id || null]);

        res.status(201).json({
            success: true,
            message: '🎉 Order placed successfully!',
            orderId: result.insertId,
            status: paymentStatus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while placing order', error: error.message });
    }
});

// 📋 2. GET ORDER HISTORY FOR A USER (GET: http://localhost:5000/api/orders/user/:userId)
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [userOrders] = await db.query(
            `SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`, 
            [userId]
        );

        res.json({
            success: true,
            count: userOrders.length,
            orders: userOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching orders', error: error.message });
    }
});

module.exports = router;