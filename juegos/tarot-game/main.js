function PMS(r){try{var t=window.top;if(t!==window&&t.PortalMusic&&t.PortalMusic.sfx)return t.PortalMusic.sfx(new URL(r,location.href).href);}catch(e){}return new Audio(r);}
import { additionalCards } from './generated-cards.js?v=4';
import { enrich } from './tarot-extra.js?v=4';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const readingTypes = {
  daily: {
    id: 'daily',
    name: 'Tarot del Día',
    description: 'Una carta para escuchar el tono y la energía de tu día.',
    count: 1,
    image: 'assets/tarot-the-sun.webp',
    positions: [{ label: 'Tu carta de hoy', sub: '' }]
  },
  pastPresentFuture: {
    id: 'pastPresentFuture',
    name: 'Pasado, Presente y Futuro',
    description: 'La tirada clásica de tres cartas para comprender tu recorrido y su próxima posibilidad.',
    count: 3,
    image: 'assets/tarot-the-hermit.webp',
    positions: [
      { label: 'Pasado', sub: 'La raíz' },
      { label: 'Presente', sub: 'El umbral' },
      { label: 'Futuro', sub: 'La posibilidad' }
    ]
  },
  love: {
    id: 'love',
    name: 'Tarot del Amor',
    description: 'Tres miradas para comprender tu situación, el encuentro y su camino.',
    count: 3,
    image: 'assets/tarot-the-moon.webp',
    positions: [
      { label: 'Tú', sub: 'Tu situación' },
      { label: 'La otra persona', sub: 'Su energía' },
      { label: 'El camino', sub: 'Hacia dónde va' }
    ]
  }
};

let currentType = readingTypes.daily;
let positions = currentType.positions;

