function PMS(r){try{var t=window.top;if(t.PortalMusic&&t.PortalMusic.sfx)return t.PortalMusic.sfx(new URL(r,location.href).href);}catch(e){}return new Audio(r);}
import { analyzeCanvas, featureConfidenceLabel, toCanvas, VISION_VERSION } from './vision.js?v=6';
import { RULES_VERSION, applyPalmistryRules, buildReport, compareHands, shapeReading, dominanceRole } from './palmistry.js?v=5';
import { detectHandsInImage, detectHandsInVideo, loadHandLandmarker } from './hand-model.js?v=2';

const root = document.querySelector('#game-container');
const assets = { palm:'/juegos/quiromancia-game/assets/aura-palm-five-fingers.webp', reveal:'/juegos/quiromancia-game/assets/audio/reading-reveal.mp3', scan:'/juegos/quiromancia-game/assets/audio/scan-capture.mp3', hands:{left:'/juegos/quiromancia-game/assets/aura-right-palm-guide.webp',right:'/juegos/quiromancia-game/assets/aura-left-palm-guide.webp'} };
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

const music = (function(){try{var t=window.top;if(t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3'); music.loop=true; music.volume=.16;
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
function shell(content, extra='') { return `<main class="app"><header class="topbar"><div class="brand"><span class="brand-mark">${icon('spark',17)}</span>Palmistry</div><button class="icon-btn" id="mute" aria-label="${state.muted?'Turn sound on':'Mute'}">${icon(state.muted?'mute':'volume')}</button></header>${content}</main><div class="toast" id="toast"></div>${extra}`; }
function bindCommon() { document.querySelector('#mute')?.addEventListener('click',toggleMute); }
function toggleMute() { state.muted=!state.muted; writeLocal('aura-muted',state.muted); if(state.muted) music.pause(); else music.play().catch(()=>{}); const button=document.querySelector('#mute'); if(button){button.innerHTML=icon(state.muted?'mute':'volume');button.setAttribute('aria-label',state.muted?'Turn sound on':'Silenciar');} }
function unlockAudio() { if(!state.muted && music.paused) music.play().catch(()=>{}); }
function play(name) { if(state.muted) return; const audio=sfx[name]; if(audio){audio.currentTime=0;audio.play().catch(()=>{});} }
function toast(message) { let element=document.querySelector('#toast'); if(!element){element=document.createElement('div');element.id='toast';element.className='toast';root.appendChild(element);} element.textContent=message;element.classList.add('show');clearTimeout(window.__auraToast);window.__auraToast=setTimeout(()=>element.classList.remove('show'),2800); }

function home() {
  state.screen='home';
  root.innerHTML=shell(`<section class="screen hero"><p class="eyebrow">Cultural palmistry · local reading</p><h1>Discover the patterns<br>in your palm</h1><p class="subtitle">Look at your hands, learn about palmistry traditions, and explore an explainable symbolic reading.</p><div class="palm-wrap"><img class="palm-art" src="${assets.palm}" alt="Illustration of a palm with colored lines"></div><button class="primary" id="new-reading">${icon('camera')} Scan my hand</button><div class="mode-grid" style="margin-top:14px"><button class="secondary" id="quick-reading">Quick reading</button><button class="secondary" id="full-reading">Full reading</button></div><div class="tip-grid"><div class="tip"><span>☼</span><span>Good light</span></div><div class="tip"><span>⌁</span><span>Open palms</span></div><div class="tip"><span>◇</span><span>Local processing</span></div></div><div class="mode-grid"><button class="secondary" id="history-open">${icon('history',17)} My readings</button><button class="secondary" id="learn-open">${icon('book',17)} Learn</button></div><p class="disclaimer">The reading is a traditional, recreational interpretation. It is not science, a medical diagnosis, or a proven method for predicting events.</p></section>`);
  bindCommon(); unlockAudio();
  document.querySelector('#new-reading').onclick=()=>setup('quick'); document.querySelector('#quick-reading').onclick=()=>setup('quick'); document.querySelector('#full-reading').onclick=()=>setup('complete'); document.querySelector('#history-open').onclick=showHistory; document.querySelector('#learn-open').onclick=showLearning;
}

function setup(mode='quick') {
  state.screen='setup'; state.mode=mode; state.dominance=state.dominance||'right';
  root.innerHTML=shell(`<section class="screen setup"><p class="eyebrow">New reading</p><h2>Get both palms ready</h2><p class="subtitle" style="margin-left:0">First we’ll look at visual facts. Then we’ll show which associations belong to the selected tradition.</p><p class="section-label">Type of reading</p><div class="mode-grid"><button class="mode-card ${mode==='quick'?'selected':''}" data-mode="quick"><strong>Quick reading</strong><small>Shape, main lines, and a brief comparison.</small></button><button class="mode-card ${mode==='complete'?'selected':''}" data-mode="complete"><strong>Full reading</strong><small>Lines, mounts, fingers, marks, and expanded explainability.</small></button></div><p class="section-label">Which is your dominant hand?</p><div class="dominance-grid"><button class="dominance-card ${state.dominance==='right'?'selected':''}" data-dominance="right"><strong>Right</strong><small>Convention used by some schools.</small></button><button class="dominance-card ${state.dominance==='left'?'selected':''}" data-dominance="left"><strong>Left</strong><small>Convention used by some schools.</small></button><button class="dominance-card ${state.dominance==='both'?'selected':''}" data-dominance="both"><strong>Ambidextrous</strong><small>Both hands get the same everyday use.</small></button></div><div class="notice">${icon('info',16)} Dominant/non-dominant hand is a convention of certain palmistry schools, not a scientifically proven fact.</div><button class="primary" id="start-capture">Continue with left palm ${icon('arrow')}</button><button class="secondary" id="back-home" style="margin-top:10px">Back</button></section>`);
  bindCommon(); document.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>setup(button.dataset.mode)); document.querySelectorAll('[data-dominance]').forEach(button=>button.onclick=()=>{state.dominance=button.dataset.dominance;setup(state.mode);}); document.querySelector('#start-capture').onclick=()=>captureScreen('left'); document.querySelector('#back-home').onclick=home;
}

const instructions=['Spread your hand out fully.','Keep your fingers relaxed and slightly apart.','Hold your palm in front of the camera.','Use good lighting.','Avoid strong shadows and glare.','Don’t bend your fingers.','Keep your whole hand inside the frame.'];
function captureScreen(hand) {
  state.screen='capture'; state.pendingHand=hand;
  const leftDone=Boolean(state.handImages.left), rightDone=Boolean(state.handImages.right);
  root.innerHTML=shell(`<section class="screen capture"><p class="eyebrow">Step ${hand==='left'?'1':'2'} of 2 · secure capture</p><h2>${handNames[hand]} palm</h2><p class="subtitle" style="margin-left:0">The image is processed on this device and kept separate from the other hand.</p><div class="hand-stepper"><div class="hand-step ${hand==='left'?'active':''} ${leftDone?'done':''}">${leftDone?'✓ ':''}Left</div><div class="hand-step ${hand==='right'?'active':''} ${rightDone?'done':''}">${rightDone?'✓ ':''}Right</div></div><div class="capture-instructions">${instructions.map(text=>`<span>${text}</span>`).join('')}</div><div class="palm-guide"><img class="hand-guide-image ${hand}-hand" src="${assets.hands[hand]}" alt="Transparent outline of the palm: ${handNames[hand]}"><div class="guide-label">Place your open ${handNames[hand]} palm here</div></div><button class="primary" id="camera-action">${icon('camera')} Photograph ${handNames[hand]} palm</button><button class="secondary" id="gallery-action" style="margin-top:10px">${icon('upload')} Upload an image</button><p class="trust">${icon('lock',14)} Not used to train models</p><button class="secondary" id="capture-back" style="margin-top:14px">Back</button></section>`);
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
  if(!window.isSecureContext) return 'The browser is blocking the camera because this page isn’t on a secure connection. Open the link with https://.';
  if(name==='NotAllowedError' || name==='PermissionDeniedError') return 'Permission is blocked. On iPhone: Settings › Apps › Safari › Camera › Allow; you can also tap “aA” in Safari, open “Website Settings,” and allow the camera.';
  if(name==='SecurityError') return 'The browser blocked the camera for security reasons. Open the site directly in Safari or Chrome, not inside another app.';
  if(name==='NotFoundError' || name==='DevicesNotFoundError') return 'No camera was found on this device.';
  if(name==='NotReadableError' || name==='TrackStartError') return 'The camera is being used by another app. Close it and try again.';
  if(name==='camera-timeout' || message==='camera-timeout') return 'The camera took too long to respond. Use your phone’s native camera.';
  return 'This browser doesn’t allow direct camera access. Use “Open phone camera.”';
}
function addNativeCameraFallback(hand, message) {
  const status=document.querySelector('#guide-status');
  if(status) status.textContent=message;
  const controls=document.querySelector('.camera-controls');
  if(!controls || document.querySelector('#native-camera')) return;
  controls.insertAdjacentHTML('beforeend','<button class="camera-gallery" id="native-camera">Open phone camera</button>');
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
  root.insertAdjacentHTML('beforeend',`<section class="camera-modal"><div class="camera-head"><strong>${handNames[hand]} palm</strong><button class="icon-btn" id="close-camera" aria-label="Close">${icon('close')}</button></div><div class="camera-stage"><video id="camera-video" autoplay playsinline muted></video><div class="guide" id="camera-guide"><img class="hand-guide-image ${hand}-hand" src="${assets.hands[hand]}" alt="Reference silhouette for the ${handNames[hand]} palm"><div class="landmark-layer" id="landmark-layer" aria-hidden="true"></div><div class="guide-status" id="guide-status" aria-live="polite">Requesting camera access…</div></div></div><div class="camera-controls"><button class="shutter" id="shutter" aria-label="Take photo" disabled></button><button class="camera-gallery" id="camera-gallery">Choose an image</button></div></section>`);
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
      shutter.setAttribute('aria-label','Capture quickly');
      startCameraFeedback(video);
    } else {
      addNativeCameraFallback(hand,'The camera opened but didn’t deliver an image. Use your phone’s camera or choose a photo.');
    }
  } catch(error) {
    if(shutter) shutter.disabled=true;
    const message=cameraErrorMessage(error);
    addNativeCameraFallback(hand,message);
    toast('Couldn’t open the live camera. Try your phone’s camera.');
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
    if(placementReady) status.textContent='Hand detected! Tap the circle to capture';
    else if(cameraModelLoading) status.textContent='You can capture while recognition loads';
    else if(!cameraModelAvailable) status.textContent='Tap the circle to capture your hand';
    else status.textContent='Bring your hand closer and tap the circle to capture';
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
  if(status)status.textContent='Loading hand recognition…';
  withTimeout(loadHandLandmarker(),null,8000).then(model=>{
    cameraModelAvailable=Boolean(model);
    cameraModelLoading=false;
    if(document.querySelector('#guide-status')) document.querySelector('#guide-status').textContent=model?'Show your whole palm inside the frame':'You can take the photo; recognition unavailable';
  });
  cameraFeedbackTimer=setInterval(()=>updateCameraFeedback(video),220);
}
function closeCamera() { clearInterval(cameraFeedbackTimer);cameraFeedbackTimer=null;cameraFeedbackBusy=false;cameraModelLoading=false;state.stream?.getTracks().forEach(track=>track.stop());state.stream=null;document.querySelector('.camera-modal')?.remove(); }
function canvasFromVideo(video) { const scale=Math.min(1,1000/Math.max(video.videoWidth,video.videoHeight));const canvas=document.createElement('canvas');canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);return canvas; }
function withTimeout(promise, fallback, milliseconds=1200) { return Promise.race([promise.catch(()=>fallback),new Promise(resolve=>setTimeout(()=>resolve(fallback),milliseconds))]); }
async function capturePhoto(hand) {
  const video=document.querySelector('#camera-video');
  if(!video?.videoWidth) { toast('The camera isn’t ready yet.'); return; }
  const shutter=document.querySelector('#shutter');
  if(shutter)shutter.disabled=true;
  const status=document.querySelector('#guide-status');
  if(status)status.textContent='Scanning the points on your hand…';
  const canvas=canvasFromVideo(video);
  let landmarks=cameraLandmarks;
  if(!landmarks && cameraModelAvailable && !cameraFeedbackBusy) {
    landmarks=await withTimeout(detectHandsInVideo(video,performance.now()).then(result=>result?.landmarks?.[0]||null),null,650);
  }
  closeCamera();
  if(!landmarks) {
    if(status)status.textContent='Looking for the points of your hand in the photo…';
    const result=await withTimeout(detectHandsInImage(canvas),null,20000);
    landmarks=result?.landmarks?.[0]||null;
  }
  processCanvas(canvas,hand,landmarks||null,true);
}
function loadFile(file,hand) {
  const isImage=file?.type?.startsWith('image/') || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file?.name||'');
  if(!isImage)return toast('Select an image file.');
  const reader=new FileReader();
  reader.onload=async()=>{
    try {
      const canvas=await toCanvas(reader.result);
      const result=await withTimeout(detectHandsInImage(canvas),null,20000);
      processCanvas(canvas,hand,result?.landmarks?.[0]||null);
    } catch { toast('That image couldn’t be read.'); }
  };
  reader.onerror=()=>toast('That image couldn’t be read.');
  reader.readAsDataURL(file);
}
function processCanvas(canvas,hand,landmarks=null,allowBasic=false) { play('scan');const analysis=analyzeCanvas(canvas,hand,{landmarks});const dataUrl=canvas.toDataURL('image/jpeg',.88);if(!analysis.quality.valid&&!allowBasic){showQuality(analysis,dataUrl,hand,canvas);return;}acceptCapture(analysis,dataUrl,hand,canvas);if(!analysis.quality.valid)toast('Hand captured; basic visual reading'); }
function showQuality(analysis,dataUrl,hand,canvas) { root.insertAdjacentHTML('beforeend',`<div class="sheet-backdrop" id="quality-modal"><div class="sheet"><div class="grab"></div><h2>Check the photograph</h2><p>${analysis.quality.message}</p><div class="quality-card">${analysis.quality.checks.map(check=>`<div class="quality-check ${check.ok?'ok':'bad'}">${icon(check.ok?'check':'info',16)}<span><strong>${escapeHtml(check.label)}</strong><br>${escapeHtml(check.detail)}</span></div>`).join('')}</div><button class="primary" id="retry-quality">Take another photograph</button>${analysis.detection.handDetected?'<button class="secondary" id="use-quality" style="margin-top:10px">Use with a limited reading</button>':'<button class="secondary" id="use-basic" style="margin-top:10px">Continue with a basic reading</button>'}</div></div>`);document.querySelector('#retry-quality').onclick=()=>{document.querySelector('#quality-modal').remove();captureScreen(hand);};document.querySelector('#use-quality')?.addEventListener('click',()=>{document.querySelector('#quality-modal').remove();acceptCapture(analysis,dataUrl,hand,canvas);});document.querySelector('#use-basic')?.addEventListener('click',()=>{document.querySelector('#quality-modal').remove();acceptCapture(analysis,dataUrl,hand,canvas);toast('Photo saved with basic visual analysis');}); }
function acceptCapture(analysis,dataUrl,hand,canvas) { state.handImages[hand]={dataUrl,canvas};state.analyses[hand]=analysis;if(hand==='left'){toast('Left palm saved');setTimeout(()=>captureScreen('right'),350);}else{toast('Both palms saved');setTimeout(runPipeline,350);} }

