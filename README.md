# Zapatería El Parche

Sitio web de la zapateríaa construido con React, TypeScript y Vite. También incluye una versión independiente en HTML, CSS y JavaScript en `public/static-site/`, disponible desde la función de exportación del sitio.

## Desarrollo local

**Requisito:** [Bun](https://bun.sh/)

```bash
bun install
bun run dev
```

Para validar tipos y generar el sitio de producción:

```bash
bun run lint
bun run build
```

La salida de producción se genera en `dist/`. No necesita un servidor ni una clave de API para publicarse como sitio estático.

## Publicar en GitHub Pages

El flujo de GitHub Actions instala las dependencias con `bun.lock`, valida TypeScript, construye `dist/` y publica el resultado al hacer push a `main`.

1. En el repositorio de GitHub, abre **Settings > Pages**.
2. Selecciona **GitHub Actions** como fuente de publicación.
3. Envía los cambios a la rama `main` y revisa el resultado en la pestaña **Actions**.

La ruta base de Vite está configurada para el repositorio `zapater-a-el-parche`; si cambias el nombre del repositorio, actualiza `base` en `vite.config.ts`.
