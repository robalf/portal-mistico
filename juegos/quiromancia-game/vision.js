export const VISION_VERSION = 'creases-1.0';

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const round = (value, places = 2) => Number(value.toFixed(places));

function skinLike(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = .2126 * r + .7152 * g + .0722 * b;
  const chroma = max - min;
  // Tolerant local heuristic: skin can look warm, neutral, dark, or cool
  // depending on the camera, the room light, and the device white balance.
  const warmOrCoolSkin = r >= b * .78 && g >= b * .62 && r >= g * .68;
  const softNeutralSkin = chroma <= Math.max(20, max * .2) && brightness > 58;
  return brightness > 24 && ((warmOrCoolSkin && chroma > 8) || softNeutralSkin);
}

function sampleImage(canvas, size = 96) {
  const sample = document.createElement('canvas');
  sample.width = size; sample.height = size;
  const context = sample.getContext('2d', { willReadFrequently: true });
  context.drawImage(canvas, 0, 0, size, size);
  return { data: context.getImageData(0, 0, size, size).data, size };
}

function imageMetrics(canvas, sampleSize = 96) {
  const { data, size } = sampleImage(canvas, sampleSize);
  const luminance = [];
  const mask = [];
  let warm = 0;
  let clipped = 0;
  let dark = 0;
  let edgeEnergy = 0;
  let mean = 0;
  let skinCount = 0;
  let hash = 2166136261;
  for (let i = 0; i < data.length; i += 4) {
    const value = .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2];
    luminance.push(value);
    mean += value;
    warm += data[i] - data[i + 2];
    if (value > 247) clipped += 1;
    if (value < 18) dark += 1;
    const isSkin = skinLike(data[i], data[i + 1], data[i + 2]);
    mask.push(isSkin);
    if (isSkin) skinCount += 1;
    hash ^= data[i] + data[i + 1] * 3 + data[i + 2] * 7;
    hash = Math.imul(hash, 16777619);
  }
  mean /= luminance.length;
  let variance = 0;
  for (const value of luminance) variance += (value - mean) ** 2;
  for (let y = 1; y < size - 1; y += 1) {
    for (let x = 1; x < size - 1; x += 1) {
      const index = y * size + x;
      edgeEnergy += Math.abs(luminance[index] - luminance[index - 1]);
      edgeEnergy += Math.abs(luminance[index] - luminance[index - size]);
    }
  }
  const points = [];
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    if (mask[y * size + x]) points.push({ x, y });
  }
  const bbox = points.length ? {
    left: Math.min(...points.map(p => p.x)) / size,
    top: Math.min(...points.map(p => p.y)) / size,
    right: Math.max(...points.map(p => p.x)) / size,
    bottom: Math.max(...points.map(p => p.y)) / size
  } : null;
  // Lado del pulgar: en la franja media-baja de la mano el pulgar sobresale hacia un costado.
  let thumbSide = null;
  if (bbox) {
    const x0 = Math.round(bbox.left * size), x1 = Math.round(bbox.right * size);
    const y0 = Math.round((bbox.top + (bbox.bottom - bbox.top) * .45) * size), y1 = Math.round((bbox.top + (bbox.bottom - bbox.top) * .75) * size);
    const third = Math.max(1, Math.round((x1 - x0) / 3));
    let leftMass = 0, rightMass = 0;
    for (let y = y0; y < y1; y += 1) for (let x = x0; x < x0 + third; x += 1) if (mask[y * size + x]) leftMass += 1;
    for (let y = y0; y < y1; y += 1) for (let x = x1 - third; x < x1; x += 1) if (mask[y * size + x]) rightMass += 1;
    const total = leftMass + rightMass;
    if (total > 20 && Math.abs(leftMass - rightMass) / total > .25) thumbSide = leftMass > rightMass ? 'left' : 'right';
  }
  const skinRatio = skinCount / (size * size);
  const focus = clamp(edgeEnergy / (size * size * 68));
  const contrast = clamp(Math.sqrt(variance / luminance.length) / 112);
  const brightness = mean / 255;
  const exposure = clamp(1 - Math.abs(brightness - .52) / .52);
  const complete = Boolean(bbox && bbox.left > .003 && bbox.top > .003 && bbox.right < .997 && bbox.bottom < .997);
  const clippedRatio = clipped / luminance.length;
  const darkRatio = dark / luminance.length;
  const occupancy = bbox ? (bbox.right - bbox.left) * (bbox.bottom - bbox.top) : 0;
  return { brightness, contrast, focus, exposure, warm: (warm / luminance.length + 255) / 510, skinRatio, clippedRatio, darkRatio, occupancy, bbox, complete, thumbSide, seed: Math.abs(hash) };
}

