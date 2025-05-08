// src/services/openverseApi.js

export const searchOpenverseMedia = async (query, mediaType = 'image', page = 1) => {
    try {
      console.log(`Openverse API: Searching for "${query}" (${mediaType}) on page ${page}`);
      
      const url = `https://api.openverse.org/v1/${mediaType}s/?q=${encodeURIComponent(query)}&page=${page}`;
      console.log('Openverse URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Openverse status code:', response.status);
      
      if (!response.ok) {
        throw new Error(`Openverse API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Openverse data received:', data.results?.length || 0, 'results');
      
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
      
      console.log('Processed Openverse results:', results.length);
      
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