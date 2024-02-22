FROM node:20-alpine as final

ARG PORT
WORKDIR /app
COPY src/ src/
COPY package.json .env tsconfig.json ./
RUN npm install --ignore-scripts && npm run build

EXPOSE $PORT
CMD npm run start