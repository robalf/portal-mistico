#!/usr/bin/env python3
"""Genera juegos/calendario-esoterico.html (ES) a partir de la plantilla de un artículo del blog.
La versión EN la crea ingles/finish.py desde esta página (mapa.py). Datos: assets/data/calendario-esoterico.json (gen.mjs)."""
import re, json, os, urllib.parse
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
tpl = open(os.path.join(R, 'blog/portal-11-11-ritual.html'), encoding='utf8').read().split('\n')
URL = 'https://elportalmistico.com/juegos/calendario-esoterico.html'
TITLE = 'Calendario esotérico 2026-2027: lunas, eclipses y retrógrados | Portal Místico'
H1 = 'Calendario esotérico 2026-2027'
DESC = 'Calendario mes a mes hasta diciembre de 2027: lunas nuevas y llenas, superlunas, eclipses, retrógrados, portales numéricos, lluvias de estrellas y más. Descárgalo en tu calendario.'
OGIMG = 'https://elportalmistico.com/assets/og/brujula.jpg'

head_lines = tpl[:tpl.index('</head>')]
keep = []
for ln in head_lines:
    if re.search(r'<title>|name="description"|rel="canonical"|property="og:|name="twitter:|name="article:|property="article:|application/ld\+json|rel="alternate" hreflang', ln):
        continue
    keep.append(ln)
head = '\n'.join(keep)

faq = [
 ('¿Qué eventos incluye el calendario esotérico?', 'Lunas nuevas, llenas y cuartos, superlunas, eclipses solares y lunares, retrogradaciones y estaciones de los planetas, entrada del Sol y de los planetas lentos en cada signo, equinoccios y solsticios, portales numéricos como el 11/11 o el 12/12, lluvias de estrellas y fiestas tradicionales.'),
 ('¿De dónde salen las fechas?', 'Las fases de la Luna, los eclipses, las retrogradaciones y los cambios de signo están calculados con astronomy-engine, una librería astronómica de código abierto. Las fechas de las lluvias de estrellas se basan en el calendario de la Organización Internacional de Meteoros (IMO). Las horas se muestran en tu zona horaria.'),
 ('¿Cómo añado estos eventos a mi móvil o a Google Calendar?', 'Pulsa el botón «Añadir a mi calendario (.ics)». Se descarga un archivo con los eventos que tengas activados en los filtros, que puedes abrir con Google Calendar, el calendario del iPhone u Outlook.'),
 ('¿Por qué la fecha de un evento puede ser distinta en mi país?', 'Los eventos astronómicos ocurren en un instante concreto del tiempo universal (UTC). Según tu zona horaria, ese instante puede caer en el día anterior o posterior. Por eso las horas del calendario se convierten automáticamente a tu zona.'),
 ('¿Qué es un portal numérico?', 'Es el nombre popular de las fechas con el mismo número repetido, como 11/11 o 12/12. Es una tradición de la numerología y la espiritualidad moderna: se consideran momentos simbólicos para fijar intenciones. No tiene una base científica.'),
]
ld = {"@context": "https://schema.org", "@graph": [
  {"@type": "WebPage", "name": H1, "description": DESC, "url": URL, "inLanguage": "es",
   "dateModified": "2026-11-12", "publisher": {"@type": "Organization", "name": "Portal Místico", "url": "https://elportalmistico.com/"}},
  {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]},
  {"@type": "BreadcrumbList", "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://elportalmistico.com/"},
    {"@type": "ListItem", "position": 2, "name": H1, "item": URL}]}]}
meta = f'''<title>{TITLE}</title>
<meta name="description" content="{DESC}">
<link rel="canonical" href="{URL}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta property="og:site_name" content="Portal Místico">
<meta property="og:locale" content="es_ES">
<meta property="og:type" content="website">
<meta property="og:url" content="{URL}">
<meta property="og:title" content="{H1}">
<meta property="og:description" content="{DESC}">
<meta property="og:image" content="{OGIMG}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{H1}">
<meta name="twitter:description" content="{DESC}">
<meta name="twitter:image" content="{OGIMG}">
<script type="application/ld+json" id="pm-ld">{json.dumps(ld, ensure_ascii=False)}</script>'''

