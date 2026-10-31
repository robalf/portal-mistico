function PMS(r){try{var t=window.top;if(t!==window&&t.PortalMusic&&t.PortalMusic.sfx)return t.PortalMusic.sfx(new URL(r,location.href).href);}catch(e){}return new Audio(r);}
const signs = [
  { name:'Aries', glyph:'♈', dates:'21 MAR — 19 ABR', element:'Fuego' },
  { name:'Tauro', glyph:'♉', dates:'20 ABR — 20 MAY', element:'Tierra' },
  { name:'Géminis', glyph:'♊', dates:'21 MAY — 20 JUN', element:'Aire' },
  { name:'Cáncer', glyph:'♋', dates:'21 JUN — 22 JUL', element:'Agua' },
  { name:'Leo', glyph:'♌', dates:'23 JUL — 22 AGO', element:'Fuego' },
  { name:'Virgo', glyph:'♍', dates:'23 AGO — 22 SEP', element:'Tierra' },
  { name:'Libra', glyph:'♎', dates:'23 SEP — 22 OCT', element:'Aire' },
  { name:'Escorpio', glyph:'♏', dates:'23 OCT — 21 NOV', element:'Agua' },
  { name:'Sagitario', glyph:'♐', dates:'22 NOV — 21 DIC', element:'Fuego' },
  { name:'Capricornio', glyph:'♑', dates:'22 DIC — 19 ENE', element:'Tierra' },
  { name:'Acuario', glyph:'♒', dates:'20 ENE — 18 FEB', element:'Aire' },
  { name:'Piscis', glyph:'♓', dates:'19 FEB — 20 MAR', element:'Agua' }
];

const categories = [
  { id:'hoy', label:'Hoy', title:'Horóscopo de hoy' },
  { id:'manana', label:'Mañana', title:'Horóscopo de mañana' },
  { id:'semana', label:'Semanal', title:'Visión semanal' },
  { id:'mes', label:'Mensual', title:'Horizonte mensual' },
  { id:'2027', label:'2027', title:'Tu camino en 2027' },
  { id:'2028', label:'2028', title:'Tu camino en 2028' },
  { id:'2029', label:'2029', title:'Tu camino en 2029' },
  { id:'2030', label:'2030', title:'Tu camino en 2030' }
];

