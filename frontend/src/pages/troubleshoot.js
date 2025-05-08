// src/troubleshoot.js
console.log('Troubleshooting script loaded');

// Monkey patch fetch to log all API requests
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
  console.log(`📡 Fetch request: ${url}`, options);
  try {
    const response = await originalFetch(url, options);
    
    // Clone the response so we can read its body
    const clone = response.clone();
    console.log(`📡 Fetch response: ${url}`, {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });
    
    // Try to parse the response if it's JSON
    try {
      const isJSON = response.headers.get('content-type')?.includes('application/json');
      if (isJSON) {
        const data = await clone.json();
        if (data) {
          if (Array.isArray(data.results)) {
            console.log(`📡 Response data: ${data.results.length} results`);
          } else {
            console.log(`📡 Response data:`, data);
          }
        }
      }
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
    
    return response;
  } catch (error) {
    console.error(`📡 Fetch error for ${url}:`, error);
    throw error;
  }
};

// Check CORS settings
(function checkCors() {
  console.log('Checking CORS settings...');
  
  // YouTube API CORS check
  fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&type=video&key=AIzaSyAGxD0xiu2bx_iJDvTl0RF3GMbKe4evrp0', {
    method: 'GET',
    mode: 'cors'
  })
    .then(response => {
      console.log('YouTube API CORS test:', response.status, response.ok ? 'OK' : 'Failed');
    })
    .catch(error => {
      console.error('YouTube API CORS test failed:', error.message);
    });
    
  // Openverse API CORS check
  fetch('https://api.openverse.org/v1/images/?q=test&page=1', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      console.log('Openverse API CORS test:', response.status, response.ok ? 'OK' : 'Failed');
    })
    .catch(error => {
      console.error('Openverse API CORS test failed:', error.message);
    });
})();

// Log window location details
console.log('Window location:', {
  href: window.location.href,
  origin: window.location.origin,
  protocol: window.location.protocol
});

// Check if window.location.href is localhost (potential CORS issue)
if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
  console.warn('⚠️ Running on localhost - CORS issues are possible. You might need a proxy server.');
}

console.log('Troubleshooting script completed');