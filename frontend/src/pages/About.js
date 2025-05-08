// src/pages/About.js
import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, color: 'primary.main', fontWeight: 600 }}>
          About MediaFinder
        </Typography>
        
        <Typography variant="body1" paragraph>
          MediaFinder is a powerful search platform designed to help users discover and access a vast collection of open-licensed media content from across the web. Our mission is to make creative assets more accessible to everyone, from designers and developers to educators and content creators.
        </Typography>
        
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          Our Purpose
        </Typography>
        <Typography variant="body1" paragraph>
          We believe in the power of open content and the creative commons. MediaFinder leverages the Openverse API to provide a streamlined, user-friendly interface for searching millions of freely usable images, illustrations, and other creative assets that you can use in your projects without copyright concerns.
        </Typography>
        
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          Features
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Powerful Search:</strong> Find exactly what you need with our intuitive search functionality.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>High-Quality Content:</strong> Access millions of high-quality images and creative assets.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Open License:</strong> All content available through MediaFinder is free to use under various Creative Commons licenses.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>User-Friendly Interface:</strong> Our clean, modern design makes discovering new media a pleasant experience.
          </Typography>
        </Box>
        
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          How It Works
        </Typography>
        <Typography variant="body1" paragraph>
          MediaFinder connects to the Openverse API, which aggregates media from various sources like Flickr, Wikimedia Commons, and other platforms that host open content. When you search on MediaFinder, we query this database to bring you relevant results that you can freely use for your projects.
        </Typography>
        
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          Attribution
        </Typography>
        <Typography variant="body1" paragraph>
          While the content available through MediaFinder is open-licensed, most licenses still require attribution to the original creator. We provide attribution information with each result to make it easy for you to properly credit the creators.
        </Typography>
        
        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Powered by Openverse API
          </Typography>
          <Typography variant="body2">
            MediaFinder is built on the Openverse API, which provides access to a vast library of openly licensed content. We're grateful for their service that makes this platform possible.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;