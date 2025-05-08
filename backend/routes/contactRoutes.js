// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();

// Contact form submission endpoint
router.post('/submit', (req, res) => {
  // Log the submission details
  console.log('=== New Contact Form Submission ===');
  console.log('From:', req.body.name, `(${req.body.email})`);
  console.log('Subject:', req.body.subject);
  console.log('Message:', req.body.message);
  console.log('Timestamp:', new Date().toISOString());
  console.log('===================================');
  
  // Return JSON response
  res.json({ 
    success: true,
    message: 'Contact form submission received successfully' 
  });
});

module.exports = router;