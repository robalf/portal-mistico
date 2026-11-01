// Cartas invertidas y significados propios por tirada (amor, día, pasado-presente-futuro).
// Arcanos mayores: texto propio. Arcanos menores: se componen con el palo (ámbito) y el número/figura (etapa).

// rev = tema invertido · ra = consejo invertido · lu/du = amor/día derecha (solo si falta) · lr/dr = amor/día invertida
const M = {
  'El Loco': { rev:'descuido, ausencia, apatía, vanidad o energía que se dispersa', ra:'Presta atención a lo que estás descuidando y vuelve a poner foco.',
    lu:'En el amor, anima a empezar sin guion: una cita espontánea, una conversación sin máscaras o una nueva etapa en la que ambos aprenden a andar juntos.',
    du:'Hoy te favorece la espontaneidad: di que sí a algo pequeño y nuevo, sin exigirte saber cómo terminará.',
    lr:'En el amor, puede haber miedo a dar el paso o, al contrario, un impulso que deja a alguien atrás. Pregúntate si avanzas por ganas o por huir.',
    dr:'Hoy conviene frenar un impulso: lee con atención lo que vas a firmar, decir o prometer.' },
  'El Mago': { rev:'inquietud, desprestigio y desorden mental (Waite también cita al médico y al mago)', ra:'Ordena la mente y evita decidir desde la inquietud.',
    lu:'En el amor, hay carisma, iniciativa y buena comunicación: es momento de mostrar con hechos lo que sientes y de proponer un plan concreto.',
    du:'Hoy tienes a mano lo necesario para empezar: una llamada, un mensaje o una idea bien presentada puede mover algo.',
    lr:'En el amor, cuidado con las palabras bonitas sin hechos o con jugar a conquistar sin comprometerte.',
    dr:'Hoy evita prometer de más o dispersarte en cinco tareas a la vez.' },
  'La Sacerdotisa': { rev:'pasión desbordada, vanidad o conocimiento superficial', ra:'Profundiza antes de opinar: lo aparente no es todo el saber.',
    lr:'En el amor, hay silencios o cosas sin decir; no leas la mente de la otra persona, pregunta.',
    dr:'Hoy la intuición se nubla por el ruido: baja el ritmo y espera antes de decidir.' },
  'La Emperatriz': { rev:'luz, verdad y desenredo de asuntos complicados, o vacilación', ra:'Aclara lo enredado con honestidad y decide sin vacilar de más.',
    lu:'En el amor, florece el cariño y la sensualidad; es un tiempo para cuidar, dejarte cuidar y permitir que la relación crezca sin prisa.',
    du:'Hoy cuida tu cuerpo y tu entorno: algo que mimes con paciencia dará fruto.',
    lr:'En el amor, hay sobreprotección o descuido propio: dar sin recibir termina agotando.',
    dr:'Hoy hay tendencia a postergar el autocuidado; reserva un rato para ti.' },
  'El Emperador': { rev:'benevolencia y compasión, o bien obstrucción e inmadurez', ra:'Suaviza el mando con compasión y revisa dónde frena la inmadurez.',
    lu:'En el amor, buscas estabilidad y compromisos claros: es buen momento para definir acuerdos y mostrar seguridad.',
    du:'Hoy el orden juega a tu favor: organiza prioridades y toma esa decisión firme que venías aplazando.',
    lr:'En el amor, el control o la frialdad pueden alejar; escucha antes de imponer.',
    dr:'Hoy cuidado con la terquedad: ceder en lo pequeño te ahorra un conflicto grande.' },
  'El Hierofante': { rev:'sociedad, buen entendimiento y concordia, o exceso de amabilidad y debilidad', ra:'Sé amable sin dejar de poner límites.',
    lu:'En el amor, importan los valores compartidos, los compromisos formales y el apoyo de la familia o la comunidad.',
    du:'Hoy el consejo de alguien con experiencia, o un trámite formal, te ayuda a avanzar.',
    lr:'En el amor, las expectativas heredadas o "lo que se espera de ustedes" pesan más que lo que sienten.',
    dr:'Hoy desconfía de las reglas que repites solo por costumbre y pregunta por qué.' },
  'Los Enamorados': { rev:'fracaso, planes poco sensatos o un compromiso frustrado', ra:'Revisa tus planes con calma antes de comprometerte.',
    lu:'En el amor, es una carta de unión y elección consciente: el vínculo se fortalece cuando ambos hablan con sinceridad.',
    du:'Hoy toca elegir entre dos caminos: decide con el corazón y con la cabeza a la vez.',
    lr:'En el amor, hay desequilibrio, dudas o una tercera persona en juego; no evites la conversación incómoda.',
    dr:'Hoy una decisión pendiente se complica si la dejas a medias; define qué es innegociable.' },
  'El Carro': { rev:'tumulto, disputa, litigio o derrota', ra:'Evita entrar en la pelea y busca un acuerdo antes que el choque.',
    lu:'En el amor, avanzas con determinación: es tiempo de tomar la iniciativa y de coordinar los pasos con la otra persona.',
    du:'Hoy tienes empuje para sacar adelante un asunto; mantén la dirección y no te desvíes.',
    lr:'En el amor, la competencia o la prisa por ganar la discusión dañan más que la propia discusión.',
    dr:'Hoy evita correr: un error por prisa te costaría más que llegar un poco más tarde.' },
  'La Justicia': { rev:'complicaciones legales, prejuicio, sesgo o severidad excesiva', ra:'Revisa tus sesgos y evita la dureza innecesaria.',
    lu:'En el amor, importan la honestidad, la reciprocidad y los acuerdos equilibrados; lo que das y recibes debe verse con claridad.',
    du:'Hoy se aclara un asunto de papeles, acuerdos o deudas: actúa con transparencia.',
    lr:'En el amor, hay desequilibrio: uno da más que el otro, o se evita asumir una responsabilidad.',
    dr:'Hoy evita juzgar con prisa o firmar sin leer.' },
  'El Ermitaño': { rev:'ocultamiento, disfraz, miedo o cautela sin razón', ra:'Pregúntate si tu prudencia es sabia o solo miedo.',
    lr:'En el amor, el retraimiento puede parecer desinterés; explica lo que necesitas en vez de desaparecer.',
    dr:'Hoy la soledad pesa más de lo útil: busca compañía amable.' },
  'La Rueda': { rev:'aumento, abundancia o exceso', ra:'Disfruta lo que llega sin caer en el exceso.',
    lr:'En el amor, se repite un ciclo; identifica qué parte depende de ti.',
    dr:'Hoy algo no sale según lo esperado; recuerda que la rueda sigue girando.' },
  'La Fuerza': { rev:'despotismo, abuso de poder, debilidad o discordia', ra:'No impongas por la fuerza lo que se logra mejor con magnanimidad.',
    lu:'En el amor, la paciencia, la ternura y la confianza ganan a la rivalidad: sabes calmar sin controlar.',
    du:'Hoy una respuesta serena y amable resolverá lo que la fuerza bruta no podría.',
    lr:'En el amor, dudas de tu valor o reaccionas con dureza por miedo; vuelve a lo básico: respeto y cuidado.',
    dr:'Hoy la paciencia anda corta; respira antes de contestar.' },
  'El Colgado': { rev:'egoísmo, o dejarse llevar por la multitud', ra:'Piensa por ti, sin imitar a la multitud ni encerrarte en tu interés.',
    lu:'En el amor, una pausa o un cambio de perspectiva ayuda: mirar la situación desde el lugar del otro lo aclara todo.',
    du:'Hoy conviene no forzar; esperar y mirar distinto traerá la respuesta.',
    lr:'En el amor, hay un sacrificio que nadie pidió o una espera que se alarga sin motivo.',
    dr:'Hoy sientes que no avanzas; revisa si esperas una señal que ya llegó.' },
  'La Muerte': { rev:'inercia, letargo, petrificación o esperanza destruida', ra:'Despierta del letargo con un paso pequeño.',
    lu:'En el amor, termina una etapa para dar paso a otra más honesta: el vínculo se transforma o se renueva.',
    du:'Hoy cierras algo —un hábito, un tema, una idea— y eso libera espacio.',
    lr:'En el amor, aferrarse a lo que ya cambió prolonga el dolor; permite el final o la renovación.',
    dr:'Hoy te cuesta soltar algo; escribe lo que ya no necesitas.' },
  'La Templanza': { rev:'asuntos de iglesias o sectas, desunión, malas combinaciones o intereses opuestos', ra:'Busca el punto medio entre intereses que compiten.',
    lu:'En el amor, hay armonía, paciencia y compromiso: se mezclan bien dos ritmos distintos.',
    du:'Hoy busca el punto medio; moderar es tu estrategia.',
    lr:'En el amor, uno acelera y el otro frena; ajusten el ritmo antes de discutir.',
    dr:'Hoy hay exceso de algo —trabajo, pantalla, preocupación—; recorta un poco.' },
  'El Diablo': { rev:'fatalidad dañina, debilidad, mezquindad o ceguera', ra:'Abre los ojos ante lo que te ata y deja la mezquindad.',
    lu:'En el amor, hay atracción intensa, pero revisa si hay posesión, celos o dependencia.',
    du:'Hoy notas lo que te ata: un hábito, una compra impulsiva, una conducta repetida.',
    lr:'En el amor, empiezas a liberarte de una relación o un patrón que te limitaba.',
    dr:'Hoy es buen día para romper con una tentación o un mal hábito.' },
  'La Torre': { rev:'lo mismo en menor grado, o bien opresión, encierro y tiranía', ra:'Atiende a tiempo lo que se tambalea antes de que se agrave.',
    lu:'En el amor, una verdad sale a la luz y sacude lo que no estaba bien cimentado; lo auténtico sobrevive.',
    du:'Hoy puede haber una noticia o una interrupción inesperada; mantén la calma y reconstruye con lo esencial.',
    lr:'En el amor, evitas una conversación que sabes necesaria; el miedo la aplaza pero no la cancela.',
    dr:'Hoy un susto mayor se queda en aviso; aprende de él.' },
  'La Estrella': { rev:'arrogancia, altivez o impotencia', ra:'Baja la guardia del orgullo y pide ayuda.',
    lr:'En el amor, te cuesta confiar o idealizas; empieza por la honestidad contigo.',
    dr:'Hoy la esperanza flaquea; da un paso pequeño y observa.' },
  'La Luna': { rev:'inestabilidad, inconstancia, silencio o engaños menores', ra:'Verifica los hechos antes de creer lo que imaginas.',
    lr:'En el amor, empieza a aclararse un malentendido; no actúes sobre sospechas sin confirmar.',
    dr:'Hoy la niebla se levanta poco a poco; espera para decidir.' },
  'El Sol': { rev:'lo mismo en menor medida', ra:'El sol sigue ahí: quita lo que lo tapa.',
    lr:'En el amor, la calidez se apaga por rutina; vuelvan a jugar y a celebrar.',
    dr:'Hoy el ánimo está algo opaco; busca luz en algo sencillo.' },
  'El Juicio': { rev:'debilidad, pusilanimidad y sencillez; también deliberación, decisión y sentencia', ra:'Delibera con calma y decide.',
    lu:'En el amor, es tiempo de balance, perdón y renacer: un vínculo se reconsidera con madurez.',
    du:'Hoy una llamada interior o externa te pide responder: es buen día para revisar y decidir.',
    lr:'En el amor, te juzgas o juzgas al otro con dureza; el perdón empieza por soltar el reproche.',
    dr:'Hoy evita culparte por lo que ya pasó.' },
  'El Mundo': { rev:'inercia, fijeza y estancamiento', ra:'Muévete, aunque sea un paso pequeño.',
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

const W_REV = {
  'As de Bastos': 'caída, decadencia, ruina y pérdida, con una alegría nublada',
  'Dos de Bastos': 'sorpresa, asombro, emoción, preocupación y miedo',
  'Tres de Bastos': 'el fin de los problemas y el cese de la adversidad y la decepción',
  'Cuatro de Bastos': 'que el significado no cambia: prosperidad, aumento, felicidad y belleza',
  'Cinco de Bastos': 'litigios, disputas, engaños y contradicciones',
  'Seis de Bastos': 'aprensión, miedo, deslealtad y una demora indefinida',
  'Siete de Bastos': 'perplejidad, apuro y ansiedad; una advertencia contra la indecisión',
  'Ocho de Bastos': 'celos, disputas internas, remordimientos y riñas, también domésticas',
  'Nueve de Bastos': 'obstáculos, adversidad y calamidad',
  'Diez de Bastos': 'contrariedades, dificultades e intrigas',
  'Sota de Bastos': 'anécdotas, anuncios y malas noticias, con indecisión e inestabilidad',
  'Caballero de Bastos': 'ruptura, división, interrupción y discordia',
  'Reina de Bastos': 'bondad, economía y servicialidad; en ciertas posiciones, oposición, celos o engaño',
  'Rey de Bastos': 'una bondad severa: austero, pero tolerante',
  'As de Copas': 'una casa del falso corazón: cambio, inestabilidad y revolución',
  'Tres de Copas': 'prontitud, logro y fin de un asunto, y también exceso en los placeres',
  'Cuatro de Copas': 'novedad, presagio, nueva instrucción y nuevas relaciones',
  'Cinco de Copas': 'noticias, alianzas, afinidad, regreso y proyectos falsos',
  'Seis de Copas': 'el futuro, la renovación y lo que está por venir',
  'Siete de Copas': 'deseo, voluntad, determinación y proyecto',
  'Ocho de Copas': 'gran alegría, felicidad y festejo',
  'Nueve de Copas': 'verdad, lealtad y libertad, aunque las lecturas varían e incluyen errores e imperfecciones',
  'Diez de Copas': 'un reposo del falso corazón: indignación y violencia',
  'Sota de Copas': 'gusto, inclinación, apego, seducción, engaño y artificio',
  'Caballero de Copas': 'engaño, artificio, sutileza, estafa y fraude',
  'Reina de Copas': 'lecturas que varían: una mujer buena, o ilustre pero poco confiable; perversidad, vicio y deshonra',
  'Rey de Copas': 'un hombre deshonesto o doble, injusticia, escándalo y una pérdida considerable',
  'As de Espadas': 'lo mismo, pero con resultados desastrosos; otra lectura habla de concepción, nacimiento y multiplicidad',
  'Dos de Espadas': 'impostura, falsedad, duplicidad y deslealtad',
  'Tres de Espadas': 'alienación mental, error, pérdida, distracción y desorden',
  'Cuatro de Espadas': 'buena administración, prudencia, economía y precaución',
  'Cinco de Espadas': 'lo mismo que en la posición derecha, con entierro y exequias',
  'Seis de Espadas': 'declaración, confesión y publicidad; según una lectura, una propuesta de amor',
  'Siete de Espadas': 'buenos consejos e instrucción, o bien calumnia y habladurías',
  'Ocho de Espadas': 'inquietud, dificultad, oposición, accidente, traición y lo imprevisto',
  'Nueve de Espadas': 'encierro, sospecha, duda, temor razonable y vergüenza',
  'Diez de Espadas': 'ventaja, provecho, éxito y favor, aunque ninguno permanente; también poder y autoridad',
  'Sota de Espadas': 'el lado más oscuro de esas cualidades, un estado imprevisto y desprevenido, y también enfermedad',
  'Caballero de Espadas': 'imprudencia, incapacidad y extravagancia',
  'Reina de Espadas': 'malicia, intolerancia, artificio, mojigatería y engaño',
  'Rey de Espadas': 'crueldad, perversidad, barbarie, perfidia y mala intención',
  'As de Oros': 'el lado malo de la riqueza y las malas noticias; también gran riqueza',
  'Dos de Oros': 'alegría forzada, disfrute fingido, cartas, escritos y letras de cambio',
  'Tres de Oros': 'mediocridad, puerilidad, pequeñez y debilidad',
  'Cuatro de Oros': 'suspenso, demora y oposición',
  'Cinco de Oros': 'desorden, caos, ruina, discordia y derroche',
  'Seis de Oros': 'deseo, codicia, envidia, celos e ilusión',
  'Siete de Oros': 'motivo de ansiedad por el dinero que se proponga prestar',
  'Ocho de Oros': 'ambición vacía, vanidad, codicia, exacción y usura',
  'Nueve de Oros': 'engaño, proyecto anulado y mala fe',
  'Diez de Oros': 'azar, fatalidad, pérdida y juegos de azar; a veces un regalo, una dote o una pensión',
  'Sota de Oros': 'prodigalidad, disipación, lujo y noticias desfavorables',
  'Caballero de Oros': 'inercia, ociosidad y estancamiento; también placidez, desánimo y descuido',
  'Reina de Oros': 'maldad, sospecha, suspenso, miedo y desconfianza',
  'Rey de Oros': 'vicio, debilidad, perversidad, corrupción y peligro',
};
export function enrich(card){
  const m = M[card.name], p = partes(card.name);
  const rev = { meanings:{}, guidance:{} };
  let revTheme, revAdv;
  if (m){
    revTheme = m.rev; revAdv = m.ra;
    rev.meanings.love = `En el amor, invertida, señala ${m.rev}. ${m.ra}`;
    rev.meanings.daily = `Hoy, invertida, señala ${m.rev}. ${m.ra}`;
  } else if (p){
    const R = RANGO[p.rango], P = PALO[p.palo], WR = W_REV[card.name] || R.rev;
    revTheme = WR; revAdv = R.ra;
    rev.meanings.love = `En el amor, invertida, señala ${WR}. ${P.lrev} ${R.ra}`;
    rev.meanings.daily = `Hoy, invertida, señala ${WR}. ${P.drev} ${R.ra}`;
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
