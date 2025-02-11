FROM node:23.7.0-alpine3.20@sha256:3ac002b133fd3737c44b66f0d023f5d75c7a1ddec71954fa06486aed6aead888

RUN apk update && apk upgrade busybox

WORKDIR /app
COPY src/ src/
COPY package.json tsconfig.json ./
ARG PORT
RUN npm update -g \
&& npm install --ignore-scripts && npm run build \
&& addgroup -S nonroot \
&& adduser -S nonroot -G nonroot
USER nonroot

EXPOSE $PORT

ENTRYPOINT ["npm", "start"]