css = '''<style id="pm-cal-css">
.cal-page{max-width:1000px;margin:0 auto;padding:34px 16px 10px;font-family:'Work Sans',sans-serif;color:#EEF0FA}
.cal-page .kicker{color:#C7A24B;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px}
.cal-page h1{font-size:2rem;line-height:1.2;margin-bottom:10px}
.cal-page .lead{color:#C9CCE6;font-size:1rem;max-width:760px;margin-bottom:18px}
.cal-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin:14px 0 8px}
.cal-nav{display:flex;align-items:center;gap:8px}
.cal-nav h2{font-size:1.25rem;min-width:11ch;text-align:center;margin:0}
.cal-btn,.cal-chip,.cal-f,.cal-act{font:inherit;cursor:pointer;color:#EEF0FA;background:rgba(42,37,96,.45);border:1px solid rgba(199,162,75,.4);border-radius:999px;padding:8px 14px;font-size:.88rem;-webkit-tap-highlight-color:transparent}
.cal-btn{width:40px;height:40px;padding:0;font-size:1.1rem}
.cal-btn:disabled{opacity:.35;cursor:default}
.cal-btn:hover:not(:disabled),.cal-chip:hover,.cal-act:hover{background:rgba(199,162,75,.2)}
.cal-months{display:flex;gap:6px;overflow-x:auto;padding:4px 0 10px;scrollbar-width:thin}
.cal-chip{flex:none;padding:6px 12px;font-size:.82rem;text-transform:capitalize}
.cal-chip.on{background:linear-gradient(135deg,#E9D9A6,#C7A24B);color:#1a1406;border-color:transparent;font-weight:600}
.cal-filters{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 12px}
.cal-f{padding:6px 12px;font-size:.82rem;opacity:.55}
.cal-f.on{opacity:1}
.cal-f.c-lunas.on{border-color:#9FB4E8;background:rgba(159,180,232,.18)}
.cal-f.c-eclipses.on{border-color:#F0925A;background:rgba(240,146,90,.18)}
.cal-f.c-retro.on{border-color:#C58BF0;background:rgba(197,139,240,.18)}
.cal-f.c-portales.on{border-color:#E6C766;background:rgba(230,199,102,.18)}
.cal-f.c-cielo.on{border-color:#6FD1B4;background:rgba(111,209,180,.18)}
.cal-f.c-lluvias.on{border-color:#6EC3F4;background:rgba(110,195,244,.18)}
.cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
.cal-dow{text-align:center;font-size:.74rem;color:#9098C4;text-transform:uppercase;letter-spacing:.06em;padding:4px 0}
.cal-cell{position:relative;min-height:62px;border-radius:10px;border:1px solid rgba(244,239,227,.1);background:rgba(10,11,24,.7);color:#EEF0FA;font:inherit;text-align:left;padding:5px 5px 4px;cursor:default;display:flex;flex-direction:column;justify-content:space-between}
.cal-cell.empty{background:transparent;border-color:transparent}
.cal-cell.has{cursor:pointer;border-color:rgba(199,162,75,.35)}
.cal-cell.has:hover{background:rgba(199,162,75,.12)}
.cal-cell.today{box-shadow:0 0 0 2px #C7A24B inset}
.cal-cell.sel{background:rgba(199,162,75,.22);border-color:#C7A24B}
.cal-num{font-size:.8rem;color:#C9CCE6}
.cal-ic{display:flex;flex-wrap:wrap;gap:2px;font-size:.95rem;line-height:1}
.cal-ic i{font-style:normal}
.cal-ic b{font-size:.68rem;color:#9098C4;font-weight:500;align-self:center}
.c-eclipses.cal-ev,.c-retro.cal-ev,.c-lunas.cal-ev,.c-portales.cal-ev,.c-cielo.cal-ev,.c-lluvias.cal-ev{border-left-width:3px}
.cal-day{margin:14px 0;padding:16px;border-radius:14px;border:1px solid rgba(199,162,75,.45);background:rgba(42,37,96,.35)}
.cal-day h3,.cal-list-t{font-family:'Fraunces',serif;font-size:1.1rem;margin:0 0 10px;font-weight:600}
.cal-ev{border:1px solid rgba(244,239,227,.12);border-left:3px solid #C7A24B;border-radius:12px;padding:12px 14px;margin:0 0 10px;background:rgba(10,11,24,.7)}
.cal-ev.c-lunas{border-left-color:#9FB4E8}.cal-ev.c-eclipses{border-left-color:#F0925A}.cal-ev.c-retro{border-left-color:#C58BF0}.cal-ev.c-portales{border-left-color:#E6C766}.cal-ev.c-cielo{border-left-color:#6FD1B4}.cal-ev.c-lluvias{border-left-color:#6EC3F4}
.cal-ev-h{display:flex;gap:10px;align-items:center}
.cal-ev-ic{font-size:1.3rem;flex:none;width:30px;text-align:center}
.cal-ev-t strong{display:block;font-size:.98rem;color:#EEF0FA}
.cal-ev-t small{color:#C7A24B;font-size:.8rem}
.cal-ev p{margin:8px 0 0;font-size:.9rem;color:#C9CCE6;line-height:1.55}
.cal-none{color:#9098C4;font-size:.92rem}
.cal-acts{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0 6px}
.cal-act.main{background:linear-gradient(135deg,#E9D9A6,#C7A24B);color:#1a1406;border-color:transparent;font-weight:600}
.cal-tz{color:#9098C4;font-size:.78rem;margin:2px 0 14px}
.cal-seo{margin-top:34px}
.cal-seo h2{font-family:'Fraunces',serif;font-size:1.25rem;font-style:italic;font-weight:500;margin:26px 0 10px}
.cal-seo p,.cal-seo li{color:#C9CCE6;font-size:.95rem;line-height:1.65;margin-bottom:10px}
.cal-seo a{color:#C7A24B}
.cal-seo ul{padding-left:20px}
.cal-seo details{border:1px solid rgba(244,239,227,.12);border-radius:12px;padding:12px 14px;margin-bottom:10px;background:rgba(10,11,24,.6)}
.cal-seo summary{cursor:pointer;font-weight:600;color:#EEF0FA}
.cal-seo details p{margin:10px 0 0}
.cal-note{font-size:.82rem;opacity:.85}
@media(max-width:560px){.cal-page h1{font-size:1.55rem}.cal-cell{min-height:54px;padding:4px 3px}.cal-ic{font-size:.8rem}.cal-num{font-size:.74rem}.cal-nav h2{font-size:1.05rem;min-width:9ch}}
</style>'''

