# Stage 1: Build Angular App
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set strict-ssl false
RUN npm install -g npm@11.13.0
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine
COPY --from=build /app/dist/sql_frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
