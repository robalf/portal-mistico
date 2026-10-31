function PMS(r){try{var t=window.top;if(t!==window&&t.PortalMusic&&t.PortalMusic.sfx)return t.PortalMusic.sfx(new URL(r,location.href).href);}catch(e){}return new Audio(r);}
const mount = document.querySelector('#game-container');

const tools = [
  { id: 'year', glyph: '✦', title: 'Numerología del año', sub: 'Descubre la energía que acompañará tu camino en 2027.' },
  { id: 'life', glyph: '∞', title: 'Número personal', sub: 'Conoce tu número de vida y los dones de tu esencia.' },
  { id: 'lucky', glyph: '☽', title: 'Números de la suerte', sub: 'Recibe las cifras luminosas de hoy para tu signo.' },
  { id: 'match', glyph: '♡', title: 'Compatibilidad de nombres', sub: 'Explora la armonía numerológica entre dos nombres.' },
  { id: 'name', glyph: '⌁', title: 'Personalidad según el nombre', sub: 'Revela la vibración que expresa tu nombre completo.' }
];

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
  1: ['Año de comienzos', '2027 abre una puerta para elegir rumbo, iniciar proyectos y renovar tu identidad. Da el primer paso aunque el mapa aún no esté completo.'],
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
let view = 'home';
let muted = localStorage.getItem('numerologia-muted') === 'true';
let audioUnlocked = false;
const music = (function(){try{var t=window.top;if(t!==window&&t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3');
music.loop = true; music.volume = 0.12;
const revealSound = PMS('assets/audio/revelacion-dorada.mp3'); revealSound.volume = 0.34;
const tapSound = PMS('assets/audio/toque-celestial.mp3'); tapSound.volume = 0.18;

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

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if (!muted) music.play().catch(() => {});
}
function sound(audio) { if (!muted) { audio.currentTime = 0; audio.play().catch(() => {}); } }
function log(eventName, data = {}) { window.ProgressLogger?.logProgress(eventName, data); }

function shell(content) {
  return `<main class="app">
    <header class="topbar"><div class="brand"><span class="brand-mark">✧</span> ORÁCULO NUMÉRICO</div><button class="icon-btn" id="mute" aria-label="${muted ? 'Activar' : 'Silenciar'} sonido">${muted ? '♩' : '♫'}</button></header>
    ${content}
  </main>`;
}

function home() {
  return shell(`<section class="screen"><div class="hero">
    <img class="emblem" src="assets/emblema-sol-luna.webp" alt="Emblema de sol y luna">
    <div class="eyebrow">Tu mapa interior</div><h1>Numerología</h1>
    <p>Los números son símbolos para observar tu camino con una mirada nueva. Elige una lectura y descubre el mensaje que hoy quiere acompañarte.</p>
  </div><nav class="grid" aria-label="Lecturas disponibles">${tools.map(t => `<button class="card" data-view="${t.id}"><span class="sigil">${t.glyph}</span><span><h3>${t.title}</h3><p>${t.sub}</p></span><span class="arrow">›</span></button>`).join('')}</nav>
  <p class="footnote">Una experiencia simbólica para la reflexión y el entretenimiento.</p></section>`);
}

function formScreen(tool, body) {
  return shell(`<section class="screen"><div class="section-head"><button class="back-btn" data-view="home" aria-label="Volver">‹</button><h2>${tool.title}</h2><span class="symbol">${tool.glyph}</span></div>${body}<p class="footnote">La numerología ofrece una lectura simbólica, no determina tu futuro.</p></section>`);
}

function render() {
  const tool = tools.find(t => t.id === view);
  if (view === 'home') mount.innerHTML = home();
  if (view === 'year') mount.innerHTML = formScreen(tool, panel('Suma tu día y mes de nacimiento a la vibración universal de 2027.', `<div class="field"><label for="birth">Fecha de nacimiento</label><input id="birth" type="date" autocomplete="bday"></div>`, 'Revelar mi año', 'yearForm'));
  if (view === 'life') mount.innerHTML = formScreen(tool, panel('Tu fecha completa contiene una vibración base: una manera simbólica de reconocer tus talentos y aprendizajes.', `<div class="field"><label for="birth">Fecha de nacimiento</label><input id="birth" type="date" autocomplete="bday"></div>`, 'Descubrir mi número', 'lifeForm'));
  if (view === 'lucky') mount.innerHTML = formScreen(tool, panel('Cada día enlazamos la fecha con la energía de tu signo para ofrecerte cinco cifras inspiradoras.', `<div class="field"><label for="sign">Signo zodiacal</label><select id="sign"><option value="">Elige tu signo</option>${zodiac.map(s => `<option>${s}</option>`).join('')}</select></div>`, 'Consultar números de hoy', 'luckyForm'));
  if (view === 'match') mount.innerHTML = formScreen(tool, panel('Comparamos la vibración expresiva de ambos nombres para observar afinidades y oportunidades de crecimiento.', `<div class="field"><label for="name1">Primer nombre</label><input id="name1" maxlength="60" autocomplete="off" placeholder="Ej. Alma"></div><div class="field"><label for="name2">Segundo nombre</label><input id="name2" maxlength="60" autocomplete="off" placeholder="Ej. Gabriel"></div>`, 'Calcular compatibilidad', 'matchForm'));
  if (view === 'name') mount.innerHTML = formScreen(tool, panel('Las letras de tu nombre forman una vibración de expresión: cómo despliegas tu energía y te relacionas con el mundo.', `<div class="field"><label for="fullName">Nombre completo</label><input id="fullName" maxlength="100" autocomplete="name" placeholder="Escribe tu nombre y apellidos"></div>`, 'Leer la vibración de mi nombre', 'nameForm'));
  bind();
}
function panel(intro, fields, cta, id) { return `<div class="panel"><p class="intro">${intro}</p><form id="${id}">${fields}<button class="primary" type="submit">✦ &nbsp; ${cta}</button><div class="error" aria-live="polite"></div><div id="result" aria-live="polite"></div></form></div>`; }
function bind() {
  mount.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { unlockAudio(); sound(tapSound); view = b.dataset.view; render(); log('open_reading', { view }); }));
  mount.querySelector('#mute')?.addEventListener('click', e => { unlockAudio(); muted = !muted; localStorage.setItem('numerologia-muted', String(muted)); if (muted) music.pause(); else music.play().catch(() => {}); e.currentTarget.textContent = muted ? '♩' : '♫'; e.currentTarget.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar sonido'); });
  mount.querySelector('#yearForm')?.addEventListener('submit', onYear);
  mount.querySelector('#lifeForm')?.addEventListener('submit', onLife);
  mount.querySelector('#luckyForm')?.addEventListener('submit', onLucky);
  mount.querySelector('#matchForm')?.addEventListener('submit', onMatch);
  mount.querySelector('#nameForm')?.addEventListener('submit', onName);
}
function fail(form, message) { form.querySelector('.error').textContent = message; form.querySelector('#result').innerHTML = ''; }
function show(form, html, kind) { form.querySelector('.error').textContent = ''; form.querySelector('#result').innerHTML = `<div class="result">${html}</div>`; sound(revealSound); form.querySelector('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); log('reading_complete', { kind }); }
function orbit(number, kicker, cls = '') { return `<div class="result-orbit"><div><div class="result-kicker">${kicker}</div><div class="big-number ${cls}">${number}</div></div></div>`; }

function onYear(e) {
  e.preventDefault(); unlockAudio(); const value = e.currentTarget.birth.value;
  if (!validDate(value)) return fail(e.currentTarget, 'Elige una fecha de nacimiento válida.');
  const [, m, d] = value.split('-').map(Number); const number = reduce(d + m + 2 + 0 + 2 + 7, false); const [title, text] = yearMeanings[number];
  show(e.currentTarget, `${orbit(number, 'Tu año 2027')}<h3>${title}</h3><p>${text}</p><p><strong>Clave del año:</strong> avanza con intención y revisa tu rumbo al cambiar de estación.</p>`, 'year');
}
function onLife(e) {
  e.preventDefault(); unlockAudio(); const value = e.currentTarget.birth.value;
  if (!validDate(value)) return fail(e.currentTarget, 'Elige una fecha de nacimiento válida.');
  const number = reduce(digits(value)); const m = meanings[number] || meanings[reduce(number, false)];
  show(e.currentTarget, `${orbit(number, 'Número de vida')}<h3>${m.title}</h3><p>${m.text}</p>`, 'life');
}
function seeded(seed) { let x = seed | 0; return () => { x = Math.imul(x ^ x >>> 16, 2246822507); x = Math.imul(x ^ x >>> 13, 3266489909); return ((x ^= x >>> 16) >>> 0) / 4294967296; }; }
function onLucky(e) {
  e.preventDefault(); unlockAudio(); const sign = e.currentTarget.sign.value;
  if (!sign) return fail(e.currentTarget, 'Elige un signo para abrir la lectura de hoy.');
  const now = new Date(); const stamp = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate(); const rand = seeded(stamp + zodiac.indexOf(sign) * 7919); const nums = new Set(); while (nums.size < 5) nums.add(1 + Math.floor(rand() * 49));
  const tone = reduce(stamp + zodiac.indexOf(sign) + 1, false); const focus = ['iniciativa','encuentros','creatividad','orden','aventura','armonía','intuición','prosperidad','renovación'][tone - 1];
  show(e.currentTarget, `${orbit(sign.slice(0,1), sign)}<div class="lucky-row">${[...nums].sort((a,b)=>a-b).map(n => `<span class="lucky">${n}</span>`).join('')}</div><h3>Tu clave de hoy: ${focus}</h3><p>Usa estas cifras como pequeños recordatorios para observar coincidencias, elegir con alegría o dar intención a un momento cotidiano.</p>`, 'lucky');
}
function onMatch(e) {
  e.preventDefault(); unlockAudio(); const a = e.currentTarget.name1.value.trim(), b = e.currentTarget.name2.value.trim();
  if (cleanName(a).length < 2 || cleanName(b).length < 2) return fail(e.currentTarget, 'Escribe dos nombres de al menos dos letras.');
  const na = reduce(nameValue(a)), nb = reduce(nameValue(b)); const ba = reduce(na, false), bb = reduce(nb, false); const distance = Math.min(Math.abs(ba - bb), 9 - Math.abs(ba - bb)); const hash = (nameValue(a) * 7 + nameValue(b) * 11) % 8; const percent = Math.max(52, Math.min(97, 93 - distance * 9 + hash));
  let title = 'Una conexión que se cultiva', text = 'Sus vibraciones son diferentes y complementarias. La curiosidad, los acuerdos claros y el respeto por los ritmos individuales pueden convertir esa diferencia en aprendizaje compartido.';
  if (percent >= 85) { title = 'Armonía magnética'; text = 'Sus nombres comparten un pulso muy afín: hay facilidad para comprender motivaciones y crear una dirección común. Conservar espacios propios mantiene viva esta sintonía.'; }
  else if (percent >= 70) { title = 'Afinidad en movimiento'; text = 'Existe una base cálida y estimulante. Cuando comunican lo que necesitan sin suponer, sus cualidades distintas se apoyan y la conexión gana profundidad.'; }
  show(e.currentTarget, `${orbit(`${percent}%`, 'Compatibilidad', 'percent')}<h3>${title}</h3><p><strong>${esc(a)}</strong> vibra en ${na} y <strong>${esc(b)}</strong> en ${nb}.</p><p>${text}</p>`, 'match');
}
function onName(e) {
  e.preventDefault(); unlockAudio(); const name = e.currentTarget.fullName.value.trim();
  if (cleanName(name).length < 3) return fail(e.currentTarget, 'Escribe un nombre completo de al menos tres letras.');
  const number = reduce(nameValue(name)); const m = meanings[number] || meanings[reduce(number, false)];
  show(e.currentTarget, `${orbit(number, 'Vibración del nombre')}<h3>${m.title}</h3><p><strong>${esc(name)}</strong>, tu nombre expresa ${m.text.charAt(0).toLowerCase() + m.text.slice(1)}</p><p>Esta lectura habla de tu forma de presentarte y crear; puedes integrarla a tu manera, sin etiquetas rígidas.</p>`, 'name');
}

render();
log('app_ready', { sectionCount: tools.length });

// Evita que el gesto/botón "atrás" del navegador saque de la app: primero regresa a la pantalla principal de la app.
(function(){
  window.history.pushState({app:true},'',location.href);
  window.addEventListener('popstate',function(){
    window.history.pushState({app:true},'',location.href);
    home();
  });
})();

/* PM-DEEPLINK */
(function(){var id=decodeURIComponent((location.hash||'').slice(1));if(!id||!/^[\w-]+$/.test(id))return;var n=0;(function go(){var b=document.querySelector('[data-view="%s"]'.replace('%s',id));if(b){b.click();setTimeout(function(){try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();window.scrollTo(0,0);if(window.parent!==window)window.parent.scrollTo(0,0);}catch(e){}},350);return;}if(++n<50)setTimeout(go,100);})();})();
