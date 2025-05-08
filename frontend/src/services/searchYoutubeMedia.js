// src/services/youtubeApi.js
const YOUTUBE_API_KEY = 'AIzaSyAGxD0xiu2bx_iJDvTl0RF3GMbKe4evrp0';

export const searchYoutubeMedia = async (query, page = 1) => {
  try {
    console.log(`YouTube API: Searching for "${query}" (page ${page})`);
    
    // YouTube API uses tokens for pagination
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
    console.log('YouTube URL:', url);
    
    const response = await fetch(url);
    console.log('YouTube status code:', response.status);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('YouTube data received:', data.items?.length || 0, 'results');
    
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
    
    console.log('Processed YouTube results:', results.length);
    
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