/* Portal Místico · núcleo de cálculo (funciones puras, sin DOM).
   - Matriz del Destino (método de N. Ladini, reducción a 22 arcanos)
   - Nodos lunares: nodo medio (Meeus, Astronomical Algorithms, cap. 47) y nodo verdadero
     osculante (vector de estado de la Luna con Astronomy Engine)
   - Lilith / Luna Negra media (apogeo lunar medio, Meeus cap. 50 + 180°)
   - Retorno de Saturno (longitud eclíptica geocéntrica de Saturno con Astronomy Engine)
   - Kin maya: Tzolkin tradicional (correlación GMT 584283) y Encantamiento del Sueño (Argüelles)
   Astronomy Engine (MIT, Don Cross) se inyecta: window.Astronomy en el navegador o require() en Node. */

export const norm360 = x => ((x % 360) + 360) % 360;
const rad = d => d * Math.PI / 180;

/* ---------- utilidades de fecha ---------- */
export function jdnFromYMD(y, m, d) { // número de día juliano (calendario gregoriano)
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
export function jdFromUTC(date) { return date.getTime() / 86400000 + 2440587.5; }
export function centuriesJ2000(date) { return (jdFromUTC(date) - 2451545.0) / 36525; }
export function validDate(y, m, d) {
  if (!(y >= 1 && m >= 1 && m <= 12 && d >= 1)) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
/* fecha y hora locales + desfase UTC en horas (p. ej. -5) -> Date UTC */
export function toUTC(y, m, d, hh = 12, mi = 0, tz = 0) {
  return new Date(Date.UTC(y, m - 1, d, hh, mi) - tz * 3600000);
}

/* ---------- zodiaco ---------- */
export function zodiac(lon) {
  const L = norm360(lon), sign = Math.floor(L / 30), inSign = L - sign * 30;
  let deg = Math.floor(inSign), min = Math.round((inSign - deg) * 60);
  if (min === 60) { min = 0; deg += 1; }
  return { lon: L, sign, deg, min };
}

/* ---------- Matriz del Destino ---------- */
export const digitSum = n => String(Math.abs(n)).split('').reduce((s, c) => s + (+c), 0);
export function reduce22(n) { while (n > 22) n = digitSum(n); return n === 0 ? 22 : n; }
export function destinyMatrix(y, m, d) {
  const A = reduce22(d), B = reduce22(m), C = reduce22(digitSum(y));
  const D = reduce22(A + B + C), E = reduce22(A + B + C + D);
  const F = reduce22(A + B), G = reduce22(B + C), H = reduce22(C + D), I = reduce22(D + A);
  const sky = reduce22(B + D), earth = reduce22(A + C), personal = reduce22(sky + earth);
  const male = reduce22(F + H), female = reduce22(G + I), social = reduce22(male + female);
  const spiritual = reduce22(personal + social);
  // canal de dinero y de amor (puntos más usados): entre centro y C / D
  const money = reduce22(E + C), love = reduce22(E + D);
  return { A, B, C, D, E, F, G, H, I, sky, earth, personal, male, female, social, spiritual, money, love };
}
export function coupleMatrix(m1, m2) {
  const out = {};
  for (const k of Object.keys(m1)) out[k] = reduce22(m1[k] + m2[k]);
  return out;
}

/* ---------- Nodos lunares ---------- */
export function meanNode(date) { // Meeus 47.7, grados, eclíptica media de la fecha
  const T = centuriesJ2000(date);
  return norm360(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441 - T * T * T * T / 60616000);
}
export function meeusTrueNode(date) { // Meeus p. 344 (corrección periódica principal)
  const T = centuriesJ2000(date);
  const D = rad(297.8501921 + 445267.1114034 * T), M = rad(357.5291092 + 35999.0502909 * T);
  const Mp = rad(134.9633964 + 477198.8675055 * T), F = rad(93.2720950 + 483202.0175233 * T);
  return norm360(meanNode(date) - 1.4979 * Math.sin(2 * (D - F)) - 0.1500 * Math.sin(M)
    + 0.1226 * Math.sin(2 * D) + 0.1176 * Math.sin(2 * F) - 0.0801 * Math.sin(2 * (Mp - F)));
}
export function trueNode(A, date) { // nodo osculante: plano instantáneo de la órbita lunar
  const t = A.MakeTime(date);
  const st = A.RotateState(A.Rotation_EQJ_ECT(t), A.GeoMoonState(t));
  const hx = st.y * st.vz - st.z * st.vy, hy = st.z * st.vx - st.x * st.vz;
  return norm360(Math.atan2(hx, -hy) * 180 / Math.PI);
}
/* fechas en que el nodo medio vuelve a la posición natal (retornos nodales, ~18,6 años) */
export function nodalReturns(date, count = 5, offset = 0) { // offset 180 = inversión nodal
  const target = norm360(meanNode(date) - offset), out = [];
  const rate = 1934.1362891 / 36525; // grados/día (retrógrado)
  for (let k = 1; k <= count; k++) {
    let t = new Date(date.getTime() + ((k - 1) * 360 + (offset || 360)) / rate * 86400000);
    for (let i = 0; i < 6; i++) { // Newton
      let diff = norm360(meanNode(t) - target); if (diff > 180) diff -= 360;
      t = new Date(t.getTime() + diff / rate * 86400000);
    }
    out.push(t);
  }
  return out;
}

/* ---------- Lilith (Luna Negra media) ---------- */
export function meanLilith(date) {
  const T = centuriesJ2000(date);
  const perigee = 83.3532465 + 4069.0137287 * T - 0.0103200 * T * T - T * T * T / 80053 + T * T * T * T / 18999000;
  return norm360(perigee + 180);
}
export function lilithReturns(date, count = 6) { // ciclo ~8,85 años (directo)
  const l0 = meanLilith(date), out = [], rate = 4069.0137287 / 36525;
  for (let k = 1; k <= count; k++) {
    let t = new Date(date.getTime() + k * 360 / rate * 86400000);
    for (let i = 0; i < 6; i++) {
      let diff = norm360(meanLilith(t) - l0); if (diff > 180) diff -= 360;
      t = new Date(t.getTime() - diff / rate * 86400000);
    }
    out.push(t);
  }
  return out;
}

/* ---------- Saturno ---------- */
export function saturnLon(A, date) {
  const t = A.MakeTime(date);
  return norm360(A.Ecliptic(A.GeoVector(A.Body.Saturn, t, true)).elon);
}
/* todos los pasos exactos de Saturno por su grado natal entre fromYears y toYears de edad */
export function saturnPasses(A, birth, natal, fromYears, toYears) {
  const DAY = 86400000, step = 2 * DAY, out = [];
  const f = t => { let x = norm360(saturnLon(A, new Date(t)) - natal); if (x > 180) x -= 360; return x; };
  let t0 = birth.getTime() + fromYears * 365.2425 * DAY, end = birth.getTime() + toYears * 365.2425 * DAY;
  let f0 = f(t0);
  for (let t1 = t0 + step; t1 <= end; t1 += step) {
    const f1 = f(t1);
    if (f0 !== 0 && Math.sign(f0) !== Math.sign(f1) && Math.abs(f0 - f1) < 20) {
      let a = t1 - step, b = t1, fa = f0;
      for (let i = 0; i < 40; i++) { const mid = (a + b) / 2, fm = f(mid); if (Math.sign(fm) === Math.sign(fa)) { a = mid; fa = fm; } else b = mid; }
      out.push({ date: new Date((a + b) / 2), direct: f1 > f0 });
    }
    f0 = f1;
  }
  return out;
}
export function saturnReturns(A, birth) {
  const natal = saturnLon(A, birth);
  return {
    natal,
    returns: [[26, 32], [55, 62], [84, 92]].map(([a, b]) => saturnPasses(A, birth, natal, a, b))
  };
}

/* ---------- Kin maya ---------- */
export const GMT = 584283;
export function tzolkinTraditional(y, m, d) { // 21-12-2012 = 4 Ajaw (13.0.0.0.0)
  const days = jdnFromYMD(y, m, d) - GMT;
  const number = (((days + 3) % 13) + 13) % 13 + 1;
  const sign = (((days + 19) % 20) + 20) % 20; // 0 = Imix ... 19 = Ajaw
  let kin = 0; for (let k = 1; k <= 260; k++) if ((k - 1) % 13 + 1 === number && (k - 1) % 20 === sign) { kin = k; break; }
  return { number, sign, kin };
}
export function dreamspellKin(y, m, d) { // 26-07-2013 = Kin 164; el 29 de febrero no cuenta (= 28 feb)
  if (m === 2 && d === 29) d = 28;
  const leapsBetween = (a, b) => { // nº de 29 de febrero en [a, b) (días JDN)
    let c = 0; const ya = Math.min(a.y, b.y) - 1, yb = Math.max(a.y, b.y) + 1;
    for (let yy = ya; yy <= yb; yy++) {
      const isLeap = (yy % 4 === 0 && yy % 100 !== 0) || yy % 400 === 0; if (!isLeap) continue;
      const j = jdnFromYMD(yy, 2, 29); if (j >= Math.min(a.j, b.j) && j < Math.max(a.j, b.j)) c++;
    }
    return c;
  };
  const ref = { y: 2013, j: jdnFromYMD(2013, 7, 26) }, cur = { y, j: jdnFromYMD(y, m, d) };
  let diff = cur.j - ref.j;
  diff += diff >= 0 ? -leapsBetween(ref, cur) : leapsBetween(cur, ref);
  const kin = ((((164 - 1 + diff) % 260) + 260) % 260) + 1;
  return { kin, seal: (kin - 1) % 20 + 1, tone: (kin - 1) % 13 + 1 };
}
/* oráculo del Encantamiento del Sueño: guía, análogo, antípoda, oculto */
export function dreamspellOracle(kin) {
  const seal = (kin - 1) % 20 + 1, tone = (kin - 1) % 13 + 1, w = s => ((s - 1 + 200) % 20) + 1;
  const analog = w(19 - seal), antipode = w(seal + 10), occult = w(21 - seal);
  const guideOffset = [0, 12, 4, 16, 8][(tone - 1) % 5];
  const guide = w(seal + guideOffset);
  return { guide, analog, antipode, occult, occultKin: 261 - kin };
}
