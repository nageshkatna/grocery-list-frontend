# Stage 1: Build the app
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG VITE_APP_API_BASE_URL
ENV VITE_APP_API_BASE_URL=${VITE_APP_API_BASE_URL}
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine


COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]