FROM node:20.15.0-alpine3.20@sha256:df01469346db2bf1cfc1f7261aeab86b2960efa840fe2bd46d83ff339f463665

RUN apk update && apk upgrade busybox

WORKDIR /app
COPY src/ src/
COPY .env.example .env
COPY package.json tsconfig.json ./
ARG PORT
RUN npm update -g
RUN npm install --ignore-scripts && npm run build

EXPOSE $PORT
CMD npm run start