body = f'''<main class="cal-page" id="calendario">
<div class="kicker">✦ Portal Místico · Calendario ✦</div>
<h1>{H1}</h1>
<p class="lead">Todo el cielo y las fechas simbólicas de noviembre de 2026 a diciembre de 2027, mes a mes: lunas nuevas y llenas, superlunas, eclipses, planetas retrógrados, portales numéricos como el 11/11 y el 12/12, lluvias de estrellas y más. Elige un mes, toca un día y descarga los eventos en tu calendario.</p>
<div class="cal-months" id="cal-months" role="group" aria-label="Meses"></div>
<div class="cal-bar">
  <div class="cal-nav"><button class="cal-btn" id="cal-prev" type="button" aria-label="Mes anterior">‹</button><h2 id="cal-title"></h2><button class="cal-btn" id="cal-next" type="button" aria-label="Mes siguiente">›</button></div>
  <button class="cal-act" id="cal-today" type="button">Hoy</button>
</div>
<div class="cal-filters" id="cal-filters" role="group" aria-label="Filtros"></div>
<div class="cal-grid" id="cal-grid" role="group" aria-label="Calendario del mes"></div>
<div class="cal-day" id="cal-day" hidden aria-live="polite"></div>
<div class="cal-acts"><button class="cal-act main" id="cal-dl" type="button">📅 Añadir a mi calendario (.ics)</button><button class="cal-act" id="cal-copy" type="button">Copiar eventos del mes</button></div>
<p class="cal-tz" id="cal-tz"></p>
<h2 class="cal-list-t" id="cal-list-t"></h2>
<div id="cal-list"></div>
<noscript><p class="cal-none">Activa JavaScript para ver el calendario interactivo.</p></noscript>

<section class="cal-seo">
<h2>Qué encontrarás en este calendario</h2>
<p>Es una guía para saber, mes a mes, qué ocurre en el cielo y qué fechas simbólicas se acercan. Incluye las <a href="calendario-lunar.html">fases de la Luna</a> (nuevas, llenas y cuartos, con el signo en que caen), las superlunas, los eclipses, los <a href="planetas-retrogrados-hoy.html">planetas retrógrados</a>, la entrada del Sol en cada signo, los equinoccios y solsticios, las lluvias de estrellas y los portales numéricos.</p>
<h2>Fechas clave de lo que queda de 2026 y de 2027</h2>
<ul>
<li><strong>Superlunas seguidas:</strong> noviembre y diciembre de 2026 y enero de 2027.</li>
<li><strong>Eclipse solar total del 2 de agosto de 2027,</strong> visible en el sur de España y el norte de África. Antes, el eclipse solar anular del 6 de febrero.</li>
<li><strong>Mercurio retrógrado en 2027:</strong> del 9 de febrero al 3 de marzo, del 10 de junio al 4 de julio y del 7 al 28 de octubre (fechas en UTC; consulta la <a href="../blog/mercurio-retrogrado-octubre-2026.html">guía de Mercurio retrógrado</a>).</li>
<li><strong>Portales numéricos:</strong> el <a href="../blog/portal-11-11-ritual.html">11/11</a>, el 12/12 y el 1/1. En numerología, <a href="ano-personal-2027.html">2027 es un año universal 11</a>.</li>
<li><strong>Lluvias de estrellas:</strong> Cuadrántidas, Perseidas, Gemínidas y más, con la fase de la Luna de cada pico.</li>
</ul>
<h2>Cómo usarlo</h2>
<p>Pulsa un mes en la barra superior o usa las flechas. Los filtros permiten ver solo lo que te interesa (por ejemplo, solo lunas o solo retrógrados). Al tocar un día se abre el detalle de sus eventos, y debajo tienes la lista completa del mes. Con el botón «Añadir a mi calendario» te llevas los eventos a Google Calendar, al iPhone o a Outlook.</p>
<p>Para saber cómo te afecta cada evento a ti, prueba la <a href="carta-astral.html">carta astral</a>, el <a href="horoscopo.html">horóscopo</a> y la <a href="numerologia.html">calculadora de numerología</a>. También puedes leer el <a href="../blog/horoscopo-2027-signos.html">horóscopo 2027 para los 12 signos</a>.</p>
<p class="cal-note"><em>La astrología, la numerología y los rituales tienen un sentido simbólico y de entretenimiento. Las fechas astronómicas son cálculos reales; sus significados son tradición, no ciencia.</em></p>
<h2>Preguntas frecuentes</h2>
{''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in faq)}
</section>
</main>
<script src="/assets/js/calendario-esoterico.js?v=1" defer></script>
'''

