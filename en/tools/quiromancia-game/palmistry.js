export const RULES_VERSION = 'traditional-rules-1.1';

export const KNOWLEDGE_BASE = [
  { rule_id:'PALM_HEART_001', tradition:'Western palmistry', category:'Heart line', feature:'curva', condition:'curvature=curva', location:'trayectoria', associated_feature:'heart_line', traditional_meaning:'expressiveness and display of affection', alternative_meaning:'emotional sensitivity expressed spontaneously', source:'Aura Palma’s Editorial Dictionary', source_quality:'cultural-summary', confidence_of_rule:.52, notes:'Traditional, non-scientific association.', contraindications:['Not for diagnosing mental health.'], conflicting_rules:[] },
  { rule_id:'PALM_HEART_002', tradition:'Western palmistry', category:'Heart line', feature:'final fork', condition:'forks>0', location:'ending', associated_feature:'heart_line', traditional_meaning:'ability to understand different emotional perspectives', alternative_meaning:'balance between idealism and realism', source:'Aura Palma’s Editorial Dictionary', source_quality:'cultural-summary', confidence_of_rule:.48, notes:'Requires a confirmed visual fork.', contraindications:[], conflicting_rules:[] },
  { rule_id:'PALM_HEAD_001', tradition:'Western palmistry', category:'Head line', feature:'larga', condition:'length_normalized>=.7', location:'trayectoria', associated_feature:'head_line', traditional_meaning:'detailed thinking and a tendency to analyze', alternative_meaning:'sustained concentration', source:'Aura Palma’s Editorial Dictionary', source_quality:'cultural-summary', confidence_of_rule:.5, notes:'It is not a measure of intellectual ability.', contraindications:[], conflicting_rules:[] },
  { rule_id:'PALM_HEAD_002', tradition:'Western palmistry', category:'Head line', feature:'inclinada', condition:'curvature=slightly tilted', location:'trayectoria', associated_feature:'head_line', traditional_meaning:'imagination, creativity, or intuition', alternative_meaning:'flexible thinking', source:'Aura Palma’s Editorial Dictionary', source_quality:'cultural-summary', confidence_of_rule:.46, notes:'Traditional interpretation.', contraindications:['Never turn this into a diagnosis.'], conflicting_rules:[] },
  { rule_id:'PALM_LIFE_001', tradition:'Western palmistry', category:'Life line', feature:'wide arc', condition:'curvature=wide arc', location:'trayectoria', associated_feature:'life_line', traditional_meaning:'enthusiasm, activity and openness to experience', alternative_meaning:'expansive approach to life, according to tradition', source:'Aura Palma’s Editorial Dictionary', source_quality:'cultural-summary', confidence_of_rule:.49, notes:'A short line does not mean a short life.', contraindications:['Do not predict death or longevity.'], conflicting_rules:[] },
  { rule_id:'PALM_FATE_001', tradition:'Western palmistry', category:'Fate line', feature:'incierta', condition:'detected=false', location:'palma', associated_feature:'fate_line', traditional_meaning:'a flexible path, or one less defined by a single direction', alternative_meaning:'multiple possible paths', source:'Palmistry Editorial Dictionary', source_quality:'cultural-summary', confidence_of_rule:.42, notes:'The absence of a visible line is not penalized.', contraindications:[], conflicting_rules:[] },
  { rule_id:'PALM_FATE_002', tradition:'Western palmistry', category:'Fate line', feature:'presente', condition:'detected=true', location:'vertical path of the palm', associated_feature:'fate_line', traditional_meaning:'sense of direction, goals, and career path', alternative_meaning:'a changing relationship with plans and personal decisions', source:'Palmistry Editorial Dictionary', source_quality:'cultural-summary', confidence_of_rule:.44, notes:'It does not predict success, career or events.', contraindications:[], conflicting_rules:[] },
  { rule_id:'PALM_FORM_001', tradition:'Western palmistry', category:'Hand shape', feature:'indeterminada', condition:'element=indeterminado', location:'palm and fingers', associated_feature:'hand_shape', traditional_meaning:'cannot be reliably classified from this capture', alternative_meaning:'take a clearer, front-facing photo', source:'Palmistry Caution Policy', source_quality:'internal-safety', confidence_of_rule:.95, notes:'Do not fill in traits that cannot be observed.', contraindications:[], conflicting_rules:[] }
];


