// Horóscopo anual 2027–2030 a partir de los tránsitos lentos reales (ver anual-data.js).
import { ANUAL } from './anual-data.js';
import { SIGNOS, CASA, CONSEJO_CASA } from './cielo-textos.js';
import { JUP, SAT } from './anual-textos.js';

const house = (p, s) => ((p - s + 12) % 12) + 1;
const MES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fechaCorta = (iso, Y) => { const [y,m,d] = iso.split('-').map(Number); return `${MES[m-1]} ${d}${y !== Y ? ', ' + y : ''}`; };
const dias = (a, b) => (Date.parse(b) - Date.parse(a)) / 86400000;
const gram = t => t.replace(/\b([Aa]) el /g, '$1l ').replace(/\b([Dd]e) el /g, '$1l ');

// segmentos [signo, desde] -> [{signo, desde, hasta, dias}] dentro del año
function segs(arr, Y){
  const fin = `${Y}-12-31`;
  return arr.map(([s, d], i) => { const h = i + 1 < arr.length ? arr[i+1][1] : fin; return { s, d, h, n: dias(d, h) + (i + 1 < arr.length ? 0 : 1) }; });
}
const mayor = sg => sg.reduce((a, b) => b.n > a.n ? b : a);

export function anual(Y, s){
  const D = ANUAL[Y]; if (!D) return null;
  const P = [];
  // Júpiter
  const j = segs(D.lentos.J, Y), jm = mayor(j), hj = house(jm.s, s), J = JUP[hj];
  let p1 = `${Y} is a ${J.titulo} year for you. Jupiter, the planet of expansion and opportunity, ${j.length > 1 ? `pasa la mayor parte del año en ${SIGNOS[jm.s]}, tu casa ${hj} (${CASA[hj].n.toLowerCase()}): ` : `recorre ${SIGNOS[jm.s]}, tu casa ${hj} (${CASA[hj].n.toLowerCase()}): `}${J.t}`;
  if (j.length > 1){ const o = j.find(x => x !== jm), ho = house(o.s, s), antes = o.d < jm.d;
    p1 += antes ? ` Until ${fechaCorta(jm.d, Y)}, Jupiter was in ${SIGNOS[o.s]} (your house ${ho}), and the focus was on ${CASA[ho].t}.`
                : ` Starting ${fechaCorta(o.d, Y)}, Jupiter moves into ${SIGNOS[o.s]} (your house ${ho}) and the focus shifts toward ${CASA[ho].t}.`; }
  P.push(p1);
  // Saturno
  const sa = segs(D.lentos.Sa, Y), sm = mayor(sa), hs = house(sm.s, s);
  let p2 = `Saturn, the master of time and responsibility, ${sa.length > 1 ? `está la mayor parte del año en ${SIGNOS[sm.s]}` : `transita ${SIGNOS[sm.s]}`}, your house ${hs}, and ${SAT[hs]}`;
  if (sa.length > 1){ const o = sa.find(x => x !== sm), ho = house(o.s, s);
    p2 += o.d < sm.d ? ` Until ${fechaCorta(sm.d, Y)} it was in ${SIGNOS[o.s]} (your house ${ho}).` : ` Starting ${fechaCorta(o.d, Y)} it moves into ${SIGNOS[o.s]} (your house ${ho}).`; }
  P.push(p2);
  // Eclipses
  if (D.eclipses.length){
    const e = D.eclipses.map(([iso, t, k, sg]) => { const h = house(sg, s);
      return `${fechaCorta(iso, Y)}: ${k} ${t} eclipse in ${SIGNOS[sg]} (your house ${h}, ${t === 'solar' ? 'new beginnings in' : 'endings and culminations in'} ${CASA[h].t})`; });
    P.push(`Eclipses mark the moments of greatest change in the year. ${e.join('; ')}. They are symbolically associated with doors that open or close; it is best not to force decisions on those days.`);
  }
  // Planetas lentos de fondo y nodos
  const hu = house(D.lentos.U[0][0], s), hn = house(D.lentos.N[0][0], s), hp = house(D.lentos.P[0][0], s);
  const nn = segs(D.lentos.Nn, Y), nm = mayor(nn), hN = house(nm.s, s), hS = house((nm.s + 6) % 12, s);
  P.push(`In the background, Uranus is in your house ${hu} and calls for change and freedom in ${CASA[hu].t}; Neptune, in your house ${hn}, sharpens intuition in ${CASA[hn].t} (avoid idealizing); and Pluto, in your house ${hp}, transforms ${CASA[hp].t} from the root. The North Node, which points to where your path is growing, passes through your house ${hN} (${CASA[hN].t}), while the South Node, in your house ${hS}, marks what you have already mastered and should balance.`);
  // Fechas de cuidado: retrógrados
  const nom = { Me:'Mercury', V:'Venus', Ma:'Mars', J:'Jupiter', Sa:'Saturn' };
  const rr = D.retro.filter(r => r[0] === 'Me').map(r => `${fechaCorta(r[1], Y)} to ${fechaCorta(r[2], Y)}`);
  const otros = D.retro.filter(r => r[0] === 'V' || r[0] === 'Ma').map(r => `${nom[r[0]]} retrograde${r[0] === 'V' ? '' : ''} from ${fechaCorta(r[1], Y)} to ${fechaCorta(r[2], Y)}`);
  const lentos = D.retro.filter(r => r[0] === 'J' || r[0] === 'Sa').map(r => `${nom[r[0]]} from ${fechaCorta(r[1], Y)} to ${fechaCorta(r[2], Y)}`);
  let p5 = `Dates to mark: Mercury retrograde ${rr.length ? 'from ' + rr.join('; from ') : '(no periods this year)'}; review contracts, messages and travel more carefully in those weeks.`;
  if (otros.length) p5 += ` Also: ${otros.join('; ')}.`;
  if (lentos.length) p5 += ` The review periods of the big planets are: ${lentos.join('; ')}.`;
  P.push(p5);
  P.push(`Advice for the year: ${CONSEJO_CASA[hj][Y % 2]}`);
  return {
    parrafos: P.map(gram),
    insights: [
      ['Jupiter', `${SIGNOS[jm.s]} · house ${hj} · ${CASA[hj].n}`],
      ['Saturn', `${SIGNOS[sm.s]} · house ${hs} · ${CASA[hs].n}`],
      ['Eclipses', `${D.eclipses.length} in ${Y}`]
    ]
  };
}