const pipelineStages=['Detecting hand…','Analyzing geometry…','Identifying main lines…','Analyzing secondary lines and mounts…','Looking for visible marks…','Comparing left and right…','Preparing traditional interpretation…'];
function runPipeline() { state.screen='pipeline'; root.innerHTML=shell(`<section class="screen analysis"><p class="eyebrow">Local processing</p><h2>Separating observation from interpretation</h2><p class="subtitle" style="margin-left:0">We don’t show made-up percentages. Each stage finishes before the next one begins.</p><div class="preview-card"><div class="dual-preview"><img src="${state.handImages.left.dataUrl}" alt="Left palm"><img src="${state.handImages.right.dataUrl}" alt="Right palm"></div><div class="scanline"></div></div><div class="pipeline">${pipelineStages.map((stage,index)=>`<div class="pipeline-item" data-stage="${index}"><i class="pipeline-dot"></i>${stage}</div>`).join('')}</div><p class="trust">${icon('lock',14)} Provisional local vision · version ${VISION_VERSION}</p></section>`);bindCommon();let index=0;const timer=setInterval(()=>{document.querySelector(`[data-stage="${index-1}"]`)?.classList.replace('active','done');const active=document.querySelector(`[data-stage="${index}"]`);if(active)active.classList.add('active');index+=1;if(index>pipelineStages.length){clearInterval(timer);finishAnalysis();}},460);}
function finishAnalysis() {const hands={left:state.analyses.left,right:state.analyses.right};const comparison=compareHands(hands.left,hands.right);const interpretation=applyPalmistryRules(hands,state.dominance,state.mode);state.report=buildReport(hands,comparison,interpretation,state.dominance,state.mode);state.screen='results';state.selectedHand='left';state.selectedFeature=null;state.original=false;play('reveal');showResults();}

