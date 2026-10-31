# Automatización de Portal Místico (leer COMPLETO antes de hacer cualquier tarea programada)

Sitio estático (Netlify publica automáticamente cada push a `main`). Autor de los artículos: Roberto Rodriguez. Idioma: español neutro.
Roberto NO revisa los artículos antes de publicar: la calidad depende de estas reglas. Ante la duda, NO publicar.

## Archivos
- `automation/estado.json`: rotación. `siguiente_seccion` (0–9) apunta a la sección de turno; cada sección tiene `herramientas` y `usadas` (índices ya usados). `publicados` es el registro.
- `automation/publicar.py spec.json`: crea el artículo con la plantilla, la tarjeta del blog, sitemap y llms.txt. Genera portada automática si no hay imagen.
- `automation/validar.py [archivos]`: revisa enlaces rotos. Debe dar 0 antes de publicar.
- `automation/aplicar_imagen.py`: convierte imágenes que Roberto suba a `imagenes-pendientes/<slug>.png` en la portada real.
- `automation/plan-semana.json`: lo que decide la tarea del domingo (temas y prompts de imagen).
- `automation/prompts-imagen.md`: los prompts de imagen de la semana, para Roberto.
- Páginas útiles para enlazar: herramientas `../juegos/*.html`, signos `../zodiaco/<signo>.html` (aries, tauro, geminis, cancer, leo, virgo, libra, escorpio, sagitario, capricornio, acuario, piscis), glosario `../glosario/`, recursos `../recursos/index.html`, metodología `../metodologia.html`. Mira `blog/index.html` para no repetir temas.

## Rotación (artículo de herramienta, lunes)
1. Lee `estado.json`. Toma `secciones[siguiente_seccion]`. Elige 1 herramienta cuyo índice NO esté en `usadas` (si todas están usadas, vacía `usadas` y empieza otra vuelta).
2. Escribe el artículo sobre esa herramienta (qué es, cómo se usa, cómo interpretar el resultado, ejemplos, preguntas frecuentes), con enlace destacado a la herramienta.
3. Añade el índice a `usadas`, avanza `siguiente_seccion` (módulo 10) y registra en `publicados` {fecha, tipo, slug, titulo}.

## Reglas de calidad (artículo de herramienta)
- Mínimo 1000 palabras, texto 100% original, útil y concreto. Estructura: intro, 4–6 secciones `<h2>`, ejemplos, sección de preguntas frecuentes con `<details><summary>`.
- Mínimo 3 enlaces internos (la herramienta, 1 página de signo o glosario si aplica, otro artículo/herramienta relacionada). Rutas relativas desde `blog/` (`../juegos/...`).
- Tono: entretenimiento y tradición simbólica. Nunca prometer resultados, predecir muertes, enfermedades, dinero garantizado ni dar consejo médico, legal o financiero. Incluir "según la tradición", "simbólicamente", etc.
- No repetir título ni enfoque de artículos existentes. Título de máximo 70 caracteres y descripción de 120–155.
- Datos astronómicos (fases, retrógrados, eclipses): usar `juegos/brujula-game/datos-astro.js` (calculados), no inventar fechas.

## Artículo viral (miércoles)
- Tema: algo de actualidad con interés para el público de esoterismo/astrología/numerología/espiritualidad (p. ej. un evento astronómico de la semana, una fecha simbólica, una tendencia cultural). Se busca en la web (WebSearch) el mismo día que se decide.
- OBLIGATORIO: al menos 2 fuentes confiables independientes que confirmen los hechos. Citar las fuentes al final en una sección "Fuentes" con enlaces (`rel="noopener" target="_blank"`).
- PROHIBIDO: noticias de salud, medicina, dinero/inversiones, política, crímenes, personas privadas, tragedias, cualquier cosa no verificable. Nada de nombres de personas reales en predicciones. No copiar frases de las fuentes (parafrasear), máximo una cita corta entre comillas.
- Si no hay un tema seguro y verificable, NO publicar nada esa semana y anotarlo en `publicados` como {fecha, tipo:"viral", omitido:true, motivo}.
- Mínimo 800 palabras, ángulo propio: qué significa simbólicamente, cómo usar la fecha, enlace a la herramienta relacionada.

