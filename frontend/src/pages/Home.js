// src/pages/Home.js
import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Container,
  Grid, Card, CardContent, CardMedia, CardActionArea,
  InputAdornment, CircularProgress, Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThreeBackground from '../components/ThreeBackground';
import { searchMedia } from '../services/openverseApi'; // Import the API service
import MediaGrid from '../components/MediaGrid'; // If you're using the separate component

const Home = ({ user }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Updated search handler to use the Openverse API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchMedia(query);
      setResults(data.results || []);
      console.log('API response:', data); // For debugging
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThreeBackground style={{ zIndex: -1, opacity: 0.6 }} />
      
      {/* Hero section */}
      <Box 
        className="hero-bg"
        sx={{
          pt: 10,
          pb: 15,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Fade in={true} timeout={1000}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                color: 'white',
                textShadow: '0 2px 12px rgba(0,0,0,0.1)'
              }}
            >
              Discover Creative Media
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={1200}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 5, 
                fontWeight: 400,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Search through millions of high-quality images, illustrations, and creative assets
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={1400}>
            <Box 
              component="form" 
              onSubmit={handleSearch}
              sx={{ 
                display: 'flex', 
                maxWidth: '700px',
                mx: 'auto',
                px: { xs: 2, md: 0 }
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for images, illustrations, vectors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'white',
                    borderRadius: '12px 0 0 12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    '& fieldset': { border: 'none' },
                    height: '60px',
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                className="search-btn"
                disabled={loading}
                sx={{
                  borderRadius: '0 12px 12px 0',
                  height: '60px',
                  px: 4,
                  boxShadow: '0 4px 20px rgba(94, 139, 255, 0.2)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
              </Button>
            </Box>
          </Fade>
          
          {user && (
            <Fade in={true} timeout={1600}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 3, 
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                Welcome back, {user.username}! Continue exploring.
              </Typography>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Results section */}
      <Container sx={{ py: 8, position: 'relative' }}>
        {searched && (
          <>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ mb: 1, fontWeight: 600 }}
            >
              {loading ? 'Searching...' : results.length > 0 ? 'Search Results' : 'No results found'}
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              {loading ? 'Looking for media matching your query' : 
               results.length > 0 ? `Found ${results.length} results for "${query}"` : 
               `No media found for "${query}". Try a different search term.`}
            </Typography>
          </>
        )}

        {!searched && <MediaGrid />} {/* Show trending media if not searched */}

        {/* Display API search results */}
        {searched && !loading && (
          <Grid container spacing={3}>
            {results.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card className="media-card hover-card">
                  <CardActionArea component="a" href={item.url} target="_blank" rel="noopener noreferrer">
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.thumbnail || item.url}
                      alt={item.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                        {item.title || 'Untitled'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.creator_display_name || 'Unknown creator'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!searched && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary"
              size="large"
              sx={{ borderRadius: '8px', px: 4 }}
            >
              Explore More
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Home;