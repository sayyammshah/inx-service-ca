# syntax=docker/dockerfile:1 # syntax version

# Multi stage build

# Variables
ARG PNPM_VERSION=10.4.1

# Stage 1: Setup
FROM node:alpine3.21 AS base

WORKDIR /app/inx/

ENV DB_CONNECTION_URL="mongodb://admin:adminInxPass@inx-srvc-database:27017/?authSource=admin"
ENV DB_NAME=insightxCaLocal
ENV PORT=3001

RUN --mount=type=cache,target=/root/.npm

RUN npm install -g pnpm@${PNPM_VERSION}

# Stage 2: Setup Prod Deps
FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

# Stage 3: Build stage 
FROM base AS build

COPY . .

RUN pnpm install

RUN pnpm run build

# Stage 4: final
FROM base AS final

COPY package.json .

COPY --from=dependencies /app/inx/node_modules ./node_modules
COPY --from=build /app/inx/dist ./dist

CMD ["pnpm", "run", "start"]