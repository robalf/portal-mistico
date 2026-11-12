/* Portal Místico · "Mi día": tu cielo, tu número, tu ritual y los próximos eventos en una sola página.
   Funciona en español e inglés según <html lang>. Reutiliza el motor de tránsitos de la carta astral
   (window.CartaCalc / CartaTextos / CartaUI) y los rituales de la Brújula Lunar (window.PM_RIT).
   Los datos de nacimiento se guardan solo en el dispositivo (localStorage). */
(function () {
  'use strict';
  /* Al navegar sin recargar, musica-global.js carga los scripts en paralelo: esperamos a que el motor esté listo. */
  function ready() { return document.getElementById('midia') && window.CartaCalc && window.CartaTextos && window.CartaUI && window.PM_RIT; }
  (function wait(n) { if (ready()) return main(); if (n < 200) setTimeout(function () { wait(n + 1); }, 50); })(0);
  function main() {
  var root = document.getElementById('midia');
  var C = window.CartaCalc, T = window.CartaTextos, U = window.CartaUI;
  var EN = (document.documentElement.lang || 'es').slice(0, 2) === 'en';
  var BASE = EN ? '/en/tools/' : '/juegos/';
  var SITE = 'https://elportalmistico.com';
  var KEY = 'pm-mi-dia';

  var S = EN ? {
    kicker: '✦ Your day, every day ✦', formT: 'Enter your birth date once', name: 'Your name (optional)', ph: 'E.g. Maria', date: 'Date of birth',
    go: '✨ See my day', priv: 'Your data stays only on this device, so tomorrow you will not have to type it again.', needDate: 'Please enter your date of birth.',
    hello: function (n) { return n ? 'Your day, ' + n : 'Your day today'; }, sunIn: 'Sun in ', your: 'your', energy: 'Energy', love: 'Love',
    idx: 'Symbolic index (1–10) calculated from today’s aspects to your natal planets.',
    tiers: { both: 'A day with the wind at your back: energy and affection flow. Use it for something you have been putting off.', en: 'Lots of energy today: a good day to act, start or finish something.', am: 'The heart is receptive today: a good day to talk about what you feel and care for your bonds.', low: 'A day to go gently: avoid impulsive decisions and protect your rest.', mid: 'A balanced day: keep your own rhythm and choose one important thing.' },
    skyH: 'What the sky activates in you today', noAsp: 'No exact aspects to your personal planets today: a quiet day to keep your own pace.', fav: 'Favorable', tense: 'Tension', intense: 'Intense',
    houses: 'To read your transits by house, calculate your full chart (with birth time and city) in the', houseLink: 'birth chart', moonH: 'The Moon today', moonIn: 'The Moon is in ', moonHouse: function (h, t) { return 'It crosses your house ' + h + ': today your mood centers on ' + t + '.'; }, illum: 'illuminated',
    numH: 'Your number and color of the day', pday: 'Personal day number', color: 'Color of the day', ruler: 'ruled by',
    numNote: 'Personal day = personal year + month + day, reduced to one digit (Pythagorean numerology). Colors follow the traditional planetary days.',
    ritH: 'Ritual of the day', mats: 'Materials', aff: 'Affirmation', ritMore: 'More about this moon in the Lunar Compass',
    todayH: 'Your readings today', todayNote: 'Each oracle can be used once a day: come back tomorrow for a new one.', done: 'done ✓', open: 'open',
    cdH: 'Countdown to what is coming', today: 'today', tomorrow: 'tomorrow', inDays: function (n) { return 'in ' + n + ' days'; }, cdMore: 'See the full esoteric calendar',
    streakOne: 'First day of your streak', streak: function (n) { return n + '-day streak'; }, best: 'best',
    share: '📤 Share my day', shareBusy: 'Preparing image…', shareTxt: 'My day on Portal Místico', change: '✎ Change my details', foot: 'Readings are symbolic and for entertainment and personal reflection. They do not replace professional advice.',
    cardTitle: 'MY DAY', cardLove: 'LOVE', cardEn: 'ENERGY', cardNum: 'NUMBER', cardMoon: 'MOON', cardUrl: 'elportalmistico.com/en/my-day',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    planDay: [['Sun', 'Gold and yellow'], ['Moon', 'Silver and white'], ['Mars', 'Red'], ['Mercury', 'Orange and light yellow'], ['Jupiter', 'Royal blue'], ['Venus', 'Green and pink'], ['Saturn', 'Indigo and black']],
    planName: { Sun: 'the Sun', Moon: 'the Moon', Mars: 'Mars', Mercury: 'Mercury', Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn' },
    nums: ['', 'New beginnings: take the initiative.', 'Cooperation and patience: listen and wait for the right moment.', 'Expression and joy: talk, create, share.', 'Order and work: build step by step.', 'Change and movement: stay flexible.', 'Home and care: love, family and balance.', 'Reflection: observe, study and trust your intuition.', 'Results and decisions: act with a clear head.', 'Closing cycles: forgive, let go, finish.'],
    phases: { nueva: 'New Moon', creciente: 'Waxing Crescent', cuartoCreciente: 'First Quarter', gibosaCreciente: 'Waxing Gibbous', llena: 'Full Moon', gibosaMenguante: 'Waning Gibbous', cuartoMenguante: 'Last Quarter', menguante: 'Waning Crescent' },
    tools: [['tarot-daily', 'daily-tarot-card.html', '🔮 Daily tarot card'], ['sn', 'yes-or-no-tarot.html', '🃏 Yes or no tarot'], ['runas', 'free-rune-reading.html', 'ᚠ Rune reading'], ['iching', 'free-i-ching-reading.html', '☯ I Ching']],
    cal: '/en/tools/esoteric-calendar.html', brujula: '/en/tools/moon-phase-today.html', carta: '/en/tools/free-birth-chart.html', ritualPage: '/en/tools/daily-moon-ritual.html',
    nextH: 'Continue your day', horo: function (n) { return 'Read today’s horoscope for ' + n; }, lucky: 'Your lucky numbers today', trans: 'All my transits', lunar: 'Moon phase today', pending: 'Still open today: ', allDone: 'You finished all your readings today ✓ Come back tomorrow for new ones.', seeTransits: 'See all my transits and the big ones of the year →', ritFull: 'See the full ritual, step by step →', lifeLink: 'Discover your life path number →',
    p: { horo: 'daily-horoscope.html', lucky: 'lucky-numbers-today.html', trans: 'daily-transits.html', lunar: 'moon-phase-today.html', life: 'life-path-number-calculator.html' },
    lang: 'en', loc: 'en-US'
  } : {
    kicker: '✦ Tu día, cada día ✦', formT: 'Escribe tu fecha de nacimiento una sola vez', name: 'Tu nombre (opcional)', ph: 'Ej.: María', date: 'Fecha de nacimiento',
    go: '✨ Ver mi día', priv: 'Tus datos se recuerdan solo en este dispositivo para que mañana no tengas que escribirlos.', needDate: 'Escribe tu fecha de nacimiento.',
    hello: function (n) { return n ? 'Tu día, ' + n : 'Tu día de hoy'; }, sunIn: 'Sol en ', your: 'tu', energy: 'Energía', love: 'Amor',
    idx: 'Índice simbólico (1–10) calculado con los aspectos de hoy a tus planetas natales.',
    tiers: { both: 'Día con el viento a favor: la energía y el afecto fluyen. Aprovecha para algo que has ido dejando.', en: 'Mucha energía hoy: buen día para actuar, empezar o terminar algo.', am: 'El corazón está receptivo hoy: buen día para hablar de lo que sientes y cuidar tus vínculos.', low: 'Día para ir con suavidad: evita decisiones impulsivas y protege tu descanso.', mid: 'Día equilibrado: sigue tu propio ritmo y elige una sola cosa importante.' },
    skyH: 'Lo que el cielo activa en ti hoy', noAsp: 'Hoy no hay aspectos exactos a tus planetas personales: un día tranquilo para seguir tu ritmo.', fav: 'Favorable', tense: 'Tensión', intense: 'Intenso',
    houses: 'Para leer tus tránsitos por casas, calcula tu carta completa (con hora y ciudad de nacimiento) en la', houseLink: 'carta astral', moonH: 'La Luna de hoy', moonIn: 'La Luna está en ', moonHouse: function (h, t) { return 'Recorre tu casa ' + h + ': hoy tu ánimo se centra en ' + t + '.'; }, illum: 'iluminada',
    numH: 'Tu número y tu color del día', pday: 'Número de día personal', color: 'Color del día', ruler: 'regido por',
    numNote: 'Día personal = año personal + mes + día, reducido a un dígito (numerología pitagórica). Los colores siguen los días planetarios de la tradición.',
    ritH: 'Ritual del día', mats: 'Materiales', aff: 'Afirmación', ritMore: 'Más sobre esta luna en la Brújula Lunar',
    todayH: 'Tus lecturas de hoy', todayNote: 'Cada oráculo se consulta una vez al día: vuelve mañana para una nueva.', done: 'hecho ✓', open: 'pendiente',
    cdH: 'Cuenta atrás de lo que viene', today: 'hoy', tomorrow: 'mañana', inDays: function (n) { return 'en ' + n + ' días'; }, cdMore: 'Ver el calendario esotérico completo',
    streakOne: 'Primer día de tu racha', streak: function (n) { return 'Racha de ' + n + ' días'; }, best: 'récord',
    share: '📤 Compartir mi día', shareBusy: 'Preparando imagen…', shareTxt: 'Mi día en Portal Místico', change: '✎ Cambiar mis datos', foot: 'Las lecturas son simbólicas y tienen fines de entretenimiento y reflexión personal. No sustituyen el consejo de un profesional.',
    cardTitle: 'MI DÍA', cardLove: 'AMOR', cardEn: 'ENERGÍA', cardNum: 'NÚMERO', cardMoon: 'LUNA', cardUrl: 'elportalmistico.com/mi-dia',
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    planDay: [['Sun', 'Dorado y amarillo'], ['Moon', 'Plateado y blanco'], ['Mars', 'Rojo'], ['Mercury', 'Naranja y amarillo claro'], ['Jupiter', 'Azul rey'], ['Venus', 'Verde y rosa'], ['Saturn', 'Índigo y negro']],
    planName: { Sun: 'el Sol', Moon: 'la Luna', Mars: 'Marte', Mercury: 'Mercurio', Jupiter: 'Júpiter', Venus: 'Venus', Saturn: 'Saturno' },
    nums: ['', 'Nuevos comienzos: toma la iniciativa.', 'Cooperación y paciencia: escucha y espera el momento justo.', 'Expresión y alegría: habla, crea, comparte.', 'Orden y trabajo: construye paso a paso.', 'Cambio y movimiento: mantente flexible.', 'Hogar y cuidado: amor, familia y equilibrio.', 'Reflexión: observa, estudia y confía en tu intuición.', 'Resultados y decisiones: actúa con la cabeza fría.', 'Cierre de ciclos: perdona, suelta, termina.'],
    phases: { nueva: 'Luna nueva', creciente: 'Luna creciente', cuartoCreciente: 'Cuarto creciente', gibosaCreciente: 'Gibosa creciente', llena: 'Luna llena', gibosaMenguante: 'Gibosa menguante', cuartoMenguante: 'Cuarto menguante', menguante: 'Luna menguante' },
    tools: [['tarot-daily', 'tarot-del-dia.html', '🔮 Tarot del día'], ['sn', 'tarot-si-o-no.html', '🃏 Tarot sí o no'], ['runas', 'runas.html', 'ᚠ Tirada de runas'], ['iching', 'i-ching.html', '☯ I Ching']],
    cal: '/juegos/calendario-esoterico.html', brujula: '/juegos/fase-lunar-hoy.html', carta: '/juegos/carta-astral.html', ritualPage: '/juegos/ritual-del-dia.html',
    nextH: 'Sigue con tu día', horo: function (n) { return 'Lee tu horóscopo de hoy: ' + n; }, lucky: 'Tus números de la suerte de hoy', trans: 'Todos mis tránsitos', lunar: 'Fase lunar de hoy', pending: 'Te falta hoy: ', allDone: 'Hoy completaste todas tus lecturas ✓ Vuelve mañana para nuevas.', seeTransits: 'Ver todos mis tránsitos y los grandes del año →', ritFull: 'Ver el ritual completo, paso a paso →', lifeLink: 'Descubre tu número de vida →',
    p: { horo: 'horoscopo-de-hoy.html', lucky: 'numeros-de-la-suerte-hoy.html', trans: 'transitos.html', lunar: 'fase-lunar-hoy.html', life: 'calcular-numero-de-vida.html' },
    lang: 'es', loc: 'es'
  };

  /* ---------- utilidades ---------- */
  function esc(s) { return U.esc(s); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoDay(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function pmDay() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); } /* mismo formato que los candados diarios */
  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function point(ch, k) { return ch.points.filter(function (p) { return p.key === k; })[0]; }
  function red(n) { while (n > 9) { var s = 0; String(n).split('').forEach(function (c) { s += +c; }); n = s; } return n; }

  /* ---------- luna (misma fórmula que la Brújula Lunar, para que el ritual coincida) ---------- */
  var CICLO = 29.530588853, REF = Date.UTC(2000, 0, 6, 18, 14);
  var FASES = [[0, 1.84, 'nueva', '🌑'], [1.84, 5.53, 'creciente', '🌒'], [5.53, 9.22, 'cuartoCreciente', '🌓'], [9.22, 12.91, 'gibosaCreciente', '🌔'], [12.91, 16.61, 'llena', '🌕'], [16.61, 20.30, 'gibosaMenguante', '🌖'], [20.30, 23.99, 'cuartoMenguante', '🌗'], [23.99, 27.68, 'menguante', '🌘'], [27.68, CICLO, 'nueva', '🌑']];
  function moonInfo(date) {
    var age = (((date.getTime() - REF) / 86400000) % CICLO + CICLO) % CICLO;
    var f = FASES.filter(function (x) { return age >= x[0] && age < x[1]; })[0] || FASES[0];
    return { key: f[2], icon: f[3], pct: Math.round((1 - Math.cos(2 * Math.PI * age / CICLO)) / 2 * 100) };
  }
  function ritualOf(date, key) {
    var R = window.PM_RIT; if (!R) return null;
    var list = R[key] || R.nueva;
    var doy = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 1)) / 86400000) + 1;
    return list[doy % list.length];
  }

  /* ---------- racha (la guarda musica-global.js en todas las páginas) ---------- */
  function streak() { var s = ls('pm-streak'); return s && s.n ? s : { n: 1, best: 1 }; }

  /* ---------- carta natal: completa si el usuario ya calculó la suya, si no solo con la fecha ---------- */
  function natalFor(me) {
    var d = me.date.split('-').map(Number);
    var full = ls('pmCarta');
    if (full && full.date === me.date && full.place && (full.time || full.unknown === false)) {
      try {
        var tt = (full.time || '12:00').split(':').map(Number);
        var ch = C.compute({ y: d[0], mo: d[1], d: d[2], h: tt[0], mi: tt[1], tz: full.place.tz, lat: full.place.lat, lon: full.place.lon, unknownTime: !full.time });
        if (full.time) return { chart: ch, houses: true };
      } catch (e) {}
    }
    var ch2 = C.compute({ y: d[0], mo: d[1], d: d[2], h: 12, mi: 0, tz: 'UTC', lat: 0, lon: 0, unknownTime: true });
    return { chart: ch2, houses: false };
  }

  /* ---------- eventos (calendario esotérico) ---------- */
  var SIGNKEYS = ['aries', 'tauro', 'geminis', 'cancer', 'leo', 'virgo', 'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'];
  var EV = EN ? {
    nueva: function (s) { return 'New Moon in ' + s; }, llena: function (s, sup) { return (sup ? 'Full Supermoon in ' : 'Full Moon in ') + s; },
    solar: { total: 'Total solar eclipse', annular: 'Annular solar eclipse', partial: 'Partial solar eclipse', hybrid: 'Hybrid solar eclipse' },
    lunar: { total: 'Total lunar eclipse', partial: 'Partial lunar eclipse', penumbral: 'Penumbral lunar eclipse' },
    rIni: function (b) { return b + ' stations retrograde'; }, rFin: function (b) { return b + ' turns direct'; },
    est: { mar: 'March equinox', jun: 'June solstice', sep: 'September equinox', dec: 'December solstice' },
    lluvia: { aurigids: 'Aurigids', draconids: 'Draconids', eta_aquariids: 'Eta Aquariids', geminids: 'Geminids', leonids: 'Leonids', lyrids: 'Lyrids', orionids: 'Orionids', perseids: 'Perseids', quadrantids: 'Quadrantids', taurids_n: 'Northern Taurids', taurids_s: 'Southern Taurids', ursids: 'Ursids' }, shower: ' meteor shower'
  } : {
    nueva: function (s) { return 'Luna nueva en ' + s; }, llena: function (s, sup) { return (sup ? 'Superluna llena en ' : 'Luna llena en ') + s; },
    solar: { total: 'Eclipse solar total', annular: 'Eclipse solar anular', partial: 'Eclipse solar parcial', hybrid: 'Eclipse solar híbrido' },
    lunar: { total: 'Eclipse lunar total', partial: 'Eclipse lunar parcial', penumbral: 'Eclipse lunar penumbral' },
    rIni: function (b) { return b + ' inicia su retrogradación'; }, rFin: function (b) { return b + ' vuelve a ir directo'; },
    est: { mar: 'Equinoccio de marzo', jun: 'Solsticio de junio', sep: 'Equinoccio de septiembre', dec: 'Solsticio de diciembre' },
    lluvia: { aurigids: 'Aurígidas', draconids: 'Dracónidas', eta_aquariids: 'Eta Acuáridas', geminids: 'Gemínidas', leonids: 'Leónidas', lyrids: 'Líridas', orionids: 'Oriónidas', perseids: 'Perseidas', quadrantids: 'Cuadrántidas', taurids_n: 'Táuridas del Norte', taurids_s: 'Táuridas del Sur', ursids: 'Úrsidas' }, shower: ': lluvia de estrellas'
  };
  var KINDS = { nueva: 'luna_nueva', llena: 'luna_llena', ecl: 'eclipse', retro: 'retro', est: 'estacion', lluvia: 'lluvia' };
  function evTitle(e) {
    var sg = e.sign ? T.SIGNS[SIGNKEYS.indexOf(e.sign)].n : '';
    var bd = e.body && e.body !== 'sol' ? (T.PLANETS[cap(e.body)] || {}).n || cap(e.body) : '';
    switch (e.type) {
      case 'luna_nueva': return [EV.nueva(sg), '🌑'];
      case 'luna_llena': return [EV.llena(sg, e.super), '🌕'];
      case 'eclipse_solar': return [EV.solar[e.kind] || EV.solar.partial, '🌞'];
      case 'eclipse_lunar': return [EV.lunar[e.kind] || EV.lunar.partial, '🌘'];
      case 'retro_inicio': return [EV.rIni(bd), '↺'];
      case 'retro_fin': return [EV.rFin(bd), '↻'];
      case 'estacion': return [EV.est[e.kind] || '', '☀'];
      case 'lluvia': return [(EV.lluvia[e.id] || '') + EV.shower, '☄'];
    }
    return null;
  }
  function pickEvents(list, now) {
    var today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var items = [];
    list.forEach(function (e) {
      var dt = e.t ? new Date(e.t.replace('Z', ':00Z')) : new Date(e.d + 'T12:00:00');
      var day0 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
      var left = Math.round((day0 - today0) / 86400000);
      if (left < 0) return;
      var ti = evTitle(e); if (!ti || !ti[0]) return;
      items.push({ e: e, dt: dt, left: left, title: ti[0], icon: ti[1], group: e.type.replace(/^eclipse_.*/, 'eclipse').replace(/^retro_.*/, 'retro') });
    });
    items.sort(function (a, b) { return a.dt - b.dt; });
    var seen = {}, out = [];
    items.forEach(function (it) { if (!seen[it.group]) { seen[it.group] = 1; out.push(it); } });
    return out.slice(0, 6);
  }
  function whenText(n) { return n === 0 ? S.today : (n === 1 ? S.tomorrow : S.inDays(n)); }

  /* ---------- cálculo del día ---------- */
  function compute(me) {
    var now = new Date(), nat = natalFor(me), natal = nat.chart;
    var tr = C.computeAt(now, 0, 0, false);
    var tp = tr.points.filter(function (p) { return p.key !== 'Node'; });
    var nkeys = nat.houses ? ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Asc', 'MC'] : ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    var np = natal.points.filter(function (p) { return nkeys.indexOf(p.key) > -1; });
    var ORB = { Moon: 3, Sun: 1.5, Mercury: 1.5, Venus: 1.5, Mars: 1.5, Jupiter: 1.2, Saturn: 1.2, Uranus: 1, Neptune: 1, Pluto: 1 };
    var cross = C.crossAspects(tp, np, function (p) { return ORB[p.key]; });
    var order = ['Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    cross.sort(function (x, y) { return order.indexOf(x.a) - order.indexOf(y.a) || x.orb - y.orb; });
    var en = 5, am = 5;
    cross.forEach(function (x) {
      var v = (x.type === 'trine' || x.type === 'sextile') ? 1 : (x.type === 'conj' ? 0.5 : -1);
      if (x.a === 'Mars' || x.a === 'Sun' || x.b === 'Mars' || x.b === 'Sun') en += v;
      if (x.a === 'Venus' || x.a === 'Moon' || x.b === 'Venus' || x.b === 'Moon') am += v;
    });
    en = Math.max(1, Math.min(10, Math.round(en))); am = Math.max(1, Math.min(10, Math.round(am)));
    var moon = point(tr, 'Moon'), mi = moonInfo(now);
    var d = me.date.split('-').map(Number);
    var py = red(red(d[2]) + red(d[1]) + red(now.getFullYear()));
    var pm = red(py + red(now.getMonth() + 1));
    var pd = red(pm + red(now.getDate()));
    var dow = now.getDay();
    return { now: now, natal: natal, houses: nat.houses, cross: cross, en: en, am: am, moon: moon, mi: mi, pd: pd, dow: dow, sun: point(natal, 'Sun') };
  }

  /* ---------- pintado ---------- */
  function tierText(r) {
    if (r.en >= 7 && r.am >= 7) return S.tiers.both;
    if (r.en <= 3 || r.am <= 3) return S.tiers.low;
    if (r.en >= 7) return S.tiers.en;
    if (r.am >= 7) return S.tiers.am;
    return S.tiers.mid;
  }
  function dateLabel(d) { return cap(new Intl.DateTimeFormat(S.loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)); }

  /* Siguiente paso: la lectura que falta hoy y accesos a las páginas completas */
  function toolsState() {
    var day = pmDay();
    return S.tools.map(function (t) { var v = ls('pm-daily-' + t[0]); return { t: t, ok: !!(v && v.day === day) }; });
  }
  function nextBlock(r) {
    var st = toolsState(), pend = st.filter(function (x) { return !x.ok; })[0];
    var si = C.signOf(r.sun.lon), sn = T.SIGNS[si].n;
    var b = ['<h3 class="ca-h">' + S.nextH + '</h3>'];
    if (pend) b.push('<a class="md-feat" href="' + BASE + pend.t[1] + '"><span>' + S.pending + '</span><b>' + esc(pend.t[2]) + ' →</b></a>');
    else b.push('<p class="md-all">' + S.allDone + '</p>');
    b.push('<div class="md-links"><a href="' + BASE + S.p.horo + '">' + U.sg(si) + ' ' + esc(S.horo(sn)) + '</a><a href="' + BASE + S.p.lucky + '">🍀 ' + S.lucky + '</a><a href="' + BASE + S.p.trans + '">🪐 ' + S.trans + '</a><a href="' + BASE + S.p.lunar + '">🌙 ' + S.lunar + '</a></div>');
    return b.join('');
  }

  function html(me, r, events) {
    var h = [], st = streak();
    var sunSign = U.signName(r.sun.lon);
    var pill = st.n > 1 ? '🔥 ' + S.streak(st.n) + (st.best > st.n ? ' · ' + S.best + ' ' + st.best : '') : '🔥 ' + S.streakOne;
    h.push('<div class="ca-head"><div class="ca-kick">' + esc(dateLabel(r.now)) + '</div><h2>' + esc(S.hello(me.name)) + '</h2><p>' + S.sunIn + esc(sunSign) + '</p><p><span class="md-pill">' + esc(pill) + '</span></p></div>');
    h.push('<div class="ca-two"><div class="ca-mini"><span>' + S.energy + '</span><b style="color:#E8794A">' + r.en + '/10</b></div><div class="ca-mini"><span>' + S.love + '</span><b style="color:#E9D27A">' + r.am + '/10</b></div></div>');
    h.push('<p class="md-sum">' + esc(tierText(r)) + '</p><p class="ca-note" style="text-align:center">' + S.idx + '</p>');

    h.push(nextBlock(r));

    /* cielo */
    h.push('<h3 class="ca-h">' + S.skyH + '</h3>');
    if (!r.cross.length) h.push('<p>' + S.noAsp + '</p>');
    else {
      h.push('<div class="ca-list">');
      r.cross.slice(0, 2).forEach(function (x) {
        var tone = (x.type === 'trine' || x.type === 'sextile') ? ['fluido', S.fav] : (x.type === 'conj' ? ['intenso', S.intense] : ['tenso', S.tense]);
        var txt = cap(T.TR_ENERGY[x.a]) + ' ' + T.TR_TONE[x.type].replace('{n}', T.POSS[x.b]);
        h.push('<div class="ca-item ca-' + tone[0] + '"><div class="ca-item-t"><span class="ca-g">' + U.pg(x.a) + '</span> ' + esc(T.PLANETS[x.a].n) + ' ' + esc(T.ASPECTS[x.type].n.toLowerCase()) + ' ' + S.your + ' <span class="ca-g">' + U.pg(x.b) + '</span> ' + esc(T.PLANETS[x.b].n) + ' <span class="ca-tag">' + tone[1] + '</span></div><p>' + esc(txt) + '</p></div>');
      });
      h.push('</div>');
    }
    h.push('<p class="ca-note"><a href="' + BASE + S.p.trans + '">' + S.seeTransits + '</a></p>');
    if (!r.houses) h.push('<p class="ca-note">' + S.houses + ' <a href="' + S.carta + '">' + S.houseLink + '</a>.</p>');

    /* luna */
    var msg = S.moonIn + U.signName(r.moon.lon) + '.';
    if (r.houses) { var hn = C.houseOf(r.moon.lon, r.natal.houses.cusps); msg += ' ' + S.moonHouse(hn, T.HOUSES[hn - 1]); }
    h.push('<h3 class="ca-h">' + S.moonH + '</h3><div class="ca-list"><div class="ca-item"><div class="ca-item-t"><span class="md-moon">' + r.mi.icon + '</span> ' + esc(S.phases[r.mi.key]) + ' · ' + r.mi.pct + '% ' + S.illum + '</div><p>' + esc(msg) + '</p><p><a href="' + BASE + S.p.lunar + '">' + S.lunar + ' →</a></p></div></div>');

    /* número y color */
    var pl = S.planDay[r.dow];
    h.push('<h3 class="ca-h">' + S.numH + '</h3><div class="md-two"><div class="md-box"><span>' + S.pday + '</span><b>' + r.pd + '</b><p>' + esc(S.nums[r.pd]) + '</p></div><div class="md-box"><span>' + S.color + '</span><b class="md-col">' + esc(pl[1]) + '</b><p>' + esc(cap(S.dayNames[r.dow])) + ' · ' + S.ruler + ' ' + esc(S.planName[pl[0]]) + '</p></div></div><p class="ca-note">' + S.numNote + ' <a href="' + BASE + S.p.life + '">' + S.lifeLink + '</a></p>');

    /* ritual */
    var rit = ritualOf(r.now, r.mi.key);
    if (rit) h.push('<h3 class="ca-h">' + S.ritH + '</h3><div class="ca-list"><div class="ca-item"><div class="ca-item-t">🕯️ ' + esc(rit.titulo) + '</div><p><em>' + esc(rit.intencion) + '</em></p><p>“' + esc(rit.afirmacion) + '”</p><p><a href="' + S.ritualPage + '">' + S.ritFull + '</a></p></div></div>');

    /* lecturas de hoy */
    var day = pmDay();
    h.push('<h3 class="ca-h">' + S.todayH + '</h3><ul class="md-tools">' + S.tools.map(function (t) {
      var k = t[0] === 'tarot-daily' ? 'pm-daily-tarot-daily' : 'pm-daily-' + t[0], v = ls(k), ok = v && v.day === day;
      return '<li class="' + (ok ? 'md-ok' : '') + '"><a href="' + BASE + t[1] + '">' + esc(t[2]) + '</a><span>' + (ok ? S.done : S.open) + '</span></li>';
    }).join('') + '</ul><p class="ca-note">' + S.todayNote + '</p>');

    /* cuenta atrás */
    if (events.length) h.push('<h3 class="ca-h">' + S.cdH + '</h3><ul class="md-cd">' + events.map(function (it) {
      var m = it.dt.getFullYear() + '-' + pad(it.dt.getMonth() + 1);
      return '<li><a href="' + S.cal + '#' + m + '"><span class="md-ic">' + it.icon + '</span><span class="md-tt">' + esc(it.title) + '</span><span class="md-n">' + esc(whenText(it.left)) + '</span></a></li>';
    }).join('') + '</ul><p class="ca-note"><a href="' + S.cal + '">' + S.cdMore + ' →</a></p>');

    h.push('<div class="md-actions"><button type="button" class="ca-btn" id="mdShare">' + S.share + '</button><button type="button" class="ca-btn2" id="mdChange">' + S.change + '</button></div><p class="ca-noteb">' + S.foot + '</p>');
    return h.join('');
  }

  /* ---------- tarjeta para compartir ---------- */
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function wrap(ctx, text, x, y, maxW, lh, maxLines) {
    var words = text.split(' '), line = '', n = 0;
    for (var i = 0; i < words.length; i++) {
      var t = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = words[i]; if (++n >= maxLines) return y; } else line = t;
    }
    ctx.fillText(line, x, y); return y + lh;
  }
  function makeCard(me, r) {
    var W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var x = cv.getContext('2d'), SERIF = '"Fraunces",Georgia,serif', SANS = '"Work Sans",Arial,sans-serif';
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#12123A'); g.addColorStop(1, '#05060F'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 90; i++) { x.fillStyle = 'rgba(241,213,138,' + (0.15 + ((i * 37) % 10) / 20).toFixed(2) + ')'; x.beginPath(); x.arc((i * 331) % W, (i * 577) % (H - 120), 1 + (i % 3) * 0.7, 0, 7); x.fill(); }
    x.strokeStyle = 'rgba(199,162,75,.6)'; x.lineWidth = 3; rr(x, 40, 40, W - 80, H - 80, 36); x.stroke();
    x.textAlign = 'center'; x.fillStyle = '#C7A24B'; x.font = '600 34px ' + SANS; x.fillText('✦  PORTAL MÍSTICO  ✦', W / 2, 130);
    x.fillStyle = '#F4EFE3'; x.font = '600 96px ' + SERIF; x.fillText(S.cardTitle, W / 2, 260);
    x.fillStyle = '#9098C4'; x.font = '400 36px ' + SANS; x.fillText(dateLabel(r.now) + (me.name ? ' · ' + me.name : ''), W / 2, 325);
    x.font = '170px "Noto Color Emoji",sans-serif'; x.fillStyle = '#fff'; x.fillText(r.mi.icon, W / 2, 530);
    x.fillStyle = '#F1D58A'; x.font = '600 40px ' + SANS; x.fillText(S.phases[r.mi.key] + ' · ' + U.signName(r.moon.lon), W / 2, 600);
    var bx = [[S.cardEn, r.en + '/10', '#E8794A'], [S.cardLove, r.am + '/10', '#E9D27A'], [S.cardNum, String(r.pd), '#C9B8FF']];
    bx.forEach(function (b, k) {
      var bw = 280, bxl = 80 + k * (bw + 40); x.fillStyle = 'rgba(255,255,255,.06)'; rr(x, bxl, 670, bw, 230, 28); x.fill();
      x.fillStyle = '#9098C4'; x.font = '600 28px ' + SANS; x.fillText(b[0], bxl + bw / 2, 725);
      x.fillStyle = b[2]; x.font = '600 84px ' + SERIF; x.fillText(b[1], bxl + bw / 2, 835);
    });
    x.fillStyle = '#F4EFE3'; x.font = '400 40px ' + SANS; x.textAlign = 'center';
    wrap(x, tierText(r), W / 2, 990, 860, 56, 4);
    x.fillStyle = '#C7A24B'; x.font = '600 36px ' + SANS; x.fillText(S.cardUrl, W / 2, H - 120);
    x.fillStyle = '#9098C4'; x.font = '400 26px ' + SANS; x.fillText(S.cardTitle === 'MI DÍA' ? 'Calcula el tuyo gratis' : 'Get yours for free', W / 2, H - 76);
    return cv;
  }
  function shareCard(me, r, btn) {
    var label = btn.textContent; btn.textContent = S.shareBusy; btn.disabled = true;
    function done() { btn.textContent = label; btn.disabled = false; }
    var go = function () {
      var cv; try { cv = makeCard(me, r); } catch (e) { return done(); }
      cv.toBlob(function (blob) {
        if (!blob) return done();
        var file; try { file = new File([blob], 'mi-dia.png', { type: 'image/png' }); } catch (e) { file = null; }
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: S.shareTxt, text: S.shareTxt + ' ' + SITE + (EN ? '/en/my-day' : '/mi-dia') }).catch(function () {}).then(done);
        } else {
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mi-dia.png'; document.body.appendChild(a); a.click(); a.remove(); done();
        }
        if (window.gtag) try { gtag('event', 'mi_dia_compartir'); } catch (e) {}
      }, 'image/png');
    };
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('600 40px Fraunces'), document.fonts.load('600 30px "Work Sans"')]).then(go, go); else go();
  }

  /* ---------- arranque ---------- */
  var out = document.getElementById('mdOut'), setup = document.getElementById('mdSetup');
  var cachedEvents = null;
  function loadEvents(cb) {
    if (cachedEvents) return cb(cachedEvents);
    fetch('/assets/data/calendario-esoterico.json').then(function (r) { return r.json(); }).then(function (d) { cachedEvents = d.events || []; cb(cachedEvents); }).catch(function () { cb([]); });
  }
  function show(me) {
    var r;
    try { r = compute(me); } catch (e) { setup.hidden = false; out.hidden = true; document.getElementById('mdErr').textContent = S.needDate; return; }
    setup.hidden = true; out.hidden = false;
    ls('pm-sign', { i: C.signOf(r.sun.lon) }); /* los horóscopos del portal abren con tu signo */
    function paint(list) {
      out.innerHTML = html(me, r, pickEvents(list, r.now));
      document.getElementById('mdShare').addEventListener('click', function () { shareCard(me, r, this); });
      document.getElementById('mdChange').addEventListener('click', function () { out.hidden = true; setup.hidden = false; window.scrollTo(0, 0); });
    }
    loadEvents(paint);
    if (window.gtag) try { gtag('event', 'mi_dia_visto'); } catch (e) {}
  }
  function init() {
    var saved = ls(KEY), carta = ls('pmCarta');
    var form = document.getElementById('mdForm');
    var nameI = document.getElementById('mdName'), dateI = document.getElementById('mdDate');
    var me = saved && saved.date ? saved : (carta && carta.date ? { name: carta.name || '', date: carta.date } : null);
    if (me) { nameI.value = me.name || ''; dateI.value = me.date; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var date = dateI.value;
      if (!date || date.split('-').length !== 3) { document.getElementById('mdErr').textContent = S.needDate; return; }
      document.getElementById('mdErr').textContent = '';
      var m = { name: nameI.value.trim(), date: date };
      ls(KEY, m); show(m);
    });
    if (saved && saved.date) show(saved);
  }
  init();
  }
})();
