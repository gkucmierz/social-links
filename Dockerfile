# Stage 1: Build TypeScript library, run test suite & build Vue 3 + Vite presentation SPA
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install

COPY . .
RUN npm run build && npm test && npm run build:ui

# Stage 2: Serve static SPA with hardened Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
