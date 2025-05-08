// models/Search.js
const db = require('../config/db');

class Search {
  static saveSearch(userId, query, callback) {
    console.log(`Saving search: "${query}" for user ID: ${userId}`);
    
    db.run('INSERT INTO searches (user_id, query) VALUES (?, ?)', 
      [userId, query], function(err) {
        if (err) {
          console.error('Database error saving search:', err.message);
        } else {
          console.log(`Search saved with ID: ${this.lastID}`);
        }
        callback(err);
      });
  }

  static getRecentSearches(userId, limit = 10, callback) {
    console.log(`Retrieving ${limit} recent searches for user ID: ${userId}`);
    
    db.all(
      'SELECT * FROM searches WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?',
      [userId, limit],
      (err, rows) => {
        if (err) {
          console.error('Database error retrieving searches:', err.message);
        } else {
          console.log(`Retrieved ${rows?.length || 0} search records`);
        }
        callback(err, rows);
      }
    );
  }
}

module.exports = Search;