function qualityReport(metrics, canvas, modelDetected = false) {
  const checks = [];
  const minSide = Math.min(canvas.width, canvas.height);
  checks.push({ key: 'resolution', label: 'Resolución suficiente', ok: minSide >= 420, detail: minSide >= 420 ? `${canvas.width} × ${canvas.height}` : 'La imagen es demasiado pequeña.' });
  checks.push({ key: 'focus', label: 'Poco desenfoque o movimiento', ok: metrics.focus >= .18, detail: metrics.focus >= .18 ? 'Textura suficiente para observar la palma.' : 'La imagen parece desenfocada o movida.' });
  checks.push({ key: 'exposure', label: 'Iluminación equilibrada', ok: metrics.exposure >= .48 && metrics.brightness > .08 && metrics.brightness < .92, detail: metrics.brightness < .08 ? 'La fotografía está subexpuesta.' : metrics.brightness > .92 ? 'La fotografía está sobreexpuesta.' : 'Luz general aceptable.' });
  checks.push({ key: 'shadows', label: 'Sin sombra dominante', ok: metrics.darkRatio < .62, detail: metrics.darkRatio < .62 ? 'No domina una sombra sobre la imagen.' : 'Hay demasiadas zonas oscuras para distinguir detalles.' });
  checks.push({ key: 'reflections', label: 'Sin reflejos fuertes', ok: metrics.clippedRatio < .18, detail: metrics.clippedRatio < .18 ? 'No hay demasiadas zonas quemadas.' : 'Hay reflejos o zonas sobreexpuestas.' });
  checks.push({ key: 'hand', label: 'Palma visible', ok: modelDetected || metrics.skinRatio >= .006, detail: modelDetected ? 'El detector encontró la palma y los dedos.' : metrics.skinRatio >= .006 ? 'Se encontró una región compatible con piel.' : 'No se encontró una región de mano suficientemente clara.' });
  checks.push({ key: 'distance', label: 'Distancia adecuada', ok: metrics.occupancy >= .012 && metrics.occupancy <= .96, detail: metrics.occupancy < .012 ? 'Acerca un poco la mano.' : metrics.occupancy > .96 ? 'Aleja un poco la mano.' : 'Escala de mano aceptable.' });
  checks.push({ key: 'complete', label: 'Mano dentro del marco', ok: metrics.complete, detail: metrics.complete ? 'La región detectada no toca los bordes.' : 'La mano puede estar cortada o demasiado cerca del borde.' });
  const passed = checks.filter(check => check.ok).length;
  const score = round(passed / checks.length);
  // A usable palm must be detected, but framing is only guidance. Skin masks
  // often stop short of the image edge even when the hand itself is clear, and
  // a cropped fingertip should not force the user into an endless retry loop.
  const handCheck = checks.find(check => check.key === 'hand');
  const valid = Boolean(handCheck?.ok);
  return { valid, score, checks, message: 'No encontramos la mano con claridad. Prueba a mostrar la palma abierta con luz uniforme.' };
}

function normalizePoint(x, y) { return { x: round(clamp(x)), y: round(clamp(y)) }; }

function buildGeometry(metrics) {
  const box = metrics.bbox || { left: .2, top: .1, right: .8, bottom: .9 };
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const palmTop = box.top + height * .28;
  const palmBottom = box.top + height * .82;
  const palmLeft = box.left + width * .12;
  const palmRight = box.right - width * .12;
  const fingerBases = [.27, .42, .57, .72, .86].map(r => normalizePoint(box.left + width * r, palmTop));
  const fingerTips = [.22, .40, .58, .75, .9].map(r => normalizePoint(box.left + width * r, box.top + height * (.04 + Math.abs(r - .58) * .10)));
  const landmarks = {
    wrist: normalizePoint((box.left + box.right) / 2, box.bottom),
    palmCenter: normalizePoint((palmLeft + palmRight) / 2, (palmTop + palmBottom) / 2),
    thumbBase: normalizePoint(box.left + width * .12, box.top + height * .58),
    thumbTip: normalizePoint(box.left - width * .03, box.top + height * .47),
    fingerBases, fingerTips
  };
  return { contour: [normalizePoint(box.left, box.top), normalizePoint(box.right, box.top), normalizePoint(box.right, box.bottom), normalizePoint(box.left, box.bottom)], palm: { left: round(palmLeft), top: round(palmTop), right: round(palmRight), bottom: round(palmBottom) }, landmarks, normalized: true, source: 'native_fallback_template', estimated: true };
}