function linePathFor(item) { return item.coordinates?.path || ''; }
function resultViewer() { const analysis=state.analyses[state.selectedHand];const image=state.handImages[state.selectedHand];const lines=analysis.lines.filter(item=>item.coordinates);const active=state.selectedFeature;return `<div class="viewer"><div class="viewer-tabs">${['left','right'].map(h=>{const role=dominanceRole(h,state.report?.dominance||state.dominance);return `<button class="viewer-tab ${state.selectedHand===h?'active':''}" data-view-hand="${h}">Palma ${handNames[h]}${role?`<small class="tab-role">${role}</small>`:''}</button>`;}).join('')}</div><div class="annotated-palm ${state.original?'original':''}"><img src="${image.dataUrl}" alt="${handNames[state.selectedHand]} palm">${state.original?'':`<svg viewBox="0 0 1 1" preserveAspectRatio="none">${lines.map(item=>`<path data-feature="${item.feature}" class="${item.status==='estimated'?'estimated ':''}${active&&active!==item.feature?'dim':active===item.feature?'focus':''}" d="${linePathFor(item)}" stroke="${item.color}" pointer-events="stroke"></path>`).join('')}</svg>`}</div><div class="viewer-caption">${state.original?'Original image without annotations.':(analysis.detection?.anchored!=='landmarks'?'We couldn’t locate your fingers and thumb in this photo. Without that reference, there’s no way to tell which crease is which line, so we don’t draw any. Retake the photo with your whole hand (fingers and thumb visible) on a plain background.':analysis.detection?.tracedLines!==undefined?(analysis.detection.tracedLines?`Solo dibujamos las líneas que se ven con claridad en tu foto (${analysis.detection.tracedLines} de 4), siguiendo su recorrido real. Las que no se distinguen no se dibujan ni se interpretan. Toca una línea para ver su explicación.`:'The lines can’t be clearly distinguished in this photo, so we don’t draw any. Retake the photo with even light, no glare, and your palm wide open.'):analysis.detection?.anchored==='landmarks'?'The lines are drawn over the actual points on your hand. Tap a line or a card to see its explanation.':'The points on your hand couldn’t be located; the lines are fitted to the detected outline and are approximate. Tap a line or a card to see its explanation.')}</div><button class="secondary" id="toggle-original">${state.original?'Show annotations':'View original image'}</button></div>`; }
function statementCards() {
  const statements=state.report.interpretation.statements;
  const readings=state.report.interpretation.featureReadings||[];
  return statements.length?statements.map(statement=>{
    const reading=readings.find(item=>item.hand===statement.hand&&item.feature===statement.feature);
    const interpretation=[reading?.explanation, reading?.details, reading?.reflection].filter(Boolean).join(' ') || statement.meaning || statement.text;
    return `<article class="fact-card">
      <h3>${escapeHtml(statement.category)} · ${escapeHtml(handNames[statement.hand])}</h3>
      <p><strong>This line came out with these characteristics:</strong> ${escapeHtml(reading?.observation||'')}.</p>
      <p><strong>The interpretation is as follows:</strong> ${escapeHtml(interpretation)}</p>
    </article>`;
  }).join(''):'<div class="fact-card"><p>There are no findings clear enough to build an interpretation. You can scan again with better light.</p></div>';
}
function featureCards() {
  const analysis=state.analyses[state.selectedHand];
  const readings=state.report?.interpretation?.featureReadings||[];
  return analysis.lines.map(item=>{
    const reading=readings.find(candidate=>candidate.hand===state.selectedHand&&candidate.feature===item.feature);
    const visible=item.detected&&item.confidence>=.4;
    const interpretation=visible||item.feature==='fate_line'
      ? [reading?.explanation, reading?.details, reading?.reflection].filter(Boolean).join(' ')
      : 'The image doesn’t show this line clearly enough to interpret it with confidence. Try a photo with better light and the palm fully extended.';
    return `<button class="line-card ${state.selectedFeature===item.feature?'open':''}" data-feature-card="${item.feature}">
      <span class="line-head"><span class="line-title"><i class="dot" style="color:${item.color};background:${item.color}"></i>${escapeHtml(item.label)}</span><span>${item.detected?'⌄':'?'}</span></span>
      <span class="line-summary">${escapeHtml(item.observations.join('. '))}.</span>
      <p>
        <strong>This line came out with these characteristics:</strong> ${escapeHtml(item.observations.join('. '))}.<br><br>
        <strong>The interpretation is as follows:</strong> ${escapeHtml(interpretation)}
      </p>
    </button>`;
  }).join('');
}
function shapeCard() {
  const analysis=state.analyses[state.selectedHand];
  const r=shapeReading(analysis);
  if(!r) return `<div class="fact-card"><h3>Shape of the ${handNames[state.selectedHand]} palm</h3><p>The points of the hand couldn’t be located in this photo, so the shape and fingers aren’t measured. Try with your whole palm, fingers apart, and good light.</p></div>`;
  return `<div class="fact-card shape-card"><h3>${escapeHtml(r.title)} · ${handNames[state.selectedHand]}</h3>
    <p><strong>What was measured:</strong> palm ${escapeHtml(r.palm)} and fingers ${escapeHtml(r.fingers)}.</p>
    <p><strong>The interpretation is as follows:</strong> ${escapeHtml(r.shapeText)}</p>
    <p><strong>Index and ring finger:</strong> ${escapeHtml(r.indexVsRing)}. ${escapeHtml(r.indexText)}</p>
    <p><strong>Thumb:</strong> ${escapeHtml(r.thumb)} (${r.thumbAngle}°). ${escapeHtml(r.thumbText)}</p>
  </div>`;
}
function reportSections() { return state.report.sections.map(section=>`<details class="fact-card"><summary><strong>${escapeHtml(section.title)}</strong></summary><p>${escapeHtml(section.text)}</p></details>`).join(''); }
function showResults() { const report=state.report;root.innerHTML=shell(`<section class="screen results"><p class="eyebrow">${report.mode==='complete'?'Full':'Quick'} report · reading ready</p><h2>Your palm, observed with care</h2><div class="notice"><strong>Important:</strong> the visual detection in this version is a provisional local estimate. Confidence in a detection is not certainty about an interpretation. Palmistry is presented solely as a cultural tradition and entertainment.</div>${resultViewer()}<div class="reading-intro"><span class="score-pill">${icon('info',14)} Visual facts before symbols</span><br>The reading separates <strong>observation</strong>, <strong>candidate classification</strong>, and <strong>traditional interpretation</strong>. No secondary lines or symbols have been invented where confidence is insufficient.</div><p class="section-label">Shape of your hand and fingers</p>${shapeCard()}<p class="section-label">What each line means</p><div class="reading-intro line-meaning-intro">Here is the meaning tradition attributes to each line, explained with its nuances. First you’ll see what was observed in the image, then how it is interpreted symbolically. The reading speaks of tendencies to reflect on, not fixed truths about you.</div><div class="line-list">${featureCards()}</div><p class="section-label">Why does this interpretation appear?</p>${statementCards()}<p class="section-label">Full report</p><div class="report-nav"><button class="active">All sections</button></div>${reportSections()}<article class="prediction"><small>Symbolic message</small><h3>An invitation to observe</h3><p>Use this reading as a reflective pause. A photograph can’t guarantee the future, measure your health, or define your personality.</p></article><div class="result-actions"><button class="secondary" id="save-reading">${icon('save',17)} Save</button><button class="secondary" id="share-reading">${icon('share',17)} Share</button></div><button class="primary" id="new-again" style="margin-top:10px">${icon('refresh',17)} New reading</button><p class="disclaimer">Vision model: ${VISION_VERSION} · Rules base: ${RULES_VERSION}. Small differences between photos may be due to lighting, position, camera, or detection.</p></section>`);bindCommon();document.querySelectorAll('[data-view-hand]').forEach(button=>button.onclick=()=>{state.selectedHand=button.dataset.viewHand;state.selectedFeature=null;showResults();});document.querySelector('#toggle-original').onclick=()=>{state.original=!state.original;showResults();};document.querySelectorAll('[data-feature-card]').forEach(button=>button.onclick=()=>{state.selectedFeature=button.dataset.featureCard;state.original=false;showResults();document.querySelector('.viewer')?.scrollIntoView({behavior:'smooth',block:'center'});});document.querySelector('.annotated-palm svg')?.addEventListener('click',event=>{const feature=event.target.dataset.feature;if(feature){state.selectedFeature=feature;showResults();}});document.querySelector('#save-reading').onclick=saveReading;document.querySelector('#share-reading').onclick=shareReading;document.querySelector('#new-again').onclick=()=>{state.handImages={left:null,right:null};state.analyses={left:null,right:null};setup(state.mode);}; }

