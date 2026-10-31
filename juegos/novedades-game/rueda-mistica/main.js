function PMS(r){try{var t=window.top;if(t!==window&&t.PortalMusic&&t.PortalMusic.sfx)return t.PortalMusic.sfx(new URL(r,location.href).href);}catch(e){}return new Audio(r);}
const IN_PORTAL = (function(){try{return !!(window.top!==window&&window.top.PortalMusic);}catch(e){return false;}})();
const SLICES = [
  { name: 'Ángeles', key: 'angeles', color: '#be8738', glow: '#ffd877' },
  { name: 'Serafines', key: 'serafines', color: '#962444', glow: '#ff385d' },
  { name: 'Querubines', key: 'querubines', color: '#14579b', glow: '#52b9ff' },
  { name: 'Tronos', key: 'tronos', color: '#35247e', glow: '#8b73ff' },
  { name: 'Dominaciones', key: 'dominaciones', color: '#182d76', glow: '#668cff' },
  { name: 'Virtudes', key: 'virtudes', color: '#a66a1f', glow: '#ffd348' },
  { name: 'Potestades', key: 'potestades', color: '#7d203c', glow: '#ff553c' },
  { name: 'Principados', key: 'principados', color: '#512576', glow: '#cf79ff' },
  { name: 'Arcángeles', key: 'arcangeles', color: '#164e91', glow: '#55a9ff' },
];
const TAU = Math.PI * 2;
const SLICE_ANGLE = TAU / SLICES.length;

const container = document.getElementById('game-container');
const canvas = document.createElement('canvas');
canvas.setAttribute('aria-label', 'Rueda mística de los coros angélicos');
canvas.style.touchAction = 'none';
container.appendChild(canvas);
const ctx = canvas.getContext('2d');

function loadImage(src) {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  return image;
}
const nebula = loadImage('assets/nebula-bg.webp');
SLICES.forEach((slice) => {
  slice.icon = loadImage(`assets/icon-${slice.key}.webp`);
});

const music = (function(){try{var t=window.top;if(t!==window&&t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3');
music.loop = true;
music.volume = Math.max(0, Math.min(1, 0.34));
const chime = PMS('assets/audio/celestial-chime.mp3');
let muted = false;
let audioCtx = null;

function playTick() {
  if (muted || !audioCtx || audioCtx.state !== 'running') return;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 1480;
  gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.045);
  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05);
}

let W = 0;
let H = 0;
let dpr = 1;
const stars = [];
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  stars.length = 0;
  let seed = 9137;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < Math.max(90, Math.round((W * H) / 4600)); i++) {
    stars.push({ x: random() * W, y: random() * H, radius: 0.45 + random() * 1.25, alpha: 0.18 + random() * 0.62, phase: random() * TAU });
  }
}
window.addEventListener('resize', resize);
resize();

const state = {
  angle: 0,
  velocity: 0,
  spinning: false,
  result: null,
  resultTime: 0,
  lastTickIndex: -1,
  pointerKick: 0,
  particles: [],
};
const history = [];

function wheelGeom() {
  const r = Math.min(W * 0.42, H * 0.32);
  return { cx: W / 2, cy: H * 0.505, r, outer: r * 1.075 };
}

const SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const SPIN_STORAGE_KEY = 'ruedaMisticaLastSpin';
function msUntilNextSpin() {
  const last = Number(localStorage.getItem(SPIN_STORAGE_KEY) || 0);
  const remaining = SPIN_COOLDOWN_MS - (Date.now() - last);
  return remaining > 0 ? remaining : 0;
}
function formatCooldown(ms) {
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes} min`;
  return `${hours} h ${minutes} min`;
}
function startSpin(power) {
  if (state.spinning) return;
  if (msUntilNextSpin() > 0) return;
  localStorage.setItem(SPIN_STORAGE_KEY, String(Date.now()));
  state.velocity = power ?? 0.34 + Math.random() * 0.18;
  state.spinning = true;
  state.result = null;
}

function finishSpin() {
  state.spinning = false;
  const pointerOffset = ((-state.angle % TAU) + TAU) % TAU;
  const index = Math.floor((pointerOffset + SLICE_ANGLE / 2) / SLICE_ANGLE) % SLICES.length;
  state.result = SLICES[index];
  state.resultTime = performance.now();
  history.unshift(state.result.name);
  history.length = Math.min(history.length, 5);
  try { window.parent.postMessage({ type: 'ruedaMisticaResult', key: state.result.key, name: state.result.name }, '*'); } catch (e) {}
  if (!muted) {
    chime.currentTime = 0;
    chime.play().catch(() => {});
  }
  const g = wheelGeom();
  for (let i = 0; i < 68; i++) {
    const angle = Math.random() * TAU;
    const speed = 1.5 + Math.random() * 4.5;
    state.particles.push({ x: g.cx, y: g.cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 });
  }
}

function unlockAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (audioCtx?.state === 'suspended') audioCtx.resume().catch(() => {});
  if (!muted) music.play().catch(() => {});
}

function toggleSound() {
  muted = !muted;
  if (muted) music.pause();
  else {
    unlockAudio();
    music.play().catch(() => {});
  }
}

function soundButtonHit(x, y) {
  if (IN_PORTAL) return false;
  return Math.hypot(x - (W - 34), y - 36) < 30;
}

let dragStart = null;
canvas.addEventListener('pointerdown', (event) => {
  unlockAudio();
  if (soundButtonHit(event.clientX, event.clientY)) {
    toggleSound();
    return;
  }
  dragStart = { x: event.clientX, y: event.clientY, time: performance.now() };
  if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointerup', (event) => {
  if (!dragStart) return;
  const distance = Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y);
  const elapsed = Math.max(performance.now() - dragStart.time, 16);
  dragStart = null;
  const power = distance > 24 ? Math.min(0.28 + (distance / elapsed) * 0.11, 0.72) : undefined;
  startSpin(power);
});
canvas.addEventListener('pointercancel', () => { dragStart = null; });
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
    unlockAudio();
    startSpin();
  } else if (event.key.toLowerCase() === 'm') {
    toggleSound();
  }
});

function rgba(hex, alpha) {
  const value = hex.replace('#', '');
  const number = Number.parseInt(value, 16);
  return `rgba(${(number >> 16) & 255},${(number >> 8) & 255},${number & 255},${alpha})`;
}

function sectorPath(r, start, end) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, start, end);
  ctx.closePath();
}

function drawSlices(r, time) {
  SLICES.forEach((slice, index) => {
    const start = -Math.PI / 2 - SLICE_ANGLE / 2 + index * SLICE_ANGLE;
    const end = start + SLICE_ANGLE;
    const middle = (start + end) / 2;
    const gx = Math.cos(middle) * r * 0.68;
    const gy = Math.sin(middle) * r * 0.68;

    ctx.save();
    sectorPath(r, start, end);
    const base = ctx.createRadialGradient(gx, gy, r * 0.04, gx, gy, r * 0.88);
    base.addColorStop(0, rgba(slice.glow, 0.82));
    base.addColorStop(0.35, slice.color);
    base.addColorStop(1, '#071027');
    ctx.fillStyle = base;
    ctx.fill();
    ctx.clip();

    if (nebula.complete && nebula.naturalWidth) {
      ctx.globalAlpha = 0.42;
      ctx.drawImage(nebula, -r, -r, r * 2, r * 2);
      ctx.globalAlpha = 1;
    }
    const cloud = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 0.74);
    cloud.addColorStop(0, rgba(slice.glow, 0.42));
    cloud.addColorStop(0.42, rgba(slice.color, 0.24));
    cloud.addColorStop(1, rgba(slice.color, 0));
    ctx.fillStyle = cloud;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    const edgeShade = ctx.createRadialGradient(0, 0, r * 0.22, 0, 0, r * 1.02);
    edgeShade.addColorStop(0, 'rgba(1,4,19,0.02)');
    edgeShade.addColorStop(0.72, 'rgba(1,4,19,0.04)');
    edgeShade.addColorStop(1, 'rgba(1,4,19,0.5)');
    ctx.fillStyle = edgeShade;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    // Delicate crystalline facets, kept subtle so the cloud texture remains visible.
    ctx.strokeStyle = 'rgba(223,224,255,0.11)';
    ctx.lineWidth = Math.max(0.7, r * 0.004);
    for (let facet = 1; facet <= 2; facet++) {
      const angle = start + (SLICE_ANGLE * facet) / 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * r * 0.31, Math.sin(angle) * r * 0.31);
      ctx.lineTo(Math.cos(angle) * r * 0.96, Math.sin(angle) * r * 0.96);
      ctx.stroke();
    }
    ctx.restore();
  });

  // Fine radial separators sit beneath the labels and the outer gold bezel.
  SLICES.forEach((_, index) => {
    const angle = -Math.PI / 2 - SLICE_ANGLE / 2 + index * SLICE_ANGLE;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * r * 0.29, Math.sin(angle) * r * 0.29);
    ctx.lineTo(Math.cos(angle) * r * 0.985, Math.sin(angle) * r * 0.985);
    ctx.strokeStyle = 'rgba(255,232,188,0.6)';
    ctx.lineWidth = Math.max(1, r * 0.006);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * r * 0.30, Math.sin(angle) * r * 0.30);
    ctx.lineTo(Math.cos(angle) * r * 0.98, Math.sin(angle) * r * 0.98);
    ctx.strokeStyle = 'rgba(255,255,255,0.34)';
    ctx.lineWidth = Math.max(0.55, r * 0.0025);
    ctx.stroke();
  });

  // Keep names and emblems crisp above all divider strokes.
  SLICES.forEach((slice, index) => {
    const start = -Math.PI / 2 - SLICE_ANGLE / 2 + index * SLICE_ANGLE;
    drawSliceContents(slice, start + SLICE_ANGLE / 2, r, time, index);
  });
}

function drawSliceContents(slice, angle, r, time, index) {
  const iconDistance = r * 0.46;
  const iconX = Math.cos(angle) * iconDistance;
  const iconY = Math.sin(angle) * iconDistance;
  const iconBox = r * 0.21;
  const image = slice.icon;

  if (image.complete && image.naturalWidth) {
    const scale = Math.min(iconBox / image.naturalWidth, iconBox / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.save();
    ctx.translate(iconX, iconY);
    // Ángeles is already upright; point each of the other emblems outward in its slice.
    if (index !== 0) ctx.rotate(angle + Math.PI / 2);
    ctx.shadowColor = slice.glow;
    ctx.shadowBlur = r * (0.075 + Math.sin(time / 420 + index) * 0.012);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  }

  const labelX = Math.cos(angle) * r * 0.79;
  const labelY = Math.sin(angle) * r * 0.79;
  const fontSize = Math.max(9.5, Math.min(r * 0.056, W * 0.033, 15));
  const maxWidth = r * 0.45;
  // Todas las etiquetas siguen la misma orientación tangencial, en el mismo sentido, sin voltear
  // ninguna por separado — así las 9 quedan consistentes entre sí.
  const labelRotation = index === 0 ? 0 : angle + Math.PI / 2;

  ctx.save();
  ctx.translate(labelX, labelY);
  ctx.rotate(labelRotation);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${fontSize}px Georgia, 'Times New Roman', serif`;
  ctx.fillStyle = '#fff8e8';
  ctx.shadowColor = 'rgba(0,0,0,0.95)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 1;
  ctx.fillText(slice.name, 0, 0, maxWidth);
  ctx.restore();

  // Place the small gilded star-rule between each label and its emblem.
  const halfLine = r * 0.075;
  if (index === 0) {
    const ornamentX = labelX;
    const ornamentY = labelY + (Math.sin(angle) < 0 ? 1 : -1) * fontSize * 1.28;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,219,133,0.78)';
    ctx.lineWidth = Math.max(0.8, r * 0.0035);
    ctx.beginPath();
    ctx.moveTo(ornamentX - halfLine, ornamentY);
    ctx.lineTo(ornamentX + halfLine, ornamentY);
    ctx.stroke();
    ctx.translate(ornamentX, ornamentY);
    ctx.shadowColor = '#ffd86f';
    ctx.shadowBlur = 6;
    drawDiamond(0, 0, r * 0.015, r * 0.031, true);
    ctx.restore();
  } else {
    const ornamentY = Math.cos(angle + Math.PI / 2) < 0 ? -fontSize * 1.28 : fontSize * 1.28;
    ctx.save();
    ctx.translate(labelX, labelY);
    ctx.rotate(labelRotation);
    ctx.strokeStyle = 'rgba(255,219,133,0.78)';
    ctx.lineWidth = Math.max(0.8, r * 0.0035);
    ctx.beginPath();
    ctx.moveTo(-halfLine, ornamentY);
    ctx.lineTo(halfLine, ornamentY);
    ctx.stroke();
    ctx.translate(0, ornamentY);
    ctx.shadowColor = '#ffd86f';
    ctx.shadowBlur = 6;
    drawDiamond(0, 0, r * 0.015, r * 0.031, true);
    ctx.restore();
  }
}

