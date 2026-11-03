export const RULES_VERSION = 'traditional-rules-1.1';

export const KNOWLEDGE_BASE = [
  { rule_id:'PALM_HEART_001', tradition:'Quiromancia occidental', category:'Línea del corazón', feature:'curva', condition:'curvature=curva', location:'trayectoria', associated_feature:'heart_line', traditional_meaning:'expresividad y demostración afectiva', alternative_meaning:'sensibilidad emocional expresada de forma espontánea', source:'Diccionario editorial de Aura Palma', source_quality:'cultural-summary', confidence_of_rule:.52, notes:'Asociación tradicional, no científica.', contraindications:['No usar para diagnosticar salud mental.'], conflicting_rules:[] },
  { rule_id:'PALM_HEART_002', tradition:'Quiromancia occidental', category:'Línea del corazón', feature:'bifurcación final', condition:'forks>0', location:'terminación', associated_feature:'heart_line', traditional_meaning:'capacidad para comprender diferentes perspectivas emocionales', alternative_meaning:'equilibrio entre idealismo y realismo', source:'Diccionario editorial de Aura Palma', source_quality:'cultural-summary', confidence_of_rule:.48, notes:'Requiere bifurcación visual confirmada.', contraindications:[], conflicting_rules:[] },
  { rule_id:'PALM_HEAD_001', tradition:'Quiromancia occidental', category:'Línea de la cabeza', feature:'larga', condition:'length_normalized>=.7', location:'trayectoria', associated_feature:'head_line', traditional_meaning:'pensamiento detallado y tendencia al análisis', alternative_meaning:'concentración sostenida', source:'Diccionario editorial de Aura Palma', source_quality:'cultural-summary', confidence_of_rule:.5, notes:'No es una medición de capacidad intelectual.', contraindications:[], conflicting_rules:[] },
  { rule_id:'PALM_HEAD_002', tradition:'Quiromancia occidental', category:'Línea de la cabeza', feature:'inclinada', condition:'curvature=ligeramente inclinada', location:'trayectoria', associated_feature:'head_line', traditional_meaning:'imaginación, creatividad o intuición', alternative_meaning:'pensamiento flexible', source:'Diccionario editorial de Aura Palma', source_quality:'cultural-summary', confidence_of_rule:.46, notes:'Interpretación tradicional.', contraindications:['Nunca convertir en diagnóstico.'], conflicting_rules:[] },
  { rule_id:'PALM_LIFE_001', tradition:'Quiromancia occidental', category:'Línea de la vida', feature:'arco amplio', condition:'curvature=arco amplio', location:'trayectoria', associated_feature:'life_line', traditional_meaning:'entusiasmo, actividad y apertura a experiencias', alternative_meaning:'estilo vital expansivo según la tradición', source:'Diccionario editorial de Aura Palma', source_quality:'cultural-summary', confidence_of_rule:.49, notes:'Una línea corta no significa vida corta.', contraindications:['No predecir muerte ni longevidad.'], conflicting_rules:[] },
  { rule_id:'PALM_FATE_001', tradition:'Quiromancia occidental', category:'Línea del destino', feature:'incierta', condition:'detected=false', location:'palma', associated_feature:'fate_line', traditional_meaning:'trayectoria flexible o menos definida por una sola dirección', alternative_meaning:'múltiples caminos posibles', source:'Diccionario editorial de Quiromancia', source_quality:'cultural-summary', confidence_of_rule:.42, notes:'La ausencia visual no se penaliza.', contraindications:[], conflicting_rules:[] },
  { rule_id:'PALM_FATE_002', tradition:'Quiromancia occidental', category:'Línea del destino', feature:'presente', condition:'detected=true', location:'trayectoria vertical de la palma', associated_feature:'fate_line', traditional_meaning:'sentido de dirección, metas y camino profesional', alternative_meaning:'una relación cambiante con los planes y las decisiones personales', source:'Diccionario editorial de Quiromancia', source_quality:'cultural-summary', confidence_of_rule:.44, notes:'No predice éxito, profesión ni acontecimientos.', contraindications:[], conflicting_rules:[] },
  { rule_id:'PALM_FORM_001', tradition:'Quiromancia occidental', category:'Forma de la mano', feature:'indeterminada', condition:'element=indeterminado', location:'palma y dedos', associated_feature:'hand_shape', traditional_meaning:'no se puede clasificar de forma fiable con esta captura', alternative_meaning:'tomar una foto más clara y frontal', source:'Política de prudencia de Quiromancia', source_quality:'internal-safety', confidence_of_rule:.95, notes:'No completar rasgos no observables.', contraindications:[], conflicting_rules:[] }
];


