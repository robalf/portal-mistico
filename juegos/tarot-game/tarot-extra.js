// Cartas invertidas y significados propios por tirada (amor, día, pasado-presente-futuro).
// Arcanos mayores: texto propio. Arcanos menores: se componen con el palo (ámbito) y el número/figura (etapa).

// rev = tema invertido · ra = consejo invertido · lu/du = amor/día derecha (solo si falta) · lr/dr = amor/día invertida
const M = {
  'El Loco': { rev:'imprudencia, dudas para empezar o riesgos tomados sin pensar', ra:'Antes de saltar, revisa qué parte del plan sí depende de ti.',
    lu:'En el amor, anima a empezar sin guion: una cita espontánea, una conversación sin máscaras o una nueva etapa en la que ambos aprenden a andar juntos.',
    du:'Hoy te favorece la espontaneidad: di que sí a algo pequeño y nuevo, sin exigirte saber cómo terminará.',
    lr:'En el amor, puede haber miedo a dar el paso o, al contrario, un impulso que deja a alguien atrás. Pregúntate si avanzas por ganas o por huir.',
    dr:'Hoy conviene frenar un impulso: lee con atención lo que vas a firmar, decir o prometer.' },
  'El Mago': { rev:'recursos dispersos, falta de foco o promesas que no se sostienen', ra:'Elige una sola herramienta y úsala bien.',
    lu:'En el amor, hay carisma, iniciativa y buena comunicación: es momento de mostrar con hechos lo que sientes y de proponer un plan concreto.',
    du:'Hoy tienes a mano lo necesario para empezar: una llamada, un mensaje o una idea bien presentada puede mover algo.',
    lr:'En el amor, cuidado con las palabras bonitas sin hechos o con jugar a conquistar sin comprometerte.',
    dr:'Hoy evita prometer de más o dispersarte en cinco tareas a la vez.' },
  'La Sacerdotisa': { rev:'secretos que pesan, intuición ignorada o información que se oculta', ra:'Escucha lo que tu cuerpo ya sabe antes de pedir más opiniones.',
    lr:'En el amor, hay silencios o cosas sin decir; no leas la mente de la otra persona, pregunta.',
    dr:'Hoy la intuición se nubla por el ruido: baja el ritmo y espera antes de decidir.' },
  'La Emperatriz': { rev:'dependencia, descuido de lo propio o creatividad bloqueada', ra:'Recupera un hábito que te nutra a ti, no solo a los demás.',
    lu:'En el amor, florece el cariño y la sensualidad; es un tiempo para cuidar, dejarte cuidar y permitir que la relación crezca sin prisa.',
    du:'Hoy cuida tu cuerpo y tu entorno: algo que mimes con paciencia dará fruto.',
    lr:'En el amor, hay sobreprotección o descuido propio: dar sin recibir termina agotando.',
    dr:'Hoy hay tendencia a postergar el autocuidado; reserva un rato para ti.' },
  'El Emperador': { rev:'rigidez, control excesivo o falta de límites claros', ra:'Flexibiliza una regla que ya no sirve y mantén la que sí te protege.',
    lu:'En el amor, buscas estabilidad y compromisos claros: es buen momento para definir acuerdos y mostrar seguridad.',
    du:'Hoy el orden juega a tu favor: organiza prioridades y toma esa decisión firme que venías aplazando.',
    lr:'En el amor, el control o la frialdad pueden alejar; escucha antes de imponer.',
    dr:'Hoy cuidado con la terquedad: ceder en lo pequeño te ahorra un conflicto grande.' },
  'El Hierofante': { rev:'dogmas, presión por encajar o rechazo a toda guía', ra:'Quédate con lo que te sirva de lo aprendido y deja lo demás.',
    lu:'En el amor, importan los valores compartidos, los compromisos formales y el apoyo de la familia o la comunidad.',
    du:'Hoy el consejo de alguien con experiencia, o un trámite formal, te ayuda a avanzar.',
    lr:'En el amor, las expectativas heredadas o "lo que se espera de ustedes" pesan más que lo que sienten.',
    dr:'Hoy desconfía de las reglas que repites solo por costumbre y pregunta por qué.' },
  'Los Enamorados': { rev:'dudas, desacuerdo de valores o una elección aplazada', ra:'Nombra lo que de verdad quieres antes de decidir por conveniencia.',
    lu:'En el amor, es una carta de unión y elección consciente: el vínculo se fortalece cuando ambos hablan con sinceridad.',
    du:'Hoy toca elegir entre dos caminos: decide con el corazón y con la cabeza a la vez.',
    lr:'En el amor, hay desequilibrio, dudas o una tercera persona en juego; no evites la conversación incómoda.',
    dr:'Hoy una decisión pendiente se complica si la dejas a medias; define qué es innegociable.' },
  'El Carro': { rev:'falta de rumbo, impaciencia o fuerzas que tiran en direcciones opuestas', ra:'Detente un momento y vuelve a definir hacia dónde vas.',
    lu:'En el amor, avanzas con determinación: es tiempo de tomar la iniciativa y de coordinar los pasos con la otra persona.',
    du:'Hoy tienes empuje para sacar adelante un asunto; mantén la dirección y no te desvíes.',
    lr:'En el amor, la competencia o la prisa por ganar la discusión dañan más que la propia discusión.',
    dr:'Hoy evita correr: un error por prisa te costaría más que llegar un poco más tarde.' },
  'La Justicia': { rev:'injusticia, evasión de responsabilidades o decisiones sesgadas', ra:'Revisa si estás siendo justo contigo y con los demás.',
    lu:'En el amor, importan la honestidad, la reciprocidad y los acuerdos equilibrados; lo que das y recibes debe verse con claridad.',
    du:'Hoy se aclara un asunto de papeles, acuerdos o deudas: actúa con transparencia.',
    lr:'En el amor, hay desequilibrio: uno da más que el otro, o se evita asumir una responsabilidad.',
    dr:'Hoy evita juzgar con prisa o firmar sin leer.' },
  'El Ermitaño': { rev:'aislamiento excesivo, soledad que ya no ayuda o rechazo a pedir consejo', ra:'Sal de tu cueva en pequeñas dosis: una llamada basta.',
    lr:'En el amor, el retraimiento puede parecer desinterés; explica lo que necesitas en vez de desaparecer.',
    dr:'Hoy la soledad pesa más de lo útil: busca compañía amable.' },
  'La Rueda': { rev:'resistencia al cambio, una mala racha temporal o la sensación de repetir lo mismo', ra:'Cambia un patrón pequeño y observa cómo se mueve el resto.',
    lr:'En el amor, se repite un ciclo; identifica qué parte depende de ti.',
    dr:'Hoy algo no sale según lo esperado; recuerda que la rueda sigue girando.' },
  'La Fuerza': { rev:'inseguridad, impulsos mal canalizados o agotamiento emocional', ra:'Descansa antes de exigirte más y trátate con la paciencia que darías a otro.',
    lu:'En el amor, la paciencia, la ternura y la confianza ganan a la rivalidad: sabes calmar sin controlar.',
    du:'Hoy una respuesta serena y amable resolverá lo que la fuerza bruta no podría.',
    lr:'En el amor, dudas de tu valor o reaccionas con dureza por miedo; vuelve a lo básico: respeto y cuidado.',
    dr:'Hoy la paciencia anda corta; respira antes de contestar.' },
  'El Colgado': { rev:'estancamiento, sacrificio inútil o resistencia a soltar', ra:'Si esperar ya no enseña, pasa a la acción.',
    lu:'En el amor, una pausa o un cambio de perspectiva ayuda: mirar la situación desde el lugar del otro lo aclara todo.',
    du:'Hoy conviene no forzar; esperar y mirar distinto traerá la respuesta.',
    lr:'En el amor, hay un sacrificio que nadie pidió o una espera que se alarga sin motivo.',
    dr:'Hoy sientes que no avanzas; revisa si esperas una señal que ya llegó.' },
  'La Muerte': { rev:'resistencia a cerrar un ciclo y apego a lo que ya terminó', ra:'Despídete con gratitud y deja un espacio vacío para lo que venga.',
    lu:'En el amor, termina una etapa para dar paso a otra más honesta: el vínculo se transforma o se renueva.',
    du:'Hoy cierras algo —un hábito, un tema, una idea— y eso libera espacio.',
    lr:'En el amor, aferrarse a lo que ya cambió prolonga el dolor; permite el final o la renovación.',
    dr:'Hoy te cuesta soltar algo; escribe lo que ya no necesitas.' },
  'La Templanza': { rev:'desequilibrio, excesos o falta de paciencia', ra:'Recupera una rutina simple: horarios, comida, descanso.',
    lu:'En el amor, hay armonía, paciencia y compromiso: se mezclan bien dos ritmos distintos.',
    du:'Hoy busca el punto medio; moderar es tu estrategia.',
    lr:'En el amor, uno acelera y el otro frena; ajusten el ritmo antes de discutir.',
    dr:'Hoy hay exceso de algo —trabajo, pantalla, preocupación—; recorta un poco.' },
  'El Diablo': { rev:'el inicio de una liberación, o la toma de conciencia de un hábito o una dependencia', ra:'Ya viste la cadena; da un paso pequeño para soltarla.',
    lu:'En el amor, hay atracción intensa, pero revisa si hay posesión, celos o dependencia.',
    du:'Hoy notas lo que te ata: un hábito, una compra impulsiva, una conducta repetida.',
    lr:'En el amor, empiezas a liberarte de una relación o un patrón que te limitaba.',
    dr:'Hoy es buen día para romper con una tentación o un mal hábito.' },
  'La Torre': { rev:'un cambio que se evita o una crisis menor que se resuelve', ra:'Haz tú el cambio que estás evitando antes de que lo haga la vida.',
    lu:'En el amor, una verdad sale a la luz y sacude lo que no estaba bien cimentado; lo auténtico sobrevive.',
    du:'Hoy puede haber una noticia o una interrupción inesperada; mantén la calma y reconstruye con lo esencial.',
    lr:'En el amor, evitas una conversación que sabes necesaria; el miedo la aplaza pero no la cancela.',
    dr:'Hoy un susto mayor se queda en aviso; aprende de él.' },
  'La Estrella': { rev:'desánimo, desconfianza o una esperanza que se apaga', ra:'Cuida lo básico —descanso, agua, compañía— antes de buscar grandes respuestas.',
    lr:'En el amor, te cuesta confiar o idealizas; empieza por la honestidad contigo.',
    dr:'Hoy la esperanza flaquea; da un paso pequeño y observa.' },
  'La Luna': { rev:'una confusión que se disipa, miedos que se aclaran o ilusiones', ra:'Verifica los hechos antes de creer lo que imaginas.',
    lr:'En el amor, empieza a aclararse un malentendido; no actúes sobre sospechas sin confirmar.',
    dr:'Hoy la niebla se levanta poco a poco; espera para decidir.' },
  'El Sol': { rev:'alegría contenida, optimismo excesivo o un éxito que se retrasa', ra:'El sol sigue ahí: quita lo que lo tapa.',
    lr:'En el amor, la calidez se apaga por rutina; vuelvan a jugar y a celebrar.',
    dr:'Hoy el ánimo está algo opaco; busca luz en algo sencillo.' },
  'El Juicio': { rev:'autocrítica, dudas ante un llamado o evasión de una revisión necesaria', ra:'Perdónate lo que ya aprendiste y responde al llamado.',
    lu:'En el amor, es tiempo de balance, perdón y renacer: un vínculo se reconsidera con madurez.',
    du:'Hoy una llamada interior o externa te pide responder: es buen día para revisar y decidir.',
    lr:'En el amor, te juzgas o juzgas al otro con dureza; el perdón empieza por soltar el reproche.',
    dr:'Hoy evita culparte por lo que ya pasó.' },
  'El Mundo': { rev:'un cierre incompleto, un último paso pendiente o dependencia de la aprobación ajena', ra:'Termina lo que falta; el último tramo es el que completa el ciclo.',
    lu:'En el amor, hay plenitud y realización: se cierra una etapa con éxito y se abre otra más amplia.',
    du:'Hoy completas algo importante o ves un resultado; celebra y agradece.',
    lr:'En el amor, algo queda a medias; define qué falta para cerrar bien.',
    dr:'Hoy un proyecto casi terminado pide el último empujón.' }
};

