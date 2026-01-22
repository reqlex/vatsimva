FROM node:22-slim

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy rest of the app
COPY . .

# Build the app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", ".output/server/index.mjs"]