function lineFeature(id, label, color, metrics, index, paths, crease) {
  if (crease) return creaseFeature(id, label, color, crease, paths);
  const confidence = round(clamp(.42 + metrics.focus * .26 + metrics.contrast * .16 + metrics.exposure * .12 - index * .015));
  const visible = confidence >= .52;
  const variants = {
    heart_line: ['curva moderada', 'continua', 'terminación entre índice y medio'],
    head_line: ['ligeramente inclinada', 'continua', 'dirección estable'],
    life_line: ['arco amplio', 'continua', 'curvatura envolvente'],
    fate_line: ['trayectoria vertical candidata', 'incierta', 'presencia parcial']
  };
  const observations = variants[id] || ['trayectoria candidata'];
  return { feature: id, label, color, detected: visible, status: visible ? 'candidate' : 'indeterminate', confidence, certaintyOfInterpretation: 0, observations: visible ? observations : ['No se distingue con suficiente claridad.'], start: null, end: null, length_normalized: visible ? round(.54 + metrics.contrast * .22) : null, depth: visible ? (metrics.contrast > .55 ? 'deep_apparent' : 'light_apparent') : 'indeterminate', curvature: visible ? observations[0] : 'indeterminate', continuity: visible ? observations[1] : 'indeterminate', branches: 0, forks: 0, islands: 0, crosses: 0, coordinates: visible ? { path: paths[id] } : null, source: 'native_fallback_candidate' };
}

function creaseFeature(id, label, color, c, paths) {
  const base = { feature: id, label, color, certaintyOfInterpretation: 0, start: null, end: null, branches: 0, forks: 0, islands: 0, crosses: 0 };
  if (c.found) {
    const deep = c.strength >= 2.6;
    const continuity = c.coverage >= .8 ? 'continua' : 'con tramos tenues';
    const length = c.lengthKept >= .9 ? 'larga' : c.lengthKept >= .75 ? 'de longitud media' : 'corta';
    const confidence = round(clamp(.55 + (c.strength - 1.75) * .12 + (c.coverage - .55) * .3, .5, .92));
    return { ...base, detected: true, status: 'traced', confidence, observations: [`seguida sobre el pliegue visible de tu palma`, deep ? 'marcada' : 'suave', continuity, length], length_normalized: round(c.lengthKept), depth: deep ? 'deep_apparent' : 'light_apparent', curvature: 'según el pliegue real', continuity, coordinates: { path: c.path }, source: 'crease_trace' };
  }
  if (id === 'fate_line' && !c.reason) return { ...base, detected: false, status: 'indeterminate', confidence: round(clamp(.3 + c.coverage * .2)), observations: ['No se distingue un pliegue vertical claro en la foto.'], length_normalized: null, depth: 'indeterminate', curvature: 'indeterminate', continuity: 'indeterminate', coordinates: null, source: 'crease_trace' };
  // Si el pliegue no se ve claro en la foto, NO se dibuja ni se interpreta: no se inventan líneas.
  return { ...base, detected: false, status: 'not_visible', confidence: round(clamp(.15 + (c.coverage || 0) * .14)), observations: [c.reason || 'No se distingue con claridad en tu foto, así que no la dibujamos.'], length_normalized: null, depth: 'indeterminate', curvature: 'indeterminate', continuity: 'indeterminate', coordinates: null, source: 'crease_trace' };
}

const v = (x, y) => ({ x, y });
const add = (a, b) => v(a.x + b.x, a.y + b.y);
const sub = (a, b) => v(a.x - b.x, a.y - b.y);
const mul = (a, k) => v(a.x * k, a.y * k);
const lerp = (a, b, t) => v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const unit = a => { const l = Math.hypot(a.x, a.y) || 1; return v(a.x / l, a.y / l); };
// Se trabaja en un espacio con la proporción real de la foto (x multiplicado por ancho/alto) y se vuelve a 0–1 al escribir el trazo.
let AR = 1;
const fmt = p => `${round(clamp(p.x / AR), 3)} ${round(clamp(p.y), 3)}`;
const curve = (s, c1, c2, e) => [s, c1, c2, e];
const bezPath = b => `M ${fmt(b[0])} C ${fmt(b[1])} ${fmt(b[2])} ${fmt(b[3])}`;
const bezAt = (b, t) => { const u = 1 - t; return v(u*u*u*b[0].x + 3*u*u*t*b[1].x + 3*u*t*t*b[2].x + t*t*t*b[3].x, u*u*u*b[0].y + 3*u*u*t*b[1].y + 3*u*t*t*b[2].y + t*t*t*b[3].y); };
// Curva que pasa por el punto medio m (aprox.)
const through = (s, m, e) => { const c = sub(mul(m, 2), mul(add(s, e), .5)); return curve(s, lerp(s, c, .66), lerp(e, c, .66), e); };

// Puntos clave de la palma: con los 21 landmarks reales si existen; si no, una plantilla ajustada al contorno detectado.
function palmKeypoints(landmarks, bbox, hand, ar = 1, thumbSide = null) {
  if (Array.isArray(landmarks) && landmarks.length >= 21) {
    const P = i => v(landmarks[i].x * ar, landmarks[i].y);
    return { W: P(0), T1: P(1), T2: P(2), T4: P(4), I: P(5), M: P(9), R: P(13), K: P(17), real: true };
  }
  const b = bbox || { left: .2, top: .1, right: .8, bottom: .9 };
  const w = b.right - b.left, h = b.bottom - b.top;
  // Foto de tu propia palma (fingers arriba): en la mano izquierda el pulgar queda a la IZQUIERDA de la foto; en la derecha, a la derecha.
  // Si la silueta muestra claramente de qué lado sobresale el pulgar, se usa eso.
  const thumbRight = thumbSide ? thumbSide === 'right' : hand === 'right';
  const X = r => (b.left + w * (thumbRight ? 1 - r : r)) * ar;
  const Y = r => b.top + h * r;
  return { W: v(X(.5), Y(.97)), T1: v(X(.24), Y(.84)), T2: v(X(.12), Y(.66)), T4: v(X(.02), Y(.46)), I: v(X(.3), Y(.42)), M: v(X(.5), Y(.4)), R: v(X(.66), Y(.42)), K: v(X(.8), Y(.46)), real: false };
}

