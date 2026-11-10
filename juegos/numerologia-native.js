// Calculadoras de numerología (versión nativa, sin iframe). Misma lógica que la app original.
import { RICH, PIN, CHAL, MES, SOUL, PERS, KEY, FOCO_DIA, FOCO_TXT, afinidad } from './numerologia-game/numerologia-extra.js?v=1';
function fail(form, message) { form.querySelector('.pc-err').textContent = message; form.querySelector('.pc-result').innerHTML = ''; }
function show(form, html, kind) { form.querySelector('.pc-err').textContent = ''; const out = form.querySelector('.pc-result'); out.innerHTML = '<div class="pc-res">' + html + '</div>'; out.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); if (window.gtag) window.gtag('event', 'reading_complete', { kind: kind + '_native' }); }
function orbit(number, kicker, cls = '') { return `<div class="pc-orbit"><div><div class="pc-kicker">${kicker}</div><div class="pc-num ${cls ? 'pc-pct' : ''}">${number}</div></div></div>`; }
const meanings = {
  1: { title: 'La chispa iniciadora', text: 'Tu energía abre caminos. Hay independencia, creatividad y valor para convertir una intuición en un comienzo concreto. Tu mejor brújula es actuar con confianza sin aislarte.' },
  2: { title: 'El puente sensible', text: 'Percibes matices que otras personas pasan por alto. Cooperación, tacto y escucha son tus fortalezas; al cuidar tus límites, tu sensibilidad se vuelve una guía poderosa.' },
  3: { title: 'La voz luminosa', text: 'La expresión, el humor y la imaginación dan color a tu camino. Tu presencia inspira cuando compartes lo que sientes con sencillez y das una forma constante a tus ideas.' },
  4: { title: 'La raíz constructora', text: 'Tienes talento para ordenar, sostener y crear bases duraderas. La paciencia te favorece; dejar un pequeño espacio para lo inesperado convierte la disciplina en libertad.' },
  5: { title: 'El viento del cambio', text: 'La curiosidad y la adaptabilidad alimentan tu crecimiento. Aprendes viviendo, moviéndote y probando; elegir una intención clara ayuda a que tu energía no se disperse.' },
  6: { title: 'El corazón armonizador', text: 'Cuidado, belleza y responsabilidad forman tu lenguaje natural. Creas refugio para quienes amas, y floreces aún más cuando te incluyes en la atención que ofreces.' },
  7: { title: 'La mirada profunda', text: 'Buscas comprender lo invisible detrás de lo cotidiano. Intuición, análisis y vida interior son tus dones; compartir tus hallazgos permite que la sabiduría también conecte.' },
  8: { title: 'El poder consciente', text: 'Posees visión práctica y capacidad para materializar. Lideras mejor cuando éxito y propósito caminan juntos, usando tu firmeza para construir abundancia compartida.' },
  9: { title: 'El alma generosa', text: 'Compasión, amplitud y vocación de servicio marcan tu vibración. Sabes cerrar ciclos con aprendizaje; cuidar tu energía vuelve tu entrega más serena y fértil.' },
  11: { title: 'La antena inspiradora', text: 'Tu intuición es intensa y capta posibilidades antes de que sean evidentes. Estás aquí para inspirar desde la autenticidad; el descanso y la rutina suave ayudan a enraizar tu visión.' },
  22: { title: 'La gran constructora', text: 'Combinas una visión amplia con capacidad para hacerla realidad. Tus proyectos pueden beneficiar a muchas personas cuando avanzas por etapas y confías también en el equipo.' },
  33: { title: 'El corazón maestro', text: 'Tu vibración reúne empatía, creatividad y vocación de acompañar. Tu influencia crece cuando enseñas con el ejemplo y recuerdas que servir no significa exigirte perfección.' }
};

