# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package configurations
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all application source code
COPY . .

# Note: NEXT_PUBLIC_API_URL is intentionally NOT set here as a build ARG.
# It is injected at container runtime via the 'environment' section in docker-compose,
# so the same image can be reused across different deployment targets without rebuilding.

# Build the Next.js production bundle
RUN pnpm build

# Stage 2: Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Copy the standalone build and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose Next.js port
EXPOSE 3001

# Run Next.js standalone server
CMD ["node", "server.js"]
