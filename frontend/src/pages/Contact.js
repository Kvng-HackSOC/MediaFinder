// src/pages/Contact.js
import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Container,
  Paper, CircularProgress, Alert, Snackbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Send to the correct endpoint
      const response = await fetch('http://localhost:5000/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      // Get text response first for debugging
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Response is not valid JSON:', responseText);
        throw new Error('Server returned invalid data format');
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'There was a problem submitting your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, color: 'primary.main' }}>
          Contact Us
        </Typography>
        
        <Typography variant="body1" paragraph>
          Have questions, feedback, or suggestions about MediaFinder? We'd love to hear from you! Fill out the form
          below and we'll get back to you as soon as possible.
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <TextField
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              sx={{ flex: { xs: '1 0 100%', sm: '1 0 48%' } }}
            />
            
            <TextField
              label="Your Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              sx={{ flex: { xs: '1 0 100%', sm: '1 0 48%' } }}
            />
          </Box>
          
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 3 }}
          />
          
          <TextField
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            multiline
            rows={6}
            fullWidth
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ py: 1.5, px: 4 }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Your message has been sent successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;