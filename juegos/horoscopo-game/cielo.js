// Compone las lecturas a partir del cielo real (posiciones calculadas con astronomy-engine, ver cielo-data.js).
import { CIELO } from './cielo-data.js?v=2';
import { SIGNOS, CASA, LUNA_CASA, CONSEJO_CASA, LUNA_SIGNO, FASES, FASE_EXACTA, PLANETA, ASPECTO, RETRO, SOL_CASA } from './cielo-textos.js';

const IDX = { L:0, S:1, Me:2, V:3, Ma:4, J:5, Sa:6 };
const N = CIELO.dias.length;
const T0 = Date.UTC(...CIELO.inicio.split('-').map((v,i)=> i===1 ? +v-1 : +v));
const MS = 86400000;

const key = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function idxOf(d){ return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - T0) / MS); }
const dateOf = i => { const t = new Date(T0 + i*MS); return new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()); };
const inRange = i => i >= 1 && i < N - 1;
const lon = (i,k) => CIELO.dias[i][IDX[k]] / 10;
const sign = (i,k) => Math.floor(lon(i,k) / 30);
const house = (planetSign, mySign) => ((planetSign - mySign + 12) % 12) + 1;
const retro = (i,k) => { const a = lon(i-1,k), b = lon(i+1,k); return ((b - a + 540) % 360) - 180 < 0; };
const wrap = x => ((x % 360) + 360) % 360;
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return Math.abs(h); };
const pick = (arr, n) => arr[((n % arr.length) + arr.length) % arr.length];
const fmt = (d, o) => d.toLocaleDateString('es-ES', o);
const diaLargo = d => fmt(d, { weekday:'long', day:'numeric' });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function phaseOf(i){
  const e = wrap(lon(i,'L') - lon(i,'S'));
  return { fase: Math.floor(((e + 22.5) % 360) / 45), pct: Math.round((1 - Math.cos(e * Math.PI / 180)) / 2 * 100) };
}

// eventos de fase exacta por día (fecha UTC) -> {q:0..3, signo}
const EVT = new Map();
for (const [iso, q] of CIELO.fases) EVT.set(iso.slice(0,10), q);
function exactPhase(i){
  const q = EVT.get(key(dateOf(i)).replace(/^(\d+)-(\d+)-(\d+)$/, '$1-$2-$3'));
  if (q === undefined) return null;
  const s = sign(i,'S');
  return { q, signo: [s, (s+3)%12, (s+6)%12, (s+9)%12][q] };
}

function bestAspect(i){
  let best = null;
  for (const k of ['Me','V','Ma','J','Sa']){
    let d = Math.abs(lon(i,'L') - lon(i,k)); if (d > 180) d = 360 - d;
    for (const a of [0,60,90,120,180]){
      const orb = Math.abs(d - a);
      if (orb <= 4 && (!best || orb < best.orb)) best = { k, a, orb };
    }
  }
  return best;
}

// ---------- DÍA ----------
function dia(i, s, variant, futuro){
  const base = hash(SIGNOS[s] + key(dateOf(i)));
  const v = variant + base;
  const m = sign(i,'L'), h = house(m, s), c = CASA[h];
  const sg = SIGNOS[m];
  const intro = pick([
    `La Luna ${futuro ? 'recorrerá mañana' : 'recorre hoy'} ${sg}, tu casa ${h}, el área de ${c.t}.`,
    `Con la Luna en ${sg} ${futuro ? 'mañana ' : ''}—tu casa ${h}— el foco cae sobre ${c.t}.`,
    `${futuro ? 'Mañana' : 'Hoy'} el cielo se concentra en ${c.t}: la Luna transita ${sg}, tu casa ${h}.`
  ], v);
  const p1 = `${intro} ${pick(LUNA_CASA[h], v + 1)}`;

  const ph = phaseOf(i), ex = exactPhase(i);
  let fase;
  if (ex){
    const hh = house(ex.signo, s);
    fase = FASE_EXACTA[ex.q](SIGNOS[ex.signo], hh, CASA[hh].t);
    if (futuro) fase = fase.replace(/^Hoy/, 'Mañana');
  } else fase = `${FASES[ph.fase].n} (${ph.pct}% iluminada). ${FASES[ph.fase].t}`;
  const p2 = `${LUNA_SIGNO[m]} ${fase}`;

  const extra = [];
  const asp = bestAspect(i);
  if (asp){ const P = PLANETA[asp.k]; extra.push(pick(ASPECTO[asp.a], v)(P.n, P.t)); }
  let nr = 0;
  for (const k of ['Me','V','Ma']){
    if (nr < 2 && retro(i,k)){ const sk = sign(i,k), hk = house(sk, s); extra.push(RETRO[k](SIGNOS[sk], hk, CASA[hk].t)); nr++; }
  }
  const p3 = extra.join(' ');
  const p4 = `Consejo ${futuro ? 'para mañana' : 'del día'}: ${pick(CONSEJO_CASA[h], v)}`;

  const rets = ['Me','V','Ma'].filter(k => retro(i,k)).map(k => PLANETA[k].n + ' retrógrado' + (k==='V' ? '' : ''));
  const sunSg = SIGNOS[sign(i,'S')];
  return {
    parrafos: [p1, p2, p3, p4].filter(Boolean),
    insights: [
      ['Luna', `${sg} · ${FASES[ph.fase].n.replace('Luna ','')} ${ph.pct}%`],
      ['Tu casa activa', `${h} · ${c.n}`],
      ['Cielo', rets.length ? rets.join(', ').replace('Venus retrógrado','Venus retrógrada') : `Sol en ${sunSg}, sin retrógrados personales`]
    ]
  };
}

