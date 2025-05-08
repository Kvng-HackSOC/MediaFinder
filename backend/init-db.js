// backend/init-db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use data directory for SQLite database when in Docker
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join('/usr/src/app/data', 'database.sqlite')
  : './database.sqlite';

// Create and initialize the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`Error connecting to database at ${dbPath}:`, err.message);
    process.exit(1); // Exit with error
  } else {
    console.log(`Connected to SQLite database at ${dbPath}.`);
    
    // Create tables
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        email TEXT
      )`, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
        } else {
          console.log('Users table initialized.');
        }
      });
      
      // Searches table
      db.run(`CREATE TABLE IF NOT EXISTS searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        query TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) {
          console.error('Error creating searches table:', err.message);
        } else {
          console.log('Searches table initialized.');
          
          // Close the database connection after all operations are complete
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err.message);
            } else {
              console.log('Database connection closed.');
            }
          });
        }
      });
    });
  }
});

// Don't add any code here that tries to use the database after it's been closed