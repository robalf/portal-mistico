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
  { fecha: '2026-10-04', icono: '🪐', titulo: 'Saturno en oposición', texto: 'Saturno se ve más brillante y grande que en todo el año.' },
  { fecha: '2026-10-10', icono: '🌑', titulo: 'Luna nueva y portal 10/10', texto: 'Día ideal para escribir intenciones.' },
  { fecha: '2026-10-21', icono: '☄️', titulo: 'Lluvia de meteoros Oriónidas', texto: 'Máximo de la lluvia asociada al cometa Halley (21 y 22 de octubre).' },
  { fecha: '2026-10-25', icono: '🌕', titulo: 'Luna llena del Cazador', texto: 'La primera luna llena después de la Luna de Cosecha.' },
  { fecha: '2026-10-31', icono: '🎃', titulo: 'Halloween y Samhain', texto: 'La noche en que, según la tradición, el velo entre los mundos es más fino.' },
];

const EVENTOS = [...EVENTOS_AUTO, ...EVENTOS_MANUALES].sort((a, b) => a.fecha.localeCompare(b.fecha));

const ENERGIAS = [
  'Impulso, valentía y ganas de empezar. Buen día para dar el primer paso.',
  'Calma, placer y estabilidad. Disfruta lo sencillo y cuida tu cuerpo.',
  'Curiosidad y conversación. Ideal para escribir, aprender y conectar.',
  'Emociones a flor de piel. Busca tu hogar, tu gente y tu refugio.',
  'Brillo y creatividad. Exprésate sin miedo y date un gusto.',
  'Orden y detalle. Buen momento para organizar y cuidar tu salud.',
  'Armonía y vínculos. Busca el equilibrio y la belleza a tu alrededor.',
  'Intensidad y verdad. Las emociones profundas salen a la superficie.',
  'Optimismo y aventura. Abre tu mente a algo nuevo.',
  'Disciplina y metas. Construye paso a paso lo que quieres.',
  'Originalidad y libertad. Rompe la rutina y conecta con tu grupo.',
  'Intuición y sueños. Escucha tu interior y deja fluir.',
];

const SIGNIFICADOS_FASE = {
  nueva: 'En la tradición esotérica, la Luna nueva representa una pausa fértil y el inicio de un ciclo. Se asocia con sembrar intenciones y abrirse a nuevas posibilidades.',
  creciente: 'La Luna creciente simboliza el impulso inicial y la confianza para avanzar. La tradición invita a nutrir las ideas que empiezan a tomar forma.',
  cuartoCreciente: 'El cuarto creciente se relaciona con decisiones y desafíos que ayudan a crecer. Es un momento simbólico para sostener el rumbo y superar obstáculos.',
  gibosaCreciente: 'La gibosa creciente invita a revisar, ajustar y tener paciencia antes de culminar. En la tradición esotérica, los pequeños cambios preparan una cosecha más consciente.',
  llena: 'La Luna llena se asocia con culminación, claridad y gratitud. Es un símbolo de plenitud, celebración y liberación de aquello que ya cumplió su ciclo.',
  gibosaMenguante: 'La gibosa menguante representa integración y generosidad. La tradición propone compartir lo aprendido y agradecer lo que el ciclo dejó.',
  cuartoMenguante: 'El cuarto menguante invita a limpiar, ordenar y perdonar. Simbólicamente ayuda a soltar cargas para recuperar espacio y equilibrio.',
  menguante: 'La Luna menguante es un tiempo de pausa, descanso y cierre. La tradición la vincula con recuperar fuerzas antes de una nueva siembra.',
};

