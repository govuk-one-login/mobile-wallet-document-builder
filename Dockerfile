FROM node:20-alpine

WORKDIR /app
COPY src/ src/
COPY .env.example .env
COPY package.json tsconfig.json ./
ARG PORT
RUN npm update -g
RUN npm install --ignore-scripts && npm run build

EXPOSE $PORT
CMD npm run start