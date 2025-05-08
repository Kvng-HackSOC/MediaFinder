// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Direct DB import
const router = express.Router();

// Register route with enhanced logging
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  console.log('=== Registration Attempt ===');
  console.log('Username:', username);
  console.log('Email:', email || 'Not provided');
  console.log('Timestamp:', new Date().toISOString());
  
  if (!username || !password) {
    console.log('Registration failed: Missing required fields');
    return res.status(400).json({ error: "Username and password are required" });
  }
  
  try {
    // Check if username exists - using db directly to avoid potential model issues
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        console.error('Database error during registration:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      if (user) {
        console.log('Registration failed: Username already exists');
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      // Create user
      db.run('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)', 
        [username, password_hash, email || null], 
        function(err) {
          if (err) {
            console.error('Error creating user:', err.message);
            return res.status(500).json({ error: err.message });
          }
          
          const userId = this.lastID;
          console.log('User registered successfully:', username, 'with ID:', userId);
          
          // Auto-login after registration
          req.session.user = {
            id: userId,
            username: username
          };
          
          // Save session explicitly
          req.session.save((err) => {
            if (err) {
              console.error('Error saving session:', err);
            }
            res.status(201).json({ 
              message: "User registered successfully",
              user: {
                id: userId,
                username: username
              } 
            });
          });
        }
      );
    });
  } catch (error) {
    console.error('Unexpected error during registration:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Login route with enhanced logging
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('=== Login Attempt ===');
  console.log('Username:', username);
  console.log('Request body:', req.body);
  console.log('Timestamp:', new Date().toISOString());
  
  if (!username || !password) {
    console.log('Login failed: Missing required fields');
    return res.status(400).json({ error: "Username and password are required" });
  }
  
  // Using db directly for consistency
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      console.error('Database error during login:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      console.log('Login failed: User not found -', username);
      return res.status(400).json({ error: "Invalid credentials" });
    }
    
    try {
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        console.log('Login failed: Invalid password for user -', username);
        return res.status(400).json({ error: "Invalid credentials" });
      }
      
      // Clear any existing session
      if (req.session.user) {
        console.log('Clearing existing session for user:', req.session.user.username);
      }
      
      // Set user in session
      req.session.user = {
        id: user.id,
        username: user.username
      };
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res.status(500).json({ error: "Session error" });
        }
        
        console.log('User logged in successfully:', username);
        console.log('Session data:', req.session);
        
        res.json({ 
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username
          }
        });
      });
    } catch (error) {
      console.error('Error comparing passwords:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
});

// Logout route with logging
router.post('/logout', (req, res) => {
  const username = req.session?.user?.username;
  
  console.log('=== Logout Attempt ===');
  if (username) {
    console.log('User logging out:', username);
  } else {
    console.log('Logout attempted without active session');
  }
  console.log('Timestamp:', new Date().toISOString());
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    // Clear cookie on client
    res.clearCookie('connect.sid');
    
    console.log('Logout successful');
    res.json({ message: "Logout successful" });
  });
});

// Check auth status
router.get('/check', (req, res) => {
  console.log('Auth check. Session exists:', !!req.session);
  if (req.session && req.session.user) {
    console.log('User is authenticated:', req.session.user.username);
    return res.json({
      authenticated: true,
      user: {
        id: req.session.user.id,
        username: req.session.user.username
      }
    });
  }
  console.log('User is not authenticated');
  res.json({ authenticated: false });
});

module.exports = router;