const RITUALES = {
  nueva: [
    { titulo: 'Carta a tu nuevo ciclo', intencion: 'Sembrar lo que quieres que crezca este mes.', materiales: 'Papel, bolígrafo y una vela blanca.', pasos: ['Enciende la vela y respira profundo tres veces.', 'Escribe tres deseos en presente, como si ya fueran reales.', 'Dobla el papel y guárdalo hasta la próxima luna llena.'], afirmacion: 'Abro espacio para lo nuevo que llega a mi vida.' },
    { titulo: 'Semillas de intención', intencion: 'Dar un lugar concreto a un deseo que empieza.', materiales: 'Un papel pequeño y un vaso con agua.', pasos: ['Anota una intención breve en el papel.', 'Ponlo junto al vaso y visualiza una semilla despertando.', 'Al terminar, riega una planta con el agua.'], afirmacion: 'Cada comienzo encuentra su propio camino.' },
    { titulo: 'El primer paso', intencion: 'Convertir una idea nueva en una acción sencilla.', materiales: 'Papel y bolígrafo.', pasos: ['Escribe una idea que te ilusione.', 'Debajo, apunta el paso más pequeño que puedas dar.', 'Reserva en tu agenda un momento para hacerlo.'], afirmacion: 'Me permito empezar con confianza y curiosidad.' },
    { titulo: 'Espacio para lo nuevo', intencion: 'Preparar tu entorno y tu ánimo para un nuevo ciclo.', materiales: 'Un cuenco y un poco de agua.', pasos: ['Abre una ventana y respira con calma.', 'Retira un objeto que ya no necesites de tu espacio.', 'Deja el cuenco con agua unos minutos y luego riégala en una planta.'], afirmacion: 'Hago espacio y recibo posibilidades nuevas.' },
  ],
  creciente: [
    { titulo: 'Un paso valiente', intencion: 'Impulsar un deseo con una acción realista.', materiales: 'Papel y bolígrafo.', pasos: ['Elige una meta que quieras alimentar.', 'Escribe una acción posible para hoy.', 'Hazla durante diez minutos sin buscar perfección.'], afirmacion: 'Avanzo a mi ritmo y doy valor a cada paso.' },
    { titulo: 'Riego de proyectos', intencion: 'Dedicar atención constante a algo que está creciendo.', materiales: 'Una planta o un vaso de agua.', pasos: ['Riega una planta con atención.', 'Nombra en voz baja algo que quieras cultivar.', 'Da hoy un pequeño paso hacia ello.'], afirmacion: 'Mi dedicación cotidiana fortalece lo que amo.' },
    { titulo: 'La lista del impulso', intencion: 'Ordenar tus próximos movimientos con entusiasmo sereno.', materiales: 'Papel y bolígrafo.', pasos: ['Anota tres avances que ya hayas logrado.', 'Elige el siguiente paso más sencillo.', 'Ponle un día y una hora para comenzar.'], afirmacion: 'Mi energía crece cuando la dirijo con intención.' },
    { titulo: 'Brújula de confianza', intencion: 'Recordar qué te mueve mientras avanzas.', materiales: 'Un cristal opcional.', pasos: ['Sostén el cristal o apoya las manos en el pecho.', 'Respira y piensa en tu motivo más importante.', 'Escribe una frase para recordar ese motivo.'], afirmacion: 'Confío en el camino que construyo paso a paso.' },
  ],
  cuartoCreciente: [
    { titulo: 'Desatar un nudo', intencion: 'Mirar un obstáculo con claridad y elegir cómo afrontarlo.', materiales: 'Papel y bolígrafo.', pasos: ['Describe el obstáculo en una frase.', 'Anota dos opciones que sí dependen de ti.', 'Elige una y haz hoy su primer movimiento.'], afirmacion: 'Puedo responder a los retos con claridad y valor.' },
    { titulo: 'Decisión en calma', intencion: 'Escuchar tus prioridades antes de tomar una decisión.', materiales: 'Dos hojas pequeñas.', pasos: ['Escribe cada alternativa en una hoja.', 'Respira despacio y nota qué valor importa más para ti.', 'Elige el siguiente paso, no toda la historia.'], afirmacion: 'Decido desde mis valores y confío en mi criterio.' },
    { titulo: 'La piedra del camino', intencion: 'Transformar una dificultad en una oportunidad de aprendizaje.', materiales: 'Una piedra lisa o un cristal.', pasos: ['Sostén la piedra y piensa en un reto actual.', 'Nombra algo que ya aprendiste al atravesarlo.', 'Deja la piedra en un lugar visible como recordatorio.'], afirmacion: 'Tengo recursos para atravesar este momento.' },
    { titulo: 'Límites luminosos', intencion: 'Elegir un límite amable que cuide tu energía.', materiales: 'Papel y bolígrafo.', pasos: ['Escribe qué situación te pide un límite.', 'Formula una respuesta clara y respetuosa.', 'Practícala en voz baja y guárdala para cuando la necesites.'], afirmacion: 'Cuidar mis límites también es cuidar mis vínculos.' },
  ],
  gibosaCreciente: [
    { titulo: 'Ajuste consciente', intencion: 'Perfeccionar con paciencia algo que ya está en marcha.', materiales: 'Papel y bolígrafo.', pasos: ['Elige un proyecto que esté avanzando.', 'Anota una cosa que funciona y una que quieras ajustar.', 'Dedica un rato breve a ese ajuste.'], afirmacion: 'Mejoro con paciencia y reconozco lo que ya florece.' },
    { titulo: 'Pulir la intención', intencion: 'Aclarar qué deseas y qué puedes soltar del plan.', materiales: 'Una vela opcional y papel.', pasos: ['Lee una intención que hayas escrito antes.', 'Tacha lo que ya no se siente verdadero.', 'Reescribe una versión más sencilla y posible.'], afirmacion: 'La paciencia también forma parte de mi avance.' },
    { titulo: 'Pausa para revisar', intencion: 'Hacer una revisión serena antes de culminar.', materiales: 'Un vaso de agua.', pasos: ['Bebe un poco de agua con atención.', 'Repasa tus avances sin juzgarte.', 'Elige una mejora pequeña para el próximo día.'], afirmacion: 'Puedo ajustar el rumbo sin perder mi propósito.' },
    { titulo: 'La obra en proceso', intencion: 'Aceptar el aprendizaje que llega mientras terminas algo.', materiales: 'Papel y bolígrafo.', pasos: ['Escribe algo que hayas aprendido esta semana.', 'Agradece un error que te haya enseñado.', 'Completa una tarea pequeña pendiente.'], afirmacion: 'Cada paso consciente me acerca a una culminación propia.' },
  ],
  llena: [
    { titulo: 'Cuenco de gratitud', intencion: 'Reconocer lo que ha culminado y lo que te sostiene.', materiales: 'Un cuenco y papel.', pasos: ['Escribe tres cosas que agradeces de este ciclo.', 'Dobla los papeles y colócalos en el cuenco.', 'Lee cada una en voz alta y guarda el cuenco.'], afirmacion: 'Honro lo que llega y agradezco lo que permanece.' },
    { titulo: 'Luz para tus cristales', intencion: 'Usar la noche como símbolo de renovación y cuidado.', materiales: 'Un cristal y una ventana segura.', pasos: ['Limpia el cristal con un paño suave.', 'Colócalo en un lugar estable donde pueda recibir luz indirecta.', 'Por la mañana, agradécele el recordatorio de tu intención.'], afirmacion: 'Me abro a la claridad y cuido mi energía con ternura.' },
    { titulo: 'Celebrar lo logrado', intencion: 'Dar valor a una meta alcanzada, grande o pequeña.', materiales: 'Una bebida que disfrutes.', pasos: ['Nombra una cosa que hoy haces mejor que antes.', 'Brinda por tu esfuerzo, aunque el camino siga.', 'Comparte tu alegría con alguien de confianza.'], afirmacion: 'Celebro mi camino y recibo con gratitud lo vivido.' },
    { titulo: 'Soltar bajo la Luna', intencion: 'Despedirte de un hábito o una carga que ya no te acompaña.', materiales: 'Papel y bolígrafo.', pasos: ['Escribe lo que quieres dejar atrás.', 'Respira y reconoce qué te enseñó.', 'Rompe el papel y recíclalo o deséchalo con cuidado.'], afirmacion: 'Suelto con gratitud lo que ya cumplió su propósito.' },
  ],
  gibosaMenguante: [
    { titulo: 'Compartir la cosecha', intencion: 'Poner en común algo valioso que has aprendido.', materiales: 'Ninguno.', pasos: ['Piensa en una enseñanza reciente.', 'Compártela con alguien que pueda apreciarla.', 'Escucha también qué aprendió esa persona.'], afirmacion: 'Lo que comparto con generosidad también me transforma.' },
    { titulo: 'Gracias en voz alta', intencion: 'Agradecer a quien acompañó tu camino.', materiales: 'Papel opcional.', pasos: ['Elige a alguien que te haya apoyado.', 'Envíale un mensaje sincero y concreto.', 'Tómate un instante para recibir su respuesta.'], afirmacion: 'Reconozco los vínculos que hacen más luminoso mi camino.' },
    { titulo: 'La lección del ciclo', intencion: 'Integrar una experiencia antes de cerrar el ciclo.', materiales: 'Papel y bolígrafo.', pasos: ['Escribe una experiencia que te haya cambiado.', 'Anota qué te enseñó sobre tus necesidades.', 'Guarda la nota en un lugar tranquilo.'], afirmacion: 'Integro mis aprendizajes y los llevo conmigo con amor.' },
    { titulo: 'Círculo de aprecio', intencion: 'Celebrar en comunidad los pequeños logros.', materiales: 'Una taza de té o agua.', pasos: ['Invita a alguien a conversar unos minutos.', 'Cada persona nombra algo que agradece.', 'Cierra la charla con un deseo amable para la otra persona.'], afirmacion: 'La gratitud crece cuando encuentra compañía.' },
  ],
  cuartoMenguante: [
    { titulo: 'Orden que libera', intencion: 'Crear espacio físico para sentir más calma.', materiales: 'Una caja o bolsa para donar.', pasos: ['Elige un cajón o una superficie pequeña.', 'Aparta lo que ya no usas ni necesitas.', 'Limpia el espacio y agradece lo que decides soltar.'], afirmacion: 'Al soltar lo innecesario, cuido mi paz.' },
    { titulo: 'Perdón posible', intencion: 'Aflojar el peso de una historia sin apresurar el proceso.', materiales: 'Papel y bolígrafo.', pasos: ['Escribe qué emoción quieres comprender.', 'Nombra qué límite o cuidado necesitas hoy.', 'Guarda la nota como recordatorio de tu propia compasión.'], afirmacion: 'Me doy permiso para sanar a mi propio ritmo.' },
    { titulo: 'Limpieza suave', intencion: 'Renovar un rincón de tu casa con una acción sencilla.', materiales: 'Agua y un paño.', pasos: ['Elige un espacio pequeño y despeja su superficie.', 'Límpialo con calma, prestando atención a tu respiración.', 'Deja allí solo aquello que te resulte útil o querido.'], afirmacion: 'Mi espacio acompaña la calma que estoy cultivando.' },
    { titulo: 'Cerrar con gratitud', intencion: 'Terminar una tarea pendiente y liberar atención.', materiales: 'Papel y bolígrafo.', pasos: ['Anota una tarea que esté ocupando tu mente.', 'Decide si puedes completarla, delegarla o dejarla ir.', 'Da ese paso y tacha la tarea de tu lista.'], afirmacion: 'Cierro lo que puedo y descanso de lo que no me corresponde.' },
  ],
  menguante: [
    { titulo: 'Descanso reparador', intencion: 'Permitir que el cuerpo y la mente recuperen fuerzas.', materiales: 'Una manta o una infusión.', pasos: ['Aparta unos minutos sin pantallas.', 'Respira lentamente y relaja los hombros.', 'Elige una hora amable para ir a descansar.'], afirmacion: 'Descansar también es una forma de avanzar.' },
    { titulo: 'Despedida de ciclo', intencion: 'Reconocer un cierre y dejar de exigirle más.', materiales: 'Papel y bolígrafo.', pasos: ['Escribe qué etapa sientes que termina.', 'Agradece una cosa que te dejó.', 'Guarda o desecha la nota como prefieras.'], afirmacion: 'Honro lo vivido y me permito cerrar en paz.' },
    { titulo: 'Silencio que nutre', intencion: 'Escuchar tu interior sin llenarlo de nuevas tareas.', materiales: 'Un espacio tranquilo.', pasos: ['Siéntate cómodamente durante tres minutos.', 'Observa tus pensamientos sin intentar corregirlos.', 'Anota una palabra que describa cómo te sientes.'], afirmacion: 'En la quietud también encuentro orientación.' },
    { titulo: 'Preparar la siembra', intencion: 'Recuperar claridad antes de elegir una intención nueva.', materiales: 'Papel y bolígrafo.', pasos: ['Haz una lista breve de lo que quieres dejar atrás.', 'Al lado, escribe qué aprendizaje conservas.', 'Guarda la hoja para leerla en tu próximo comienzo.'], afirmacion: 'Me preparo con calma para lo que está por nacer.' },
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
function formatoFecha(date, opciones = {}) { return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', ...opciones }); }
function formatoHora(date) { return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); }
function saludo(date) {
  const hora = date.getHours();
  if (hora >= 5 && hora < 12) return 'Buenos días';
  if (hora >= 12 && hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
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
  return `${dias} días ${horas} horas`;
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
  return `<svg class="dibujo-luna${grande ? ' luna-grande' : ''}" viewBox="-105 -105 210 210" role="img" aria-label="Ilustración de la fase lunar actual">
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
  const mensajes = { 3: '¡Tres días de conexión contigo! Sigue explorando.', 7: '¡Una semana siguiendo el pulso lunar! Qué bonito ritual.', 14: '¡Dos semanas de constancia y curiosidad! Celebra tu camino.', 30: '¡Un mes de visitas! Tu brújula te acompaña ciclo a ciclo.' };
  return mensajes[dias] || '';
}

function renderInicio() {
  pantalla = 'inicio';
  const date = ahoraVirtual();
  const luna = datosDeLuna(date);
  const llena = fechaSiguienteFase(date, 'llena');
  const nueva = fechaSiguienteFase(date, 'nueva');
  const retroFilas = ['Mercurio', 'Venus'].map((planeta) => {
    const activo = retrorogradoActivo(planeta, date);
    return `<div class="retro-fila"><span class="estado"><i class="punto ${activo ? 'rojo' : 'verde'}"></i>${planeta}</span><span class="estado-texto">${activo ? 'Retrógrado' : 'Directo'}</span></div>`;
  }).join('');
  const semana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i, 12);
    return `<div class="dia-mini${i === 0 ? ' hoy' : ''}"><span>${i === 0 ? 'Hoy' : d.toLocaleDateString('es-ES', { weekday: 'short' })}</span><b>${d.getDate()}</b><i aria-label="${escapar(faseParaFecha(d).nombre)}">${iconoDiario(d)}</i></div>`;
  }).join('');
  const ritual = ritualDelDia(date);
  const racha = cargarRacha(date);
  const logro = mensajeRacha(racha);
  app.innerHTML = `
    <div class="barra-superior" aria-hidden="true"></div>
    <header class="encabezado"><h1>Brújula Lunar</h1><p class="fecha">${date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><p class="saludo">${saludo(date)}</p></header>
    ${errorFecha ? '<p class="error-fecha" role="status">La fecha indicada no es válida; mostramos la fecha actual.</p>' : ''}
    <div class="inicio-grid">
      <section class="tarjeta tarjeta-luna"><h2>La Luna de hoy</h2>${lunaSvg(date, true)}<div class="nombre-fase">${luna.fase.nombre}</div>
        <p class="dato-destacado">${luna.iluminacion}% de iluminación · ${luna.signo.simbolo} Luna en ${luna.signo.nombre}</p>
        <div class="mini-contadores"><div class="contador">🌕 Próxima luna llena<strong id="cuenta-llena">${cuentaRegresiva(llena, date)}</strong></div><div class="contador">🌑 Próxima luna nueva<strong id="cuenta-nueva">${cuentaRegresiva(nueva, date)}</strong></div></div>
        <button class="boton-texto" type="button" data-pantalla="luna">Ver más ›</button>
      </section>
      <div class="columna-derecha">
        <section class="tarjeta"><h2>Ritual del día</h2><p class="ritual-titulo">${escapar(ritual.titulo)}</p><p class="ritual-intro">${escapar(ritual.intencion)}</p><button class="boton-texto" type="button" data-pantalla="ritual">Ver ritual ›</button></section>
        <section class="tarjeta"><h2>Retrógrados hoy</h2>${retroFilas}<button class="boton-texto" type="button" data-pantalla="retrogrados">Ver detalles ›</button></section>
        <section class="tarjeta"><h2>Calendario lunar</h2><div class="semana">${semana}</div><button class="boton-texto" type="button" data-pantalla="calendario">Ver mes completo ›</button></section>
      </div>
    </div>
    <section class="accesos"><h2>Hoy también puedes ver</h2><div class="acceso-grid">
      <a class="acceso" href="https://elportalmistico.com/juegos/numerologia.html" target="_top" rel="noopener"><span class="acceso-icono">🔢</span><span><strong>Tu número del día</strong><small>Descubre la vibración numérica de tu día</small></span></a>
      <a class="acceso" href="https://elportalmistico.com/juegos/tarot.html" target="_top" rel="noopener"><span class="acceso-icono">🔮</span><span><strong>Tu carta del día</strong><small>Saca una carta del tarot para hoy</small></span></a>
      <a class="acceso" href="https://elportalmistico.com/juegos/horoscopo.html" target="_top" rel="noopener"><span class="acceso-icono">♈</span><span><strong>Tu horóscopo de hoy</strong><small>Lo que el cielo dice de tu signo</small></span></a>
    </div></section>
    <section class="racha" aria-live="polite"><div class="estrellas-logro" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div><p>🔥 Llevas ${racha} ${racha === 1 ? 'día' : 'días'} seguidos consultando tu Brújula Lunar</p>${logro ? `<p class="felicitacion">${logro}</p>` : ''}</section>
    <footer>Contenido simbólico, con fines de entretenimiento. Los cálculos astronómicos son aproximados.</footer>`;
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

function irArriba() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function navegar(destino) {
  if (!['luna', 'ritual', 'retrogrados', 'calendario'].includes(destino)) return;
  setTimeout(() => {
    window.history.pushState({ brujulaLunar: true, pantalla: destino }, '', window.location.href);
  }, 0);
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
  return `<button type="button" class="boton-volver" data-volver aria-label="Volver al Inicio">‹</button><header class="encabezado-interno"><h1>${titulo}</h1>${subtitulo ? `<p class="fecha">${subtitulo}</p>` : ''}</header>`;
}
function enlazarVolver() {
  const boton = app.querySelector('[data-volver]');
  if (boton) boton.addEventListener('click', () => {
    if (window.history.state?.brujulaLunar) window.history.back();
    else { renderInicio(); irArriba(); }
  });
}
function renderLuna() {
  const date = ahoraVirtual();
  const luna = datosDeLuna(date);
  const llena = fechaSiguienteFase(date, 'llena');
  const nueva = fechaSiguienteFase(date, 'nueva');
  const significado = SIGNIFICADOS_FASE[luna.fase.clave];
  app.innerHTML = `<div class="pantalla-interna">${encabezadoInterno('La Luna de hoy', date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}
    <section class="detalle">
      <article class="tarjeta detalle-luna">${lunaSvg(date, true)}<div class="nombre-fase">${luna.fase.nombre}</div><p class="dato-destacado">${luna.iluminacion}% de iluminación</p>
        <div class="filas-datos"><div class="fila-dato"><span>Edad lunar</span><span>Día ${Math.floor(luna.edad) + 1} del ciclo lunar</span></div><div class="fila-dato"><span>Fase exacta</span><span>${luna.fase.icono} ${luna.fase.nombre}</span></div><div class="fila-dato"><span>Próxima luna llena</span><span>${formatoFecha(llena, { year: 'numeric' })} · ${formatoHora(llena)}</span></div><div class="fila-dato"><span>Cuenta atrás</span><span id="detalle-cuenta-llena">${cuentaRegresiva(llena, date)}</span></div><div class="fila-dato"><span>Próxima luna nueva</span><span>${formatoFecha(nueva, { year: 'numeric' })} · ${formatoHora(nueva)}</span></div><div class="fila-dato"><span>Cuenta atrás</span><span id="detalle-cuenta-nueva">${cuentaRegresiva(nueva, date)}</span></div></div>
        <p class="energia"><strong>${luna.signo.simbolo} Luna en ${luna.signo.nombre}:</strong> ${ENERGIAS[luna.signo.indice]}</p><p class="texto-fase">${significado}</p>
        <p class="texto-fase">La Luna entra en ${luna.signo.siguiente} en aproximadamente ${luna.signo.horasEntrada} horas.</p>
        <div class="acciones"><button class="boton-primario" type="button" id="agregar-calendario">Agregar a mi calendario</button><button class="boton-texto" style="width:auto;margin:0" type="button" id="compartir">Compartir</button></div>
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
  app.innerHTML = `<div class="pantalla-interna">${encabezadoInterno('Ritual del día', `${fase.icono} ${fase.nombre}`)}<section class="detalle">
    <article class="tarjeta ritual-detalle"><h2>${escapar(ritual.titulo)}</h2><p class="intencion"><strong>Intención:</strong> ${escapar(ritual.intencion)}</p><p><strong>Materiales:</strong> ${escapar(ritual.materiales || 'Ninguno; solo necesitas un momento de calma.')}</p><h3>Pasos</h3><ol>${ritual.pasos.map((paso) => `<li>${escapar(paso)}</li>`).join('')}</ol><p class="afirmacion">“${escapar(ritual.afirmacion)}”</p></article>
    <p class="nota-seguridad">Si usas velas o incienso, nunca los dejes encendidos sin vigilancia.</p></section></div>`;
  enlazarVolver();
}

function tarjetaRetro(planeta, fecha) {
  const periodos = RETROGRADOS.filter((p) => p.planeta === planeta);
  const activo = retrorogradoActivo(planeta, fecha);
  const siguiente = proximoPeriodo(planeta, fecha);
  const simbolo = periodos[0]?.simbolo || '';
  const texto = planeta === 'Mercurio'
    ? 'Comunicación, tecnología, viajes y contratos. Consejo: revisar antes de enviar, firmar o comprar.'
    : 'Amor, dinero, belleza y relaciones. Consejo: revisar vínculos y gastos, y evitar decisiones impulsivas en el amor.';
  if (activo) {
    const inicio = fechaLocalDesdeClave(activo.inicio);
    const fin = fechaLocalDesdeClave(activo.fin);
    const total = Math.max(1, diferenciaDias(inicio, fin) + 1);
    const transcurridos = Math.max(0, diferenciaDias(inicio, fecha) + 1);
    const progreso = Math.min(100, Math.round(transcurridos / total * 100));
    const faltan = Math.max(0, diferenciaDias(fecha, fin));
    return `<article class="tarjeta"><h2>${simbolo} ${planeta}</h2><p class="estado-grande"><i class="punto rojo"></i>Retrógrado en ${escapar(activo.signo)}</p><p>Termina el ${fechaCorta(activo.fin)} — faltan ${faltan} ${faltan === 1 ? 'día' : 'días'}.</p><div class="barra-progreso" role="progressbar" aria-label="Progreso de ${planeta} retrógrado" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progreso}"><span style="width:${progreso}%"></span></div><p class="estado-texto">${progreso}% del periodo</p><p>${texto}</p></article>`;
  }
  const proximo = siguiente ? `Próximo retrógrado: ${fechaCorta(siguiente.inicio)} (${escapar(siguiente.signo)}).` : 'Próximas fechas por confirmar.';
  return `<article class="tarjeta"><h2>${simbolo} ${planeta}</h2><p class="estado-grande"><i class="punto verde"></i>Directo</p><p>${proximo}</p><p>${texto}</p></article>`;
}
function renderRetrogrados() {
  const date = ahoraVirtual();
  const mercurio = Boolean(retrorogradoActivo('Mercurio', date));
  const venus = Boolean(retrorogradoActivo('Venus', date));
  app.innerHTML = `<div class="pantalla-interna">${encabezadoInterno('Retrógrados', `Estado simbólico para el ${formatoFecha(date, { year: 'numeric' })}`)}<section class="detalle"><div class="retro-detalle-grid">${tarjetaRetro('Mercurio', date)}${tarjetaRetro('Venus', date)}</div>${mercurio && venus ? '<p class="aviso-doble">✦ Doble retrógrado: un periodo ideal para revisar el pasado antes de decidir el futuro.</p>' : ''}<p class="nota-seguridad">Las fechas de esta guía son orientativas y se limitan a los periodos cargados.</p></section></div>`;
  enlazarVolver();
}

function fasesDelMes(date) {
  const fasesPrincipales = [
    { edad: 0, nombre: 'Luna nueva', icono: '🌑' },
    { edad: CICLO_LUNAR * .25, nombre: 'Cuarto creciente', icono: '🌓' },
    { edad: CICLO_LUNAR * .5, nombre: 'Luna llena', icono: '🌕' },
    { edad: CICLO_LUNAR * .75, nombre: 'Cuarto menguante', icono: '🌗' },
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
  const encabezados = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => `<div class="cab-dia">${d}</div>`).join('');
  let celdas = '<button class="celda-dia otro-mes" aria-hidden="true" tabindex="-1"></button>'.repeat(primerDia);
  for (let dia = 1; dia <= cantidad; dia += 1) {
    const date = fechaDeDia(anio, mes, dia);
    const clave = claveFecha(date);
    const hoy = clave === claveFecha(ahoraVirtual()) ? ' hoy' : '';
    const retro = retrorogosEnFecha(date).length > 0;
    const marcadoresFase = fasesPorDia.get(dia) || [];
    const icono = marcadoresFase.length ? marcadoresFase[0].icono : iconoDiario(date);
    celdas += `<button class="celda-dia${hoy}" type="button" data-dia="${dia}" aria-label="${dia} de ${formatoFecha(date, { month: 'long' })}, ${faseParaFecha(date).nombre}">${retro ? '<i class="marca-roja" title="Periodo retrógrado"></i>' : ''}<span class="numero-dia">${dia}</span><span class="icono-fase">${icono}</span></button>`;
  }
  const listaFases = fases.length ? `<div class="tarjeta"><h2>Fases principales de ${mesCalendario.toLocaleDateString('es-ES', { month: 'long' })}</h2>${fases.map((f) => `<div class="fila-dato"><span>${f.icono} ${f.nombre}</span><span>${formatoFecha(f.instante, { day: 'numeric', month: 'short' })} · ${formatoHora(f.instante)}</span></div>`).join('')}</div>` : '';
  const eventosMes = EVENTOS.filter((e) => e.fecha.startsWith(`${anio}-${String(mes + 1).padStart(2, '0')}`));
  const panelEventos = eventosMes.length ? `<div class="tarjeta"><h2>Eventos especiales</h2>${eventosMes.map((e) => `<div class="fila-dato"><span>${e.icono} ${escapar(e.titulo)}</span><span>${fechaCorta(e.fecha)}</span></div>`).join('')}</div>` : '';
  app.innerHTML = `<div class="pantalla-interna">${encabezadoInterno('Calendario lunar', 'Toca un día para consultar su cielo simbólico.')}
    <section class="detalle"><article class="tarjeta"><div class="mes-cabecera"><button class="flecha-mes" id="mes-anterior" type="button" aria-label="Mes anterior">‹</button><h2>${mesCalendario.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h2><button class="flecha-mes" id="mes-siguiente" type="button" aria-label="Mes siguiente">›</button></div><div class="calendario-grid">${encabezados}${celdas}</div><div class="leyenda-cal"><span>🌑 Luna nueva</span><span>🌓 Cuarto creciente</span><span>🌕 Luna llena</span><span>🌗 Cuarto menguante</span><span><i class="punto rojo"></i> Retrógrado</span></div></article>${listaFases}${panelEventos}</section></div>`;
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
    ...periodos.map((periodo) => `<p><strong>🔴 ${periodo.simbolo} ${periodo.planeta} retrógrado en ${escapar(periodo.signo)}.</strong> Periodo del ${fechaCorta(periodo.inicio)} al ${fechaCorta(periodo.fin)}.</p>`),
  ];
  modalContenido.innerHTML = `<h2 id="modal-titulo">${formatoFecha(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2><p>${luna.fase.icono} <strong>${luna.fase.nombre}</strong> · ${luna.iluminacion}% de iluminación</p><p>${luna.signo.simbolo} Luna en ${luna.signo.nombre}</p>${extra.length ? `<hr>${extra.join('')}` : '<p>No hay eventos especiales ni retrógrados registrados para esta fecha.</p>'}`;
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
    { fecha: llena, titulo: 'Luna llena — Portal Místico' },
    { fecha: nueva, titulo: 'Luna nueva — Portal Místico' },
  ].map((evento, i) => `BEGIN:VEVENT\r\nUID:brujula-lunar-${i}-${formatoICS(evento.fecha)}@elportalmistico.com\r\nDTSTAMP:${marca}\r\nDTSTART:${formatoICS(evento.fecha)}\r\nDTEND:${formatoICS(new Date(evento.fecha.getTime() + 30 * 60000))}\r\nSUMMARY:${escaparICS(evento.titulo)}\r\nBEGIN:VALARM\r\nTRIGGER:-PT1H\r\nACTION:DISPLAY\r\nDESCRIPTION:${escaparICS(evento.titulo)}\r\nEND:VALARM\r\nEND:VEVENT`).join('\r\n');
  const contenido = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Brújula Lunar//ES\r\nCALSCALE:GREGORIAN\r\n${eventos}\r\nEND:VCALENDAR`;
  const archivo = new Blob([contenido], { type: 'text/calendar;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = 'brujula-lunar.ics';
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
}
function textoCompartir() {
  const luna = datosDeLuna(ahoraVirtual());
  return `Hoy la Luna está en ${luna.fase.nombre} en ${luna.signo.nombre} 🌙 Consulta tu Brújula Lunar en elportalmistico.com`;
}
async function compartirLuna() {
  const texto = textoCompartir();
  if (navigator.share) {
    try { await navigator.share({ text: texto, title: 'Brújula Lunar' }); return; } catch (error) { if (error?.name === 'AbortError') return; }
  }
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(texto);
    else {
      const area = document.createElement('textarea');
      area.value = texto;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.append(area); area.select();
      const copiado = document.execCommand('copy'); area.remove();
      if (!copiado) throw new Error('No se pudo copiar el texto.');
    }
    mostrarToast('¡Copiado!');
  } catch { mostrarToast('No se pudo copiar; puedes seleccionar el texto para compartirlo.'); }
}
function mostrarToast(texto) {
  const toast = document.getElementById('toast');
  toast.textContent = texto;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
}

window.addEventListener('popstate', () => {
  if (pantalla !== 'inicio') { renderInicio(); irArriba(); }
});

function prepararMusica() {
  const audio = (function(){try{var t=window.top;if(t!==window&&t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3');
  audio.loop = true;
  audio.volume = Math.max(0, Math.min(1, 0.3));
  const boton = document.getElementById('boton-musica');
  let activa = false;
  let preferenciaGuardada = false;
  try { preferenciaGuardada = localStorage.getItem('brujula-lunar-musica') === 'activada'; } catch { /* El almacenamiento puede estar bloqueado. */ }
  if (preferenciaGuardada) boton.title = 'La última vez elegiste escuchar música; toca para activarla.';
  boton.addEventListener('click', async () => {
    activa = !activa;
    if (activa) {
      try { await audio.play(); } catch { activa = false; }
    } else audio.pause();
    boton.setAttribute('aria-pressed', String(activa));
    boton.setAttribute('aria-label', activa ? 'Pausar música' : 'Activar música');
    boton.textContent = activa ? 'Ⅱ' : '♪';
    boton.title = activa ? 'Pausar música' : 'Activar música';
    preferenciaGuardada = activa;
    try { localStorage.setItem('brujula-lunar-musica', preferenciaGuardada ? 'activada' : 'desactivada'); } catch { /* La app sigue funcionando sin almacenamiento. */ }
  });
}

function iniciarEstrellas() {
  const lienzo = document.getElementById('cielo');
  const contexto = lienzo.getContext('2d');
  let estrellas = [];
  let constelacion = [];
  const ajustar = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    lienzo.width = Math.round(window.innerWidth * dpr);
    lienzo.height = Math.round(window.innerHeight * dpr);
    lienzo.style.width = `${window.innerWidth}px`;
    lienzo.style.height = `${window.innerHeight}px`;
    contexto.setTransform(dpr, 0, 0, dpr, 0, 0);
    estrellas = Array.from({ length: Math.min(100, Math.floor(window.innerWidth / 4)) }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: Math.random() * 1.15 + .25, fase: Math.random() * Math.PI * 2, oro: Math.random() > .88 }));
    constelacion = Array.from({ length: 3 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, dx: 30 + Math.random() * 45, dy: 18 + Math.random() * 40 }));
  };
  ajustar();
  window.addEventListener('resize', ajustar, { passive: true });
  let frame = 0;
  const animar = (t) => {
    if (frame % 2 === 0) {
      contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
(function(){var id=decodeURIComponent((location.hash||'').slice(1));if(!id||!/^[\w-]+$/.test(id))return;var n=0;(function go(){var b=document.querySelector('[data-pantalla="%s"]'.replace('%s',id));if(b){b.click();setTimeout(function(){try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();window.scrollTo(0,0);if(window.parent!==window)window.parent.scrollTo(0,0);}catch(e){}},350);return;}if(++n<50)setTimeout(go,100);})();})();