// Guía de Cheiro (Language of the Hand): rasgos que la foto no mide, para que el usuario los reconozca en su propia mano.
export const CHEIRO_TYPES = [
  ['Elemental', 'thick, large palm with short, clumsy fingers and few lines.', 'Cheiro considers it the simplest type: a nature closely tied to the body and the instinctive, with little inclination toward abstract thought.'],
  ['Cuadrada', 'square palm at the wrist and at the base of the fingers, and square fingertips.', 'Order, punctuality, and method. Respects law and custom, prefers reason to impulse, is persevering and practical, and stands out more for steady work than for inspiration.'],
  ['Espatulada', 'broad, spatula-shaped fingertips, and a palm that is wide at the wrist or at the base of the fingers.', 'Love of action, energy and independence. This is the hand of explorers, inventors and athletes: restless, enthusiastic and in need of movement.'],
  ['Philosophic', 'long, angular hand, bony fingers with pronounced knuckles, and long nails.', 'Love of knowledge and mystery. It thinks, studies human nature and seeks truth more than wealth; it likes being different and having its own path.'],
  ['Conic', 'medium-sized hand, palm somewhat narrow toward the fingers, fingers full at the base and slightly conical at the tips.', 'Impulse and instinct. It is artistic, quick-thinking and a good conversationalist, but tires soon and struggles to finish what it starts.'],
  ['Psychic', 'long, narrow hand, with very long, slender, pointed fingers; this is the rarest type.', 'Sensitivity, idealism and inner life. Cheiro considers it the most beautiful and at the same time the most vulnerable, impractical when it comes to material demands.'],
  ['Mixta', 'doesn’t fit any of the above: fingers of different shapes on the same hand.', 'Versatility and varied ideas. It adapts to people and circumstances, and is ingenious but changeable in how it applies its talents.']
];
export const CHEIRO_MOUNTS = [
  ['Venus', 'base of the thumb', 'affection, warmth, love of beauty, color, and music, and vitality. If very prominent, intense passion.'],
  ['Jupiter', 'base of the index finger', 'ambition, pride, enthusiasm and a desire to lead.'],
  ['Saturn', 'base of the middle finger', 'love of solitude and quiet, prudence, seriousness in work, and a taste for the sober.'],
  ['Sun (Apollo)', 'base of the ring finger', 'appreciation of beauty, art, and literature, and a natural imagination.'],
  ['Mercury', 'base of the little finger', 'wit, quickness of thought and speech, and a liking for change, travel, and commerce.'],
  ['Mars', 'two zones: under Jupiter on the inside of the life line, and between Mercury and the Moon', 'the first, active courage and a fighting spirit; the second, passive courage, self-control and endurance.'],
  ['Moon', 'edge of the hand, opposite the mount of Venus', 'refinement, imagination, ideals, and a taste for poetry and landscapes.']
];
export const CHEIRO_NAILS = 'Cheiro: long nails are associated with calm, idealism, artistic sensitivity and a tendency to avoid the unpleasant; short nails, with a critical spirit, logic, sharp humor and a taste for debate; nails wider than they are long, with a combative character and a tendency to meddle in other people’s affairs; bitten nails, with worry or nervousness.';

