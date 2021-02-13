# BUILD
FROM node:14.15-alpine as builder

WORKDIR /usr/bot

ENV NODE_ENV=production

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY ./src ./src

RUN npm i

RUN npm run build

# PROD
FROM node:14-alpine

WORKDIR /bot
ENV NODE_ENV=production

COPY package*.json ./
COPY ./assets ./assets
RUN npm i

COPY --from=builder /usr/bot/build ./build
COPY --from=builder /usr/bot/.env ./