function linePaths(kp, ar = 1) {
  AR = ar;
  const L = dist(kp.W, kp.M) || .3;
  const down = unit(sub(kp.W, kp.M));          // de los dedos hacia la muñeca
  const outward = unit(sub(kp.K, kp.I));       // del índice hacia el meñique
  const center = mul(add(add(kp.W, kp.M), add(kp.I, kp.K)), .25);
  // Corazón: nace en el borde bajo el meñique y sube en curva hasta entre índice y medio.
  const hs = add(add(kp.K, mul(down, .2 * L)), mul(outward, .06 * L));
  const he = add(lerp(kp.I, kp.M, .45), mul(down, .1 * L));
  const heart = curve(hs, add(lerp(hs, he, .35), mul(down, .07 * L)), add(lerp(hs, he, .7), mul(down, .07 * L)), he);
  // Cabeza: nace entre pulgar e índice y cruza la palma bajando hacia el lado del meñique.
  const ds = add(lerp(kp.I, kp.T2, .5), mul(down, .1 * L));
  const de = add(add(kp.K, mul(down, .34 * L)), mul(outward, -.04 * L));
  const head = curve(ds, add(lerp(ds, de, .35), mul(down, .02 * L)), add(lerp(ds, de, .7), mul(down, .06 * L)), de);
  // Vida: nace cerca de la cabeza y rodea la base del pulgar hasta la muñeca.
  const ls = add(lerp(kp.I, kp.T2, .45), mul(down, .06 * L));
  const le = lerp(kp.W, kp.T1, .4);
  const life = through(ls, lerp(kp.T1, center, .5), le);
  // Destino: sube por el centro desde la muñeca hacia el dedo medio.
  const fs = add(kp.W, mul(down, -.08 * L));
  const fe = add(kp.M, mul(down, .14 * L));
  const fate = through(fs, add(lerp(fs, fe, .5), mul(outward, .02 * L)), fe);
  return { beziers: { heart_line: heart, head_line: head, life_line: life, fate_line: fate }, L, center, real: Boolean(kp.real) };
}

// ---------- Detección de pliegues reales en la foto ----------
// Un pliegue es un "valle": una franja fina más oscura que la piel a AMBOS lados.
// Se mide en la dirección perpendicular al trazo, así los bordes de la mano o las sombras
// (oscuros solo de un lado) no cuentan como líneas.
function creaseMap(canvas) {
  const maxSide = 900;
  const scale = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
  const W = Math.max(8, Math.round(canvas.width * scale)), H = Math.max(8, Math.round(canvas.height * scale));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(canvas, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  const raw = new Float32Array(W * H), skin = new Uint8Array(W * H);
  for (let i = 0, j = 0; i < d.length; i += 4, j += 1) {
    raw[j] = .3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2];
    skin[j] = skinLike(d[i], d[i + 1], d[i + 2]) ? 1 : 0;
  }
  // Suavizado ligero (3×3) para quitar el ruido del sensor sin borrar los pliegues.
  const G = new Float32Array(W * H);
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) {
    let sum = 0, n = 0;
    for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H) { sum += raw[yy * W + xx]; n += 1; } }
    G[y * W + x] = sum / n;
  }
  // Mapa de valles (tipo "black-hat"): cuánto más oscuro es cada punto que su entorno.
  // Los pliegues de la palma son franjas finas más oscuras que la piel de alrededor.
  const boxBlur = (src, r) => {
    const tmp = new Float32Array(W * H), out = new Float32Array(W * H);
    for (let y = 0; y < H; y += 1) { let acc = 0; const row = y * W;
      for (let x = -r; x <= r; x += 1) acc += src[row + Math.min(W - 1, Math.max(0, x))];
      for (let x = 0; x < W; x += 1) { tmp[row + x] = acc / (2 * r + 1); acc += src[row + Math.min(W - 1, x + r + 1)] - src[row + Math.max(0, x - r)]; } }
    for (let x = 0; x < W; x += 1) { let acc = 0;
      for (let y = -r; y <= r; y += 1) acc += tmp[Math.min(H - 1, Math.max(0, y)) * W + x];
      for (let y = 0; y < H; y += 1) { out[y * W + x] = acc / (2 * r + 1); acc += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x]; } }
    return out;
  };
  const R = Math.max(2, Math.round(Math.max(W, H) / 120));
  let L = boxBlur(G, R); L = boxBlur(L, R); L = boxBlur(L, R);
  const V = new Float32Array(W * H);
  for (let i = 0; i < V.length; i += 1) V[i] = Math.max(0, L[i] - G[i]) / (L[i] + 10);
  return { G, V, skin, W, H, px: 1 / Math.max(W, H), k: Math.max(1, Math.max(W, H) / 480) };
}

