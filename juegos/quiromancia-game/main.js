function PMS(r){try{var t=window.top;if(t!==window&&t.PortalMusic&&t.PortalMusic.sfx)return t.PortalMusic.sfx(new URL(r,location.href).href);}catch(e){}return new Audio(r);}
import { analyzeCanvas, featureConfidenceLabel, toCanvas, VISION_VERSION } from './vision.js?v=6';
import { RULES_VERSION, applyPalmistryRules, buildReport, compareHands, shapeReading, dominanceRole } from './palmistry.js?v=2';
import { detectHandsInImage, detectHandsInVideo, loadHandLandmarker } from './hand-model.js?v=2';

const root = document.querySelector('#game-container');
const assets = { palm:'assets/aura-palm-five-fingers.webp', reveal:'assets/audio/reading-reveal.mp3', scan:'assets/audio/scan-capture.mp3', hands:{left:'assets/aura-right-palm-guide.webp',right:'assets/aura-left-palm-guide.webp'} };
const handNames = { left:'izquierda', right:'derecha' };
function readLocal(key, fallback = null) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
function writeLocal(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
function removeLocal(key) { try { localStorage.removeItem(key); } catch {} }
const state = { screen:'home', mode:'quick', dominance:null, pendingHand:'left', handImages:{left:null,right:null}, analyses:{left:null,right:null}, stream:null, muted:readLocal('aura-muted') === 'true', report:null, selectedHand:'left', selectedFeature:null, original:false };
let cameraFeedbackTimer = null;
let cameraFeedbackBusy = false;
let cameraModelAvailable = false;
let cameraModelLoading = false;
let cameraLandmarks = null;

const music = (function(){try{var t=window.top;if(t!==window&&t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3'); music.loop=true; music.volume=.16;
const sfx = { reveal:PMS(assets.reveal), scan:PMS(assets.scan) }; sfx.reveal.volume=.46; sfx.scan.volume=.42;

function icon(name, size=21) {
  const paths={
    spark:'<path d="M12 2l1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2Z"/><path d="M5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15Z"/>',
    volume:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 9.5a4 4 0 0 1 0 5M18 7a7 7 0 0 1 0 10"/>', mute:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 10 5 5m0-5-5 5"/>',
    camera:'<path d="M4 7h3l1.5-2h7L17 7h3v11H4V7Z"/><circle cx="12" cy="12.5" r="3.5"/>', upload:'<path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M5 14v5h14v-5"/>',
    lock:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>', share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
    save:'<path d="M5 4h12l2 2v14H5V4Z"/><path d="M8 4v6h8V4M8 20v-5h8v5"/>', history:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5M12 7v5l3 2"/>', book:'<path d="M4 5a3 3 0 0 1 3-2h11v17H7a3 3 0 0 0-3 2V5Z"/><path d="M4 5v15M8 7h6M8 11h6"/>', refresh:'<path d="M20 11a8 8 0 0 0-14.5-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.5 4L21 14m0 5v-5h-5"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>', check:'<path d="m5 12 4 4L19 6"/>', info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;
}
function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char])); }
function shell(content, extra='') { return `<main class="app"><header class="topbar"><div class="brand"><span class="brand-mark">${icon('spark',17)}</span>Quiromancia</div><button class="icon-btn" id="mute" aria-label="${state.muted?'Activar sonido':'Silenciar'}">${icon(state.muted?'mute':'volume')}</button></header>${content}</main><div class="toast" id="toast"></div>${extra}`; }
function bindCommon() { document.querySelector('#mute')?.addEventListener('click',toggleMute); }
function toggleMute() { state.muted=!state.muted; writeLocal('aura-muted',state.muted); if(state.muted) music.pause(); else music.play().catch(()=>{}); const button=document.querySelector('#mute'); if(button){button.innerHTML=icon(state.muted?'mute':'volume');button.setAttribute('aria-label',state.muted?'Activar sonido':'Silenciar');} }
function unlockAudio() { if(!state.muted && music.paused) music.play().catch(()=>{}); }
function play(name) { if(state.muted) return; const audio=sfx[name]; if(audio){audio.currentTime=0;audio.play().catch(()=>{});} }
function toast(message) { let element=document.querySelector('#toast'); if(!element){element=document.createElement('div');element.id='toast';element.className='toast';root.appendChild(element);} element.textContent=message;element.classList.add('show');clearTimeout(window.__auraToast);window.__auraToast=setTimeout(()=>element.classList.remove('show'),2800); }

function home() {
  state.screen='home';
  root.innerHTML=shell(`<section class="screen hero"><p class="eyebrow">Quiromancia cultural · lectura local</p><h1>Descubre los patrones<br>de tu palma</h1><p class="subtitle">Observa tus manos, conoce las tradiciones de la quiromancia y explora una lectura simbólica explicable.</p><div class="palm-wrap"><img class="palm-art" src="${assets.palm}" alt="Ilustración de una palma con líneas de colores"></div><button class="primary" id="new-reading">${icon('camera')} Escanear mi mano</button><div class="mode-grid" style="margin-top:14px"><button class="secondary" id="quick-reading">Lectura rápida</button><button class="secondary" id="full-reading">Lectura completa</button></div><div class="tip-grid"><div class="tip"><span>☼</span><span>Buena luz</span></div><div class="tip"><span>⌁</span><span>Palmas abiertas</span></div><div class="tip"><span>◇</span><span>Procesamiento local</span></div></div><div class="mode-grid"><button class="secondary" id="history-open">${icon('history',17)} Mis lecturas</button><button class="secondary" id="learn-open">${icon('book',17)} Aprender</button></div><p class="disclaimer">La lectura es una interpretación tradicional y recreativa. No es ciencia, diagnóstico médico ni un método demostrado para predecir acontecimientos.</p></section>`);
  bindCommon(); unlockAudio();
  document.querySelector('#new-reading').onclick=()=>setup('quick'); document.querySelector('#quick-reading').onclick=()=>setup('quick'); document.querySelector('#full-reading').onclick=()=>setup('complete'); document.querySelector('#history-open').onclick=showHistory; document.querySelector('#learn-open').onclick=showLearning;
}

function setup(mode='quick') {
  state.screen='setup'; state.mode=mode; state.dominance=state.dominance||'right';
  root.innerHTML=shell(`<section class="screen setup"><p class="eyebrow">Nueva lectura</p><h2>Prepara tus dos palmas</h2><p class="subtitle" style="margin-left:0">Primero observaremos hechos visuales. Después mostraremos qué asociaciones pertenecen a la tradición seleccionada.</p><p class="section-label">Tipo de lectura</p><div class="mode-grid"><button class="mode-card ${mode==='quick'?'selected':''}" data-mode="quick"><strong>Lectura rápida</strong><small>Forma, líneas principales y una comparación breve.</small></button><button class="mode-card ${mode==='complete'?'selected':''}" data-mode="complete"><strong>Lectura completa</strong><small>Líneas, montes, dedos, marcas y explicabilidad ampliada.</small></button></div><p class="section-label">¿Cuál es tu mano dominante?</p><div class="dominance-grid"><button class="dominance-card ${state.dominance==='right'?'selected':''}" data-dominance="right"><strong>Derecha</strong><small>Convención usada por algunas escuelas.</small></button><button class="dominance-card ${state.dominance==='left'?'selected':''}" data-dominance="left"><strong>Izquierda</strong><small>Convención usada por algunas escuelas.</small></button><button class="dominance-card ${state.dominance==='both'?'selected':''}" data-dominance="both"><strong>Ambidiestra</strong><small>Ambas manos tienen el mismo uso habitual.</small></button></div><div class="notice">${icon('info',16)} La mano dominante/no dominante es una convención de ciertas escuelas de quiromancia, no un hecho científicamente demostrado.</div><button class="primary" id="start-capture">Continuar con palma izquierda ${icon('arrow')}</button><button class="secondary" id="back-home" style="margin-top:10px">Volver</button></section>`);
  bindCommon(); document.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>setup(button.dataset.mode)); document.querySelectorAll('[data-dominance]').forEach(button=>button.onclick=()=>{state.dominance=button.dataset.dominance;setup(state.mode);}); document.querySelector('#start-capture').onclick=()=>captureScreen('left'); document.querySelector('#back-home').onclick=home;
}

const instructions=['Extiende completamente la mano.','Mantén los dedos relajados y ligeramente separados.','Coloca la palma frente a la cámara.','Utiliza buena iluminación.','Evita sombras fuertes y reflejos.','No dobles los dedos.','Mantén toda la mano dentro del marco.'];
function captureScreen(hand) {
  state.screen='capture'; state.pendingHand=hand;
  const leftDone=Boolean(state.handImages.left), rightDone=Boolean(state.handImages.right);
  root.innerHTML=shell(`<section class="screen capture"><p class="eyebrow">Paso ${hand==='left'?'1':'2'} de 2 · captura segura</p><h2>Palma ${handNames[hand]}</h2><p class="subtitle" style="margin-left:0">La imagen se procesa en este dispositivo y se mantiene separada de la otra mano.</p><div class="hand-stepper"><div class="hand-step ${hand==='left'?'active':''} ${leftDone?'done':''}">${leftDone?'✓ ':''}Izquierda</div><div class="hand-step ${hand==='right'?'active':''} ${rightDone?'done':''}">${rightDone?'✓ ':''}Derecha</div></div><div class="capture-instructions">${instructions.map(text=>`<span>${text}</span>`).join('')}</div><div class="palm-guide"><img class="hand-guide-image ${hand}-hand" src="${assets.hands[hand]}" alt="Silueta transparente de la palma ${handNames[hand]}"><div class="guide-label">Coloca aquí la palma ${handNames[hand]} abierta</div></div><button class="primary" id="camera-action">${icon('camera')} Fotografiar palma ${handNames[hand]}</button><button class="secondary" id="gallery-action" style="margin-top:10px">${icon('upload')} Subir una imagen</button><p class="trust">${icon('lock',14)} No se utiliza para entrenar modelos</p><button class="secondary" id="capture-back" style="margin-top:14px">Volver</button></section>`);
  bindCommon(); document.querySelector('#camera-action').onclick=()=>openCamera(hand); document.querySelector('#gallery-action').onclick=()=>openGallery(hand); document.querySelector('#capture-back').onclick=()=>hand==='left'?setup(state.mode):captureScreen('left');
}

function isAppleTouchDevice() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function openGallery(hand, useCamera=false) {
  const input=document.createElement('input');
  input.type='file';
  input.accept='image/*';
  if(useCamera) {
    input.setAttribute('capture','environment');
    input.capture='environment';
  }
  input.onchange=()=>input.files?.[0]&&loadFile(input.files[0],hand);
  input.click();
}
function cameraErrorMessage(error) {
  const name=error?.name||error?.message;
  const message=error?.message;
  if(!window.isSecureContext) return 'El navegador bloquea la cámara porque esta página no está en una conexión segura. Abre el enlace con https://.';
  if(name==='NotAllowedError' || name==='PermissionDeniedError') return 'El permiso está bloqueado. En iPhone: Ajustes › Apps › Safari › Cámara › Permitir; también puedes tocar “aA” en Safari, abrir “Configuración del sitio web” y permitir la cámara.';
  if(name==='SecurityError') return 'El navegador bloqueó la cámara por seguridad. Abre la web directamente en Safari o Chrome, no dentro de otra aplicación.';
  if(name==='NotFoundError' || name==='DevicesNotFoundError') return 'No se encontró una cámara disponible en este dispositivo.';
  if(name==='NotReadableError' || name==='TrackStartError') return 'La cámara está siendo utilizada por otra aplicación. Ciérrala y vuelve a intentarlo.';
  if(name==='camera-timeout' || message==='camera-timeout') return 'La cámara tardó demasiado en responder. Usa la cámara nativa del teléfono.';
  return 'Este navegador no permite el acceso directo a la cámara. Usa “Abrir cámara del teléfono”.';
}
function addNativeCameraFallback(hand, message) {
  const status=document.querySelector('#guide-status');
  if(status) status.textContent=message;
  const controls=document.querySelector('.camera-controls');
  if(!controls || document.querySelector('#native-camera')) return;
  controls.insertAdjacentHTML('beforeend','<button class="camera-gallery" id="native-camera">Abrir cámara del teléfono</button>');
  document.querySelector('#native-camera').onclick=()=>{ closeCamera(); openGallery(hand,true); };
}
function cameraRequest() {
  if(!window.isSecureContext) return Promise.reject(new Error('camera-insecure'));
  if (!navigator.mediaDevices?.getUserMedia) return Promise.reject(new Error('camera-unavailable'));
  const preferred = navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:960},height:{ideal:960}},audio:false});
  const request = preferred.catch(error => {
    if(error?.name !== 'OverconstrainedError' && error?.name !== 'NotFoundError') throw error;
    return navigator.mediaDevices.getUserMedia({video:true,audio:false});
  });
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('camera-timeout')), 9000));
  return Promise.race([request, timeout]).catch(error => {
    request.then(stream => stream.getTracks().forEach(track => track.stop())).catch(() => {});
    throw error;
  });
}

