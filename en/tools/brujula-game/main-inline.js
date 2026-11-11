import {
  CICLO_LUNAR, MILISEGUNDOS_DIA, REFERENCIA_LUNA_NUEVA, SIGNOS, SIMBOLOS_SIGNOS,
  FASES, edadLunar, porcentajeIluminacion, faseLunar, proximaLunaNueva,
  proximaLunaLlena, signoLunar, crearFechaPrueba, claveFecha, instantesFase,
} from './astro.js';
import { RETROGRADOS_AUTO, EVENTOS_AUTO } from './datos-astro.js';

// Retrógrados y eventos 2026-2035: tabla precalculada con astronomy-engine (datos-astro.js).
const RETROGRADOS = RETROGRADOS_AUTO;

// Eventos curados a mano (fechas culturales y astronómicas extra); se suman a los calculados.
const EVENTOS_MANUALES = [
  { fecha: '2026-10-04', icono: '🪐', titulo: 'Saturn in Opposition', texto: 'Saturn looks brighter and larger than at any other time all year.' },
  { fecha: '2026-10-10', icono: '🌑', titulo: 'New Moon and 10/10 Portal', texto: 'An ideal day for writing down intentions.' },
  { fecha: '2026-10-21', icono: '☄️', titulo: 'Orionid Meteor Shower', texto: 'Peak of the meteor shower linked to Comet Halley (October 21 and 22).' },
  { fecha: '2026-10-25', icono: '🌕', titulo: 'Hunter Moon', texto: 'The first Full Moon after the Harvest Moon.' },
  { fecha: '2026-10-31', icono: '🎃', titulo: 'Halloween and Samhain', texto: 'The night when, according to tradition, the veil between the worlds is at its thinnest.' },
];

const EVENTOS = [...EVENTOS_AUTO, ...EVENTOS_MANUALES].sort((a, b) => a.fecha.localeCompare(b.fecha));

const ENERGIAS = [
  'Drive, courage, and a desire to get started. A good day to take the first step.',
  'Calm, pleasure, and stability. Enjoy the simple things and take care of your body.',
  'Curiosity and conversation. Ideal for writing, learning, and connecting.',
  'Emotions run close to the surface. Seek out your home, your people, and your refuge.',
  'Radiance and creativity. Express yourself without fear and treat yourself.',
  'Order and detail. A good time to get organized and look after your health.',
  'Harmony and relationships. Seek balance and beauty all around you.',
  'Intensity and truth. Deep emotions rise to the surface.',
  'Optimism and adventure. Open your mind to something new.',
  'Discipline and goals. Build what you want step by step.',
  'Originality and freedom. Break your routine and connect with your group.',
  'Intuition and dreams. Listen to your inner voice and let things flow.',
];

const SIGNIFICADOS_FASE = {
  nueva: 'In the esoteric tradition, the New Moon represents a fertile pause and the beginning of a cycle. It is associated with planting intentions and opening to new possibilities.',
  creciente: 'The Waxing Crescent symbolizes the initial push and the confidence to move forward. Tradition invites us to nurture the ideas that are beginning to take shape.',
  cuartoCreciente: 'The First Quarter is linked to decisions and challenges that help us grow. It is a symbolic moment to stay the course and overcome obstacles.',
  gibosaCreciente: 'The Waxing Gibbous invites us to review, adjust, and be patient before reaching completion. In the esoteric tradition, small changes prepare a more conscious harvest.',
  llena: 'The Full Moon is associated with culmination, clarity, and gratitude. It is a symbol of fullness, celebration, and release of whatever has completed its cycle.',
  gibosaMenguante: 'The Waning Gibbous represents integration and generosity. Tradition suggests sharing what you have learned and giving thanks for what the cycle left behind.',
  cuartoMenguante: 'The Last Quarter invites us to clear, tidy, and forgive. Symbolically, it helps us let go of burdens to regain space and balance.',
  menguante: 'The Waning Crescent is a time of pause, rest, and closure. Tradition links it with regaining strength before a new planting.',
};

