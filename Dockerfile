# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

ARG YARN_VERSION=1.22.22
RUN npm install -g yarn@$YARN_VERSION --force

COPY package.json .
RUN yarn install

# Copy application code
COPY . .

# Build application
RUN yarn build

CMD [ "yarn", "preview" ]