// ---------- SEMANA ----------
function semana(i0, s, variant){
  const v = variant + hash(SIGNOS[s] + key(dateOf(i0)));
  const idxs = [0,1,2,3,4,5,6].map(n => i0 + n);
  const mid = i0 + 3;
  const sS = sign(i0,'S'), hS = house(sS, s);
  let p1 = `El Sol ilumina esta semana ${SIGNOS[sS]}, tu casa ${hS}: ${CASA[hS].t}. ${SOL_CASA[hS]}`;
  const ing = idxs.find(i => sign(i,'S') !== sS);
  if (ing){ const s2 = sign(ing,'S'), h2 = house(s2, s); p1 += ` El ${diaLargo(dateOf(ing))} el Sol entra en ${SIGNOS[s2]} (tu casa ${h2}) y el ambiente se orienta hacia ${CASA[h2].t}.`; }

  const planetas = [];
  for (const k of ['Me','V','Ma']){
    const sk = sign(mid,k), hk = house(sk, s), P = PLANETA[k], r = retro(mid,k);
    let t = `${P.n}${r ? (k==='V' ? ' retrógrada' : ' retrógrado') : ''} en ${SIGNOS[sk]}, en tu casa ${hk}: ${P.rol(CASA[hk].t)}.`;
    const ch = idxs.find(i => sign(i,k) !== sign(i0,k));
    if (ch){ const s2 = sign(ch,k); t += ` (Cambia a ${SIGNOS[s2]} el ${diaLargo(dateOf(ch))}.)`; }
    planetas.push(t);
  }
  const p2 = planetas.join(' ');

  const ev = [];
  for (const i of idxs){ const ex = exactPhase(i); if (ex){ const hh = house(ex.signo, s); ev.push(`${cap(diaLargo(dateOf(i)))}: ${['Luna nueva','Cuarto creciente','Luna llena','Cuarto menguante'][ex.q]} en ${SIGNOS[ex.signo]} (tu casa ${hh}, ${CASA[hh].n.toLowerCase()})`); } }
  let fav = null, tens = null;
  for (const i of idxs){
    for (const k of ['V','J']){ let d = Math.abs(lon(i,'L') - lon(i,k)); if (d > 180) d = 360 - d;
      for (const a of [0,60,120]){ const o = Math.abs(d - a); if (o <= 3 && (!fav || o < fav.o)) fav = { i, k, a, o }; } }
    for (const k of ['Ma','Sa']){ let d = Math.abs(lon(i,'L') - lon(i,k)); if (d > 180) d = 360 - d;
      for (const a of [90,180]){ const o = Math.abs(d - a); if (o <= 3 && (!tens || o < tens.o)) tens = { i, k, a, o }; } }
  }
  const aspName = a => a===0 ? 'conjunción' : a===60 ? 'sextil' : a===120 ? 'trígono' : a===90 ? 'cuadratura' : 'oposición';
  const p3parts = [];
  if (ev.length) p3parts.push(`Fechas lunares clave: ${ev.join('; ')}.`);
  if (fav) p3parts.push(`El día más amable parece el ${diaLargo(dateOf(fav.i))}, con la Luna en ${aspName(fav.a)} con ${PLANETA[fav.k].n}.`);
  if (tens) p3parts.push(`Pide más calma el ${diaLargo(dateOf(tens.i))}, cuando la Luna forma ${aspName(tens.a)} con ${PLANETA[tens.k].n}.`);
  const p3 = p3parts.join(' ');
  const p4 = `Consejo de la semana: ${pick(CONSEJO_CASA[hS], v)}`;
  return {
    parrafos: [p1, p2, p3, p4].filter(Boolean),
    insights: [
      ['Sol', `${SIGNOS[sS]} · casa ${hS}`],
      ['Día más amable', fav ? cap(diaLargo(dateOf(fav.i))) : 'Sin destacado marcado'],
      ['Pide calma', tens ? cap(diaLargo(dateOf(tens.i))) : 'Sin tensiones marcadas']
    ]
  };
}

