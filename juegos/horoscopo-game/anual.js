// Horóscopo anual 2027–2030 a partir de los tránsitos lentos reales (ver anual-data.js).
import { ANUAL } from './anual-data.js';
import { SIGNOS, CASA, CONSEJO_CASA } from './cielo-textos.js';
import { JUP, SAT } from './anual-textos.js';

const house = (p, s) => ((p - s + 12) % 12) + 1;
const MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const fechaCorta = (iso, Y) => { const [y,m,d] = iso.split('-').map(Number); return `${d} ${MES[m-1]}${y !== Y ? ' ' + y : ''}`; };
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
  let p1 = `${Y} es para ti un año ${J.titulo}. Júpiter, el planeta de la expansión y la oportunidad, ${j.length > 1 ? `pasa la mayor parte del año en ${SIGNOS[jm.s]}, tu casa ${hj} (${CASA[hj].n.toLowerCase()}): ` : `recorre ${SIGNOS[jm.s]}, tu casa ${hj} (${CASA[hj].n.toLowerCase()}): `}${J.t}`;
  if (j.length > 1){ const o = j.find(x => x !== jm), ho = house(o.s, s), antes = o.d < jm.d;
    p1 += antes ? ` Hasta el ${fechaCorta(jm.d, Y)}, Júpiter estaba en ${SIGNOS[o.s]} (tu casa ${ho}), y el foco se centraba en ${CASA[ho].t}.`
                : ` Desde el ${fechaCorta(o.d, Y)}, Júpiter pasa a ${SIGNOS[o.s]} (tu casa ${ho}) y el foco se desplaza hacia ${CASA[ho].t}.`; }
  P.push(p1);
  // Saturno
  const sa = segs(D.lentos.Sa, Y), sm = mayor(sa), hs = house(sm.s, s);
  let p2 = `Saturno, el maestro del tiempo y la responsabilidad, ${sa.length > 1 ? `está la mayor parte del año en ${SIGNOS[sm.s]}` : `transita ${SIGNOS[sm.s]}`}, tu casa ${hs}, y ${SAT[hs]}`;
  if (sa.length > 1){ const o = sa.find(x => x !== sm), ho = house(o.s, s);
    p2 += o.d < sm.d ? ` Hasta el ${fechaCorta(sm.d, Y)} estuvo en ${SIGNOS[o.s]} (tu casa ${ho}).` : ` Desde el ${fechaCorta(o.d, Y)} pasa a ${SIGNOS[o.s]} (tu casa ${ho}).`; }
  P.push(p2);
  // Eclipses
  if (D.eclipses.length){
    const e = D.eclipses.map(([iso, t, k, sg]) => { const h = house(sg, s);
      return `${fechaCorta(iso, Y)}: eclipse ${t} ${k} en ${SIGNOS[sg]} (tu casa ${h}, ${t === 'solar' ? 'comienzos en' : 'cierres y culminaciones en'} ${CASA[h].t})`; });
    P.push(`Los eclipses marcan los momentos de mayor cambio del año. ${e.join('; ')}. Se asocian simbólicamente con puertas que se abren o se cierran; conviene no forzar decisiones en esos días.`);
  }
  // Planetas lentos de fondo y nodos
  const hu = house(D.lentos.U[0][0], s), hn = house(D.lentos.N[0][0], s), hp = house(D.lentos.P[0][0], s);
  const nn = segs(D.lentos.Nn, Y), nm = mayor(nn), hN = house(nm.s, s), hS = house((nm.s + 6) % 12, s);
  P.push(`De fondo, Urano está en tu casa ${hu} y pide cambios y libertad en ${CASA[hu].t}; Neptuno, en tu casa ${hn}, afina la intuición en ${CASA[hn].t} (evita idealizar); y Plutón, en tu casa ${hp}, transforma desde la raíz ${CASA[hp].t}. El Nodo Norte, que señala hacia dónde crece tu camino, pasa por tu casa ${hN} (${CASA[hN].t}), mientras el Nodo Sur, en tu casa ${hS}, marca lo que ya dominas y conviene equilibrar.`);
  // Fechas de cuidado: retrógrados
  const nom = { Me:'Mercurio', V:'Venus', Ma:'Marte', J:'Júpiter', Sa:'Saturno' };
  const rr = D.retro.filter(r => r[0] === 'Me').map(r => `${fechaCorta(r[1], Y)} al ${fechaCorta(r[2], Y)}`);
  const otros = D.retro.filter(r => r[0] === 'V' || r[0] === 'Ma').map(r => `${nom[r[0]]} retrógrad${r[0] === 'V' ? 'a' : 'o'} del ${fechaCorta(r[1], Y)} al ${fechaCorta(r[2], Y)}`);
  const lentos = D.retro.filter(r => r[0] === 'J' || r[0] === 'Sa').map(r => `${nom[r[0]]} del ${fechaCorta(r[1], Y)} al ${fechaCorta(r[2], Y)}`);
  let p5 = `Fechas para marcar: Mercurio retrógrado ${rr.length ? 'del ' + rr.join('; del ') : '(sin periodos este año)'}; revisa contratos, mensajes y viajes con más cuidado en esas semanas.`;
  if (otros.length) p5 += ` También: ${otros.join('; ')}.`;
  if (lentos.length) p5 += ` Los periodos de revisión de los planetas grandes son: ${lentos.join('; ')}.`;
  P.push(p5);
  P.push(`Consejo anual: ${CONSEJO_CASA[hj][Y % 2]}`);
  return {
    parrafos: P.map(gram),
    insights: [
      ['Júpiter', `${SIGNOS[jm.s]} · casa ${hj} · ${CASA[hj].n}`],
      ['Saturno', `${SIGNOS[sm.s]} · casa ${hs} · ${CASA[hs].n}`],
      ['Eclipses', `${D.eclipses.length} en ${Y}`]
    ]
  };
}
