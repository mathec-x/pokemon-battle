# Use the official Node.js image from the Docker Hub
FROM node:22.21.0-alpine AS base
# Create and change to the app directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./

FROM base AS development
ENV NODE_ENV=development
# Install all dependencies (including dev dependencies)
RUN npm ci
# Copy the rest of the application code
COPY . .
# Expose the port
EXPOSE 3001
# Command to run the application in development
CMD ["npm", "run", "dev"]

FROM base AS production
ENV NODE_ENV=production
# Install only production dependencies
RUN npm ci --omit=dev
# Copy the rest of the application code
COPY . .
# Build the application
RUN npm run build
# Expose the port
EXPOSE 3001
# Command to run the built application
CMD ["npm", "run", "start"]

