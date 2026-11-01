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

const clamp = (n, min=0, max=1) => Math.max(min, Math.min(max, n));
const line = (analysis, feature) => analysis.lines.find(item => item.feature === feature);

const LINE_MEANINGS = {
  heart_line: {
    title: 'Mundo emocional y vínculos',
    explanation: 'En la tradición quiromántica, la línea del corazón se relaciona con la manera simbólica en que una persona vive el afecto, expresa sus emociones y construye vínculos. No dice si alguien ama “bien” o “mal”: se observa como una invitación a pensar si suele mostrar lo que siente, protegerse o buscar relaciones profundas.',
    details: 'Una línea curva suele asociarse con expresividad y espontaneidad afectiva. Una trayectoria continua se interpreta como una forma relativamente estable de expresar los sentimientos. Su terminación y posibles bifurcaciones se leen como matices: apertura a distintas perspectivas, equilibrio entre idealismo y realismo o necesidad de comunicar mejor lo que se siente.',
    reflection: 'Puede servir como reflexión sobre cómo das cariño, cómo recibes afecto y qué necesitas para sentir confianza en una relación.'
  },
  head_line: {
    title: 'Pensamiento, decisiones e imaginación',
    explanation: 'La línea de la cabeza representa tradicionalmente el estilo de pensamiento: cómo se organizan las ideas, cómo se toman decisiones y qué lugar tienen el análisis, la creatividad y la intuición. No mide inteligencia, memoria, estudios ni capacidad profesional.',
    details: 'Una línea larga se asocia con atención sostenida y gusto por examinar los detalles. Una línea ligeramente inclinada suele vincularse con imaginación, intuición y pensamiento flexible. Si parece recta, algunas escuelas hablan de una mirada práctica; si desciende, de una tendencia más creativa o contemplativa. Son matices simbólicos, no diagnósticos de personalidad.',
    reflection: 'Puede invitarte a observar si decides con lógica, intuición o una combinación de ambas, y cómo equilibras pensar mucho con pasar a la acción.'
  },
  life_line: {
    title: 'Vitalidad, ritmo y manera de vivir',
    explanation: 'La línea de la vida se interpreta tradicionalmente como un símbolo de vitalidad, energía, ritmo personal y relación con las experiencias. No indica cuánto va a vivir una persona, no predice la muerte y no diagnostica salud.',
    details: 'Un arco amplio suele asociarse con entusiasmo, actividad y apertura a explorar. Una línea continua se lee como una sensación simbólica de constancia. La profundidad aparente puede describirse como intensidad dentro de la imagen, pero no como fuerza física real. Los cortes, cambios o diferencias entre fotografías pueden deberse a luz, postura, piel y calidad de la captura.',
    reflection: 'Puede ayudarte a preguntarte qué actividades te recargan, qué ritmo de vida te conviene y dónde necesitas reservar energía para ti.'
  },
  fate_line: {
    title: 'Dirección, metas y cambios de rumbo',
    explanation: 'La línea del destino, también llamada de Saturno en algunas escuelas, se relaciona simbólicamente con el sentido de dirección, los objetivos y la manera en que una persona siente que avanza por su vida. Tradicionalmente se vincula con trabajo, responsabilidades e influencias externas, pero no predice una profesión ni garantiza éxito.',
    details: 'Cuando parece visible, puede leerse como una sensación de propósito o de orientación hacia ciertas metas. Cuando no se distingue, la tradición suele hablar de un camino más flexible, construido mediante varias decisiones y oportunidades, no de falta de destino. Una trayectoria irregular se interpreta como posibles cambios de etapa o de prioridades.',
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
  'índice más largo': 'En la tradición, un índice (dedo de Júpiter) más largo que el anular se relaciona con confianza, liderazgo y deseo de dirigir el propio camino.',
  'anular más largo': 'Un anular (dedo de Apolo) más largo que el índice se asocia con creatividad, gusto por la expresión y disposición a arriesgarse por lo que se ama.',
  'índice y anular parecidos': 'Cuando índice y anular miden casi lo mismo, la tradición habla de equilibrio entre la ambición personal y la expresión creativa.'
};
const THUMB_MEANINGS = {
  'muy abierto': 'Un pulgar muy separado de la mano se lee como espíritu independiente, generosidad y facilidad para adaptarse.',
  'abierto con naturalidad': 'Un pulgar con una apertura natural se asocia con equilibrio entre independencia y prudencia.',
  'cercano a la mano': 'Un pulgar cerca de la mano se interpreta como reserva, prudencia y tendencia a cuidar lo propio antes de abrirse.'
};

export function shapeReading(analysis) {
  const m = analysis?.shape?.measures;
  if (!m) return null;
  return { element:m.element, title:ELEMENT_MEANINGS[m.element].title, shapeText:ELEMENT_MEANINGS[m.element].text, palm:m.palmShape, fingers:m.fingerLength, indexVsRing:m.indexVsRing, indexText:INDEX_RING_MEANINGS[m.indexVsRing], thumb:m.thumbOpening, thumbAngle:m.thumbAngle, thumbText:THUMB_MEANINGS[m.thumbOpening] };
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
  const fingerText = shapes.map(([hand, r]) => r ? `Palma ${handLabel(hand)}: ${r.indexVsRing}; pulgar ${r.thumb} (${r.thumbAngle}°). ${r.indexText} ${r.thumbText}` : `Palma ${handLabel(hand)}: sin medidas de dedos en esta foto.`).join(' ');
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
    { id:'secondary', title:'Líneas secundarias', text:'Las líneas del Sol, Mercurio, el cinturón de Venus y los brazaletes no se interpretan: una foto normal no permite distinguirlas con seguridad.' },
    { id:'quality', title:'Nivel de calidad del escaneo', text:`Izquierda: ${Math.round(quality.left.score*100)}% · Derecha: ${Math.round(quality.right.score*100)}%` }
  ] };
}
