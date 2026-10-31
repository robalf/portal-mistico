// Textos astrológicos (tradición simbólica) para componer lecturas a partir del cielo real.
export const SIGNOS = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];

// Tema de cada casa (sistema de casas por signo completo: tu signo solar = casa 1)
export const CASA = [
  null,
  { n:'Identidad', t:'tu imagen y tu forma de presentarte ante el mundo' },
  { n:'Recursos', t:'tu dinero, tus recursos y lo que valoras' },
  { n:'Comunicación', t:'la comunicación, los trayectos cortos y tu entorno cercano' },
  { n:'Hogar', t:'tu hogar, tu familia y tus raíces' },
  { n:'Romance y creatividad', t:'el romance, la creatividad y el disfrute' },
  { n:'Rutina y salud', t:'tu rutina, tu trabajo diario y tu salud' },
  { n:'Pareja', t:'tu pareja, tus socios y las relaciones de tú a tú' },
  { n:'Transformación', t:'la intimidad, los recursos compartidos y los cambios profundos' },
  { n:'Horizontes', t:'los viajes, el estudio y tus creencias' },
  { n:'Carrera', t:'tu carrera, tu reputación y tus metas a largo plazo' },
  { n:'Amistades', t:'tus amistades, tus grupos y tus proyectos a futuro' },
  { n:'Mundo interior', t:'tu mundo interior, el descanso y lo que necesitas soltar' }
];

// Qué hace la Luna al pasar por cada casa (3 formas de decirlo)
export const LUNA_CASA = [
  null,
  ['Las emociones se notan en tu rostro y en tu manera de actuar: es buen momento para mostrarte tal como eres.','Estarás más sensible a cómo te ven los demás; cuida que una opinión ajena no te afecte de más.','Tu energía personal está a flor de piel y favorece empezar algo que lleve tu sello.'],
  ['Puede aparecer el deseo de ordenar gastos o asegurar lo que ya tienes; decide con calma, no por impulso.','Lo que valoras pide atención: un pequeño ajuste en tu presupuesto o en tus prioridades te dará tranquilidad.','Conviene revisar qué te hace sentir seguro; hoy el dinero y las emociones están más ligados de lo habitual.'],
  ['Las conversaciones, los mensajes y los pequeños trámites toman protagonismo; escucha bien antes de responder.','Tu mente está curiosa y receptiva: buen día para aprender algo, escribir o reconectar con alguien cercano.','Los asuntos con vecinos, hermanos o compañeros se resuelven mejor hablando claro y con cariño.'],
  ['El hogar te llama: un rato de calma en casa o una charla con la familia recarga más que cualquier plan.','Pueden surgir recuerdos o temas familiares; recíbelos con ternura y no los resuelvas con prisa.','Ordenar tu espacio, cocinar algo reconfortante o cuidar tus raíces te devolverá el equilibrio.'],
  ['Se abre espacio para el juego, el romance y lo creativo; permítete disfrutar sin tener que justificarlo.','Tu lado expresivo brilla: ideal para crear, coquetear o dedicar tiempo a lo que te apasiona.','Un gesto de afecto o una actividad que te divierta tendrá más efecto del que imaginas.'],
  ['La rutina pide cuidado: los hábitos pequeños, el orden y la atención a tu cuerpo hacen la diferencia.','Es buen día para terminar pendientes y poner en marcha una costumbre sana, sin exigirte de más.','El trabajo diario fluye si lo divides en pasos; presta atención a las señales de cansancio.'],
  ['Las relaciones de tú a tú se sienten con más intensidad; una conversación sincera puede acercarte a alguien.','Importa el equilibrio entre dar y recibir con tu pareja, tus socios o un amigo cercano.','Puede aparecer alguien que refleje algo de ti; escucha sin ponerte a la defensiva.'],
  ['Las emociones van hondo: es buen momento para soltar lo que pesa y mirar lo que de verdad quieres transformar.','Los temas de dinero compartido, deudas o intimidad piden honestidad; evita los silencios incómodos.','Una fuerza silenciosa te invita a cerrar un ciclo y renovarte desde adentro.'],
  ['El horizonte se amplía: estudiar, planear un viaje o conversar sobre lo que crees te dará inspiración.','Sientes ganas de ir más lejos; una idea nueva puede cambiar tu forma de ver un asunto cotidiano.','Es buen día para aprender, enseñar o buscar sentido en lo que haces.'],
  ['Tu vida pública y tus metas pasan al primer plano; un paso responsable hoy se notará a largo plazo.','Puede llegar atención o reconocimiento por lo que haces; actúa con tranquilidad y profesionalismo.','Piensa dónde quieres estar dentro de uno o dos años y da una pequeña acción hacia allá.'],
  ['Los amigos, los grupos y los proyectos compartidos traen buenas noticias o ideas útiles.','Rodearte de personas afines te anima; no dudes en pedir o en ofrecer una mano.','Un plan a futuro gana claridad cuando lo conversas con alguien de confianza.'],
  ['Necesitas una pausa: el silencio, el descanso y un rato a solas te devuelven claridad.','La intuición habla bajito; escribe lo que sientes y evita decisiones grandes con la mente cansada.','Es buen momento para perdonar, soltar un peso invisible o simplemente descansar sin culpa.']
];

