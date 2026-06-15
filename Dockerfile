# Etapa 1: Build de producción
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias primero (cache de Docker)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copiar el código fuente y compilar
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx (imagen mínima)
FROM nginx:alpine

# Copiar los archivos compilados del frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración estática de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de entrypoint para inyección en tiempo de ejecución
COPY entrypoint.sh /entrypoint.sh

# Puerto 80
EXPOSE 80

# Usar el script de entrypoint para inicializar la clave API
ENTRYPOINT ["/entrypoint.sh"]

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