// Benham, The Laws of Scientific Hand-Reading (Parte II): cómo leer el carácter de una línea y qué destaca cada línea principal.
const BENHAM_LINE_FOCUS = { heart_line: 'affection and the warmth with which you bond with others', head_line: 'the mind, concentration, and self-control', life_line: 'vitality and physical energy', fate_line: 'your material direction and the effort you put into your goals' };
const BENHAM_LINE_READING = 'Benham suggests first reading the character of each line: the more even, clear, and deep it is, and the less broken, crossed, or marked with islands, the better what it represents is expressed. A wide, shallow line is read as scattered energy that is hard to turn into results. If one line is noticeably deeper than the others, what it represents is your strongest point; if it is the weakest, it is the point to look after. According to Benham, vertical lines favor the flow of energy, and horizontal lines that cross them interrupt it; an irregular line is read from beginning to end, because the thin and deep stretches correspond to stages of different effort. He makes clear that lines change with time and experience, so they are a map of tendencies, not a verdict.';
function strongestWeakest(analysis) {
  const items = (analysis.lines || []).filter(item => item.detected && item.confidence >= .4);
  if (items.length < 3) return null;
  const score = item => item.confidence + (item.depth === 'deep_apparent' ? .2 : item.depth === 'light_apparent' ? -.1 : 0);
  const sorted = [...items].sort((a, b) => score(b) - score(a));
  if (score(sorted[0]) - score(sorted[sorted.length - 1]) < .12) return null;
  return { strong: sorted[0].feature, weak: sorted[sorted.length - 1].feature };
}
const clamp = (n, min=0, max=1) => Math.max(min, Math.min(max, n));
const line = (analysis, feature) => analysis.lines.find(item => item.feature === feature);

const LINE_MEANINGS = {
  heart_line: {
    title: 'Emotional world and bonds',
    explanation: 'In the palmistry tradition, the heart line is linked to the symbolic way a person experiences affection, expresses emotions, and builds bonds. It doesn’t say whether someone loves “well” or “badly”: it’s seen as an invitation to think about whether they tend to show what they feel, protect themselves, or seek deep relationships.',
    details: 'For Cheiro, the heart line should be clear and well marked. If it starts under Jupiter (the index finger), it speaks of idealistic, loyal affection; if it starts under Saturn (the middle finger), of more passionate and less demonstrative affection; if it starts between the two, of a calmer, more serene nature in love. A pale line without branches is associated with restrained affection, and a line with many little marks, with inconstancy in relationships. A curved line is usually associated with expressiveness. Benham observes that in most hands the heart line starts deep and ends wider and more shallow, because in the first twenty years the heart acts with more force and over time one tends to love with more caution. These are symbolic nuances, not a judgment on how you love.',
    reflection: 'It can serve as a reflection on how you show affection, how you receive it and what you need to feel trust in a relationship.'
  },
  head_line: {
    title: 'Thought, decisions, and imagination',
    explanation: 'The head line traditionally represents your style of thinking: how ideas are organized, how decisions are made, and what place analysis, creativity, and intuition have. It does not measure intelligence, memory, education, or professional ability.',
    details: 'According to Cheiro, a head line that is straight, clear and even speaks of practical sense and attachment to the concrete; with a slight slope in the second half, of a balance between the practical and the imaginative; sloping along its whole length, of an inclination toward imaginative work; and steeply sloped, of idealism and a romantic spirit. A very long, straight line is associated with a strong intellect. Cheiro insists that it carries more or less weight depending on the type of hand. Benham links it to the amount of mentality, concentration and self-control. These are symbolic nuances, not personality diagnoses.',
    reflection: 'It may invite you to notice whether you decide through logic, intuition, or a mix of both, and how you balance thinking a lot with taking action.'
  },
  life_line: {
    title: 'Vitality, rhythm, and way of living',
    explanation: 'The life line is traditionally interpreted as a symbol of vitality, energy, personal rhythm and relationship to experiences. It does not indicate how long a person will live, does not predict death and does not diagnose health.',
    details: 'According to Cheiro, the life line should be long, thin, deep, and unbroken; a line that opens out toward the palm, leaving room for the mount of Venus, is read as vitality, while a line hugging the thumb is read as a less robust body. A chain-like line is associated with ups and downs in energy. Here it is taken only as a symbol of rhythm and vitality: Cheiro also used it to speak about length of life, and we don’t do that. A wide arc is usually associated with enthusiasm and openness to exploring. Apparent depth can be described as intensity within the image, but not as real physical strength. Breaks, changes, or differences between photos may be due to light, posture, skin, and capture quality.',
    reflection: 'It can help you ask yourself which activities recharge you, what pace of life suits you, and where you need to set aside energy for yourself.'
  },
  fate_line: {
    title: 'Direction, goals and changes of course',
    explanation: 'The fate line, also called the line of Saturn in some schools, is symbolically linked to a sense of direction, goals, and the way a person feels they are moving through life. Traditionally it is connected with work, responsibilities, and outside influences, but it doesn’t predict a profession or guarantee success.',
    details: 'Benham adds that what is called “luck” on this line is usually work, health, perseverance, and a good eye for opportunities, not chance. Cheiro warns that its importance depends on the type of hand: it is less significant on elementary or spatulate hands than on square, philosophic, conic, or psychic hands, and even so a short, clear line on a square hand weighs more than a long one on a conic hand. When it appears visible, it can be read as a sense of purpose or of direction toward certain goals. When it can’t be made out, tradition usually speaks of a more flexible path, built through several decisions and opportunities, not a lack of destiny. An irregular course is interpreted as possible changes of stage or priorities.',
    reflection: 'It can invite you to review which goals are truly yours, which decisions depend on you and where you are open to changing course.'
  }
};

