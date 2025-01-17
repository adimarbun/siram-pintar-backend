# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY src/ ./

# Expose the port your Express.js app listens on (usually 3000)
EXPOSE 3000

# Define the command to run your application
CMD ["node", "index.js"]