const arcana = [
  {
    name: 'La Estrella',
    image: 'assets/tarot-the-star.webp',
    meaning: 'La Estrella anuncia esperanza, inspiración y una recuperación profunda de la confianza. Después de una etapa exigente, vuelve a aparecer una dirección que se siente auténtica. No promete resultados instantáneos: te recuerda que la fe se vuelve poderosa cuando la acompañas con gestos pequeños, paciencia y una disposición sincera a recibir ayuda. Waite la lee como pérdida, robo, privación o abandono; otra lectura habla de esperanza y buenas perspectivas.',
    history: 'La Estrella representa la calma que llega después de la tormenta: una figura vierte agua bajo un cielo abierto, recordando que la confianza también puede ser una forma de orientación. En la tradición del Tarot, su desnudez simboliza verdad y vulnerabilidad, mientras las aguas que alimenta hablan de sanar lo interior y lo exterior.',
    meanings: {
      daily: 'Tu día trae una señal de alivio, renovación y claridad emocional. Puede surgir una conversación amable, una idea inspiradora o una sensación de volver a respirar con más espacio. No dejes que la ilusión se quede en pensamiento: elige un gesto concreto para cuidar aquello que te devuelve esperanza y permite que tu sensibilidad te muestre por dónde empezar.',
      weekly: 'La semana se abre con una dirección luminosa y una energía favorable para recuperar confianza. Algo que parecía lejano puede comenzar a tomar forma si lo sostienes con constancia, sin exigir una respuesta inmediata. Escucha las ideas que regresan una y otra vez, comparte tu visión con personas afines y deja que la paciencia convierta inspiración en avance real.',
      pastPresentFuture: 'En el pasado, esta carta habla de una esperanza que te sostuvo o de una herida que aprendiste a sanar; en el presente, señala una inspiración que vuelve a encenderse; y hacia el futuro, muestra una posibilidad luminosa que crece lentamente. Tu tarea es proteger esa visión sin idealizarla y darle una forma posible con acciones sostenidas.',
      love: 'En el amor, la sinceridad, la ternura y la vulnerabilidad pueden reparar distancias. Esta carta favorece un vínculo donde ambas personas pueden mostrarse sin actuar desde el miedo ni la exigencia. Si estás buscando una relación, permite que tu autenticidad atraiga un encuentro más sano; si ya existe un vínculo, cuida la esperanza con hechos y conversaciones transparentes.',
      friendship: 'En la amistad, un gesto transparente puede devolver confianza y recordar por qué el vínculo importa. Comparte lo que valoras, reconoce aquello que te ha sostenido y evita esconder tus necesidades detrás de una falsa autosuficiencia. La cercanía volverá de forma natural cuando exista espacio para la alegría, la honestidad y el cuidado recíproco.',
      work: 'En el trabajo, una visión clara puede convertirse en una oportunidad valiosa, especialmente si la presentas con sencillez y propósito. Tu creatividad merece ser escuchada, pero necesitará un plan que la sostenga. Confía en tu capacidad, busca alianzas con personas que comprendan tu enfoque y avanza paso a paso, sin medir tu progreso únicamente por la rapidez.'
    }
  },
  {
    name: 'La Luna',
    image: 'assets/tarot-the-moon.webp',
    meaning: 'La Luna habla de intuición, sueños, emociones profundas y caminos que todavía no muestran todos sus detalles. Lo invisible también comunica, pero no todo presentimiento es una certeza. Esta carta te invita a atravesar la incertidumbre con sensibilidad, comprobar los hechos y dar tiempo a la verdad para que aparezca sin forzarla. Waite la asocia con enemigos ocultos, peligro, calumnia, oscuridad, terror, engaño, fuerzas ocultas y error.',
    history: 'La Luna abre un paisaje de intuición, reflejos y caminos ambiguos. Su luz no elimina las sombras: enseña a caminar con sensibilidad hasta reconocer la verdad. Las criaturas que responden a su llamada y el sendero que se pierde en la distancia recuerdan que el subconsciente puede señalar algo importante, aunque todavía necesite interpretación y cuidado.',
    meanings: {
      daily: 'Tu sensibilidad estará especialmente despierta y podrías percibir matices que normalmente pasan desapercibidos. Observa tus emociones con respeto, pero no conviertas cada presentimiento en una conclusión definitiva. Antes de reaccionar, respira, pregunta y espera una señal más clara; lo que hoy parece confuso puede revelarse distinto cuando descanses o lo mires desde otra perspectiva.',
      weekly: 'La semana puede traer señales mezcladas, cambios de ánimo o información incompleta. Revisa los datos importantes, escucha tu intuición y evita apresurar una conclusión solo para sentir control. Es un buen momento para investigar, escribir lo que sabes y separar los hechos de tus temores; la claridad llegará cuando dejes de alimentar historias sin confirmación.',
      pastPresentFuture: 'En el pasado, pudo haber dudas, secretos o caminos poco claros que dejaron una huella emocional; el presente pide observar sin suponer y reconocer qué miedo está influyendo; el futuro se aclara cuando permites que la verdad madure. No necesitas resolver todo de una vez: avanza con prudencia, verifica y confía en lo que se vuelve coherente.',
      love: 'En el amor hay emociones profundas que todavía no encuentran palabras, y quizá una de las dos personas esté interpretando silencios desde la inseguridad. Pregunta con suavidad, expresa lo que necesitas y no llenes los espacios vacíos con suposiciones. La carta no niega el sentimiento: pide distinguir entre una intuición verdadera, un temor antiguo y una promesa que aún no tiene hechos.',
      friendship: 'En la amistad conviene distinguir una percepción de un hecho antes de tomar distancia o exigir explicaciones. Habla desde lo que sientes, escucha la versión de la otra persona y evita repetir rumores. Un vínculo honesto puede atravesar la incomodidad si ambas partes se dan tiempo para aclarar el malentendido sin convertirlo en una sentencia.',
      work: 'En el trabajo, una situación poco definida pide investigación y atención a los detalles. No decidas desde el rumor ni prometas más de lo que puedes comprobar: reúne datos, pregunta por escrito cuando sea necesario y revisa tus supuestos. Tu intuición será útil como alarma, pero la decisión final debe apoyarse en evidencias y en una estrategia clara.'
    }
  },
  {
    name: 'El Sol',
    image: 'assets/tarot-the-sun.webp',
    meaning: 'El Sol ilumina la verdad, la vitalidad, la alegría compartida y la confianza en la propia capacidad. Trae una energía de apertura en la que las cosas pueden nombrarse sin disfraces y disfrutarse sin culpa. Su mensaje no es ocultar las dificultades, sino enfrentarlas con claridad, generosidad y la certeza de que la vida también puede ser sencilla.',
    history: 'El Sol celebra la vida visible, la alegría compartida y la verdad sin disfraces. Su luz recuerda que crecer también puede sentirse cálido, sencillo y pleno. La imagen solar se relaciona con conciencia, vitalidad y reconocimiento: después de atravesar sombras, aquello que estaba escondido puede mostrarse con una claridad que permite avanzar sin tantas defensas.',
    meanings: {
      daily: 'Tu día favorece la claridad, la energía y los encuentros que te devuelven entusiasmo. Haz visible lo que te importa, celebra un avance concreto y permite que tu buen ánimo contagie sin convertirlo en una obligación. Si aparece un problema, míralo de frente: tendrás mejores resultados al hablar con honestidad que al complicar lo que puede resolverse con sencillez.',
      weekly: 'La semana tiene un centro fértil, expansivo y favorable para comunicarte. Tus esfuerzos pueden recibir reconocimiento, especialmente cuando compartes el mérito y haces accesible tu manera de pensar. Celebra los avances sin perder perspectiva, organiza tu energía y úsala para simplificar lo que parecía complicado; la alegría será más duradera si también incluye descanso y gratitud.',
      pastPresentFuture: 'El pasado te dejó una verdad importante, una alegría o una experiencia que te enseñó a confiar en tu fuerza; el presente ilumina lo que realmente quieres; y el futuro promete expansión si te muestras con claridad. La carta te pide no esconder tus talentos: el camino se abre cuando dejas de pedir permiso para ocupar tu lugar.',
      love: 'En el amor, la honestidad puede abrir una etapa alegre, cálida y más libre de interpretaciones. Disfruta la presencia mutua, expresa afecto con naturalidad y permite que el vínculo tenga momentos de juego. Si existe una conversación pendiente, la luz del Sol favorece decir la verdad sin castigo ni dramatismo, recordando que una relación sana también debe sentirse viva.',
      friendship: 'En la amistad, la alegría compartida fortalece el vínculo y hace visible el cariño que a veces se da por supuesto. Busca un encuentro real, celebra a la otra persona y reconoce su presencia en tu vida. Esta carta también invita a reparar con franqueza: un mensaje claro y afectuoso puede devolver calidez a una relación que se había vuelto distante.',
      work: 'En el trabajo, mostrar tus capacidades con naturalidad puede traer reconocimiento, visibilidad y nuevas responsabilidades. Colabora, celebra los logros del equipo y lidera desde la transparencia en lugar de competir desde el miedo. Es un momento fértil para presentar proyectos, pedir claridad sobre tu crecimiento y convertir una buena idea en un resultado que todos puedan ver.'
    }
  },
  {
    name: 'El Ermitaño',
    image: 'assets/tarot-the-hermit.webp',
    meaning: 'El Ermitaño invita al silencio fértil, la introspección y la búsqueda de una verdad propia. La respuesta no llegará por acumular más opiniones, sino por separar el ruido de lo esencial. Su soledad no es aislamiento ni castigo: es un espacio consciente para madurar una decisión, recuperar perspectiva y caminar con una luz interior que no depende de la aprobación externa. Waite la lee como prudencia y circunspección, y advierte también de traición, disimulo y corrupción.',
    history: 'El Ermitaño avanza con una lámpara en la noche. Su sabiduría no nace de aislarse, sino de tomarse el tiempo necesario para escuchar una verdad propia. La lámpara ilumina solo el siguiente tramo del camino: una imagen de paciencia, experiencia y discernimiento que recuerda que no hace falta conocer todo el futuro para dar el próximo paso con dignidad.',
    meanings: {
      daily: 'Tu día pide bajar el ruido y recuperar un ritmo más íntimo. Una pausa breve, sin pantallas ni opiniones ajenas, puede devolverte la perspectiva que necesitas para distinguir deseo de presión. No confundas lentitud con fracaso: hoy una observación honesta, una lectura tranquila o una conversación con alguien sabio puede valer más que diez respuestas impulsivas.',
      weekly: 'La semana te invita a elegir calidad antes que velocidad. Reserva tiempo para pensar, ordenar prioridades y revisar qué compromisos siguen teniendo sentido. Puede ser necesario poner un límite a la disponibilidad constante o pedir consejo a alguien con experiencia. Avanzar con una intención más consciente te permitirá llegar más lejos que intentar responder a todo al mismo tiempo.',
      pastPresentFuture: 'El pasado te enseñó a buscar respuestas dentro y a aprender de períodos de distancia; el presente pide una pausa consciente para escuchar lo que realmente sabes; y el futuro se revela paso a paso cuando sigues tu propia luz. No fuerces una definición inmediata: la comprensión que estás construyendo será más sólida porque nace de experiencia, reflexión y honestidad.',
      love: 'En el amor, un espacio de reflexión puede ser más útil que una reacción inmediata. Escucha tus necesidades antes de pedirle respuestas al vínculo y pregúntate qué parte de tu deseo nace del cariño y cuál del miedo a estar solo. La carta favorece una conversación serena y madura, pero también recuerda que retirarse demasiado puede convertirse en una forma de no dejarse conocer.',
      friendship: 'En la amistad, respetar los ritmos protege la confianza. Tómate un momento para entender qué quieres ofrecer antes de buscar una conversación y explica tu silencio para que no se transforme en distancia inexplicable. Un amigo puede necesitar tu presencia sencilla, no una solución perfecta; estar disponible con honestidad será más valioso que decir mucho.',
      work: 'En el trabajo, la concentración, la experiencia acumulada y la investigación son tus mejores recursos. Revisa el plan en silencio, identifica el problema de fondo y vuelve con una propuesta madura, aunque todavía no sea espectacular. Evita decidir por presión del grupo: un período breve de estudio puede darte la autoridad tranquila que necesitas para defender una mejor solución.'
    }
  },
  {
    name: 'La Rueda',
    image: 'assets/tarot-wheel-fortune.webp',
    meaning: 'La Rueda anuncia movimiento, cambios de ciclo y oportunidades que aparecen cuando una etapa deja de ser estática. Recuerda que no todo está bajo tu control, pero sí puedes elegir cómo responder al giro. Aceptar el cambio no significa renunciar a tu voluntad: significa reconocer el momento, aprender de lo que sucede y aprovechar la dirección que se abre.',
    history: 'La Rueda habla del movimiento de los ciclos y de las oportunidades que aparecen cuando una etapa cambia. Nada permanece inmóvil para siempre. Su giro recuerda la alternancia entre ascensos y descensos, fortuna y aprendizaje: la clave no es aferrarse a una posición, sino desarrollar la presencia necesaria para actuar cuando el movimiento te ofrece una nueva posibilidad.',
    meanings: {
      daily: 'Algo puede cambiar de ritmo durante el día: una noticia, una coincidencia o una modificación de planes puede alterar tu agenda. Mantente flexible sin perder tu centro; la variación inesperada podría abrir una puerta que no estabas buscando. Antes de resistirte, pregunta qué recurso, encuentro o aprendizaje queda disponible gracias a ese giro.',
      weekly: 'La semana se mueve y puede modificar tus planes, prioridades o expectativas. Adáptate sin interpretar cada cambio como una pérdida: el giro también puede liberarte de una estructura que ya no funcionaba. Prepara alternativas, conserva lo esencial y mantente atento a las oportunidades que aparecen precisamente porque el escenario dejó de ser previsible.',
      pastPresentFuture: 'El pasado marca un ciclo que ya cambió y dejó lecciones que ahora puedes usar; el presente está girando y te pide responder con agilidad; el futuro abre una oportunidad cuando aceptas avanzar sin intentar controlar cada detalle. La suerte puede participar, pero tu preparación, tu flexibilidad y la decisión de entrar en movimiento serán igualmente importantes.',
      love: 'En el amor, la relación atraviesa un cambio de etapa y ya no puede sostenerse exactamente como antes. No intentes congelar el momento: conversa sobre lo que ambos necesitan ahora, incluso si la respuesta modifica tus expectativas. Un giro puede acercar, renovar o mostrar una verdad; lo más importante será responder con honestidad en lugar de aferrarte a una versión pasada del vínculo.',
      friendship: 'En la amistad, una nueva dinámica puede renovar el vínculo. Acepta que las personas cambian, que los ritmos pueden separarse durante un tiempo y que la cercanía también puede encontrar formas nuevas. Si aparece una oportunidad de reencontrarse, participa sin exigir que todo sea igual que antes: la amistad crecerá al adaptarse a la realidad presente.',
      work: 'En el trabajo, una oportunidad puede surgir de un cambio de estructura, equipo o prioridades. Prepárate para responder con agilidad y criterio, pero evita moverte por pura ansiedad. Actualiza tus habilidades, pregunta cómo te afecta el nuevo escenario y convierte la incertidumbre en una ventaja: quien entiende el giro antes puede ocupar un lugar decisivo en la siguiente etapa.'
    }
  },
  {
    name: 'La Sacerdotisa',
    image: 'assets/tarot-high-priestess.webp',
    meaning: 'La Sacerdotisa representa intuición, conocimiento profundo y verdades que todavía no están listas para mostrarse por completo. Tu sabiduría interior ya conoce una parte de la respuesta, pero necesita silencio, observación y tiempo para distinguir una señal auténtica de un deseo pasajero. Protege lo que está gestándose: no todo debe anunciarse antes de madurar.',
    history: 'La Sacerdotisa custodia el umbral entre lo visible y lo secreto. Su presencia enseña que esperar, observar y guardar silencio también son actos de poder. Sentada entre dos columnas, representa el equilibrio entre opuestos y la comprensión de los misterios que no se conquistan por fuerza, sino mediante atención, memoria, intuición y respeto por los ritmos ocultos.',
    meanings: {
      daily: 'No todo necesita ser explicado hoy ni compartido con todo el mundo. Guarda un espacio para la intuición, observa qué se repite y escucha las reacciones de tu cuerpo antes de tomar una postura. Una respuesta puede llegar en una conversación aparentemente casual o en un detalle que antes pasabas por alto; permanece receptivo sin buscar señales a la fuerza.',
      weekly: 'La semana contiene una respuesta que se revela de a poco. Confía en la observación, protege tu energía y evita anunciar un proyecto antes de tener claro qué necesita. Es un buen momento para leer, investigar, escuchar y preparar una estrategia en silencio. Cuando llegue el instante de actuar, tendrás más seguridad porque habrás respetado todo lo que aún estaba tomando forma.',
      pastPresentFuture: 'El pasado guarda una enseñanza silenciosa que quizá solo ahora puedes comprender; el presente pide escuchar tu intuición y observar lo que no se dice; el futuro se abre cuando proteges lo que aún está gestándose. No confundas misterio con bloqueo: hay procesos que necesitan reserva para fortalecerse antes de convertirse en una decisión visible.',
      love: 'En el amor, hay una verdad sutil que pide ser escuchada y que puede aparecer en la coherencia entre palabras, gestos y silencios. No fuerces definiciones para calmar la ansiedad: observa, pregunta cuando sea necesario y deja que la confianza se construya con tiempo. La carta también te recuerda guardar tus límites y no revelar más de lo que te hace sentir seguro.',
      friendship: 'En la amistad, la escucha atenta será más valiosa que un consejo rápido. Cuida la confidencialidad, reconoce lo que la otra persona aún no puede nombrar y deja que el vínculo revele su necesidad sin invadirlo. Si percibes una tensión, acércate con tacto: una presencia discreta y constante puede sanar más que una explicación brillante.',
      work: 'En el trabajo, la información que aún no es visible importa. Investiga, escucha las conversaciones entre líneas y guarda tu mejor estrategia hasta que tengas el momento adecuado para compartirla. No se trata de actuar con secretismo, sino de cuidar una idea en desarrollo y tomar decisiones basadas en conocimiento, no en la presión de demostrar que ya tienes todas las respuestas.'
    }
  }
];