const ELEMENT_MEANINGS = {
  Tierra: { title:'Earth Hand', text:'Square palm and short fingers. Tradition associates it with a practical, steady, down-to-earth character: it prefers the concrete, values stability, and enjoys building step by step.' },
  Aire: { title:'Air Hand', text:'Square palm and long fingers. Linked to curiosity, communication, and quick thinking: you like to learn, chat, and understand how things work.' },
  Fuego: { title:'Fire Hand', text:'Elongated palm and short fingers. It is associated with enthusiasm, energy and initiative: it acts on impulse, is motivated by challenges and spreads good spirits.' },
  Agua: { title:'Water Hand', text:'Elongated palm and long fingers. It is associated with sensitivity, intuition, and imagination: it perceives emotional nuances and connects with the creative.' }
};
const INDEX_RING_MEANINGS = {
  'longer index finger': 'Cheiro associates a long index finger (Jupiter finger) with pride, a desire to lead, and wanting things done your way. If it’s very long, it can show up as a tendency to impose your own judgment.',
  'longer ring finger': 'Cheiro associates a ring finger (the finger of the Sun) almost as long as the index finger with ambition for honor and recognition through art or creativity, and with a taste for risk. If it is very long, he says the person looks at life somewhat like a gamble.',
  'index and ring fingers similar': 'When the index and ring fingers are almost the same length, it is read as a balance between the ambition to lead (Jupiter) and the desire to shine or create (Sun). This is a reading from modern schools, not from Cheiro.'
};
const THUMB_MEANINGS = {
  'very open': 'According to Cheiro, a thumb that stands far out from the hand shows a very independent spirit that won’t tolerate being controlled; the thing to watch is not becoming curt with others.',
  'naturally open': 'Cheiro considers a thumb with a natural inclination toward the fingers, neither pressed against them nor at a right angle, to be the ideal middle point: enough independence to have character and enough prudence to look after your affairs, with willpower and decisiveness.',
  'close to the hand': 'According to Cheiro, a thumb held very close to the fingers is associated with a cautious, reserved nature, of few words and hard to read: someone who doesn’t usually show what they think or what they’re going to do.'
};
const FINGER_LENGTH_MEANINGS = {
  largos: 'Cheiro associates long fingers with love of detail: precise people who notice small courtesies and sometimes worry about minor things.',
  cortos: 'Cheiro associates short fingers with quickness and impulse: you see the whole more than the detail, decide quickly, speak frankly, and sometimes jump to a conclusion too fast.'
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
  return hand === dominance ? 'dominante' : 'non-dominant';
}