const yearMeanings = {
  1: ['Año de comienzos', '__Y__ abre una puerta para elegir rumbo, iniciar proyectos y renovar tu identidad. Da el primer paso aunque el mapa aún no esté completo.'],
  2: ['Año de vínculos', 'La paciencia y la cooperación serán tus aliadas. Nutre alianzas, escucha tu intuición y permite que los procesos maduren a su propio ritmo.'],
  3: ['Año de expresión', 'Tu creatividad pide espacio. Comunica, aprende, celebra y deja que una idea alegre encuentre su público sin buscar una perfección imposible.'],
  4: ['Año de cimientos', 'Es tiempo de ordenar prioridades y construir con constancia. Cada hábito pequeño puede convertirse en una estructura que te sostenga por mucho tiempo.'],
  5: ['Año de movimiento', 'Cambios, descubrimientos y nuevas experiencias amplían tu horizonte. Sé flexible, pero conserva una intención central para elegir con claridad.'],
  6: ['Año del corazón', 'Hogar, afectos y compromisos significativos toman protagonismo. La armonía nace al cuidar tus relaciones sin olvidar tus propias necesidades.'],
  7: ['Año de sabiduría', 'Una pausa consciente revela respuestas profundas. Estudiar, observar y escuchar tu mundo interior preparará decisiones más alineadas.'],
  8: ['Año de cosecha', 'Tu capacidad de liderar y materializar se fortalece. Ordena recursos, reconoce tu valor y busca resultados que también aporten bienestar.'],
  9: ['Año de liberación', 'Un ciclo llega a su síntesis. Agradece lo aprendido, suelta lo que perdió sentido y crea espacio emocional para la próxima etapa.']
};