const themes = {
  Fuego: {
    openings:['Tu impulso natural encuentra una dirección más precisa','Una chispa inesperada despierta tu valentía serena','El cielo favorece una decisión que venías postergando','Una señal de fuego te invita a moverte antes de pensarlo dos veces','Tu entusiasmo se vuelve contagioso y abre una puerta cerrada','Algo que creías perdido regresa con nueva energía','Una idea audaz encuentra por fin el momento de manifestarse','Tu carácter decidido marca el ritmo de la jornada'],
    gifts:['la iniciativa','tu capacidad de inspirar','una confianza renovada','el coraje para empezar de nuevo','tu energía contagiosa','la valentía de decir lo que piensas','un entusiasmo que mueve montañas','tu instinto de liderazgo'],
    cautions:['no confundas rapidez con claridad','deja espacio para escuchar antes de responder','administra tu energía sin apagarla','evita imponer tu ritmo a quienes te rodean','cuida que el entusiasmo no se convierta en impaciencia','no todas las batallas merecen tu fuego','respira antes de reaccionar','deja que otros también brillen']
  },
  Tierra: {
    openings:['Lo que has cultivado en silencio comienza a mostrar raíces firmes','Una certeza práctica ordena el paisaje frente a ti','El ritmo pausado será tu ventaja secreta','Un compromiso sostenido empieza a dar frutos visibles','La paciencia que otros confunden con lentitud hoy se vuelve fortaleza','Un detalle concreto revela el siguiente paso lógico','Tu sentido común corrige un rumbo que se había desviado','Algo tangible por fin toma forma después de mucho trabajo'],
    gifts:['la constancia','tu mirada realista','el talento para convertir ideas en algo tangible','la paciencia que construye resultados','tu sentido práctico','la capacidad de sostener lo que empiezas','un instinto para lo que realmente importa','tu firmeza tranquila'],
    cautions:['permite que el plan respire','no cargues con tareas que no te corresponden','acepta un pequeño cambio de ruta','evita aferrarte a lo conocido por miedo al cambio','no confundas control con seguridad','date permiso para improvisar','cuida no volverte rígido ante lo inesperado','comparte la carga con quien esté dispuesto a ayudar']
  },
  Aire: {
    openings:['Una conversación abre una ventana donde antes había dudas','Tus ideas se conectan con una claridad poco habitual','Una señal sutil cambia tu manera de nombrar lo que deseas','Un mensaje inesperado reordena tus prioridades','Tu curiosidad te lleva a un lugar que no esperabas explorar','Una red de contactos se activa a tu favor','Las palabras correctas llegan justo cuando las necesitas','Una nueva perspectiva disuelve un conflicto que parecía complicado'],
    gifts:['la curiosidad','tu don para tender puentes','una perspectiva ligera y lúcida','la facilidad para encontrar palabras precisas','tu ingenio para resolver lo complicado','una mente abierta a nuevas ideas','el talento para conectar personas','tu capacidad de adaptarte rápido'],
    cautions:['elige una idea antes de perseguir la siguiente','escucha también lo que no se dice','protege tus momentos de silencio','no dejes que la dispersión te aleje de lo esencial','evita prometer más de lo que puedes cumplir','cuida no perderte en detalles secundarios','no todo merece una respuesta inmediata','dale profundidad a lo que empiezas']
  },
  Agua: {
    openings:['Tu intuición reconoce una verdad antes de que lleguen las palabras','Una emoción antigua pierde peso y deja espacio a lo nuevo','El mundo interior te entrega una brújula delicada','Un recuerdo resurge para enseñarte algo que necesitabas ver','Tu sensibilidad capta lo que otros pasan por alto','Una lágrima o una sonrisa inesperada marca un antes y un después','El silencio de hoy dice más que cualquier palabra','Una conexión profunda se fortalece sin necesidad de explicaciones'],
    gifts:['la sensibilidad','tu profunda intuición','la capacidad de cuidar sin perderte','una empatía que sana','tu memoria emocional','la habilidad de leer lo que no se dice','un corazón generoso','tu capacidad de sanar heridas antiguas'],
    cautions:['distingue empatía de responsabilidad','pon nombre a lo que necesitas','no conviertas una impresión en una certeza','evita cargar con emociones que no son tuyas','cuida no anticiparte a un dolor que aún no llega','permite que otros también te sostengan','no te escondas detrás de la sensibilidad','da tiempo a que las emociones se asienten']
  }
};

