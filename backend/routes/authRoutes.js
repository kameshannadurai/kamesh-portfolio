import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST api/auth/login
// @desc    Admin login & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Single admin login setup. Username can be 'admin' or anything.
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  try {
    let isMatch = false;
    // Check if the environment password is bcrypt-hashed or plaintext
    if (adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, adminPassword);
    } else {
      isMatch = (password === adminPassword);
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign JWT Token
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_12345678';
    const token = jwt.sign(
      { role: 'admin', user: username },
      secret,
      { expiresIn: '7d' } // token active for 7 days
    );

    res.json({
      token,
      admin: { username }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET api/auth/verify
// @desc    Verify admin token
// @access  Private
router.get('/verify', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

export default router;
