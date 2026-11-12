# Imágenes mensuales del calendario para redes
1. `npm i @fontsource/fraunces @fontsource/work-sans @fontsource/noto-color-emoji` en /tmp/calimg (las rutas de fuentes apuntan ahí).
2. Servidor local del repo en el puerto 8765 y `TZ=America/New_York node scrape.js` → /tmp/calimg/data.json (lee los meses desde el propio calendario ES/EN).
3. `node render.js` → /tmp/calimg/out: 1080x1350 (publicación) y 1080x1920 (historia/TikTok), en español e inglés.
Para 2028: ampliar el rango de meses en scrape.js cuando el calendario tenga ese año.
