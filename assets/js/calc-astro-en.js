/* English texts for Portal Místico calculators (Destiny Matrix, Saturn, lunar nodes, Lilith, Mayan kin). */
export default {
  locale: 'en-US',
  signs: ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'],
  glyphs: ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'],
  signSlug: ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'],
  signBase: '/en/zodiac/',
  err: { date: 'Enter a valid date of birth.', date2: 'Enter a valid date for the second person.', range: 'Use a date between 1900 and 2100.', lib: 'The astronomy engine could not load. Please reload the page.' },
  common: { age: 'at age', years: '', direct: 'direct', retro: 'retrograde', approx: 'No birth time given: calculated for 12:00 noon. The margin is small, but it can shift the result by a few hours or, in edge cases, one degree.', again: 'Try another date' },
  arcana: [null,
    ['The Magician','initiative, skill, communication','scattered energy or manipulation'],
    ['The High Priestess','intuition, inner knowing, discretion','secrecy, passivity'],
    ['The Empress','creativity, beauty, abundance, nurturing','over-reliance on comfort or on being cared for'],
    ['The Emperor','structure, leadership, protection','rigidity, control'],
    ['The Hierophant','teaching, values, tradition, guidance','dogmatism, judging others'],
    ['The Lovers','love, choice, harmony in relationships','indecision, emotional dependence'],
    ['The Chariot','progress, victory, travel, willpower','haste, aggression'],
    ['Justice','balance, truth, cause and effect','perfectionism, guilt'],
    ['The Hermit','wisdom, introspection, depth','isolation, mistrust'],
    ['Wheel of Fortune','cycles, luck, adapting to change','instability, fatalism'],
    ['Strength','courage, vitality, mastery of instinct','impulsiveness, burnout'],
    ['The Hanged Man','surrender, a new perspective, meaningful sacrifice','victim mindset, stagnation'],
    ['Death','transformation, endings, renewal','fear of change, clinging'],
    ['Temperance','calm, healing, the right measure','apathy, holding back too much'],
    ['The Devil','magnetism, desire, material power','attachments, excess, addiction'],
    ['The Tower','liberating breakthrough, sudden truth','collapse, crisis born of resistance'],
    ['The Star','hope, talent, inspiration','idealism, lack of follow-through'],
    ['The Moon','imagination, sensitivity, dreams','fears, illusions, confusion'],
    ['The Sun','joy, success, warmth, vitality','pride, need to shine'],
    ['Judgement','rebirth, family, inner calling','harsh judgement, unfinished business'],
    ['The World','fulfilment, achievement, wide horizons','scattering, not closing chapters'],
    ['The Fool','freedom, spontaneity, new beginnings','irresponsibility, escapism']],
  matrix: {
    title: 'Your Destiny Matrix', couple: 'Couple matrix',
    points: { A: ['Personality (A)','How you come across and your core energy, from your birth day.'], B: ['Natural talent (B)','The resources you were born with and how you get inspired.'], C: ['Material world (C)','Your relationship with money, work and practical life.'], D: ['Karmic task (D)','The lesson that repeats until you integrate it.'], E: ['Centre: comfort zone (E)','The arcanum that ties it all together, where you return for balance.'], personal: ['Personal purpose','What you are here to develop in your first stage, up to about 40.'], social: ['Social purpose','Your contribution to others, family and community (ages 40-60).'], spiritual: ['Spiritual purpose','The synthesis of your path, beyond 60.'], money: ['Money channel','How material abundance flows best for you.'], love: ['Love channel','What you seek and offer in a partnership.'] },
    cpoints: { A: ['Couple energy (A)','How the people around you see you as a pair.'], E: ['Couple centre (E)','The deeper meaning of the relationship.'], money: ['Shared money','How you handle shared resources.'], love: ['The bond','What feeds the love between you.'], D: ['Couple lesson (D)','What the relationship asks you to learn.'], personal: ['Couple purpose','Why you met.'] },
    plus: 'In light', minus: 'In shadow',
    note: 'A modern symbolic method (Natalia Ladini, 2006) based on the 22 Major Arcana. It is not a prediction: use it as a mirror for reflection.'
  },
  saturn: {
    title: 'Your Saturn return', natal: 'Natal Saturn', returns: ['First return','Second return','Third return'],
    passes: n => n === 1 ? 'Saturn crosses your natal degree once, moving direct.' : `Saturn crosses your natal degree ${n} times because of its retrograde loop, so the process lasts almost a year.`,
    past: 'already happened', future: 'still ahead',
    bySign: ['learning patience and leading through consistency rather than impulse.','building your own material security and accepting the slow pace of solid things.','organising your ideas, finishing what you start and keeping your word.','maturing family bonds and creating a stable emotional home.','shining authentically without depending on applause.','finding a sustainable way to work and look after your health, without harsh self-criticism.','making adult commitments in love and negotiating with balance.','facing your fears, sharing power and letting go of control.','turning your beliefs into a practical, consistent path.','taking authority over your life and your calling.','finding your place in groups and shared projects without losing your originality.','giving concrete shape to your dreams and setting limits on confusion.']
  },
  nodes: {
    title: 'Your lunar nodes', north: 'North Node', south: 'South Node', mean: 'Mean node', true: 'True node',
    returnsT: 'Your nodal returns (mean node back to its natal position)', reversal: 'Nodal reversal (opposite node)',
    northBy: ['Daring to go first, deciding for yourself and trusting your own drive.','Building calm, self-worth and simple pleasure: fewer crises, deeper roots.','Listening, asking questions and connecting with different ideas instead of preaching.','Allowing yourself to feel, care and belong: your inner home is your compass.','Expressing your creativity from the heart and letting yourself be seen.','Grounding your dreams with habits, service and attention to detail.','Learning collaboration, diplomacy and the art of sharing your life.','Leaving your comfort zone, transforming and sharing resources and emotions deeply.','Seeking meaning, travelling, studying and trusting a broad vision of life.','Embracing goals, responsibility and a clear direction in the world.','Contributing to groups, friendships and causes bigger than you.','Surrendering to intuition, compassion and spirituality: less control.'],
    southNote: 'The South Node, in the opposite sign, describes talents and habits you have already mastered and can easily hide in.'
  },
  lilith: {
    title: 'Your Lilith (Black Moon)', returnsT: 'Your Lilith returns (every ~8.85 years)',
    bySign: ['You refuse to be held back; your shadow is suppressed anger and your power is autonomy.','An intense relationship with pleasure and possession; integrating it means enjoying without guilt.','Sharp words and taboo ideas; your power lies in saying what others keep quiet.','Wounds around mother or home; healing turns you into a refuge for others.','Fear of not being seen; your power is charisma that asks no permission.','Control and high standards around the body; integrating it means treating yourself with tenderness.','Tension between pleasing and being free in love; your power is honest desire.','Intensity, jealousy and a longing to merge; your power is deep transformation.','Rebellion against dogma; your power is seeking your own truth.','Struggles with authority and ambition; your power is being in charge of your life.','Feeling different from the group; your power is radical originality.','Escape, sacrifice or confusion; your power is intuition and compassion without losing yourself.']
  },
  kin: {
    title: 'Your Mayan kin', ds: 'Dreamspell (13 Moon)', trad: 'Traditional Mayan count (Tzolk\'in)',
    seals: [null,'Red Dragon','White Wind','Blue Night','Yellow Seed','Red Serpent','White Worldbridger','Blue Hand','Yellow Star','Red Moon','White Dog','Blue Monkey','Yellow Human','Red Skywalker','White Wizard','Blue Eagle','Yellow Warrior','Red Earth','White Mirror','Blue Storm','Yellow Sun'],
    sealKw: [null,'birth, nurturing, being','spirit, communication, breath','abundance, dreams, intuition','flowering, target, awareness','life force, instinct, body','death and rebirth, opportunity, equalising','accomplishment, healing, knowing','beauty, art, elegance','universal water, purification, flow','heart, loyalty, love','magic, play, illusion','free will, wisdom, influence','space, exploration, wakefulness','timelessness, receptivity, enchantment','vision, mind, creation','intelligence, fearlessness, questioning','navigation, synchronicity, evolution','reflection, order, endlessness','self-generation, energy, catalysing','enlightenment, universal fire, life'],
    kinName: (seal, tone) => { const i = seal.indexOf(' '); return seal.slice(0, i) + ' ' + tone + seal.slice(i); }, // Yellow + Galactic + Seed
    tones: [null,'Magnetic','Lunar','Electric','Self-Existing','Overtone','Rhythmic','Resonant','Galactic','Solar','Planetary','Spectral','Crystal','Cosmic'],
    toneKw: [null,'unify and attract purpose','polarise and recognise the challenge','activate and serve','define and give form','empower and command','organise and balance','channel and inspire','harmonise and model','pulse and realise intention','perfect and produce','dissolve and release','dedicate and cooperate','endure and transcend'],
    tradNames: ['Imox (Imix)','Iq\' (Ik\')','Aq\'ab\'al (Ak\'b\'al)','K\'at (K\'an)','Kan (Chikchan)','Kame (Kimi)','Kej (Manik\')','Q\'anil (Lamat)','Toj (Muluk)','Tz\'i\' (Ok)','B\'atz\' (Chuwen)','E (Eb\')','Aj (B\'en)','I\'x (Ix)','Tz\'ikin (Men)','Ajmaq (Kib\')','No\'j (Kab\'an)','Tijax (Etz\'nab\')','Kawoq (Kawak)','Ajpu (Ajaw)'],
    oracle: { guide: 'Guide', analog: 'Analog', antipode: 'Antipode', occult: 'Occult' },
    note29: 'Dreamspell does not count 29 February: that day shares its kin with the 28th.'
  }
};
