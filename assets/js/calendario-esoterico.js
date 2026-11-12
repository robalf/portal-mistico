/* Calendario esotérico 2026-2027 · Portal Místico. Funciona en español e inglés según <html lang>.
   Los datos (/assets/data/calendario-esoterico.json) están calculados con astronomy-engine (UTC). */
(function () {
  'use strict';
  var LANG = (document.documentElement.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  var T = {
    es: {
      months: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
      days: ['lun','mar','mié','jue','vie','sáb','dom'], weekStart: 1,
      cats: { lunas: 'Lunas', eclipses: 'Eclipses', retro: 'Retrógrados', portales: 'Portales', cielo: 'Signos y estaciones', lluvias: 'Estrellas fugaces' },
      today: 'Hoy', prev: 'Mes anterior', next: 'Mes siguiente', download: 'Añadir a mi calendario (.ics)', allMonth: 'Eventos del mes', none: 'No hay eventos con estos filtros en este mes.',
      tz: 'Horas en tu zona horaria', loadErr: 'No se pudo cargar el calendario. Recarga la página.', approx: 'Fecha aproximada del pico.', at: 'a las',
      pastBadge: 'ya pasó', filters: 'Filtros', dayEv: 'Eventos del día', close: 'Cerrar', more: 'más', share: 'Copiar eventos del mes', copied: 'Copiado',
      signs: { aries:'Aries', tauro:'Tauro', geminis:'Géminis', cancer:'Cáncer', leo:'Leo', virgo:'Virgo', libra:'Libra', escorpio:'Escorpio', sagitario:'Sagitario', capricornio:'Capricornio', acuario:'Acuario', piscis:'Piscis' },
      theme: { aries:'iniciativa y valentía', tauro:'estabilidad y placer', geminis:'comunicación y curiosidad', cancer:'hogar y emociones', leo:'creatividad y expresión', virgo:'orden y salud cotidiana', libra:'relaciones y equilibrio', escorpio:'transformación e intensidad', sagitario:'expansión y búsqueda de sentido', capricornio:'metas y estructura', acuario:'ideas y comunidad', piscis:'intuición y sensibilidad' },
      bodies: { mercury:'Mercurio', venus:'Venus', mars:'Marte', jupiter:'Júpiter', saturn:'Saturno', uranus:'Urano', neptune:'Neptuno', pluto:'Plutón', sol:'Sol' },
      bodyTheme: { mercury:'la comunicación, los viajes y la tecnología', venus:'el amor, los valores y el dinero', mars:'la acción, la energía y las decisiones', jupiter:'la expansión, la suerte y el crecimiento', saturn:'las responsabilidades y las estructuras', uranus:'los cambios inesperados y la libertad', neptune:'la intuición, los sueños y la espiritualidad', pluto:'las transformaciones profundas' },
      nueva: function (s, t) { return ['Luna nueva en ' + s, 'Momento simbólico para fijar intenciones y empezar ciclos relacionados con ' + t + '.']; },
      llena: function (s, t, sup) { return [(sup ? 'Superluna llena en ' : 'Luna llena en ') + s, (sup ? 'La Luna llena más cercana a la Tierra: se ve algo más grande y brillante. ' : '') + 'Momento simbólico de culminación y de soltar lo que ya no suma, con ' + t + ' como tema.']; },
      cuartoC: function (s) { return ['Cuarto creciente en ' + s, 'Fase de acción: la tradición la asocia con superar obstáculos y dar pasos concretos.']; },
      cuartoM: function (s) { return ['Cuarto menguante en ' + s, 'Fase de revisión: la tradición la asocia con ajustar, cerrar y dejar ir.']; },
      eclSolar: { total: 'Eclipse solar total', annular: 'Eclipse solar anular', partial: 'Eclipse solar parcial', hybrid: 'Eclipse solar híbrido' },
      eclLunar: { total: 'Eclipse lunar total', partial: 'Eclipse lunar parcial', penumbral: 'Eclipse lunar penumbral' },
      eclTxt: 'Los eclipses se asocian simbólicamente con cierres y comienzos. La visibilidad depende del lugar.',
      eclPen: 'Es un eclipse sutil: la Luna solo se oscurece levemente y cuesta notarlo a simple vista. ',
      eclNote: { '2027-02-06': ' Se ve como anular en el sur de Sudamérica y el Atlántico, y como parcial en zonas de Sudamérica y África.', '2027-08-02': ' Su franja de totalidad cruza el sur de España, el norte de África y Oriente Medio: es uno de los eclipses más esperados del siglo.' },
      retroIni: function (b, s) { return [b + ' inicia su retrogradación en ' + s, 'Periodo en el que, según la astrología, conviene revisar y reorganizar asuntos de ' + this._bt(b) + '.']; },
      retroFin: function (b, s) { return [b + ' vuelve a ir directo en ' + s, 'Termina la retrogradación: la tradición dice que se reactivan los asuntos de ' + this._bt(b) + '.']; },
      ingSol: function (s, t) { return ['El Sol entra en ' + s, 'Comienza la temporada de ' + s + ': la atención se dirige a ' + t + '.']; },
      ingPl: function (b, s) { return [b + ' entra en ' + s, 'Cambio de signo de un planeta lento: marca un tono generacional distinto en ' + this._bt(b) + '.']; },
      estacion: { mar: ['Equinoccio de marzo', 'Día y noche duran lo mismo: inicio de la primavera en el hemisferio norte y del otoño en el sur. Simboliza equilibrio y renacimiento.'], jun: ['Solsticio de junio', 'El día más largo en el hemisferio norte (invierno en el sur): momento de plenitud de luz y energía.'], sep: ['Equinoccio de septiembre', 'Equilibrio entre luz y oscuridad: inicio del otoño en el hemisferio norte y de la primavera en el sur.'], dec: ['Solsticio de diciembre', 'La noche más larga en el hemisferio norte (verano en el sur): clásico momento de limpieza energética y de renovar propósitos.'] },
      portal: function (n, master) { if (master) return ['Fecha del número maestro 22 (22/11)', 'El 22 es un número maestro asociado a construir en lo concreto: un buen día para convertir ideas en planes.']; var x = { 1: 'Portal 1/1 · Año Nuevo', 11: 'Portal 11/11' }[n] || ('Portal ' + n + '/' + n); var tx = n === 1 ? 'Primer portal del año. En numerología 2027 es un año universal 11 (2+0+2+7): un año de intuición y de inspiración.' : n === 11 ? 'El portal más conocido: el 11 es un número maestro de intuición. Día simbólico para fijar intenciones.' : 'Fecha de número repetido: la numerología la considera un momento simbólico para fijar intenciones y reflexionar.'; return [x, tx]; },
      lluvia: function (id, zhr, moon) { var N = { taurids_s: 'Táuridas del Sur', taurids_n: 'Táuridas del Norte', leonids: 'Leónidas', geminids: 'Gemínidas', ursids: 'Úrsidas', quadrantids: 'Cuadrántidas', lyrids: 'Líridas', eta_aquariids: 'Eta Acuáridas', perseids: 'Perseidas', aurigids: 'Aurígidas', draconids: 'Dracónidas', orionids: 'Oriónidas' }; return ['Lluvia de estrellas: ' + N[id], 'Hasta unos ' + zhr + ' meteoros por hora en condiciones ideales. La Luna estará iluminada al ' + moon + '%' + (moon <= 30 ? ' (cielo oscuro: buena noche para verla).' : moon >= 70 ? ' (su luz opacará los meteoros más débiles).' : '.')]; },
      tradicion: { ano_nuevo: ['Año Nuevo', 'Fecha clásica para rituales de cierre de ciclo y propósitos del año que empieza.'], nochevieja: ['Nochevieja', 'Cierre simbólico del año: tradicionalmente se hacen balances, rituales de agradecimiento y de limpieza.'], imbolc: ['Imbolc', 'Fiesta de la tradición celta (hemisferio norte) que marca el despertar de la luz tras el invierno.'], beltane: ['Beltane', 'Fiesta celta de la fertilidad y la vida, a mitad de camino entre el equinoccio de primavera y el solsticio de verano.'], sanjuan: ['Noche de San Juan', 'Víspera del solsticio de verano, con tradiciones de fuego, agua y rituales de purificación.'], lughnasadh: ['Lughnasadh', 'Fiesta celta de la primera cosecha, momento simbólico de agradecer lo sembrado.'], samhain: ['Samhain · Halloween', 'Celebración celta de la víspera del año nuevo, ligada a los ancestros y a la frontera entre mundos.'], muertos: ['Día de Muertos', 'Tradición de honrar a los seres queridos fallecidos; sigue a Samhain y a Todos los Santos.'] }
    },
    en: {
      months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], weekStart: 0,
      cats: { lunas: 'Moons', eclipses: 'Eclipses', retro: 'Retrogrades', portales: 'Portals', cielo: 'Signs & seasons', lluvias: 'Meteor showers' },
      today: 'Today', prev: 'Previous month', next: 'Next month', download: 'Add to my calendar (.ics)', allMonth: 'Events this month', none: 'No events match these filters this month.',
      tz: 'Times shown in your time zone', loadErr: 'The calendar could not be loaded. Please reload the page.', approx: 'Approximate peak date.', at: 'at',
      pastBadge: 'past', filters: 'Filters', dayEv: 'Events of the day', close: 'Close', more: 'more', share: 'Copy this month’s events', copied: 'Copied',
      signs: { aries:'Aries', tauro:'Taurus', geminis:'Gemini', cancer:'Cancer', leo:'Leo', virgo:'Virgo', libra:'Libra', escorpio:'Scorpio', sagitario:'Sagittarius', capricornio:'Capricorn', acuario:'Aquarius', piscis:'Pisces' },
      theme: { aries:'initiative and courage', tauro:'stability and pleasure', geminis:'communication and curiosity', cancer:'home and emotions', leo:'creativity and self-expression', virgo:'order and everyday health', libra:'relationships and balance', escorpio:'transformation and intensity', sagitario:'expansion and the search for meaning', capricornio:'goals and structure', acuario:'ideas and community', piscis:'intuition and sensitivity' },
      bodies: { mercury:'Mercury', venus:'Venus', mars:'Mars', jupiter:'Jupiter', saturn:'Saturn', uranus:'Uranus', neptune:'Neptune', pluto:'Pluto', sol:'The Sun' },
      bodyTheme: { mercury:'communication, travel and technology', venus:'love, values and money', mars:'action, energy and decisions', jupiter:'expansion, luck and growth', saturn:'responsibilities and structures', uranus:'unexpected change and freedom', neptune:'intuition, dreams and spirituality', pluto:'deep transformation' },
      nueva: function (s, t) { return ['New Moon in ' + s, 'A symbolic moment to set intentions and begin cycles related to ' + t + '.']; },
      llena: function (s, t, sup) { return [(sup ? 'Full Supermoon in ' : 'Full Moon in ') + s, (sup ? 'The Full Moon closest to Earth: it looks slightly bigger and brighter. ' : '') + 'A symbolic moment of culmination and of letting go of what no longer serves you, with ' + t + ' as the theme.']; },
      cuartoC: function (s) { return ['First Quarter Moon in ' + s, 'Action phase: tradition links it with overcoming obstacles and taking concrete steps.']; },
      cuartoM: function (s) { return ['Last Quarter Moon in ' + s, 'Review phase: tradition links it with adjusting, closing and letting go.']; },
      eclSolar: { total: 'Total solar eclipse', annular: 'Annular solar eclipse', partial: 'Partial solar eclipse', hybrid: 'Hybrid solar eclipse' },
      eclLunar: { total: 'Total lunar eclipse', partial: 'Partial lunar eclipse', penumbral: 'Penumbral lunar eclipse' },
      eclTxt: 'Eclipses are symbolically linked to endings and beginnings. Visibility depends on your location.',
      eclPen: 'A subtle eclipse: the Moon only dims slightly and it is hard to notice with the naked eye. ',
      eclNote: { '2027-02-06': ' It appears as annular over southern South America and the Atlantic, and as partial across parts of South America and Africa.', '2027-08-02': ' Its path of totality crosses southern Spain, North Africa and the Middle East: one of the most anticipated eclipses of the century.' },
      retroIni: function (b, s) { return [b + ' stations retrograde in ' + s, 'A period when, according to astrology, it pays to review and reorganize matters of ' + this._bt(b) + '.']; },
      retroFin: function (b, s) { return [b + ' turns direct in ' + s, 'The retrograde ends: tradition says matters of ' + this._bt(b) + ' get moving again.']; },
      ingSol: function (s, t) { return ['The Sun enters ' + s, s + ' season begins: attention turns to ' + t + '.']; },
      ingPl: function (b, s) { return [b + ' enters ' + s, 'A slow planet changes sign, setting a different generational tone for ' + this._bt(b) + '.']; },
      estacion: { mar: ['March equinox', 'Day and night are equal: start of spring in the northern hemisphere and autumn in the south. Symbolizes balance and rebirth.'], jun: ['June solstice', 'The longest day in the northern hemisphere (winter in the south): a moment of peak light and energy.'], sep: ['September equinox', 'Balance between light and darkness: start of autumn in the northern hemisphere and spring in the south.'], dec: ['December solstice', 'The longest night in the northern hemisphere (summer in the south): a classic moment for energy cleansing and renewing intentions.'] },
      portal: function (n, master) { if (master) return ['Master number 22 date (11/22)', 'The 22 is a master number associated with building in the concrete world: a good day to turn ideas into plans.']; var x = { 1: 'Portal 1/1 · New Year', 11: 'Portal 11/11' }[n] || ('Portal ' + n + '/' + n); var tx = n === 1 ? 'The first portal of the year. In numerology, 2027 is a universal year 11 (2+0+2+7): a year of intuition and inspiration.' : n === 11 ? 'The best-known portal: 11 is a master number of intuition. A symbolic day to set intentions.' : 'A repeated-number date: numerology treats it as a symbolic moment to set intentions and reflect.'; return [x, tx]; },
      lluvia: function (id, zhr, moon) { var N = { taurids_s: 'Southern Taurids', taurids_n: 'Northern Taurids', leonids: 'Leonids', geminids: 'Geminids', ursids: 'Ursids', quadrantids: 'Quadrantids', lyrids: 'Lyrids', eta_aquariids: 'Eta Aquariids', perseids: 'Perseids', aurigids: 'Aurigids', draconids: 'Draconids', orionids: 'Orionids' }; return ['Meteor shower: ' + N[id], 'Up to about ' + zhr + ' meteors per hour in ideal conditions. The Moon will be ' + moon + '% illuminated' + (moon <= 30 ? ' (dark sky: a good night to watch).' : moon >= 70 ? ' (its light will wash out the fainter meteors).' : '.')]; },
      tradicion: { ano_nuevo: ['New Year', 'A classic date for closing-a-cycle rituals and resolutions for the year ahead.'], nochevieja: ['New Year’s Eve', 'The symbolic close of the year: traditionally a time for reflection, gratitude and cleansing rituals.'], imbolc: ['Imbolc', 'A Celtic festival (northern hemisphere) marking the return of the light after winter.'], beltane: ['Beltane', 'A Celtic festival of fertility and life, halfway between the spring equinox and the summer solstice.'], sanjuan: ['Midsummer Eve (St. John’s Eve)', 'The eve of the summer solstice, with traditions of fire, water and purification rituals.'], lughnasadh: ['Lughnasadh', 'A Celtic first-harvest festival, a symbolic time to give thanks for what you have sown.'], samhain: ['Samhain · Halloween', 'The Celtic eve of the new year, tied to the ancestors and the border between worlds.'], muertos: ['Day of the Dead', 'A tradition of honoring deceased loved ones; it follows Samhain and All Saints’ Day.'] }
    }
  };
  var L = T[LANG];
  var ICON = { luna_nueva: '🌑', luna_llena: '🌕', cuarto_creciente: '🌓', cuarto_menguante: '🌗', eclipse_solar: '🌞', eclipse_lunar: '🌘', retro_inicio: '↺', retro_fin: '↻', ingreso: '✦', estacion: '☀', portal: '✺', tradicion: '🕯', lluvia: '☄' };
  var CAT = { luna_nueva: 'lunas', luna_llena: 'lunas', cuarto_creciente: 'lunas', cuarto_menguante: 'lunas', eclipse_solar: 'eclipses', eclipse_lunar: 'eclipses', retro_inicio: 'retro', retro_fin: 'retro', ingreso: 'cielo', estacion: 'cielo', tradicion: 'cielo', portal: 'portales', lluvia: 'lluvias' };
  var MIN = new Date(2026, 10, 1), MAXY = 2027;
  var state = { y: 2026, m: 10, sel: null, on: { lunas: true, eclipses: true, retro: true, portales: true, cielo: true, lluvias: true } };
  var events = [];
  var $ = function (id) { return document.getElementById(id); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var dkey = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };

  function describe(e) {
    var r = [], s = e.sign ? L.signs[e.sign] : '', th = e.sign ? L.theme[e.sign] : '';
    var b = e.body ? L.bodies[e.body] : '';
    var ctx = { _bt: function (name) { var k = Object.keys(L.bodies).filter(function (x) { return L.bodies[x] === name; })[0]; return L.bodyTheme[k] || ''; } };
    switch (e.type) {
      case 'luna_nueva': r = L.nueva(s, th); break;
      case 'luna_llena': r = L.llena(s, th, e.super); break;
      case 'cuarto_creciente': r = L.cuartoC(s); break;
      case 'cuarto_menguante': r = L.cuartoM(s); break;
      case 'eclipse_solar': r = [(L.eclSolar[e.kind] || L.eclSolar.partial), L.eclTxt + (L.eclNote[e.t.slice(0, 10)] || '')]; break;
      case 'eclipse_lunar': r = [(L.eclLunar[e.kind] || L.eclLunar.partial), (e.kind === 'penumbral' ? L.eclPen : '') + L.eclTxt]; break;
      case 'retro_inicio': r = L.retroIni.call(ctx, b, s); break;
      case 'retro_fin': r = L.retroFin.call(ctx, b, s); break;
      case 'ingreso': r = e.body === 'sol' ? L.ingSol(s, th) : L.ingPl.call(ctx, b, s); break;
      case 'estacion': r = L.estacion[e.kind]; break;
      case 'portal': r = L.portal(e.n, e.master); break;
      case 'tradicion': r = L.tradicion[e.id]; break;
      case 'lluvia': r = L.lluvia(e.id, e.zhr, e.moon); if (e.approx) r[1] += ' ' + L.approx; break;
    }
    return { title: r[0], text: r[1], icon: ICON[e.type], cat: CAT[e.type] };
  }
  function prep(raw) {
    return raw.map(function (e) {
      var dt = e.t ? new Date(e.t.replace('Z', ':00Z')) : null;
      var date = dt || new Date(e.d + 'T00:00:00');
      var o = { raw: e, dt: dt, date: date, key: dkey(date), info: describe(e) };
      return o;
    });
  }
  function fmtTime(d) { try { return d.toLocaleTimeString(LANG === 'es' ? 'es' : 'en-US', { hour: '2-digit', minute: '2-digit' }); } catch (x) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); } }
  function fmtDate(d) { return LANG === 'es' ? d.getDate() + ' de ' + L.months[d.getMonth()] : L.months[d.getMonth()] + ' ' + d.getDate(); }
  function visible() { return events.filter(function (e) { return state.on[e.info.cat]; }); }
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }

  function renderChips() {
    var box = $('cal-months'); box.innerHTML = '';
    var y = 2026, m = 10;
    while (y < 2027 || m <= 11) {
      (function (yy, mm) {
        var b = el('button', 'cal-chip' + (yy === state.y && mm === state.m ? ' on' : ''), L.months[mm].slice(0, 3) + (mm === 0 || (yy === 2026 && mm === 10) ? ' ' + String(yy).slice(2) : ''));
        b.type = 'button'; b.setAttribute('aria-label', L.months[mm] + ' ' + yy);
        b.onclick = function () { state.y = yy; state.m = mm; state.sel = null; render(); };
        box.appendChild(b);
      })(y, m);
      m++; if (m > 11) { m = 0; y++; } if (y > 2027) break;
    }
  }
  function render() {
    renderChips();
    $('cal-title').textContent = L.months[state.m].charAt(0).toUpperCase() + L.months[state.m].slice(1) + ' ' + state.y;
    var idx = (state.y - 2026) * 12 + state.m - 10;
    $('cal-prev').disabled = idx <= 0; $('cal-next').disabled = idx >= 13;
    var first = new Date(state.y, state.m, 1), off = (first.getDay() - L.weekStart + 7) % 7, dim = new Date(state.y, state.m + 1, 0).getDate();
    var vis = visible(), by = {};
    vis.forEach(function (e) { (by[e.key] = by[e.key] || []).push(e); });
    var grid = $('cal-grid'); grid.innerHTML = '';
    for (var i = 0; i < 7; i++) grid.appendChild(el('div', 'cal-dow', L.days[i]));
    for (var k = 0; k < off; k++) grid.appendChild(el('div', 'cal-cell empty'));
    var todayKey = dkey(new Date());
    for (var d = 1; d <= dim; d++) (function (d) {
      var key = state.y + '-' + pad(state.m + 1) + '-' + pad(d), list = by[key] || [];
      var c = el('button', 'cal-cell' + (key === todayKey ? ' today' : '') + (key === state.sel ? ' sel' : '') + (list.length ? ' has' : ''));
      c.type = 'button'; c.setAttribute('aria-label', d + ' ' + L.months[state.m] + (list.length ? ': ' + list.map(function (e) { return e.info.title; }).join('; ') : ''));
      c.appendChild(el('span', 'cal-num', d));
      var ic = el('span', 'cal-ic');
      list.slice(0, 3).forEach(function (e) { var s = el('i', 'c-' + e.info.cat, e.info.icon); ic.appendChild(s); });
      if (list.length > 3) ic.appendChild(el('b', '', '+' + (list.length - 3)));
      c.appendChild(ic);
      c.onclick = function () { state.sel = key; render(); var p = $('cal-day'); if (p && p.scrollIntoView) p.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
      grid.appendChild(c);
    })(d);
    // detalle del día
    var dp = $('cal-day'); dp.innerHTML = '';
    if (state.sel && by[state.sel]) {
      var dd = new Date(state.sel + 'T00:00:00');
      dp.appendChild(el('h3', '', fmtDate(dd)));
      by[state.sel].forEach(function (e) { dp.appendChild(card(e)); });
      dp.hidden = false;
    } else dp.hidden = true;
    // lista del mes
    var ml = $('cal-list'); ml.innerHTML = '';
    var mon = vis.filter(function (e) { return e.date.getFullYear() === state.y && e.date.getMonth() === state.m; });
    $('cal-list-t').textContent = L.allMonth + ' · ' + L.months[state.m] + ' ' + state.y;
    if (!mon.length) ml.appendChild(el('p', 'cal-none', L.none));
    mon.forEach(function (e) { ml.appendChild(card(e, true)); });
  }
  function card(e, withDate) {
    var c = el('article', 'cal-ev c-' + e.info.cat);
    var h = el('div', 'cal-ev-h');
    h.appendChild(el('span', 'cal-ev-ic', e.info.icon));
    var tt = el('div', 'cal-ev-t');
    tt.appendChild(el('strong', '', e.info.title));
    var when = (withDate ? fmtDate(e.date) : '') + (e.dt && e.raw.type !== 'lluvia' ? (withDate ? ' · ' : '') + fmtTime(e.dt) : '');
    if (when) tt.appendChild(el('small', '', when));
    h.appendChild(tt); c.appendChild(h);
    c.appendChild(el('p', '', e.info.text));
    return c;
  }
  /* ICS */
  function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function utc(d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z'; }
  function ymd(d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); }
  function download() {
    var out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Portal Mistico//Calendario esoterico//' + LANG.toUpperCase(), 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:' + (LANG === 'es' ? 'Calendario esotérico · Portal Místico' : 'Esoteric calendar · Portal Místico')];
    visible().forEach(function (e, i) {
      out.push('BEGIN:VEVENT', 'UID:pm-' + i + '-' + (e.raw.t || e.raw.d) + '@elportalmistico.com', 'DTSTAMP:' + utc(new Date(2026, 10, 12)));
      if (e.dt && e.raw.type !== 'lluvia') { out.push('DTSTART:' + utc(e.dt), 'DTEND:' + utc(new Date(e.dt.getTime() + 3600000))); }
      else { var nx = new Date(e.date.getTime() + 86400000); out.push('DTSTART;VALUE=DATE:' + ymd(e.date), 'DTEND;VALUE=DATE:' + ymd(nx)); }
      out.push('SUMMARY:' + icsEsc(e.info.icon + ' ' + e.info.title), 'DESCRIPTION:' + icsEsc(e.info.text + ' — elportalmistico.com'), 'END:VEVENT');
    });
    out.push('END:VCALENDAR');
    var blob = new Blob([out.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = LANG === 'es' ? 'calendario-esoterico-portal-mistico.ics' : 'esoteric-calendar-portal-mistico.ics';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function copyMonth() {
    var mon = visible().filter(function (e) { return e.date.getFullYear() === state.y && e.date.getMonth() === state.m; });
    var txt = L.months[state.m].toUpperCase() + ' ' + state.y + '\n' + mon.map(function (e) { return '• ' + fmtDate(e.date) + ' — ' + e.info.icon + ' ' + e.info.title; }).join('\n') + '\n\n' + location.href.split('#')[0];
    var done = function () { var b = $('cal-copy'); var o = b.textContent; b.textContent = '✓ ' + L.copied; setTimeout(function () { b.textContent = o; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {}); else { var t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (x) {} t.remove(); }
  }
  function init() {
    var f = $('cal-filters'); f.innerHTML = '';
    Object.keys(L.cats).forEach(function (k) {
      var b = el('button', 'cal-f c-' + k + ' on', L.cats[k]); b.type = 'button'; b.setAttribute('aria-pressed', 'true');
      b.onclick = function () { state.on[k] = !state.on[k]; b.classList.toggle('on', state.on[k]); b.setAttribute('aria-pressed', String(state.on[k])); render(); };
      f.appendChild(b);
    });
    $('cal-prev').onclick = function () { state.m--; if (state.m < 0) { state.m = 11; state.y--; } state.sel = null; render(); };
    $('cal-next').onclick = function () { state.m++; if (state.m > 11) { state.m = 0; state.y++; } state.sel = null; render(); };
    $('cal-today').onclick = function () { var n = new Date(); if (n < MIN) n = MIN; if (n.getFullYear() > MAXY) n = new Date(2027, 11, 1); state.y = n.getFullYear(); state.m = n.getMonth(); state.sel = dkey(new Date()) === dkey(n) ? dkey(n) : null; render(); };
    $('cal-dl').onclick = download; $('cal-copy').onclick = copyMonth;
    $('cal-tz').textContent = L.tz + (function () { try { return ': ' + Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (x) { return ''; } })();
    var n = new Date(); if (n >= MIN && n.getFullYear() <= MAXY) { state.y = n.getFullYear(); state.m = n.getMonth(); }
    var h = location.hash.match(/^#(\d{4})-(\d{2})$/); if (h && +h[1] >= 2026 && +h[1] <= 2027) { state.y = +h[1]; state.m = +h[2] - 1; }
    fetch('/assets/data/calendario-esoterico.json?v=1').then(function (r) { return r.json(); }).then(function (j) { events = prep(j.events); render(); })
      .catch(function () { $('cal-list').appendChild(el('p', 'cal-none', L.loadErr)); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