arcana.push(...additionalCards);
arcana.forEach(enrich);

const music = (function(){try{var t=window.top;if(t!==window&&t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3');
music.loop = true;
music.volume = 0.22;
const selectSound = PMS('assets/audio/card-selection-chime.mp3');
selectSound.volume = 0.46;
const revealSound = PMS('assets/audio/tarot-reveal-flip.mp3');
revealSound.volume = 0.5;

let muted = false;
let audioUnlocked = false;
let chosen = [];
let busy = false;
let activeIndex = 38;
let stage;
let stageWorld;
let deck;
let cards = [];
let manualLarge = false;

function build() {
  const mount = document.querySelector('#game-container');
  mount.innerHTML = `
    <main id="stage" class="presentation-active" aria-label="Mesa de lectura de Tarot">
      <div id="stage-world">
      <div id="stars"></div><div class="mist m1"></div><div class="mist m2"></div>
      <header><p class="eyebrow">Tarot</p><h1 id="current-reading-name">Tarot</h1><div class="rule"></div></header>
      <section id="presentation-screen" aria-label="Presentación de Tarot">
        <div class="presentation-frame">
          <p class="presentation-badge">El oráculo</p>
          <h2 class="presentation-title">Tarot</h2>
          <p class="presentation-subtitle">Lecturas de Tarot</p>
          <div class="presentation-actions">
            <button id="begin-reading">✦ &nbsp; Comenzar lectura</button>
          </div>
        </div>
      </section>
      <section id="selection-screen" aria-label="Selecciona tu tipo de Tarot">
        <div class="selection-panel">
          <p class="eyebrow">Antes de consultar las cartas</p>
          <h2>¿Qué lectura buscas hoy?</h2>
          <p class="selection-intro">Elige un enfoque para que el oráculo prepare una tirada a tu medida.</p>
          <div class="type-options">${Object.values(readingTypes).map(type => `
            <button type="button" class="type-option" data-type="${type.id}" aria-label="Elegir ${type.name}">
              <span class="type-art" style="background-image:url('${type.image}')"></span>
              <span class="type-option-copy"><strong>${type.name}</strong><small>${type.count} ${type.count === 1 ? 'carta' : 'cartas'}</small><em>${type.description}</em></span>
              <span class="type-arrow">✦</span>
            </button>`).join('')}</div>
        </div>
      </section>
      <section id="table-ui" aria-label="Mesa de lectura">
        <div id="current-type"></div>
        <div id="prompt" aria-live="polite">Elige una carta para descubrir tu <strong>Inicio</strong></div>
        <div id="deck" role="button" tabindex="0" aria-label="Mazo de 78 cartas. Elige una carta"></div>
        <div id="counter">78 CARTAS · 3 ELECCIONES</div>
        <section id="spread" aria-label="Tirada de tres cartas"></section>
        <button id="details-button">✦ &nbsp; Ver detalles</button>
      </section>
      <button id="expand-button" aria-label="Ampliar a pantalla completa" title="Ampliar a pantalla completa">⛶</button>
      <button id="sound-button" aria-label="Silenciar sonido" title="Sonido">♫</button>
      <section id="reading" role="dialog" aria-modal="true" aria-label="Detalles de tu lectura"><div class="reading-panel">
        <p class="eyebrow">Tu mapa interior</p><h2 id="reading-title">Lectura de Tarot</h2><p class="reading-intro" id="reading-intro"></p>
        <div id="special-tools">
          <p class="special-heading">Crear una lectura especial</p>
          <div class="reading-modes" role="tablist" aria-label="Enfoque de lectura">
            <button type="button" class="mode-button selected" data-mode="clarity" role="tab" aria-selected="true">✦ Claridad</button>
            <button type="button" class="mode-button" data-mode="connection" role="tab" aria-selected="false">♡ Vínculos</button>
            <button type="button" class="mode-button" data-mode="purpose" role="tab" aria-selected="false">☾ Propósito</button>
          </div>
          <article class="special-reading" id="special-reading" aria-live="polite"></article>
        </div>
        <div class="reading-grid" id="reading-grid"></div><p class="synthesis" id="synthesis"></p>
        <div class="panel-actions"><button type="button" id="restart">Nueva lectura</button><button type="button" class="secondary" id="choose-type">Elegir otro Tarot</button><button type="button" class="secondary" id="close-reading">Volver a las cartas</button></div>
      </div></section>
      </div>
    </main>`;
  stage = document.querySelector('#stage');
  stageWorld = document.querySelector('#stage-world');
  deck = document.querySelector('#deck');
  renderSpread();
  makeStars();
  makeDeck();
  bindEvents();
  updateTableHeader();
  resize();
  requestAnimationFrame(resize);
}

function makeStars() {
  const field = document.querySelector('#stars');
  const rng = mulberry32(7821);
  for (let i = 0; i < 44; i++) {
    const s = document.createElement('i');
    s.className = 'star';
    s.style.left = `${rng() * 100}%`;
    s.style.top = `${rng() * 72}%`;
    s.style.setProperty('--t', `${1.2 + rng() * 2.8}s`);
    s.style.animationDelay = `${-rng() * 3}s`;
    field.appendChild(s);
  }
}

function makeDeck() {
  cards = [];
  for (let i = 0; i < 78; i++) {
    const card = document.createElement('div');
    card.className = 'deck-card';
    card.dataset.index = i;
    deck.appendChild(card);
    cards.push(card);
  }
  layoutDeck();
  updateActive(activeIndex);
}

function layoutDeck() {
  if (!deck || !cards.length) return;
  const styles = getComputedStyle(cards[0]);
  const cardWidth = parseFloat(styles.width) || 96;
  const cardHeight = parseFloat(styles.height) || 156;
  const portrait = stage?.classList.contains('portrait-layout');
  const fanAngle = portrait ? 58 : 52;
  const pivotX = deck.clientWidth / 2;
  const pivotY = deck.clientHeight - (portrait ? 22 : 16);
  const fanRadius = portrait ? 210 : 90;

  cards.forEach((card, i) => {
    const t = i / 77;
    const angle = -fanAngle + t * fanAngle * 2;
    const radians = angle * Math.PI / 180;
    const bottomX = pivotX + Math.sin(radians) * fanRadius;
    const bottomY = pivotY - Math.cos(radians) * fanRadius;

    // A radial fan: the lower edges follow a hand-held arc and the cards
    // open outward from one low central grip, showing only their backs.
    card.style.left = `${bottomX - cardWidth / 2}px`;
    card.style.top = `${bottomY - cardHeight}px`;
    card.style.zIndex = String(i + 1);
    card.style.transform = `rotate(${angle}deg)`;
  });
}

function bindEvents() {
  document.querySelector('#begin-reading').addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    showTypeSelection(false);
  });
  document.querySelectorAll('.type-option').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      selectReadingType(button.dataset.type);
    });
  });
  bindSelectionScrolling();
  deck.addEventListener('pointermove', e => {
    if (busy || chosen.length >= currentType.count) return;
    updateActive(deckIndexFromPointer(e));
  });
  deck.addEventListener('pointerleave', () => updateActive(38));
  deck.addEventListener('click', e => chooseCard(deckIndexFromPointer(e)));
  deck.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); updateActive(Math.max(0, activeIndex - 1)); }
    if (e.key === 'ArrowRight') { e.preventDefault(); updateActive(Math.min(77, activeIndex + 1)); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chooseCard(activeIndex); }
  });
  document.querySelector('#details-button').addEventListener('click', openReading);
  document.querySelectorAll('.mode-button').forEach(button => {
    button.addEventListener('click', () => renderSpecialReading(button.dataset.mode));
  });
  document.querySelector('#close-reading').addEventListener('click', closeReading);
  document.querySelector('#choose-type').addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    showTypeSelection(true);
  });
  document.querySelector('#restart').addEventListener('click', restart);
  document.querySelector('#sound-button').addEventListener('click', toggleSound);
  document.querySelector('#expand-button').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  window.addEventListener('resize', resize);
  window.visualViewport?.addEventListener('resize', resize);
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
}

