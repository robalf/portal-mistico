// Detector de los 21 puntos de la mano (MediaPipe, de Google), ejecutado en el propio teléfono.
// Antes apuntaba a la versión 0.10.22, que NO existe: la librería nunca cargaba y la app
// decía que no encontraba los dedos. Ahora usa una versión publicada (0.10.21) y, si aun así
// falla, un segundo detector de respaldo (@mediapipe/hands) con su propio modelo.
const TASKS_VERSION = '0.10.21';
const VISION_MODULE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/vision_bundle.mjs`;
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/wasm`;
const MODEL_PATH = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const LEGACY_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/';

let visionModulePromise = null;
let detectorPromise = null;
let detector = null;
let lastVideoTimestamp = 0;

function loadVisionModule() {
  if (!visionModulePromise) visionModulePromise = import(VISION_MODULE_URL).catch(error => { visionModulePromise = null; throw error; });
  return visionModulePromise;
}

async function createDetector(delegate) {
  const { FilesetResolver, HandLandmarker } = await loadVisionModule();
  const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
  return HandLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: MODEL_PATH, delegate },
    runningMode: 'VIDEO',
    numHands: 1,
    minHandDetectionConfidence: 0.3,
    minHandPresenceConfidence: 0.3,
    minTrackingConfidence: 0.3
  });
}

export function loadHandLandmarker() {
  if (detector) return Promise.resolve(detector);
  if (!detectorPromise) {
    detectorPromise = createDetector('GPU')
      .catch(() => createDetector('CPU'))
      .then(value => { detector = value; return value; })
      .catch(error => { detectorPromise = null; throw error; });
  }
  return detectorPromise;
}

export async function detectHandsInVideo(video, timestamp = performance.now()) {
  const model = await loadHandLandmarker();
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return null;
  const nextTimestamp = Math.max(Number(timestamp) || 0, lastVideoTimestamp + 1);
  lastVideoTimestamp = nextTimestamp;
  return model.detectForVideo(video, nextTimestamp);
}

async function detectWithTasks(image) {
  const model = await loadHandLandmarker();
  await model.setOptions({ runningMode: 'IMAGE' });
  try {
    return model.detect(image);
  } finally {
    await model.setOptions({ runningMode: 'VIDEO' });
    lastVideoTimestamp = 0;
  }
}

// ---------- Respaldo: @mediapipe/hands (API clásica) ----------
let legacyPromise = null;
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.crossOrigin = 'anonymous';
    s.onload = resolve; s.onerror = () => reject(new Error('script ' + src));
    document.head.appendChild(s);
  });
}
function loadLegacy() {
  if (!legacyPromise) {
    legacyPromise = (async () => {
      if (!window.Hands) await loadScript(LEGACY_BASE + 'hands.js');
      const hands = new window.Hands({ locateFile: file => LEGACY_BASE + file });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.3, minTrackingConfidence: 0.3, selfieMode: false });
      await hands.initialize();
      return hands;
    })().catch(error => { legacyPromise = null; throw error; });
  }
  return legacyPromise;
}
async function detectWithLegacy(image) {
  const hands = await loadLegacy();
  return new Promise((resolve, reject) => {
    hands.onResults(results => {
      const lm = results?.multiHandLandmarks?.[0];
      resolve(lm ? { landmarks: [lm.map(p => ({ x: p.x, y: p.y, z: p.z || 0 }))] } : { landmarks: [] });
    });
    hands.send({ image }).catch(reject);
  });
}

export async function detectHandsInImage(image) {
  try {
    const result = await detectWithTasks(image);
    if (result?.landmarks?.length) return result;
  } catch (error) { /* se intenta con el respaldo */ }
  return detectWithLegacy(image);
}

export function forgetHandLandmarker() {
  detector?.close?.();
  detector = null;
  detectorPromise = null;
  lastVideoTimestamp = 0;
}
