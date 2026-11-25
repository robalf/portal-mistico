/* Textos en español para las calculadoras de Portal Místico (Matriz del Destino, Saturno, nodos, Lilith, kin maya). */
export default {
  locale: 'es-ES',
  signs: ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'],
  glyphs: ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'],
  signSlug: ['aries','tauro','geminis','cancer','leo','virgo','libra','escorpio','sagitario','capricornio','acuario','piscis'],
  signBase: '../zodiaco/',
  err: { date: 'Introduce una fecha de nacimiento válida.', date2: 'Introduce una fecha válida para la segunda persona.', range: 'Usa una fecha entre 1900 y 2100.', lib: 'No se pudo cargar el motor astronómico. Recarga la página.' },
  common: { age: 'a los', years: 'años', direct: 'directo', retro: 'retrógrado', approx: 'Hora no indicada: calculado a las 12:00. El margen es pequeño, pero puede mover el resultado unas horas o, en casos límite, un grado.', again: 'Calcular otra fecha' },
  arcana: [null,
    ['El Mago','iniciativa, habilidad, comunicación','dispersión o manipulación'],
    ['La Sacerdotisa','intuición, conocimiento interior, discreción','secretismo, pasividad'],
    ['La Emperatriz','creatividad, belleza, abundancia, maternidad','dependencia del placer o del cuidado ajeno'],
    ['El Emperador','estructura, liderazgo, protección','rigidez, control'],
    ['El Hierofante','enseñanza, valores, tradición, guía','dogmatismo, juzgar'],
    ['Los Enamorados','amor, elección, armonía en las relaciones','indecisión, dependencia afectiva'],
    ['El Carro','avance, victoria, viajes, fuerza de voluntad','prisa, agresividad'],
    ['La Justicia','equilibrio, verdad, causa y efecto','perfeccionismo, culpa'],
    ['El Ermitaño','sabiduría, introspección, profundidad','aislamiento, desconfianza'],
    ['La Rueda de la Fortuna','ciclos, suerte, adaptación al cambio','inestabilidad, fatalismo'],
    ['La Fuerza','valor, vitalidad, dominio de los instintos','impulsividad, agotamiento'],
    ['El Colgado','entrega, otra mirada, sacrificio con sentido','victimismo, estancamiento'],
    ['La Muerte','transformación, cierres, renovación','miedo al cambio, aferrarse'],
    ['La Templanza','calma, sanación, medida justa','apatía, exceso de contención'],
    ['El Diablo','magnetismo, deseo, poder material','apegos, excesos, adicciones'],
    ['La Torre','ruptura liberadora, verdad repentina','destrucción, crisis por resistencia'],
    ['La Estrella','esperanza, talento, inspiración','idealismo, falta de concreción'],
    ['La Luna','imaginación, sensibilidad, mundo onírico','miedos, ilusiones, confusión'],
    ['El Sol','alegría, éxito, calidez, vitalidad','orgullo, necesidad de brillar'],
    ['El Juicio','renacimiento, familia, llamada interior','juicio severo, cuentas pendientes'],
    ['El Mundo','plenitud, logro, horizontes amplios','dispersión, no cerrar etapas'],
    ['El Loco','libertad, espontaneidad, comienzo','irresponsabilidad, huida']],
  matrix: {
    title: 'Tu Matriz del Destino', couple: 'Matriz de pareja',
    points: { A: ['Personalidad (A)','Cómo te presentas y tu energía de base, el día de nacimiento.'], B: ['Talento natural (B)','Recursos que traes de fábrica y cómo te inspiras.'], C: ['Lo material (C)','Tu relación con el dinero, el trabajo y lo concreto.'], D: ['Tarea kármica (D)','La lección que se repite hasta que la integras.'], E: ['Centro: zona de confort (E)','El arcano que lo une todo: donde vuelves cuando necesitas equilibrio.'], personal: ['Propósito personal','Lo que vienes a desarrollar en tu primera etapa, hasta los 40 aprox.'], social: ['Propósito social','Tu aporte a los demás, la familia y la comunidad (40-60 años).'], spiritual: ['Propósito espiritual','La síntesis de tu camino, más allá de los 60.'], money: ['Canal del dinero','Cómo fluye mejor la abundancia material.'], love: ['Canal del amor','Lo que buscas y ofreces en la pareja.'] },
    cpoints: { A: ['Energía de la pareja (A)','Cómo os ve el entorno.'], E: ['Centro de la pareja (E)','El sentido profundo de la relación.'], money: ['Dinero en común','Cómo funcionáis con los recursos compartidos.'], love: ['El vínculo','Qué alimenta el amor entre los dos.'], D: ['Lección de pareja (D)','Lo que la relación os pide aprender.'], personal: ['Propósito de la pareja','Para qué os habéis encontrado.'] },
    plus: 'En luz', minus: 'En sombra',
    note: 'Método simbólico moderno (Natalia Ladini, 2006) basado en los 22 Arcanos Mayores. No es una predicción: úsalo como espejo para reflexionar.'
  },
  saturn: {
    title: 'Tu retorno de Saturno', natal: 'Saturno natal', returns: ['Primer retorno','Segundo retorno','Tercer retorno'],
    passes: n => n === 1 ? 'Saturno cruza tu grado natal una vez, en movimiento directo.' : `Saturno cruza tu grado natal ${n} veces por su retrogradación: el proceso dura casi un año.`,
    window: 'Etapa de influencia (Saturno a ±5° de tu grado natal, aprox.)', past: 'ya pasó', future: 'por llegar',
    bySign: ['aprender a tener paciencia y a liderar con constancia, no por impulso.','construir seguridad material propia y aceptar el ritmo lento de lo sólido.','ordenar tus ideas, terminar lo que empiezas y comprometer tu palabra.','madurar tus vínculos familiares y crear un hogar emocional estable.','brillar con autenticidad, sin depender del aplauso ajeno.','encontrar un método de trabajo y de salud sostenible, sin autoexigencia extrema.','asumir compromisos adultos en pareja y negociar con equilibrio.','atravesar tus miedos, compartir el poder y soltar el control.','convertir tus creencias en un camino práctico y coherente.','asumir la autoridad sobre tu vida y tu vocación.','encontrar tu lugar en grupos y proyectos colectivos sin perder tu originalidad.','dar forma concreta a tus sueños y poner límites a la confusión.']
  },
  nodes: {
    title: 'Tus nodos lunares', north: 'Nodo Norte', south: 'Nodo Sur', mean: 'Nodo medio', true: 'Nodo verdadero',
    returnsT: 'Tus retornos nodales (nodo medio vuelve a su posición)', reversal: 'Inversión nodal (nodo opuesto)',
    northBy: ['Atreverte a ir primero, decidir por ti y confiar en tu propio impulso.','Construir calma, valor propio y placer sencillo; menos crisis, más raíces.','Escuchar, preguntar y conectar con ideas distintas en lugar de sermonear.','Permitirte sentir, cuidar y pertenecer: tu hogar interior es tu brújula.','Expresar tu creatividad con el corazón y dejarte ver sin pedir permiso.','Bajar los sueños a tierra con hábitos, servicio y atención al detalle.','Aprender la colaboración, la diplomacia y el arte de compartir la vida.','Soltar lo cómodo, transformarte y compartir recursos y emociones a fondo.','Buscar sentido, viajar, estudiar y confiar en una visión amplia de la vida.','Asumir metas, responsabilidad y una dirección clara en el mundo.','Aportar al grupo, a tus amistades y a causas que te trascienden.','Rendirte a la intuición, la compasión y la espiritualidad; menos control.'],
    southNote: 'El Nodo Sur, en el signo opuesto, describe talentos y hábitos que ya dominas y en los que es fácil refugiarse.'
  },
  lilith: {
    title: 'Tu Lilith (Luna Negra)', returnsT: 'Tus retornos de Lilith (cada ~8,85 años)',
    bySign: ['Rechazo a que te frenen; tu sombra es la ira contenida y tu poder, la autonomía.','Relación intensa con el placer y la posesión; integrarla es disfrutar sin culpa.','Palabras afiladas e ideas tabú; tu poder está en decir lo que otros callan.','Heridas con la madre o el hogar; sanar te convierte en refugio para otros.','Miedo a no ser visto; tu poder es un carisma que no pide permiso.','Exigencia y control del cuerpo; integrarla es tratarte con ternura.','Tensión entre complacer y ser libre en pareja; tu poder es el deseo honesto.','Intensidad, celos y deseo de fusión; tu poder es la transformación profunda.','Rebeldía ante dogmas; tu poder es buscar tu propia verdad.','Lucha con la autoridad y la ambición; tu poder es mandar sobre tu vida.','Sentirte diferente del grupo; tu poder es la originalidad radical.','Huida, sacrificio o confusión; tu poder es la intuición y la compasión sin perderte.']
  },
  kin: {
    title: 'Tu kin maya', ds: 'Encantamiento del Sueño (Dreamspell)', trad: 'Cuenta maya tradicional (Tzolk\'in)',
    seals: [null,'Dragón Rojo','Viento Blanco','Noche Azul','Semilla Amarilla','Serpiente Roja','Enlazador de Mundos Blanco','Mano Azul','Estrella Amarilla','Luna Roja','Perro Blanco','Mono Azul','Humano Amarillo','Caminante del Cielo Rojo','Mago Blanco','Águila Azul','Guerrero Amarillo','Tierra Roja','Espejo Blanco','Tormenta Azul','Sol Amarillo'],
    sealKw: [null,'nacimiento, nutrir, ser','espíritu, comunicación, aliento','abundancia, sueños, intuición','florecimiento, objetivo, conciencia','fuerza vital, instinto, cuerpo','muerte y renacimiento, oportunidad, igualar','realización, sanación, conocimiento','belleza, arte, elegancia','agua universal, purificación, flujo','corazón, lealtad, amor','magia, juego, ilusión','libre albedrío, sabiduría, influencia','espacio, exploración, vigilancia','atemporalidad, receptividad, encantamiento','visión, mente, creación','inteligencia, intrepidez, cuestionar','navegación, sincronía, evolución','reflejo, orden, infinito','autogeneración, energía, catalizar','iluminación, fuego universal, vida'],
    tones: [null,'Magnético','Lunar','Eléctrico','Autoexistente','Entonado','Rítmico','Resonante','Galáctico','Solar','Planetario','Espectral','Cristal','Cósmico'],
    toneKw: [null,'unificar y atraer el propósito','polarizar y reconocer el desafío','activar y servir','definir y dar forma','dar poder y comandar','organizar y equilibrar','canalizar e inspirar','armonizar y modelar','pulsar y realizar la intención','perfeccionar y producir','disolver y liberar','dedicarse y cooperar','perdurar y trascender'],
    tradNames: ['Imox (Imix)','Iq\' (Ik\')','Aq\'ab\'al (Ak\'b\'al)','K\'at (K\'an)','Kan (Chikchan)','Kame (Kimi)','Kej (Manik\')','Q\'anil (Lamat)','Toj (Muluk)','Tz\'i\' (Ok)','B\'atz\' (Chuwen)','E (Eb\')','Aj (B\'en)','I\'x (Ix)','Tz\'ikin (Men)','Ajmaq (Kib\')','No\'j (Kab\'an)','Tijax (Etz\'nab\')','Kawoq (Kawak)','Ajpu (Ajaw)'],
    oracle: { guide: 'Guía', analog: 'Análogo', antipode: 'Antípoda', occult: 'Oculto' },
    note29: 'El Encantamiento del Sueño no cuenta el 29 de febrero: ese día comparte kin con el 28.'
  }
};
