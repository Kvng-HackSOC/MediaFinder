// Component to display the media grid with proper images
// This can be placed in your Home.js file or as a separate component

import React from 'react';
import { Grid, Card, CardContent, CardMedia, CardActionArea, Typography, Box } from '@mui/material';

const MediaGrid = () => {
  // Sample media items with proper image handling
  const mediaItems = [
    {
      id: 1,
      title: 'Beautiful mountain landscape',
      type: 'Image',
      // Use a reliable placeholder service
      imageUrl: 'https://media.istockphoto.com/id/485371557/photo/twilight-at-spirit-island.jpg?s=612x612&w=0&k=20&c=FSGliJ4EKFP70Yjpzso0HfRR4WwflC6GKfl4F3Hj7fk='
    },
    {
      id: 2,
      title: 'Ocean waves at sunset',
      type: 'Image',
      imageUrl: 'https://i.etsystatic.com/6725214/r/il/ecc5e0/559845979/il_1080xN.559845979_bssc.jpg'
    },
    {
      id: 3,
      title: 'Urban cityscape photography',
      type: 'Image',
      imageUrl: 'https://i.pinimg.com/474x/25/b3/09/25b309014a8d416f87407fce3ed8a807.jpg'
    },
    {
      id: 4,
      title: 'Wildlife in natural habitat',
      type: 'Image',
      imageUrl: 'https://media.istockphoto.com/id/1495939426/photo/puffins-against-coastline.jpg?s=612x612&w=0&k=20&c=OnWjoSwLo8l4gCv4pR_5UJlDEW5QLJ9c_vqjzJRBnfc='
    },
    {
      id: 5,
      title: 'Abstract digital art piece',
      type: 'Image',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWKlsSrPqmMEiYjD7jsciOBs6jPnq1G_6iC0jNnjIEyRL6BoJuKjSXVl0&s'
    },
    {
      id: 6,
      title: 'Futuristic technology concept',
      type: 'Image',
      imageUrl: 'https://plus.unsplash.com/premium_photo-1677269465314-d5d2247a0b0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnV0dXJlJTIwdGVjaHxlbnwwfHwwfHx8MA%3D%3D'
    }
  ];

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography variant="h3" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
        Trending Media
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explore popular and trending creative assets
      </Typography>

      <Grid container spacing={3}>
        {mediaItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card className="media-card hover-card" sx={{ height: '100%' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.type}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MediaGrid;