/* Portal Místico · interfaz de las calculadoras (Matriz del Destino, retorno de Saturno, nodos lunares, Lilith, kin maya).
   Uso: <script type="module">import { mount } from '/assets/js/calc-astro-ui.js?v=2'; mount('matrix', 'es');</script> */
import * as C from './calc-astro-core.js?v=1';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = id => document.getElementById(id);

function parseDate(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ''); if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  return C.validDate(y, mo, d) ? { y, m: mo, d } : null;
}
function birthInstant(p, timeStr) { // hora local del dispositivo; sin hora -> 12:00
  const t = /^(\d{2}):(\d{2})$/.exec(timeStr || '');
  const hh = t ? +t[1] : 12, mi = t ? +t[2] : 0;
  const local = new Date(p.y, p.m - 1, p.d, hh, mi);
  return { date: local, hasTime: !!t };
}
const fmt = (T, d) => d.toLocaleDateString(T.locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const num = (T, x) => x.toLocaleString(T.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const ageAt = (birth, d) => ((d - birth) / (365.2425 * 86400000));
function signLink(T, z) {
  return `<a href="${T.signBase}${T.signSlug[z.sign]}.html">${T.glyphs[z.sign]} ${T.signs[z.sign]}</a>`;
}
const pos = (T, lon) => { const z = C.zodiac(lon); return { z, txt: `${z.deg}° ${String(z.min).padStart(2, '0')}′ ${T.signs[z.sign]}`, link: signLink(T, z) }; };

/* ---------- Matriz ---------- */
function matrixSVG(M) {
  const P = { A: [34, 150], B: [150, 34], C: [266, 150], D: [150, 266], F: [68, 68], G: [232, 68], H: [232, 232], I: [68, 232], E: [150, 150] };
  const line = (a, b) => `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}"/>`;
  const dot = k => `<g><circle cx="${P[k][0]}" cy="${P[k][1]}" r="${k === 'E' ? 24 : 19}"/><text x="${P[k][0]}" y="${P[k][1] + 6}">${M[k]}</text></g>`;
  return `<svg viewBox="0 0 300 300" class="pmc-svg" role="img" aria-label="Matriz: ${Object.keys(P).map(k => k + ' ' + M[k]).join(', ')}">
  <g class="l">${line('A', 'B')}${line('B', 'C')}${line('C', 'D')}${line('D', 'A')}${line('F', 'G')}${line('G', 'H')}${line('H', 'I')}${line('I', 'F')}${line('A', 'C')}${line('B', 'D')}${line('F', 'H')}${line('G', 'I')}</g>
  <g class="d">${Object.keys(P).map(dot).join('')}</g></svg>`;
}
function arcCard(T, title, sub, n) {
  const a = T.arcana[n];
  return `<div class="ca-item"><div class="ca-item-t">${esc(title)} · <span class="pmc-n">${n}</span> ${esc(a[0])} <small>${esc(sub)}</small></div><p><strong>${T.matrix.plus}:</strong> ${esc(a[1])}. <strong>${T.matrix.minus}:</strong> ${esc(a[2])}.</p></div>`;
}
function renderMatrix(T, p, p2) {
  const M1 = C.destinyMatrix(p.y, p.m, p.d);
  const M = p2 ? C.coupleMatrix(M1, C.destinyMatrix(p2.y, p2.m, p2.d)) : M1;
  const pts = p2 ? T.matrix.cpoints : T.matrix.points;
  return `<div class="ca-head"><div class="ca-kick">✦ ${esc(p2 ? T.matrix.couple : T.matrix.title)} ✦</div><h2>${M.E} · ${esc(T.arcana[M.E][0])}</h2>
  <p>${fmt(T, new Date(Date.UTC(p.y, p.m - 1, p.d)))}${p2 ? ' + ' + fmt(T, new Date(Date.UTC(p2.y, p2.m - 1, p2.d))) : ''}</p></div>
  ${matrixSVG(M)}
  <div class="ca-pills"><span>A ${M.A}</span><span>B ${M.B}</span><span>C ${M.C}</span><span>D ${M.D}</span><span>E ${M.E}</span></div>
  <div class="ca-list">${Object.keys(pts).map(k => arcCard(T, pts[k][0], pts[k][1], M[k])).join('')}</div>
  <p class="ca-note">${esc(T.matrix.note)}</p>`;
}

/* ---------- Saturno ---------- */
function renderSaturn(T, A, p, birth) {
  const r = C.saturnReturns(A, birth.date), n = pos(T, r.natal), now = Date.now();
  const blocks = r.returns.map((passes, i) => {
    if (!passes.length) return '';
    const rows = passes.map(x => `<tr><td>${fmt(T, x.date)}</td><td>${T.common.age} ${num(T, ageAt(birth.date, x.date))} ${T.common.years}</td><td>${x.direct ? T.common.direct : T.common.retro}</td></tr>`).join('');
    const state = passes[passes.length - 1].date.getTime() < now ? T.saturn.past : T.saturn.future;
    return `<h3 class="ca-h">${T.saturn.returns[i]} <span class="ca-tag">${state}</span></h3><p>${esc(T.saturn.passes(passes.length))}</p><div class="ca-table-wrap"><table class="ca-table"><tbody>${rows}</tbody></table></div>`;
  }).join('');
  return `<div class="ca-head"><div class="ca-kick">✦ ${T.saturn.title} ✦</div><div class="ca-big">♄</div><h2>${T.saturn.natal}: ${n.txt}</h2><p>${n.link}</p></div>
  <div class="ca-card"><p>${esc(T.saturn.bySign[n.z.sign].charAt(0).toUpperCase() + T.saturn.bySign[n.z.sign].slice(1))}</p></div>${blocks}
  ${birth.hasTime ? '' : `<p class="ca-note">${esc(T.common.approx)}</p>`}`;
}

/* ---------- Nodos ---------- */
function renderNodes(T, A, p, birth) {
  const mean = C.meanNode(birth.date), tru = C.trueNode(A, birth.date);
  const N = pos(T, tru), Nm = pos(T, mean), S = pos(T, tru + 180), Sm = pos(T, mean + 180);
  const rets = C.nodalReturns(birth.date, 5);
  const revs = C.nodalReturns(birth.date, 5, 180);
  const rows = rets.map((d, i) => `<tr><td>${T.nodes.reversal}</td><td>${fmt(T, revs[i])}</td><td>${T.common.age} ${num(T, ageAt(birth.date, revs[i]))} ${T.common.years}</td></tr><tr><td><strong>${T.nodes.returnsT.split(' (')[0]}</strong></td><td>${fmt(T, d)}</td><td>${T.common.age} ${num(T, ageAt(birth.date, d))} ${T.common.years}</td></tr>`).join('');
  return `<div class="ca-head"><div class="ca-kick">✦ ${T.nodes.title} ✦</div><div class="ca-big">☊</div><h2>${T.nodes.north}: ${T.glyphs[N.z.sign]} ${T.signs[N.z.sign]}</h2><p>${T.nodes.south}: ${T.glyphs[S.z.sign]} ${T.signs[S.z.sign]}</p></div>
  <div class="ca-two"><div class="ca-mini"><span>${T.nodes.north} · ${T.nodes.true}</span><b>${N.txt}</b></div><div class="ca-mini"><span>${T.nodes.north} · ${T.nodes.mean}</span><b>${Nm.txt}</b></div>
  <div class="ca-mini"><span>${T.nodes.south} · ${T.nodes.true}</span><b>${S.txt}</b></div><div class="ca-mini"><span>${T.nodes.south} · ${T.nodes.mean}</span><b>${Sm.txt}</b></div></div>
  <h3 class="ca-h">${T.nodes.north} ${N.link}</h3><div class="ca-card"><p>${esc(T.nodes.northBy[N.z.sign])}</p></div>
  <p class="ca-note">${esc(T.nodes.southNote)}</p>
  <h3 class="ca-h">${T.nodes.returnsT}</h3><div class="ca-table-wrap"><table class="ca-table"><tbody>${rows}</tbody></table></div>
  ${birth.hasTime ? '' : `<p class="ca-note">${esc(T.common.approx)}</p>`}`;
}

/* ---------- Lilith ---------- */
function renderLilith(T, p, birth) {
  const L = pos(T, C.meanLilith(birth.date)), rets = C.lilithReturns(birth.date, 6);
  const rows = rets.map(d => `<tr><td>${fmt(T, d)}</td><td>${T.common.age} ${num(T, ageAt(birth.date, d))} ${T.common.years}</td></tr>`).join('');
  return `<div class="ca-head"><div class="ca-kick">✦ ${T.lilith.title} ✦</div><div class="ca-big">⚸</div><h2>${L.txt}</h2><p>${L.link}</p></div>
  <div class="ca-card"><p>${esc(T.lilith.bySign[L.z.sign])}</p></div>
  <h3 class="ca-h">${T.lilith.returnsT}</h3><div class="ca-table-wrap"><table class="ca-table"><tbody>${rows}</tbody></table></div>`;
}

/* ---------- Kin ---------- */
function renderKin(T, p) {
  const k = C.dreamspellKin(p.y, p.m, p.d), o = C.dreamspellOracle(k.kin), t = C.tzolkinTraditional(p.y, p.m, p.d), K = T.kin;
  const mini = (lab, s) => `<div class="ca-mini"><span>${lab}</span><b style="font-size:1rem">${esc(K.seals[s])}</b></div>`;
  return `<div class="ca-head"><div class="ca-kick">✦ ${K.title} · ${K.ds} ✦</div><h2>Kin ${k.kin}</h2><p>${esc(K.kinName ? K.kinName(K.seals[k.seal], K.tones[k.tone]) : K.seals[k.seal] + ' ' + K.tones[k.tone])}</p></div>
  <div class="ca-cards"><div class="ca-card"><p><strong>${esc(K.seals[k.seal])}</strong><br>${esc(K.sealKw[k.seal])}</p></div><div class="ca-card"><p><strong>${esc(K.tones[k.tone])} (${k.tone})</strong><br>${esc(K.toneKw[k.tone])}</p></div><div class="ca-card"><p><strong>Kin ${k.kin}/260</strong><br>${esc(K.seals[k.seal].split(' ').pop())}</p></div></div>
  <h3 class="ca-h">${K.ds}</h3><div class="ca-two">${mini(K.oracle.guide, o.guide)}${mini(K.oracle.analog, o.analog)}${mini(K.oracle.antipode, o.antipode)}${mini(K.oracle.occult, o.occult)}</div>
  <h3 class="ca-h">${K.trad}</h3><div class="ca-card"><p><strong>${t.number} ${esc(K.tradNames[t.sign])}</strong> · ${t.kin}/260</p></div>
  ${p.m === 2 && p.d === 29 ? `<p class="ca-note">${esc(K.note29)}</p>` : ''}`;
}

/* ---------- montaje ---------- */
const CSS = `.pmc-svg{display:block;width:min(320px,90%);margin:8px auto 14px}.pmc-svg .l line{stroke:rgba(199,162,75,.45);stroke-width:1.4}.pmc-svg circle{fill:#141634;stroke:#C7A24B;stroke-width:1.5}.pmc-svg text{fill:#F4EFE3;font:600 16px 'Work Sans',Arial,sans-serif;text-anchor:middle}.pmc-n{color:var(--gold-l,#E5C77A)}.pmc-two[hidden]{display:none}`;

export function mount(kind, lang = 'es') {
  const form = $('pmcForm'), out = $('pmcResult'), err = $('pmcError'); if (!form || !out) return;
  if (!document.getElementById('pmc-css')) { const s = document.createElement('style'); s.id = 'pmc-css'; s.textContent = CSS; document.head.appendChild(s); }
  const couple = $('pmcCouple'), two = $('pmcTwo');
  if (couple && two) couple.addEventListener('change', () => { two.hidden = !couple.checked; });
  const unknown = $('pmcUnknown'), time = $('pmcTime');
  if (unknown && time) unknown.addEventListener('change', () => { time.disabled = unknown.checked; if (unknown.checked) time.value = ''; });
  const textsP = import(lang === 'en' ? './calc-astro-en.js?v=2' : './calc-astro-es.js?v=2');
  form.addEventListener('submit', async e => {
    e.preventDefault(); err.textContent = '';
    const T = (await textsP).default;
    const p = parseDate($('pmcDate').value);
    if (!p) { err.textContent = T.err.date; return; }
    if (p.y < 1900 || p.y > 2100) { err.textContent = T.err.range; return; }
    let html = '';
    try {
      if (kind === 'matrix') {
        let p2 = null;
        if (couple && couple.checked) { p2 = parseDate($('pmcDate2').value); if (!p2) { err.textContent = T.err.date2; return; } }
        html = renderMatrix(T, p, p2);
      } else if (kind === 'kin') html = renderKin(T, p);
      else {
        const birth = birthInstant(p, time && !time.disabled ? time.value : '');
        if (kind === 'lilith') html = renderLilith(T, p, birth);
        else {
          const A = window.Astronomy; if (!A) { err.textContent = T.err.lib; return; }
          html = kind === 'saturn' ? renderSaturn(T, A, p, birth) : renderNodes(T, A, p, birth);
        }
      }
    } catch (ex) { console.error(ex); err.textContent = T.err.date; return; }
    out.innerHTML = html; out.hidden = false;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.gtag) window.gtag('event', 'tool_use', { tool: kind, lang });
  });
}