function bindSelectionScrolling() {
  const selection = document.querySelector('#selection-screen');
  if (!selection) return;

  let pointerId = null;
  let startY = 0;
  let startScrollTop = 0;
  let dragging = false;

  const endDrag = event => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    dragging = false;
    if (selection.hasPointerCapture?.(event.pointerId)) selection.releasePointerCapture(event.pointerId);
  };

  selection.addEventListener('pointerdown', event => {
    if (!stage?.classList.contains('compact-landscape')) return;
    pointerId = event.pointerId;
    startY = event.clientY;
    startScrollTop = selection.scrollTop;
    dragging = false;
    selection.setPointerCapture?.(event.pointerId);
  }, { passive: true });

  selection.addEventListener('pointermove', event => {
    if (pointerId !== event.pointerId) return;
    const distance = startY - event.clientY;
    if (!dragging && Math.abs(distance) < 5) return;
    dragging = true;
    event.preventDefault();
    selection.scrollTop = Math.max(0, startScrollTop + distance);
  }, { passive: false });

  selection.addEventListener('pointerup', endDrag, { passive: true });
  selection.addEventListener('pointercancel', endDrag, { passive: true });
  selection.addEventListener('wheel', event => {
    if (!stage?.classList.contains('compact-landscape')) return;
    if (selection.scrollHeight <= selection.clientHeight) return;
    event.preventDefault();
    selection.scrollTop += event.deltaY;
  }, { passive: false });

  selection.addEventListener('keydown', event => {
    if (!stage?.classList.contains('compact-landscape')) return;
    if (event.key === 'PageDown' || event.key === 'ArrowDown') {
      event.preventDefault();
      selection.scrollTop += event.key === 'PageDown' ? selection.clientHeight * .82 : 80;
    }
    if (event.key === 'PageUp' || event.key === 'ArrowUp') {
      event.preventDefault();
      selection.scrollTop -= event.key === 'PageUp' ? selection.clientHeight * .82 : 80;
    }
    if (event.key === 'End') {
      event.preventDefault();
      selection.scrollTop = selection.scrollHeight;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      selection.scrollTop = 0;
    }
  });
}

