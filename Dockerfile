# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including TypeScript and dev deps for building)
RUN npm ci && npm cache clean --force

# Copy TypeScript configuration and source code
COPY tsconfig*.json ./
COPY index.ts ./
COPY src ./src

# Build TypeScript to dist/
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production && npm cache clean --force

# Copy built JavaScript files from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy source files (needed for imports that haven't been fully migrated)
COPY --from=builder --chown=nodejs:nodejs /app/src ./src

# Create logs and data directories
RUN mkdir -p logs data && chown -R nodejs:nodejs logs data

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application (using compiled TypeScript)
CMD ["node", "dist/index.js"]
