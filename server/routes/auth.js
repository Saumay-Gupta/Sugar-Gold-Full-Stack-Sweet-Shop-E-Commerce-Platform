const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
// Mock OTP login flow
router.post('/login', async (req, res) => {
  const { phoneNumber, otp, isAdminLogin } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  // Mock OTP validation
  if (otp !== '1234' && otp !== '123456') {
    return res.status(401).json({ message: 'Invalid OTP. Please use 1234 or 123456' });
  }

  try {
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    }
    // Return real token in HttpOnly cookie and user data
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    
    const cookieName = isAdminLogin ? 'admin_token' : 'token';
    
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/auth/me
// Mock user fetching
router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/auth/me/address
// Update user address
router.put('/me/address', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const { name, address } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    if (name) {
      user.name = name;
    }
    
    if (address) {
      // Check if updating an existing address or adding a new one
      // For simplicity, we just add or replace the first address here
      // Real app might let them select which one to edit by ID
      if (user.addresses.length > 0) {
        user.addresses[0] = address;
      } else {
        user.addresses.push(address);
      }
    }

    await user.save();
    res.json(user);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/auth/logout
// Clears the token cookie
router.post('/logout', (req, res) => {
  const { isAdminLogout } = req.body;
  if (isAdminLogout) {
    res.clearCookie('admin_token');
  } else {
    res.clearCookie('token');
  }
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