export function compareHands(left, right) {
  const comparisons = ['heart_line','head_line','life_line','fate_line'].map(feature => {
    const a=line(left,feature), b=line(right,feature);
    if (!a || !b || !a.detected || !b.detected) return { feature, status:'indeterminado', fact:'There is not enough comparable evidence in both photographs.' };
    const difference=Math.abs(a.confidence-b.confidence);
    return { feature, status:difference < .12 ? 'similar' : 'candidate visual difference', fact:difference < .12 ? 'The apparent clarity is similar in both palms.' : 'The apparent clarity changes between the two photographs; this may be due to light, position or camera.', leftConfidence:a.confidence, rightConfidence:b.confidence };
  });
  return { convention:'Some schools use dominant/non-dominant hand as a symbolic convention; it is not a scientifically proven fact.', visualFacts:comparisons, interpretation:'The two images are compared as independent photographs. A small difference does not prove the lines have changed: it can also be explained by lighting, posture, or detection.' };
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
    length: { larga: 'Your heart line looks long: tradition associates it with expressive affection, a desire for deep bonds and emotional generosity.', media: 'Your heart line is of medium length: it’s read as a balance between opening up to others and looking after your own space.', corta: 'Your heart line looks short: it is associated with more restrained or practical affection, shown more through actions than words.' },
    depth: { marcada: 'It appears pronounced, something symbolically linked to emotions experienced with intensity.', suave: 'It appears soft, which is interpreted as a discreet, nuanced sensitivity.' },
    cont: { continua: 'Since it looks continuous, tradition speaks of a stable, coherent way of loving.', tenue: 'With faint stretches, it reads as an emotional life that changes pace depending on the stage.' }
  },
  head_line: {
    length: { larga: 'Your head line looks long: tradition links it with sustained attention, a taste for detail, and reflective thinking.', media: 'Your head line is of medium length: it is interpreted as a balance between thinking and taking action.', corta: 'Your head line looks short: it is associated with direct, practical, decisive thinking that prefers to get to the point.' },
    depth: { marcada: 'It is well marked: symbolically it indicates ideas held with strength and conviction.', suave: 'It looks soft: it is read as a flexible mind, open to changing approach.' },
    cont: { continua: 'Being continuous, it speaks of coherence in following a line of reasoning through to the end.', tenue: 'With faint stretches, it is interpreted as thinking that alternates moments of clarity with pauses of doubt or rest.' }
  },
  life_line: {
    length: { larga: 'Your life line looks long: it is associated with a steady rhythm and sustained vitality. It has no relation to how long you will live.', media: 'Your life line is of medium length: it reads as a moderate rhythm, with times of activity and times of calm.', corta: 'Your life line looks short in the photo: it’s associated with a more intense, concentrated rhythm. It never indicates length of life or health.' },
    depth: { marcada: 'It appears marked: symbolically it indicates energy lived intensely.', suave: 'It appears soft: it is interpreted as a calm, adaptable vitality.' },
    cont: { continua: 'Since it looks continuous, tradition speaks of constancy across life’s stages.', tenue: 'With faint stretches, it is read as a life with changes of pace that invite you to look after your energy reserves.' }
  },
  fate_line: {
    length: { larga: 'Your fate line looks long: tradition links it with a clear sense of direction and sustained goals.', media: 'Your fate line is of medium length: it’s interpreted as a direction that becomes clearer in stages.', corta: 'Your fate line looks short: it is associated with goals set by projects or stages, rather than a single fixed path.' },
    depth: { marcada: 'It is pronounced: symbolically it indicates a defined purpose.', suave: 'It is soft: it’s read as a flexible vocation.' },
    cont: { continua: 'Being continuous, it is associated with steadiness toward what you set out to do.', tenue: 'With faint stretches, it is interpreted as changes of course that are part of your path.' }
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
      ? guide?.title || rule?.traditional_meaning || 'Tradition doesn’t offer a clear enough association for this finding.'
      : 'There is no finding clear enough to associate a traditional meaning.';
    const alternative = visible || fateAbsence
      ? rule?.alternative_meaning || 'The observation may vary with the light, the framing and the position of the hand.'
      : 'A photo with even light and the whole palm could allow a more cautious reading.';
    return {
      hand,
      feature: item.feature,
      category: item.label,
      observation: item.observations.join('; '),
      detected: Boolean(item.detected),
      meaning,
      explanation: visible || fateAbsence ? guide?.explanation || rule?.traditional_meaning || '' : 'The image doesn’t allow this line to be described clearly enough. For that reason it is best not to assign it a meaning.',
      details: visible || fateAbsence ? ((visible && variantText(item)) || guide?.details || '') : 'A sharper, front-facing capture with even lighting could allow a more careful observation.',
      reflection: visible || fateAbsence ? guide?.reflection || '' : '',
      alternative,
      tradition: rule?.tradition || 'Cautious reading',
      confidence: rule?.interpretationConfidence || 0,
      ruleId: rule?.rule_id || null
    };
  }));
}

