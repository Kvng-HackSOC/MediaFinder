const db = require('../config/db');

class User {
    static create(username, password_hash, callback) {
        db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`, 
        [username, password_hash], callback);
    }

    static findByUsername(username, callback) {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], callback);
    }
}

module.exports = User;
