// Cartas invertidas y significados propios por tirada (amor, día, pasado-presente-futuro).
// Arcanos mayores: texto propio. Arcanos menores: se componen con el palo (ámbito) y el número/figura (etapa).

// rev = tema invertido · ra = consejo invertido · lu/du = amor/día derecha (solo si falta) · lr/dr = amor/día invertida
const M = {
  'The Fool': { rev:'neglect, absence, apathy, vanity, or energy that scatters', ra:'Pay attention to what you are neglecting and bring your focus back.',
    lu:'In love, it encourages you to begin without a script: a spontaneous date, a conversation without masks, or a new chapter in which you both learn to walk together.',
    du:'Today spontaneity favors you: say yes to something small and new, without demanding to know how it will end.',
    lr:'In love, there may be fear of taking the step or, on the contrary, an impulse that leaves someone behind. Ask yourself whether you are moving forward out of desire or to run away.',
    dr:'Today it is wise to hold back an impulse: read carefully what you are about to sign, say, or promise.' },
  'The Magician': { rev:'restlessness, disrepute, and mental disorder (Waite also mentions the physician and the magician)', ra:'Order your mind and avoid deciding from restlessness.',
    lu:'In love, there is charisma, initiative, and good communication: it is time to show with actions what you feel and to propose a concrete plan.',
    du:'Today you have what you need within reach to begin: a call, a message, or a well-presented idea can set something in motion.',
    lr:'In love, beware of pretty words without action, or of playing at conquest without commitment.',
    dr:'Today avoid promising too much or scattering yourself across five tasks at once.' },
  'The High Priestess': { rev:'overflowing passion, vanity, or superficial knowledge', ra:'Go deeper before offering an opinion: appearances are not the whole of knowledge.',
    lr:'In love, there are silences or things left unsaid; do not read the other person’s mind, ask.',
    dr:'Today your intuition is clouded by noise: slow down and wait before deciding.' },
  'The Empress': { rev:'light, truth, and the untangling of complicated matters, or hesitation', ra:'Clear up what is tangled with honesty and decide without hesitating too long.',
    lu:'In love, affection and sensuality bloom; it is a time to care, to let yourself be cared for, and to allow the relationship to grow unhurriedly.',
    du:'Today take care of your body and your surroundings: something you tend with patience will bear fruit.',
    lr:'In love, there is overprotectiveness or self-neglect: giving without receiving ends in exhaustion.',
    dr:'Today there is a tendency to put off self-care; set aside some time for yourself.' },
  'The Emperor': { rev:'benevolence and compassion, or else obstruction and immaturity', ra:'Soften your authority with compassion and look at where immaturity holds you back.',
    lu:'In love, you seek stability and clear commitments: it is a good time to define agreements and show security.',
    du:'Today order works in your favor: organize your priorities and make that firm decision you have been putting off.',
    lr:'In love, control or coldness can push people away; listen before imposing.',
    dr:'Today beware of stubbornness: yielding on small things saves you from a big conflict.' },
  'The Hierophant': { rev:'partnership, good understanding, and harmony, or excessive agreeableness and weakness', ra:'Be kind without ceasing to set boundaries.',
    lu:'In love, shared values, formal commitments, and the support of family or community matter.',
    du:'Today the advice of someone experienced, or a formal procedure, helps you move forward.',
    lr:'In love, inherited expectations or "what is expected of you two" weigh more than what you feel.',
    dr:'Today distrust the rules you repeat only out of habit, and ask why.' },
  'The Lovers': { rev:'failure, unwise plans, or a frustrated commitment', ra:'Review your plans calmly before committing.',
    lu:'In love, this is a card of union and conscious choice: the bond grows stronger when both speak sincerely.',
    du:'Today you must choose between two paths: decide with your heart and your head at once.',
    lr:'In love, there is imbalance, doubt, or a third person in play; do not avoid the uncomfortable conversation.',
    dr:'Today a pending decision gets more complicated if you leave it half done; define what is non-negotiable.' },
  'The Chariot': { rev:'tumult, dispute, litigation, or defeat', ra:'Avoid stepping into the fight and seek an agreement rather than a clash.',
    lu:'In love, you move forward with determination: it is time to take the initiative and coordinate your steps with the other person.',
    du:'Today you have the drive to see a matter through; hold your course and do not stray.',
    lr:'In love, competition or the rush to win the argument does more harm than the argument itself.',
    dr:'Today avoid rushing: a mistake made in haste would cost you more than arriving a little later.' },
  'Justice': { rev:'legal complications, prejudice, bias, or excessive severity', ra:'Examine your biases and avoid unnecessary harshness.',
    lu:'In love, honesty, reciprocity, and balanced agreements matter; what you give and receive should be seen clearly.',
    du:'Today a matter of paperwork, agreements, or debts becomes clear: act with transparency.',
    lr:'In love, there is an imbalance: one gives more than the other, or someone avoids taking on a responsibility.',
    dr:'Today, avoid judging in haste or signing without reading.' },
  'The Hermit': { rev:'concealment, disguise, fear, or caution without reason', ra:'Ask yourself whether your prudence is wise or just fear.',
    lr:'In love, withdrawal can look like disinterest; explain what you need instead of disappearing.',
    dr:'Today solitude weighs on you more than is useful: seek kind company.' },
  'Wheel of Fortune': { rev:'increase, abundance, or excess', ra:'Enjoy what arrives without falling into excess.',
    lr:'In love, a cycle is repeating; identify which part depends on you.',
    dr:'Today something does not go as expected; remember that the wheel keeps turning.' },
  'Strength': { rev:'despotism, abuse of power, weakness, or discord', ra:'Do not impose by force what is better achieved with magnanimity.',
    lu:'In love, patience, tenderness, and trust win out over rivalry: you know how to calm without controlling.',
    du:'Today a calm, kind response will resolve what brute force could not.',
    lr:'In love, you doubt your worth or react harshly out of fear; return to the basics: respect and care.',
    dr:'Today your patience runs short; breathe before you answer.' },
  'The Hanged Man': { rev:'selfishness, or being swept along by the crowd', ra:'Think for yourself, without imitating the crowd or locking yourself into your own interests.',
    lu:'In love, a pause or a change of perspective helps: seeing the situation from the other person’s place makes everything clear.',
    du:'Today it is best not to force things; waiting and looking differently will bring the answer.',
    lr:'In love, there is a sacrifice nobody asked for or a wait that drags on for no reason.',
    dr:'Today you feel you are not moving forward; check whether you are waiting for a sign that has already arrived.' },
  'Death': { rev:'inertia, lethargy, petrification, or shattered hope', ra:'Wake from your lethargy with one small step.',
    lu:'In love, a chapter ends to make way for a more honest one: the bond transforms or renews itself.',
    du:'Today you close something —a habit, a topic, an idea— and that frees up space.',
    lr:'In love, clinging to what has already changed prolongs the pain; allow the ending or the renewal.',
    dr:'Today you find it hard to let something go; write down what you no longer need.' },
  'Temperance': { rev:'matters of churches or sects, disunion, poor combinations, or opposing interests', ra:'Seek the middle ground between competing interests.',
    lu:'In love, there is harmony, patience, and commitment: two different rhythms blend well.',
    du:'Today seek the middle ground; moderation is your strategy.',
    lr:'In love, one speeds up and the other brakes; adjust your pace before arguing.',
    dr:'Today there is too much of something —work, screens, worry—; cut back a little.' },
  'The Devil': { rev:'harmful fatality, weakness, pettiness, or blindness', ra:'Open your eyes to what binds you and let go of pettiness.',
    lu:'In love, there is intense attraction, but check for possessiveness, jealousy, or dependence.',
    du:'Today you notice what binds you: a habit, an impulse purchase, a repeated behavior.',
    lr:'In love, you begin to free yourself from a relationship or a pattern that held you back.',
    dr:'Today is a good day to break with a temptation or a bad habit.' },
  'The Tower': { rev:'the same to a lesser degree, or else oppression, confinement, and tyranny', ra:'Attend in time to what is wobbling before it gets worse.',
    lu:'In love, a truth comes to light and shakes what was not well founded; what is authentic survives.',
    du:'Today there may be unexpected news or an interruption; stay calm and rebuild with the essentials.',
    lr:'In love, you avoid a conversation you know is necessary; fear postpones it but does not cancel it.',
    dr:'Today a bigger scare stays a warning; learn from it.' },
  'The Star': { rev:'arrogance, haughtiness, or powerlessness', ra:'Lower the guard of pride and ask for help.',
    lr:'In love, you find it hard to trust or you idealize; start with honesty toward yourself.',
    dr:'Today hope falters; take one small step and observe.' },
  'The Moon': { rev:'instability, inconstancy, silence, or minor deceptions', ra:'Verify the facts before believing what you imagine.',
    lr:'In love, a misunderstanding begins to clear up; do not act on suspicions without confirming.',
    dr:'Today the fog lifts little by little; wait before deciding.' },
  'The Sun': { rev:'the same to a lesser extent', ra:'The sun is still there: remove whatever covers it.',
    lr:'In love, warmth fades through routine; play and celebrate together again.',
    dr:'Today your mood is somewhat dull; look for light in something simple.' },
  'Judgement': { rev:'weakness, faint-heartedness, and naivety; also deliberation, decision, and judgment', ra:'Deliberate calmly and decide.',
    lu:'In love, it is a time for balance, forgiveness, and rebirth: a bond is reconsidered with maturity.',
    du:'Today an inner or outer call asks you to respond: it is a good day to review and decide.',
    lr:'In love, you judge yourself or the other person harshly; forgiveness begins with letting go of blame.',
    dr:'Today avoid blaming yourself for what has already happened.' },
  'The World': { rev:'inertia, rigidity, and stagnation', ra:'Move, even if it is one small step.',
    lu:'In love, there is fulfillment and completion: a chapter closes with success and a wider one opens.',
    du:'Today you complete something important or see a result; celebrate and give thanks.',
    lr:'In love, something is left half done; define what is missing to close it well.',
    dr:'Today a nearly finished project needs one last push.' }
};