export function applyPalmistryRules(hands, dominance, mode) {
  const rules = Object.entries(hands).flatMap(([hand, analysis]) => matchingRules(analysis).map(rule => ({ ...rule, hand })));
  const perHand = mode === 'complete' ? 8 : 5;
  const strongest = ['left','right'].flatMap(hand => rules.filter(rule => rule.hand === hand && rule.interpretationConfidence >= .2).slice(0, perHand));
  const facts = Object.entries(hands).flatMap(([hand, analysis]) => analysis.lines.filter(item => item.detected && item.confidence >= .4).map(item => ({ hand, feature:item.feature, observation:item.observations.join('; '), confidence:item.confidence, source:'provisional visual observation' })));
  const featureReadings = buildFeatureReadings(hands);
  const statements = strongest.map(rule => ({ hand:rule.hand, feature:rule.associated_feature, category:rule.category, text:`Traditionally it is interpreted as ${rule.traditional_meaning}.`, meaning:rule.traditional_meaning, alternative:rule.alternative_meaning, why:[`Observation: ${rule.feature}.`,`Location: ${rule.location}.`,`Visual confidence: ${Math.round(rule.detectionConfidence*100)}% (not equivalent to scientific certainty).`], ruleId:rule.rule_id, tradition:rule.tradition, confidence:rule.interpretationConfidence }));
  return { rulesUsed:strongest, facts, statements, featureReadings, caveat:'These associations belong to cultural palmistry traditions and are for entertainment; they don’t describe scientific facts or predict events with certainty.', intensity: strongest.length >= 5 ? 'MODERATE' : 'LOW' };
}