async function openCamera(hand) {
  state.pendingHand=hand;
  // Safari/iOS puede dejar getUserMedia bloqueado aunque el selector de cámara
  // nativo sí esté disponible. Usarlo primero evita una pantalla de captura con
  // el disparador desactivado y mantiene el gesto del usuario para abrirlo.
  if(isAppleTouchDevice()) {
    openGallery(hand,true);
    return;
  }
  root.insertAdjacentHTML('beforeend',`<section class="camera-modal"><div class="camera-head"><strong>Palma ${handNames[hand]}</strong><button class="icon-btn" id="close-camera" aria-label="Cerrar">${icon('close')}</button></div><div class="camera-stage"><video id="camera-video" autoplay playsinline muted></video><div class="guide" id="camera-guide"><img class="hand-guide-image ${hand}-hand" src="${assets.hands[hand]}" alt="Silueta de referencia para la palma ${handNames[hand]}"><div class="landmark-layer" id="landmark-layer" aria-hidden="true"></div><div class="guide-status" id="guide-status" aria-live="polite">Solicitando acceso a la cámara…</div></div></div><div class="camera-controls"><button class="shutter" id="shutter" aria-label="Tomar foto" disabled></button><button class="camera-gallery" id="camera-gallery">Elegir una imagen</button></div></section>`);
  const modal=document.querySelector('.camera-modal');
  const video=document.querySelector('#camera-video');
  const shutter=document.querySelector('#shutter');
  document.querySelector('#close-camera').onclick=closeCamera;
  document.querySelector('#camera-gallery').onclick=()=>{ closeCamera(); openGallery(hand); };
  shutter.onclick=()=>capturePhoto(hand);
  try {
    const stream=await cameraRequest();
    if(!modal?.isConnected){ stream.getTracks().forEach(track=>track.stop()); return; }
    state.stream=stream;
    video.srcObject=stream;
    video.muted=true;
    video.setAttribute('playsinline','');
    await video.play().catch(() => {});
    await new Promise(resolve => {
      if(video.videoWidth) { resolve(); return; }
      const ready=()=>{ video.removeEventListener('loadedmetadata',ready); resolve(); };
      video.addEventListener('loadedmetadata',ready,{once:true});
      setTimeout(()=>{ video.removeEventListener('loadedmetadata',ready); resolve(); },2500);
    });
    if(video.videoWidth) {
      shutter.disabled=false;
      shutter.setAttribute('aria-label','Capturar rápidamente');
      startCameraFeedback(video);
    } else {
      addNativeCameraFallback(hand,'La cámara se abrió pero no entregó imagen. Usa la cámara del teléfono o elige una foto.');
    }
  } catch(error) {
    if(shutter) shutter.disabled=true;
    const message=cameraErrorMessage(error);
    addNativeCameraFallback(hand,message);
    toast('No se pudo abrir la cámara directa. Prueba la cámara del teléfono.');
  }
}
function renderLandmarks(landmarks, video=null) {
  const layer=document.querySelector('#landmark-layer');
  if(!layer)return;
  const layerWidth=layer.clientWidth||1;
  const layerHeight=layer.clientHeight||1;
  const videoWidth=video?.videoWidth||layerWidth;
  const videoHeight=video?.videoHeight||layerHeight;
  const videoRatio=videoWidth/videoHeight;
  const layerRatio=layerWidth/layerHeight;
  let renderedWidth=layerWidth;
  let renderedHeight=layerHeight;
  let cropX=0;
  let cropY=0;
  if(videoRatio>layerRatio) {
    renderedHeight=layerHeight;
    renderedWidth=layerHeight*videoRatio;
    cropX=(renderedWidth-layerWidth)/2;
  } else {
    renderedWidth=layerWidth;
    renderedHeight=layerWidth/videoRatio;
    cropY=(renderedHeight-layerHeight)/2;
  }
  layer.innerHTML=(landmarks||[]).map(point=>{
    const sourceX=Math.max(0,Math.min(1,Number(point.x)||0))*renderedWidth-cropX;
    const sourceY=Math.max(0,Math.min(1,Number(point.y)||0))*renderedHeight-cropY;
    return `<i style="left:${sourceX/layerWidth*100}%;top:${sourceY/layerHeight*100}%"></i>`;
  }).join('');
}
async function updateCameraFeedback(video) {
  const guide=document.querySelector('#camera-guide');
  const status=document.querySelector('#guide-status');
  if(!guide||!status||!video?.videoWidth||cameraFeedbackBusy)return;
  cameraFeedbackBusy=true;
  try {
    let result=null;
    if(cameraModelAvailable) {
      try {
        result=await detectHandsInVideo(video, performance.now());
      } catch {
        cameraModelAvailable=false;
      }
    }
    const landmarks=result?.landmarks?.[0]||null;
    cameraLandmarks=landmarks||null;
    renderLandmarks(cameraLandmarks,video);
    const analysis=analyzeCanvas(canvasFromVideo(video), state.pendingHand, { fast:true, landmarks:cameraLandmarks });
    const placementReady=Boolean(cameraLandmarks?.length>=21) && analysis.detection.handDetected;
    guide.classList.toggle('ready',placementReady);
    if(placementReady) status.textContent='¡Mano detectada! Pulsa el círculo para capturar';
    else if(cameraModelLoading) status.textContent='Puedes capturar mientras carga el reconocimiento';
    else if(!cameraModelAvailable) status.textContent='Pulsa el círculo para capturar la mano';
    else status.textContent='Acerca la mano y pulsa el círculo para capturar';
  } finally {
    cameraFeedbackBusy=false;
  }
}
function startCameraFeedback(video) {
  clearInterval(cameraFeedbackTimer);
  cameraFeedbackBusy=false;
  cameraLandmarks=null;
  cameraModelAvailable=false;
  cameraModelLoading=true;
  const status=document.querySelector('#guide-status');
  if(status)status.textContent='Cargando reconocimiento de mano…';
  withTimeout(loadHandLandmarker(),null,8000).then(model=>{
    cameraModelAvailable=Boolean(model);
    cameraModelLoading=false;
    if(document.querySelector('#guide-status')) document.querySelector('#guide-status').textContent=model?'Muestra la palma completa dentro del marco':'Puedes tomar la foto; reconocimiento no disponible';
  });
  cameraFeedbackTimer=setInterval(()=>updateCameraFeedback(video),220);
}
function closeCamera() { clearInterval(cameraFeedbackTimer);cameraFeedbackTimer=null;cameraFeedbackBusy=false;cameraModelLoading=false;state.stream?.getTracks().forEach(track=>track.stop());state.stream=null;document.querySelector('.camera-modal')?.remove(); }
function canvasFromVideo(video) { const scale=Math.min(1,1000/Math.max(video.videoWidth,video.videoHeight));const canvas=document.createElement('canvas');canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);return canvas; }
function withTimeout(promise, fallback, milliseconds=1200) { return Promise.race([promise.catch(()=>fallback),new Promise(resolve=>setTimeout(()=>resolve(fallback),milliseconds))]); }
async function capturePhoto(hand) {
  const video=document.querySelector('#camera-video');
  if(!video?.videoWidth) { toast('La cámara todavía no está lista.'); return; }
  const shutter=document.querySelector('#shutter');
  if(shutter)shutter.disabled=true;
  const status=document.querySelector('#guide-status');
  if(status)status.textContent='Escaneando los puntos de tu mano…';
  const canvas=canvasFromVideo(video);
  let landmarks=cameraLandmarks;
  if(!landmarks && cameraModelAvailable && !cameraFeedbackBusy) {
    landmarks=await withTimeout(detectHandsInVideo(video,performance.now()).then(result=>result?.landmarks?.[0]||null),null,650);
  }
  closeCamera();
  if(!landmarks) {
    if(status)status.textContent='Buscando los puntos de tu mano en la foto…';
    const result=await withTimeout(detectHandsInImage(canvas),null,20000);
    landmarks=result?.landmarks?.[0]||null;
  }
  processCanvas(canvas,hand,landmarks||null,true);
}
function loadFile(file,hand) {
  const isImage=file?.type?.startsWith('image/') || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file?.name||'');
  if(!isImage)return toast('Selecciona un archivo de imagen.');
  const reader=new FileReader();
  reader.onload=async()=>{
    try {
      const canvas=await toCanvas(reader.result);
      const result=await withTimeout(detectHandsInImage(canvas),null,20000);
      processCanvas(canvas,hand,result?.landmarks?.[0]||null);
    } catch { toast('No se pudo leer esa imagen.'); }
  };
  reader.onerror=()=>toast('No se pudo leer esa imagen.');
  reader.readAsDataURL(file);
}
function processCanvas(canvas,hand,landmarks=null,allowBasic=false) { play('scan');const analysis=analyzeCanvas(canvas,hand,{landmarks});const dataUrl=canvas.toDataURL('image/jpeg',.88);if(!analysis.quality.valid&&!allowBasic){showQuality(analysis,dataUrl,hand,canvas);return;}acceptCapture(analysis,dataUrl,hand,canvas);if(!analysis.quality.valid)toast('Mano capturada; lectura visual básica'); }
function showQuality(analysis,dataUrl,hand,canvas) { root.insertAdjacentHTML('beforeend',`<div class="sheet-backdrop" id="quality-modal"><div class="sheet"><div class="grab"></div><h2>Revisa la fotografía</h2><p>${analysis.quality.message}</p><div class="quality-card">${analysis.quality.checks.map(check=>`<div class="quality-check ${check.ok?'ok':'bad'}">${icon(check.ok?'check':'info',16)}<span><strong>${escapeHtml(check.label)}</strong><br>${escapeHtml(check.detail)}</span></div>`).join('')}</div><button class="primary" id="retry-quality">Tomar otra fotografía</button>${analysis.detection.handDetected?'<button class="secondary" id="use-quality" style="margin-top:10px">Usar con lectura limitada</button>':'<button class="secondary" id="use-basic" style="margin-top:10px">Continuar con lectura básica</button>'}</div></div>`);document.querySelector('#retry-quality').onclick=()=>{document.querySelector('#quality-modal').remove();captureScreen(hand);};document.querySelector('#use-quality')?.addEventListener('click',()=>{document.querySelector('#quality-modal').remove();acceptCapture(analysis,dataUrl,hand,canvas);});document.querySelector('#use-basic')?.addEventListener('click',()=>{document.querySelector('#quality-modal').remove();acceptCapture(analysis,dataUrl,hand,canvas);toast('Foto guardada con análisis visual básico');}); }
function acceptCapture(analysis,dataUrl,hand,canvas) { state.handImages[hand]={dataUrl,canvas};state.analyses[hand]=analysis;if(hand==='left'){toast('Palma izquierda guardada');setTimeout(()=>captureScreen('right'),350);}else{toast('Ambas palmas guardadas');setTimeout(runPipeline,350);} }

