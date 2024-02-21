FROM node:20-alpine as builder

WORKDIR /app
COPY src/ src/
COPY package.json .env tsconfig.json ./
RUN npm install --ignore-scripts && npm run build

FROM node:20-alpine as final
ARG PORT
WORKDIR /app
COPY --from=builder /app /app

EXPOSE $PORT
CMD npm run start