const zodiac = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];
function reduce(value, masters = true) {
  let n = Math.abs(Number(value)) || 0;
  while (n > 9 && !(masters && [11, 22, 33].includes(n))) n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  return n;
}
function digits(text) { return String(text).replace(/\D/g, '').split('').reduce((a, d) => a + Number(d), 0); }
function cleanName(name) { return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, ''); }
function nameValue(name) { return cleanName(name).split('').reduce((sum, c) => sum + ((c.charCodeAt(0) - 65) % 9 + 1), 0); }
function validDate(value) { const d = new Date(`${value}T12:00:00`); return value && !Number.isNaN(d.valueOf()) && d <= new Date(); }
function esc(s) { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function onYear(form) {
  const value = form.birth.value;
  if (!validDate(value)) return fail(form, 'Elige una fecha de nacimiento válida.');
  const [, m, d] = value.split('-').map(Number); const yr = Number(form.yr ? form.yr.value : 2027) || 2027; const number = reduce(d + m + String(yr).split('').reduce((a, c) => a + Number(c), 0), false); const [title, rawText] = yearMeanings[number]; const text = rawText.replace('__Y__', yr);
  const meses = MESES.map((n, i) => `<strong>${n}:</strong> ${MES[reduce(number + i + 1, false)]}`).join('<br>');
  show(form, `${orbit(number, 'Tu año ' + yr)}<h3>${title}</h3><p>${text}</p><p><strong>Clave del año:</strong> la energía de fondo es la de una ${PIN[number]}</p><h3>Mes a mes</h3><p>Cada mes tiene su propio número (tu año más el mes) y un tema que lo colorea:</p><p>${meses}</p>`, 'year');
}
function seeded(seed) { let x = seed | 0; return () => { x = Math.imul(x ^ x >>> 16, 2246822507); x = Math.imul(x ^ x >>> 13, 3266489909); return ((x ^= x >>> 16) >>> 0) / 4294967296; }; }
function onLucky(form) {
  const sign = form.sign.value;
  if (!sign) return fail(form, 'Elige un signo para abrir la lectura de hoy.');
  const now = new Date(); const stamp = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate(); const rand = seeded(stamp + zodiac.indexOf(sign) * 7919); const nums = new Set(); while (nums.size < 5) nums.add(1 + Math.floor(rand() * 49));
  const tone = reduce(stamp + zodiac.indexOf(sign) + 1, false); const focus = FOCO_DIA[tone - 1];
  show(form, `${orbit(sign.slice(0,1), sign)}<div class="lucky-row">${[...nums].sort((a,b)=>a-b).map(n => `<span class="lucky">${n}</span>`).join('')}</div><h3>Tu clave de hoy: ${focus}</h3><p>${FOCO_TXT[tone - 1]}</p><p>Las cifras son un juego simbólico: sirven para dar intención al día, no predicen resultados ni lotería.</p>`, 'lucky');
}
function nameNums(name) {
  const c = cleanName(name), v = c.replace(/[^AEIOU]/g, ''), k = c.replace(/[AEIOU]/g, '');
  const expr = reduce(nameValue(name)), soul = v ? reduce(nameValue(v)) : 0, pers = k ? reduce(nameValue(k)) : 0;
  return { expr, soul, pers };
}
function onMatch(form) {
  const a = form.name1.value.trim(), b = form.name2.value.trim();
  if (cleanName(a).length < 2 || cleanName(b).length < 2) return fail(form, 'Escribe dos nombres de al menos dos letras.');
  const A = nameNums(a), B = nameNums(b), r = x => reduce(x, false);
  const ex = afinidad(r(A.expr), r(B.expr)), so = (A.soul && B.soul) ? afinidad(r(A.soul), r(B.soul)) : ex;
  const percent = Math.round((ex.n + so.n) / 2);
  let title = 'Una conexión que se cultiva';
  if (percent >= 85) title = 'Armonía magnética'; else if (percent >= 75) title = 'Afinidad en movimiento';
  const na = r(A.expr), nb = r(B.expr);
  show(form, `${orbit(`${percent}%`, 'Compatibilidad', 'percent')}<h3>${title}</h3>`
    + `<p><strong>${esc(a)}</strong> vibra en ${A.expr} (${KEY[na]}) y <strong>${esc(b)}</strong> en ${B.expr} (${KEY[nb]}).</p>`
    + `<p><strong>En la forma de actuar:</strong> ${ex.txt}</p>`
    + (A.soul && B.soul ? `<p><strong>En lo íntimo</strong> (números ${A.soul} y ${B.soul}): ${so.txt}</p>` : '')
    + `<p><strong>Para cuidar la relación:</strong> ${na === nb ? 'Para ambos: ' + RICH[na].consejo.charAt(0).toLowerCase() + RICH[na].consejo.slice(1) : esc(a) + ': ' + RICH[na].consejo.charAt(0).toLowerCase() + RICH[na].consejo.slice(1) + ' ' + esc(b) + ': ' + RICH[nb].consejo.charAt(0).toLowerCase() + RICH[nb].consejo.slice(1)}</p>`
    + `<p>El porcentaje sale de comparar el número de cada nombre y el de sus vocales; es una guía simbólica, no una sentencia.</p>`, 'match');
}
function onName(form) {
  const name = form.fullName.value.trim();
  if (cleanName(name).length < 3) return fail(form, 'Escribe un nombre completo de al menos tres letras.');
  const N = nameNums(name); const number = N.expr; const m = meanings[number] || meanings[reduce(number, false)]; const r = x => reduce(x, false);
  const master = [11, 22, 33].includes(number) ? `<p>Tu número es maestro (${number}): se vive como ${r(number)} en lo cotidiano y como ${number} cuando te animas a su vocación más alta.</p>` : '';
  show(form, `${orbit(number, 'Vibración del nombre')}<h3>${m.title}</h3><p><strong>${esc(name)}</strong>: ${m.text}</p>${master}`
    + (N.soul ? `<p><strong>Tu deseo interior (vocales, número ${N.soul}):</strong> ${SOUL[r(N.soul)]}</p>` : '')
    + (N.pers ? `<p><strong>Tu imagen exterior (consonantes, número ${N.pers}):</strong> ${PERS[r(N.pers)]}</p>` : '')
    + `<p>Esta lectura habla de tu forma de presentarte y crear; puedes integrarla a tu manera, sin etiquetas rígidas.</p>`, 'name');
}


const HANDLERS = { year: onYear, lucky: onLucky, match: onMatch, name: onName };
export function mount(kind) {
  const form = document.querySelector('form.pc-form'); if (!form) return;
  form.addEventListener('submit', e => { e.preventDefault(); HANDLERS[kind](form); });
}
