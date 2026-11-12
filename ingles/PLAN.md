# Versión en inglés de Portal Místico (carpeta /en/)
Decisión de Roberto (11 nov 2026): clon completo en inglés, en 10 tandas, con deploy al terminar cada tanda.
Reglas: no tocar direcciones en español; hreflang en pares (es<->en) solo cuando existan ambas; sin redirección automática por idioma; texto adaptado a inglés americano (no literal); Tarot conserva su diseño.

| Tanda | Contenido | Páginas |
|---|---|---|
| 1 | Infraestructura (selector de idioma, hreflang, sitemap en, scripts en inglés), portada, sobre nosotros, contacto, legales (5), metodología, recursos | 9 |
| 2 | Glosario (índice + 12) + signos del zodiaco (13) | 26 |
| 3 ✓ | Tarot: 5 herramientas + textos del juego de tarot + 5 artículos | 10 |
| 4 ✓ | Numerología: 6 herramientas (+ textos nativos) + 5 artículos | 11 |
| 5 ✓ | Horóscopo y signos: 16 herramientas (+ textos nativos de horóscopo y signos) | 16 |
| 6 ✓ | Astrología y Brújula Lunar: 6 herramientas astrales + 5 de Brújula (+ textos del juego) | 11 |
| 7 ✓ | Artículos de astrología, calendarios y fechas | 13 |
| 8 ✓ | 12 parejas de signos | 12 |
| 9 ✓ | Aura, quiromancia y vidas pasadas: 2 herramientas (+ textos de juegos) + 10 artículos | 12 |
| 10 ✓ | El Oráculo (novedades, sueños, rituales, runas, I Ching, ángeles) + textos del juego + índice del blog + tienda (shop) + revisión final | 11 |

Cada tanda termina con: validar enlaces, Playwright en móvil (390x844), commit y deploy (git push origin HEAD:main, mezclando la rama ingles en main).
Páginas y rutas: ver ingles/mapa.py (es -> en).

## Estado a 12 nov 2026 (resumen para cualquier chat que continúe)
- Las 10 tandas están hechas y publicadas: 132 páginas en `/en/`. Para añadir o cambiar una página en inglés: `ingles/need.py` → traducciones en `ingles/tr/*.json` → `merge.py` → build (`pipeline.P.build/write_en`) → `finish.py`. Después de `finish.py`, revertir los cambios de saltos de línea que mete en páginas ES que no se tocaron.
- Selector de idioma ES/EN (bolita deslizante) en todas las páginas: `assets/css/lang-toggle.css`, `assets/js/lang-toggle.js`.
- Portada EN: carrusel de herramientas y de blog con imágenes en inglés (`-en-960.webp`, `-en-bg.webp`); imágenes principales de artículos EN con texto traducido (`-01-en.jpg`).
- Ventana de opinión (ES/EN): campo de nombre opcional y aviso de que el comentario podría publicarse. Los correos llegan por FormSubmit; nada se publica solo.
- Artículo `blog/portal-11-11-ritual.html` actualizado como balance (12 nov).
- Calendario esotérico 2026-2027: `juegos/calendario-esoterico.html` (EN: `tools/esoteric-calendar.html`). Datos en `assets/data/calendario-esoterico.json`, generados con `automation/calendario/gen.mjs` (astronomy-engine); página generada con `automation/calendario/build.py`; lógica en `assets/js/calendario-esoterico.js`. Enlace en el menú principal («Calendario»).
- **Mi día / My Day** (12 nov 2026): `juegos/mi-dia.html` (EN `en/tools/my-day.html`, cortas `/mi-dia` y `/en/my-day`). Motor: `assets/js/mi-dia.js` (usa `CartaCalc`/`CartaTextos`/`CartaUI` de la carta astral, rituales en `assets/js/mi-dia-rituales-es|en.js`, copiados de la Brújula Lunar; eventos de `assets/data/calendario-esoterico.json`). Guarda fecha en `localStorage['pm-mi-dia']`. Incluye energía/amor, tránsitos, luna, número de día personal, color planetario, ritual, estado de las lecturas diarias (`pm-daily-*`), cuenta atrás y tarjeta PNG para compartir. **Racha de días**: la cuenta `musica-global(-en).js` en `localStorage['pm-streak']` y añade el enlace "✨ Mi día · 🔥N" al menú de todas las páginas (y una pastilla 🔥 en pantallas anchas). Nota técnica: `musica-global.js` carga los scripts de cada página en paralelo al navegar sin recargar, por eso `mi-dia.js` espera a que el motor exista. **Mantenimiento**: cuando se amplíe el calendario más allá de dic 2027, la cuenta atrás se actualiza sola con el JSON.
- Se quitó el botón de audio de cada herramienta (queda solo el de la música global): regla CSS en `musica-global*.js` y en cada `index.html` de las herramientas.
- Pendiente: enlaces de afiliado de la tienda EN (Amazon EE. UU.), revisión legal de las páginas legales EN, comparar Search Console (~8 dic), confirmar AdSense, publicar reseñas con nombre cuando lleguen, imágenes mensuales del calendario para redes, páginas por mes del calendario.
