// src/pages/Home.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Container,
  Grid, Card, CardContent, CardMedia, CardActionArea,
  InputAdornment, CircularProgress, Fade, Modal, IconButton,
  Tabs, Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ThreeBackground from '../components/ThreeBackground';
import { searchAllMedia } from '../services/combinedMediaSearch';
import { saveSearch } from '../services/api';

const Home = ({ user }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [mediaType, setMediaType] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Reference to the search input
  const searchInputRef = useRef(null);

  // Updated search handler to use the combined search API
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    
    try {
      console.log(`Home: Searching for "${query}" (${mediaType}) on page ${page}`);
      
      // Save search to history if user is logged in
      if (user) {
        try {
          await saveSearch(query);
          console.log('Search saved to history');
        } catch (error) {
          console.error('Error saving search history:', error);
          // Continue with search even if saving fails
        }
      }
      
      // Reset results if this is a new search
      if (page === 1) {
        setResults([]);
      }
      
      // Map our frontend mediaType to the backend format
      const backendMediaType = mediaType === 'all' ? 'all' : 
                              mediaType === 'image' ? 'image' : 
                              mediaType === 'video' ? 'video' : 'all';
      
      const searchData = await searchAllMedia(query, backendMediaType, page);
      console.log('Search returned data:', searchData);
      
      // Handle different response structures
      let searchResults = [];
      if (Array.isArray(searchData)) {
        // If searchAllMedia returns an array directly
        searchResults = searchData;
      } else if (searchData && searchData.results) {
        // If it returns an object with a results property
        searchResults = searchData.results;
      } else if (searchData) {
        // If it returns some other object structure
        searchResults = [searchData];
      }
      
      console.log(`Search found ${searchResults.length} results`);
      
      // Normalize the results to match our expected format
      const normalizedResults = searchResults.map(item => {
        return {
          id: item.id || `result-${Math.random().toString(36).substr(2, 9)}`,
          title: item.title || item.name || 'Untitled',
          media_type: item.media_type || item.type || (item.video_url ? 'video' : 'image'),
          thumbnail: item.thumbnail || item.thumbnail_url || item.imageUrl,
          imageUrl: item.imageUrl || item.thumbnail || item.url,
          url: item.url || item.imageUrl,
          external_url: item.external_url || item.url,
          creator_display_name: item.creator_display_name || item.creator || 'Unknown',
          source: item.source || (item.url && item.url.includes('youtube') ? 'YouTube' : 'Openverse'),
          // Extract videoId from YouTube URLs if available
          videoId: item.videoId || (item.url && item.url.includes('youtube.com/watch?v=') ? 
                   item.url.split('v=')[1]?.split('&')[0] : undefined)
        };
      });
      
      // If this is a new search (page 1), replace results, otherwise append
      if (page === 1) {
        setResults(normalizedResults);
      } else {
        setResults(prevResults => [...prevResults, ...normalizedResults]);
      }
      
      // Update hasMore flag - adjust this based on your backend's pagination
      setHasMore(searchData.hasMorePages || normalizedResults.length >= 10);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Load more results
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Effect to handle page changes
  useEffect(() => {
    if (searched && page > 1) {
      handleSearch();
    }
  }, [page, searched]);  // Add searched as a dependency

  // Effect to reset page when media type changes
  useEffect(() => {
    setPage(1);
    if (searched) {
      handleSearch();
    }
  }, [mediaType, searched]);  // Add searched as a dependency

  // Effect to handle query changes - important for debugging
  useEffect(() => {
    if (query) {
      console.log(`Query set to "${query}"`);
    }
  }, [query]);

  // Handler for Explore More button
  const handleExploreMore = () => {
    // Scroll to the search area
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Focus on the search input after scrolling
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 800);
  };
  
  // Handler for image clicks
  const handleImageClick = (item, e) => {
    e.preventDefault(); // Prevent default link behavior
    console.log('Selected item:', item);
    setSelectedImage(item);
    setOpenModal(true);
  };
  
  // Handler to close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  // Handler for media type change
  const handleMediaTypeChange = (event, newValue) => {
    // If somehow audio is selected, redirect to 'all'
    const value = newValue === 'audio' ? 'all' : newValue;
    console.log(`Media type changed to: ${value}`);
    setMediaType(value);
  };

  // Render the appropriate media content based on type
  const renderMediaContent = (item) => {
    if (!item) return null;
    
    console.log('Rendering media item:', item.id, item.media_type, item.title);
    
    switch(item.media_type) {
      case 'video':
        return (
          <>
            <CardMedia
              component="img"
              height="200"
              image={item.thumbnail || item.imageUrl || 'https://via.placeholder.com/400x300/5ad4a6/ffffff?text=Video'}
              alt={item.title || 'Video'}
              sx={{ objectFit: 'cover' }}
            />
            <Box sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'secondary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>
              Video
            </Box>
          </>
        );
      default:
        return (
          <CardMedia
            component="img"
            height="200"
            image={item.imageUrl || item.thumbnail || item.url || 'https://via.placeholder.com/400x300/323259/ffffff?text=Media'}
            alt={item.title || 'Media'}
            sx={{ objectFit: 'cover' }}
          />
        );
    }
  };

  // Updated placeholder text based on current mediaType
  const getPlaceholderText = () => {
    switch(mediaType) {
      case 'image':
        return 'Search for images on Openverse...';
      case 'video':
        return 'Search for videos on YouTube...';
      default:
        return 'Search for images and videos...';
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
              Search through millions of high-quality images and videos from Openverse and YouTube
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={1300}>
            <Box sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', mb: 2, display: 'inline-block' }}>
              <Tabs 
                value={mediaType} 
                onChange={handleMediaTypeChange} 
                indicatorColor="primary"
                textColor="primary"
                sx={{ 
                  '& .MuiTab-root': { color: 'white' },
                  '& .Mui-selected': { color: '#FFD700 !important' },
                  '& .MuiTabs-indicator': { backgroundColor: '#FFD700' }
                }}
              >
                <Tab value="all" label="All Media" />
                <Tab value="image" label="Images" />
                <Tab value="video" label="Videos" />
              </Tabs>
            </Box>
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
                inputRef={searchInputRef}
                fullWidth
                variant="outlined"
                placeholder={getPlaceholderText()}
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
              {loading && page === 1 ? 'Searching...' : results.length > 0 ? 'Search Results' : 'No results found'}
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              {loading && page === 1 ? 'Looking for media matching your query' : 
               results.length > 0 ? `Found ${results.length} results for "${query}"` : 
               `No media found for "${query}". Try a different search term.`}
            </Typography>
          </>
        )}

        {!searched && (
          <>
            <Typography variant="h3" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
              Trending Media
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Explore popular and trending creative assets
            </Typography>

            <Grid container spacing={3}>
              {[
                {
                  id: 1,
                  title: 'Beautiful mountain landscape',
                  type: 'Image',
                  source: 'Openverse',
                  media_type: 'image',
                  imageUrl: 'https://media.istockphoto.com/id/485371557/photo/twilight-at-spirit-island.jpg?s=612x612&w=0&k=20&c=FSGliJ4EKFP70Yjpzso0HfRR4WwflC6GKfl4F3Hj7fk='
                },
                {
                  id: 2,
                  title: 'DJ Khaled - Wild Thoughts ft. Rihanna, Bryson Tiller',
                  type: 'Video',
                  source: 'YouTube',
                  media_type: 'video',
                  thumbnail: 'https://img.youtube.com/vi/fyaI4-5849w/mqdefault.jpg',
                  videoId: 'fyaI4-5849w'
                },
                {
                  id: 3,
                  title: 'Urban cityscape photography',
                  type: 'Image',
                  source: 'Openverse',
                  media_type: 'image',
                  imageUrl: 'https://i.pinimg.com/474x/25/b3/09/25b309014a8d416f87407fce3ed8a807.jpg'
                },
                {
                  id: 4,
                  title: "World's Cheapest vs Most Expensive Laptop!",
                  type: 'Video',
                  source: 'YouTube',
                  media_type: 'video',
                  thumbnail: 'https://img.youtube.com/vi/SJNbnVjecf0/mqdefault.jpg',
                  videoId: 'SJNbnVjecf0'
                },
                {
                  id: 5,
                  title: 'Abstract digital art piece',
                  type: 'Image',
                  source: 'Openverse',
                  media_type: 'Image',
                  thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWKlsSrPqmMEiYjD7jsciOBs6jPnq1G_6iC0jNnjIEyRL6BoJuKjSXVl0&s'
                },
                {
                  id: 6,
                  title: 'I Survived The 5 Deadliest Places On Earth',
                  type: 'Video',
                  source: 'YouTube',
                  media_type: 'video',
                  thumbnail: 'https://img.youtube.com/vi/aKq8bkY5eTU/mqdefault.jpg',
                  videoId: 'aKq8bkY5eTU'
                }
              ].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card className="media-card hover-card" sx={{ height: '100%' }}>
                    <CardActionArea onClick={(e) => handleImageClick(item, e)}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl || item.thumbnail || 'https://via.placeholder.com/400x300/323259/ffffff?text=Media'}
                        alt={item.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                          {item.title}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.type}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                            {item.source}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Display API search results */}
        {searched && !loading && results && results.length > 0 && (
          <>
            <Grid container spacing={3}>
              {results.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={item.id || `result-${index}`}>
                  <Card className="media-card hover-card" sx={{ height: '100%' }}>
                    <CardActionArea 
                      onClick={(e) => handleImageClick(item, e)}
                      sx={{ position: 'relative' }}
                    >
                      {renderMediaContent(item)}
                      <CardContent>
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                          {item.title || 'Untitled'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.creator_display_name || 'Unknown creator'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                            {item.source || 'Unknown source'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {hasMore && results.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleLoadMore}
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}

        {!searched && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary"
              size="large"
              sx={{ borderRadius: '8px', px: 4 }}
              onClick={handleExploreMore}
            >
              Explore More
            </Button>
          </Box>
        )}
      </Container>

      {/* Full-size media modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="media-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          outline: 'none',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography id="media-modal-title" variant="h6" component="h2">
                {selectedImage?.title || 'Media Preview'}
              </Typography>
              {selectedImage?.creator_display_name && (
                <Typography variant="body2" color="text.secondary">
                  By {selectedImage.creator_display_name} {selectedImage?.source && `• ${selectedImage.source}`}
                </Typography>
              )}
            </Box>
            <IconButton onClick={handleCloseModal} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: 'center', overflow: 'auto', maxHeight: 'calc(90vh - 100px)' }}>
            {selectedImage?.media_type === 'video' || selectedImage?.type === 'Video' ? (
              <Box sx={{ p: 3 }}>
                {(() => {
                  // Check if we have a videoId directly
                  if (selectedImage.videoId) {
                    return (
                      <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${selectedImage.videoId}`}
                        title={selectedImage.title || 'YouTube Video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    );
                  }
                  // Try to extract from URL if available
                  else if (selectedImage.url?.includes('youtube.com/watch?v=')) {
                    const videoId = selectedImage.url.split('v=')[1]?.split('&')[0] || '';
                    return videoId ? (
                      <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={selectedImage.title || 'YouTube Video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <Typography color="error">Unable to extract YouTube video ID</Typography>
                    );
                  }
                  // Try other formats like youtu.be links
                  else if (selectedImage.url?.includes('youtu.be/')) {
                    const videoId = selectedImage.url.split('youtu.be/')[1]?.split('?')[0] || '';
                    return videoId ? (
                      <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={selectedImage.title || 'YouTube Video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <Typography color="error">Unable to extract YouTube video ID</Typography>
                    );
                  }
                  // For non-YouTube videos
                  else if (selectedImage.url) {
                    return (
                      <video controls width="100%" style={{ maxHeight: '500px' }}>
                        <source src={selectedImage.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                  // Fallback when no playable source is available
                  else {
                    return (
                      <Typography color="text.secondary">Video preview not available</Typography>
                    );
                  }
                })()}
              </Box>
            ) : (
              <img 
                src={selectedImage?.imageUrl || selectedImage?.thumbnail || selectedImage?.url || 'https://via.placeholder.com/400x300/323259/ffffff?text=Image'} 
                alt={selectedImage?.title || 'Image preview'}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 'calc(90vh - 100px)', 
                  objectFit: 'contain' 
                }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300/323259/ffffff?text=Image'; }}
              />
            )}
          </Box>
          {selectedImage?.external_url && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                href={selectedImage.external_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Original
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Home;