// Arcanos menores: etapa (número o figura)
const RANGO = {
  'As':{ rev:'una oportunidad bloqueada o un comienzo que se retrasa', ra:'Prepara el terreno; el comienzo llegará cuando lo despejes.' },
  'Dos':{ rev:'indecisión o un desequilibrio entre dos opciones', ra:'Pon por escrito pros y contras y fija una fecha para decidir.' },
  'Tres':{ rev:'falta de colaboración o resultados que tardan', ra:'Pide ayuda concreta y comparte el trabajo.' },
  'Cuatro':{ rev:'estancamiento o resistencia a descansar o a cambiar', ra:'Sal de la rutina un paso, aunque sea pequeño.' },
  'Cinco':{ rev:'un conflicto que se evita o que empieza a resolverse', ra:'Habla con calma: la reconciliación es posible si nadie busca ganar.' },
  'Seis':{ rev:'un avance lento, nostalgia o dependencia del pasado', ra:'Reconoce lo logrado y suelta lo que ya no te impulsa.' },
  'Siete':{ rev:'dudas, dispersión o evasión', ra:'Elige una prioridad y deja las demás para después.' },
  'Ocho':{ rev:'un movimiento bloqueado, prisa o falta de foco', ra:'Resuelve un pendiente antes de abrir otro frente.' },
  'Nueve':{ rev:'cansancio, ansiedad o aislamiento', ra:'Descansa y pide apoyo antes de seguir cargando solo.' },
  'Diez':{ rev:'una carga excesiva o un cierre difícil', ra:'Delega o termina algo que lleva demasiado tiempo abierto.' },
  'Sota':{ rev:'inmadurez o noticias confusas', ra:'Confirma la información antes de actuar.' },
  'Caballero':{ rev:'impulsividad o falta de constancia', ra:'Reduce la velocidad y termina lo que empezaste.' },
  'Reina':{ rev:'inseguridad o un control excesivo', ra:'Confía en tu criterio sin imponerlo.' },
  'Rey':{ rev:'rigidez, abuso de autoridad o falta de autocontrol', ra:'Usa tu autoridad para cuidar, no para presionar.' }
};