function metalGradient(radius) {
  const gradient = ctx.createLinearGradient(0, -radius, 0, radius);
  gradient.addColorStop(0, '#70420e');
  gradient.addColorStop(0.18, '#ffe9a0');
  gradient.addColorStop(0.34, '#b77720');
  gradient.addColorStop(0.51, '#fff4c4');
  gradient.addColorStop(0.69, '#d49a39');
  gradient.addColorStop(0.86, '#80500f');
  gradient.addColorStop(1, '#f7d275');
  return gradient;
}

function drawRimAndRivets(r) {
  const rimRadius = r * 1.025;
  ctx.save();
  ctx.shadowColor = 'rgba(255,187,62,0.52)';
  ctx.shadowBlur = r * 0.045;
  ctx.beginPath();
  ctx.arc(0, 0, rimRadius, 0, TAU);
  ctx.lineWidth = r * 0.048;
  ctx.strokeStyle = metalGradient(rimRadius);
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.999, 0, TAU);
  ctx.lineWidth = Math.max(1, r * 0.006);
  ctx.strokeStyle = '#fff0b1';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.052, 0, TAU);
  ctx.lineWidth = Math.max(1, r * 0.007);
  ctx.strokeStyle = '#8a561b';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.067, 0, TAU);
  ctx.setLineDash([Math.max(1, r * 0.009), Math.max(2, r * 0.014)]);
  ctx.lineWidth = Math.max(0.7, r * 0.003);
  ctx.strokeStyle = 'rgba(255,211,119,0.75)';
  ctx.stroke();
  ctx.setLineDash([]);

  SLICES.forEach((_, index) => {
    const angle = -Math.PI / 2 - SLICE_ANGLE / 2 + index * SLICE_ANGLE;
    const x = Math.cos(angle) * rimRadius;
    const y = Math.sin(angle) * rimRadius;
    const rivetRadius = r * 0.027;
    const rivet = ctx.createRadialGradient(x - rivetRadius * 0.35, y - rivetRadius * 0.42, 0.5, x, y, rivetRadius);
    rivet.addColorStop(0, '#fff9d8');
    rivet.addColorStop(0.38, '#f5cf76');
    rivet.addColorStop(0.78, '#ab6b20');
    rivet.addColorStop(1, '#512d0d');
    ctx.beginPath();
    ctx.arc(x, y, rivetRadius, 0, TAU);
    ctx.fillStyle = rivet;
    ctx.fill();
    ctx.lineWidth = Math.max(0.8, r * 0.004);
    ctx.strokeStyle = '#ffe7a2';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, rivetRadius * 0.42, 0, TAU);
    ctx.strokeStyle = 'rgba(255,255,240,0.58)';
    ctx.lineWidth = Math.max(0.45, r * 0.002);
    ctx.stroke();
  });
}

