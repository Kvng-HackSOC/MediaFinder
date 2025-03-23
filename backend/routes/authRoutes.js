const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    User.create(username, password_hash, (err) => {
        if (err) return res.status(400).json({ error: "Username already exists" });
        res.status(201).json({ message: "User registered successfully" });
    });
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, async (err, user) => {
        if (err || !user) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        req.session.user = { id: user.id, username: user.username };
        res.json({ message: "Login successful" });
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
});

module.exports = router;
