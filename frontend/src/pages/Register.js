// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  Divider
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import { registerUser } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

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
    setError("");
    setDebugInfo(null);
    setSubmitStatus(null);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    console.log("Attempting registration with username:", formData.username);
    
    try {
      // Try to reach the test endpoint first to verify connectivity
      try {
        const testResponse = await fetch('http://localhost:5000/api/test');
        const testData = await testResponse.json();
        console.log("Test endpoint response:", testData);
      } catch (testErr) {
        console.error("Test endpoint error:", testErr);
        setDebugInfo({
          message: "Cannot connect to server",
          details: testErr.message
        });
      }
      
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log("Registration response:", response);
      
      setSubmitStatus("success");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.message === 'Network Error') {
        setError("Cannot connect to the server. Please check your network connection.");
        setDebugInfo({
          message: "Network error details",
          details: "The backend server couldn't be reached. Make sure the backend is running."
        });
      } else if (err.response) {
        setError(err.response.data.error || "Registration failed. Please try again.");
        setDebugInfo({
          status: err.response.status,
          data: err.response.data
        });
      } else {
        setError("An unexpected error occurred. Please try again.");
        setDebugInfo({
          message: err.message,
          stack: err.stack
        });
      }
      
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" color="primary.main" fontWeight={600} gutterBottom>
          Create an Account
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {debugInfo && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Debug Info:</Typography>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </Alert>
        )}
        
        {submitStatus === "success" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Redirecting to login page...
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAddIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.2 }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          
          <Divider sx={{ my: 2 }} />
          
          <Box textAlign="center">
            <Typography variant="body1">
              Already have an account?{" "}
              <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;