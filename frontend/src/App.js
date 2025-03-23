// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import appTheme from "./theme";  // Changed from 'theme' to 'appTheme'
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  const [user, setUser] = React.useState(null);

  return (
    <ThemeProvider theme={appTheme}>  {/* Changed from 'theme' to 'appTheme' */}
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar user={user} setUser={setUser} />
          <Container component="main" sx={{ flex: 1, py: 4 }}>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Container>
          <Box component="footer" sx={{ py: 3, bgcolor: 'black', color: 'primary.main', textAlign: 'center' }}>
            © {new Date().getFullYear()} Open Media Search | Powered by Openverse API
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;