# Etapa 1: Build de producción
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias primero (cache de Docker)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Pasar variable de entorno de EasyPanel al build de Vite
ARG VITE_OPENAI_API_KEY
ENV VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY

# Copiar el código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: Servidor Nginx (imagen mínima)
FROM nginx:alpine

# Copiar los archivos compilados del frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de plantilla de Nginx para inyección dinámica y proxy
COPY templates/default.conf.template /etc/nginx/templates/default.conf.template

# Puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