// Guía de Cheiro (Language of the Hand): rasgos que la foto no mide, para que el usuario los reconozca en su propia mano.
export const CHEIRO_TYPES = [
  ['Elemental', 'palma gruesa y grande con dedos cortos y torpes y pocas líneas.', 'Cheiro lo considera el tipo más sencillo: una naturaleza muy ligada al cuerpo y a lo instintivo, con poca inclinación al pensamiento abstracto.'],
  ['Cuadrada', 'palma cuadrada en la muñeca y en la base de los dedos, y puntas de dedos cuadradas.', 'Orden, puntualidad y método. Respeta la ley y la costumbre, prefiere la razón al impulso, es perseverante y práctica, y se destaca más por el trabajo constante que por la inspiración.'],
  ['Espatulada', 'puntas anchas, en forma de espátula, y palma ancha en la muñeca o en la base de los dedos.', 'Amor por la acción, la energía y la independencia. Es la mano de los exploradores, los inventores y los deportistas; inquieta, entusiasta y con necesidad de movimiento.'],
  ['Filosófica', 'mano larga y angulosa, dedos huesudos con nudos marcados y uñas largas.', 'Amor por el saber y el misterio. Piensa, estudia al ser humano y busca la verdad más que la riqueza; le gusta ser distinto y tener su propio camino.'],
  ['Cónica', 'mano mediana, palma algo estrecha hacia los dedos, dedos llenos en la base y de punta ligeramente cónica.', 'Impulso e instinto. Es artística, rápida de pensamiento y buena conversadora, pero se cansa pronto y le cuesta terminar lo que empieza.'],
  ['Psíquica', 'mano larga y estrecha, dedos muy largos, finos y puntiagudos; es el tipo más raro.', 'Sensibilidad, idealismo y vida interior. Cheiro la considera la más bella y a la vez la más vulnerable, poco práctica para las exigencias materiales.'],
  ['Mixta', 'no encaja en ninguno de los anteriores: dedos de distintas formas en una misma mano.', 'Versatilidad e ideas variadas. Se adapta a personas y circunstancias, es ingeniosa pero cambiante en la aplicación de sus talentos.']
];
export const CHEIRO_MOUNTS = [
  ['Venus', 'base del pulgar', 'afecto, simpatía, amor por la belleza, el color y la música, y vitalidad. Si es muy abultado, pasión intensa.'],
  ['Júpiter', 'base del índice', 'ambición, orgullo, entusiasmo y deseo de liderar.'],
  ['Saturno', 'base del dedo medio', 'amor por la soledad y la quietud, prudencia, seriedad en el trabajo y gusto por lo sobrio.'],
  ['Sol (Apolo)', 'base del anular', 'aprecio por la belleza, el arte y la literatura, e imaginación nativa.'],
  ['Mercurio', 'base del meñique', 'ingenio, rapidez de pensamiento y de palabra, y gusto por el cambio, el viaje y el comercio.'],
  ['Marte', 'dos zonas: bajo Júpiter por dentro de la línea de la vida, y entre Mercurio y la Luna', 'la primera, valor activo y espíritu combativo; la segunda, valor pasivo, autocontrol y resistencia.'],
  ['Luna', 'borde de la mano, frente al monte de Venus', 'refinamiento, imaginación, ideales y gusto por la poesía y los paisajes.']
];
export const CHEIRO_NAILS = 'Cheiro: las uñas largas se asocian con calma, idealismo, sensibilidad artística y una tendencia a evitar lo desagradable; las uñas cortas, con espíritu crítico, lógica, humor agudo y gusto por el debate; las uñas más anchas que largas, con carácter combativo y tendencia a meterse en asuntos ajenos; las uñas mordidas, con preocupación o nerviosismo.';
const clamp = (n, min=0, max=1) => Math.max(min, Math.min(max, n));
const line = (analysis, feature) => analysis.lines.find(item => item.feature === feature);

