FROM node:lts-alpine

RUN apk update && apk upgrade busybox

WORKDIR /app
COPY src/ src/
COPY package.json package-lock.json tsconfig.json .npmrc ./
ARG PORT
RUN npm update -g \
&& npm install --ignore-scripts && npm run build \
&& addgroup -S nonroot \
&& adduser -S nonroot -G nonroot
USER nonroot

EXPOSE $PORT

ENTRYPOINT ["npm", "start"]