const scopes = {
  hoy:['Durante el día, un gesto pequeño tendrá más significado del que aparenta. Atiende a la primera sensación, pero confirma los detalles antes de actuar.','La jornada te pide presencia en lo cotidiano. Una tarea sencilla puede convertirse en el punto de apoyo que necesitabas para recuperar el enfoque.','Hoy conviene avanzar con intención, no con prisa. Una coincidencia al final de la tarde iluminará una elección cercana.','Una noticia breve cambia el tono de tu tarde; recíbela sin apresurar conclusiones.','El día trae una oportunidad de corregir un malentendido con una palabra sincera.','Una tarea que evitabas se vuelve más simple de lo que imaginabas al empezarla.','La energía del día favorece cerrar un ciclo pequeño antes de abrir uno nuevo.','Un encuentro casual deja una idea que madurará en los próximos días.','Hoy es buen momento para pedir ayuda en algo que llevabas cargando solo.','Una decisión aplazada encuentra hoy el contexto adecuado para resolverse.'],
  manana:['Mañana llegará con una energía de ajuste amable. Cambiar una prioridad liberará tiempo para una conversación o encuentro valioso.','El nuevo día traerá una oportunidad discreta: reconocerla dependerá de que no llenes cada pausa. Deja una puerta abierta a lo espontáneo.','Mañana, una respuesta que parecía lejana puede aparecer de forma indirecta. Recíbela con curiosidad y decide cuando la emoción se haya asentado.','Mañana un cambio de planes terminará siendo una mejora, aunque al principio incomode.','El amanecer trae claridad sobre algo que hoy todavía parece confuso.','Mañana conviene moverte con calma: la prisa podría hacerte pasar por alto un detalle clave.','Una persona cercana buscará tu consejo; tu honestidad será más valiosa que la comodidad.','Mañana se abre una ventana breve para negociar algo que parecía cerrado.','El día siguiente favorece los comienzos discretos: no necesitas anunciar cada paso.','Mañana, una duda se resuelve en cuanto decides actuar en lugar de seguir pensándola.'],
  semana:['Esta semana se dibuja como un puente entre una costumbre que ya cumplió su función y una posibilidad todavía sin nombre. A mitad del recorrido, una alianza sincera te ayudará a ordenar prioridades.','Los próximos siete días premian la continuidad. Habrá dos ritmos: uno social y luminoso, otro íntimo y reflexivo. Respetar ambos evitará que llegues al final con la energía dispersa.','La semana propone simplificar antes de expandir. Una conversación pendiente encontrará su momento natural, y el fin de semana traerá una señal concreta de progreso.','Esta semana alterna momentos de mucha actividad con pausas necesarias; no te resistas a ninguno.','Una noticia a mitad de semana reordena tus planes de forma favorable.','Los próximos días piden más escucha que discurso, sobre todo en el entorno cercano.','Esta semana un pequeño esfuerzo constante rinde más que un gran impulso aislado.','El fin de semana trae la posibilidad de reconectar con algo o alguien que habías dejado de lado.','Una tensión que arrastrabas desde días atrás encuentra alivio a mitad de semana.','Estos siete días son buenos para poner límites amables donde antes solo había silencio.'],
  mes:['El mes abre un ciclo de depuración y crecimiento. Las primeras semanas invitan a revisar acuerdos; después, el terreno se vuelve fértil para una propuesta creativa o un movimiento profesional.','Este mes, la abundancia aparecerá como espacio, tiempo y vínculos fiables antes que como resultados inmediatos. Cuida esas bases: serán la arquitectura de una oportunidad duradera.','Un tema que se repite desde hace meses cambia de tono. Al elegir desde la calma, recuperarás margen para un proyecto personal que merece una estructura nueva.','Este mes trae una revisión de compromisos: algunos se fortalecen, otros piden dejarse ir con gratitud.','El mes favorece iniciar algo que llevas tiempo posponiendo, aunque los primeros pasos sean modestos.','Una conversación pendiente encuentra su momento natural dentro de las próximas semanas.','Este mes, cuidar tu energía será más importante que sumar más actividades a tu agenda.','Un vínculo cercano se vuelve más honesto y, por eso, más valioso.','El mes trae señales claras sobre qué proyecto merece tu atención principal.','Hacia el final del mes, un esfuerzo silencioso empieza a dar resultados visibles.']
};

