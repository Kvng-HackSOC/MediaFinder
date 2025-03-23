const express = require('express');
const db = require('../config/db');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// Save search
router.post('/save', ensureAuthenticated, (req, res) => {
    const { query } = req.body;
    const user_id = req.session.user.id;

    db.run(`INSERT INTO searches (user_id, query) VALUES (?, ?)`, 
    [user_id, query], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Search saved" });
    });
});

// Get recent searches
router.get('/recent', ensureAuthenticated, (req, res) => {
    const user_id = req.session.user.id;

    db.all(`SELECT * FROM searches WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10`, 
    [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Delete a search
router.delete('/:id', ensureAuthenticated, (req, res) => {
    const search_id = req.params.id;
    const user_id = req.session.user.id;

    db.run(`DELETE FROM searches WHERE id = ? AND user_id = ?`, 
    [search_id, user_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Search deleted" });
    });
});

module.exports = router;
