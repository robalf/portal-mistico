// Compatibilidad 12×12 compuesta a partir de elemento, modalidad, aspecto y rasgos de cada signo.
export const NOM = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];
const ELEM = ['fuego','tierra','aire','agua'];
const MOD = ['cardinal','fijo','mutable'];
export const PERFIL = [
 {reg:'Marte',aporta:'iniciativa, pasión directa y valentía para decir lo que siente',necesita:'emoción, espacio para actuar y honestidad sin rodeos',sombra:'la impaciencia y los arranques de orgullo'},
 {reg:'Venus',aporta:'lealtad, sensualidad y una constancia que da seguridad',necesita:'tiempo, gestos concretos y estabilidad',sombra:'la terquedad y el apego a la rutina'},
 {reg:'Mercurio',aporta:'curiosidad, humor y conversación que nunca se agota',necesita:'variedad, diálogo y libertad para explorar ideas',sombra:'la dispersión y las dudas que se enredan'},
 {reg:'la Luna',aporta:'ternura, memoria afectiva y un hogar emocional donde descansar',necesita:'sentirse a salvo y correspondido',sombra:'la susceptibilidad y el retraimiento'},
 {reg:'el Sol',aporta:'generosidad, calidez y entusiasmo que ilumina el vínculo',necesita:'admiración sincera y sentirse elegido',sombra:'el orgullo herido y la necesidad de protagonismo'},
 {reg:'Mercurio',aporta:'atención al detalle, servicio y una lealtad serena',necesita:'coherencia, orden y gestos útiles',sombra:'la crítica excesiva y la preocupación constante'},
 {reg:'Venus',aporta:'encanto, diplomacia y sentido del equilibrio',necesita:'armonía, reciprocidad y belleza compartida',sombra:'la indecisión y la tendencia a evitar el conflicto'},
 {reg:'Plutón y Marte',aporta:'intensidad, entrega total y lealtad profunda',necesita:'verdad, confianza y profundidad emocional',sombra:'los celos y el deseo de controlar'},
 {reg:'Júpiter',aporta:'optimismo, honestidad y espíritu de aventura',necesita:'libertad y horizontes compartidos',sombra:'la franqueza torpe y el miedo a sentirse atado'},
 {reg:'Saturno',aporta:'compromiso, responsabilidad y planes a largo plazo',necesita:'respeto, estabilidad y metas en común',sombra:'la frialdad aparente y el exceso de trabajo'},
 {reg:'Urano y Saturno',aporta:'originalidad, amistad genuina y respeto por la libertad del otro',necesita:'independencia y complicidad mental',sombra:'la distancia emocional y la rebeldía por reflejo'},
 {reg:'Neptuno y Júpiter',aporta:'romanticismo, compasión e intuición',necesita:'ternura, sueños y ser comprendido sin tener que explicarlo todo',sombra:'la evasión y la idealización'}
];
const T_ELEM = {
 '0-0':'Dos signos de fuego: hay chispa inmediata, entusiasmo y ganas de vivir a lo grande. El riesgo es competir por el protagonismo o discutir con demasiada intensidad; si aprenden a celebrar los logros del otro, son un equipo imparable.',
 '1-1':'Dos signos de tierra: comparten el gusto por lo concreto, la estabilidad y construir con paciencia. Se sienten seguros juntos, aunque deben cuidar que la rutina no apague el juego ni la sorpresa.',
 '2-2':'Dos signos de aire: la conversación fluye, se estimulan mentalmente y se respetan los espacios. Lo que conviene vigilar es que tanta charla no deje en segundo plano las emociones más profundas.',
 '3-3':'Dos signos de agua: se entienden sin tantas palabras y hay una empatía muy grande. Necesitan cuidar que las emociones compartidas no se amplifiquen en tristeza colectiva y mantener algún ancla práctica.',
 '0-2':'Fuego y aire: el aire aviva el fuego. Hay estímulo, humor, planes y movimiento constantes; es una de las combinaciones más dinámicas, con el reto de sostener la constancia cuando la novedad baja.',
 '1-3':'Tierra y agua: la tierra da forma y contención al agua, y el agua nutre a la tierra. Es una mezcla de cuidado, ternura y hogar, ideal para construir algo duradero.',
 '0-1':'Fuego y tierra: uno impulsa y el otro estabiliza. Pueden complementarse muy bien si el fuego respeta los tiempos de la tierra y la tierra no apaga el entusiasmo con demasiada cautela.',
 '0-3':'Fuego y agua: pasión y sensibilidad en tensión creativa. Cuando se entienden hay profundidad y calor; cuando no, uno siente al otro demasiado brusco y el otro demasiado intenso. Pide mucha comunicación.',
 '1-2':'Tierra y aire: la tierra aporta realismo y el aire ideas y perspectiva. Aprenden mucho el uno del otro, aunque pueden desesperarse cuando uno quiere planes firmes y el otro quiere seguir explorando.',
 '2-3':'Aire y agua: la mente y el corazón buscando su idioma común. Hay romanticismo y curiosidad si el aire escucha las emociones y el agua se atreve a ponerlas en palabras.'
};
const T_MOD = {
 '0-0':'Ambos son de modalidad cardinal: dos iniciadores. Abundan las ideas y la energía de arranque; hay que acordar quién lidera cada terreno para no chocar.',
 '1-1':'Ambos son de modalidad fija: dos personas leales y firmes. Su compromiso es fuerte, pero cuando discrepan ninguno cede fácilmente; aprender a flexibilizar es clave.',
 '2-2':'Ambos son de modalidad mutable: dos almas adaptables. Se acomodan con facilidad, pero pueden faltar decisiones firmes y alguien que sostenga el rumbo.',
 '0-1':'Uno es cardinal y el otro fijo: uno propone y el otro sostiene. Funciona si el que inicia respeta la profundidad del que consolida.',
 '0-2':'Uno es cardinal y el otro mutable: uno marca el camino y el otro se adapta. Va bien mientras la adaptación no se convierta en renuncia.',
 '1-2':'Uno es fijo y el otro mutable: la firmeza se encuentra con la flexibilidad. Hay equilibrio si el fijo escucha y el mutable se compromete.'
};
const T_ASP = [
 {n:'mismo signo',p:74,t:'{a} con {b}: se reconocen como en un espejo. Entienden de inmediato cómo piensa el otro, pero también comparten los mismos puntos ciegos, y lo que no se trabaja en uno se repite en el otro.'},
 {n:'signos contiguos',p:66,t:'{a} y {b} son signos vecinos: parecidos en el calendario y muy distintos en el estilo. Cada uno ve en el otro algo que le falta y a veces algo que no termina de entender. Funcionan cuando se curiosean sin querer corregirse.'},
 {n:'sextil',p:82,t:'{a} y {b} forman un aspecto de sextil: se llevan bien con naturalidad y se potencian con poco esfuerzo. Es una amistad que puede ser pareja; la relación crece cuando ponen intención y no la dan por hecha.'},
 {n:'cuadratura',p:62,t:'{a} y {b} están en cuadratura: hay atracción y fricción a la vez. Se desafían, se hacen crecer y a veces se irritan. Con madurez, esa tensión se convierte en motor; sin ella, en pelea repetida.'},
 {n:'trígono',p:90,t:'{a} y {b} forman un trígono: es el aspecto más armónico del zodiaco. Fluye la comprensión, la confianza y el apoyo. El reto, paradójicamente, es no acomodarse y seguir cultivando la relación.'},
 {n:'quincuncio',p:58,t:'{a} y {b} están en quincuncio: no comparten elemento ni modalidad y casi nada les resulta obvio al otro. Es una relación de aprendizaje constante, que pide ajustes y mucha paciencia, pero puede ser muy transformadora.'},
 {n:'oposición',p:78,t:'{a} y {b} son signos opuestos: se atraen como polos que se completan. Cada uno tiene justo lo que al otro le falta, y eso produce magnetismo y también fricción. Cuando se integran, forman un círculo completo.'}
];
const dist = (i, j) => { const d = Math.abs(i - j); return Math.min(d, 12 - d); };
const key = (x, y) => x <= y ? `${x}-${y}` : `${y}-${x}`;

