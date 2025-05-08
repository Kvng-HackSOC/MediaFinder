// src/pages/Login.js
import React, { useState, useEffect } from 'react';
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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { loginUser, checkAuthStatus } from '../services/api';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if we're already logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus();
        if (response.data.authenticated) {
          setUser(response.data.user);
          navigate('/');
        }
      } catch (err) {
        console.log('Not currently authenticated');
      }
    };
    
    checkAuth();
  }, [navigate, setUser]);

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
    
    console.log("Attempting login with:", formData.username);
    
    try {
      // Try to reach the test endpoint first to verify connectivity
      try {
        const testResponse = await fetch('http://localhost:5000/api/test');
        const testData = await testResponse.json();
        console.log("Test endpoint response:", testData);
      } catch (testErr) {
        console.error("Test endpoint error:", testErr);
      }
      
      const response = await loginUser(formData);
      console.log("Login response:", response);
      
      // Set the user in app context
      setUser(response.data.user);
      
      // Redirect to home page
      navigate('/');
      
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.message === 'Network Error') {
        setError("Cannot connect to the server. Please check your network connection.");
      } else if (err.response) {
        setError(err.response.data.error || "Login failed. Please check your credentials.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" color="primary.main" fontWeight={600} gutterBottom>
          Login to MediaFinder
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
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
                  <PersonOutlineIcon />
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
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.2 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          
          <Divider sx={{ my: 2 }} />
          
          <Box textAlign="center">
            <Typography variant="body1">
              Don't have an account?{" "}
              <Link to="/register" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;