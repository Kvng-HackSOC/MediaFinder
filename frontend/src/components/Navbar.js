// src/components/Navbar.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Link,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useTheme } from '@mui/material/styles';

const Navbar = ({ user, setUser }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setUser(null);
    handleCloseUserMenu();
    navigate('/');
  };

  return (
    <AppBar position="static" elevation={0} color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.02rem',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #5e8bff 0%, #3a6ae8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              '&:hover': {
                opacity: 0.8,
              }
            }}
          >
            MediaFinder
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/">
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/about">
                <Typography textAlign="center">About</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/contact">
                <Typography textAlign="center">Contact</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.02rem',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #5e8bff 0%, #3a6ae8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MediaFinder
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/about"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
            >
              About
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
            >
              Contact
            </Button>
          </Box>

          {/* Search icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <IconButton
              size="large"
              aria-label="search"
              color="inherit"
              onClick={() => navigate('/')}
            >
              <SearchIcon />
            </IconButton>
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.username}
                      src={user.avatar}
                      sx={{ 
                        bgcolor: 'primary.main',
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(94, 139, 255, 0.2)'
                      }}
                    >
                      {user.username ? user.username[0].toUpperCase() : <AccountCircleIcon />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/profile">
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  {user && user.isAdmin && (
                    <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/admin">
                      <Typography textAlign="center">Admin Dashboard</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button 
                  component={RouterLink} 
                  to="/login"
                  sx={{ 
                    mx: 1,
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(94, 139, 255, 0.08)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/register"
                  variant="contained"
                  sx={{ 
                    mx: 1,
                    boxShadow: '0 4px 12px rgba(94, 139, 255, 0.15)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(94, 139, 255, 0.2)',
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;