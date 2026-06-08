const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, token } = req.body || {};
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    //     if(token && token !== 'undefined' && token !== 'null') { 
    //     const push_title = 'Welcome Back!'; 
    //     const push_body = 'Thank you for logging in!';
    //     const data = { key1: 'value1', key2: 'value2' };
    //     sendPush(token, push_title, push_body, data);
        
    //     user.token = token;
    //     await user.save();
    //   }
        res.json({ token: jwtToken, user, message: 'Logged in successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get logged-in user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email']
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.token = null;
        await user.save();
        res.json({ message: 'Logged out successfully' });
} catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