// ---------- MES ----------
function mes(y, mo, s, variant){
  const d1 = new Date(y, mo, 1), d2 = new Date(y, mo + 1, 0);
  const i1 = idxOf(d1), i2 = idxOf(d2);
  const v = variant + hash(SIGNOS[s] + y + '-' + mo);
  const idxs = []; for (let i = i1; i <= i2; i++) idxs.push(i);
  const sS = sign(i1,'S'), hS = house(sS, s);
  let p1 = `Este mes empieza con el Sol en ${SIGNOS[sS]}, tu casa ${hS}: ${CASA[hS].t}. ${SOL_CASA[hS]}`;
  const ing = idxs.find(i => sign(i,'S') !== sS);
  if (ing){ const s2 = sign(ing,'S'), h2 = house(s2, s); p1 += ` Desde el ${fmt(dateOf(ing), {day:'numeric'})}, el Sol entra en ${SIGNOS[s2]} (tu casa ${h2}) y el foco pasa a ${CASA[h2].t}.`; }

  const lunas = []; let nueva = null, llena = null;
  for (const i of idxs){ const ex = exactPhase(i); if (ex && (ex.q === 0 || ex.q === 2)){
    const hh = house(ex.signo, s), f = dateOf(i);
    const frase = FASE_EXACTA[ex.q](SIGNOS[ex.signo], hh, CASA[hh].t).replace(/^Hoy/, `El ${fmt(f, {day:'numeric'})}`);
    lunas.push(frase); if (ex.q === 0) nueva = f; else llena = f; } }
  const p2 = lunas.join(' ');

  const pl = [];
  for (const k of ['Me','V','Ma']){
    const sk = sign(i1,k), hk = house(sk, s), P = PLANETA[k];
    const f = k === 'V' ? 'retrógrada' : 'retrógrado';
    const ex = [];
    const ch = idxs.find(i => sign(i,k) !== sk);
    if (ch){ const s2 = sign(ch,k); ex.push(`pasa a ${SIGNOS[s2]} el ${fmt(dateOf(ch), {day:'numeric'})}`); }
    const r0 = retro(i1,k), rc = idxs.find(i => retro(i,k) !== r0);
    if (r0 && !rc) ex.push(`sigue ${f} todo el mes`);
    else if (r0 && rc) ex.push(`sigue ${f} hasta el ${fmt(dateOf(rc), {day:'numeric'})}`);
    else if (rc) ex.push(`se vuelve ${f} el ${fmt(dateOf(rc), {day:'numeric'})}`);
    let t = `${P.n} comienza el mes en ${SIGNOS[sk]} (tu casa ${hk})` + (ex.length ? ' y ' + ex.join(' y ') : '');
    pl.push(t + '.');
  }
  const jS = sign(i1,'J'), jH = house(jS, s), saS = sign(i1,'Sa'), saH = house(saS, s);
  const fondo = `De fondo, Júpiter transita ${SIGNOS[jS]} (tu casa ${jH}): ${PLANETA.J.rol(CASA[jH].t)}; y Saturno está en ${SIGNOS[saS]} (tu casa ${saH}): ${PLANETA.Sa.rol(CASA[saH].t)}.`;
  const p3 = pl.join(' ') + ' ' + fondo;
  const p4 = `Consejo del mes: ${pick(CONSEJO_CASA[hS], v)}`;
  const dd = f => f ? fmt(f, {day:'numeric'}) : '—';
  const retros = ['Me','V','Ma'].filter(k => idxs.some(i => retro(i,k))).map(k => PLANETA[k].n);
  return {
    parrafos: [p1, p2, p3, p4].filter(Boolean),
    insights: [
      ['Lunas del mes', `Nueva: día ${dd(nueva)} · Llena: día ${dd(llena)}`],
      ['Sol', `${SIGNOS[sS]} · casa ${hS}`],
      ['Retrógrados', retros.length ? retros.join(', ') : 'Ninguno personal este mes']
    ]
  };
}

const gram = t => t.replace(/\b([Aa]) el /g, '$1l ').replace(/\b([Dd]e) el /g, '$1l ');
function arreglar(r){ if (!r) return r; r.parrafos = r.parrafos.map(gram); return r; }
export function lectura(cat, signIdx, variant){
  return arreglar(lecturaBase(cat, signIdx, variant));
}
function lecturaBase(cat, signIdx, variant){
  const hoy = new Date();
  try {
    if (cat === 'hoy' || cat === 'manana'){
      const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + (cat === 'manana' ? 1 : 0));
      const i = idxOf(d); if (!inRange(i)) return null;
      return dia(i, signIdx, variant, cat === 'manana');
    }
    if (cat === 'semana'){
      const dow = (hoy.getDay() + 6) % 7;
      const lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - dow);
      const i0 = idxOf(lunes); if (!inRange(i0) || !inRange(i0 + 6)) return null;
      return semana(i0, signIdx, variant);
    }
    if (cat === 'mes'){
      const y = hoy.getFullYear(), mo = hoy.getMonth();
      const i1 = idxOf(new Date(y, mo, 1)), i2 = idxOf(new Date(y, mo + 1, 0));
      if (!inRange(i1) || !inRange(i2)) return null;
      return mes(y, mo, signIdx, variant);
    }
  } catch (e) { return null; }
  return null;
}
export const _debug = { idxOf, dateOf, sign, lon, retro, phaseOf, exactPhase, dia, semana, mes };