// Palos: ámbito de vida
const PALO = {
  Bastos: { love:'Con Bastos, el amor se vive desde la pasión, la iniciativa y el deseo de aventura.', day:'Con Bastos, hoy el terreno es la acción y tu energía personal.',
            lrev:'La pasión está dispersa o el entusiasmo se agotó en el vínculo.', drev:'Tu energía se dispersa o se apaga a mitad de camino.' },
  Copas:  { love:'Con Copas, el amor se vive desde los sentimientos, la empatía y la conexión emocional.', day:'Con Copas, hoy el terreno es emocional: sensibilidad e intuición.',
            lrev:'Las emociones están bloqueadas, idealizadas o sin expresar.', drev:'Tus emociones pesan o se esconden; nómbralas antes de decidir.' },
  Espadas:{ love:'Con Espadas, el amor depende de las palabras, la claridad mental y la honestidad.', day:'Con Espadas, hoy el terreno es mental: ideas, decisiones y comunicación.',
            lrev:'Hay malentendidos, ironías o silencios que hieren.', drev:'La mente da vueltas; escribe lo que piensas y separa hechos de temores.' },
  Oros:   { love:'Con Oros, el amor se construye con hechos, estabilidad y compromiso concreto.', day:'Con Oros, hoy el terreno es práctico: trabajo, dinero y salud.',
            lrev:'La rutina, el dinero o la comodidad enfrían el vínculo.', drev:'Algo práctico —dinero, tiempo, salud— pide orden antes de avanzar.' }
};