const yearlyTexts = {
  Fuego:{
    '2027':'En 2027 atravesarás un ciclo de autoría personal. El primer tramo del año favorecerá aprendizajes y nuevas redes; hacia mitad de año, una elección definirá qué compromisos merecen crecer. El cierre traerá estabilidad nacida de decisiones auténticas, no de expectativas ajenas.',
    '2028':'2028 trae un impulso de reinvención. La primera mitad del año pone a prueba tu paciencia con procesos lentos; hacia el segundo semestre, una oportunidad audaz recompensa la persistencia. El cierre del año celebra un logro construido con constancia, no solo con impulso.',
    '2029':'2029 pide dirección más que velocidad. Un objetivo claro definido a inicios de año guía tus decisiones hasta el verano; el segundo semestre trae reconocimiento por un esfuerzo sostenido que muchos no vieron construirse.',
    '2030':'2030 corona un ciclo de varios años de esfuerzo con una etapa de visibilidad y reconocimiento. La primera mitad del año exige mantener el enfoque; la segunda te permite disfrutar, por fin, de lo construido.'
  },
  Tierra:{
    '2027':'2027 te invita a construir sobre bases reales. Los primeros meses piden ordenar recursos y acuerdos; a mitad de año, un esfuerzo sostenido se traduce en resultados tangibles. El cierre del año consolida un proyecto que llevabas tiempo cultivando en silencio.',
    '2028':'2028 es un año de expansión cuidadosa. Los primeros meses consolidan lo construido en 2027; entre mayo y septiembre aparece una oportunidad de crecimiento que exige salir un poco de la zona conocida. El año cierra con una base más sólida que nunca.',
    '2029':'2029 es un año de cosecha. Proyectos iniciados años atrás muestran resultados concretos; la clave estará en no aferrarte a lo que ya cumplió su función, para dejar espacio a lo nuevo que llega en el último tramo del año.',
    '2030':'2030 marca el cierre de un ciclo largo de construcción. Lo que sembraste con paciencia en años anteriores llega a un punto de estabilidad notable, abriendo paso a un nuevo proyecto que comenzará a insinuarse hacia el final del año.'
  },
  Aire:{
    '2027':'2027 será un año de conexiones que abren puertas inesperadas. Entre marzo y junio florecen colaboraciones y aprendizajes nuevos; el segundo semestre pide elegir con quién realmente vale la pena caminar. El cierre trae una comunicación más clara contigo mismo.',
    '2028':'2028 multiplica tus contactos y posibilidades, aunque también tu agenda. La clave del año está en elegir calidad sobre cantidad en vínculos y proyectos. Hacia el final, una idea que parecía dispersa encuentra por fin una forma concreta.',
    '2029':'2029 trae claridad sobre tu propio rumbo, después de varios años explorando posibilidades. Una decisión importante alrededor de mitad de año simplifica tu vida; el cierre del año se siente más ligero y coherente que los anteriores.',
    '2030':'2030 te encuentra con una red de vínculos y conocimientos mucho más amplia que la de hace unos años. El reto será usar esa red con propósito, no solo con entusiasmo. El cierre del año trae una idea que definirá el siguiente ciclo.'
  },
  Agua:{
    '2027':'En 2027 tu mundo interior pide y obtiene más espacio. La primera mitad del año remueve emociones que necesitaban salir; después, una calma más madura permite relaciones y decisiones desde la serenidad, no desde el miedo.',
    '2028':'2028 profundiza tu conexión con lo que realmente sientes. La primera mitad del año revela patrones emocionales que se repiten; reconocerlos permite, en el segundo semestre, construir relaciones más sanas y decisiones tomadas desde la calma.',
    '2029':'2029 consolida la madurez emocional que has ido construyendo. Vínculos superficiales se alejan de forma natural, mientras los que sí importan se profundizan. El año cierra con una sensación de paz poco habitual.',
    '2030':'2030 completa un largo proceso de autoconocimiento. Emociones que en años anteriores resultaban confusas ahora se entienden con claridad. El año cierra con una intimidad más profunda contigo mismo y con quienes eliges tener cerca.'
  }
};

const insightSets = {
  hoy:[['Vínculos','Una escucha sin interrupciones acerca posturas.'],['Energía','Más estable al caer la tarde.'],['Clave','Responde desde la calma, no desde el reflejo.']],
  manana:[['Oportunidad','Aparece en una conversación casual.'],['Ritmo','Empieza despacio y gana altura.'],['Clave','Deja margen para cambiar de idea.']],
  semana:[['Vínculos','Una alianza gana claridad.'],['Impulso','Martes y viernes concentran energía.'],['Clave','Prioriza lo que también te nutre.']],
  mes:[['Expansión','Un proyecto pide estructura.'],['Bienestar','El descanso mejora tus decisiones.'],['Clave','Sostén lo simple antes de sumar.']],
  '2027':[['Evolución','Tu voz gana autoridad y matices.'],['Ciclo fértil','De marzo a julio.'],['Clave anual','Construye una vida que se parezca a ti.']],
  '2028':[['Evolución','Aprendes a elegir mejor tus batallas.'],['Ciclo fértil','De mayo a septiembre.'],['Clave anual','La calidad importa más que la cantidad.']],
  '2029':[['Evolución','Cosechas lo que sostuviste con paciencia.'],['Ciclo fértil','Primer semestre.'],['Clave anual','Suelta lo que ya cumplió su función.']],
  '2030':[['Evolución','Cierras un ciclo largo con claridad.'],['Ciclo fértil','Segundo semestre.'],['Clave anual','Disfruta lo construido, no solo lo persigas.']]
};

