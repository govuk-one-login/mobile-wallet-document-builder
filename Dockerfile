FROM node:20.5.1-alpine3.17@sha256:ca274cb63ae61f501edb8a5abc29d926f8169793655a4cf39dc7fd8de0a4bca9

WORKDIR /app
COPY src/ src/
COPY .env.example .env
COPY package.json tsconfig.json ./
ARG PORT
RUN npm update -g
RUN npm install --ignore-scripts && npm run build

RUN addgroup -S nonroot
RUN adduser -S nonroot -G nonroot
USER nonroot

EXPOSE $PORT
CMD npm run start