// Consejo por casa (2 formas)
export const CONSEJO_CASA = [
  null,
  ['Empieza algo pequeño que te represente.','Cuida tu descanso y tu voz: te sostienen más de lo que parece.'],
  ['Antes de comprar, espera una noche.','Anota lo que entra y lo que sale; la claridad calma.'],
  ['Responde un mensaje que has dejado pendiente.','Antes de hablar, respira y elige una sola idea clara.'],
  ['Dedica unos minutos a tu espacio o a alguien de tu familia.','Come algo caliente y date un rato sin pantallas.'],
  ['Haz algo solo porque te gusta.','Dile a alguien lo que valoras de él o de ella.'],
  ['Elige una sola tarea y termínala bien.','Bebe agua, estírate y camina un poco.'],
  ['Escucha primero y opina después.','Plantea con suavidad lo que necesitas de la otra persona.'],
  ['Nombra lo que quieres soltar, aunque sea en una nota privada.','Sé honesto con un tema que has evitado.'],
  ['Aprende algo nuevo aunque sea durante diez minutos.','Planea una salida, un curso o una lectura que te amplíe la mirada.'],
  ['Da un paso concreto hacia tu meta principal.','Cumple primero con lo que prometiste.'],
  ['Escribe a un amigo con quien hace tiempo no hablas.','Comparte una idea con tu grupo o comunidad.'],
  ['Dedica un momento al silencio o a escribir lo que sientes.','Duerme bien: hoy tu intuición lo agradece.']
];

// Sabor de la Luna según el signo en que está
export const LUNA_SIGNO = [
  'En Aries la emoción es directa y rápida: reaccionamos antes de pensar.',
  'En Tauro el ánimo busca calma, comodidad y placeres sencillos.',
  'En Géminis la mente se mueve rápido y las emociones piden palabras.',
  'En Cáncer la Luna está en casa: la sensibilidad y la nostalgia se intensifican.',
  'En Leo el corazón quiere brillar, ser visto y recibir cariño.',
  'En Virgo las emociones se expresan con servicio, orden y detalle.',
  'En Libra el ánimo busca armonía, compañía y evitar conflictos.',
  'En Escorpio las emociones se vuelven profundas, intensas y reservadas.',
  'En Sagitario el ánimo es optimista, inquieto y ávido de libertad.',
  'En Capricornio las emociones se contienen y se orientan al deber.',
  'En Acuario el ánimo se vuelve independiente, curioso y algo distante.',
  'En Piscis la sensibilidad se desborda: crecen la empatía y la imaginación.'
];

// Fases lunares
export const FASES = [
  { n:'Luna nueva', t:'Es una fase de siembra: simbólicamente es un buen momento para fijar intenciones sencillas.' },
  { n:'Luna creciente', t:'La luz va en aumento: es una fase de impulso para avanzar con lo que empezaste.' },
  { n:'Cuarto creciente', t:'Fase de acción: aparecen pequeños obstáculos que se resuelven con decisión.' },
  { n:'Luna gibosa creciente', t:'Se acerca la culminación: es momento de afinar detalles y tener paciencia.' },
  { n:'Luna llena', t:'La luz está en su punto máximo: lo que estaba oculto se hace visible y las emociones se sienten más.' },
  { n:'Luna gibosa menguante', t:'Fase de gratitud y de compartir lo aprendido.' },
  { n:'Cuarto menguante', t:'Fase de revisión: invita a soltar lo que ya no suma.' },
  { n:'Luna menguante', t:'La luz disminuye: es una etapa de descanso y de cierre antes de un nuevo ciclo.' }
];
export const FASE_EXACTA = [
  (sg,h,t)=>`Hoy hay Luna nueva en ${sg}, en tu casa ${h}: un momento simbólico para sembrar intenciones sobre ${t}.`,
  (sg,h,t)=>`Hoy se alcanza el cuarto creciente en ${sg}, en tu casa ${h}: momento de pasar a la acción en ${t}.`,
  (sg,h,t)=>`Hoy hay Luna llena en ${sg}, en tu casa ${h}: culmina y se hace visible algo relacionado con ${t}, y las emociones pueden sentirse más intensas.`,
  (sg,h,t)=>`Hoy se alcanza el cuarto menguante en ${sg}, en tu casa ${h}: momento de revisar y soltar lo que ya no suma en ${t}.`
];

