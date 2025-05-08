// src/services/api.js
import axios from 'axios';

// Always use localhost when running in a browser
// Docker service names like 'backend' won't resolve in the browser
const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor for debugging
API.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  response => {
    console.log('Received response from:', response.config.url);
    return response;
  },
  error => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const logoutUser = () => API.post('/auth/logout');
export const checkAuthStatus = () => API.get('/api/debug/session');

// Search API
export const searchMedia = (query, mediaType = 'images', page = 1, perPage = 20, filters = {}) => {
  // Construct the query parameters
  const params = {
    q: query,
    page,
    page_size: perPage,
    ...filters
  };
  
  return API.get(`/api/${mediaType}/search`, { params });
};

// Search history
export const saveSearch = (query) => API.post('/search/save', { query });
export const getRecentSearches = () => API.get('/search/recent');

export default API;