const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Utility to convert string weights to KG numbers
const parseWeightToKg = (weightStr) => {
  if (!weightStr) return 1;
  const lowerStr = weightStr.toLowerCase();
  
  // If it's explicitly KG
  if (lowerStr.includes('kg')) {
    const num = parseFloat(lowerStr.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 1 : num;
  }
  
  // If it's Grams (g or gm)
  if (lowerStr.includes('g') || lowerStr.includes('gm')) {
    const num = parseFloat(lowerStr.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 1 : num / 1000;
  }
  
  // Default for "Box of 6", "Standard Box", etc (Gift packs)
  return 1;
};

// POST /api/orders
// Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, shippingMethod, shippingFee, shippingAddress } = req.body;
    
    // Extracting user ID from HttpOnly Cookie
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      userId = decoded.id;
    } catch(err) {
      return res.status(401).json({ message: 'Unauthorized, Invalid Token' });
    }

    // Process stock decrement
    for (const item of items) {
      // Find the product and decrement its stock by the weight ordered.
      // E.g., if stock is 50kg, and user ordered 3x 500g (1.5kg), the deduction is 1.5.
      const weightInKg = parseWeightToKg(item.weight);
      const totalDeduction = item.quantity * weightInKg;
      
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -totalDeduction }
      });
    }

    const order = new Order({
      user: userId,
      items,
      totalAmount,
      shippingMethod,
      shippingFee,
      shippingAddress,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// GET /api/orders/me
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
        let userId;
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
          userId = decoded.id;
        } catch(err) {
          return res.status(401).json({ message: 'Unauthorized, Invalid Token Format' });
        }

        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch(err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