let state = { sign: signs[7], category: categories[0], variant: 0, muted: true };
const music = (function(){try{var t=window.top;if(t!==window&&t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3');
music.loop = true; music.volume = 0.16;
const signSfx = PMS('assets/audio/seleccion-astral.mp3'); signSfx.volume = 0.42;
const revealSfx = PMS('assets/audio/revelacion-suave.mp3'); revealSfx.volume = 0.32;

function hash(str) { let h=2166136261; for(const c of str){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); } return Math.abs(h); }

function isoWeek(d){
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(),0,1));
  return Math.ceil((((t - yearStart) / 86400000) + 1) / 7);
}

function periodSeed(){
  const d = new Date();
  const id = state.category.id;
  if(id==='hoy') return d.toDateString();
  if(id==='manana'){ const t=new Date(d); t.setDate(t.getDate()+1); return t.toDateString(); }
  if(id==='semana') return `W${isoWeek(d)}-${d.getFullYear()}`;
  if(id==='mes') return `M${d.getMonth()}-${d.getFullYear()}`;
  return id;
}

function pick(arr, salt='') { return arr[hash(`${state.sign.name}${state.category.id}${periodSeed()}${state.variant}${salt}`)%arr.length]; }
function play(audio){ if(state.muted) return; audio.currentTime=0; audio.play().catch(()=>{}); }
function currentDateLabel(){
  const d=new Date();
  if(state.category.id==='manana') d.setDate(d.getDate()+1);
  if(['2027','2028','2029','2030'].includes(state.category.id)) return `PANORAMA ANUAL · ${state.category.id}`;
  if(state.category.id==='semana') return `SEMANA ${isoWeek(d)} · ${d.getFullYear()}`;
  if(state.category.id==='mes') return d.toLocaleDateString('es-ES',{month:'long',year:'numeric'}).toUpperCase();
  return d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}).toUpperCase();
}
function generateReading(){
  if(['2027','2028','2029','2030'].includes(state.category.id)){
    return yearlyTexts[state.sign.element][state.category.id];
  }
  const t=themes[state.sign.element];
  return `${pick(t.openings,'open')}. ${pick(scopes[state.category.id],'scope')} Confía en ${pick(t.gifts,'gift')}, aunque recuerda: ${pick(t.cautions,'caution')}.`;
}

const container=document.querySelector('#game-container');
container.innerHTML=`
  <div class="app-label">HORÓSCOPO</div>
  <div class="stars" aria-hidden="true"></div>
  <div class="app">
    <aside class="sidebar">
      <h2 class="choose-title">Elige tu signo</h2>
      <p class="choose-copy">Selecciona tu constelación para abrir una lectura creada especialmente para este momento.</p>
      <div class="sign-grid" role="list" aria-label="Signos del zodiaco"></div>
    </aside>
    <main class="main">
      <div class="topbar"><button class="icon-btn" id="sound" aria-label="Activar sonido" title="Activar sonido">♪</button></div>
      <section class="reading" aria-live="polite">
        <div class="selection-label">Lectura astral</div>
        <div class="hero-line"><div class="hero-glyph"></div><div class="title-wrap"><h2></h2><div class="meta"></div></div></div>
        <nav class="tabs" aria-label="Periodos del horóscopo"></nav>
        <article class="oracle"></article>
      </section>
    </main>
  </div>`;

const starsEl=container.querySelector('.stars');
for(let i=0;i<34;i++){ const s=document.createElement('i'); s.className='star'; s.style.cssText=`left:${(i*37)%99}%;top:${(i*61)%97}%;--d:${2+(i%5)}s;animation-delay:-${i%4}s`; starsEl.appendChild(s); }

