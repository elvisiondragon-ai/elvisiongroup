FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD [ "node", "index.js" ]