function saveReading() { const item={id:Date.now(),date:new Date().toISOString(),mode:state.mode,dominance:state.dominance,report:state.report,analyses:state.analyses,images:{left:state.handImages.left?.dataUrl,right:state.handImages.right?.dataUrl},visionVersion:VISION_VERSION,rulesVersion:RULES_VERSION};try{const history=JSON.parse(readLocal('aura-readings','[]')||'[]');history.unshift(item);if(!writeLocal('aura-readings',JSON.stringify(history.slice(0,8))))throw new Error('storage-full');toast('Reading saved on this device');}catch{toast('There isn’t enough space to save the photos; the report is still available.');} }
async function shareReading() { const text='My palmistry reading separates visual facts from traditional interpretations. It’s a recreational experience, not a scientific one.';if(navigator.share){try{await navigator.share({title:'My Palmistry reading',text});return;}catch(error){if(error.name==='AbortError')return;}}try{await navigator.clipboard.writeText(text);toast('Text copied to clipboard');}catch{toast('The reading is ready to share');} }
function showHistory() { let history=[]; try { history=JSON.parse(readLocal('aura-readings','[]')||'[]'); } catch { history=[]; } root.innerHTML=shell(`<section class="screen history"><p class="eyebrow">Private on this device</p><h2>My readings</h2><p class="subtitle" style="margin-left:0">Saved photos and reports stay in your browser’s local storage until you delete them.</p>${history.length?history.map(item=>`<article class="history-card" data-history-id="${item.id}" role="button" tabindex="0" style="cursor:${item.analyses&&item.images?.left&&item.images?.right?'pointer':'default'}"><strong>${new Date(item.date).toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'})}</strong><span class="muted">Lectura ${item.mode==='complete'?'completa':'quick'} · mano dominante: ${escapeHtml({right:'derecha',left:'izquierda',both:'ambidiestra'}[item.dominance]||'not specified')}</span>${item.analyses&&item.images?.left&&item.images?.right?'<span class="muted">Tap to open the reading ›</span>':''}</article>`).join(''):'<div class="history-empty">You haven’t saved any readings yet.</div>'}<p class="danger-note">Clearing your browser data also deletes this history. Variations between scans do not prove real changes in the lines.</p><button class="secondary" id="clear-history">Delete local history</button><button class="primary" id="history-back" style="margin-top:10px">Back to home</button></section>`);bindCommon();document.querySelector('#history-back').onclick=home;document.querySelector('#clear-history').onclick=()=>{removeLocal('aura-readings');showHistory();};document.querySelectorAll('[data-history-id]').forEach(card=>card.onclick=()=>{const item=history.find(h=>String(h.id)===card.dataset.historyId);if(!item?.analyses||!item.images?.left||!item.images?.right)return toast('This reading was saved without photos; it can’t be opened.');state.mode=item.mode;state.dominance=item.dominance;state.report=item.report;state.analyses=item.analyses;state.handImages={left:{dataUrl:item.images.left},right:{dataUrl:item.images.right}};state.screen='results';state.selectedHand='left';state.selectedFeature=null;state.original=false;showResults();}); }
function showLearning() { root.innerHTML=shell(`<section class="screen history"><p class="eyebrow">Short library</p><h2>Learn palmistry</h2><div class="fact-card"><h3>Observation vs. interpretation</h3><p><strong>Observation:</strong> “A candidate path is observed.”<br><strong>Classification:</strong> “The system groups it as a possible heart line.”<br><strong>Interpretation:</strong> “In some schools it is associated with expressiveness.”</p></div><div class="fact-card"><h3>Main lines</h3><p>The heart, head, and life lines are traditionally studied along with their shape, continuity, ending, and relationship to other lines. The life line does not predict lifespan.</p></div><div class="fact-card"><h3>Mounts, fingers, and symbols</h3><p>Schools differ in their methods. A mark is never interpreted in isolation: its location, nearby lines, and context are considered. A 2D photo can’t establish body volume accurately.</p></div><div class="fact-card"><h3>Privacy</h3><p>Photos are personal information. The palmistry tool processes them in your browser and only saves them if you tap “Save.” They are not used to train models without consent.</p></div><button class="primary" id="learn-back">Back to home</button></section>`);bindCommon();document.querySelector('#learn-back').onclick=home;}

window.addEventListener('pagehide',()=>state.stream?.getTracks().forEach(track=>track.stop()));
home();

// Evita que el gesto/botón "atrás" del navegador saque de la app: primero regresa a la pantalla principal de la app.

