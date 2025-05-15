FROM node:20.19.1-alpine3.20@sha256:76bacbf09e7a2a999b5cf058c3d543216919f7dad9b00ae040cc9c39635fcc65

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
