# MediaFinder - Media Search & Discovery Platform

MediaFinder is a comprehensive web application that allows users to search and discover media content from various sources including Openverse, YouTube. The application features a modern React frontend with Material UI components and a robust Node.js/Express backend with SQLite database for data persistence.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Docker Setup](#docker-setup)
- [Backend API Endpoints](#backend-api-endpoints)
- [Frontend Components](#frontend-components)
- [Authentication System](#authentication-system)
- [Media Search Functionality](#media-search-functionality)
- [Database Schema](#database-schema)
- [Logging and Monitoring](#logging-and-monitoring)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Project Overview

MediaFinder is built as a full-stack JavaScript application that provides a unified interface for searching and displaying media content from multiple sources. The application includes user authentication, search history tracking, and a contact form for user feedback.

## Features

- User Authentication: Secure registration and login system
- Media Search: Search across multiple platforms (Openverse, YouTube)
- Unified Results: View all media types in a consistent interface
- Search History: Track and revisit previous searches (for logged-in users)
- Contact Form: User feedback and support requests
- Responsive Design: Works on mobile and desktop devices
- 3D Interactive Elements: Three.js integration for engaging visual elements
- Docker Support: Fully containerized application for easy deployment

## Technology Stack

### Frontend
- React 18.x
- Material UI 6.x
- React Router 7.x
- Axios for API requests
- Three.js for 3D visuals

### Backend
- Node.js with Express 4.x
- SQLite database (in-memory for Docker)
- Express Session for authentication
- Bcryptjs for password hashing (replacing bcrypt for better Docker compatibility)
- Morgan for request logging
- CORS support for cross-origin requests

### External APIs
- Openverse API for open-source media
- YouTube API for video content
- Pexels API for high-quality images
- Freesound API for audio content

### DevOps
- Docker for containerization
- Docker Compose for multi-container management

## Project Structure

app-fuse/
├── backend/
│   ├── config/
│   │   └── db.js                # Database connection configuration
│   ├── middleware/
│   │   └── authMiddleware.js    # Authentication middleware
│   ├── models/
│   │   ├── User.js              # User database model
│   │   └── Search.js            # Search history database model
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── searchRoutes.js      # Search history routes
│   │   └── contactRoutes.js     # Contact form routes
│   ├── server.js                # Main Express server file
│   ├── init-db.js               # Database initialization script
│   ├── Dockerfile               # Docker configuration for backend
│   └── package.json             # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── MediaGrid.js     # Media display grid
│   │   │   ├── Navbar.js        # Navigation bar
│   │   │   └── ThreeJsDemo.js   # 3D background component
│   │   ├── pages/
│   │   │   ├── About.js         # About page
│   │   │   ├── Contact.js       # Contact form page
│   │   │   ├── Home.js          # Home page with search
│   │   │   ├── Login.js         # Login page
│   │   │   └── Register.js      # Registration page
│   │   ├── services/
│   │   │   ├── api.js           # API service for backend calls
│   │   │   └── combinedMediaSearch.js # Media search service
│   │   ├── App.js               # Main React component
│   │   ├── index.js             # JavaScript entry point
│   │   └── theme.js             # Material UI theme configuration
│   ├── Dockerfile               # Docker configuration for frontend
│   └── package.json             # Frontend dependencies
│
├── docker-compose.yml           # Docker Compose configuration
├── scripts/
│   └── deploy.js                # Deployment script
│
├── setup.sh                     # Setup script for local development
└── README.md                    # Project documentation


## Setup and Installation

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn package manager
- Git
- Docker and Docker Compose (for containerized setup)

### Clone the Repository
git clone https://github.com/kvng-HackSOC/app-fuse.git
cd app-fuse


### Backend Setup
cd backend
npm install

Create a `.env` file in the backend directory with:

PORT=5000
SESSION_SECRET=your-secret-key-change-this-in-production
YOUTUBE_API_KEY=your-youtube-api-key
NODE_ENV=development

Initialize the database:
```bash
node init-db.js
```

Start the backend server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Docker Setup

MediaFinder can be run entirely in Docker containers, which simplifies development and deployment.

### Prerequisites
- Docker
- Docker Compose

### Running with Docker Compose

1. Make sure you are in the project root directory (where docker-compose.yml is located)

2. Build and start the containers:
```bash
docker-compose build
docker-compose up
```

3. To stop the containers:
```bash
docker-compose down
```

### Docker Configuration

The application uses a multi-container setup:

- **Frontend Container**: Runs the React development server
- **Backend Container**: Runs the Express server with in-memory SQLite

The containers are networked together, with the frontend able to communicate with the backend using the service name.

### Key Docker Files

- `frontend/Dockerfile`: Configuration for building the React frontend
- `backend/Dockerfile`: Configuration for the Node.js backend
- `docker-compose.yml`: Orchestrates the containers and sets up networking

## Backend API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
  - Request: `{ username, email, password }`
  - Response: `{ message: "User registered successfully" }`

- `POST /auth/login` - User login
  - Request: `{ username, password }`
  - Response: `{ message: "Login successful", user: { id, username } }`

- `POST /auth/logout` - User logout
  - Response: `{ message: "Logout successful" }`

### Search History
- `POST /search/save` - Save a search query (requires authentication)
  - Request: `{ query }`
  - Response: `{ message: "Search saved" }`

- `GET /search/recent` - Get recent search history (requires authentication)
  - Response: Array of search objects `[{ id, user_id, query, timestamp }]`

### Contact Form
- `POST /contact/submit` - Submit contact form
  - Request: `{ name, email, subject, message }`
  - Response: `{ success: true, message: "Your message has been received!" }`

### Media Search Proxies
- `GET /api/openverse/search` - Search Openverse
  - Query parameters: `query`, `mediaType` (image/video), `page`

- `GET /api/youtube/search` - Search YouTube
  - Query parameters: `query`, `page`

- `GET /api/pexels/search` - Search Pexels
  - Query parameters: `query`, `page`

- `GET /api/youtube/video` - Get YouTube video details
  - Query parameters: `id` (YouTube video ID)

### User Profile
- `GET /api/profile` - Get user profile info (requires authentication)
  - Response: `{ id, username }`

## Frontend Components

### Pages
- **Home**: Main page with search functionality and results display
- **Login**: User login page
- **Register**: User registration page
- **About**: Information about the platform
- **Contact**: Contact form for feedback

### Components
- **Navbar**: Navigation bar with authentication state
- **MediaGrid**: Grid display for search results
- **ThreeBackground**: 3D animated background using Three.js

## Authentication System

The application uses session-based authentication:

1. **Registration Process**:
   - User provides username, email, and password
   - Password is hashed using bcryptjs before storage
   - User record is created in the SQLite database

2. **Login Process**:
   - User provides username and password
   - System validates credentials against database
   - If valid, a session is created and stored in memory
   - User info is returned to the frontend

3. **Authentication Checking**:
   - Protected routes use the `ensureAuthenticated` middleware
   - Middleware checks for a valid session before allowing access
   - Frontend stores user state in React context

## Media Search Functionality

The application searches across multiple external APIs:

1. **Search Process**:
   - User enters a search query on the frontend
   - Frontend sends request to the backend
   - Backend proxies requests to various external APIs
   - Results are normalized and returned to the frontend
   - Frontend displays results in a consistent format

2. **Search History**:
   - When a logged-in user performs a search, it's saved to the database
   - Users can view their recent searches

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  email TEXT
)
```

### Searches Table
```sql
CREATE TABLE searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  query TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## Logging and Monitoring

The application uses a comprehensive logging system:

1. **HTTP Request Logging**:
   - Morgan middleware logs all HTTP requests to the console
   - Format includes method, path, status code, and response time

2. **Authentication Logging**:
   - Registration attempts with username and timestamp
   - Login attempts with success/failure status
   - Logout events

3. **Search Logging**:
   - Search queries with user information
   - API requests to external services
   - Response status and result counts

4. **Contact Form Logging**:
   - Form submissions with sender information
   - Subject and timestamp

## Deployment

The application includes a deployment script (`scripts/deploy.js`) that:

1. Builds the React frontend
2. Copies build files to the backend's `build` directory
3. Prepares the application for either development or production

To deploy:
```bash
node scripts/deploy.js production
```

For Docker deployment:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

1. **JSON Parsing Error in Contact Form**:
   - Error: "Unexpected token '<', '<!DOCTYPE "... is not valid JSON"
   - Solution: Ensure the backend is properly sending JSON responses and not HTML
   - Fix: Update the Contact.js component to use the correct endpoint (/contact/submit)

2. **Authentication Issues**:
   - Problem: Login or registration doesn't work
   - Solution: Check session configuration and CORS settings in server.js

3. **Missing Database**:
   - Problem: Database errors on startup
   - Solution: Run `node init-db.js` to initialize the database

4. **API Connection Issues**:
   - Problem: External API requests fail
   - Solution: Verify API keys in the .env file

5. **Docker Networking Issues**:
   - Problem: Frontend can't connect to backend in Docker
   - Solution: Check CORS settings to ensure they include the Docker service names
   - Fix: Update corsOptions in server.js to allow connections from 'http://frontend:3000'

6. **Native Module Errors in Docker**:
   - Problem: "Error loading shared library" or similar native module errors
   - Solution: Use pure JavaScript alternatives (like bcryptjs instead of bcrypt)
   - Fix: Update backend Dockerfile to explicitly install problematic dependencies

### Debugging

- Check backend logs for detailed information about requests and errors
- Use browser developer tools to inspect network requests
- The `/api/test` endpoint can be used to verify backend connectivity
- For Docker setups, use `docker-compose logs` to view container output

For further assistance, please submit an issue on the project repository.