function sampleG(map, x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  if (xi < 0 || yi < 0 || xi >= map.W - 1 || yi >= map.H - 1) return null;
  const fx = x - xi, fy = y - yi, i = yi * map.W + xi, G = map.G;
  return G[i] * (1 - fx) * (1 - fy) + G[i + 1] * fx * (1 - fy) + G[i + map.W] * (1 - fx) * fy + G[i + map.W + 1] * fx * fy;
}

// Profundidad del valle en el punto p (espacio con proporción real) mirando a lo largo de la normal n.
function valleyAt(map, p, n, ar) {
  const x = (p.x / ar) * map.W, y = p.y * map.H;
  const xi = Math.round(x), yi = Math.round(y);
  if (xi < 0 || yi < 0 || xi >= map.W || yi >= map.H || !map.skin[yi * map.W + xi]) return 0;
  const center = sampleG(map, x, y);
  if (center === null) return 0;
  // Valor del valle en ese punto; si no es más oscuro que la piel a AMBOS lados
  // (borde de la mano, sombra), cuenta muy poco.
  const xi0 = Math.min(map.W - 1, xi), yi0 = Math.min(map.H - 1, yi);
  let val = map.V[yi0 * map.W + xi0];
  let twoSided = false;
  for (const w0 of [2, 3.5]) {
    const w = w0 * map.k;
    const a = sampleG(map, x + n.x * w, y + n.y * w), b = sampleG(map, x - n.x * w, y - n.y * w);
    if (a !== null && b !== null && Math.min(a, b) > center + .5) twoSided = true;
  }
  return twoSided ? val : val * .25;
}

