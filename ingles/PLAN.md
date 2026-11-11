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
| 10 | El Oráculo (novedades, sueños, rituales, runas, I Ching, ángeles) + textos del juego + índice del blog + tienda (shop) + revisión final | 11 |

Cada tanda termina con: validar enlaces, Playwright en móvil (390x844), commit y deploy (git push origin HEAD:main, mezclando la rama ingles en main).
Páginas y rutas: ver ingles/mapa.py (es -> en).