const pipelineStages=['Detectando mano…','Analizando geometría…','Identificando líneas principales…','Analizando líneas secundarias y montes…','Buscando marcas visibles…','Comparando izquierda y derecha…','Preparando interpretación tradicional…'];
function runPipeline() { state.screen='pipeline'; root.innerHTML=shell(`<section class="screen analysis"><p class="eyebrow">Procesamiento local</p><h2>Separando observación de interpretación</h2><p class="subtitle" style="margin-left:0">No mostramos porcentajes ficticios. Cada etapa termina antes de empezar la siguiente.</p><div class="preview-card"><div class="dual-preview"><img src="${state.handImages.left.dataUrl}" alt="Palma izquierda"><img src="${state.handImages.right.dataUrl}" alt="Palma derecha"></div><div class="scanline"></div></div><div class="pipeline">${pipelineStages.map((stage,index)=>`<div class="pipeline-item" data-stage="${index}"><i class="pipeline-dot"></i>${stage}</div>`).join('')}</div><p class="trust">${icon('lock',14)} Visión local provisional · versión ${VISION_VERSION}</p></section>`);bindCommon();let index=0;const timer=setInterval(()=>{document.querySelector(`[data-stage="${index-1}"]`)?.classList.replace('active','done');const active=document.querySelector(`[data-stage="${index}"]`);if(active)active.classList.add('active');index+=1;if(index>pipelineStages.length){clearInterval(timer);finishAnalysis();}},460);}
function finishAnalysis() {const hands={left:state.analyses.left,right:state.analyses.right};const comparison=compareHands(hands.left,hands.right);const interpretation=applyPalmistryRules(hands,state.dominance,state.mode);state.report=buildReport(hands,comparison,interpretation,state.dominance,state.mode);state.screen='results';state.selectedHand='left';state.selectedFeature=null;state.original=false;play('reveal');showResults();}

