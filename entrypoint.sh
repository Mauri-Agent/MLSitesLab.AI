#!/bin/sh

# Reemplazar el placeholder de la clave API en la configuración de Nginx usando sed de forma segura
if [ -n "$VITE_OPENAI_API_KEY" ]; then
  echo "🔑 Inyectando la clave API de OpenAI en la configuración de Nginx..."
  sed -i "s|OPENAI_KEY_PLACEHOLDER|$VITE_OPENAI_API_KEY|g" /etc/nginx/conf.d/default.conf
else
  echo "⚠️ ADVERTENCIA: La variable VITE_OPENAI_API_KEY no está definida. El proxy a OpenAI podría fallar."
fi

# Ejecutar el comando por defecto de Nginx (pasado por CMD en el Dockerfile)
exec "$@"
