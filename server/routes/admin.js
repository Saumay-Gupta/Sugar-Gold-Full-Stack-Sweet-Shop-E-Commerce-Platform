const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/admin/me
// Verify admin auth state
router.get('/me', isAdmin, async (req, res) => {
    // If it passes the middleware, they are a valid admin
    res.json(req.user);
});

// GET /api/admin/orders
// Fetch all orders
router.get('/orders', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'phoneNumber name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/admin/orders/:id/status
// Update order status
router.put('/orders/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/admin/stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        res.json({
            totalOrders,
            totalUsers,
            totalRevenue
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/admin/products
// Fetch all products for admin
router.get('/products', isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/admin/products/:id
// Update product price and stock
router.put('/products/:id', isAdmin, async (req, res) => {
  try {
    const { basePrice, stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { basePrice, stock },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
