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

## Cadencia (desde 2026-11-10, decisión de Roberto)
- Artículo de herramienta: SOLO un lunes sí y un lunes no (cada 14 días). Regla: busca en `publicados` la última entrada tipo "herramienta" no omitida; si han pasado menos de 14 días hasta el lunes de hoy, NO publiques herramienta (no es un fallo, no notifiques). Último publicado: 2026-11-09 → siguientes: 2026-11-23, 2026-12-07, y así cada 14 días.
- Artículo viral: TODOS los miércoles, sin cambios.
- Domingo: planifica herramienta (tema + prompt de imagen) solo si el lunes siguiente toca; el viral se planifica siempre.

## Rotación (artículo de herramienta, cada 14 días)
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
- BÚSQUEDA DE LO VIRAL EN TODAS LAS HERRAMIENTAS (domingo): el tema debe ser algo que esté siendo noticia o tendencia ESA semana, pero buscado en TODAS las áreas del portal, no solo en el cielo. Haz al menos una búsqueda web de actualidad por cada área y anota en `plan-semana.json` (campo `viral_candidatos`) lo que encontraste en cada una (o "nada actual"):
  tarot · numerología (fechas espejo, números angelicales, año personal) · horóscopo y astrología (retrógrados, cambios de signo, predicciones que circulan) · Luna (Luna llena con nombre, eclipses, superlunas) · zodiaco chino (Año Nuevo Chino, animal del año) · ángeles y mensajes angelicales · sueños (sueños que se vuelven tendencia, estudios) · rituales y fechas tradicionales (Día de Muertos, solsticios, equinoccios, San Juan, Año Nuevo, Halloween, San Valentín) · compatibilidad y amor · cristales, aura, quiromancia, runas, I Ching · astronomía (lluvias de estrellas, conjunciones).
  Busca en noticias recientes, redes (TikTok, Instagram, X) y tendencias de búsqueda, en español e inglés (p. ej. "tarot tendencia esta semana", "viral numerología noviembre", "Mercury retrograde trend", "TikTok tarot trend").
- CÓMO ELEGIR: la prioridad es lo MÁS VIRAL de la semana. Ordena los candidatos de más a menos viral y quédate con el primero cuyo tema NO se haya publicado ya en el portal (revisa `publicados` en `estado.json` y los artículos existentes en `blog/`). Ejemplo: si hay 3 temas virales y ya hay artículo de 2 de ellos, se publica el tercero aunque sea menos viral. Si dos candidatos están igual de virales, gana el de un área no usada en las 3 semanas anteriores (`viral_categorias` en `estado.json`; añade la categoría usada al publicar). Cada artículo viral enlaza de forma destacada a la herramienta del portal relacionada.
- Fuentes válidas según el tipo: para hechos astronómicos, fuentes científicas (NASA, EarthSky, observatorios); para fechas o tendencias culturales/esotéricas (p. ej. el portal 11/11), al menos 2 medios conocidos que documenten la tendencia, y el artículo la presenta como creencia o tradición, nunca como hecho científico.
- OBLIGATORIO: al menos 2 fuentes confiables independientes que confirmen los hechos. Citar las fuentes al final en una sección "Fuentes" con enlaces (`rel="noopener" target="_blank"`).
- PROHIBIDO: noticias de salud, medicina, dinero/inversiones, política, crímenes, personas privadas, tragedias, cualquier cosa no verificable. Nada de nombres de personas reales en predicciones. No copiar frases de las fuentes (parafrasear), máximo una cita corta entre comillas.
- Si no hay un tema seguro y verificable, NO publicar nada esa semana y anotarlo en `publicados` como {fecha, tipo:"viral", omitido:true, motivo}.
- Mínimo 800 palabras, ángulo propio: qué significa simbólicamente, cómo usar la fecha, enlace a la herramienta relacionada.

## Que no suene a IA (aplica a TODOS los artículos)
- Quita muletillas: "en el vasto universo", "sin duda", "en conclusión", "es importante destacar", "un viaje de", "descubre el poder de", "desbloquea". Evita listas de 3 adjetivos y párrafos que terminan siempre con moraleja.
- Varía la estructura: no uses siempre intro + 5 h2 + FAQ. Alterna formatos (pregunta directa, caso práctico, mito vs realidad, paso a paso). Largos de párrafo y de frase irregulares; alguna frase corta.
- Voz de Roberto: primera persona cuando haya algo real que contar (cómo lo usa, qué ha visto, una duda honesta). Opiniones con matiz y alguna limitación ("esto no funciona si…"). Nunca inventar experiencias; si no hay, se omite.
- Aporta algo que solo el portal tiene: un ejemplo calculado con la herramienta, una captura/resultado real, una tabla propia, una fecha verificada. Datos concretos antes que generalidades.
- Imagen distinta cada vez (regla de variedad) y enlaces internos útiles, no de relleno.
- Antes de publicar, relee el borrador y reescribe a mano los dos primeros párrafos y el cierre; son lo que más delata.