const CIERRE_AMOR = {"As": "Un comienzo sencillo, sincero y concreto basta.", "Dos": "Hablar de lo que cada uno espera evita malentendidos.", "Tres": "Compartir con amigos o familia fortalece el vínculo.", "Cuatro": "Una pausa para valorar lo que ya existe ayuda.", "Cinco": "Los desacuerdos se resuelven escuchando, no queriendo ganar.", "Seis": "Los gestos de cuidado y los recuerdos compartidos unen.", "Siete": "Elige con quién y por qué esfuerzo vale la pena.", "Ocho": "Los mensajes y movimientos rápidos pesan; sé claro.", "Nueve": "Cuida tus límites: puedes cuidar sin agotarte.", "Diez": "Es un cierre de ciclo; piensa qué quieres construir después.", "Sota": "Un mensaje, una invitación o una novedad dulce puede acercar.", "Caballero": "Actúa con entusiasmo, pero con constancia.", "Reina": "La madurez emocional y la calidez sostienen el vínculo.", "Rey": "El compromiso, con calma y responsabilidad, da seguridad."};

function partes(name){
  const m = name.match(/^(As|Dos|Tres|Cuatro|Cinco|Seis|Siete|Ocho|Nueve|Diez|Sota|Caballero|Reina|Rey) de (Bastos|Copas|Espadas|Oros)$/);
  return m ? { rango:m[1], palo:m[2] } : null;
}
const lower = s => s.charAt(0).toLowerCase() + s.slice(1);

