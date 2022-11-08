FROM node:12.13-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli
RUN npm install

COPY . .