function linePathFor(item) { return item.coordinates?.path || ''; }
function resultViewer() { const analysis=state.analyses[state.selectedHand];const image=state.handImages[state.selectedHand];const lines=analysis.lines.filter(item=>item.coordinates);const active=state.selectedFeature;return `<div class="viewer"><div class="viewer-tabs">${['left','right'].map(h=>{const role=dominanceRole(h,state.report?.dominance||state.dominance);return `<button class="viewer-tab ${state.selectedHand===h?'active':''}" data-view-hand="${h}">Palma ${handNames[h]}${role?`<small class="tab-role">${role}</small>`:''}</button>`;}).join('')}</div><div class="annotated-palm ${state.original?'original':''}"><img src="${image.dataUrl}" alt="Palma ${handNames[state.selectedHand]}">${state.original?'':`<svg viewBox="0 0 1 1" preserveAspectRatio="none">${lines.map(item=>`<path data-feature="${item.feature}" class="${item.status==='estimated'?'estimated ':''}${active&&active!==item.feature?'dim':active===item.feature?'focus':''}" d="${linePathFor(item)}" stroke="${item.color}" pointer-events="stroke"></path>`).join('')}</svg>`}</div><div class="viewer-caption">${state.original?'Imagen original sin anotaciones.':(analysis.detection?.anchored!=='landmarks'?'No pudimos ubicar tus dedos y tu pulgar en esta foto. Sin esa referencia no se puede saber qué pliegue es cada línea, así que no dibujamos ninguna. Repite la foto con la mano entera (dedos y pulgar visibles) sobre un fondo liso.':analysis.detection?.tracedLines!==undefined?(analysis.detection.tracedLines?`Solo dibujamos las líneas que se ven con claridad en tu foto (${analysis.detection.tracedLines} de 4), siguiendo su recorrido real. Las que no se distinguen no se dibujan ni se interpretan. Toca una línea para ver su explicación.`:'No se distinguen las líneas con claridad en esta foto, así que no dibujamos ninguna. Repite la foto con luz pareja, sin brillos y con la palma bien abierta.'):analysis.detection?.anchored==='landmarks'?'Las líneas se trazan sobre los puntos reales de tu mano. Toca una línea o una tarjeta para ver su explicación.':'No se localizaron los puntos de la mano; las líneas se ajustan a la silueta detectada y son aproximadas. Toca una línea o una tarjeta para ver su explicación.')}</div><button class="secondary" id="toggle-original">${state.original?'Mostrar anotaciones':'Ver imagen original'}</button></div>`; }
function statementCards() {
  const statements=state.report.interpretation.statements;
  const readings=state.report.interpretation.featureReadings||[];
  return statements.length?statements.map(statement=>{
    const reading=readings.find(item=>item.hand===statement.hand&&item.feature===statement.feature);
    const interpretation=[reading?.explanation, reading?.details, reading?.reflection].filter(Boolean).join(' ') || statement.meaning || statement.text;
    return `<article class="fact-card">
      <h3>${escapeHtml(statement.category)} · ${escapeHtml(handNames[statement.hand])}</h3>
      <p><strong>Esta línea salió con estas características:</strong> ${escapeHtml(reading?.observation||'')}.</p>
      <p><strong>La interpretación es la siguiente:</strong> ${escapeHtml(interpretation)}</p>
    </article>`;
  }).join(''):'<div class="fact-card"><p>No hay hallazgos suficientemente claros para armar una interpretación. Puedes volver a escanear con mejor luz.</p></div>';
}
function featureCards() {
  const analysis=state.analyses[state.selectedHand];
  const readings=state.report?.interpretation?.featureReadings||[];
  return analysis.lines.map(item=>{
    const reading=readings.find(candidate=>candidate.hand===state.selectedHand&&candidate.feature===item.feature);
    const visible=item.detected&&item.confidence>=.4;
    const interpretation=visible||item.feature==='fate_line'
      ? [reading?.explanation, reading?.details, reading?.reflection].filter(Boolean).join(' ')
      : 'La imagen no muestra esta línea con la claridad suficiente para interpretarla con confianza. Prueba con una foto con mejor luz y la palma bien extendida.';
    return `<button class="line-card ${state.selectedFeature===item.feature?'open':''}" data-feature-card="${item.feature}">
      <span class="line-head"><span class="line-title"><i class="dot" style="color:${item.color};background:${item.color}"></i>${escapeHtml(item.label)}</span><span>${item.detected?'⌄':'?'}</span></span>
      <span class="line-summary">${escapeHtml(item.observations.join('. '))}.</span>
      <p>
        <strong>Esta línea salió con estas características:</strong> ${escapeHtml(item.observations.join('. '))}.<br><br>
        <strong>La interpretación es la siguiente:</strong> ${escapeHtml(interpretation)}
      </p>
    </button>`;
  }).join('');
}
function shapeCard() {
  const analysis=state.analyses[state.selectedHand];
  const r=shapeReading(analysis);
  if(!r) return `<div class="fact-card"><h3>Forma de la palma ${handNames[state.selectedHand]}</h3><p>No se pudieron localizar los puntos de la mano en esta foto, así que la forma y los dedos no se miden. Prueba con la palma completa, los dedos separados y buena luz.</p></div>`;
  return `<div class="fact-card shape-card"><h3>${escapeHtml(r.title)} · palma ${handNames[state.selectedHand]}</h3>
    <p><strong>Lo que se midió:</strong> palma ${escapeHtml(r.palm)} y dedos ${escapeHtml(r.fingers)}.</p>
    <p><strong>La interpretación es la siguiente:</strong> ${escapeHtml(r.shapeText)}</p>
    <p><strong>Índice y anular:</strong> ${escapeHtml(r.indexVsRing)}. ${escapeHtml(r.indexText)}</p>
    <p><strong>Pulgar:</strong> ${escapeHtml(r.thumb)} (${r.thumbAngle}°). ${escapeHtml(r.thumbText)}</p>
  </div>`;
}
function reportSections() { return state.report.sections.map(section=>`<details class="fact-card"><summary><strong>${escapeHtml(section.title)}</strong></summary><p>${escapeHtml(section.text)}</p></details>`).join(''); }
function showResults() { const report=state.report;root.innerHTML=shell(`<section class="screen results"><p class="eyebrow">Informe ${report.mode==='complete'?'completo':'rápido'} · lectura lista</p><h2>Tu palma, observada con prudencia</h2><div class="notice"><strong>Importante:</strong> la detección visual de esta versión es una estimación local provisional. La confianza de una detección no es certeza de una interpretación. La quiromancia se presenta únicamente como tradición cultural y entretenimiento.</div>${resultViewer()}<div class="reading-intro"><span class="score-pill">${icon('info',14)} Hechos visuales antes que símbolos</span><br>La lectura separa <strong>observación</strong>, <strong>clasificación candidata</strong> e <strong>interpretación tradicional</strong>. No se han inventado líneas secundarias ni símbolos con confianza insuficiente.</div><p class="section-label">Forma de tu mano y dedos</p>${shapeCard()}<p class="section-label">Qué significa cada línea</p><div class="reading-intro line-meaning-intro">Aquí tienes el significado que la tradición atribuye a cada línea, explicado con sus matices. Primero verás la observación de la imagen y después cómo se interpreta simbólicamente. La lectura habla de tendencias para reflexionar, no de verdades fijas sobre tu persona.</div><div class="line-list">${featureCards()}</div><p class="section-label">¿Por qué aparece esta interpretación?</p>${statementCards()}<p class="section-label">Informe completo</p><div class="report-nav"><button class="active">Todas las secciones</button></div>${reportSections()}<article class="prediction"><small>Mensaje simbólico</small><h3>Una invitación a observar</h3><p>Usa esta lectura como una pausa reflexiva. Una fotografía no puede garantizar el futuro, medir tu salud ni definir tu personalidad.</p></article><div class="result-actions"><button class="secondary" id="save-reading">${icon('save',17)} Guardar</button><button class="secondary" id="share-reading">${icon('share',17)} Compartir</button></div><button class="primary" id="new-again" style="margin-top:10px">${icon('refresh',17)} Nueva lectura</button><p class="disclaimer">Modelo visual: ${VISION_VERSION} · Base de reglas: ${RULES_VERSION}. Las pequeñas diferencias entre fotos pueden deberse a luz, posición, cámara o detección.</p></section>`);bindCommon();document.querySelectorAll('[data-view-hand]').forEach(button=>button.onclick=()=>{state.selectedHand=button.dataset.viewHand;state.selectedFeature=null;showResults();});document.querySelector('#toggle-original').onclick=()=>{state.original=!state.original;showResults();};document.querySelectorAll('[data-feature-card]').forEach(button=>button.onclick=()=>{state.selectedFeature=button.dataset.featureCard;state.original=false;showResults();document.querySelector('.viewer')?.scrollIntoView({behavior:'smooth',block:'center'});});document.querySelector('.annotated-palm svg')?.addEventListener('click',event=>{const feature=event.target.dataset.feature;if(feature){state.selectedFeature=feature;showResults();}});document.querySelector('#save-reading').onclick=saveReading;document.querySelector('#share-reading').onclick=shareReading;document.querySelector('#new-again').onclick=()=>{state.handImages={left:null,right:null};state.analyses={left:null,right:null};setup(state.mode);}; }

