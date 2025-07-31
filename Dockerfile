# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the application
# The .env file will be mounted as a volume, so we don't use --env-file here.
# Docker will automatically inject environment variables from the mounted .env file.
CMD [ "node", "dist/index.js" ]
