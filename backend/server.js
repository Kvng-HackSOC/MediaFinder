// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const morgan = require('morgan'); // Add morgan for logging
const session = require('express-session');
// Remove SQLiteStore import
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const { ensureAuthenticated } = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// API Keys
const PEXELS_API_KEY = 'Wcqn6z8ksbFDvw_iIQU1pXE6X3C_0QLZsZewDsvyLBY';
const FREESOUND_API_KEY = 'ZKzyxKC4bDNM8ZQS9sg42L3TH8S806f6QfqDscr9';
const YOUTUBE_API_KEY = 'AIzaSyAGxD0xiu2bx_iJDvTl0RF3GMbKe4evrp0';

// Add morgan logging middleware
app.use(morgan('dev'));

// Updated CORS options for better Docker compatibility
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : ['http://localhost:3000', 'http://frontend:3000', 'http://127.0.0.1:3000'], // Add 127.0.0.1 for local testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS for preflight requests
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

// Only use static file serving if the build directory exists
try {
  const buildPath = path.join(__dirname, 'build');
  const fs = require('fs');
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
  }
} catch (err) {
  console.log('Build directory not found, skipping static file serving');
}

// Updated Session configuration for Docker
app.use(session({
  secret: process.env.SESSION_SECRET || 'app-fuse-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false even in production for Docker setup unless using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'lax' // Important for cross-domain cookie setting
  }
}));

// Log session details for each request
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  next();
});

// Debug endpoint to check session
app.get('/api/debug/session', (req, res) => {
  res.json({
    sessionExists: !!req.session,
    hasUser: !!(req.session && req.session.user),
    userData: req.session && req.session.user ? {
      id: req.session.user.id,
      username: req.session.user.username
    } : null,
    sessionID: req.sessionID
  });
});

// Simple test endpoint to verify API connectivity
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is connected successfully!' });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Add contact routes

// Use routes
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/contact', contactRoutes); // Mount contact routes at /contact

// Pexels API proxy
app.get('/api/pexels/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    console.log(`Proxying Pexels request for: ${query}, page: ${page}`);
    
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=15`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );
    
    console.log(`Pexels response status: ${response.status}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying Pexels request:', error.message);
    if (error.response) {
      console.error('Pexels error data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Freesound API proxy
app.get('/api/freesound/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const apiPage = page - 1; // Freesound uses 0-based pagination
    
    console.log(`Proxying Freesound request for: ${query}, page: ${apiPage}`);
    
    const response = await axios.get(
      `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&page=${apiPage}&page_size=15&fields=id,name,username,previews,images,license,url`,
      {
        headers: {
          'Authorization': `Token ${FREESOUND_API_KEY}`
        }
      }
    );
    
    console.log(`Freesound response status: ${response.status}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying Freesound request:', error.message);
    if (error.response) {
      console.error('Freesound error data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// YouTube API proxy
app.get('/api/youtube/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const maxResults = 15;
    
    console.log(`Proxying YouTube request for: ${query}, page: ${page}`);
    
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      maxResults: maxResults.toString(),
      type: 'video',
      key: YOUTUBE_API_KEY
    });
    
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    );
    
    console.log(`YouTube response status: ${response.status}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying YouTube request:', error.message);
    if (error.response) {
      console.error('YouTube error data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Openverse API proxy
app.get('/api/openverse/search', async (req, res) => {
  try {
    const { query, mediaType = 'image', page = 1 } = req.query;
    
    console.log(`Proxying Openverse request for: ${query}, type: ${mediaType}, page: ${page}`);
    
    const response = await axios.get(
      `https://api.openverse.org/v1/${mediaType}s/?q=${encodeURIComponent(query)}&page=${page}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    console.log(`Openverse response status: ${response.status}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying Openverse request:', error.message);
    if (error.response) {
      console.error('Openverse error data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// YouTube video details endpoint
app.get('/api/youtube/video', async (req, res) => {
  try {
    const { id } = req.query;
    
    console.log(`Proxying YouTube video details request for ID: ${id}`);
    
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${YOUTUBE_API_KEY}`
    );
    
    console.log(`YouTube video details response status: ${response.status}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying YouTube video details request:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// User profile endpoint - protected by authentication
app.get('/api/profile', ensureAuthenticated, (req, res) => {
  res.json({
    id: req.session.user.id,
    username: req.session.user.username
  });
});

// Serve React app for any other routes - only if build directory exists
app.get('*', (req, res) => {
  const buildPath = path.join(__dirname, 'build', 'index.html');
  // Check if the file exists before trying to send it
  try {
    const fs = require('fs');
    if (fs.existsSync(buildPath)) {
      res.sendFile(buildPath);
    } else {
      res.status(404).json({ message: "Not found. API endpoints are available at /api/*" });
    }
  } catch (err) {
    res.status(404).json({ message: "Not found. API endpoints are available at /api/*" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test API endpoint available at: http://localhost:${PORT}/api/test`);
});