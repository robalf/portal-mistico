/* Ventana de opinión para visitantes nuevos: 1-5 estrellas + comentario, enviado por correo (FormSubmit).
   Solo se muestra una vez, en la primera visita, cuando la persona está a punto de irse (PC) o tras un rato de lectura (móvil).
   Para probar: añade ?opinion=1 a cualquier dirección del sitio y saca el ratón por arriba de la ventana (o espera 5 s en móvil). */
(function () {
  if (window.__pmOpinion || window.top !== window) return;
  window.__pmOpinion = true;
  var EMAIL = 'elportalmistico87@outlook.com';
  var K_SEEN = 'pm_seen', K_DONE = 'pm_fb_done', K_FIRST = 'pm_first';
  var force = /[?&]opinion=1/.test(location.search);
  var EXCLUDE = /\/(contacto|privacidad|cookies|terminos|aviso-legal)(\.html)?$/;

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); return v; } catch (e) { return null; } }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); return v; } catch (e) { return null; } }
  var canStore = false;
  try { localStorage.setItem('pm_t', '1'); localStorage.removeItem('pm_t'); canStore = true; } catch (e) {}
  if (canStore && !ls(K_SEEN)) { ls(K_SEEN, String(Date.now())); ss(K_FIRST, '1'); }
  var eligible = force || (canStore && ss(K_FIRST) === '1' && !ls(K_DONE));
  if (!eligible) return;

  var active = 0, shown = false, rating = 0, sent = false, box, comment;
  var isTouch = !(window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches);
  setInterval(function () { if (document.visibilityState === 'visible') active++; }, 1000);

  function okPage() { return !EXCLUDE.test(location.pathname); }

  /* PC: el ratón sale por arriba (va a cerrar la pestaña o a cambiar de pestaña) */
  document.documentElement.addEventListener('mouseleave', function (e) {
    if (isTouch || shown || !okPage()) return;
    if (e.clientY <= 0 && (force || active >= 20)) show();
  });
  /* Móvil: tras un rato de lectura, un aviso discreto abajo */
  if (isTouch) {
    var t = setInterval(function () {
      if (shown) return clearInterval(t);
      if (okPage() && active >= (force ? 5 : 50) && document.visibilityState === 'visible') { clearInterval(t); show(); }
    }, 1500);
  }

  function css() {
    if (document.getElementById('pm-op-css')) return;
    var s = document.createElement('style'); s.id = 'pm-op-css';
    s.textContent =
      '#pm-op{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(5,6,15,.62);font-family:"Work Sans",Arial,sans-serif;-webkit-tap-highlight-color:transparent}' +
      '#pm-op .c{position:relative;width:min(92vw,440px);box-sizing:border-box;background:#0E1030;border:1px solid rgba(199,162,75,.5);border-radius:18px;padding:26px 22px 20px;color:#EEF0FA;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
      '#pm-op h2{margin:0 0 6px;font-family:"Fraunces",Georgia,serif;font-style:italic;font-weight:500;font-size:1.35rem;color:#E9D9A6}' +
      '#pm-op p{margin:0 0 14px;color:#B9BCD6;font-size:.93rem;line-height:1.5}' +
      '#pm-op .x{position:absolute;top:8px;right:10px;width:34px;height:34px;border:0;border-radius:50%;background:transparent;color:#9098C4;font-size:20px;cursor:pointer}' +
      '#pm-op .st{display:flex;justify-content:center;gap:6px;margin:6px 0 10px}' +
      '#pm-op .st button{border:0;background:transparent;font-size:38px;line-height:1;color:#3a3d66;cursor:pointer;padding:2px 4px;transition:transform .12s,color .12s}' +
      '#pm-op .st button.on{color:#F1D58A}#pm-op .st button:hover{transform:scale(1.12)}' +
      '#pm-op textarea{width:100%;box-sizing:border-box;min-height:92px;resize:vertical;border-radius:12px;border:1px solid rgba(199,162,75,.4);background:#080A22;color:#EEF0FA;padding:11px 12px;font:inherit;font-size:.95rem}' +
      '#pm-op .row{display:flex;gap:10px;justify-content:center;margin-top:12px}' +
      '#pm-op .go{border:0;border-radius:999px;padding:11px 22px;background:linear-gradient(135deg,#E9D9A6,#C7A24B);color:#1a1406;font-weight:600;font-size:.95rem;cursor:pointer}' +
      '#pm-op .sk{border:1px solid rgba(199,162,75,.4);border-radius:999px;padding:11px 18px;background:transparent;color:#C9CCE6;font-size:.9rem;cursor:pointer}' +
      '#pm-op .fine{margin:12px 0 0;font-size:.74rem;color:#7D84B0}' +
      '@media(max-width:600px){#pm-op{align-items:flex-end;background:rgba(5,6,15,.35)}#pm-op .c{width:100%;border-radius:18px 18px 0 0;border-bottom:0;padding-bottom:max(20px,env(safe-area-inset-bottom))}}';
    document.head.appendChild(s);
  }

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }

  function show() {
    if (shown) return; shown = true;
    if (!force) ls(K_DONE, String(Date.now()));
    css();
    box = el('div'); box.id = 'pm-op'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Tu opinión');
    var c = el('div', 'c');
    var x = el('button', 'x', '✕'); x.type = 'button'; x.setAttribute('aria-label', 'Cerrar'); x.onclick = close;
    c.appendChild(x);
    c.appendChild(el('h2', '', '¿Encontraste lo que buscabas?'));
    c.appendChild(el('p', '', 'Tu opinión nos ayuda a mejorar Portal Místico. ¿Cómo calificarías tu visita?'));
    var st = el('div', 'st'); var btns = [];
    for (var i = 1; i <= 5; i++) (function (n) {
      var b = el('button', '', '★'); b.type = 'button'; b.setAttribute('aria-label', n + (n === 1 ? ' estrella' : ' estrellas'));
      b.onmouseenter = function () { paint(n); }; b.onmouseleave = function () { paint(rating); };
      b.onclick = function () { choose(n); };
      btns.push(b); st.appendChild(b);
    })(i);
    function paint(n) { btns.forEach(function (b, k) { b.className = k < n ? 'on' : ''; }); }
    c.appendChild(st);
    var body = el('div'); c.appendChild(body);
    c.appendChild(el('p', 'fine', 'Es anónimo. Solo vemos la calificación y lo que escribas.'));
    box.appendChild(c);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
    try { x.focus(); } catch (e) {}

    function choose(n) {
      rating = n; paint(n); body.innerHTML = '';
      if (n === 5) {
        send(); body.appendChild(el('p', '', '¡Gracias! 🌟 Nos alegra que lo hayas encontrado.'));
        setTimeout(close, 2400); return;
      }
      body.appendChild(el('p', '', n >= 3 ? 'Gracias. ¿Qué podríamos mejorar o qué te faltó?' : 'Lamentamos que no fuera lo que esperabas. ¿Qué buscabas o qué falló?'));
      comment = el('textarea'); comment.setAttribute('aria-label', 'Tu comentario'); comment.placeholder = 'Escribe aquí lo que buscabas o lo que podemos mejorar…'; comment.maxLength = 1500;
      body.appendChild(comment);
      var row = el('div', 'row');
      var go = el('button', 'go', 'Enviar'); go.type = 'button'; go.onclick = function () { send(); body.innerHTML = ''; body.appendChild(el('p', '', '¡Gracias por ayudarnos a mejorar! 💜')); setTimeout(close, 2200); };
      var sk = el('button', 'sk', 'Ahora no'); sk.type = 'button'; sk.onclick = function () { send(); close(); };
      row.appendChild(go); row.appendChild(sk); body.appendChild(row);
      try { comment.focus(); } catch (e) {}
    }
  }

  function onKey(e) { if (e.key === 'Escape') close(); }
  function close() {
    if (rating && !sent) send();
    document.removeEventListener('keydown', onKey);
    if (box && box.parentNode) box.parentNode.removeChild(box);
    box = null;
  }

  function send() {
    if (sent || !rating) return; sent = true;
    var texto = comment ? comment.value.trim() : '';
    var payload = {
      _subject: 'Opinión de visitante: ' + rating + ' de 5 estrellas — Portal Místico',
      _template: 'table', _captcha: 'false', _honey: '',
      calificacion: rating + ' de 5',
      comentario: texto || '(sin comentario)',
      pagina: location.href,
      dispositivo: (isTouch ? 'móvil/tableta' : 'PC') + ' · ' + screen.width + 'x' + screen.height,
      navegador: (navigator.userAgent || '').slice(0, 140),
      fecha: new Date().toLocaleString('es-ES')
    };
    try {
      fetch('https://formsubmit.co/ajax/' + EMAIL, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) }).catch(function () {});
    } catch (e) {}
  }
})();
