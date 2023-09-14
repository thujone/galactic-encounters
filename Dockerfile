##### Client Build Stage #####
FROM node:18 AS client-build
WORKDIR /app/client

# Install client dependencies
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn install

# Build the client
COPY ./client/ ./
RUN yarn build-prod



##### Server Build Stage #####
FROM node:18 AS server-build
WORKDIR /app/server

# Install server dependencies
COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install

# Copy server files
COPY ./server/ ./



##### Release Stage #####
FROM node:18
WORKDIR /app/server

# Expose port 3300 on the server
EXPOSE 3300

# Copy built assets from the Server Build stage
COPY --from=server-build /app/server/ ./

# Copy built assets from the Client Build stage
COPY --from=client-build /app/client/dist/ ../client/public/

# Start the production server
CMD ["node", "./dist/index.js"]
