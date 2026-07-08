# Chatea con Hijitus

Aplicación SPA responsive para conversar con Hijitus, el personaje travieso de la caricatura argentina, usando una función serverless de Vercel y Google Gemini.

## Personaje elegido

- Hijitus
- Personalidad: travieso, amable, curioso y breve.
- Estilo de respuesta: informal, divertido y adecuado para chat.

## Requisitos

- Node.js 18+
- npm
- Cuenta en Google AI Studio para obtener una API key de Gemini

## Ejecutar localmente

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo de ejemplo:
   ```bash
   copy .env.example .env
   ```
3. Completa tu API key en .env:
   ```env
   GEMINI_API_KEY=tu_api_key_aqui
   ```
4. Ejecuta el proyecto:
   ```bash
   npm run dev
   ```
5. Abre la URL local que muestre Vite (por lo general http://localhost:5173).

## Ejecutar tests

```bash
npm test
```

## Desplegar en Vercel

1. Sube este proyecto a GitHub.
2. Crea un nuevo proyecto en Vercel y conecta el repositorio.
3. Agrega la variable de entorno `GEMINI_API_KEY` en el dashboard de Vercel.
4. Despliega.

## Uso de IA

Se utilizó un prompt de sistema para definir la personalidad de Hijitus y se integró Gemini desde una función serverless para no exponer la API key desde el frontend.

## Enlace desplegado

URL pública del proyecto: https://hijitus-chat-274y6as24-mateo-el-pro.vercel.app
