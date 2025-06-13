# BUILD STAGE
FROM node:24.1.0 as builder

WORKDIR /app
RUN npm install -g @angular/cli
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN ng build --configuration production

# PRODUCTION STAGE
FROM docker.io/nginx:alpine

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]