function drawDiamond(x, y, halfWidth, halfHeight, filled) {
  ctx.beginPath();
  ctx.moveTo(x, y - halfHeight);
  ctx.lineTo(x + halfWidth, y);
  ctx.lineTo(x, y + halfHeight);
  ctx.lineTo(x - halfWidth, y);
  ctx.closePath();
  if (filled) {
    const gold = ctx.createLinearGradient(x - halfWidth, y - halfHeight, x + halfWidth, y + halfHeight);
    gold.addColorStop(0, '#fff5c3');
    gold.addColorStop(0.48, '#f0c45f');
    gold.addColorStop(1, '#9b641a');
    ctx.fillStyle = gold;
    ctx.fill();
  }
  ctx.strokeStyle = '#ffe7a0';
  ctx.lineWidth = Math.max(0.8, halfWidth * 0.3);
  ctx.stroke();
}

function drawStar(x, y, outerRadius, innerRadius, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    if (i === 0) ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    else ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
}

function drawHub(r, time) {
  const ringRadius = r * 0.335;
  const ringFill = ctx.createRadialGradient(0, 0, r * 0.21, 0, 0, ringRadius);
  ringFill.addColorStop(0, '#160a30');
  ringFill.addColorStop(0.72, '#110823');
  ringFill.addColorStop(1, '#402354');
  ctx.beginPath();
  ctx.arc(0, 0, ringRadius, 0, TAU);
  ctx.fillStyle = ringFill;
  ctx.fill();
  ctx.lineWidth = r * 0.011;
  ctx.strokeStyle = metalGradient(ringRadius);
  ctx.stroke();

  [r * 0.295, r * 0.274].forEach((radius, index) => {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, TAU);
    ctx.lineWidth = index === 0 ? r * 0.004 : r * 0.002;
    ctx.strokeStyle = index === 0 ? 'rgba(255,223,144,0.8)' : 'rgba(255,223,144,0.42)';
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.308, 0, TAU);
  ctx.setLineDash([r * 0.006, r * 0.012]);
  ctx.lineWidth = Math.max(0.7, r * 0.003);
  ctx.strokeStyle = 'rgba(255,221,143,0.76)';
  ctx.stroke();
  ctx.setLineDash([]);

  const orbRadius = r * 0.238;
  const orb = ctx.createRadialGradient(-orbRadius * 0.25, -orbRadius * 0.32, orbRadius * 0.025, 0, 0, orbRadius);
  orb.addColorStop(0, '#fff0bd');
  orb.addColorStop(0.12, '#d9a1ff');
  orb.addColorStop(0.48, '#7131ba');
  orb.addColorStop(0.78, '#30105b');
  orb.addColorStop(1, '#140627');
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius, 0, TAU);
  ctx.fillStyle = orb;
  ctx.fill();
  ctx.lineWidth = r * 0.012;
  ctx.strokeStyle = metalGradient(orbRadius);
  ctx.stroke();

  ctx.save();
  ctx.shadowColor = '#ffd572';
  ctx.shadowBlur = r * (0.09 + Math.sin(time / 310) * 0.025);
  drawStar(0, 0, orbRadius * 0.79, orbRadius * 0.105, 4);
  const cross = ctx.createLinearGradient(0, -orbRadius, 0, orbRadius);
  cross.addColorStop(0, '#fff9d8');
  cross.addColorStop(0.42, '#ffd46b');
  cross.addColorStop(1, '#a85a13');
  ctx.fillStyle = cross;
  ctx.fill();
  drawStar(0, 0, orbRadius * 0.62, orbRadius * 0.31, 8);
  ctx.fillStyle = 'rgba(255,244,193,0.9)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, orbRadius * 0.07, 0, TAU);
  ctx.fillStyle = '#fff8db';
  ctx.fill();
  ctx.restore();

  // Four tiny compass lights embedded around the medallion bezel.
  for (let i = 0; i < 4; i++) {
    const angle = -Math.PI / 2 + i * Math.PI / 2;
    const x = Math.cos(angle) * r * 0.31;
    const y = Math.sin(angle) * r * 0.31;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.shadowColor = '#ffd66c';
    ctx.shadowBlur = 7;
    drawDiamond(0, 0, r * 0.022, r * 0.045, true);
    ctx.restore();
  }
}

