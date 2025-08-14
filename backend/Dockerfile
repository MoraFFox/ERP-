# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat openssl openssl-dev

# Dependencies stage (production only)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi && npm cache clean --force

# Builder stage
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
# Install all deps (including dev)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi && npm cache clean --force
# Temporary typescript install for building
RUN npm install typescript --no-save
COPY . .

# Prisma env vars for linux-musl
ENV PRISMA_BINARY_TARGETS="linux-musl"
ENV PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
ENV PRISMA_CLIENT_ENGINE_TYPE="binary"
ENV OPENSSL_CONF="/dev/null"

# Generate Prisma client
RUN PRISMA_CLI_BINARY_TARGETS=linux-musl npx prisma generate

RUN apk add --no-cache openssl libc6-compat


# Build the app
RUN npm run build && ls -la dist/

# Production stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV OPENSSL_CONF="/dev/null"
ENV PRISMA_BINARY_TARGETS="linux-musl"
ENV PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
ENV PRISMA_CLIENT_ENGINE_TYPE="binary"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

# Copy production deps and built files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=nodejs:nodejs healthcheck.js ./healthcheck.js

USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD node healthcheck.js
CMD ["node", "dist/server.js"]