const RITUALES = {
  nueva: [
    { titulo: 'Letter to Your New Cycle', intencion: 'Plant what you want to grow this month.', materiales: 'Paper, a pen, and a white candle.', pasos: ['Light the candle and take three deep breaths.', 'Write three wishes in the present tense, as if they were already real.', 'Fold the paper and keep it until the next Full Moon.'], afirmacion: 'I make room for the new that is coming into my life.' },
    { titulo: 'Seeds of Intention', intencion: 'Give a concrete place to a wish that is just beginning.', materiales: 'A small piece of paper and a glass of water.', pasos: ['Write a brief intention on the paper.', 'Place it next to the glass and visualize a seed awakening.', 'When you are done, water a plant with the water.'], afirmacion: 'Every beginning finds its own path.' },
    { titulo: 'The First Step', intencion: 'Turn a new idea into a simple action.', materiales: 'Paper and a pen.', pasos: ['Write down an idea that excites you.', 'Below it, note the smallest step you can take.', 'Set aside a time in your calendar to do it.'], afirmacion: 'I allow myself to begin with confidence and curiosity.' },
    { titulo: 'Room for the New', intencion: 'Prepare your surroundings and your mood for a new cycle.', materiales: 'A bowl and a little water.', pasos: ['Open a window and breathe calmly.', 'Remove one object you no longer need from your space.', 'Leave the bowl of water out for a few minutes, then pour it on a plant.'], afirmacion: 'I make space and welcome new possibilities.' },
  ],
  creciente: [
    { titulo: 'A Brave Step', intencion: 'Give a wish momentum with a realistic action.', materiales: 'Paper and a pen.', pasos: ['Choose a goal you want to nurture.', 'Write down one possible action for today.', 'Do it for ten minutes without aiming for perfection.'], afirmacion: 'I move forward at my own pace and value every step.' },
    { titulo: 'Watering Your Projects', intencion: 'Give steady attention to something that is growing.', materiales: 'A plant or a glass of water.', pasos: ['Water a plant mindfully.', 'Softly name something you want to cultivate.', 'Take one small step toward it today.'], afirmacion: 'My everyday dedication strengthens what I love.' },
    { titulo: 'The Momentum List', intencion: 'Organize your next moves with calm enthusiasm.', materiales: 'Paper and a pen.', pasos: ['Write down three achievements you have already made.', 'Choose the next simplest step.', 'Set a day and a time to begin.'], afirmacion: 'My energy grows when I direct it with intention.' },
    { titulo: 'Compass of Confidence', intencion: 'Remember what moves you as you go forward.', materiales: 'An optional crystal.', pasos: ['Hold the crystal or rest your hands on your chest.', 'Breathe and think of your most important reason.', 'Write a phrase to remind you of that reason.'], afirmacion: 'I trust the path I am building step by step.' },
  ],
  cuartoCreciente: [
    { titulo: 'Untying a Knot', intencion: 'Look at an obstacle clearly and choose how to face it.', materiales: 'Paper and a pen.', pasos: ['Describe the obstacle in one sentence.', 'Note two options that truly depend on you.', 'Choose one and take its first step today.'], afirmacion: 'I can meet challenges with clarity and courage.' },
    { titulo: 'A Calm Decision', intencion: 'Listen to your priorities before making a decision.', materiales: 'Two small sheets of paper.', pasos: ['Write each alternative on a sheet.', 'Breathe slowly and notice which value matters most to you.', 'Choose the next step, not the whole story.'], afirmacion: 'I decide from my values and trust my judgment.' },
    { titulo: 'The Stone on the Path', intencion: 'Turn a difficulty into a learning opportunity.', materiales: 'A smooth stone or a crystal.', pasos: ['Hold the stone and think of a challenge you are facing right now.', 'Name something you already learned by going through it.', 'Leave the stone somewhere visible as a reminder.'], afirmacion: 'I have the resources to get through this moment.' },
    { titulo: 'Luminous Boundaries', intencion: 'Choose a kind boundary that protects your energy.', materiales: 'Paper and a pen.', pasos: ['Write down which situation calls for a boundary.', 'Put together a clear, respectful response.', 'Practice it quietly and keep it ready for when you need it.'], afirmacion: 'Protecting my boundaries is also protecting my relationships.' },
  ],
  gibosaCreciente: [
    { titulo: 'Mindful Adjustment', intencion: 'Patiently refine something that is already underway.', materiales: 'Paper and a pen.', pasos: ['Choose a project that is moving forward.', 'Write down one thing that works and one thing you would like to adjust.', 'Spend a short while on that adjustment.'], afirmacion: 'I improve with patience and acknowledge what is already blooming.' },
    { titulo: 'Polishing the Intention', intencion: 'Clarify what you want and what you can let go of in the plan.', materiales: 'An optional candle and paper.', pasos: ['Read an intention you wrote earlier.', 'Cross out whatever no longer feels true.', 'Rewrite a simpler, more achievable version.'], afirmacion: 'Patience is also part of my progress.' },
    { titulo: 'A Pause to Review', intencion: 'Do a calm review before reaching completion.', materiales: 'A glass of water.', pasos: ['Drink a little water with full attention.', 'Review your progress without judging yourself.', 'Choose one small improvement for the next day.'], afirmacion: 'I can adjust my course without losing my purpose.' },
    { titulo: 'The Work in Progress', intencion: 'Welcome the learning that arrives while you finish something.', materiales: 'Paper and a pen.', pasos: ['Write down something you have learned this week.', 'Give thanks for a mistake that taught you something.', 'Complete one small pending task.'], afirmacion: 'Every mindful step brings me closer to a completion of my own.' },
  ],
  llena: [
    { titulo: 'Gratitude Bowl', intencion: 'Acknowledge what has come to completion and what supports you.', materiales: 'A bowl and paper.', pasos: ['Write down three things you are grateful for from this cycle.', 'Fold the papers and place them in the bowl.', 'Read each one aloud and put the bowl away.'], afirmacion: 'I honor what arrives and give thanks for what remains.' },
    { titulo: 'Light for Your Crystals', intencion: 'Use the night as a symbol of renewal and care.', materiales: 'A crystal and a safe windowsill.', pasos: ['Clean the crystal with a soft cloth.', 'Place it somewhere stable where it can receive indirect light.', 'In the morning, thank it for reminding you of your intention.'], afirmacion: 'I open myself to clarity and care for my energy with tenderness.' },
    { titulo: 'Celebrate What You Have Achieved', intencion: 'Honor a goal you have reached, big or small.', materiales: 'A drink you enjoy.', pasos: ['Name one thing you do better today than before.', 'Raise a toast to your effort, even though the road continues.', 'Share your joy with someone you trust.'], afirmacion: 'I celebrate my journey and gratefully welcome all I have lived.' },
    { titulo: 'Letting Go Under the Moon', intencion: 'Say goodbye to a habit or a burden that no longer walks with you.', materiales: 'Paper and a pen.', pasos: ['Write down what you want to leave behind.', 'Breathe and acknowledge what it taught you.', 'Tear up the paper and recycle or dispose of it with care.'], afirmacion: 'I let go with gratitude of what has already fulfilled its purpose.' },
  ],
  gibosaMenguante: [
    { titulo: 'Sharing the Harvest', intencion: 'Share something valuable you have learned.', materiales: 'Ninguno.', pasos: ['Think of a recent lesson.', 'Share it with someone who can appreciate it.', 'Listen to what that person has learned, too.'], afirmacion: 'What I share generously also transforms me.' },
    { titulo: 'Thanks Out Loud', intencion: 'Thank someone who has accompanied you along your path.', materiales: 'Optional paper.', pasos: ['Choose someone who has supported you.', 'Send them a sincere, specific message.', 'Take a moment to receive their reply.'], afirmacion: 'I acknowledge the bonds that make my path brighter.' },
    { titulo: 'The Lesson of the Cycle', intencion: 'Integrate an experience before closing the cycle.', materiales: 'Paper and a pen.', pasos: ['Write down an experience that changed you.', 'Note what it taught you about your needs.', 'Keep the note in a quiet place.'], afirmacion: 'I integrate what I have learned and carry it with me with love.' },
    { titulo: 'Circle of Appreciation', intencion: 'Celebrate small wins together as a community.', materiales: 'A cup of tea or water.', pasos: ['Invite someone to chat for a few minutes.', 'Each person names something they are grateful for.', 'Close the conversation with a kind wish for the other person.'], afirmacion: 'Gratitude grows when it finds company.' },
  ],
  cuartoMenguante: [
    { titulo: 'Order That Frees', intencion: 'Create physical space to feel more calm.', materiales: 'A box or bag for donations.', pasos: ['Choose a drawer or a small surface.', 'Set aside what you no longer use or need.', 'Clean the space and give thanks for what you decide to let go of.'], afirmacion: 'By letting go of what is unnecessary, I protect my peace.' },
    { titulo: 'Possible Forgiveness', intencion: 'Loosen the weight of a story without rushing the process.', materiales: 'Paper and a pen.', pasos: ['Write down which emotion you want to understand.', 'Name which boundary or kind of care you need today.', 'Keep the note as a reminder of your own compassion.'], afirmacion: 'I give myself permission to heal at my own pace.' },
    { titulo: 'Gentle Cleaning', intencion: 'Refresh a corner of your home with a simple action.', materiales: 'Water and a cloth.', pasos: ['Choose a small space and clear its surface.', 'Clean it calmly, paying attention to your breathing.', 'Leave there only what is useful or dear to you.'], afirmacion: 'My space supports the calm I am cultivating.' },
    { titulo: 'Closing with Gratitude', intencion: 'Finish a pending task and free up your attention.', materiales: 'Paper and a pen.', pasos: ['Write down a task that has been taking up space in your mind.', 'Decide whether you can complete it, delegate it, or let it go.', 'Take that step and cross the task off your list.'], afirmacion: 'I close what I can and rest from what is not mine to carry.' },
  ],
  menguante: [
    { titulo: 'Restorative Rest', intencion: 'Allow your body and mind to regain their strength.', materiales: 'A blanket or a herbal tea.', pasos: ['Set aside a few minutes with no screens.', 'Breathe slowly and relax your shoulders.', 'Pick a gentle bedtime.'], afirmacion: 'Resting is also a way of moving forward.' },
    { titulo: 'Farewell to a Cycle', intencion: 'Acknowledge an ending and stop demanding more from it.', materiales: 'Paper and a pen.', pasos: ['Write down which chapter you feel is ending.', 'Give thanks for one thing it left you.', 'Keep or discard the note, whichever you prefer.'], afirmacion: 'I honor what I have lived and allow myself to close in peace.' },
    { titulo: 'Nourishing Silence', intencion: 'Listen to your inner world without filling it with new tasks.', materiales: 'A quiet space.', pasos: ['Sit comfortably for three minutes.', 'Observe your thoughts without trying to correct them.', 'Jot down one word that describes how you feel.'], afirmacion: 'In stillness I also find guidance.' },
    { titulo: 'Preparing the Sowing', intencion: 'Regain clarity before choosing a new intention.', materiales: 'Paper and a pen.', pasos: ['Make a short list of what you want to leave behind.', 'Next to each item, write the lesson you are keeping.', 'Keep the page to read at your next new beginning.'], afirmacion: 'I calmly prepare for what is about to be born.' },
  ],
};