function drawPointer(g) {
  const tipY = g.cy - g.r * 0.985;
  const size = g.r * 0.12;
  ctx.save();
  ctx.translate(g.cx, tipY - size * 0.86);
  ctx.rotate(state.pointerKick);
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(-size * 0.68, -size * 0.16);
  ctx.lineTo(size * 0.68, -size * 0.16);
  ctx.lineTo(0, size * 0.98);
  ctx.closePath();
  const gold = ctx.createLinearGradient(-size, 0, size, 0);
  gold.addColorStop(0, '#9d6418');
  gold.addColorStop(0.5, '#fff0aa');
  gold.addColorStop(1, '#ab6d1e');
  ctx.fillStyle = gold;
  ctx.fill();
  ctx.lineWidth = Math.max(1, size * 0.055);
  ctx.strokeStyle = '#fff0b5';
  ctx.stroke();
  ctx.restore();
}

function drawCompassOrnaments(g) {
  const radius = g.r * 1.105;
  [0, Math.PI, Math.PI / 2].forEach((angle) => {
    const x = g.cx + Math.cos(angle) * radius;
    const y = g.cy + Math.sin(angle) * radius;
    const width = g.r * 0.034;
    const height = g.r * 0.078;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.shadowColor = 'rgba(255,208,100,0.8)';
    ctx.shadowBlur = 8;
    drawDiamond(0, 0, width, height, false);
    ctx.beginPath();
    ctx.arc(0, 0, g.r * 0.012, 0, TAU);
    ctx.fillStyle = '#fff0b0';
    ctx.fill();
    ctx.restore();
  });
}