const LINE_MEANINGS = {
  heart_line: {
    title: 'Mundo emocional y vínculos',
    explanation: 'En la tradición quiromántica, la línea del corazón se relaciona con la manera simbólica en que una persona vive el afecto, expresa sus emociones y construye vínculos. No dice si alguien ama “bien” o “mal”: se observa como una invitación a pensar si suele mostrar lo que siente, protegerse o buscar relaciones profundas.',
    details: 'Para Cheiro, la línea del corazón debe ser clara y bien marcada. Si nace bajo Júpiter (el índice), habla de un afecto idealista y leal; si nace bajo Saturno (el dedo medio), de un afecto más apasionado y menos demostrativo; si nace entre ambos, de una naturaleza más tranquila y serena en el amor. Una línea pálida y sin ramas se asocia con un afecto contenido, y una línea con muchas rayitas, con inconstancia en los vínculos. Una línea curva suele asociarse con expresividad. Son matices simbólicos, no un juicio sobre cómo amas.',
    reflection: 'Puede servir como reflexión sobre cómo das cariño, cómo recibes afecto y qué necesitas para sentir confianza en una relación.'
  },
  head_line: {
    title: 'Pensamiento, decisiones e imaginación',
    explanation: 'La línea de la cabeza representa tradicionalmente el estilo de pensamiento: cómo se organizan las ideas, cómo se toman decisiones y qué lugar tienen el análisis, la creatividad y la intuición. No mide inteligencia, memoria, estudios ni capacidad profesional.',
    details: 'Según Cheiro, una línea de la cabeza recta, clara y pareja habla de sentido práctico y de apego a lo concreto; con una ligera inclinación en la segunda mitad, de equilibrio entre lo práctico y lo imaginativo; con inclinación en toda su extensión, de inclinación al trabajo imaginativo; y muy inclinada, de idealismo y espíritu romántico. Una línea muy larga y recta se asocia con un intelecto fuerte. Cheiro insiste en que pesa más o menos según el tipo de mano. Son matices simbólicos, no diagnósticos de personalidad.',
    reflection: 'Puede invitarte a observar si decides con lógica, intuición o una combinación de ambas, y cómo equilibras pensar mucho con pasar a la acción.'
  },
  life_line: {
    title: 'Vitalidad, ritmo y manera de vivir',
    explanation: 'La línea de la vida se interpreta tradicionalmente como un símbolo de vitalidad, energía, ritmo personal y relación con las experiencias. No indica cuánto va a vivir una persona, no predice la muerte y no diagnostica salud.',
    details: 'Según Cheiro, la línea de la vida debe ser larga, delgada, profunda y sin cortes; una línea que se abre hacia la palma, dando espacio al monte de Venus, se lee como vitalidad, mientras que una línea pegada al pulgar se lee como un cuerpo menos robusto. Una línea con aspecto de cadena se asocia con altibajos de energía. Aquí solo se toma como un símbolo de ritmo y vitalidad: Cheiro la usaba también para hablar de la duración de la vida, y eso no lo hacemos. Un arco amplio suele asociarse con entusiasmo y apertura a explorar. La profundidad aparente puede describirse como intensidad dentro de la imagen, pero no como fuerza física real. Los cortes, cambios o diferencias entre fotografías pueden deberse a luz, postura, piel y calidad de la captura.',
    reflection: 'Puede ayudarte a preguntarte qué actividades te recargan, qué ritmo de vida te conviene y dónde necesitas reservar energía para ti.'
  },
  fate_line: {
    title: 'Dirección, metas y cambios de rumbo',
    explanation: 'La línea del destino, también llamada de Saturno en algunas escuelas, se relaciona simbólicamente con el sentido de dirección, los objetivos y la manera en que una persona siente que avanza por su vida. Tradicionalmente se vincula con trabajo, responsabilidades e influencias externas, pero no predice una profesión ni garantiza éxito.',
    details: 'Cheiro advierte que su importancia depende del tipo de mano: es menos significativa en manos elementales o espatuladas que en manos cuadradas, filosóficas, cónicas o psíquicas, y aun así una línea corta y clara en una mano cuadrada pesa más que una larga en una cónica. Cuando parece visible, puede leerse como una sensación de propósito o de orientación hacia ciertas metas. Cuando no se distingue, la tradición suele hablar de un camino más flexible, construido mediante varias decisiones y oportunidades, no de falta de destino. Una trayectoria irregular se interpreta como posibles cambios de etapa o de prioridades.',
    reflection: 'Puede invitarte a revisar qué metas son realmente tuyas, qué decisiones dependen de ti y dónde estás abierto a cambiar de rumbo.'
  }
};

