// src/services/combinedMediaSearch.js

/**
 * Search for media using Openverse API and YouTube
 * @param {string} query - The search query
 * @param {string} mediaType - Type of media to search for ('all', 'image', 'video')
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} - Search results
 */
export const searchAllMedia = async (query, mediaType = 'all', page = 1) => {
    console.log(`Starting search for "${query}" (${mediaType}) on page ${page}`);
    
    try {
      let results = [];
      
      // Search for images if mediaType is 'all' or 'image'
      if (mediaType === 'all' || mediaType === 'image') {
        try {
          console.log('Searching Openverse for images...');
          const openverseData = await searchOpenverseMedia(query, 'image', page);
          
          if (openverseData && openverseData.results && openverseData.results.length > 0) {
            console.log(`Found ${openverseData.results.length} images from Openverse`);
            results = [...results, ...openverseData.results];
          }
        } catch (error) {
          console.error('Openverse image search error:', error);
        }
      }
      
      // Search for videos if mediaType is 'all' or 'video'
      if (mediaType === 'all' || mediaType === 'video') {
        try {
          console.log('Searching for videos using YouTube API directly...');
          // Direct YouTube API call without import
          const youtubeData = await searchYoutube(query, page);
          
          if (youtubeData && youtubeData.results && youtubeData.results.length > 0) {
            console.log(`Found ${youtubeData.results.length} videos from YouTube`);
            results = [...results, ...youtubeData.results];
          }
        } catch (error) {
          console.error('YouTube search error:', error);
        }
      }
      
      console.log(`Total combined results: ${results.length}`);
      
      return {
        results,
        page,
        hasMorePages: results.length >= 10,
        query,
        mediaType
      };
    } catch (error) {
      console.error('Combined search error:', error);
      return {
        results: [],
        page,
        hasMorePages: false,
        query,
        mediaType,
        error: error.message
      };
    }
  };
  
  /**
   * Search Openverse API
   * @param {string} query - The search query
   * @param {string} mediaType - Type of media ('image')
   * @param {number} page - Page number
   * @returns {Promise<Object>} - Search results
   */
  const searchOpenverseMedia = async (query, mediaType = 'image', page = 1) => {
    try {
      console.log(`Openverse API: Searching for "${query}" (${mediaType}) on page ${page}`);
      
      const url = `https://api.openverse.org/v1/${mediaType}s/?q=${encodeURIComponent(query)}&page=${page}`;
      console.log('Openverse URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Openverse API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        return { results: [] };
      }
      
      const results = data.results.map(item => {
        return {
          id: `openverse-${item.id}`,
          title: item.title || 'Openverse Media',
          url: item.url,
          thumbnail: item.thumbnail || item.url,
          creator_display_name: item.creator || 'Unknown Creator',
          attribution: item.attribution || `From Openverse`,
          license: item.license || 'Unknown License',
          source: 'Openverse',
          external_url: item.foreign_landing_url || item.url,
          media_type: mediaType
        };
      });
      
      console.log(`Processed ${results.length} Openverse results`);
      
      return {
        results,
        total: data.result_count || 0,
        page,
        per_page: results.length,
        page_count: data.page_count || 0
      };
    } catch (error) {
      console.error('Error searching Openverse:', error);
      return { results: [] };
    }
  };
  
  /**
   * Search YouTube API
   * @param {string} query - The search query
   * @param {number} page - Page number
   * @returns {Promise<Object>} - Search results
   */
  const searchYoutube = async (query, page = 1) => {
    try {
      console.log(`YouTube API: Searching for "${query}" (page ${page})`);
      
      const YOUTUBE_API_KEY = 'AIzaSyAGxD0xiu2bx_iJDvTl0RF3GMbKe4evrp0';
      const maxResults = 10;
      
      // Build the URL with proper parameters
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        maxResults: maxResults.toString(),
        type: 'video',
        key: YOUTUBE_API_KEY
      });
      
      const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        return { results: [] };
      }
      
      const results = data.items.map(item => {
        const videoId = item.id?.videoId;
        const snippet = item.snippet || {};
        
        return {
          id: `youtube-${videoId}`,
          title: snippet.title || 'YouTube Video',
          url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '',
          thumbnail: snippet.thumbnails?.medium?.url || 
                    snippet.thumbnails?.default?.url ||
                    snippet.thumbnails?.high?.url,
          creator_display_name: snippet.channelTitle || 'YouTube Creator',
          attribution: `Video by ${snippet.channelTitle || 'Unknown'} on YouTube`,
          license: 'YouTube Standard License',
          source: 'YouTube',
          external_url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '',
          media_type: 'video'
        };
      });
      
      console.log(`Processed ${results.length} YouTube results`);
      
      return {
        results,
        total: data.pageInfo?.totalResults || 0,
        page,
        per_page: maxResults,
        next_page_token: data.nextPageToken || null
      };
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return { results: [] };
    }
  };