function selectReadingType(id) {
  currentType = readingTypes[id] || readingTypes.daily;
  positions = currentType.positions;
  renderSpread();
  resetBoard();
  setScreen('table');
  requestAnimationFrame(() => deck?.focus({ preventScroll: true }));
}

function showTypeSelection(reset = false) {
  if (!stage) return;
  if (reset) resetBoard();
  const selection = document.querySelector('#selection-screen');
  if (selection) selection.scrollTop = 0;
  setScreen('selection');
  requestAnimationFrame(() => document.querySelector('.type-option')?.focus({ preventScroll: true }));
}

function closeReading() {
  setScreen('table');
  requestAnimationFrame(() => deck?.focus({ preventScroll: true }));
}

function setScreen(screen) {
  if (!stage) return;
  const reading = document.querySelector('#reading');
  const selection = document.querySelector('#selection-screen');
  stage.classList.remove('presentation-active', 'selection-active');
  reading?.classList.remove('open');

  if (selection) {
    selection.style.removeProperty('z-index');
    selection.style.removeProperty('opacity');
    selection.style.removeProperty('visibility');
    selection.style.removeProperty('pointer-events');
  }
  if (reading) {
    reading.style.removeProperty('opacity');
    reading.style.removeProperty('visibility');
    reading.style.removeProperty('pointer-events');
    reading.style.removeProperty('transition');
  }

  if (screen === 'presentation') stage.classList.add('presentation-active');
  if (screen === 'selection') {
    stage.classList.add('selection-active');
    if (selection) {
      selection.style.zIndex = '50';
      selection.style.opacity = '1';
      selection.style.visibility = 'visible';
      selection.style.pointerEvents = 'auto';
    }
    if (reading) {
      reading.style.opacity = '0';
      reading.style.visibility = 'hidden';
      reading.style.pointerEvents = 'none';
      reading.style.transition = 'none';
    }
  }
  if (screen === 'reading' && reading) reading.classList.add('open');
}

