// src/services/openverseApi.js
const API_URL = 'https://api.openverse.org/v1';

export const searchMedia = async (query, mediaType = 'image', page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/${mediaType}s/?q=${encodeURIComponent(query)}&page=${page}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching Openverse:', error);
    throw error;
  }
};