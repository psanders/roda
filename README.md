# Sitio web de Rodado Creativo

Sitio estático (HTML + CSS + JS, sin dependencias ni build).

## Estructura
- `index.html`: la página completa (escritorio y móvil).
- `css/styles.css`: colores de marca, tipografía y responsive.
- `js/main.js`: reproductor del hero, cortes 30/20/15 y enlaces de WhatsApp.
- `assets/fonts`: Instrument Serif, Inter y JetBrains Mono (woff2, locales).
- `assets/img`: escenas del storyboard de Guaraguao.
- `assets/video`: anuncio de ejemplo (versión limpia para el hero y cortes de 30, 20 y 15 s con sonido).
- `assets/brand`: favicon y logos.

## Probarlo en tu computadora
```
cd web
python3 -m http.server 8080
```
Luego abre http://localhost:8080

## Publicarlo
Sube la carpeta `web/` tal cual a cualquier hosting estático (Netlify, Vercel, Cloudflare Pages o GitHub Pages) y apunta el dominio roda.do.

## Cambios frecuentes
- Número de WhatsApp y mensaje prellenado: al inicio de `js/main.js` (`WA_NUMBER`, `WA_TEXT`).
- Precio y textos: directamente en `index.html`.