function renderSpread() {
  const spread = document.querySelector('#spread');
  if (!spread) return;
  spread.classList.toggle('single-spread', currentType.count === 1);
  spread.setAttribute('aria-label', `Tirada de ${currentType.count} ${currentType.count === 1 ? 'carta' : 'cartas'}`);
  spread.innerHTML = positions.map((p, i) => `<div class="position"><div class="slot ${i === 0 ? 'current' : ''}" data-slot="${i}" aria-label="${p.label}"></div><div class="position-label">${p.label}</div>${p.sub ? `<div class="position-subtitle">${p.sub}</div>` : ''}</div>`).join('');
}

function updateTableHeader() {
  document.querySelector('#current-type').textContent = `${currentType.name} · ${currentType.count} ${currentType.count === 1 ? 'CARTA' : 'CARTAS'}`;
  const title = document.querySelector('#current-reading-name');
  if (title) title.textContent = currentType.name;
}

function deckIndexFromPointer(event) {
  const rect = deck.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  return Math.max(0, Math.min(77, Math.round(ratio * 77)));
}

function updateActive(index) {
  cards[activeIndex]?.classList.remove('active');
  activeIndex = index;
  if (!cards[index]?.classList.contains('used')) cards[index]?.classList.add('active');
}

async function chooseCard(index) {
  if (busy || chosen.length >= currentType.count || cards[index]?.classList.contains('used')) return;
  busy = true;
  unlockAudio();
  play(selectSound);
  const slotIndex = chosen.length;
  const available = arcana.filter(a => !chosen.some(c => c.name === a.name));
  const readingCard = { ...available[Math.floor(Math.random() * available.length)], reversed: Math.random() < 0.3 };
  chosen.push(readingCard);
  cards[index].classList.add('used');
  cards[index].classList.remove('active');

  const stageRect = stageWorld.getBoundingClientRect();
  const scale = stageRect.width / stageWorld.offsetWidth;
  const sourceRect = cards[index].getBoundingClientRect();
  const target = document.querySelector(`[data-slot="${slotIndex}"]`);
  const targetRect = target.getBoundingClientRect();
  const fly = createCard(readingCard, 'flying-card');
  fly.style.left = `${(sourceRect.left - stageRect.left) / scale}px`;
  fly.style.top = `${(sourceRect.top - stageRect.top) / scale}px`;
  fly.style.width = `${sourceRect.width / scale}px`;
  fly.style.height = `${sourceRect.height / scale}px`;
  const fanAngle = stage.classList.contains('portrait-layout') ? 38 : 34;
  const deckAngle = -fanAngle + (index / 77) * fanAngle * 2;
  fly.style.transform = `rotate(${deckAngle}deg) translateZ(0)`;
  stageWorld.appendChild(fly);
  fly.getBoundingClientRect();
  requestAnimationFrame(() => {
    fly.style.left = `${(targetRect.left - stageRect.left) / scale}px`;
    fly.style.top = `${(targetRect.top - stageRect.top) / scale}px`;
    fly.style.width = '165px';
    fly.style.height = '264px';
    fly.style.transform = 'rotate(0deg) translateZ(0)';
  });

  await wait(820);
  play(revealSound);
  fly.querySelector('.card-inner').classList.add('flipped');
  target.classList.add('filled');
  sparkle(target);
  await wait(850);
  fly.className = 'placed-card';
  fly.removeAttribute('style');
  target.appendChild(fly);
  document.querySelector('#counter').textContent = `${78 - chosen.length} CARTAS · ${currentType.count - chosen.length} ${currentType.count - chosen.length === 1 ? 'ELECCIÓN' : 'ELECCIONES'}`;
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('current'));
  const next = document.querySelector(`[data-slot="${chosen.length}"]`);
  if (next) next.classList.add('current');

  if (chosen.length < currentType.count) {
    document.querySelector('#prompt').innerHTML = promptForPosition(chosen.length);
    busy = false;
    updateActive((index + 23) % 78);
  } else {
    document.querySelector('#prompt').innerHTML = `Tu ${currentType.name.toLowerCase()} está completa <strong>✦</strong>`;
    document.querySelector('#details-button').classList.add('show');
    document.querySelector('#counter').textContent = `${78 - chosen.length} CARTAS · LECTURA COMPLETA`;
    busy = false;
  }
}