const ELEMENT_MEANINGS = {
  Tierra: { title:'Mano de Tierra', text:'Palma cuadrada y dedos cortos. La tradición la asocia con un carácter práctico, constante y con los pies en la tierra: prefiere lo concreto, valora la estabilidad y disfruta construyendo paso a paso.' },
  Aire: { title:'Mano de Aire', text:'Palma cuadrada y dedos largos. Se vincula con la curiosidad, la comunicación y el pensamiento ágil: le gusta aprender, conversar y entender cómo funcionan las cosas.' },
  Fuego: { title:'Mano de Fuego', text:'Palma alargada y dedos cortos. Se relaciona con el entusiasmo, la energía y la iniciativa: actúa con impulso, se motiva con los retos y contagia ánimo.' },
  Agua: { title:'Mano de Agua', text:'Palma alargada y dedos largos. Se asocia con la sensibilidad, la intuición y la imaginación: percibe matices emocionales y conecta con lo creativo.' }
};
const INDEX_RING_MEANINGS = {
  'índice más largo': 'Cheiro asocia un índice (dedo de Júpiter) largo con orgullo, deseo de dirigir y de que las cosas se hagan a tu manera. Si es muy largo, puede mostrarse como tendencia a imponer tu criterio.',
  'anular más largo': 'Cheiro asocia un anular (dedo del Sol) casi tan largo como el índice con ambición de honor y de reconocimiento a través del arte o la creatividad, y con gusto por el riesgo. Si es muy largo, dice que la persona mira la vida un poco como una apuesta.',
  'índice y anular parecidos': 'Cuando índice y anular miden casi lo mismo, se lee como equilibrio entre la ambición de dirigir (Júpiter) y el deseo de brillar o crear (Sol). Es una lectura de escuelas modernas, no de Cheiro.'
};
const THUMB_MEANINGS = {
  'muy abierto': 'Según Cheiro, un pulgar que se separa mucho de la mano muestra un espíritu muy independiente que no tolera ser controlado; la parte a cuidar es no volverte tajante con los demás.',
  'abierto con naturalidad': 'Cheiro considera el pulgar con una inclinación natural hacia los dedos, ni pegado ni en ángulo recto, como el punto medio ideal: independencia suficiente para tener carácter y prudencia para cuidar tus asuntos, con fuerza de voluntad y decisión.',
  'cercano a la mano': 'Según Cheiro, un pulgar muy pegado a los dedos se asocia con una naturaleza cautelosa y reservada, de poco hablar y que cuesta de leer: alguien que no suele mostrar lo que piensa ni lo que va a hacer.'
};
const FINGER_LENGTH_MEANINGS = {
  largos: 'Cheiro asocia los dedos largos con amor por el detalle: personas exactas, que notan las pequeñas atenciones y a veces se preocupan por cosas menores.',
  cortos: 'Cheiro asocia los dedos cortos con rapidez e impulso: se ve el conjunto más que el detalle, se decide pronto, se habla con franqueza y a veces se saca una conclusión demasiado rápido.'
};

export function shapeReading(analysis) {
  const m = analysis?.shape?.measures;
  if (!m) return null;
  return { element:m.element, title:ELEMENT_MEANINGS[m.element].title, shapeText:ELEMENT_MEANINGS[m.element].text, palm:m.palmShape, fingers:m.fingerLength, indexVsRing:m.indexVsRing, indexText:INDEX_RING_MEANINGS[m.indexVsRing], thumb:m.thumbOpening, thumbAngle:m.thumbAngle, thumbText:THUMB_MEANINGS[m.thumbOpening], fingerText:FINGER_LENGTH_MEANINGS[m.fingerLength] };
}

