// models/User.js
const db = require('../config/db');

class User {
  static create(username, password_hash, email, callback) {
    console.log(`Creating new user in database: ${username}, email: ${email || 'Not provided'}`);
    
    const query = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
    db.run(query, [username, password_hash, email], function(err) {
      if (err) {
        console.error('Database error creating user:', err.message);
      } else {
        console.log(`User created with ID: ${this.lastID}`);
      }
      callback(err);
    });
  }

  static findByUsername(username, callback) {
    console.log(`Looking up user by username: ${username}`);
    
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
      if (err) {
        console.error('Database error finding user:', err.message);
      } else if (user) {
        console.log(`User found: ${username}, ID: ${user.id}`);
      } else {
        console.log(`No user found with username: ${username}`);
      }
      callback(err, user);
    });
  }
}

module.exports = User;