// Arcanos menores: etapa (número o figura)
const RANGO = {
  'Ace':{ rev:'a blocked opportunity or a beginning that is delayed', ra:'Prepare the ground; the beginning will arrive when you clear it.' },
  'Two':{ rev:'indecision or an imbalance between two options', ra:'Write down the pros and cons and set a date to decide.' },
  'Three':{ rev:'lack of collaboration or results that take time', ra:'Ask for concrete help and share the work.' },
  'Four':{ rev:'stagnation or resistance to resting or changing', ra:'Step out of your routine, even if only a little.' },
  'Five':{ rev:'a conflict that is avoided or that is beginning to resolve', ra:'Speak calmly: reconciliation is possible if no one tries to win.' },
  'Six':{ rev:'slow progress, nostalgia, or dependence on the past', ra:'Acknowledge what you have achieved and let go of what no longer drives you.' },
  'Seven':{ rev:'doubts, scattered focus, or evasion', ra:'Choose one priority and leave the rest for later.' },
  'Eight':{ rev:'a blocked movement, haste, or lack of focus', ra:'Resolve one pending matter before opening another front.' },
  'Nine':{ rev:'exhaustion, anxiety, or isolation', ra:'Rest and ask for support before carrying on alone.' },
  'Ten':{ rev:'an excessive burden or a difficult closure', ra:'Delegate or finish something that has been open far too long.' },
  'Page':{ rev:'immaturity or confusing news', ra:'Confirm the information before acting.' },
  'Knight':{ rev:'impulsiveness or lack of perseverance', ra:'Slow down and finish what you started.' },
  'Queen':{ rev:'insecurity or excessive control', ra:'Trust your judgment without imposing it.' },
  'King':{ rev:'rigidity, abuse of authority, or lack of self-control', ra:'Use your authority to care, not to pressure.' }
};

