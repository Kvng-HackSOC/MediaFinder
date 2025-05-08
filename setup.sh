#!/bin/bash

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Initialize the database
echo "Initializing database..."
node init-db.js

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Start the development servers
echo "Starting development servers..."
cd ../backend
npm run dev &
cd ../frontend
npm start