function saveReading() { const item={id:Date.now(),date:new Date().toISOString(),mode:state.mode,dominance:state.dominance,report:state.report,analyses:state.analyses,images:{left:state.handImages.left?.dataUrl,right:state.handImages.right?.dataUrl},visionVersion:VISION_VERSION,rulesVersion:RULES_VERSION};try{const history=JSON.parse(readLocal('aura-readings','[]')||'[]');history.unshift(item);if(!writeLocal('aura-readings',JSON.stringify(history.slice(0,8))))throw new Error('storage-full');toast('Lectura guardada en este dispositivo');}catch{toast('No hay espacio suficiente para guardar las fotos; el informe sigue disponible.');} }
async function shareReading() { const text='Mi lectura de Quiromancia separa hechos visuales de interpretaciones tradicionales. Es una experiencia recreativa, no científica.';if(navigator.share){try{await navigator.share({title:'Mi lectura de Quiromancia',text});return;}catch(error){if(error.name==='AbortError')return;}}try{await navigator.clipboard.writeText(text);toast('Texto copiado al portapapeles');}catch{toast('La lectura está lista para compartir');} }
function showHistory() { let history=[]; try { history=JSON.parse(readLocal('aura-readings','[]')||'[]'); } catch { history=[]; } root.innerHTML=shell(`<section class="screen history"><p class="eyebrow">Privado en este dispositivo</p><h2>Mis lecturas</h2><p class="subtitle" style="margin-left:0">Las fotografías y los informes guardados permanecen en el almacenamiento local del navegador hasta que los elimines.</p>${history.length?history.map(item=>`<article class="history-card" data-history-id="${item.id}" role="button" tabindex="0" style="cursor:${item.analyses&&item.images?.left&&item.images?.right?'pointer':'default'}"><strong>${new Date(item.date).toLocaleString('es-ES',{dateStyle:'medium',timeStyle:'short'})}</strong><span class="muted">Lectura ${item.mode==='complete'?'completa':'rápida'} · mano dominante: ${escapeHtml({right:'derecha',left:'izquierda',both:'ambidiestra'}[item.dominance]||'no indicada')}</span>${item.analyses&&item.images?.left&&item.images?.right?'<span class="muted">Toca para abrir la lectura ›</span>':''}</article>`).join(''):'<div class="history-empty">Todavía no has guardado ninguna lectura.</div>'}<p class="danger-note">Eliminar los datos del navegador también elimina este historial. Las variaciones entre escaneos no prueban cambios reales en las líneas.</p><button class="secondary" id="clear-history">Eliminar historial local</button><button class="primary" id="history-back" style="margin-top:10px">Volver al inicio</button></section>`);bindCommon();document.querySelector('#history-back').onclick=home;document.querySelector('#clear-history').onclick=()=>{removeLocal('aura-readings');showHistory();};document.querySelectorAll('[data-history-id]').forEach(card=>card.onclick=()=>{const item=history.find(h=>String(h.id)===card.dataset.historyId);if(!item?.analyses||!item.images?.left||!item.images?.right)return toast('Esta lectura se guardó sin fotos; no se puede abrir.');state.mode=item.mode;state.dominance=item.dominance;state.report=item.report;state.analyses=item.analyses;state.handImages={left:{dataUrl:item.images.left},right:{dataUrl:item.images.right}};state.screen='results';state.selectedHand='left';state.selectedFeature=null;state.original=false;showResults();}); }
function showLearning() { root.innerHTML=shell(`<section class="screen history"><p class="eyebrow">Biblioteca breve</p><h2>Aprender quiromancia</h2><div class="fact-card"><h3>Observación vs. interpretación</h3><p><strong>Observación:</strong> “Se observa una trayectoria candidata.”<br><strong>Clasificación:</strong> “El sistema la agrupa como posible línea del corazón.”<br><strong>Interpretación:</strong> “En algunas escuelas se asocia con expresividad.”</p></div><div class="fact-card"><h3>Líneas principales</h3><p>Corazón, cabeza y vida se estudian tradicionalmente junto con su forma, continuidad, terminación y relación con otras líneas. La línea de la vida no predice duración de vida.</p></div><div class="fact-card"><h3>Montes, dedos y símbolos</h3><p>Las escuelas difieren en sus métodos. Una marca nunca se interpreta aislada: se considera su ubicación, línea cercana y contexto. Una foto 2D no permite afirmar volumen corporal con precisión.</p></div><div class="fact-card"><h3>Privacidad</h3><p>Las fotos son información personal. Quiromancia las procesa en el navegador y solo las guarda si pulsas “Guardar”. No se usan para entrenar modelos sin consentimiento.</p></div><button class="primary" id="learn-back">Volver al inicio</button></section>`);bindCommon();document.querySelector('#learn-back').onclick=home;}

window.addEventListener('pagehide',()=>state.stream?.getTracks().forEach(track=>track.stop()));
home();

// Evita que el gesto/botón "atrás" del navegador saque de la app: primero regresa a la pantalla principal de la app.
(function(){
  window.history.pushState({app:true},'',location.href);
  window.addEventListener('popstate',function(){
    window.history.pushState({app:true},'',location.href);
    home();
  });
})();
