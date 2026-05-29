const express = require('express');
const router = express.Router();
const db = require('../db');

// 🚜 1. ADD A NEW PRODUCT (POST: http://localhost:5000/api/products/add)
router.post('/add', async (req, res) => {
    const { farmer_id, name, description, price, stock_quantity, image_url } = req.body;

    // Basic Validation
    if (!farmer_id || !name || !price || !stock_quantity) {
        return res.status(400).json({ success: false, message: 'Please provide farmer_id, product name, price, and stock quantity.' });
    }

    try {
        // Insert product data into the database
        const [result] = await db.query(
            `INSERT INTO products (farmer_id, name, description, price, stock_quantity, image_url) 
             VALUES (?, ?, ?, ?, ?, ?)`
        , [farmer_id, name, description, price, stock_quantity, image_url || null]);

        res.status(201).json({
            success: true,
            message: '🌱 Product listed in marketplace successfully!',
            productId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while adding product', error: error.message });
    }
});

// 🛒 2. GET ALL PRODUCTS FOR THE MARKETPLACE (GET: http://localhost:5000/api/products)
router.get('/', async (req, res) => {
    try {
        // Fetch all products along with the username of the farmer who posted it
        const [products] = await db.query(`
            SELECT p.*, u.username AS farmer_name 
            FROM products p 
            JOIN users u ON p.farmer_id = u.user_id 
            ORDER BY p.created_at DESC
        `);

        res.json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching products', error: error.message });
    }
});

module.exports = router;