/* Portal Místico — música global continua.
   Una sola pista (la de Tarot) para toda la web. Mientras suena, los enlaces
   internos se cargan sin recargar la página, así la música no se corta. */
(function () {
  if (window.PortalMusic) return;

  var SRC = '/assets/audio/musica-portal.mp3';
  var VOL = 0.22;
  var KEY_PREF = 'pm-music';      // 'on' | 'off'
  var KEY_TIME = 'pm-music-time'; // segundo donde iba la canción

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Rastreo de listeners y temporizadores de cada página ---------- */
  var origWinAdd = window.addEventListener.bind(window);
  var origWinRemove = window.removeEventListener.bind(window);
  var origDocAdd = document.addEventListener.bind(document);
  var origDocRemove = document.removeEventListener.bind(document);
  var origSetInterval = window.setInterval.bind(window);
  var origSetTimeout = window.setTimeout.bind(window);
  var origClearInterval = window.clearInterval.bind(window);
  var origClearTimeout = window.clearTimeout.bind(window);

  var tracked = [];      // [target, type, fn, opts]
  var intervals = [];
  var timeouts = [];
  var swapped = false;   // true después de la primera navegación sin recarga

  function track(target, origAdd) {
    return function (type, fn, opts) {
      if (swapped && (type === 'DOMContentLoaded' || type === 'load') && document.readyState === 'complete') {
        // La página ya "cargó": ejecutamos el callback enseguida.
        origSetTimeout(function () { try { fn.call(target, new Event(type)); } catch (e) { console.error(e); } }, 0);
        return;
      }
      tracked.push([target, type, fn, opts]);
      return origAdd(type, fn, opts);
    };
  }
  window.addEventListener = track(window, origWinAdd);
  document.addEventListener = track(document, origDocAdd);
  window.setInterval = function () { var id = origSetInterval.apply(window, arguments); intervals.push(id); return id; };
  window.setTimeout = function () { var id = origSetTimeout.apply(window, arguments); timeouts.push(id); return id; };

  function teardownPage() {
    tracked.forEach(function (t) { (t[0] === window ? origWinRemove : origDocRemove)(t[1], t[2], t[3]); });
    tracked = [];
    intervals.forEach(origClearInterval); intervals = [];
    timeouts.forEach(origClearTimeout); timeouts = [];
  }

  /* ---------- Audio ---------- */
  var html = new Audio(SRC);
  html.loop = true;
  html.preload = 'none'; // el archivo (1 MB) solo se descarga cuando empieza a sonar
  html.volume = VOL;
  var appMuted = false; // una app la pausó con su propio botón (solo hasta cambiar de sección)
  var resumeAt = parseFloat(ss(KEY_TIME) || '0') || 0;

  /* La música suena por Web Audio: no depende de ningún <audio>, así el iPhone no la
     pausa al cambiar de herramienta. Si el navegador no lo soporta, se usa el <audio>. */
  function makeWebMusic() {
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    var evs = {}, buf = null, loading = null, src = null, gain = null;
    var intended = false, offset = resumeAt, startedAt = 0, failed = false, announced = false;
    var o = { loop: true, muted: false };
    function emit(t) { (evs[t] || []).slice().forEach(function (f) { try { f.call(o, { type: t }); } catch (e) {} }); }
    o.addEventListener = function (t, f) { (evs[t] = evs[t] || []).push(f); };
    o.removeEventListener = function (t, f) { evs[t] = (evs[t] || []).filter(function (x) { return x !== f; }); };
    function running() { return !!(actx && actx.state === 'running'); }
    function pos() {
      if (!buf) return offset;
      return src ? (offset + (actx.currentTime - startedAt)) % buf.duration : offset % buf.duration;
    }
    function ensureSource() {
      var c = getCtx(); if (!c || failed) return;
      if (!buf) {
        if (!loading) {
          loading = fetch(SRC).then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
            return new Promise(function (res, rej) { var pr = c.decodeAudioData(ab, res, rej); if (pr && pr.then) pr.then(res, rej); });
          }).then(function (b) { buf = b; }, function () { failed = true; });
        }
        loading.then(ensureSource);
        return;
      }
      if (!intended || src) return;
      if (!gain) { gain = c.createGain(); gain.gain.value = VOL; gain.connect(c.destination); }
      src = c.createBufferSource();
      src.buffer = buf; src.loop = true; src.connect(gain);
      offset = offset % buf.duration;
      startedAt = c.currentTime;
      src.start(0, offset);
    }
    function announce() {
      var on = intended && running();
      if (on && !announced) { announced = true; emit('play'); emit('playing'); }
      else if (!on && announced) { announced = false; emit('pause'); }
    }
    o.play = function () {
      intended = true;
      var c = getCtx();
      if (!c) return Promise.reject(new Error('no-audio'));
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
      if (!c.__pmWatch) { c.__pmWatch = true; c.onstatechange = function () { announce(); }; }
      var r; try { r = c.resume(); } catch (e) {}
      ensureSource();
      return Promise.resolve(r).then(function () {
        announce();
        if (!running()) throw new Error('blocked');
      });
    };
    o.pause = function () {
      intended = false;
      if (src) { offset = pos(); try { src.stop(); } catch (e) {} try { src.disconnect(); } catch (e) {} src = null; }
      announce();
      if (!announced) emit('pause');
    };
    Object.defineProperty(o, 'paused', { get: function () { return !(intended && running()); } });
    Object.defineProperty(o, 'currentTime', { get: pos, set: function (v) { offset = v || 0; if (src) { var was = intended; try { src.stop(); } catch (e) {} src = null; startedAt = 0; if (was) ensureSource(); } } });
    Object.defineProperty(o, 'volume', { get: function () { return VOL; }, set: function (v) { VOL = v; if (gain) gain.gain.value = v; } });
    Object.defineProperty(o, 'duration', { get: function () { return buf ? buf.duration : 0; } });
    origSetInterval(function () { if (src && running()) emit('timeupdate'); }, 500);
    return o;
  }
  var audio = null;
  try { audio = makeWebMusic(); } catch (e) { audio = null; }
  if (!audio) {
    audio = html;
    if (resumeAt) {
      audio.addEventListener('loadedmetadata', function () {
        try { audio.currentTime = resumeAt % (audio.duration || 1e9); } catch (e) {}
      }, { once: true });
    }
  }

  function prefOn() { return ls(KEY_PREF) !== 'off'; }

  function play() {
    if (!prefOn()) return Promise.resolve();
    appMuted = false;
    var p = audio.play();
    if (p && p.catch) p.catch(function () {});
    return p || Promise.resolve();
  }
  function pause() { audio.pause(); }

  var lastSave = 0;
  audio.addEventListener('timeupdate', function () {
    var now = Date.now();
    if (now - lastSave > 1000) { lastSave = now; ss(KEY_TIME, String(audio.currentTime)); }
  });
  origWinAdd('pagehide', function () { ss(KEY_TIME, String(audio.currentTime)); });

  /* Objeto que reciben las apps (dentro del iframe) en lugar de su propia música */
  function makeProxy() {
    var p = {};
    Object.defineProperty(p, 'paused', { get: function () { return audio.paused; } });
    Object.defineProperty(p, 'loop', { get: function () { return true; }, set: function () {} });
    Object.defineProperty(p, 'volume', { get: function () { return audio.volume; }, set: function () {} });
    Object.defineProperty(p, 'currentTime', { get: function () { return audio.currentTime; }, set: function () {} });
    Object.defineProperty(p, 'muted', { get: function () { return audio.muted; }, set: function () {} });
    p.play = function () { return play(); };
    p.pause = function () { /* las apps no detienen la música: solo el botón ♫ */ };
    p.load = function () {};
    p.addEventListener = function () {};
    p.removeEventListener = function () {};
    return p;
  }


  /* ---------- Efectos de sonido (Web Audio: se mezclan con la música sin pausarla) ---------- */
  var actx = null, sfxCache = {};
  function getCtx() {
    if (actx) return actx;
    try { var C = window.AudioContext || window.webkitAudioContext; if (C) actx = new C(); } catch (e) {}
    return actx;
  }
  function sfx(url) {
    var o = { volume: 0.4, currentTime: 0, paused: true, muted: false, loop: false,
      load: function () {}, pause: function () {}, addEventListener: function () {}, removeEventListener: function () {} };
    var buf = null, loading = null;
    function load() {
      if (buf || loading) return loading;
      var c = getCtx(); if (!c) return null;
      if (sfxCache[url]) { loading = sfxCache[url]; }
      else {
        loading = sfxCache[url] = fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (ab) {
          return new Promise(function (res, rej) { var pr = c.decodeAudioData(ab, res, rej); if (pr && pr.then) pr.then(res, rej); });
        });
      }
      loading = loading.then(function (b) { buf = b; return b; }, function () { loading = null; sfxCache[url] = null; });
      return loading;
    }
    o.play = function () {
      var c = getCtx();
      if (!c) return Promise.resolve();
      try { if (c.state === 'suspended') c.resume(); } catch (e) {}
      function go() {
        if (!buf) return;
        var src = c.createBufferSource(), g = c.createGain();
        src.buffer = buf; g.gain.value = o.muted ? 0 : Math.max(0, Math.min(1, o.volume));
        src.connect(g); g.connect(c.destination); src.start(0);
      }
      if (buf) go(); else { var l = load(); if (l) l.then(go); }
      return Promise.resolve();
    };
    origSetTimeout(load, 0);
    return o;
  }

  /* ---------- Botón flotante ---------- */
  var css = document.createElement('style');
  css.id = 'pm-music-css';
  css.textContent =
    '#pm-music-btn{position:fixed;right:max(14px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));z-index:9999;' +
    'width:44px;height:44px;border-radius:50%;border:1px solid rgba(232,200,120,.55);background:rgba(18,15,40,.82);' +
    'color:#F1D58A;font-size:21px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;' +
    'box-shadow:0 6px 18px rgba(0,0,0,.4);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);padding:0;-webkit-tap-highlight-color:transparent}' +
    '#pm-music-btn.pm-off{color:rgba(241,213,138,.55)}' +
    '#pm-music-btn.pm-on::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1px solid rgba(241,213,138,.45);animation:pmPulse 2.4s ease-out infinite}' +
    '@keyframes pmPulse{0%{transform:scale(.9);opacity:.9}100%{transform:scale(1.35);opacity:0}}' +
    '#pm-music-btn.pm-in-nav{position:relative;top:auto;right:auto;margin-left:auto;width:38px;height:38px;font-size:18px;flex:none;box-shadow:none;z-index:auto}' +
    '@media print{#pm-music-btn{display:none}}';
  var btn = document.createElement('button');
  btn.id = 'pm-music-btn';
  btn.type = 'button';

  function refreshBtn() {
    var on = !audio.paused;
    btn.textContent = on ? '♫' : (prefOn() ? '♪' : '🔇');
    btn.className = (on ? 'pm-on' : 'pm-off') + (btn.__inNav ? ' pm-in-nav' : '');
    btn.setAttribute('aria-label', on ? 'Pausar música' : 'Activar música');
    btn.title = on ? 'Pausar música' : 'Activar música';
  }
  ['play', 'pause', 'playing'].forEach(function (t) { audio.addEventListener(t, refreshBtn); });

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (audio.paused) { ls(KEY_PREF, 'on'); play(); }
    else { ls(KEY_PREF, 'off'); pause(); }
    refreshBtn();
  });

  /* Si algo externo la pausa (otra app, el sistema), la reanudamos sola */
  var autoResumes = [];
  audio.addEventListener('pause', function () {
    if (!prefOn()) return;
    var now = Date.now();
    autoResumes = autoResumes.filter(function (t) { return now - t < 10000; });
    if (autoResumes.length >= 3) return; // el sistema insiste (p. ej. cámara): no pelear
    autoResumes.push(now);
    origSetTimeout(function () {
      if (audio.paused && prefOn() && document.visibilityState === 'visible') play();
    }, 250);
  });
  origDocAdd('visibilitychange', function () {
    if (document.visibilityState === 'visible' && audio.paused && prefOn() && audio.currentTime > 0) play();
  });

  function mountUI() {
    if (!document.getElementById('pm-music-css')) document.head.appendChild(css);
    var navIn = document.querySelector('.pm-nav-in');
    var burger = navIn && navIn.querySelector('.pm-burger');
    if (navIn) {
      btn.__inNav = true;
      if (btn.parentNode !== navIn) { if (burger) navIn.insertBefore(btn, burger); else navIn.appendChild(btn); }
    } else {
      btn.__inNav = false;
      if (btn.parentNode !== document.body) document.body.appendChild(btn);
    }
    refreshBtn();
  }

  /* ---------- Arranque con el primer toque (iPhone exige un gesto) ---------- */
  function gestureStart(e) {
    if (e && e.target && e.target.closest && e.target.closest('#pm-music-btn')) return;
    if (audio.paused && prefOn() && !appMuted) play();
  }
  origDocAdd('click', gestureStart, true);
  origDocAdd('touchend', gestureStart, true);
  origDocAdd('keydown', gestureStart, true);
  origDocAdd('pointerup', gestureStart, true);

  /* Cualquier movimiento del dedo o scroll intenta reanudar si quedó en pausa (iPhone) */
  var lastWake = 0;
  function wake() {
    var now = Date.now();
    if (now - lastWake < 250) return;
    lastWake = now;
    if (audio.paused && prefOn() && !appMuted) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
  }
  ['touchmove', 'scroll', 'pointermove', 'wheel'].forEach(function (t) { origDocAdd(t, wake, { capture: true, passive: true }); });

  /* Vigilante: si está en pausa sin que el usuario la apagara, o se quedó congelada, la reactivamos */
  var wdLast = -1, wdStuck = 0;
  origSetInterval(function () {
    if (!prefOn() || appMuted || document.visibilityState !== 'visible') { wdStuck = 0; return; }
    if (audio.paused) { wdStuck = 0; if (audio.currentTime > 0) wake(); return; }
    if (audio.currentTime === wdLast) {
      if (++wdStuck >= 3) { wdStuck = 0; try { audio.pause(); } catch (e) {} var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
    } else wdStuck = 0;
    wdLast = audio.currentTime;
  }, 1000);
  origDocAdd('touchstart', gestureStart, true);

  /* Si venía sonando y quedó en pausa sin que el usuario la apagara, la retomamos */
  function kick() {
    if (audio.paused && prefOn() && !appMuted && audio.currentTime > 0 && document.visibilityState === 'visible') play();
  }
  origDocAdd('visibilitychange', kick);
  origWinAdd('pageshow', kick);

  /* ---------- Navegación sin recarga ---------- */
  var SITE_HOSTS = ['elportalmistico.com', 'www.elportalmistico.com'];

  function internalURL(href) {
    var u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    if (SITE_HOSTS.indexOf(u.hostname) !== -1 && u.origin !== location.origin) {
      u = new URL(u.pathname + u.search + u.hash, location.origin);
    }
    if (u.origin !== location.origin) return null;
    // Páginas: terminan en "/" o ".html", o no tienen extensión (Netlify sirve /juegos/tarot sin .html)
    var last = u.pathname.split('/').pop();
    if (!(last === '' || /\.html?$/i.test(last) || last.indexOf('.') === -1)) return null;
    return u;
  }

  function linkHandler(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('download')) return;
    var tgt = (a.getAttribute('target') || '').toLowerCase();
    var inFrame = a.ownerDocument !== document;
    if (inFrame ? (tgt !== '_top' && tgt !== '_parent') : (tgt && tgt !== '_self' && tgt !== '_top')) return;
    var u = internalURL(a.getAttribute('href'));
    if (!u) return;
    if (u.pathname === location.pathname && u.search === location.search && u.hash) return; // ancla en la misma página
    if (!prefOn()) {
      // Música apagada por el usuario: navegación normal (pero hacia la versión de este dominio)
      if (inFrame) { e.preventDefault(); location.href = u.href; }
      return;
    }
    e.preventDefault();
    navigate(u.href, true);
  }
  origDocAdd('click', linkHandler);

  var HIDE_CSS = '#sound-toggle,#sound,#mute,#boton-musica,#sound-button,.sound{display:none!important}';
  function hookIframe(fr) {
    try {
      var d = fr.contentDocument;
      if (!d) return;
      if (d.head && !d.getElementById('pm-hide-sound')) {
        var st = d.createElement('style'); st.id = 'pm-hide-sound'; st.textContent = HIDE_CSS; d.head.appendChild(st);
      }
      d.querySelectorAll('iframe').forEach(function (inner) {
        hookIframe(inner);
        if (!inner.__pmWatch) { inner.__pmWatch = true; inner.addEventListener('load', function () { hookIframe(inner); }); }
      });
      if (d.__pmHooked) return;
      d.__pmHooked = true;
      d.addEventListener('click', linkHandler);
      d.addEventListener('click', gestureStart, true);
      d.addEventListener('touchend', gestureStart, true);
      d.addEventListener('touchstart', gestureStart, true);
      d.addEventListener('pointerup', gestureStart, true);
      ['touchmove', 'scroll', 'pointermove', 'wheel'].forEach(function (t) { d.addEventListener(t, wake, { capture: true, passive: true }); });
    } catch (e) { /* iframe de otro dominio */ }
  }
  function watchIframes() {
    document.querySelectorAll('iframe').forEach(function (fr) {
      hookIframe(fr);
      if (!fr.__pmWatch) { fr.__pmWatch = true; fr.addEventListener('load', function () { hookIframe(fr); kick(); }); }
    });
  }

  function runScripts(container) {
    var list = Array.prototype.slice.call(container.querySelectorAll('script'));
    return list.reduce(function (chain, old) {
      return chain.then(function () {
        var type = (old.getAttribute('type') || '').toLowerCase();
        if (type && type !== 'text/javascript' && type !== 'module') return;
        var src = old.getAttribute('src');
        if (src && document.querySelector('head script[src="' + src + '"]')) { return; }
        return new Promise(function (resolve) {
          var s = document.createElement('script');
          for (var i = 0; i < old.attributes.length; i++) s.setAttribute(old.attributes[i].name, old.attributes[i].value);
          if (src) { s.onload = s.onerror = function () { resolve(); }; }
          else s.textContent = old.textContent;
          old.parentNode.replaceChild(s, old);
          if (!src || s.async) resolve();
        });
      });
    }, Promise.resolve());
  }

  var navToken = 0;
  function navigate(href, push) {
    var my = ++navToken;
    document.documentElement.style.cursor = 'progress';
    fetch(href, { credentials: 'same-origin' }).then(function (r) {
      var ct = r.headers.get('content-type') || '';
      if (!r.ok || ct.indexOf('text/html') === -1) throw new Error('no-html');
      return r.text();
    }).then(function (html) {
      if (my !== navToken) return;
      var doc = new DOMParser().parseFromString(html, 'text/html');
      teardownPage();
      swapped = true;
      if (push) history.pushState({ pm: 1 }, '', href);
      shownPath = location.pathname + location.search;

      // <html> atributos
      document.documentElement.lang = doc.documentElement.lang || 'es';

      // <head>: reemplazamos todo menos los scripts externos ya cargados y nuestro CSS
      var keep = function (el) {
        if (el.id === 'pm-music-css') return true;
        if (el.tagName === 'SCRIPT' && el.getAttribute('src')) return true;
        return false;
      };
      Array.prototype.slice.call(document.head.children).forEach(function (el) { if (!keep(el)) el.remove(); });
      var headFrag = document.createDocumentFragment();
      Array.prototype.slice.call(doc.head.children).forEach(function (el) {
        if (el.tagName === 'SCRIPT' && el.getAttribute('src')) {
          if (document.querySelector('head script[src="' + el.getAttribute('src') + '"]')) return;
        }
        headFrag.appendChild(document.importNode(el, true));
      });
      document.head.appendChild(headFrag);
      document.title = doc.title;

      // <body>
      var body = document.body;
      for (var i = body.attributes.length - 1; i >= 0; i--) body.removeAttribute(body.attributes[i].name);
      for (var j = 0; j < doc.body.attributes.length; j++) body.setAttribute(doc.body.attributes[j].name, doc.body.attributes[j].value);
      body.innerHTML = '';
      Array.prototype.slice.call(doc.body.childNodes).forEach(function (n) { body.appendChild(document.importNode(n, true)); });

      var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView(); else window.scrollTo(0, 0);

      return runScripts(document.head).then(function () { return runScripts(document.body); }).then(function () {
        mountUI();
        watchIframes();
        kick();
        try { if (typeof window.gtag === 'function') window.gtag('event', 'page_view', { page_location: location.href, page_title: document.title }); } catch (e) {}
      });
    }).catch(function () {
      location.href = href;
    }).then(function () {
      document.documentElement.style.cursor = '';
    });
  }

  try { history.scrollRestoration = 'manual'; } catch (e) {}
  if (!history.state) history.replaceState({ pm: 1 }, '', location.href);
  var shownPath = location.pathname + location.search;
  origWinAdd('popstate', function () {
    var now = location.pathname + location.search;
    if (now === shownPath) return; // solo cambió el #ancla
    if (swapped || prefOn()) navigate(location.href, false);
    else location.reload();
  });

  window.PortalMusic = { audio: audio, proxy: makeProxy(), play: play, pause: pause, sfx: sfx, go: function (href) { var u = internalURL(href); if (u) navigate(u.href, true); else location.href = href; } };

  function init() { mountUI(); watchIframes(); }
  if (document.readyState === 'loading') origDocAdd('DOMContentLoaded', init); else init();
})();