function promptForPosition(index) {
  if (currentType.count === 1) return `Revela <strong>${positions[index].label}</strong>`;
  return `Ahora elige una carta para tu <strong>${positions[index].label}</strong>`;
}

function createCard(data, className) {
  const el = document.createElement('div');
  el.className = className;
  el.innerHTML = data.reversed
    ? `<div class="card-inner"><div class="card-side card-back"></div><div class="card-side card-face"><div class="face-art" style="background-image:url('${data.image}')"></div><div class="card-name">${data.name}</div></div></div>`
    : `<div class="card-inner"><div class="card-side card-back"></div><div class="card-side card-face" style="background-image:url('${data.image}')"><div class="card-name">${data.name}</div></div></div>`;
  return el;
}

function sparkle(target) {
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = i % 3 === 0 ? '✦' : '·';
    s.style.left = `${target.offsetLeft + target.offsetWidth / 2}px`;
    s.style.top = `${target.offsetTop + target.offsetHeight / 2}px`;
    const a = (Math.PI * 2 * i) / 14;
    const d = 90 + Math.random() * 80;
    s.style.setProperty('--dx', `${Math.cos(a) * d}px`);
    s.style.setProperty('--dy', `${Math.sin(a) * d}px`);
    stageWorld.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
}

function openReading() {
  const grid = document.querySelector('#reading-grid');
  grid.className = `reading-grid ${chosen.length === 1 ? 'single-reading' : 'three-reading'}`;
  grid.innerHTML = chosen.map((c, i) => `<article class="reading-item">
    <div class="reading-art${c.reversed ? ' rev' : ''}" style="background-image:url('${c.image}')" aria-label="${c.name}${c.reversed ? ' (invertida)' : ''}"></div>
    <div class="reading-copy">
      <div class="time">${positions[i].label}${positions[i].sub ? ` · ${positions[i].sub}` : ''}</div>
      <h3>${c.name}${c.reversed ? ' <small class="rev-tag">· invertida</small>' : ''}</h3>
      <div class="reading-section"><span>Interpretación de tu tirada</span><p>${contextualMeaning(c)}</p></div>
      <div class="reading-section insight"><span>Clave práctica</span><p>${cardGuidance(c)}</p></div>
      <div class="reading-section reflection"><span>Pregunta para contemplar</span><p>${readingQuestion(c, i)}</p></div>
      <div class="reading-section history"><span>Historia y símbolos</span><p>${c.history}</p></div>
    </div>
  </article>`).join('');
  document.querySelector('#reading-title').textContent = currentType.name;
  document.querySelector('#reading-intro').textContent = currentType.description;
  document.querySelector('#synthesis').textContent = synthesis();
  document.querySelector('#special-tools').hidden = chosen.length === 1;
  if (chosen.length === 3) renderSpecialReading('clarity');

  const readingPanel = document.querySelector('.reading-panel');
  if (readingPanel) {
    readingPanel.scrollTop = 0;
    readingPanel.scrollLeft = 0;
  }
  setScreen('reading');
  requestAnimationFrame(() => {
    const panel = document.querySelector('.reading-panel');
    panel?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });
}

function contextualMeaning(card) {
  if (card.reversed && card.rev) return card.rev.meanings[currentType.id] || `${card.name}, invertida, habla de ${card.rev.theme}. ${card.rev.advice}`;
  return card.meanings[currentType.id] || card.meaning;
}

function cardGuidance(card) {
  if (card.reversed && card.rev) return card.rev.guidance[currentType.id] || card.rev.advice;
  if (card.guidance?.[currentType.id]) return card.guidance[currentType.id];
  const focus = {
    daily: 'el día de hoy',
    pastPresentFuture: 'tu recorrido completo',
    love: 'la forma en que te vinculas'
  }[currentType.id] || 'tu situación actual';
  return `Para ${focus}, convierte el mensaje de ${card.name} en una acción pequeña y consciente. Observa qué respuesta recibes y ajusta el siguiente paso sin perder de vista lo que realmente necesitas.`;
}

function readingQuestion(card, index) {
  const focus = {
    daily: '¿Qué gesto puede expresar hoy esta energía?',
    pastPresentFuture: index === 0
      ? '¿Qué aprendizaje de tu pasado sigue pidiendo ser reconocido?'
      : index === 1
        ? '¿Qué decisión presente puede transformar esta energía en avance?'
        : '¿Qué posibilidad quieres alimentar a partir de ahora?',
    love: '¿Cómo puedes vivir este mensaje con honestidad, cuidado y límites claros?'
  }[currentType.id] || '¿Qué parte de este mensaje merece tu atención?';
  return `${focus} Deja que ${card.name} sea una pregunta abierta, no una sentencia.`;
}