function drawBackground(g, time) {
  ctx.fillStyle = '#080b2b';
  ctx.fillRect(0, 0, W, H);
  const aura = ctx.createRadialGradient(g.cx, g.cy, g.r * 0.22, g.cx, g.cy, g.r * 2.25);
  aura.addColorStop(0, 'rgba(61,35,111,0.3)');
  aura.addColorStop(0.35, 'rgba(27,28,87,0.2)');
  aura.addColorStop(1, 'rgba(4,7,25,0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, W, H);

  stars.forEach((star) => {
    const twinkle = 0.82 + Math.sin(time / 900 + star.phase) * 0.18;
    ctx.globalAlpha = star.alpha * twinkle;
    ctx.fillStyle = '#cbdcff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, TAU);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.beginPath();
  ctx.arc(g.cx, g.cy, g.outer * 1.12, 0, TAU);
  ctx.strokeStyle = 'rgba(104,112,201,0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(g.cx, g.cy, g.outer * 1.17, 0, TAU);
  ctx.setLineDash([1, 5]);
  ctx.strokeStyle = 'rgba(231,196,126,0.24)';
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawSoundButton() {
  if (IN_PORTAL) return;
  const x = W - 34;
  const y = 36;
  const radius = 22;
  const button = ctx.createRadialGradient(x - 5, y - 7, 2, x, y, radius);
  button.addColorStop(0, '#29213c');
  button.addColorStop(1, '#0c0c18');
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fillStyle = button;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(235,197,117,0.72)';
  ctx.stroke();
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#ffebbb';
  ctx.strokeStyle = '#ffebbb';
  ctx.lineWidth = 1.7;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-10, -4);
  ctx.lineTo(-6, -4);
  ctx.lineTo(-1, -8);
  ctx.lineTo(-1, 8);
  ctx.lineTo(-6, 4);
  ctx.lineTo(-10, 4);
  ctx.closePath();
  ctx.fill();
  if (muted) {
    ctx.beginPath();
    ctx.moveTo(3, -5);
    ctx.lineTo(9, 5);
    ctx.moveTo(9, -5);
    ctx.lineTo(3, 5);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(-1, 0, 6, -0.9, 0.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-1, 0, 10, -0.75, 0.75);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBottomUI(g, time) {
  const y = Math.min(g.cy + g.outer + 58, H - 38);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (state.result) {
    const fade = Math.min(1, (time - state.resultTime) / 300);
    ctx.globalAlpha = fade;
    ctx.font = `600 ${Math.min(18, W * 0.045)}px Georgia, 'Times New Roman', serif`;
    ctx.shadowColor = '#ffd86f';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffe6a7';
    ctx.fillText(`Ha salido: ${state.result.name}`, W / 2, y);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  } else if (!state.spinning) {
    const remaining = msUntilNextSpin();
    ctx.globalAlpha = 0.66 + Math.sin(time / 520) * 0.22;
    ctx.font = `500 ${Math.min(14, W * 0.036)}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = remaining > 0 ? '#c9b7ff' : '#d8d2ed';
    ctx.fillText(remaining > 0 ? `Ya giraste hoy · próximo giro en ${formatCooldown(remaining)}` : 'Toca o desliza para girar', W / 2, y);
    ctx.globalAlpha = 1;
  }

  if (history.length) {
    ctx.font = `12px Inter, system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(207,201,230,0.6)';
    ctx.fillText(`Últimos: ${history.join(' · ')}`, W / 2, Math.min(y + 24, H - 17), W * 0.9);
  }
}

function update() {
  if (state.spinning) {
    state.angle += state.velocity;
    state.velocity *= 0.985;
    const tickIndex = Math.floor(state.angle / SLICE_ANGLE);
    if (tickIndex !== state.lastTickIndex) {
      state.lastTickIndex = tickIndex;
      state.pointerKick = 0.2;
      playTick();
    }
    if (state.velocity < 0.002) finishSpin();
  }
  state.pointerKick *= 0.76;
  state.particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.97;
    particle.vy *= 0.97;
    particle.life -= 0.014;
  });
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function render(time) {
  update();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const g = wheelGeom();
  drawBackground(g, time);

  ctx.save();
  ctx.translate(g.cx, g.cy);
  ctx.shadowColor = 'rgba(111,74,204,0.68)';
  ctx.shadowBlur = g.r * 0.12;
  ctx.beginPath();
  ctx.arc(0, 0, g.r * 1.08, 0, TAU);
  ctx.fillStyle = '#070817';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.rotate(state.angle);
  drawSlices(g.r, time);
  drawHub(g.r, time);
  drawRimAndRivets(g.r);
  ctx.restore();

  drawCompassOrnaments(g);
  drawPointer(g);
  state.particles.forEach((particle) => {
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = '#ffe9a0';
    drawStar(particle.x, particle.y, 4.5, 1.4, 4);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  drawSoundButton();
  drawBottomUI(g, time);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
