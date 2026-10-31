export const CICLO_LUNAR = 29.530588853;
export const MILISEGUNDOS_DIA = 86400000;
export const REFERENCIA_LUNA_NUEVA = Date.UTC(2000, 0, 6, 18, 14);
export const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
export const SIMBOLOS_SIGNOS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
export const FASES = [
  { nombre: 'Luna nueva', icono: '🌑', inicio: 0, fin: 1.84, clave: 'nueva' },
  { nombre: 'Luna creciente', icono: '🌒', inicio: 1.84, fin: 5.53, clave: 'creciente' },
  { nombre: 'Cuarto creciente', icono: '🌓', inicio: 5.53, fin: 9.22, clave: 'cuartoCreciente' },
  { nombre: 'Gibosa creciente', icono: '🌔', inicio: 9.22, fin: 12.91, clave: 'gibosaCreciente' },
  { nombre: 'Luna llena', icono: '🌕', inicio: 12.91, fin: 16.61, clave: 'llena' },
  { nombre: 'Gibosa menguante', icono: '🌖', inicio: 16.61, fin: 20.30, clave: 'gibosaMenguante' },
  { nombre: 'Cuarto menguante', icono: '🌗', inicio: 20.30, fin: 23.99, clave: 'cuartoMenguante' },
  { nombre: 'Luna menguante', icono: '🌘', inicio: 23.99, fin: 27.68, clave: 'menguante' },
  { nombre: 'Luna nueva', icono: '🌑', inicio: 27.68, fin: CICLO_LUNAR, clave: 'nueva' },
];
const RADIANES = Math.PI / 180;

export function diasDesdeReferencia(date) {
  return (date.getTime() - REFERENCIA_LUNA_NUEVA) / MILISEGUNDOS_DIA;
}

export function edadLunar(date) {
  const d = diasDesdeReferencia(date);
  return ((d % CICLO_LUNAR) + CICLO_LUNAR) % CICLO_LUNAR;
}

export function porcentajeIluminacion(date) {
  const edad = edadLunar(date);
  return Math.round((1 - Math.cos(2 * Math.PI * edad / CICLO_LUNAR)) / 2 * 100);
}

export function faseLunar(date) {
  const edad = edadLunar(date);
  return FASES.find((fase) => edad >= fase.inicio && edad < fase.fin) || FASES[0];
}

export function instantesFase(date, objetivoEdad) {
  const mesInicio = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  const mesFin = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
  const cicloMs = CICLO_LUNAR * MILISEGUNDOS_DIA;
  const primero = Math.floor((mesInicio - REFERENCIA_LUNA_NUEVA) / cicloMs) - 1;
  const eventos = [];
  for (let k = primero; ; k += 1) {
    const instante = new Date(REFERENCIA_LUNA_NUEVA + (k * CICLO_LUNAR + objetivoEdad) * MILISEGUNDOS_DIA);
    if (instante.getTime() >= mesFin) break;
    if (instante.getTime() >= mesInicio) eventos.push(instante);
  }
  return eventos;
}

export function proximaLunaNueva(date) {
  const edad = edadLunar(date);
  return new Date(date.getTime() + (CICLO_LUNAR - edad) * MILISEGUNDOS_DIA);
}

export function proximaLunaLlena(date) {
  const edad = edadLunar(date);
  const dias = edad < 14.765294 ? 14.765294 - edad : 44.295883 - edad;
  return new Date(date.getTime() + dias * MILISEGUNDOS_DIA);
}

export function longitudLunar(date) {
  const d = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / MILISEGUNDOS_DIA;
  const L = 218.316 + 13.176396 * d;
  const M = 134.963 + 13.064993 * d;
  const F = 93.272 + 13.229350 * d;
  const D = 297.850 + 12.190749 * d;
  const Msol = 357.529 + 0.98560028 * d;
  const longitud = L
    + 6.289 * Math.sin(M * RADIANES)
    + 1.274 * Math.sin((2 * D - M) * RADIANES)
    + 0.658 * Math.sin((2 * D) * RADIANES)
    + 0.214 * Math.sin((2 * M) * RADIANES)
    - 0.186 * Math.sin(Msol * RADIANES)
    - 0.114 * Math.sin((2 * F) * RADIANES);
  return ((longitud % 360) + 360) % 360;
}

export function signoLunar(date) {
  const longitud = longitudLunar(date);
  const indice = Math.floor(longitud / 30);
  const gradosHastaEntrada = 30 - (longitud % 30);
  const horas = Math.max(0, Math.round(gradosHastaEntrada / 13.18 * 24));
  return { indice, nombre: SIGNOS[indice], simbolo: SIMBOLOS_SIGNOS[indice], longitud, horasEntrada: horas, siguiente: SIGNOS[(indice + 1) % 12] };
}

export function crearFechaPrueba(search, horaBase = new Date()) {
  const texto = new URLSearchParams(search).get('fecha');
  if (!texto || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return { fecha: new Date(horaBase), error: false };
  const [anio, mes, dia] = texto.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia, horaBase.getHours(), horaBase.getMinutes(), horaBase.getSeconds(), horaBase.getMilliseconds());
  if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) return { fecha: new Date(horaBase), error: true };
  return { fecha, error: false };
}

export function claveFecha(date) {
  const anio = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function edadEnInstante(date) {
  return edadLunar(date);
}