export function buildReport(hands, comparison, interpretation, dominance, mode) {
  const quality = Object.fromEntries(Object.entries(hands).map(([hand, analysis]) => [hand, analysis.quality]));
  const perHand = (feature, fallback) => Object.entries(hands).map(([hand, analysis]) => {
    const item = line(analysis, feature);
    return `${handLabel(hand)} palm: ${item?.detected ? item.observations.join(', ') : fallback}.`;
  }).join(' ');
  const shapes = Object.entries(hands).map(([hand, analysis]) => [hand, shapeReading(analysis)]);
  const shapeText = shapes.map(([hand, r]) => r ? `${handLabel(hand)} palm: ${r.title} (palm ${r.palm}, fingers ${r.fingers}). ${r.shapeText}` : `${handLabel(hand)} palm: the points of the hand weren’t located, so the shape couldn’t be measured.`).join(' ');
  const fingerText = shapes.map(([hand, r]) => r ? `${handLabel(hand)} palm: ${r.indexVsRing}; thumb ${r.thumb} (${r.thumbAngle}°). ${r.fingerText || ''} ${r.indexText} ${r.thumbText}` : `${handLabel(hand)} palm: no finger measurements in this photo.`).join(' ');
  const elements = shapes.map(([, r]) => r?.element).filter(Boolean);
  const dominanceText = dominance === 'both'
    ? 'You chose ambidextrous: both hands are read as equally important.'
    : dominance ? `According to the convention you chose, your ${handLabel(dominance)} hand (dominant) shows what you have developed through your decisions, and your ${handLabel(dominance === 'left' ? 'right' : 'left')} (non-dominant) shows your original potential.` : '';
  const elementCompare = elements.length === 2 ? (elements[0] === elements[1] ? ` In both hands the shape corresponds to the element ${elements[0]}: a coherent energy between what you bring and what you live.` : ` The shape changes between hands (${elements[0]} and ${elements[1]}): tradition reads this as an evolution between your potential and what you’ve developed.`) : '';
  return { reportVersion:'report-1.1', generatedAt:new Date().toISOString(), mode, dominance, visualFacts:interpretation.facts, interpretation, quality, sections:[
    { id:'summary', title:'Summary of your hand', text:'The reading separates what is observed in the image from traditional associations. The lines are traced over the actual position of your hand and are taken as estimates, not exact measurements.' },
    { id:'shape', title:'Hand shape', text:shapeText },
    { id:'heart', title:'Heart line', text:perHand('heart_line', 'can’t be clearly made out in the photo, so it isn’t interpreted') },
    { id:'head', title:'Head line', text:perHand('head_line', 'can’t be clearly made out in the photo, so it isn’t interpreted') },
    { id:'life', title:'Life line', text:perHand('life_line', 'can’t be clearly made out in the photo, so it isn’t interpreted') + ' A short life line is never interpreted here as early death, nor is it used to calculate longevity.' },
    { id:'fate', title:'Fate line / Saturn', text:perHand('fate_line', 'uncertain presence; tradition reads it as a flexible path') },
    { id:'fingers', title:'Fingers and thumb', text:fingerText },
    { id:'comparison', title:'Left/right comparison', text:`${dominanceText}${elementCompare} ${comparison.interpretation}`.trim() },
    { id:'secondary', title:'What else to look at in your hand (according to Cheiro)', text:'The photo does not allow these features to be distinguished, but you can look at them on your own hand. Space between the life line and the head line: if they are very close together, Cheiro reads it as caution and sensitivity to the judgment of others; if there is a medium space, as energy, freedom of action and a desire to move forward; if the space is very wide, as overconfidence and impulsiveness. Sun line (under the ring finger): associated with brilliance, recognition and a taste for art. Mercury or health line (under the little finger): associated with communication, business and caring for the body. Girdle of Venus (arc above the heart line): associated with great sensitivity. Cheiro also describes islands, crosses, stars and squares as marks with meaning; they are not interpreted here, because an ordinary photo does not distinguish them with certainty.' },
    { id:'types', title:'The seven hand types (Cheiro)', text:CHEIRO_TYPES.map(t => `${t[0]}: ${t[1]} ${t[2]}`).join(' ') + ' This is a Cheiro classification, distinct from the four elements above; the photo doesn’t measure the fingertips, so you can compare with your own hand.' },
    { id:'mounts', title:'The mounts of the hand (Cheiro)', text:'Cheiro calls each bulge of the palm a mount and uses the planetary names only as a shorthand for describing qualities. ' + CHEIRO_MOUNTS.map(m => `Mount of ${m[0]} (${m[1]}): ${m[2]}`).join(' ') + ' When several mounts lean toward one another, their qualities blend.' },
    { id:'nails', title:'The nails (Cheiro)', text:CHEIRO_NAILS },
    { id:'benham', title:'Your strongest line and how the lines are read (Benham)', text:Object.entries(hands).map(([hand, analysis]) => { const r = strongestWeakest(analysis); return r ? `${handLabel(hand)} palm: the most pronounced line in the photo is the ${{heart_line:'heart line',head_line:'head line',life_line:'life line',fate_line:'fate line'}[r.strong]}, which is associated with ${BENHAM_LINE_FOCUS[r.strong]}; the least pronounced is the ${{heart_line:'heart line',head_line:'head line',life_line:'life line',fate_line:'fate line'}[r.weak]}, associated with ${BENHAM_LINE_FOCUS[r.weak]}.` : `${handLabel(hand)} palm: there aren’t enough clear lines to compare their relative strength.`; }).join(' ') + ' ' + BENHAM_LINE_READING },
    { id:'quality', title:'Scan quality level', text:`Left: ${Math.round(quality.left.score*100)}% · Right: ${Math.round(quality.right.score*100)}%` }
  ] };
}