## Antes de publicar (siempre)
1. `python3 automation/aplicar_imagen.py` (por si Roberto subió imágenes).
2. Crear el JSON del artículo y ejecutar `python3 automation/publicar.py spec.json` (campos en la cabecera del script). `body_html` usa solo `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`, `<a>`, `<strong>`, `<details>`.
3. `python3 automation/validar.py blog/<slug>.html blog/index.html` debe dar 0 enlaces rotos.
4. Abrir la página con Playwright en móvil (390x844) y comprobar que carga, sin desbordes y con el título correcto. Si algo falla: no publicar, `git checkout .` y anotar el error en `publicados`.
5. `git add -A && git commit && git push origin main` (con las líneas de atribución que indique el sistema). IMPORTANTE: haz el commit con la identidad de Roberto en GitHub para que Netlify lo reconozca: `git config user.name robalf && git config user.email 42778378+robalf@users.noreply.github.com` antes de commitear. Netlify publica solo.

## Domingo: planificación y prompts de imagen
0. REGLA ANTI-PISADA: calcula el lunes siguiente al domingo actual. Si `plan-semana.json` ya tiene `semana` igual a ese lunes (YYYY-MM-DD) Y existe `prompts-imagen.md` de esa semana, NO cambies nada: el plan ya está hecho y Roberto puede haber subido imágenes con esos nombres. Solo envía una notificación breve diciendo que el plan de esa semana ya estaba listo y termina. Si el plan es de una semana anterior, planifica la semana del lunes siguiente.
1. Decidir la herramienta y el ángulo del artículo del lunes (sin publicarlo aún; la rotación se actualiza el lunes) y el tema viral candidato del miércoles (buscar en la web; comprobar 2 fuentes). Guardar en `plan-semana.json`: {semana, herramienta:{url,nombre,slug,titulo}, viral:{tema,slug,titulo,fuentes:[...]} o null}.
2. Escribir en `prompts-imagen.md` un prompt de imagen por artículo (formato 16:9, estilo soñador y etéreo, ilustración mística con luz suave, SIN texto ni letras dentro de la imagen, protagonista distinto cada vez, relacionado con el tema). Indicar el nombre exacto con que Roberto debe subir cada imagen: `imagenes-pendientes/<slug>.png`.
3. Los slugs del plan son los que usarán después los artículos de lunes y miércoles (reutilizar el slug del plan).
4. Hacer commit y push. Enviar notificación push a Roberto resumiendo (en español, muy breve) los 2 temas.

## Cómo sube Roberto la imagen (para recordárselo)
En github.com/robalf/portal-mistico → carpeta `imagenes-pendientes` → Add file → Upload files → soltar la imagen con el nombre `<slug>.png` → Commit changes. La siguiente tarea la convierte y la pone como portada.

## Horóscopo con cielo real (datos)
- `juegos/horoscopo-game/cielo-data.js` contiene las posiciones diarias reales (Luna, Sol, Mercurio, Venus, Marte, Júpiter, Saturno) y las fases lunares exactas, generadas con `automation/cielo_gen.py` (requiere `pip install astronomy-engine`, ejecutar desde la raíz del repo).
- Cubre hasta el 2 de enero de 2031. Si la fecha actual está a menos de 6 meses del final, regenerar con un rango más amplio (editar `end=` en el script). Fuera del rango el horóscopo vuelve a su texto simbólico antiguo.
- Los textos están en `juegos/horoscopo-game/cielo-textos.js`; la lógica en `cielo.js`.
- Horóscopo anual 2027–2030: `juegos/horoscopo-game/anual-data.js` (generado con `automation/anual_gen.py`: Júpiter, Saturno, Urano, Neptuno, Plutón, nodos, retrógrados y eclipses por año), textos en `anual-textos.js`, lógica en `anual.js`. Para añadir otro año, ampliar la tupla de años del script, regenerar y añadir la pestaña del año en `main.js` (categories).
