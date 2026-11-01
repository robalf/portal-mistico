/* Portal Místico — interpretación ampliada de la carta natal: aspectos por pareja de planetas y panorama general */
window.CartaExtra = (function () {
  var T = window.CartaTextos, C = window.CartaCalc;
  var P = {
    Sun:     { n: 'el Sol', area: 'tu identidad', v: 'quiere expresarse con autenticidad y brillar' },
    Moon:    { n: 'la Luna', area: 'tu mundo emocional', v: 'necesita seguridad y cuidado' },
    Mercury: { n: 'Mercurio', area: 'tu mente', v: 'quiere entender y comunicar' },
    Venus:   { n: 'Venus', area: 'tu manera de amar', v: 'busca armonía, afecto y placer' },
    Mars:    { n: 'Marte', area: 'tu energía', v: 'quiere actuar y conquistar' },
    Jupiter: { n: 'Júpiter', area: 'tu confianza', v: 'busca expandirse y creer' },
    Saturn:  { n: 'Saturno', area: 'tu disciplina', v: 'pide orden, límites y madurez' },
    Uranus:  { n: 'Urano', area: 'tu necesidad de libertad', v: 'exige cambio y originalidad' },
    Neptune: { n: 'Neptuno', area: 'tu intuición y tus sueños', v: 'sueña y se disuelve en lo ideal' },
    Pluto:   { n: 'Plutón', area: 'tu poder de transformación', v: 'busca transformar a fondo' },
    Node:    { n: 'el Nodo Norte', area: 'tu rumbo vital', v: 'señala hacia dónde creces' },
    Asc:     { n: 'el Ascendente', area: 'tu forma de presentarte', v: 'define la primera impresión que das' },
    MC:      { n: 'el Medio Cielo', area: 'tu vocación', v: 'apunta a tu meta pública' }
  };
  var ORD = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Node', 'Asc', 'MC'];
  // Pares clave con lectura propia: [fluido, tenso, conjunción]
  var ESP = {
    'Sun-Moon': ['Tu voluntad y tus emociones van de la mano: sabes lo que quieres y lo sientes coherente. Suele dar equilibrio interior y facilidad para sentirte "entero".', 'Lo que quieres y lo que necesitas pueden tirar en direcciones distintas, como si una parte de ti empujara y otra frenara. Aprender a escuchar a ambas te da una madurez emocional muy sólida.', 'Naciste en luna nueva: tu identidad y tus emociones están fundidas. Eres intenso y coherente, aunque te cuesta ver tus propias reacciones con distancia.'],
    'Sun-Mercury': ['Piensas con claridad y te expresas con autenticidad; comunicar es un talento natural.', 'A veces lo que piensas y lo que eres entran en pugna, y dudas de tus propias ideas.', 'Tu mente y tu identidad están muy unidas: lo que piensas eres tú, y defiendes tus ideas con convicción.'],
    'Sun-Venus': ['Tienes encanto natural y facilidad para atraer afecto y armonía. Disfrutas de la belleza y de las relaciones.', 'Quieres agradar y también ser tú mismo, y eso a veces cuesta. Tu reto es amar sin perderte.', 'Tu identidad está teñida de afecto y estética: eres cálido, atractivo y buscas el placer de vivir.'],
    'Sun-Mars': ['Tienes energía, iniciativa y valentía para ir por lo que quieres.', 'Mucha fuerza que a veces se vuelve impaciencia o confrontación. Canalizada en deporte o proyectos, es un gran motor.', 'Eres directo, competitivo y lleno de vitalidad. Tu reto es dosificar la intensidad.'],
    'Sun-Jupiter': ['Optimismo, generosidad y buena fortuna: la vida suele abrirte puertas cuando confías.', 'Tendencia a prometerte demasiado o a excederte. Con medida, tu entusiasmo es una gran fuerza.', 'Confianza y amplitud de miras: naces con un aire de suerte y generosidad.'],
    'Sun-Saturn': ['Responsabilidad, constancia y madurez: construyes cosas que duran y la gente confía en ti.', 'Una voz interior exigente que te hace dudar de tu valor. Con los años se convierte en autoridad propia y en logros sólidos.', 'Tu identidad está marcada por la seriedad y el deber; de joven pesa, de adulto da solidez.'],
    'Sun-Pluto': ['Gran fuerza interior y capacidad de renacer y reinventarte tras las crisis.', 'Luchas de poder y periodos de transformación intensa que te forjan con el tiempo.', 'Intensidad magnética: vives las cosas a fondo y tienes una fuerza de voluntad extraordinaria.'],
    'Moon-Venus': ['Ternura y facilidad para recibir y dar afecto; las relaciones tienden a ser cálidas.', 'Deseas afecto pero a veces te cuesta pedirlo o recibirlo con calma.', 'Dulzura emocional, gusto por lo bello y mucha necesidad de cariño.'],
    'Moon-Mars': ['Reaccionas con coraje y defiendes lo que sientes sin quedarte en el miedo.', 'Reacciones emocionales rápidas, a veces explosivas. Aprender a pausar te da mucho poder personal.', 'Sientes con fuerza y actúas con ella: emociones vivas, impulsivas y apasionadas.'],
    'Moon-Saturn': ['Estabilidad emocional y capacidad de sostener a otros sin desbordarte.', 'Te cuesta mostrar vulnerabilidad y a veces te sientes solo o poco merecedor de cuidado. Con trabajo interior, esa contención se vuelve fortaleza.', 'Seriedad emocional: aprendiste pronto a cuidarte solo. Tu reto es permitirte recibir ternura.'],
    'Moon-Pluto': ['Profundidad emocional y capacidad de sanar y renacer tras las pérdidas.', 'Emociones muy intensas y a veces posesivas; las crisis te transforman profundamente.', 'Mundo emocional intenso y magnético; no sientes a medias.'],
    'Moon-Jupiter': ['Generosidad emocional y optimismo: te recuperas rápido y contagias calidez.', 'Tendencia a exagerar emociones o a excederte para sentirte bien.', 'Gran corazón y fe natural en que todo saldrá bien.'],
    'Venus-Mars': ['Atracción y química natural: sabes seducir y conquistar con armonía entre deseo y afecto.', 'Deseo y afecto no siempre coinciden; relaciones apasionadas con altibajos que te enseñan a negociar.', 'Magnetismo y pasión: amor y deseo van muy unidos.'],
    'Venus-Saturn': ['Amor sólido, leal y duradero; valoras lo que se construye con tiempo.', 'Miedo al rechazo o sensación de no merecer amor; con madurez, relaciones profundas y comprometidas.', 'Seriedad en el amor: eliges con cuidado y te entregas con lealtad.'],
    'Venus-Jupiter': ['Suerte en el amor, generosidad y disfrute: tiendes a atraer abundancia y cariño.', 'Tendencia a excederte en placeres o a prometer más de lo que puedes cumplir.', 'Gran capacidad de disfrutar y de dar; la vida te sonríe con facilidad.'],
    'Mercury-Saturn': ['Pensamiento ordenado, serio y concienzudo; excelente para estudiar y planificar.', 'Dudas al hablar o exceso de autocrítica mental; con práctica, tu palabra gana peso y precisión.', 'Mente metódica y cautelosa, con gran capacidad de concentración.'],
    'Mercury-Mars': ['Mente ágil y expresión directa: argumentas con rapidez y claridad.', 'Palabras que a veces salen demasiado afiladas; el debate te estimula pero cuida el tono.', 'Pensamiento rápido y combativo, con gran poder de persuasión.'],
    'Mars-Saturn': ['Disciplina y resistencia: sabes sostener el esfuerzo hasta lograr lo que buscas.', 'Frustración entre el impulso y los frenos; cuando aprendes a planificar, se convierte en gran perseverancia.', 'Energía contenida y estratégica, con enorme capacidad de aguante.'],
    'Mars-Pluto': ['Fuerza de voluntad enorme y capacidad de regenerarte y lograr lo que te propones.', 'Intensidad que puede volverse choque de poder; bien dirigida, es energía de transformación.', 'Poder y determinación fuera de lo común.'],
    'Jupiter-Saturn': ['Equilibrio entre ambición y prudencia: creces de manera sólida.', 'Tensión entre expandirte y limitarte; vas a madurar en ritmos de avance y pausa.', 'Combinas fe y realismo: crecimiento con base.']
  };
  function pairKey(a, b) { return ORD.indexOf(a) <= ORD.indexOf(b) ? a + '-' + b : b + '-' + a; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function aspectText(as) {
    var tone = (as.type === 'conj') ? 2 : (T.ASPECTS[as.type].tone === 'fluido' ? 0 : 1);
    var k = pairKey(as.a, as.b), e = ESP[k], A = P[as.a], B = P[as.b], gen = '';
    if (as.a === 'Pluto' || as.a === 'Neptune' || as.a === 'Uranus' || as.b === 'Pluto' || as.b === 'Neptune' || as.b === 'Uranus') {
      var slow = ['Uranus', 'Neptune', 'Pluto'];
      if (slow.indexOf(as.a) >= 0 && slow.indexOf(as.b) >= 0) gen = ' Este aspecto lo comparte toda tu generación, por eso pesa menos a nivel personal.';
    }
    var qn = as.type === 'quincunx' ? 'Es un aspecto de ajuste constante: no se entienden de forma natural y te piden adaptarte. ' : '';
    if (e) return qn + e[tone] + gen;
    var an = cap(A.n), bn = B.n;
    if (as.type === 'quincunx') return an + ' y ' + bn + ' no comparten lenguaje: ' + A.area + ' ' + A.v + ', mientras ' + B.area + ' ' + B.v + '. Es un aspecto de ajuste constante, que te pide adaptarte y revisar el equilibrio entre ambas áreas con paciencia.' + gen;
    if (tone === 0) return an + ' y ' + bn + ' se llevan bien: mientras uno ' + A.v + ', el otro ' + B.v + ', y las dos cosas se refuerzan sin esfuerzo. Es un talento que conviene usar a propósito, porque lo fácil a veces pasa desapercibido.' + gen;
    if (tone === 1) return an + ' y ' + bn + ' tiran en sentidos distintos: ' + A.area + ' ' + A.v + ', y ' + B.area + ' ' + B.v + '. Esa fricción incomoda, pero es tu motor de crecimiento: la clave es darle espacio a ambas partes en lugar de elegir solo una.' + gen;
    return an + ' y ' + bn + ' actúan como una sola fuerza: ' + A.area + ' y ' + B.area + ' se funden, así que ' + A.v + ' y ' + B.v + ' a la vez. Es una energía concentrada, muy tuya y difícil de separar.' + gen;
  }
  var SLOW = { Uranus: 1, Neptune: 1, Pluto: 1 };
  function visibleAspects(ch, max) {
    var list = ch.aspects.filter(function (a) { return !(SLOW[a.a] && (SLOW[a.b] || a.b === 'Node')) && !(SLOW[a.b] && a.a === 'Node'); });
    return list.slice(0, max);
  }
  function pt(ch, k) { return ch.points.filter(function (p) { return p.key === k; })[0]; }
  function patterns(ch) {
    var out = [], pl = ch.points.filter(function (p) { return !p.angle && p.key !== 'Node'; });
    var bySign = {}, byHouse = {};
    pl.forEach(function (p) { var s = C.signOf(p.lon); (bySign[s] = bySign[s] || []).push(p); if (p.house) (byHouse[p.house] = byHouse[p.house] || []).push(p); });
    Object.keys(bySign).forEach(function (s) { var g = bySign[s]; if (g.length >= 3) out.push({ t: 'Stellium en ' + T.SIGNS[s].n, d: g.map(function (p) { return T.PLANETS[p.key].n; }).join(', ') + ' están juntos en ' + T.SIGNS[s].n + '. Esa concentración le da un tono muy marcado a tu carta: vives muchas cosas ' + T.SIGNS[s].style + ', y eso se vuelve un tema central de tu vida.' }); });
    Object.keys(byHouse).forEach(function (h) { var g = byHouse[h]; if (g.length >= 3) out.push({ t: 'Stellium en la casa ' + h, d: g.map(function (p) { return T.PLANETS[p.key].n; }).join(', ') + ' se reúnen en tu casa ' + h + ', así que ' + T.HOUSES[h - 1] + ' es un área de vida especialmente importante para ti.' }); });
    // trígono mayor y cuadratura en T
    var A = ch.aspects, find = function (x, y, ty) { return A.filter(function (a) { return a.type === ty && ((a.a === x && a.b === y) || (a.a === y && a.b === x)); })[0]; };
    var names = pl.map(function (p) { return p.key; }), seen = {};
    for (var i = 0; i < names.length; i++) for (var j = i + 1; j < names.length; j++) for (var k = j + 1; k < names.length; k++) {
      var x = names[i], y = names[j], z = names[k];
      if (find(x, y, 'trine') && find(y, z, 'trine') && find(x, z, 'trine')) {
        var key = [x, y, z].join(); if (!seen[key]) { seen[key] = 1; out.push({ t: 'Trígono mayor', d: T.PLANETS[x].n + ', ' + T.PLANETS[y].n + ' y ' + T.PLANETS[z].n + ' forman un triángulo armónico. Es un don de flujo y talento natural; el riesgo es acomodarte, así que conviene ponerlo al servicio de metas concretas.' }); }
      }
      [[x, y, z], [y, x, z], [z, x, y]].forEach(function (t) {
        // t[0] es el vértice: cuadratura a ambos y los otros dos en oposición
        if (find(t[0], t[1], 'square') && find(t[0], t[2], 'square') && find(t[1], t[2], 'opp')) {
          var kk = 'T' + [t[1], t[2]].sort().join() + t[0]; if (!seen[kk]) { seen[kk] = 1; out.push({ t: 'Cuadratura en T', d: T.PLANETS[t[1]].n + ' y ' + T.PLANETS[t[2]].n + ' se oponen y ambos están en tensión con ' + T.PLANETS[t[0]].n + '. Es un patrón de mucha energía y reto: ' + T.PLANETS[t[0]].n + ' es el punto donde se descarga la tensión y donde más puedes crecer.' }); }
        }
      });
    }
    return out;
  }
  function panorama(ch) {
    var items = [];
    var weight = {}, personal = { Sun: 1, Moon: 1, Mercury: 1, Venus: 1, Mars: 1 };
    ch.aspects.forEach(function (a) { var w = 1 + (a.orb < 2 ? 1 : 0); [a.a, a.b].forEach(function (k) { if (!T.PLANETS[k] || k === 'Node' || k === 'Asc' || k === 'MC') return; weight[k] = (weight[k] || 0) + w * (personal[k] ? 1.3 : 1); }); });
    var dom = Object.keys(weight).sort(function (x, y) { return weight[y] - weight[x]; })[0];
    if (dom) items.push(['Tu planeta más activo', T.PLANETS[dom].n + ' es el planeta que más aspectos tiene en tu carta, así que es una de las energías más visibles en tu vida: ' + T.PLANETS[dom].what + '.']);
    var asc = pt(ch, 'Asc');
    if (asc) {
      var si = C.signOf(asc.lon), rk = T.RULER[si], rp = pt(ch, rk);
      if (rp) items.push(['El regente de tu carta', 'Tu ascendente es ' + T.SIGNS[si].n + ', regido por ' + T.PLANETS[rk].n + ', que en tu carta está en ' + T.SIGNS[C.signOf(rp.lon)].n + (rp.house ? ' (casa ' + rp.house + ')' : '') + '. Esto indica hacia dónde se dirige tu energía vital: ' + (rp.house ? 'sobre todo hacia ' + T.HOUSES[rp.house - 1] + '.' : 'en el signo que ocupa.')]);
      var up = 0, east = 0, n = 0;
      ch.points.forEach(function (p) { if (p.angle || p.key === 'Node' || !p.house) return; n++; if (p.house >= 7) up++; if (p.house >= 10 || p.house <= 3) east++; });
      if (n >= 6) {
        if (up >= n * 0.7) items.push(['Hemisferio superior', 'La mayoría de tus planetas está sobre el horizonte: tu vida tiende a proyectarse hacia fuera, hacia lo público y lo social.']);
        else if (up <= n * 0.3) items.push(['Hemisferio inferior', 'La mayoría de tus planetas está bajo el horizonte: tienes una vida interior rica y tiendes a trabajar lo importante en privado.']);
        if (east >= n * 0.7) items.push(['Énfasis oriental', 'Muchos planetas están en el lado oriental: eres de los que toman la iniciativa y crean su propio destino.']);
        else if (east <= n * 0.3) items.push(['Énfasis occidental', 'Muchos planetas están en el lado occidental: tu vida se construye mucho a través de los demás, la cooperación y la adaptación.']);
      }
    }
    var retro = ch.points.filter(function (p) { return p.retro && p.key !== 'Node'; }).filter(function (p) { return ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].indexOf(p.key) >= 0; });
    if (retro.length >= 2) items.push(['Planetas retrógrados', 'Tienes ' + retro.length + ' planetas personales retrógrados (' + retro.map(function (p) { return T.PLANETS[p.key].n; }).join(', ') + '). Esas funciones las vives más hacia dentro y con ritmo propio, y suelen madurar con la edad.']);
    var sm = C.moonPhaseAngle(ch), ph = T.PHASES[Math.floor(((sm + 22.5) % 360) / 45)];
    items.push(['Relación Sol–Luna', 'Entre tu Sol y tu Luna hay ' + Math.round(sm) + '° (' + ph[0].toLowerCase() + '). ' + ph[2]]);
    return items;
  }
  return { aspectText: aspectText, visibleAspects: visibleAspects, patterns: patterns, panorama: panorama };
})();