const handLabel = hand => hand === 'left' ? 'izquierda' : 'derecha';
export function dominanceRole(hand, dominance) {
  if (dominance === 'both') return 'ambidiestra';
  if (!dominance) return '';
  return hand === dominance ? 'dominante' : 'no dominante';
}

export function compareHands(left, right) {
  const comparisons = ['heart_line','head_line','life_line','fate_line'].map(feature => {
    const a=line(left,feature), b=line(right,feature);
    if (!a || !b || !a.detected || !b.detected) return { feature, status:'indeterminado', fact:'No hay suficiente evidencia comparable en ambas fotografías.' };
    const difference=Math.abs(a.confidence-b.confidence);
    return { feature, status:difference < .12 ? 'similar' : 'diferencia visual candidata', fact:difference < .12 ? 'La claridad aparente es similar en ambas palmas.' : 'La claridad aparente cambia entre las dos fotografías; puede deberse a luz, posición o cámara.', leftConfidence:a.confidence, rightConfidence:b.confidence };
  });
  return { convention:'Algunas escuelas usan mano dominante/no dominante como convención simbólica; no es un hecho científicamente demostrado.', visualFacts:comparisons, interpretation:'Las dos imágenes se comparan como fotografías independientes. Un cambio pequeño no prueba que las líneas hayan cambiado: también puede explicarse por iluminación, postura o detección.' };
}

// Evalúa la condición real de cada regla (antes solo se miraba si la línea estaba "detectada").
function conditionHolds(item, condition) {
  const m = /^([a-z_]+)\s*(>=|<=|>|<|=)\s*(.+)$/i.exec(condition || '');
  if (!m) return false;
  const [, key, op, raw] = m;
  const value = item?.[key];
  if (raw === 'true' || raw === 'false') return Boolean(value) === (raw === 'true');
  const num = Number(raw);
  if (op !== '=' || !Number.isNaN(num) && typeof value === 'number') {
    if (typeof value !== 'number') return false;
    return op === '>=' ? value >= num : op === '<=' ? value <= num : op === '>' ? value > num : op === '<' ? value < num : value === num;
  }
  return String(value ?? '').toLowerCase().startsWith(raw.toLowerCase());
}

function matchingRules(analysis) {
  const selected=[];
  for (const rule of KNOWLEDGE_BASE) {
    const item = rule.associated_feature === 'hand_shape' ? analysis.shape : line(analysis, rule.associated_feature);
    if (!item) continue;
    const absenceRule = /detected\s*=\s*false/.test(rule.condition) && item.status !== 'not_visible';
    const eligible = absenceRule || item.confidence >= .4;
    if (eligible && conditionHolds(item, rule.condition)) selected.push({ ...rule, detectionConfidence:item.confidence, interpretationConfidence:round(clamp(rule.confidence_of_rule * Math.max(item.confidence, .5))) });
  }
  return selected;
}
function round(value) { return Number(value.toFixed(2)); }


