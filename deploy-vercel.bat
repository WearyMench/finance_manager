@echo off
echo 🚀 Desplegando frontend a Vercel...

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No se encontró package.json. Ejecuta este script desde el directorio Front/
    pause
    exit /b 1
)

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm ci

REM Build para producción
echo 🔨 Construyendo para producción...
call npm run build:production

REM Verificar que el build fue exitoso
if not exist "dist" (
    echo ❌ Error: El build falló. No se encontró el directorio dist/
    pause
    exit /b 1
)

echo ✅ Build completado exitosamente!
echo 📁 Archivos generados en: dist/
echo.
echo Para desplegar a Vercel:
echo 1. Instala Vercel CLI: npm i -g vercel
echo 2. Ejecuta: vercel --prod
echo 3. Configura las variables de entorno en el dashboard de Vercel
pause
