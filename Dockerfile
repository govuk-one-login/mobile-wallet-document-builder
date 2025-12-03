FROM node:20.19.2-alpine3.20@sha256:3bc9a4c4cc25cfde1e8f946341c85f333c36517aafda829b4bb7e785e9b5995c

RUN apk update && apk upgrade busybox

WORKDIR /app
COPY src/ src/
COPY package.json tsconfig.json .npmrc ./
ARG PORT
RUN npm update -g \
&& npm install --ignore-scripts && npm run build \
&& addgroup -S nonroot \
&& adduser -S nonroot -G nonroot
USER nonroot

EXPOSE $PORT

ENTRYPOINT ["npm", "start"]
