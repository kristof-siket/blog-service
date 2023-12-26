# Dockerfile for installing, building and running the application
FROM node:18.17.0-alpine

WORKDIR /app

# Copy package.json and package-lock.json, tsconfig.json
COPY package*.json tsconfig.json prisma ./

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Run the built app
CMD ["node", "./dist/core/server.js"]

# Expose port 4000
EXPOSE 4000