// Variantes según lo que se midió en la foto de cada línea (longitud, marca y continuidad).
const VARIANTS = {
  heart_line: {
    length: { larga: 'Tu línea del corazón se ve larga: la tradición la asocia con afecto expresivo, deseo de vínculos profundos y generosidad emocional.', media: 'Tu línea del corazón es de longitud media: se lee como un equilibrio entre abrirte a los demás y cuidar tu espacio.', corta: 'Tu línea del corazón se ve corta: se asocia con un afecto más contenido o práctico, que se muestra más con hechos que con palabras.' },
    depth: { marcada: 'Aparece marcada, algo que simbólicamente se vincula con emociones vividas con intensidad.', suave: 'Aparece suave, lo que se interpreta como una sensibilidad discreta y matizada.' },
    cont: { continua: 'Al verse continua, la tradición habla de una forma estable y coherente de querer.', tenue: 'Con tramos tenues, se lee como una vida afectiva que cambia de ritmo según la etapa.' }
  },
  head_line: {
    length: { larga: 'Tu línea de la cabeza se ve larga: la tradición la vincula con atención sostenida, gusto por el detalle y pensamiento reflexivo.', media: 'Tu línea de la cabeza es de longitud media: se interpreta como equilibrio entre pensar y pasar a la acción.', corta: 'Tu línea de la cabeza se ve corta: se asocia con un pensamiento directo, práctico y decidido, que prefiere ir al grano.' },
    depth: { marcada: 'Está marcada: simbólicamente indica ideas con fuerza y convicción.', suave: 'Está suave: se lee como una mente flexible, abierta a cambiar de enfoque.' },
    cont: { continua: 'Al ser continua, se habla de coherencia al seguir un razonamiento hasta el final.', tenue: 'Con tramos tenues, se interpreta como un pensamiento que alterna momentos de claridad con pausas de duda o descanso.' }
  },
  life_line: {
    length: { larga: 'Tu línea de la vida se ve larga: se asocia con un ritmo constante y una vitalidad sostenida. No tiene relación con cuánto vas a vivir.', media: 'Tu línea de la vida es de longitud media: se lee como un ritmo moderado, con épocas de actividad y de calma.', corta: 'Tu línea de la vida se ve corta en la foto: se asocia con un ritmo más intenso y concentrado. Nunca indica la duración de la vida ni la salud.' },
    depth: { marcada: 'Aparece marcada: simbólicamente indica energía vivida con intensidad.', suave: 'Aparece suave: se interpreta como una vitalidad tranquila y adaptable.' },
    cont: { continua: 'Al verse continua, la tradición habla de constancia a lo largo de las etapas.', tenue: 'Con tramos tenues, se lee como una vida con cambios de ritmo que invitan a cuidar tus reservas de energía.' }
  },
  fate_line: {
    length: { larga: 'Tu línea del destino se ve larga: la tradición la vincula con un sentido claro de dirección y metas sostenidas.', media: 'Tu línea del destino es de longitud media: se interpreta como una dirección que se aclara por etapas.', corta: 'Tu línea del destino se ve corta: se asocia con metas por proyectos o etapas, más que con un solo camino fijo.' },
    depth: { marcada: 'Está marcada: simbólicamente indica propósito definido.', suave: 'Está suave: se lee como una vocación flexible.' },
    cont: { continua: 'Al ser continua, se asocia con constancia hacia lo que te propones.', tenue: 'Con tramos tenues, se interpreta como cambios de rumbo que forman parte de tu camino.' }
  }
};
function variantText(item) {
  const V = VARIANTS[item.feature]; if (!V) return '';
  const len = typeof item.length_normalized === 'number' ? (item.length_normalized >= .9 ? 'larga' : item.length_normalized >= .75 ? 'media' : 'corta') : null;
  const dep = item.depth === 'deep_apparent' ? 'marcada' : item.depth === 'light_apparent' ? 'suave' : null;
  const con = /tenu/.test(String(item.continuity)) ? 'tenue' : item.continuity === 'continua' ? 'continua' : null;
  return [len && V.length[len], dep && V.depth[dep], con && V.cont[con]].filter(Boolean).join(' ');
}