function renderSigns(){
  const grid=container.querySelector('.sign-grid');
  grid.innerHTML=signs.map(s=>`<button class="sign-card ${s.name===state.sign.name?'active':''}" data-sign="${s.name}" role="listitem" aria-pressed="${s.name===state.sign.name}"><span class="glyph">${s.glyph}</span><span class="sign-name">${s.name}</span></button>`).join('');
  grid.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
    state.sign=signs.find(s=>s.name===btn.dataset.sign); state.variant=0; play(signSfx); renderSigns(); renderReading(true);
    window.ProgressLogger?.logProgress('sign_selected',{sign:state.sign.name});
  }));
}

function renderTabs(){
  const tabs=container.querySelector('.tabs');
  tabs.innerHTML=categories.map(c=>`<button class="tab ${c.id===state.category.id?'active':''}" data-category="${c.id}" aria-pressed="${c.id===state.category.id}">${c.label}</button>`).join('');
  tabs.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
    state.category=categories.find(c=>c.id===btn.dataset.category); state.variant=0; play(revealSfx); renderTabs(); renderReading(true);
    window.ProgressLogger?.logProgress('reading_opened',{sign:state.sign.name,period:state.category.id});
  }));
}

function renderReading(animate=false){
  container.querySelector('.hero-glyph').textContent=state.sign.glyph;
  container.querySelector('.title-wrap h2').textContent=state.sign.name;
  container.querySelector('.meta').textContent=`${state.sign.dates}  ·  ELEMENTO ${state.sign.element.toUpperCase()}`;
  const oracle=container.querySelector('.oracle');
  oracle.classList.remove('reveal');
  const isYearly=['2027','2028','2029','2030'].includes(state.category.id);
  oracle.innerHTML=`
    <div class="oracle-head"><h3>${state.category.title}</h3><span class="date">${currentDateLabel()}</span></div>
    <p class="prediction">${generateReading()}</p>
    <div class="insights">${insightSets[state.category.id].map(([k,v])=>`<div class="insight"><b>${k}</b><span>${v}</span></div>`).join('')}</div>
    <div class="actions">${isYearly?'':'<button class="regenerate">✦ &nbsp; Nueva interpretación</button>'}<span class="original">LECTURA ORIGINAL · ORÁCULO CELESTE</span></div>`;
  const regen=oracle.querySelector('.regenerate');
  if(regen) regen.addEventListener('click',()=>{ state.variant++; play(revealSfx); renderReading(true); });
  if(animate) requestAnimationFrame(()=>oracle.classList.add('reveal'));
}

container.querySelector('#sound').addEventListener('click',async()=>{
  state.muted=!state.muted;
  const b=container.querySelector('#sound');
  b.textContent=state.muted?'♪':'♫'; b.title=state.muted?'Activar sonido':'Silenciar'; b.setAttribute('aria-label',b.title);
  if(state.muted) music.pause(); else { await music.play().catch(()=>{}); play(revealSfx); }
});

renderSigns(); renderTabs(); renderReading();
window.ProgressLogger?.logProgress('app_ready',{defaultSign:state.sign.name});

// Evita que el gesto/botón "atrás" del navegador saque de la app: primero regresa a la pantalla principal de la app.
(function(){
  window.history.pushState({app:true},'',location.href);
  window.addEventListener('popstate',function(){
    window.history.pushState({app:true},'',location.href);
    renderSigns(); renderTabs(); renderReading();
  });
})();

/* PM-DEEPLINK */
(function(){var id=decodeURIComponent((location.hash||'').slice(1));if(!id||!/^[\w-]+$/.test(id))return;var n=0;(function go(){var b=document.querySelector('.tab[data-category="%s"]'.replace('%s',id));if(b){b.click();setTimeout(function(){try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();window.scrollTo(0,0);if(window.parent!==window)window.parent.scrollTo(0,0);}catch(e){}},350);return;}if(++n<50)setTimeout(go,100);})();})();