const app = document.getElementById('app');
const modal = document.getElementById('modal');
const modalContenido = document.getElementById('modal-contenido');
const ahoraReal = new Date();
const { fecha: fechaElegida, error: errorFecha } = crearFechaPrueba(window.location.search, ahoraReal);
const fechaBaseMs = fechaElegida.getTime();
const tiempoInicio = Date.now();
let fechaVista = new Date(fechaBaseMs);
let pantalla = 'inicio';
let mesCalendario = new Date(fechaVista.getFullYear(), fechaVista.getMonth(), 1);
let toastTimer;

function ahoraVirtual() { return new Date(fechaBaseMs + (Date.now() - tiempoInicio)); }
function fechaDeDia(anio, mes, dia, hora = 12) { return new Date(anio, mes, dia, hora, 0, 0, 0); }
function escapar(texto) { return String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function formatoFecha(date, opciones = {}) { return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', ...opciones }); }
function formatoHora(date) { return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }
function saludo(date) {
  const hora = date.getHours();
  if (hora >= 5 && hora < 12) return 'Good morning';
  if (hora >= 12 && hora < 19) return 'Good afternoon';
  return 'Good night';
}
function diferenciaDias(fechaA, fechaB) {
  const a = Date.UTC(fechaA.getFullYear(), fechaA.getMonth(), fechaA.getDate());
  const b = Date.UTC(fechaB.getFullYear(), fechaB.getMonth(), fechaB.getDate());
  return Math.round((b - a) / MILISEGUNDOS_DIA);
}
function cuentaRegresiva(destino, referencia = ahoraVirtual()) {
  const ms = Math.max(0, destino.getTime() - referencia.getTime());
  const dias = Math.floor(ms / MILISEGUNDOS_DIA);
  const horas = Math.floor((ms % MILISEGUNDOS_DIA) / 3600000);
  return `${dias} days ${horas} hours`;
}
function fechaSiguienteFase(desde, tipo) { return tipo === 'llena' ? proximaLunaLlena(desde) : proximaLunaNueva(desde); }
function faseParaFecha(date) { return faseLunar(date); }
function iconoDiario(date) { return faseParaFecha(date).icono; }
function datosDeLuna(date) {
  const fase = faseParaFecha(date);
  const signo = signoLunar(date);
  return { fase, signo, edad: edadLunar(date), iluminacion: porcentajeIluminacion(date) };
}

function pathIluminadoSvg(age, prefijo) {
  const r = 85;
  const angulo = 2 * Math.PI * age / CICLO_LUNAR;
  const creciente = age < CICLO_LUNAR / 2;
  const factor = creciente ? Math.cos(angulo) : -Math.cos(angulo);
  const borde = [];
  for (let i = 0; i <= 48; i += 1) {
    const y = r - (2 * r * i / 48);
    const x = factor * Math.sqrt(Math.max(0, r * r - y * y));
    borde.push(`${i === 0 ? 'L' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  const arco = creciente ? `M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r}` : `M 0 ${-r} A ${r} ${r} 0 0 0 0 ${r}`;
  const terminador = creciente ? borde.join(' ') : borde.join(' ');
  return `${arco} ${terminador} Z`;
}
function lunaSvg(date, grande = false) {
  const edad = edadLunar(date);
  const clip = `recorte-lunar-${grande ? 'grande' : 'mini'}`;
  const craters = grande
    ? '<circle cx="-30" cy="-27" r="11"/><circle cx="25" cy="21" r="14"/><circle cx="32" cy="-34" r="7"/><circle cx="-12" cy="40" r="8"/><circle cx="-42" cy="16" r="5"/>'
    : '<circle cx="-30" cy="-27" r="11"/><circle cx="25" cy="21" r="14"/><circle cx="32" cy="-34" r="7"/>';
  return `<svg class="dibujo-luna${grande ? ' luna-grande' : ''}" viewBox="-105 -105 210 210" role="img" aria-label="Illustration of the current Moon phase">
    <defs><clipPath id="${clip}"><circle r="85"/></clipPath><radialGradient id="plata-${clip}" cx="34%" cy="28%"><stop offset="0" stop-color="#F5F2E9"/><stop offset="1" stop-color="#B8C0D2"/></radialGradient><radialGradient id="sombra-${clip}" cx="35%" cy="30%"><stop offset="0" stop-color="#222349"/><stop offset="1" stop-color="#080A19"/></radialGradient></defs>
    <circle r="88" fill="none" stroke="rgba(241,213,138,.13)" stroke-width="1"/>
    <g clip-path="url(#${clip})"><circle r="85" fill="url(#sombra-${clip})"/><path d="${pathIluminadoSvg(edad, clip)}" fill="url(#plata-${clip})"/><g fill="rgba(65,72,95,.19)" stroke="rgba(71,77,98,.15)" stroke-width="2">${craters}</g></g>
    <circle r="85" fill="none" stroke="rgba(241,213,138,.36)" stroke-width="1.2"/>
  </svg>`;
}

function ritualDelDia(date) {
  const fase = faseParaFecha(date);
  const lista = RITUALES[fase.clave] || RITUALES.nueva;
  const diaAnio = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 1)) / MILISEGUNDOS_DIA) + 1;
  return lista[diaAnio % 4];
}

function fechaLocalDesdeClave(clave) {
  const [anio, mes, dia] = clave.split('-').map(Number);
  return new Date(anio, mes - 1, dia, 12, 0, 0);
}
function retrorogosEnFecha(date) {
  const clave = claveFecha(date);
  return RETROGRADOS.filter((periodo) => clave >= periodo.inicio && clave <= periodo.fin);
}
function retrorogradoActivo(planeta, date) { return retrorogosEnFecha(date).find((periodo) => periodo.planeta === planeta) || null; }
function proximoPeriodo(planeta, date) {
  const clave = claveFecha(date);
  return RETROGRADOS.filter((periodo) => periodo.planeta === planeta && periodo.inicio > clave).sort((a, b) => a.inicio.localeCompare(b.inicio))[0] || null;
}
function fechaCorta(clave) { return formatoFecha(fechaLocalDesdeClave(clave), { year: 'numeric' }); }

function cargarRacha(date) {
  const clave = claveFecha(date);
  const llave = 'brujula-lunar-racha';
  try {
    const registro = JSON.parse(localStorage.getItem(llave) || 'null');
    if (!registro || typeof registro.ultima !== 'string' || !Number.isFinite(registro.dias)) {
      localStorage.setItem(llave, JSON.stringify({ ultima: clave, dias: 1 }));
      return 1;
    }
    const salto = diferenciaDias(fechaLocalDesdeClave(registro.ultima), date);
    let dias = registro.dias;
    if (salto > 0) dias = salto === 1 ? dias + 1 : 1;
    localStorage.setItem(llave, JSON.stringify({ ultima: clave, dias }));
    return dias;
  } catch {
    return 1;
  }
}
function mensajeRacha(dias) {
  const mensajes = { 3: 'Three days connected with yourself! Keep exploring.', 7: 'A week following the lunar pulse! What a lovely ritual.', 14: 'Two weeks of consistency and curiosity! Celebrate your path.', 30: 'A month of visits! Your compass walks with you, cycle after cycle.' };
  return mensajes[dias] || '';
}

function renderInicio() {
  pantalla = 'inicio';
  const date = ahoraVirtual();
  const luna = datosDeLuna(date);
  const llena = fechaSiguienteFase(date, 'llena');
  const nueva = fechaSiguienteFase(date, 'nueva');
  const retroFilas = ['Mercury', 'Venus'].map((planeta) => {
    const activo = retrorogradoActivo(planeta, date);
    return `<div class="retro-fila"><span class="estado"><i class="punto ${activo ? 'rojo' : 'verde'}"></i>${planeta}</span><span class="estado-texto">${activo ? 'Retrograde' : 'Direct'}</span></div>`;
  }).join('');
  const semana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i, 12);
    return `<div class="dia-mini${i === 0 ? ' hoy' : ''}"><span>${i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })}</span><b>${d.getDate()}</b><i aria-label="${escapar(faseParaFecha(d).nombre)}">${iconoDiario(d)}</i></div>`;
  }).join('');
  const ritual = ritualDelDia(date);
  const racha = cargarRacha(date);
  const logro = mensajeRacha(racha);
  app.innerHTML = `
    <div class="barra-superior" aria-hidden="true"></div>
    <header class="encabezado"><h1>Lunar Compass</h1><p class="fecha">${date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><p class="saludo">${saludo(date)}</p></header>
    ${errorFecha ? '<p class="error-fecha" role="status">The date provided is not valid; we are showing the current date.</p>' : ''}
    <div class="inicio-grid">
      <section class="tarjeta tarjeta-luna"><h2>Today's Moon</h2>${lunaSvg(date, true)}<div class="nombre-fase">${luna.fase.nombre}</div>
        <p class="dato-destacado">${luna.iluminacion}% illuminated · ${luna.signo.simbolo} Moon in ${luna.signo.nombre}</p>
        <div class="mini-contadores"><div class="contador">🌕 Next Full Moon<strong id="cuenta-llena">${cuentaRegresiva(llena, date)}</strong></div><div class="contador">🌑 Next New Moon<strong id="cuenta-nueva">${cuentaRegresiva(nueva, date)}</strong></div></div>
        <button class="boton-texto" type="button" data-pantalla="luna">See more ›</button>
      </section>
      <div class="columna-derecha">
        <section class="tarjeta"><h2>Daily Ritual</h2><p class="ritual-titulo">${escapar(ritual.titulo)}</p><p class="ritual-intro">${escapar(ritual.intencion)}</p><button class="boton-texto" type="button" data-pantalla="ritual">See ritual ›</button></section>
        <section class="tarjeta"><h2>Retrogrades Today</h2>${retroFilas}<button class="boton-texto" type="button" data-pantalla="retrogrados">See details ›</button></section>
        <section class="tarjeta"><h2>Lunar Calendar</h2><div class="semana">${semana}</div><button class="boton-texto" type="button" data-pantalla="calendario">See full month ›</button></section>
      </div>
    </div>
    <section class="accesos"><h2>Also for you today</h2><div class="acceso-grid">
      <a class="acceso" href="https://elportalmistico.com/juegos/numerologia.html" target="_top" rel="noopener"><span class="acceso-icono">🔢</span><span><strong>Your number of the day</strong><small>Discover the numerical vibration of your day</small></span></a>
      <a class="acceso" href="https://elportalmistico.com/juegos/tarot.html" target="_top" rel="noopener"><span class="acceso-icono">🔮</span><span><strong>Your card of the day</strong><small>Draw a tarot card for today</small></span></a>
      <a class="acceso" href="https://elportalmistico.com/juegos/horoscopo.html" target="_top" rel="noopener"><span class="acceso-icono">♈</span><span><strong>Your horoscope today</strong><small>What the sky says about your sign</small></span></a>
    </div></section>
    <section class="racha" aria-live="polite"><div class="estrellas-logro" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div><p>🔥 You have checked your Lunar Compass ${racha} ${racha === 1 ? 'day' : 'days'} in a row</p>${logro ? `<p class="felicitacion">${logro}</p>` : ''}</section>
    <footer>Symbolic content, for entertainment purposes. Astronomical calculations are approximate.</footer>`;
  app.querySelectorAll('[data-pantalla]').forEach((boton) => boton.addEventListener('click', () => navegar(boton.dataset.pantalla)));
  iniciarContadores(llena, nueva);
}

let contadorIntervalo = null;
function iniciarContadores(llena, nueva) {
  if (contadorIntervalo) clearInterval(contadorIntervalo);
  contadorIntervalo = setInterval(() => {
    if (pantalla !== 'inicio') return;
    const referencia = ahoraVirtual();
    const lleno = document.getElementById('cuenta-llena');
    const nuevo = document.getElementById('cuenta-nueva');
    if (lleno) lleno.textContent = cuentaRegresiva(llena, referencia);
    if (nuevo) nuevo.textContent = cuentaRegresiva(nueva, referencia);
  }, 60000);
}

function irArriba() { const w=document.getElementById('pm-app'); if(w && w.getBoundingClientRect().top<0) w.scrollIntoView({behavior:'smooth',block:'start'}); }
function navegar(destino) {
  if (!['luna', 'ritual', 'retrogrados', 'calendario'].includes(destino)) return;
  renderPantalla(destino);
}
function renderPantalla(destino) {
  pantalla = destino;
  if (destino === 'luna') renderLuna();
  else if (destino === 'ritual') renderRitual();
  else if (destino === 'retrogrados') renderRetrogrados();
  else if (destino === 'calendario') renderCalendario();
  irArriba();
}
function encabezadoInterno(titulo, subtitulo = '') {
  return `<button type="button" class="boton-volver" data-volver aria-label="Back to Home">‹</button><header class="encabezado-interno"><h1>${titulo}</h1>${subtitulo ? `<p class="fecha">${subtitulo}</p>` : ''}</header>`;
}
function enlazarVolver() {
  const boton = app.querySelector('[data-volver]');
  if (boton) boton.addEventListener('click', () => {
    renderInicio(); irArriba();
  });
}
function renderLuna() {
  const date = ahoraVirtual();
  const luna = datosDeLuna(date);
  const llena = fechaSiguienteFase(date, 'llena');
  const nueva = fechaSiguienteFase(date, 'nueva');
  const significado = SIGNIFICADOS_FASE[luna.fase.clave];
  app.innerHTML = `<div class="pantalla-interna">${encabezadoInterno('Today\'s Moon', date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}
    <section class="detalle">
      <article class="tarjeta detalle-luna">${lunaSvg(date, true)}<div class="nombre-fase">${luna.fase.nombre}</div><p class="dato-destacado">${luna.iluminacion}% illuminated</p>
        <div class="filas-datos"><div class="fila-dato"><span>Moon age</span><span>Day ${Math.floor(luna.edad) + 1} of the lunar cycle</span></div><div class="fila-dato"><span>Exact phase</span><span>${luna.fase.icono} ${luna.fase.nombre}</span></div><div class="fila-dato"><span>Next Full Moon</span><span>${formatoFecha(llena, { year: 'numeric' })} · ${formatoHora(llena)}</span></div><div class="fila-dato"><span>Countdown</span><span id="detalle-cuenta-llena">${cuentaRegresiva(llena, date)}</span></div><div class="fila-dato"><span>Next New Moon</span><span>${formatoFecha(nueva, { year: 'numeric' })} · ${formatoHora(nueva)}</span></div><div class="fila-dato"><span>Countdown</span><span id="detalle-cuenta-nueva">${cuentaRegresiva(nueva, date)}</span></div></div>
        <p class="energia"><strong>${luna.signo.simbolo} Moon in ${luna.signo.nombre}:</strong> ${ENERGIAS[luna.signo.indice]}</p><p class="texto-fase">${significado}</p>
        <p class="texto-fase">The Moon enters ${luna.signo.siguiente} in approximately ${luna.signo.horasEntrada} hours.</p>
        <div class="acciones"><button class="boton-primario" type="button" id="agregar-calendario">Add to my calendar</button><button class="boton-texto" style="width:auto;margin:0" type="button" id="compartir">Share</button></div>
      </article>
    </section></div>`;
  enlazarVolver();
  document.getElementById('agregar-calendario').addEventListener('click', () => descargarCalendario(llena, nueva));
  document.getElementById('compartir').addEventListener('click', compartirLuna);
  setInterval(() => {
    if (pantalla !== 'luna') return;
    const ref = ahoraVirtual();
    const a = document.getElementById('detalle-cuenta-llena');
    const b = document.getElementById('detalle-cuenta-nueva');
    if (a) a.textContent = cuentaRegresiva(llena, ref);
    if (b) b.textContent = cuentaRegresiva(nueva, ref);
  }, 60000);
}

function renderRitual() {
  const date = ahoraVirtual();
  const fase = faseParaFecha(date);
  const ritual = ritualDelDia(date);
  app.innerHTML = `<div class="pantalla-interna">${encabezadoInterno('Daily Ritual', `${fase.icono} ${fase.nombre}`)}<section class="detalle">
    <article class="tarjeta ritual-detalle"><h2>${escapar(ritual.titulo)}</h2><p class="intencion"><strong>Intention:</strong> ${escapar(ritual.intencion)}</p><p><strong>Materials:</strong> ${escapar(ritual.materiales || 'None; you only need a moment of calm.')}</p><h3>Steps</h3><ol>${ritual.pasos.map((paso) => `<li>${escapar(paso)}</li>`).join('')}</ol><p class="afirmacion">“${escapar(ritual.afirmacion)}”</p></article>
    <p class="nota-seguridad">If you use candles or incense, never leave them burning unattended.</p></section></div>`;
  enlazarVolver();
}

function tarjetaRetro(planeta, fecha) {
  const periodos = RETROGRADOS.filter((p) => p.planeta === planeta);
  const activo = retrorogradoActivo(planeta, fecha);
  const siguiente = proximoPeriodo(planeta, fecha);
  const simbolo = periodos[0]?.simbolo || '';
  const texto = planeta === 'Mercury'
    ? 'Communication, technology, travel, and contracts. Advice: review before sending, signing, or buying.'
    : 'Love, money, beauty, and relationships. Advice: review your bonds and spending, and avoid impulsive decisions in love.';
  if (activo) {
    const inicio = fechaLocalDesdeClave(activo.inicio);
    const fin = fechaLocalDesdeClave(activo.fin);
    const total = Math.max(1, diferenciaDias(inicio, fin) + 1);
    const transcurridos = Math.max(0, diferenciaDias(inicio, fecha) + 1);
    const progreso = Math.min(100, Math.round(transcurridos / total * 100));
    const faltan = Math.max(0, diferenciaDias(fecha, fin));
    return `<article class="tarjeta"><h2>${simbolo} ${planeta}</h2><p class="estado-grande"><i class="punto rojo"></i>Retrograde in ${escapar(activo.signo)}</p><p>Ends ${fechaCorta(activo.fin)} — ${faltan} ${faltan === 1 ? 'day' : 'days'} to go.</p><div class="barra-progreso" role="progressbar" aria-label="${planeta} retrograde progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progreso}"><span style="width:${progreso}%"></span></div><p class="estado-texto">${progreso}% of the period</p><p>${texto}</p></article>`;
  }
  const proximo = siguiente ? `Next retrograde: ${fechaCorta(siguiente.inicio)} (${escapar(siguiente.signo)}).` : 'Upcoming dates to be confirmed.';
  return `<article class="tarjeta"><h2>${simbolo} ${planeta}</h2><p class="estado-grande"><i class="punto verde"></i>Direct</p><p>${proximo}</p><p>${texto}</p></article>`;
}
function renderRetrogrados() {
  const date = ahoraVirtual();
  const mercurio = Boolean(retrorogradoActivo('Mercury', date));
  const venus = Boolean(retrorogradoActivo('Venus', date));
  app.innerHTML = `<div class="pantalla-interna">${encabezadoInterno('Retrogrades', `Symbolic status for ${formatoFecha(date, { year: 'numeric' })}`)}<section class="detalle"><div class="retro-detalle-grid">${tarjetaRetro('Mercurio', date)}${tarjetaRetro('Venus', date)}</div>${mercurio && venus ? '<p class="aviso-doble">✦ Double retrograde: an ideal period to review the past before deciding the future.</p>' : ''}<p class="nota-seguridad">The dates in this guide are approximate and limited to the periods loaded.</p></section></div>`;
  enlazarVolver();
}

function fasesDelMes(date) {
  const fasesPrincipales = [
    { edad: 0, nombre: 'New Moon', icono: '🌑' },
    { edad: CICLO_LUNAR * .25, nombre: 'First Quarter', icono: '🌓' },
    { edad: CICLO_LUNAR * .5, nombre: 'Full Moon', icono: '🌕' },
    { edad: CICLO_LUNAR * .75, nombre: 'Last Quarter', icono: '🌗' },
  ];
  return fasesPrincipales.flatMap((fase) => instantesFase(date, fase.edad).map((instante) => ({ ...fase, instante, clave: claveFecha(instante) }))).sort((a, b) => a.instante - b.instante);
}
function renderCalendario() {
  pantalla = 'calendario';
  const anio = mesCalendario.getFullYear();
  const mes = mesCalendario.getMonth();
  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const cantidad = new Date(anio, mes + 1, 0).getDate();
  const fases = fasesDelMes(mesCalendario);
  const fasesPorDia = new Map();
  fases.forEach((fase) => {
    if (!fasesPorDia.has(fase.instante.getDate())) fasesPorDia.set(fase.instante.getDate(), []);
    fasesPorDia.get(fase.instante.getDate()).push(fase);
  });
  const encabezados = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => `<div class="cab-dia">${d}</div>`).join('');
  let celdas = '<button class="celda-dia otro-mes" aria-hidden="true" tabindex="-1"></button>'.repeat(primerDia);
  for (let dia = 1; dia <= cantidad; dia += 1) {
    const date = fechaDeDia(anio, mes, dia);
    const clave = claveFecha(date);
    const hoy = clave === claveFecha(ahoraVirtual()) ? ' today' : '';
    const retro = retrorogosEnFecha(date).length > 0;
    const marcadoresFase = fasesPorDia.get(dia) || [];
    const icono = marcadoresFase.length ? marcadoresFase[0].icono : iconoDiario(date);
    celdas += `<button class="celda-dia${hoy}" type="button" data-dia="${dia}" aria-label="${formatoFecha(date, { month: 'long' })} ${dia}, ${faseParaFecha(date).nombre}">${retro ? '<i class="marca-roja" title="Retrograde period"></i>' : ''}<span class="numero-dia">${dia}</span><span class="icono-fase">${icono}</span></button>`;
  }
  const listaFases = fases.length ? `<div class="tarjeta"><h2>Main Phases of ${mesCalendario.toLocaleDateString('en-US', { month: 'long' })}</h2>${fases.map((f) => `<div class="fila-dato"><span>${f.icono} ${f.nombre}</span><span>${formatoFecha(f.instante, { day: 'numeric', month: 'short' })} · ${formatoHora(f.instante)}</span></div>`).join('')}</div>` : '';
  const eventosMes = EVENTOS.filter((e) => e.fecha.startsWith(`${anio}-${String(mes + 1).padStart(2, '0')}`));
  const panelEventos = eventosMes.length ? `<div class="tarjeta"><h2>Special Events</h2>${eventosMes.map((e) => `<div class="fila-dato"><span>${e.icono} ${escapar(e.titulo)}</span><span>${fechaCorta(e.fecha)}</span></div>`).join('')}</div>` : '';
  app.innerHTML = `<div class="pantalla-interna">${encabezadoInterno('Lunar Calendar', 'Tap a day to see its symbolic sky.')}
    <section class="detalle"><article class="tarjeta"><div class="mes-cabecera"><button class="flecha-mes" id="mes-anterior" type="button" aria-label="Previous month">‹</button><h2>${mesCalendario.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2><button class="flecha-mes" id="mes-siguiente" type="button" aria-label="Next month">›</button></div><div class="calendario-grid">${encabezados}${celdas}</div><div class="leyenda-cal"><span>🌑 New Moon</span><span>🌓 First Quarter</span><span>🌕 Full Moon</span><span>🌗 Last Quarter</span><span><i class="punto rojo"></i> Retrograde</span></div></article>${listaFases}${panelEventos}</section></div>`;
  enlazarVolver();
  document.getElementById('mes-anterior').addEventListener('click', () => { mesCalendario = new Date(anio, mes - 1, 1); renderCalendario(); });
  document.getElementById('mes-siguiente').addEventListener('click', () => { mesCalendario = new Date(anio, mes + 1, 1); renderCalendario(); });
  app.querySelectorAll('[data-dia]').forEach((boton) => boton.addEventListener('click', () => abrirDia(anio, mes, Number(boton.dataset.dia))));
}

function abrirDia(anio, mes, dia) {
  const date = fechaDeDia(anio, mes, dia);
  const luna = datosDeLuna(date);
  const clave = claveFecha(date);
  const eventos = EVENTOS.filter((evento) => evento.fecha === clave);
  const periodos = retrorogosEnFecha(date);
  const extra = [
    ...eventos.map((evento) => `<p><strong>${evento.icono} ${escapar(evento.titulo)}:</strong> ${escapar(evento.texto)}</p>`),
    ...periodos.map((periodo) => `<p><strong>🔴 ${periodo.simbolo} ${periodo.planeta} retrograde in ${escapar(periodo.signo)}.</strong> Period: ${fechaCorta(periodo.inicio)} to ${fechaCorta(periodo.fin)}.</p>`),
  ];
  modalContenido.innerHTML = `<h2 id="modal-titulo">${formatoFecha(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2><p>${luna.fase.icono} <strong>${luna.fase.nombre}</strong> · ${luna.iluminacion}% illuminated</p><p>${luna.signo.simbolo} Moon in ${luna.signo.nombre}</p>${extra.length ? `<hr>${extra.join('')}` : '<p>No special events or retrogrades are recorded for this date.</p>'}`;
  modal.hidden = false;
  document.getElementById('cerrar-modal').focus();
}
function cerrarModal() { modal.hidden = true; }
document.getElementById('cerrar-modal').addEventListener('click', cerrarModal);
modal.addEventListener('click', (event) => { if (event.target === modal) cerrarModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) cerrarModal(); });

function formatoICS(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const h = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const s = String(date.getUTCSeconds()).padStart(2, '0');
  return `${y}${m}${d}T${h}${min}${s}Z`;
}
function escaparICS(texto) { return texto.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
function descargarCalendario(llena, nueva) {
  const marca = formatoICS(new Date());
  const eventos = [
    { fecha: llena, titulo: 'Full Moon — Portal Místico' },
    { fecha: nueva, titulo: 'New Moon — Portal Místico' },
  ].map((evento, i) => `BEGIN:VEVENT\r\nUID:brujula-lunar-${i}-${formatoICS(evento.fecha)}@elportalmistico.com\r\nDTSTAMP:${marca}\r\nDTSTART:${formatoICS(evento.fecha)}\r\nDTEND:${formatoICS(new Date(evento.fecha.getTime() + 30 * 60000))}\r\nSUMMARY:${escaparICS(evento.titulo)}\r\nBEGIN:VALARM\r\nTRIGGER:-PT1H\r\nACTION:DISPLAY\r\nDESCRIPTION:${escaparICS(evento.titulo)}\r\nEND:VALARM\r\nEND:VEVENT`).join('\r\n');
  const contenido = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lunar Compass//EN\r\nCALSCALE:GREGORIAN\r\n${eventos}\r\nEND:VCALENDAR`;
  const archivo = new Blob([contenido], { type: 'text/calendar;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = 'brujula-lunar.ics';
  document.getElementById('pm-app').append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
}
function textoCompartir() {
  const luna = datosDeLuna(ahoraVirtual());
  return `Today the Moon is in its ${luna.fase.nombre} phase in ${luna.signo.nombre} 🌙 Check your Lunar Compass at elportalmistico.com`;
}
async function compartirLuna() {
  const texto = textoCompartir();
  if (navigator.share) {
    try { await navigator.share({ text: texto, title: 'Lunar Compass' }); return; } catch (error) { if (error?.name === 'AbortError') return; }
  }
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(texto);
    else {
      const area = document.createElement('textarea');
      area.value = texto;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.getElementById('pm-app').append(area); area.select();
      const copiado = document.execCommand('copy'); area.remove();
      if (!copiado) throw new Error('The text could not be copied.');
    }
    mostrarToast('Copied!');
  } catch { mostrarToast('Could not copy; you can select the text to share it.'); }
}
function mostrarToast(texto) {
  const toast = document.getElementById('toast');
  toast.textContent = texto;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
}



function prepararMusica() {
  const audio = (function(){try{var t=window.top;if(t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3');
  audio.loop = true;
  audio.volume = Math.max(0, Math.min(1, 0.3));
  const boton = document.getElementById('boton-musica');
  let activa = false;
  let preferenciaGuardada = false;
  try { preferenciaGuardada = localStorage.getItem('brujula-lunar-musica') === 'activada'; } catch { /* El almacenamiento puede estar bloqueado. */ }
  if (preferenciaGuardada) boton.title = 'Last time you chose to listen to music; tap to turn it on.';
  boton.addEventListener('click', async () => {
    activa = !activa;
    if (activa) {
      try { await audio.play(); } catch { activa = false; }
    } else audio.pause();
    boton.setAttribute('aria-pressed', String(activa));
    boton.setAttribute('aria-label', activa ? 'Pause music' : 'Turn on music');
    boton.textContent = activa ? 'Ⅱ' : '♪';
    boton.title = activa ? 'Pause music' : 'Turn on music';
    preferenciaGuardada = activa;
    try { localStorage.setItem('brujula-lunar-musica', preferenciaGuardada ? 'activada' : 'desactivada'); } catch { /* La app sigue funcionando sin almacenamiento. */ }
  });
}

function iniciarEstrellas() {
  const lienzo = document.getElementById('cielo');
  const host=lienzo.parentElement;const W=()=>host.clientWidth||innerWidth,H=()=>host.clientHeight||innerHeight;
  const contexto = lienzo.getContext('2d');
  let estrellas = [];
  let constelacion = [];
  const ajustar = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    lienzo.width = Math.round(W() * dpr);
    lienzo.height = Math.round(H() * dpr);
    
    contexto.setTransform(dpr, 0, 0, dpr, 0, 0);
    estrellas = Array.from({ length: Math.min(100, Math.floor(W() / 4)) }, () => ({ x: Math.random() * W(), y: Math.random() * H(), r: Math.random() * 1.15 + .25, fase: Math.random() * Math.PI * 2, oro: Math.random() > .88 }));
    constelacion = Array.from({ length: 3 }, () => ({ x: Math.random() * W(), y: Math.random() * H(), dx: 30 + Math.random() * 45, dy: 18 + Math.random() * 40 }));
  };
  ajustar();
  window.addEventListener('resize', ajustar, { passive: true });
  if(window.ResizeObserver) new ResizeObserver(ajustar).observe(host);
  let frame = 0;
  const animar = (t) => {
    if (frame % 2 === 0) {
      contexto.clearRect(0, 0, W(), H());
      contexto.lineWidth = .7;
      contexto.strokeStyle = 'rgba(199,162,75,.13)';
      for (const c of constelacion) {
        contexto.beginPath(); contexto.moveTo(c.x, c.y); contexto.lineTo(c.x + c.dx, c.y + c.dy); contexto.lineTo(c.x + c.dx * 1.7, c.y + c.dy * .65); contexto.stroke();
        contexto.fillStyle = 'rgba(241,213,138,.22)';
        contexto.fillRect(c.x - 1, c.y - 1, 2, 2);
        contexto.fillRect(c.x + c.dx - 1, c.y + c.dy - 1, 2, 2);
      }
      for (const estrella of estrellas) {
        contexto.globalAlpha = .2 + .45 * (1 + Math.sin(t / 2100 + estrella.fase)) / 2;
        contexto.fillStyle = estrella.oro ? '#F1D58A' : '#EEF0FA';
        contexto.beginPath(); contexto.arc(estrella.x, estrella.y, estrella.r, 0, 2 * Math.PI); contexto.fill();
      }
      contexto.globalAlpha = 1;
    }
    frame += 1;
    requestAnimationFrame(animar);
  };
  requestAnimationFrame(animar);
}

prepararMusica();
iniciarEstrellas();
renderInicio();

/* PM-DEEPLINK */
(function(){var id=(window.__PM_START||'');if(!id||!/^[\w-]+$/.test(id))return;var n=0;(function go(){var b=document.querySelector('[data-pantalla="%s"]'.replace('%s',id));if(b){b.click();setTimeout(function(){try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();}catch(e){}},350);return;}if(++n<50)setTimeout(go,100);})();})();