## Antes de publicar (siempre)
1. `python3 automation/aplicar_imagen.py` (por si Roberto subió imágenes).
2. Crear el JSON del artículo y ejecutar `python3 automation/publicar.py spec.json` (campos en la cabecera del script). `body_html` usa solo `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`, `<a>`, `<strong>`, `<details>`.
3. `python3 automation/validar.py blog/<slug>.html blog/index.html` debe dar 0 enlaces rotos.
4. Abrir la página con Playwright en móvil (390x844) y comprobar que carga, sin desbordes y con el título correcto. Si algo falla: no publicar, `git checkout .` y anotar el error en `publicados`.
5. `git add -A && git commit && git push origin main` (con las líneas de atribución que indique el sistema). IMPORTANTE: haz el commit con la identidad de Roberto en GitHub para que Netlify lo reconozca: `git config user.name robalf && git config user.email 42778378+robalf@users.noreply.github.com` antes de commitear. Netlify publica solo.

## Domingo: planificación y prompts de imagen
0. REGLA ANTI-PISADA: calcula el lunes siguiente al domingo actual. Si `plan-semana.json` ya tiene `semana` igual a ese lunes (YYYY-MM-DD) Y existe `prompts-imagen.md` de esa semana, NO cambies nada: el plan ya está hecho y Roberto puede haber subido imágenes con esos nombres. Solo envía una notificación breve diciendo que el plan de esa semana ya estaba listo y termina. Si el plan es de una semana anterior, planifica la semana del lunes siguiente.
1. Decidir la herramienta y el ángulo del artículo del lunes (sin publicarlo aún; la rotación se actualiza el lunes) y el tema viral candidato del miércoles (buscar en la web; comprobar 2 fuentes). Guardar en `plan-semana.json`: {semana, herramienta:{url,nombre,slug,titulo}, viral:{tema,slug,titulo,fuentes:[...]} o null}.
2. Escribir en `prompts-imagen.md` un prompt de imagen por artículo (formato 16:9, estilo soñador y etéreo, ilustración mística con luz suave, SIN texto ni letras dentro de la imagen, protagonista distinto cada vez, relacionado con el tema; el protagonista SIEMPRE es una o varias PERSONAS (mujeres y hombres adultos de aspecto variado, de cuerpo entero o medio cuerpo, en una escena que muestre el tema del artículo). NUNCA animales como protagonistas ni como decoración; nada de personas reales ni famosas). VARIEDAD OBLIGATORIA: cada imagen con un ESTILO artístico distinto al de las 4 anteriores (acuarela, art nouveau, óleo clásico, ilustración de libro infantil, cinematográfico fotorrealista, grabado antiguo, ukiyo-e, póster retro, vitral, collage, pastel, 3D suave, etc.) y una COMPOSICIÓN distinta (primer plano del rostro, retrato de medio cuerpo, escena interior, grupo de personas, escena en movimiento, vista desde arriba…). PROHIBIDO repetir la fórmula 'persona de espaldas/en una esquina mirando el cielo'. Ofrece 3 prompts alternativos de estilos diferentes por imagen para que Roberto elija. Indicar el nombre exacto con que Roberto debe subir cada imagen: `imagenes-pendientes/<slug>.png`.
3. Los slugs del plan son los que usarán después los artículos de lunes y miércoles (reutilizar el slug del plan).
4. Hacer commit y push. Enviar notificación push a Roberto resumiendo (en español, muy breve) los 2 temas.

## Cómo sube Roberto la imagen (para recordárselo)
En github.com/robalf/portal-mistico → carpeta `imagenes-pendientes` → Add file → Upload files → soltar la imagen con el nombre `<slug>.png` → Commit changes. La siguiente tarea la convierte y la pone como portada.

## Horóscopo con cielo real (datos)
- `juegos/horoscopo-game/cielo-data.js` contiene las posiciones diarias reales (Luna, Sol, Mercurio, Venus, Marte, Júpiter, Saturno) y las fases lunares exactas, generadas con `automation/cielo_gen.py` (requiere `pip install astronomy-engine`, ejecutar desde la raíz del repo).
- Cubre hasta el 2 de enero de 2031. Si la fecha actual está a menos de 6 meses del final, regenerar con un rango más amplio (editar `end=` en el script). Fuera del rango el horóscopo vuelve a su texto simbólico antiguo.
- Los textos están en `juegos/horoscopo-game/cielo-textos.js`; la lógica en `cielo.js`.
- Horóscopo anual 2027–2030: `juegos/horoscopo-game/anual-data.js` (generado con `automation/anual_gen.py`: Júpiter, Saturno, Urano, Neptuno, Plutón, nodos, retrógrados y eclipses por año), textos en `anual-textos.js`, lógica en `anual.js`. Para añadir otro año, ampliar la tupla de años del script, regenerar y añadir la pestaña del año en `main.js` (categories).

## Cadencia vigente (desde 12-nov-2026)
- Artículo de herramienta: UNA vez cada 14 días (lunes alterno). Último: lunes 9-nov → siguientes: 23-nov, 7-dic, 21-dic…
- Artículo viral: cada miércoles.
- El domingo se planifica siempre el viral; la herramienta solo si ese lunes toca (si no, `"herramienta": null`).
