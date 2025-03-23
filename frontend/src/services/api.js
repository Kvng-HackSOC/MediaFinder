// src/services/api.js
import axios from 'axios';

// Backend API service
const API = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true // Allows session-based authentication
});

// Authentication API
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const logoutUser = () => API.post('/auth/logout');

// Openverse API service
const OPENVERSE_API = axios.create({
    baseURL: 'https://api.openverse.org/v1',
    headers: {
        'Accept': 'application/json'
    }
});

// Search API
export const searchMedia = (query, mediaType = 'images', page = 1, perPage = 20, filters = {}) => {
    // Construct the query parameters
    const params = {
        q: query,
        page,
        page_size: perPage,
        ...filters
    };
    
    // Make the API request to the appropriate endpoint based on media type
    return OPENVERSE_API.get(`/${mediaType}/`, { params });
};

// Get specific media details
export const getMediaDetails = (mediaType, id) => {
    return OPENVERSE_API.get(`/${mediaType}/${id}/`);
};

// User search history
export const saveSearch = (query, filters = {}) => 
    API.post('/search/save', { query, filters });

export const getRecentSearches = () => 
    API.get('/search/recent');

export const deleteSearch = (id) => 
    API.delete(`/search/${id}`);

// Handle interceptors for authentication errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access - could redirect to login
            console.log('Authentication error');
        }
        return Promise.reject(error);
    }
);

export default API;