export function enrich(card){
  const m = M[card.name], p = partes(card.name);
  const rev = { meanings:{}, guidance:{} };
  let revTheme, revAdv;
  if (m){
    revTheme = m.rev; revAdv = m.ra;
    rev.meanings.love = m.lr; rev.meanings.daily = m.dr;
    if (m.lu && !card.__handwritten) card.meanings.love = m.lu;
    if (m.du && !card.__handwritten) card.meanings.daily = m.du;
  } else if (p){
    const R = RANGO[p.rango], P = PALO[p.palo];
    revTheme = R.rev; revAdv = R.ra;
    rev.meanings.love = `En el amor, invertida, señala ${R.rev}. ${P.lrev} ${R.ra}`;
    rev.meanings.daily = `Hoy, invertida, señala ${R.rev}. ${P.drev} ${R.ra}`;
    if (!card.__handwritten){
      card.meanings.love = `En el amor, ${card.theme}. ${P.love} ${CIERRE_AMOR[p.rango]}`;
      card.meanings.daily = `${card.theme.charAt(0).toUpperCase() + card.theme.slice(1)}. ${P.day}`;
    }
  } else return card;
  rev.theme = revTheme; rev.advice = revAdv;
  rev.meanings.pastPresentFuture = `Invertida, ${card.name} habla de ${revTheme}. ${revAdv} Reconocerlo a tiempo permite que esta energía se transforme en aprendizaje en vez de repetirse.`;
  rev.meanings.weekly = `Esta semana, invertida, ${card.name} señala ${revTheme}. ${revAdv}`;
  rev.guidance.daily = `Hoy, la lectura invertida te pide observar sin forzar. ${revAdv}`;
  rev.guidance.pastPresentFuture = `Mira esta energía con honestidad y corrígela despacio. ${revAdv}`;
  rev.guidance.love = `Háblalo con calma y sin acusar. ${revAdv}`;
  card.rev = rev;
  return card;
}
