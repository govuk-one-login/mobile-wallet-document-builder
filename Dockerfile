FROM node:20.19.0-alpine3.20@sha256:9a9c00587bcb88209b164b2dba1f59c7389ac3a2cec2cfe490fc43cd947ed531

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
