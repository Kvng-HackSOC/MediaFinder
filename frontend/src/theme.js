// src/theme.js
import { createTheme } from '@mui/material/styles';

// Modern, inviting color palette
const appTheme = createTheme({
  palette: {
    primary: {
      main: '#5e8bff', // Soft blue
      light: '#9fb8ff',
      dark: '#3a6ae8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5ad4a6', // Mint green
      light: '#8aebc6',
      dark: '#39a47d',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#ffb470', // Warm orange
      light: '#ffd0a1',
      dark: '#ff9642',
    },
    background: {
      default: '#f8f9fe', // Very light blue-gray
      paper: '#ffffff',
      dark: '#323259', // Dark blue-purple for contrast areas
    },
    text: {
      primary: '#323259', // Dark blue-purple
      secondary: '#656693', // Medium blue-purple
      hint: '#9b9dcb', // Light blue-purple
    },
    error: {
      main: '#ff6b6b', // Softer red for errors
    },
    success: {
      main: '#67d4a8', // Soft green for success
    },
    warning: {
      main: '#ffbe40', // Soft yellow for warnings
    },
    info: {
      main: '#64c4ff', // Soft blue for info
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight:
       500,
      textTransform: 'none', // Avoid all caps for buttons
    },
  },
  shape: {
    borderRadius: 12, // Slightly rounder corners
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(102, 111, 228, 0.05)',
    '0px 4px 8px rgba(102, 111, 228, 0.1)',
    // ...keep the rest of default shadows
    ...Array(22).fill(''),
  ].map((shadow, i) => i < 3 ? shadow : createTheme().shadows[i]),
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0px 4px 8px rgba(94, 139, 255, 0.15)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 16px rgba(94, 139, 255, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #5e8bff 0%, #3a6ae8 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #5ad4a6 0%, #39a47d 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 24px rgba(94, 139, 255, 0.08)',
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#323259',
          boxShadow: '0px 2px 8px rgba(94, 139, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default appTheme;