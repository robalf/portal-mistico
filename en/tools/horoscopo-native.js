// Horóscopo con cielo real (versión nativa, sin iframe). Usa los mismos cálculos que la app original.
import { lectura as cieloLectura } from './horoscopo-game/cielo.js?v=4';
import { anual as cieloAnual } from './horoscopo-game/anual.js?v=2';
const signs = [
  { name:'Aries', glyph:'♈', dates:'MAR 21 — APR 19', element:'Fire' }, { name:'Taurus', glyph:'♉', dates:'APR 20 — MAY 20', element:'Earth' },
  { name:'Gemini', glyph:'♊', dates:'MAY 21 — JUN 20', element:'Air' }, { name:'Cancer', glyph:'♋', dates:'JUN 21 — JUL 22', element:'Water' },
  { name:'Leo', glyph:'♌', dates:'JUL 23 — AUG 22', element:'Fire' }, { name:'Virgo', glyph:'♍', dates:'AUG 23 — SEP 22', element:'Earth' },
  { name:'Libra', glyph:'♎', dates:'SEP 23 — OCT 22', element:'Air' }, { name:'Scorpio', glyph:'♏', dates:'OCT 23 — NOV 21', element:'Water' },
  { name:'Sagittarius', glyph:'♐', dates:'NOV 22 — DEC 21', element:'Fire' }, { name:'Capricorn', glyph:'♑', dates:'DEC 22 — JAN 19', element:'Earth' },
  { name:'Aquarius', glyph:'♒', dates:'JAN 20 — FEB 18', element:'Air' }, { name:'Pisces', glyph:'♓', dates:'FEB 19 — MAR 20', element:'Water' }
];
const categories = [
  { id:'hoy', label:'Today', title:'Today\'s Horoscope' }, { id:'manana', label:'Tomorrow', title:'Tomorrow\'s Horoscope' },
  { id:'semana', label:'Weekly', title:'Weekly Outlook' }, { id:'mes', label:'Monthly', title:'Monthly Horizon' },
  { id:'2027', label:'2027', title:'Your Path in 2027' }, { id:'2028', label:'2028', title:'Your Path in 2028' },
  { id:'2029', label:'2029', title:'Your Path in 2029' }, { id:'2030', label:'2030', title:'Your Path in 2030' }
];
function isoWeek(d){ const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const ys = new Date(Date.UTC(t.getUTCFullYear(),0,1)); return Math.ceil((((t - ys) / 86400000) + 1) / 7); }
function dateLabel(id){
  const d = new Date(); if (id === 'manana') d.setDate(d.getDate() + 1);
  if (['2027','2028','2029','2030'].includes(id)) return 'ANNUAL OVERVIEW · ' + id;
  if (id === 'semana') return 'WEEK ' + isoWeek(d) + ' · ' + d.getFullYear();
  if (id === 'mes') return d.toLocaleDateString('en-US', { month:'long', year:'numeric' }).toUpperCase();
  return d.toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' }).toUpperCase();
}
function readingFor(catId, signIdx, variant){
  const yearly = ['2027','2028','2029','2030'].includes(catId);
  return yearly ? cieloAnual(+catId, signIdx) : cieloLectura(catId, signIdx, variant);
}
function readingHtml(cat, signIdx, variant){
  const r = readingFor(cat.id, signIdx, variant);
  if (!r) return '<p class="hs-p">This reading is not available for this date.</p>';
  return `<div class="hs-head"><h3>${cat.title}</h3><span>${dateLabel(cat.id)}</span></div>${r.parrafos.map(t => `<p class="hs-p">${t}</p>`).join('')}<div class="hs-insights">${r.insights.map(([k, v]) => `<div><b>${k}</b><span>${v}</span></div>`).join('')}</div>`;
}
export function mount(startId) {
  const root = document.querySelector('.hs-root'); if (!root) return;
  const hub = startId === 'hub';
  const pmSign = d => { try { const v = JSON.parse(localStorage.getItem('pm-sign') || 'null'); if (v && v.i >= 0 && v.i < 12) return v.i; } catch (e) {} return d; };
  const state = { sign: pmSign(7), cat: categories.find(c => c.id === (hub ? 'hoy' : startId)), variant: 0 };
  root.innerHTML = `<div class="sg-zodiacs hs-signs"></div>${hub ? '<nav class="hs-tabs" aria-label="Horoscope periods"></nav>' : ''}<article class="hs-out" aria-live="polite"></article><div class="hs-actions"></div>`;
  const grid = root.querySelector('.hs-signs'), tabs = root.querySelector('.hs-tabs'), out = root.querySelector('.hs-out'), act = root.querySelector('.hs-actions');
  function drawSigns(){ grid.innerHTML = signs.map((s, i) => `<button type="button" class="sg-zodiac ${i === state.sign ? 'on' : ''}" data-i="${i}" aria-pressed="${i === state.sign}"><span class="sg-sym">${s.glyph}</span><b>${s.name}</b></button>`).join(''); }
  function drawTabs(){ if (tabs) tabs.innerHTML = categories.map(c => `<button type="button" class="hs-tab ${c.id === state.cat.id ? 'on' : ''}" data-c="${c.id}">${c.label}</button>`).join(''); }
  function drawReading(){
    const s = signs[state.sign];
    out.innerHTML = `<div class="hs-sign"><span class="sg-big" style="width:64px;height:64px;font-size:32px">${s.glyph}</span><div><h3>${s.name}</h3><small>${s.dates} · ELEMENT ${s.element.toUpperCase()}</small></div></div>` + readingHtml(state.cat, state.sign, state.variant);
    const yearly = ['2027','2028','2029','2030'].includes(state.cat.id);
    act.innerHTML = (yearly ? '' : '<button type="button" class="pc-btn hs-regen">✦ &nbsp; New interpretation</button>') + '<p class="hs-orig">REAL SKY · ASTRONOMICAL CALCULATION</p>';
  }
  grid.addEventListener('click', e => { const b = e.target.closest('.sg-zodiac'); if (!b) return; state.sign = +b.dataset.i; state.variant = 0; drawSigns(); drawReading(); out.scrollIntoView({ behavior:'smooth', block:'nearest' }); if (window.gtag) window.gtag('event', 'sign_selected', { sign: signs[state.sign].name }); });
  if (tabs) tabs.addEventListener('click', e => { const b = e.target.closest('.hs-tab'); if (!b) return; state.cat = categories.find(c => c.id === b.dataset.c); state.variant = 0; drawTabs(); drawReading(); });
  act.addEventListener('click', e => { if (e.target.closest('.hs-regen')) { state.variant++; drawReading(); } });
  drawSigns(); drawTabs(); drawReading();
  // Lectura de los 12 signos (se genera con la fecha de hoy)
  const all = document.querySelector('#hs-all');
  if (all && !['2027','2028','2029','2030'].includes(state.cat.id)) {
    const cat = state.cat;
    all.innerHTML = `<h2>${cat.title} for all 12 signs</h2><p>Reading for ${dateLabel(cat.id).toLowerCase()} with our own written texts for each sign and the date. These are symbolic interpretations, offered for entertainment.</p>` + signs.map((s, i) => { const r = readingFor(cat.id, i, 0); return r ? `<h3>${s.glyph} ${s.name}</h3>${r.parrafos.map(t => `<p>${t}</p>`).join('')}` : ''; }).join('');
  }
  // fecha de actualización = hoy
  const tm = document.querySelector('#gameInfo time');
  if (tm) { const d = new Date(); tm.setAttribute('datetime', d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')); tm.textContent = d.toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' }); }
}
