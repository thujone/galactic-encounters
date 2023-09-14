# Client build stage
FROM node:18 AS client-build

WORKDIR /app/client

# Install client dependencies
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn install

# Build the client
COPY ./client/ ./
RUN yarn build-prod


# Server build stage
FROM node:18 AS server-build

WORKDIR /app/server

# Install server dependencies
COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install

# Copy server files
COPY ./server/ ./

# ---- Release Stage ----
FROM node:18

WORKDIR /app/server

# Expose port 3300 (Server's port)
EXPOSE 3300

# Copy built server assets from the server-build stage
COPY --from=server-build /app/server/ ./

# Copy built client assets from the client-build stage
COPY --from=client-build /app/client/dist/ ../client/public/

CMD ["node", "./dist/index.js"]
