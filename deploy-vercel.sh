#!/bin/bash

echo "🚀 Desplegando frontend a Vercel..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde el directorio Front/"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Build para producción
echo "🔨 Construyendo para producción..."
npm run build:production

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    echo "❌ Error: El build falló. No se encontró el directorio dist/"
    exit 1
fi

echo "✅ Build completado exitosamente!"
echo "📁 Archivos generados en: dist/"
echo ""
echo "Para desplegar a Vercel:"
echo "1. Instala Vercel CLI: npm i -g vercel"
echo "2. Ejecuta: vercel --prod"
echo "3. Configura las variables de entorno en el dashboard de Vercel"
