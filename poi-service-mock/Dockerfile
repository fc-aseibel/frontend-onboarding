# BUILD STAGE
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js ./
COPY poi-data.json ./

EXPOSE 3000
CMD ["npm", "start"]