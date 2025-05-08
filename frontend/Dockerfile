FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Set environment variables to make React work properly in Docker
ENV WDS_SOCKET_HOST=0.0.0.0
ENV WDS_SOCKET_PORT=3000
ENV CHOKIDAR_USEPOLLING=true
ENV REACT_APP_API_URL=http://backend:5000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]