// Planetas y lo que representan
export const PLANETA = {
  Me:{ n:'Mercurio', t:'la comunicación y las ideas', rol:(t)=>`tu mente y tus conversaciones se orientan hacia ${t}` },
  V:{ n:'Venus', t:'el afecto, el gusto y las relaciones', rol:(t)=>`el afecto, el placer y la armonía se inclinan hacia ${t}` },
  Ma:{ n:'Marte', t:'la energía y la acción', rol:(t)=>`tu energía y tu iniciativa se dirigen a ${t}` },
  J:{ n:'Júpiter', t:'la confianza y las oportunidades', rol:(t)=>`el crecimiento y la buena fortuna se asocian con ${t}` },
  Sa:{ n:'Saturno', t:'las responsabilidades y los límites', rol:(t)=>`la disciplina y las lecciones de largo plazo se enfocan en ${t}` }
};

// Aspectos de la Luna (2 formas cada uno)
export const ASPECTO = {
  0:  [(p,t)=>`La Luna se une a ${p}: ${t} se sienten amplificados y difíciles de ignorar.`,(p,t)=>`La Luna y ${p} coinciden en el cielo, así que ${t} ocupan el centro de tu atención.`],
  60: [(p,t)=>`La Luna y ${p} se miran en armonía suave: una pequeña iniciativa en ${t} encuentra apoyo.`,(p,t)=>`El sextil entre la Luna y ${p} abre una puerta amable en ${t}, si das el primer paso.`],
  90: [(p,t)=>`La Luna forma tensión con ${p}: ${t} piden paciencia y un ajuste antes de seguir.`,(p,t)=>`El cuadrado entre la Luna y ${p} puede traer roces en ${t}; respira antes de reaccionar.`],
  120:[(p,t)=>`La Luna y ${p} fluyen en trígono: ${t} salen con naturalidad y poco esfuerzo.`,(p,t)=>`El trígono entre la Luna y ${p} favorece ${t}: aprovecha la facilidad del momento.`],
  180:[(p,t)=>`La Luna se opone a ${p}: ${t} te piden equilibrar dos necesidades opuestas.`,(p,t)=>`La oposición entre la Luna y ${p} pone ${t} frente a un espejo; busca el punto medio.`]
};

// Retrógrados
export const RETRO = {
  Me:(sg,h,t)=>`Mercurio está retrógrado en ${sg}, en tu casa ${h}: revisa, repite y confirma todo lo relacionado con ${t}.`,
  V:(sg,h,t)=>`Venus está retrógrada en ${sg}, en tu casa ${h}: es un tiempo para repensar gustos y vínculos en ${t}, sin decisiones precipitadas.`,
  Ma:(sg,h,t)=>`Marte está retrógrado en ${sg}, en tu casa ${h}: la energía se acumula; canalízala con paciencia en ${t}.`,
  J:(sg,h,t)=>`Júpiter está retrógrado en ${sg}, en tu casa ${h}: toca revisar por dentro lo que quieres hacer crecer en ${t}.`,
  Sa:(sg,h,t)=>`Saturno está retrógrado en ${sg}, en tu casa ${h}: es tiempo de revisar estructuras y compromisos en ${t}.`
};

// El Sol en cada casa (semana y mes)
export const SOL_CASA = [
  null,
  'Es tiempo de renovarte y mostrar quién eres.',
  'Tus finanzas y tu autoestima piden atención.',
  'Aprendes, hablas y te mueves más de lo habitual.',
  'El hogar y la familia son tu prioridad.',
  'Crecen la alegría, el romance y la creatividad.',
  'Es época de ordenar rutinas y cuidar la salud.',
  'Las alianzas y la pareja ocupan el centro.',
  'Se activan procesos de transformación y asuntos compartidos.',
  'Te empuja la curiosidad por viajar, estudiar y creer.',
  'Tu carrera y tus metas ganan protagonismo.',
  'Las amistades y los proyectos colectivos te dan impulso.',
  'Es un tiempo de introspección y de cerrar ciclos antes de tu nuevo año solar.'
];
