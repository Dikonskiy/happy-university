# Stage 1 - Build React application
FROM node:16-alpine as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install --silent

# Copy the frontend source code
COPY front/ .

# Build the React app
RUN npm run build

# Stage 2 - Serve React application using nginx
FROM nginx:1.21-alpine

# Copy build files from stage 1
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
