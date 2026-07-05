# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package configuration files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY . .

# Compile the NestJS application
RUN pnpm build

# Prune dependencies to only include production ones
RUN rm -rf node_modules && pnpm install --prod --frozen-lockfile

# Stage 2: Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only production build and dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose backend port
EXPOSE 3000

# Run the backend server
CMD ["node", "dist/main.js"]
