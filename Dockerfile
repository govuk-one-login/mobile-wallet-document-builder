FROM node:20.18.3-alpine3.20@sha256:3488b10bf958af7125a176419d2d8a9937d895bf124012aae811651988d2ffe6

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
