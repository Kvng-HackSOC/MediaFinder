// routes/searchRoutes.js
const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const Search = require('../models/Search');
const router = express.Router();

// Save search with logging
router.post('/save', ensureAuthenticated, (req, res) => {
  const { query } = req.body;
  const user_id = req.session.user.id;
  
  console.log('=== Saving Search ===');
  console.log('User ID:', user_id);
  console.log('Username:', req.session.user.username);
  console.log('Search query:', query);
  console.log('Timestamp:', new Date().toISOString());
  
  if (!query) {
    console.log('Search save failed: No query provided');
    return res.status(400).json({ error: "Search query is required" });
  }
  
  Search.saveSearch(user_id, query, (err) => {
    if (err) {
      console.error('Error saving search:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Search saved successfully');
    res.json({ message: "Search saved" });
  });
});

// Get recent searches with logging
router.get('/recent', ensureAuthenticated, (req, res) => {
  const user_id = req.session.user.id;
  
  console.log('=== Retrieving Recent Searches ===');
  console.log('User ID:', user_id);
  console.log('Username:', req.session.user.username);
  console.log('Timestamp:', new Date().toISOString());
  
  Search.getRecentSearches(user_id, 10, (err, rows) => {
    if (err) {
      console.error('Error retrieving searches:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Retrieved ${rows.length} recent searches`);
    res.json(rows);
  });
});

module.exports = router;