share_title = 'Calendario esotérico 2026-2027: lunas, eclipses y retrógrados'
u = urllib.parse.quote(URL, safe='')
t = urllib.parse.quote(share_title, safe='')
share = f'''<div class="pm-share" data-url="{URL}" data-title="{share_title}">
  <div class="pm-share-t">✦ Comparte este calendario ✦</div>
  <div class="pm-share-row">
    <button type="button" class="pm-native">📤 Compartir</button>
    <a href="https://wa.me/?text={t}%20{u}" target="_blank" rel="noopener">💬 WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u={u}" target="_blank" rel="noopener">📘 Facebook</a>
    <a href="https://pinterest.com/pin/create/button/?url={u}&amp;media={urllib.parse.quote(OGIMG, safe='')}&amp;description={t}" target="_blank" rel="noopener">📌 Pinterest</a>
    <button type="button" class="pm-copy">🔗 Copiar enlace</button>
  </div>
</div>
'''

# nav + footer + scripts de la plantilla
i_nav = next(i for i, l in enumerate(tpl) if l.startswith('<body'))
i_art = next(i for i, l in enumerate(tpl) if l.startswith('<article class="post">'))
i_foot = next(i for i, l in enumerate(tpl) if l.startswith('<footer class="legal-bar"'))
i_foot_end = next(i for i in range(i_foot, len(tpl)) if tpl[i].startswith('</footer>'))
i_burger = next(i for i, l in enumerate(tpl) if l.startswith("<script>document.addEventListener('click',function(e){var b=e.target.closest('.pm-burger')"))
nav = '\n'.join(tpl[i_nav:i_art])
foot = '\n'.join(tpl[i_foot:i_foot_end + 1])
tail = '\n'.join(tpl[i_burger:])
html = head + '\n' + meta + '\n' + css + '\n</head>\n' + nav + '\n' + body + share + '\n' + foot + '\n\n' + tail
out = os.path.join(R, 'juegos', 'calendario-esoterico.html')
open(out, 'w', encoding='utf8').write(html)
print('ok', out, len(html))
