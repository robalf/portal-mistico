// Horóscopo con cielo real (versión nativa, sin iframe). Usa los mismos cálculos que la app original.
import { lectura as cieloLectura } from './horoscopo-game/cielo.js?v=4';
import { anual as cieloAnual } from './horoscopo-game/anual.js?v=2';
const signs = [
  { name:'Aries', glyph:'♈', dates:'21 MAR — 19 ABR', element:'Fuego' }, { name:'Tauro', glyph:'♉', dates:'20 ABR — 20 MAY', element:'Tierra' },
  { name:'Géminis', glyph:'♊', dates:'21 MAY — 20 JUN', element:'Aire' }, { name:'Cáncer', glyph:'♋', dates:'21 JUN — 22 JUL', element:'Agua' },
  { name:'Leo', glyph:'♌', dates:'23 JUL — 22 AGO', element:'Fuego' }, { name:'Virgo', glyph:'♍', dates:'23 AGO — 22 SEP', element:'Tierra' },
  { name:'Libra', glyph:'♎', dates:'23 SEP — 22 OCT', element:'Aire' }, { name:'Escorpio', glyph:'♏', dates:'23 OCT — 21 NOV', element:'Agua' },
  { name:'Sagitario', glyph:'♐', dates:'22 NOV — 21 DIC', element:'Fuego' }, { name:'Capricornio', glyph:'♑', dates:'22 DIC — 19 ENE', element:'Tierra' },
  { name:'Acuario', glyph:'♒', dates:'20 ENE — 18 FEB', element:'Aire' }, { name:'Piscis', glyph:'♓', dates:'19 FEB — 20 MAR', element:'Agua' }
];
const categories = [
  { id:'hoy', label:'Hoy', title:'Horóscopo de hoy' }, { id:'manana', label:'Mañana', title:'Horóscopo de mañana' },
  { id:'semana', label:'Semanal', title:'Visión semanal' }, { id:'mes', label:'Mensual', title:'Horizonte mensual' },
  { id:'2027', label:'2027', title:'Tu camino en 2027' }, { id:'2028', label:'2028', title:'Tu camino en 2028' },
  { id:'2029', label:'2029', title:'Tu camino en 2029' }, { id:'2030', label:'2030', title:'Tu camino en 2030' }
];
function isoWeek(d){ const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const ys = new Date(Date.UTC(t.getUTCFullYear(),0,1)); return Math.ceil((((t - ys) / 86400000) + 1) / 7); }
function dateLabel(id){
  const d = new Date(); if (id === 'manana') d.setDate(d.getDate() + 1);
  if (['2027','2028','2029','2030'].includes(id)) return 'PANORAMA ANUAL · ' + id;
  if (id === 'semana') return 'SEMANA ' + isoWeek(d) + ' · ' + d.getFullYear();
  if (id === 'mes') return d.toLocaleDateString('es-ES', { month:'long', year:'numeric' }).toUpperCase();
  return d.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' }).toUpperCase();
}
function readingFor(catId, signIdx, variant){
  const yearly = ['2027','2028','2029','2030'].includes(catId);
  return yearly ? cieloAnual(+catId, signIdx) : cieloLectura(catId, signIdx, variant);
}
function readingHtml(cat, signIdx, variant){
  const r = readingFor(cat.id, signIdx, variant);
  if (!r) return '<p class="hs-p">Esta lectura no está disponible para esta fecha.</p>';
  return `<div class="hs-head"><h3>${cat.title}</h3><span>${dateLabel(cat.id)}</span></div>${r.parrafos.map(t => `<p class="hs-p">${t}</p>`).join('')}<div class="hs-insights">${r.insights.map(([k, v]) => `<div><b>${k}</b><span>${v}</span></div>`).join('')}</div>`;
}
export function mount(startId) {
  const root = document.querySelector('.hs-root'); if (!root) return;
  const hub = startId === 'hub';
  const state = { sign: 7, cat: categories.find(c => c.id === (hub ? 'hoy' : startId)), variant: 0 };
  root.innerHTML = `<div class="sg-zodiacs hs-signs"></div>${hub ? '<nav class="hs-tabs" aria-label="Periodos del horóscopo"></nav>' : ''}<article class="hs-out" aria-live="polite"></article><div class="hs-actions"></div>`;
  const grid = root.querySelector('.hs-signs'), tabs = root.querySelector('.hs-tabs'), out = root.querySelector('.hs-out'), act = root.querySelector('.hs-actions');
  function drawSigns(){ grid.innerHTML = signs.map((s, i) => `<button type="button" class="sg-zodiac ${i === state.sign ? 'on' : ''}" data-i="${i}" aria-pressed="${i === state.sign}"><span class="sg-sym">${s.glyph}</span><b>${s.name}</b></button>`).join(''); }
  function drawTabs(){ if (tabs) tabs.innerHTML = categories.map(c => `<button type="button" class="hs-tab ${c.id === state.cat.id ? 'on' : ''}" data-c="${c.id}">${c.label}</button>`).join(''); }
  function drawReading(){
    const s = signs[state.sign];
    out.innerHTML = `<div class="hs-sign"><span class="sg-big" style="width:64px;height:64px;font-size:32px">${s.glyph}</span><div><h3>${s.name}</h3><small>${s.dates} · ELEMENTO ${s.element.toUpperCase()}</small></div></div>` + readingHtml(state.cat, state.sign, state.variant);
    const yearly = ['2027','2028','2029','2030'].includes(state.cat.id);
    act.innerHTML = (yearly ? '' : '<button type="button" class="pc-btn hs-regen">✦ &nbsp; Nueva interpretación</button>') + '<p class="hs-orig">CIELO REAL · CÁLCULO ASTRONÓMICO</p>';
  }
  grid.addEventListener('click', e => { const b = e.target.closest('.sg-zodiac'); if (!b) return; state.sign = +b.dataset.i; state.variant = 0; drawSigns(); drawReading(); out.scrollIntoView({ behavior:'smooth', block:'nearest' }); if (window.gtag) window.gtag('event', 'sign_selected', { sign: signs[state.sign].name }); });
  if (tabs) tabs.addEventListener('click', e => { const b = e.target.closest('.hs-tab'); if (!b) return; state.cat = categories.find(c => c.id === b.dataset.c); state.variant = 0; drawTabs(); drawReading(); });
  act.addEventListener('click', e => { if (e.target.closest('.hs-regen')) { state.variant++; drawReading(); } });
  drawSigns(); drawTabs(); drawReading();
  // Lectura de los 12 signos (se genera con la fecha de hoy)
  const all = document.querySelector('#hs-all');
  if (all && !['2027','2028','2029','2030'].includes(state.cat.id)) {
    const cat = state.cat;
    all.innerHTML = `<h2>${cat.title} para los 12 signos</h2><p>Lectura de ${dateLabel(cat.id).toLowerCase()} con textos propios para cada signo y la fecha. Son interpretaciones simbólicas y de entretenimiento.</p>` + signs.map((s, i) => { const r = readingFor(cat.id, i, 0); return r ? `<h3>${s.glyph} ${s.name}</h3>${r.parrafos.map(t => `<p>${t}</p>`).join('')}` : ''; }).join('');
  }
  // fecha de actualización = hoy
  const tm = document.querySelector('#gameInfo time');
  if (tm) { const d = new Date(); tm.setAttribute('datetime', d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')); tm.textContent = d.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' }); }
}