function renderSpecialReading(mode) {
  if (chosen.length < 3) return;
  const [first, second, third] = chosen;
  const readings = {
    clarity: {
      kicker: `Lectura especial · Claridad · ${currentType.name}`,
      title: 'La luz para tu siguiente paso',
      text: `${first.name} muestra la raíz del asunto, ${second.name} señala el pulso de tu presente y ${third.name} abre una posibilidad que crecerá cuando actúes con sencillez.`,
      advice: 'Nombra una sola decisión que pueda acercarte hoy a esa posibilidad.'
    },
    connection: {
      kicker: `Lectura especial · Vínculos · ${currentType.name}`,
      title: 'Lo que se encuentra entre las lunas',
      text: `Entre ${first.name}, ${second.name} y ${third.name} aparece una conversación: reconoce lo que traes, escucha lo que está ocurriendo y permite que el vínculo encuentre su forma real.`,
      advice: 'Ofrece una conversación honesta sin intentar controlar la respuesta.'
    },
    purpose: {
      kicker: `Lectura especial · Propósito · ${currentType.name}`,
      title: 'La brújula de tu camino',
      text: `Tu recorrido pasa de ${first.name} a ${second.name} y se proyecta hacia ${third.name}: no es una sentencia, sino una invitación a convertir intuición en una acción pequeña y constante.`,
      advice: 'Reserva un momento de silencio y escribe qué valor quieres encarnar esta semana.'
    }
  };
  const reading = readings[mode] || readings.clarity;
  document.querySelectorAll('.mode-button').forEach(button => {
    const selected = button.dataset.mode === mode;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  document.querySelector('#special-reading').innerHTML = `<div class="special-kicker">${reading.kicker}</div><h3>${reading.title}</h3><p>${reading.text}</p><div class="special-advice"><span>Clave del oráculo</span>${reading.advice}</div>`;
}

function synthesis() {
  const names = chosen.map(c => c.name);
  const nInv = chosen.filter(c => c.reversed).length;
  if (nInv === chosen.length && chosen.length > 1) return 'Todas las cartas salieron invertidas: no es un mal presagio, sino una invitación a mirar hacia adentro, revisar lo que se bloquea y ajustar despacio antes de actuar.';
  if (names.includes('El Sol') && names.includes('La Estrella')) return 'La claridad y la esperanza se responden: aquello que comenzó como intuición puede convertirse en una dirección luminosa si eliges actuar con sencillez.';
  if (names.includes('La Luna') && names.includes('La Sacerdotisa')) return 'Esta tirada subraya tu sensibilidad. No necesitas forzar una certeza inmediata; tu mejor brújula será observar lo que se repite en sueños, emociones y silencios.';
  if (names.includes('La Rueda')) return 'Hay movimiento entre las tres lunas. Honra lo aprendido, permanece atento al giro actual y deja espacio para una posibilidad que todavía no tiene nombre.';
  if (currentType.id === 'love') return 'El vínculo se ilumina mejor cuando cada persona puede mostrarse con honestidad y libertad. Atiende a los gestos presentes, no solo a las promesas del futuro.';
  if (currentType.id === 'daily') return 'La carta de hoy es una invitación, no un destino. Llévala contigo como una pregunta amable para observar el día con más presencia.';
  if (currentType.id === 'pastPresentFuture') return 'Esta tirada enlaza lo que aprendiste, lo que estás viviendo y la posibilidad que empieza a formarse. Mira el futuro como una dirección abierta, no como una sentencia.';
  return 'Tu lectura dibuja un tránsito desde la experiencia hacia una comprensión más consciente. Avanza sin prisa: la respuesta se vuelve visible cuando intención e intuición caminan juntas.';
}

function resetBoard() {
  document.querySelector('#reading')?.classList.remove('open');
  chosen = [];
  busy = false;
  cards.forEach(c => c.classList.remove('used', 'active'));
  document.querySelectorAll('.placed-card, .flying-card').forEach(c => c.remove());
  document.querySelectorAll('.slot').forEach((s, i) => { s.classList.remove('filled', 'current'); if (i === 0) s.classList.add('current'); });
  updateTableHeader();
  document.querySelector('#prompt').innerHTML = promptForPosition(0);
  document.querySelector('#counter').textContent = `78 CARTAS · ${currentType.count} ${currentType.count === 1 ? 'ELECCIÓN' : 'ELECCIONES'}`;
  document.querySelector('#details-button').classList.remove('show');
  document.querySelector('#special-reading').innerHTML = '';
  document.querySelectorAll('.mode-button').forEach((button, i) => {
    const selected = i === 0;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  updateActive(38);
}

function restart() {
  resetBoard();
}

function unlockAudio() {
  if (audioUnlocked || muted) return;
  audioUnlocked = true;
  music.play().catch(() => { audioUnlocked = false; });
}

function play(audio) {
  if (muted) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function toggleSound() {
  muted = !muted;
  const button = document.querySelector('#sound-button');
  button.textContent = muted ? '♩' : '♫';
  button.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar sonido');
  if (muted) music.pause(); else { audioUnlocked = false; unlockAudio(); }
}

function toggleFullscreen() {
  const container = document.querySelector('#game-container');
  if (document.fullscreenElement) {
    const exit = document.exitFullscreen?.();
    exit?.catch(() => {});
    return;
  }
  if (container.requestFullscreen) {
    container.requestFullscreen().catch(() => {
      manualLarge = !manualLarge;
      resize();
    });
    return;
  }
  manualLarge = !manualLarge;
  resize();
}

function updateFullscreenButton() {
  const button = document.querySelector('#expand-button');
  if (!button) return;
  const active = Boolean(document.fullscreenElement);
  button.textContent = active ? '×' : '⛶';
  button.setAttribute('aria-label', active ? 'Salir de pantalla completa' : 'Ampliar a pantalla completa');
  button.title = active ? 'Salir de pantalla completa' : 'Ampliar a pantalla completa';
  resize();
}

function resize() {
  if (!stage || !stageWorld) return;
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const availableWidth = Math.min(stage.clientWidth || viewportWidth, viewportWidth);
  const availableHeight = Math.min(stage.clientHeight || viewportHeight, viewportHeight);
  const portrait = viewportHeight > viewportWidth;
  const compactLandscape = !portrait && viewportHeight <= 800;
  stage.classList.toggle('portrait-layout', portrait);
  stage.classList.toggle('compact-landscape', compactLandscape);
  const layoutWidth = portrait ? 1200 : DESIGN_WIDTH;
  const baseScale = portrait
    ? Math.min(availableWidth / layoutWidth, 1)
    : Math.min(availableWidth / layoutWidth, availableHeight / DESIGN_HEIGHT);
  const layoutHeight = portrait
    ? Math.max(DESIGN_HEIGHT, availableHeight / baseScale)
    : DESIGN_HEIGHT;
  stageWorld.style.width = `${layoutWidth}px`;
  stageWorld.style.height = `${layoutHeight}px`;
  layoutDeck();
  const scale = baseScale * (manualLarge ? 1.18 : 1);
  stageWorld.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function mulberry32(seed) { return function() { let t = seed += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

build();
setScreen('presentation');

/* PM-DEEPLINK */
(function(){var id=decodeURIComponent((location.hash||'').slice(1));if(!id||!/^[\w-]+$/.test(id))return;var n=0;(function go(){var b=document.querySelector('.type-option[data-type="%s"]'.replace('%s',id));if(b){b.click();setTimeout(function(){try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();window.scrollTo(0,0);if(window.parent!==window)window.parent.scrollTo(0,0);}catch(e){}},350);return;}if(++n<50)setTimeout(go,100);})();})();