function buildFeatureReadings(hands) {
  return Object.entries(hands).flatMap(([hand, analysis]) => analysis.lines.map(item => {
    const candidates = matchingRules(analysis)
      .filter(rule => rule.associated_feature === item.feature)
      .sort((a, b) => b.interpretationConfidence - a.interpretationConfidence);
    const rule = candidates[0];
    const guide = LINE_MEANINGS[item.feature];
    const visible = item.detected && item.confidence >= .4;
    const fateAbsence = item.feature === 'fate_line' && !item.detected && rule?.rule_id === 'PALM_FATE_001';
    const meaning = visible || fateAbsence
      ? guide?.title || rule?.traditional_meaning || 'La tradición no ofrece una asociación suficientemente clara para este hallazgo.'
      : 'No hay un hallazgo suficientemente claro para asociar un significado tradicional.';
    const alternative = visible || fateAbsence
      ? rule?.alternative_meaning || 'La observación puede variar con la luz, el encuadre y la posición de la mano.'
      : 'Una fotografía con luz uniforme y la palma completa podría permitir una lectura más prudente.';
    return {
      hand,
      feature: item.feature,
      category: item.label,
      observation: item.observations.join('; '),
      detected: Boolean(item.detected),
      meaning,
      explanation: visible || fateAbsence ? guide?.explanation || rule?.traditional_meaning || '' : 'La imagen no permite describir esta línea con suficiente claridad. Por eso no conviene asignarle un significado.',
      details: visible || fateAbsence ? ((visible && variantText(item)) || guide?.details || '') : 'Una captura más nítida, frontal y con luz uniforme podría permitir una observación más prudente.',
      reflection: visible || fateAbsence ? guide?.reflection || '' : '',
      alternative,
      tradition: rule?.tradition || 'Lectura prudente',
      confidence: rule?.interpretationConfidence || 0,
      ruleId: rule?.rule_id || null
    };
  }));
}

export function applyPalmistryRules(hands, dominance, mode) {
  const rules = Object.entries(hands).flatMap(([hand, analysis]) => matchingRules(analysis).map(rule => ({ ...rule, hand })));
  const perHand = mode === 'complete' ? 8 : 5;
  const strongest = ['left','right'].flatMap(hand => rules.filter(rule => rule.hand === hand && rule.interpretationConfidence >= .2).slice(0, perHand));
  const facts = Object.entries(hands).flatMap(([hand, analysis]) => analysis.lines.filter(item => item.detected && item.confidence >= .4).map(item => ({ hand, feature:item.feature, observation:item.observations.join('; '), confidence:item.confidence, source:'observación visual provisional' })));
  const featureReadings = buildFeatureReadings(hands);
  const statements = strongest.map(rule => ({ hand:rule.hand, feature:rule.associated_feature, category:rule.category, text:`Tradicionalmente se interpreta como ${rule.traditional_meaning}.`, meaning:rule.traditional_meaning, alternative:rule.alternative_meaning, why:[`Observación: ${rule.feature}.`,`Ubicación: ${rule.location}.`,`Confianza visual: ${Math.round(rule.detectionConfidence*100)}% (no equivale a certeza científica).`], ruleId:rule.rule_id, tradition:rule.tradition, confidence:rule.interpretationConfidence }));
  return { rulesUsed:strongest, facts, statements, featureReadings, caveat:'Estas asociaciones pertenecen a tradiciones culturales de quiromancia y son recreativas; no describen hechos científicos ni predicen con certeza acontecimientos.', intensity: strongest.length >= 5 ? 'MODERATE' : 'LOW' };
}

