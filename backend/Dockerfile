FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies and explicitly install axios
RUN npm install
RUN npm install axios@1.6.0 --save

# Copy app source
COPY . .

# Create data directory with permissions
RUN mkdir -p /usr/src/app/data
RUN chmod -R 777 /usr/src/app/data

# Set production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE 5000

# Start the application with debugging
CMD ["node", "server.js"]