// Curva suave (Catmull-Rom → Bézier) que pasa por los puntos encontrados.
function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${fmt(points[0])}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = add(p1, mul(sub(p2, p0), 1 / 6)), c2 = sub(p2, mul(sub(p3, p1), 1 / 6));
    d += ` C ${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
  }
  return d;
}

// Busca el pliegue real cerca de la trayectoria anatómica esperada (programación dinámica:
// el trazo puede apartarse del molde, pero sin saltos bruscos de un punto al siguiente).
function traceCrease(map, bez, ar, L, band, baseline, trimEnd = .2, minLength = .6) {
  const N = 34, K = 10, step = band / K, lambda = 1.2;
  const pts = [], normals = [], tangents = [];
  for (let i = 0; i < N; i += 1) {
    const t = i / (N - 1), p = bezAt(bez, t);
    const tan = unit(sub(bezAt(bez, Math.min(1, t + .01)), bezAt(bez, Math.max(0, t - .01))));
    pts.push(p); tangents.push(tan); normals.push(v(-tan.y, tan.x));
  }
  const along = L * .012;
  const score = pts.map((p, i) => {
    const row = [];
    // normal en píxeles del mapa (la x del espacio de trabajo está multiplicada por ar)
    const nPix = unit(v(normals[i].x / ar * map.W, normals[i].y * map.H));
    for (let k = -K; k <= K; k += 1) {
      const q = add(p, mul(normals[i], k * step));
      const r = (valleyAt(map, q, nPix, ar) + valleyAt(map, add(q, mul(tangents[i], along)), nPix, ar) + valleyAt(map, sub(q, mul(tangents[i], along)), nPix, ar)) / 3;
      row.push(r / baseline - Math.abs(k) / K * .2);
    }
    return row;
  });
  const S = 2 * K + 1;
  let best = score[0].slice(); const back = [];
  for (let i = 1; i < N; i += 1) {
    const cur = new Array(S).fill(-Infinity), from = new Array(S).fill(0);
    for (let k = 0; k < S; k += 1) for (let dk = -2; dk <= 2; dk += 1) {
      const j = k + dk; if (j < 0 || j >= S) continue;
      const val = best[j] - lambda * Math.abs(dk) + score[i][k];
      if (val > cur[k]) { cur[k] = val; from[k] = j; }
    }
    best = cur; back.push(from);
  }
  let k = best.indexOf(Math.max(...best)); const ks = [k];
  for (let i = N - 2; i >= 0; i -= 1) { k = back[i][k]; ks.unshift(k); }
  const raw = ks.map((kk, i) => score[i][kk] + Math.abs(kk - K) / K * .2);
  // Recorta los extremos donde el pliegue se desvanece (hasta 20% por cada lado).
  const strong = raw.map(r => r >= 1);
  let a = 0, b = N - 1;
  while (a < N * .2 && !strong[a]) a += 1;
  while (b > N * (1 - trimEnd) && !strong[b]) b -= 1;
  const kept = raw.slice(a, b + 1);
  const mean = kept.reduce((x, y) => x + y, 0) / kept.length;
  const coverage = kept.filter(r => r >= 1).length / kept.length;
  const offs = ks.map((kk, i) => { let sum = 0, n = 0; for (let j = Math.max(0, i - 2); j <= Math.min(N - 1, i + 2); j += 1) { sum += ks[j]; n += 1; } return (sum / n - K) * step; });
  const traced = [];
  for (let i = a; i <= b; i += 2) traced.push(add(pts[i], mul(normals[i], offs[i])));
  if ((b - a) % 2) traced.push(add(pts[b], mul(normals[b], offs[b])));
  const lengthKept = (b - a) / (N - 1);
  const meanY = traced.reduce((acc, p) => acc + p.y, 0) / traced.length;
  return { found: mean >= FOUND_MEAN && coverage >= FOUND_COVER && lengthKept >= minLength, strength: mean, coverage, lengthKept, meanY, pts: traced, path: smoothPath(traced) };
}
const FOUND_MEAN = 1.1, FOUND_COVER = .55;
// Según los quirólogos la línea de la cabeza y la de la vida pueden ser cortas (la cabeza puede
// terminar bajo el dedo medio); por eso su final se puede recortar más que el del corazón.
const TRIM_END = { heart_line: .3, head_line: .55, life_line: .5, fate_line: .5 };
const MIN_LEN = { heart_line: .5, head_line: .4, life_line: .4, fate_line: .4 };

function detectCreases(canvas, geo, ar) {
  const map = creaseMap(canvas);
  // Referencia: respuesta típica de la piel de la palma en puntos y direcciones al azar (percentil 90).
  const vals = [];
  for (let i = 0; i < 600; i += 1) {
    const ang = i * 2.399, rad = Math.sqrt(i / 600) * geo.L * .5, dir = i * 1.7;
    const p = add(geo.center, v(Math.cos(ang) * rad, Math.sin(ang) * rad));
    vals.push(valleyAt(map, p, v(Math.cos(dir), Math.sin(dir)), ar));
  }
  vals.sort((x, y) => x - y);
  const baseline = Math.max(.01, vals[Math.floor(vals.length * .9)]);
  const loose = geo.real ? 1 : 1.6;
  const bands = { heart_line: .11 * loose, head_line: .13 * loose, life_line: .13 * loose, fate_line: .07 * loose };
  const out = {};
  for (const id of Object.keys(geo.beziers)) out[id] = traceCrease(map, geo.beziers[id], ar, geo.L, bands[id] * geo.L, baseline, TRIM_END[id], MIN_LEN[id]);
  // Reglas de los quirólogos: la línea del corazón es el pliegue horizontal MÁS ALTO (más cerca de los dedos)
  // y la de la cabeza va por debajo. Si las dos acaban sobre el mismo pliegue o en orden invertido,
  // no podemos saber cuál es cuál con seguridad: se queda solo la más clara.
  const h = out.heart_line, d = out.head_line;
  if (h?.found && d?.found && h.meanY >= d.meanY - geo.L * .04) {
    const weaker = h.strength * h.coverage >= d.strength * d.coverage ? d : h;
    weaker.found = false; weaker.reason = 'No se separa con claridad de la otra línea horizontal en tu foto, así que no la dibujamos.';
  }
  // Dos líneas distintas no pueden ir montadas sobre el mismo pliegue durante un buen tramo
  // (pueden tocarse o cruzarse, pero no recorrer juntas el mismo surco). Si pasa, se queda la más clara.
  const ids = Object.keys(out);
  for (let i = 0; i < ids.length; i += 1) for (let j = i + 1; j < ids.length; j += 1) {
    const A = out[ids[i]], B = out[ids[j]];
    if (!A?.found || !B?.found) continue;
    const near = (P, Q) => P.filter(p => Q.some(q => dist(p, q) < geo.L * .035)).length / P.length;
    if (Math.max(near(A.pts, B.pts), near(B.pts, A.pts)) > .3) {
      const weaker = A.strength * A.coverage >= B.strength * B.coverage ? B : A;
      weaker.found = false; weaker.reason = 'Se confunde con otra línea en tu foto, así que no la dibujamos.';
    }
  }
  if (typeof window !== 'undefined' && window.__creaseDebug) {
    const c = geo.center, L = geo.L;
    const decoys = { venus: curve(add(c, v(-.42*L, -.05*L)), add(c, v(-.42*L, .1*L)), add(c, v(-.4*L, .25*L)), add(c, v(-.38*L, .4*L))),
      luna: curve(add(c, v(.3*L, .15*L)), add(c, v(.32*L, .25*L)), add(c, v(.33*L, .35*L)), add(c, v(.34*L, .45*L))),
      mid: curve(add(c, v(-.25*L, .3*L)), add(c, v(-.1*L, .32*L)), add(c, v(.05*L, .34*L)), add(c, v(.2*L, .36*L))) };
    const q = f => vals[Math.floor(vals.length * f)].toFixed(4);
    window.__creaseDebug = { pct: [q(.5), q(.8), q(.9), q(.97)], baseline, real: Object.fromEntries(Object.entries(out).map(([k2, o]) => [k2, [o.strength.toFixed(2), o.coverage.toFixed(2)]])), decoys: Object.fromEntries(Object.entries(decoys).map(([k2, bz]) => { const o = traceCrease(map, bz, ar, L, .07 * L, baseline); return [k2, [o.strength.toFixed(2), o.coverage.toFixed(2)]]; })) };
  }
  return out;
}

// Medidas reales de la mano a partir de los landmarks (solo si el detector encontró la mano).
function handMeasures(landmarks, ar = 1) {
  if (!Array.isArray(landmarks) || landmarks.length < 21) return null;
  const P = i => v(landmarks[i].x * ar, landmarks[i].y);
  const finger = (a, b, c, d) => dist(P(a), P(b)) + dist(P(b), P(c)) + dist(P(c), P(d));
  const palmLength = dist(P(0), P(9));
  const palmWidth = dist(P(5), P(17));
  if (!palmLength || !palmWidth) return null;
  const middle = finger(9, 10, 11, 12), index = finger(5, 6, 7, 8), ring = finger(13, 14, 15, 16);
  const thumbDir = unit(sub(P(4), P(2))), indexDir = unit(sub(P(8), P(5)));
  const thumbAngle = Math.acos(clamp(thumbDir.x * indexDir.x + thumbDir.y * indexDir.y, -1, 1)) * 180 / Math.PI;
  const palmRatio = palmWidth / palmLength;
  const fingerRatio = middle / palmLength;
  const square = palmRatio >= .72, longFingers = fingerRatio >= .86;
  const element = square ? (longFingers ? 'Aire' : 'Tierra') : (longFingers ? 'Agua' : 'Fuego');
  const indexRing = index / ring;
  return {
    palmRatio: round(palmRatio), fingerRatio: round(fingerRatio), indexRing: round(indexRing), thumbAngle: Math.round(thumbAngle),
    palmShape: square ? 'cuadrada' : 'alargada', fingerLength: longFingers ? 'largos' : 'cortos', element,
    indexVsRing: indexRing > 1.03 ? 'índice más largo' : indexRing < .97 ? 'anular más largo' : 'índice y anular parecidos',
    thumbOpening: thumbAngle >= 50 ? 'muy abierto' : thumbAngle >= 22 ? 'abierto con naturalidad' : 'cercano a la mano'
  };
}

function buildMounts(metrics) {
  const names = ['jupiter', 'saturn', 'apollo', 'mercury', 'venus', 'luna', 'mars_lower', 'mars_upper'];
  return names.map((name, index) => ({ feature: `mount_${name}`, name, prominence: metrics.contrast > .55 ? (index % 3 === 0 ? 'desarrollado' : 'moderado') : 'indeterminado', confidence: round(clamp(.42 + metrics.exposure * .25 + metrics.contrast * .2 - index * .01)), coordinates: normalizePoint(.2 + (index % 4) * .2, .25 + Math.floor(index / 4) * .38), source: 'relative_2d_estimate', note: 'Una foto 2D no permite medir volumen tridimensional con precisión.' }));
}

function landmarkMetrics(landmarks) {
  if (!Array.isArray(landmarks) || landmarks.length < 21) return null;
  const xs = landmarks.map(point => point.x).filter(Number.isFinite);
  const ys = landmarks.map(point => point.y).filter(Number.isFinite);
  if (xs.length < 21 || ys.length < 21) return null;
  const left = clamp(Math.min(...xs));
  const right = clamp(Math.max(...xs));
  const top = clamp(Math.min(...ys));
  const bottom = clamp(Math.max(...ys));
  const occupancy = (right - left) * (bottom - top);
  return { bbox: { left, top, right, bottom }, occupancy, complete: left > .003 && top > .003 && right < .997 && bottom < .997 };
}

export function analyzeCanvas(canvas, hand, options = {}) {
  let metrics = imageMetrics(canvas, options.fast ? 64 : 96);
  const modelBox = landmarkMetrics(options.landmarks);
  const modelDetected = Boolean(modelBox);
  if (modelBox) metrics = { ...metrics, ...modelBox, skinRatio: Math.max(metrics.skinRatio, .04) };
  const quality = qualityReport(metrics, canvas, modelDetected);
  const usableRegion = Boolean(metrics.bbox) && metrics.occupancy >= .012 && metrics.occupancy <= .98;
  const handConfidence = modelDetected ? .94 : round(clamp(metrics.skinRatio * 7 + metrics.complete * .28 + metrics.exposure * .16 + usableRegion * .12));
  const geometry = buildGeometry(metrics);
  const ar = canvas.width && canvas.height ? canvas.width / canvas.height : 1;
  const geo = linePaths(palmKeypoints(options.landmarks, metrics.bbox, hand, ar, metrics.thumbSide), ar);
  const paths = Object.fromEntries(Object.entries(geo.beziers).map(([k, b]) => [k, bezPath(b)]));
  let creases = null;
  if (!options.fast) {
    if (modelDetected) { try { creases = detectCreases(canvas, geo, ar); } catch (error) { creases = null; } }
    // Como hacen los quirólogos, cada línea se ubica respecto a los dedos y al pulgar.
    // Sin esos puntos de referencia no se puede saber qué pliegue es cada línea: no se dibuja ninguna.
    if (!creases) { const none = { found: false, coverage: 0, reason: 'No pudimos ubicar tus dedos y tu pulgar en la foto; sin esa referencia no se puede saber qué pliegue es cada línea, así que no la dibujamos.' }; creases = { heart_line: none, head_line: none, life_line: none, fate_line: none }; }
  }
  const measures = handMeasures(options.landmarks, ar);
  const lines = [
    lineFeature('heart_line', 'Línea del corazón', '#d889ff', metrics, 0, paths, creases?.heart_line),
    lineFeature('head_line', 'Línea de la cabeza', '#54e5e5', metrics, 1, paths, creases?.head_line),
    lineFeature('life_line', 'Línea de la vida', '#ff8b73', metrics, 2, paths, creases?.life_line),
    lineFeature('fate_line', 'Línea del destino / Saturno', '#f3d58a', metrics, 3, paths, creases?.fate_line)
  ];
  const secondary = [
    { feature: 'sun_line', name: 'Línea del Sol / Apolo', detected: false, confidence: .38, observations: ['No se distingue con suficiente claridad.'] },
    { feature: 'mercury_line', name: 'Línea de Mercurio', detected: false, confidence: .34, observations: ['No se distingue con suficiente claridad.'] },
    { feature: 'venus_girdle', name: 'Cinturón de Venus', detected: false, confidence: .31, observations: ['No se distingue con suficiente claridad.'] },
    { feature: 'wrist_bracelets', name: 'Brazaletes de la muñeca', detected: false, confidence: .29, observations: ['No se distingue con suficiente claridad.'] }
  ];
  const handShape = measures ? `palma ${measures.palmShape} con dedos ${measures.fingerLength}` : 'indeterminada';
  const analysis = {
    schemaVersion: 'palm-features-1.0', hand, quality, metrics: { brightness: round(metrics.brightness), contrast: round(metrics.contrast), focus: round(metrics.focus), exposure: round(metrics.exposure), skinRatio: round(metrics.skinRatio) },
    detection: { handDetected: modelDetected || (handConfidence >= .36 && usableRegion), confidence: handConfidence, method: modelDetected ? 'mediapipe-hand-landmarker' : 'native-fallback-tolerant', landmarks: options.landmarks || null, disclaimer: 'Estimación local provisional: el detector de landmarks se ejecuta en este dispositivo.', anchored: modelDetected ? 'landmarks' : 'contorno', tracedLines: creases ? Object.values(creases).filter(c => c.found).length : 0 },
    geometry: { ...geometry, confidence: round(Math.min(handConfidence, modelDetected ? .9 : .68)) },
    shape: { label: handShape, detected: Boolean(measures), confidence: round(Math.min(handConfidence, measures ? .82 : .3)), element: measures ? measures.element : 'indeterminado', measures, observations: [measures ? `Proporción de la palma ${measures.palmRatio} (ancho/largo) y dedo medio ${measures.fingerRatio} del largo de la palma.` : 'No se localizaron los puntos de la mano; la forma no se puede medir con esta foto.'] },
    fingers: { detected: Boolean(measures), confidence: round(Math.min(handConfidence, measures ? .86 : .3)), measures, observations: [measures ? `Dedo índice frente al anular: ${measures.indexVsRing}. Pulgar ${measures.thumbOpening} (${measures.thumbAngle}°).` : 'Las longitudes de los dedos no se pueden medir sin localizar los puntos de la mano.'] },
    lines, secondary, mounts: buildMounts(metrics), symbols: [], source: modelDetected ? 'mediapipe_hand_landmarker' : 'local_native_heuristics'
  };
  return analysis;
}

export function featureConfidenceLabel(value) {
  if (value >= .9) return 'Muy alta';
  if (value >= .75) return 'Alta';
  if (value >= .6) return 'Moderada';
  if (value >= .4) return 'Baja';
  return 'No utilizable';
}

export function toCanvas(dataUrl) {
  return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => { const canvas = document.createElement('canvas'); const scale = Math.min(1, 1000 / Math.max(image.width, image.height)); canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale)); canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height); resolve(canvas); }; image.onerror = reject; image.src = dataUrl; });
}