// Palos: ámbito de vida
const PALO = {
  Wands: { love:'With Wands, love is lived through passion, initiative, and the desire for adventure.', day:'With Wands, today your ground is action and your personal energy.',
            lrev:'Passion is scattered, or the enthusiasm has run out in the relationship.', drev:'Your energy is scattering or fading out halfway along the way.' },
  Cups:  { love:'With Cups, love is lived through feelings, empathy and emotional connection.', day:'With Cups, today your ground is emotional: sensitivity and intuition.',
            lrev:'Emotions are blocked, idealized or left unexpressed.', drev:'Your emotions weigh on you or are hidden away; name them before deciding.' },
  Swords:{ love:'With Swords, love depends on words, mental clarity and honesty.', day:'With Swords, today your ground is mental: ideas, decisions and communication.',
            lrev:'There are misunderstandings, ironies or silences that hurt.', drev:'Your mind keeps circling; write down what you think and separate facts from fears.' },
  Pentacles:   { love:'With Pentacles, love is built through actions, stability and concrete commitment.', day:'With Pentacles, today your ground is practical: work, money and health.',
            lrev:'Routine, money or comfort are cooling the bond.', drev:'Something practical, such as money, time or health, asks for order before you move forward.' }
};

const CIERRE_AMOR = {"Ace": "A simple, sincere and concrete beginning is enough.", "Two": "Talking about what each of you expects prevents misunderstandings.", "Three": "Sharing time with friends or family strengthens the bond.", "Four": "A pause to appreciate what already exists helps.", "Five": "Disagreements are resolved by listening, not by trying to win.", "Six": "Gestures of care and shared memories bring you together.", "Seven": "Choose with whom, and for what, the effort is worth it.", "Eight": "Quick messages and moves weigh heavily; be clear.", "Nine": "Look after your boundaries: you can care for others without wearing yourself out.", "Ten": "This is the closing of a cycle; think about what you want to build next.", "Page": "A message, an invitation or some sweet news may bring you closer.", "Knight": "Act with enthusiasm, but with persistence.", "Queen": "Emotional maturity and warmth sustain the bond.", "King": "Commitment, with calm and responsibility, brings security."};

