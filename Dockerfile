# syntax=docker/dockerfile:1 # syntax version

# Variables
ARG PORT=3001
ARG NODE_VERSION=23.6.1
ARG PNPM_VERSION=10.4.1

# This is mult stage builds.
# Use node image for base image for all stages.
# Stage 1: Initial Setup
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# pnpm setup.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

# Stage 2: Installing production dependecies.
FROM base as deps

# Copy package.json and pnpm-lock.yaml to the working directory.
COPY package.json pnpm-lock.yaml ./

# Install production dependencies.
RUN pnpm install --prod --frozen-lockfile

# Stage 3: Building the application.
FROM base as build

# Copy package.json and pnpm-lock.yaml to the working directory.
COPY package.json pnpm-lock.yaml ./

# Install all dependencies.
RUN pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

RUN pnpm run build

# Stage 4: Run the application with minimal runtime dependencies.
# where the necessary files are copied from the build stage.
FROM base as final

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose the port that the application listens on.
EXPOSE ${NODE_VERSION}

# Run the application.
CMD pnpm start