export function buildReport(hands, comparison, interpretation, dominance, mode) {
  const quality = Object.fromEntries(Object.entries(hands).map(([hand, analysis]) => [hand, analysis.quality]));
  const perHand = (feature, fallback) => Object.entries(hands).map(([hand, analysis]) => {
    const item = line(analysis, feature);
    return `Palma ${handLabel(hand)}: ${item?.detected ? item.observations.join(', ') : fallback}.`;
  }).join(' ');
  const shapes = Object.entries(hands).map(([hand, analysis]) => [hand, shapeReading(analysis)]);
  const shapeText = shapes.map(([hand, r]) => r ? `Palma ${handLabel(hand)}: ${r.title} (palma ${r.palm}, dedos ${r.fingers}). ${r.shapeText}` : `Palma ${handLabel(hand)}: no se localizaron los puntos de la mano, así que la forma no se pudo medir.`).join(' ');
  const fingerText = shapes.map(([hand, r]) => r ? `Palma ${handLabel(hand)}: ${r.indexVsRing}; pulgar ${r.thumb} (${r.thumbAngle}°). ${r.fingerText || ''} ${r.indexText} ${r.thumbText}` : `Palma ${handLabel(hand)}: sin medidas de dedos en esta foto.`).join(' ');
  const elements = shapes.map(([, r]) => r?.element).filter(Boolean);
  const dominanceText = dominance === 'both'
    ? 'Elegiste ambidiestra: las dos manos se leen como igual de importantes.'
    : dominance ? `Según la convención que elegiste, tu mano ${handLabel(dominance)} (dominante) muestra lo que has desarrollado con tus decisiones, y la ${handLabel(dominance === 'left' ? 'right' : 'left')} (no dominante) tu potencial de origen.` : '';
  const elementCompare = elements.length === 2 ? (elements[0] === elements[1] ? ` En ambas manos la forma corresponde al elemento ${elements[0]}: una energía coherente entre lo que traes y lo que vives.` : ` La forma cambia entre manos (${elements[0]} y ${elements[1]}): la tradición lo lee como una evolución entre tu potencial y lo que has desarrollado.`) : '';
  return { reportVersion:'report-1.1', generatedAt:new Date().toISOString(), mode, dominance, visualFacts:interpretation.facts, interpretation, quality, sections:[
    { id:'summary', title:'Resumen de tu mano', text:'La lectura separa lo observado en la imagen de las asociaciones tradicionales. Las líneas se trazan sobre la posición real de tu mano y se toman como estimaciones, no como mediciones exactas.' },
    { id:'shape', title:'Forma de la mano', text:shapeText },
    { id:'heart', title:'Línea del corazón', text:perHand('heart_line', 'no se distingue con claridad en la foto, así que no se interpreta') },
    { id:'head', title:'Línea de la cabeza', text:perHand('head_line', 'no se distingue con claridad en la foto, así que no se interpreta') },
    { id:'life', title:'Línea de la vida', text:perHand('life_line', 'no se distingue con claridad en la foto, así que no se interpreta') + ' Una línea de la vida corta nunca se interpreta aquí como muerte temprana ni se usa para calcular longevidad.' },
    { id:'fate', title:'Línea del destino / Saturno', text:perHand('fate_line', 'presencia incierta; la tradición lo lee como un camino flexible') },
    { id:'fingers', title:'Dedos y pulgar', text:fingerText },
    { id:'comparison', title:'Comparación izquierda/derecha', text:`${dominanceText}${elementCompare} ${comparison.interpretation}`.trim() },
    { id:'secondary', title:'Qué más mirar en tu mano (según Cheiro)', text:'La foto no permite distinguir estos rasgos, pero tú puedes mirarlos en tu mano. Espacio entre la línea de la vida y la de la cabeza: si están muy pegadas, Cheiro lo lee como cautela y sensibilidad al juicio de los demás; si hay un espacio medio, como energía, libertad de acción y ganas de avanzar; si el espacio es muy ancho, como exceso de confianza e impulsividad. Línea del Sol (bajo el anular): se asocia con brillo, reconocimiento y gusto por el arte. Línea de Mercurio o de la salud (bajo el meñique): se asocia con comunicación, negocios y cuidado del cuerpo. Cinturón de Venus (arco sobre la línea del corazón): se asocia con una gran sensibilidad. Cheiro también describe islas, cruces, estrellas y cuadrados como marcas con significado; aquí no se interpretan, porque una foto normal no los distingue con seguridad.' },
    { id:'types', title:'Los siete tipos de mano (Cheiro)', text:CHEIRO_TYPES.map(t => `${t[0]}: ${t[1]} ${t[2]}`).join(' ') + ' Es una clasificación de Cheiro, distinta de los cuatro elementos de arriba; en la foto no se miden las puntas de los dedos, así que puedes comparar con tu mano.' },
    { id:'mounts', title:'Los montes de la mano (Cheiro)', text:'Cheiro llama monte a cada abultamiento de la palma y usa los nombres planetarios solo como atajo para describir cualidades. ' + CHEIRO_MOUNTS.map(m => `Monte de ${m[0]} (${m[1]}): ${m[2]}`).join(' ') + ' Cuando varios montes se inclinan unos hacia otros, sus cualidades se mezclan.' },
    { id:'nails', title:'Las uñas (Cheiro)', text:CHEIRO_NAILS },
    { id:'quality', title:'Nivel de calidad del escaneo', text:`Izquierda: ${Math.round(quality.left.score*100)}% · Derecha: ${Math.round(quality.right.score*100)}%` }
  ] };
}