function partes(name){
  const m = name.match(/^(Ace|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Page|Knight|Queen|King) of (Wands|Cups|Swords|Pentacles)$/);
  return m ? { rango:m[1], palo:m[2] } : null;
}
const lower = s => s.charAt(0).toLowerCase() + s.slice(1);

const W_REV = {
  'Ace of Wands': 'decline, decay, ruin and loss, with a clouded joy',
  'Two of Wands': 'surprise, astonishment, excitement, worry and fear',
  'Three of Wands': 'the end of troubles and the cessation of adversity and disappointment',
  'Four of Wands': 'that the meaning does not change: prosperity, growth, happiness and beauty',
  'Five of Wands': 'lawsuits, disputes, deceit and contradictions',
  'Six of Wands': 'apprehension, fear, disloyalty and an indefinite delay',
  'Seven of Wands': 'perplexity, haste and anxiety; a warning against indecision',
  'Eight of Wands': 'jealousy, inner conflict, remorse and quarrels, including domestic ones',
  'Nine of Wands': 'obstacles, adversity and calamity',
  'Ten of Wands': 'setbacks, difficulties and intrigues',
  'Page of Wands': 'gossip, announcements and bad news, with indecision and instability',
  'Knight of Wands': 'rupture, division, interruption and discord',
  'Queen of Wands': 'kindness, thrift and helpfulness; in certain positions, opposition, jealousy or deceit',
  'King of Wands': 'a severe kindness: austere, yet tolerant',
  'Ace of Cups': 'a house of the false heart: change, instability and revolution',
  'Three of Cups': 'promptness, achievement and the end of a matter, and also excess in pleasures',
  'Four of Cups': 'novelty, omen, new instruction and new relationships',
  'Five of Cups': 'news, alliances, affinity, a return and false projects',
  'Six of Cups': 'the future, renewal and what is yet to come',
  'Seven of Cups': 'desire, will, determination and a project',
  'Eight of Cups': 'great joy, happiness and celebration',
  'Nine of Cups': 'truth, loyalty and freedom, though readings vary and include errors and imperfections',
  'Ten of Cups': 'a rest of the false heart: indignation and violence',
  'Page of Cups': 'fondness, inclination, attachment, seduction, deceit and artifice',
  'Knight of Cups': 'deceit, artifice, subtlety, swindling and fraud',
  'Queen of Cups': 'varying readings: a good woman, or one who is illustrious but unreliable; perversity, vice and dishonor',
  'King of Cups': 'a dishonest or two-faced man, injustice, scandal and a considerable loss',
  'Ace of Swords': 'the same, but with disastrous results; another reading speaks of conception, birth and multiplicity',
  'Two of Swords': 'imposture, falsehood, duplicity and disloyalty',
  'Three of Swords': 'mental alienation, error, loss, distraction and disorder',
  'Four of Swords': 'good management, prudence, thrift and caution',
  'Five of Swords': 'the same as in the upright position, with burial and funeral rites',
  'Six of Swords': 'declaration, confession and publicity; according to one reading, a proposal of love',
  'Seven of Swords': 'good counsel and instruction, or else slander and gossip',
  'Eight of Swords': 'restlessness, difficulty, opposition, accident, betrayal and the unforeseen',
  'Nine of Swords': 'confinement, suspicion, doubt, reasonable fear and shame',
  'Ten of Swords': 'advantage, profit, success and favor, though none of it lasting; also power and authority',
  'Page of Swords': 'the darker side of those qualities, an unforeseen and unprepared state, and also illness',
  'Knight of Swords': 'imprudence, incapacity and extravagance',
  'Queen of Swords': 'malice, intolerance, artifice, prudishness and deceit',
  'King of Swords': 'cruelty, perversity, barbarity, perfidy and ill intent',
  'Ace of Pentacles': 'the bad side of wealth and bad news; also great wealth',
  'Two of Pentacles': 'forced joy, feigned enjoyment, letters, writings and bills of exchange',
  'Three of Pentacles': 'mediocrity, childishness, pettiness and weakness',
  'Four of Pentacles': 'suspense, delay and opposition',
  'Five of Pentacles': 'disorder, chaos, ruin, discord and squandering',
  'Six of Pentacles': 'desire, greed, envy, jealousy and illusion',
  'Seven of Pentacles': 'a cause for anxiety over money that one proposes to lend',
  'Eight of Pentacles': 'empty ambition, vanity, greed, extortion and usury',
  'Nine of Pentacles': 'deceit, a canceled project and bad faith',
  'Ten of Pentacles': 'chance, fatality, loss and gambling; sometimes a gift, a dowry or a pension',
  'Page of Pentacles': 'prodigality, dissipation, luxury and unfavorable news',
  'Knight of Pentacles': 'inertia, idleness and stagnation; also placidity, discouragement and carelessness',
  'Queen of Pentacles': 'wickedness, suspicion, suspense, fear and distrust',
  'King of Pentacles': 'vice, weakness, perversity, corruption and danger',
};
export function enrich(card){
  const m = M[card.name], p = partes(card.name);
  const rev = { meanings:{}, guidance:{} };
  let revTheme, revAdv;
  if (m){
    revTheme = m.rev; revAdv = m.ra;
    rev.meanings.love = `In love, reversed, it points to ${m.rev}. ${m.ra}`;
    rev.meanings.daily = `Today, reversed, it points to ${m.rev}. ${m.ra}`;
  } else if (p){
    const R = RANGO[p.rango], P = PALO[p.palo], WR = W_REV[card.name] || R.rev;
    revTheme = WR; revAdv = R.ra;
    rev.meanings.love = `In love, reversed, it points to ${WR}. ${P.lrev} ${R.ra}`;
    rev.meanings.daily = `Today, reversed, it points to ${WR}. ${P.drev} ${R.ra}`;
    if (!card.__handwritten){
      card.meanings.love = `In love, ${card.theme}. ${P.love} ${CIERRE_AMOR[p.rango]}`;
      card.meanings.daily = `${card.theme.charAt(0).toUpperCase() + card.theme.slice(1)}. ${P.day}`;
    }
  } else return card;
  rev.theme = revTheme; rev.advice = revAdv;
  rev.meanings.pastPresentFuture = `Reversed, ${card.name} speaks of ${revTheme}. ${revAdv} Recognizing it in time allows this energy to turn into learning instead of repeating itself.`;
  rev.meanings.weekly = `This week, reversed, ${card.name} points to ${revTheme}. ${revAdv}`;
  rev.guidance.daily = `Today, the reversed reading asks you to observe without forcing. ${revAdv}`;
  rev.guidance.pastPresentFuture = `Look at this energy honestly and correct it slowly. ${revAdv}`;
  rev.guidance.love = `Talk it over calmly and without accusing. ${revAdv}`;
  card.rev = rev;
  return card;
}