export function pareja(i, j){
  const a = NOM[i], b = NOM[j], A = PERFIL[i], B = PERFIL[j];
  const d = dist(i, j), asp = T_ASP[d], ei = i % 4, ej = j % 4, mi = i % 3, mj = j % 3;
  let pct = asp.p;
  // ajustes por elemento (afinidad natural): fuego-aire y tierra-agua suman; fuego-agua y tierra-aire restan
  const ke = key(ei, ej);
  if (ke === '0-2' || ke === '1-3') pct += 4; else if (ke === '0-3' || ke === '1-2') pct -= 4; else if (ei === ej) pct += 2;
  // pequeño matiz estable por la pareja concreta (simétrico), para variar sin azar
  pct += ((i * 7 + j * 7 + i * j) % 5) - 2;
  pct = Math.max(45, Math.min(97, pct));
  const nivel = pct >= 88 ? 'Afinidad muy alta' : pct >= 78 ? 'Buena afinidad' : pct >= 68 ? 'Afinidad media, con potencial' : 'Relación de aprendizaje';
  const P = [];
  P.push(asp.t.replace('{a}', a).replace('{b}', b));
  P.push(T_ELEM[ke] + ' (' + a + ' es de ' + ELEM[ei] + ' y ' + b + ' de ' + ELEM[ej] + '.)');
  P.push(T_MOD[key(mi, mj)] + ' (' + a + ': ' + MOD[mi] + '; ' + b + ': ' + MOD[mj] + '.)');
  P.push(i === j
    ? `En el amor, ${a} aporta ${A.aporta}. Ambos necesitan ${A.necesita}, y ambos deben vigilar ${A.sombra}.`
    : `En el amor, ${a} aporta ${A.aporta}, y ${b} aporta ${B.aporta}. ${a} necesita ${A.necesita}; ${b} necesita ${B.necesita}.`);
  P.push(i === j
    ? `Punto delicado: ${A.sombra}. Hablarlo a tiempo evita que se refuerce.`
    : `Punto delicado: en ${a} puede aparecer ${A.sombra}; en ${b}, ${B.sombra}. Cuando uno se activa, el otro puede reaccionar con su propio patrón, así que nombrarlo con calma ayuda mucho.`);
  const cons = {
    4:'Consejo: no den por sentada la armonía; planeen cosas nuevas juntos para mantener viva la chispa.',
    2:'Consejo: aprovechen la facilidad que tienen y súmenle intención: citas, proyectos y conversaciones pendientes.',
    0:'Consejo: busquen en la relación el contrapeso de lo que no tienen, y sean amables con los defectos que reconocen.',
    6:'Consejo: aprecien lo que el otro tiene de distinto en lugar de querer cambiarlo; el equilibrio está en el punto medio.',
    3:'Consejo: conviertan la fricción en acuerdos explícitos sobre ritmos, dinero y tiempo; evitar el tema solo lo agranda.',
    5:'Consejo: pregunten más y supongan menos; la distancia se acorta con curiosidad sincera.',
    1:'Consejo: celebren las diferencias de estilo y eviten comparar quién ama "mejor"; son lenguajes distintos.'
  }[d];
  P.push(cons);
  return { a, b, pct, nivel, aspecto: asp.n, parrafos: P };
}
