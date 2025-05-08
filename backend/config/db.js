// config/db.js
const Database = require('better-sqlite3');
const path = require('path');

// Use in-memory database to avoid native module issues
const db = new Database(':memory:', { verbose: console.log });
console.log('Connected to in-memory SQLite database');

// Create tables if they don't exist
try {
    // Create users table
    db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        email TEXT
    )`);

    // Create searches table
    db.exec(`CREATE TABLE IF NOT EXISTS searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        query TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    
    console.log('Database tables initialized.');
} catch (err) {
    console.error('Error initializing database tables:', err.message);
    process.exit(1);
}

// Create wrapper functions to maintain compatibility with sqlite3 API
const wrappedDb = {
    // Get a single row
    get: (sql, params, callback) => {
        try {
            const stmt = db.prepare(sql);
            const row = stmt.get(params);
            
            if (callback) {
                callback(null, row);
            }
            return row;
        } catch (err) {
            if (callback) {
                callback(err);
            }
            throw err;
        }
    },
    
    // Get all rows
    all: (sql, params, callback) => {
        try {
            const stmt = db.prepare(sql);
            const rows = stmt.all(params);
            
            if (callback) {
                callback(null, rows);
            }
            return rows;
        } catch (err) {
            if (callback) {
                callback(err);
            }
            throw err;
        }
    },
    
    // Run SQL (insert, update, delete)
    run: (sql, params, callback) => {
        try {
            const stmt = db.prepare(sql);
            const result = stmt.run(params);
            
            if (callback) {
                // Simulate lastID and changes like sqlite3
                callback.call({ lastID: result.lastInsertRowid, changes: result.changes });
            }
            return result;
        } catch (err) {
            if (callback) {
                callback(err);
            }
            throw err;
        }
    },
    
    // Execute raw SQL
    exec: (sql) => {
        return db.exec(sql);
    },
    
    // Close database
    close: () => {
        db.close();
    }
};

module.exports = wrappedDb;