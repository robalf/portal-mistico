// Textos astrológicos (tradición simbólica) para componer lecturas a partir del cielo real.
export const SIGNOS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

// Tema de cada casa (sistema de casas por signo completo: tu signo solar = casa 1)
export const CASA = [
  null,
  { n:'Identity', t:'your image and the way you present yourself to the world' },
  { n:'Resources', t:'your money, your resources and what you value' },
  { n:'Communication', t:'communication, short trips and your immediate surroundings' },
  { n:'Home', t:'your home, your family and your roots' },
  { n:'Romance and creativity', t:'romance, creativity and enjoyment' },
  { n:'Routine and health', t:'your routine, your daily work, and your health' },
  { n:'Love', t:'your partner, your business partners, and one-on-one relationships' },
  { n:'Transformation', t:'intimacy, shared resources, and deep change' },
  { n:'Horizons', t:'travel, study, and your beliefs' },
  { n:'Career', t:'your career, your reputation, and your long-term goals' },
  { n:'Friendships', t:'your friendships, your groups, and your future projects' },
  { n:'Inner world', t:'your inner world, rest, and what you need to let go of' }
];

// Qué hace la Luna al pasar por cada casa (3 formas de decirlo)
export const LUNA_CASA = [
  null,
  ['Your emotions show on your face and in the way you act: it is a good time to show up as exactly who you are.','You will be more sensitive to how others see you; do not let an outside opinion affect you more than it should.','Your personal energy is close to the surface and favors starting something that carries your stamp.'],
  ['You may feel the urge to organize your spending or secure what you already have; decide calmly, not on impulse.','What you value is asking for attention: a small adjustment to your budget or your priorities will bring you peace of mind.','It is worth reviewing what makes you feel secure; today money and emotions are more intertwined than usual.'],
  ['Conversations, messages, and small errands take center stage; listen closely before you answer.','Your mind is curious and receptive: a good day to learn something, write, or reconnect with someone close.','Matters with neighbors, siblings, or coworkers are best resolved by speaking plainly and with warmth.'],
  ['Home is calling you: a little quiet time at home or a chat with family recharges you more than any plan could.','Memories or family matters may surface; welcome them with tenderness and do not rush to resolve them.','Tidying your space, cooking something comforting, or tending to your roots will restore your balance.'],
  ['Room opens up for play, romance, and creativity; allow yourself to enjoy it without having to justify it.','Your expressive side shines: ideal for creating, flirting, or devoting time to what you love.','A gesture of affection or an activity you enjoy will have more effect than you imagine.'],
  ['Your routine needs care: small habits, order, and attention to your body make all the difference.','It is a good day to finish pending tasks and start a healthy habit, without demanding too much of yourself.','Daily work flows if you break it into steps; pay attention to signs of fatigue.'],
  ['One-on-one relationships feel more intense; an honest conversation can bring you closer to someone.','The balance between giving and receiving matters with your partner, your business partners, or a close friend.','Someone may appear who mirrors something in you; listen without getting defensive.'],
  ['Emotions run deep: it is a good time to release what weighs on you and look at what you truly want to transform.','Matters of shared money, debts, or intimacy call for honesty; avoid uncomfortable silences.','A quiet force invites you to close a cycle and renew yourself from within.'],
  ['Your horizon widens: studying, planning a trip, or talking about what you believe will inspire you.','You feel like going farther; a new idea may change the way you see an everyday matter.','It is a good day to learn, teach, or look for meaning in what you do.'],
  ['Your public life and your goals move to the foreground; a responsible step today will show over the long run.','Attention or recognition may come your way for what you do; act with calm and professionalism.','Think about where you want to be a year or two from now and take one small action toward it.'],
  ['Friends, groups, and shared projects bring good news or useful ideas.','Surrounding yourself with like-minded people lifts you up; do not hesitate to ask for a hand or offer one.','A future plan gains clarity when you talk it over with someone you trust.'],
  ['You need a pause: silence, rest, and some time alone bring your clarity back.','Intuition speaks softly; write down what you feel and avoid big decisions with a tired mind.','It is a good time to forgive, let go of an invisible weight, or simply rest without guilt.']
];

// Consejo por casa (2 formas)
export const CONSEJO_CASA = [
  null,
  ['Start something small that represents you.','Look after your rest and your voice: they hold you up more than you realize.'],
  ['Before you buy, wait a night.','Write down what comes in and what goes out; clarity soothes.'],
  ['Answer a message you have left pending.','Before you speak, breathe and choose one clear idea.'],
  ['Spend a few minutes on your space or with someone in your family.','Eat something warm and give yourself some screen-free time.'],
  ['Do something just because you like it.','Tell someone what you value about them.'],
  ['Pick one task and finish it well.','Drink water, stretch, and walk a little.'],
  ['Listen first and share your opinion afterward.','Gently bring up what you need from the other person.'],
  ['Name what you want to let go of, even if only in a private note.','Be honest about a topic you have been avoiding.'],
  ['Learn something new, even if only for ten minutes.','Plan an outing, a class, or a reading that broadens your outlook.'],
  ['Take one concrete step toward your main goal.','Keep what you promised first.'],
  ['Write to a friend you have not talked to in a while.','Share an idea with your group or community.'],
  ['Take a moment for silence or for writing down what you feel.','Sleep well: your intuition will thank you today.']
];

// Sabor de la Luna según el signo en que está
export const LUNA_SIGNO = [
  'In Aries, emotion is direct and quick: we react before we think.',
  'In Taurus, the mood seeks calm, comfort, and simple pleasures.',
  'In Gemini, the mind moves fast and emotions ask for words.',
  'In Cancer, the Moon is at home: sensitivity and nostalgia intensify.',
  'In Leo, the heart wants to shine, be seen, and receive affection.',
  'In Virgo, emotions are expressed through service, order, and detail.',
  'In Libra, the mood seeks harmony, company, and the avoidance of conflict.',
  'In Scorpio, emotions turn deep, intense, and private.',
  'In Sagittarius, the mood is optimistic, restless, and hungry for freedom.',
  'In Capricorn, emotions are held in check and directed toward duty.',
  'In Aquarius, the mood becomes independent, curious, and a bit distant.',
  'In Pisces, sensitivity overflows: empathy and imagination grow.'
];

// Fases lunares
export const FASES = [
  { n:'New Moon', t:'This is a planting phase: symbolically, it is a good time to set simple intentions.' },
  { n:'Waxing Crescent', t:'The light is growing: it is a phase of momentum for moving forward with what you started.' },
  { n:'First Quarter', t:'Action phase: small obstacles appear that are resolved with determination.' },
  { n:'Waxing Gibbous', t:'Culmination is near: it is a time to fine-tune details and be patient.' },
  { n:'Full Moon', t:'The light is at its peak: what was hidden becomes visible and emotions are felt more strongly.' },
  { n:'Waning Gibbous', t:'A phase of gratitude and of sharing what you have learned.' },
  { n:'Last Quarter', t:'Review phase: it invites you to let go of what no longer adds to your life.' },
  { n:'Waning Crescent', t:'The light is fading: it is a stage of rest and closure before a new cycle.' }
];
export const FASE_EXACTA = [
  (sg,h,t)=>`Today there is a New Moon in ${sg}, in your house ${h}: a symbolic moment to plant intentions about ${t}.`,
  (sg,h,t)=>`Today the First Quarter Moon arrives in ${sg}, in your house ${h}: time to take action on ${t}.`,
  (sg,h,t)=>`Today there is a Full Moon in ${sg}, in your house ${h}: something related to ${t} comes to a peak and becomes visible, and emotions may feel more intense.`,
  (sg,h,t)=>`Today the Last Quarter Moon arrives in ${sg}, in your house ${h}: time to review and let go of what no longer adds to your life in ${t}.`
];

// Planetas y lo que representan
export const PLANETA = {
  Me:{ n:'Mercury', t:'communication and ideas', rol:(t)=>`your mind and your conversations turn toward ${t}` },
  V:{ n:'Venus', t:'affection, taste, and relationships', rol:(t)=>`affection, pleasure, and harmony lean toward ${t}` },
  Ma:{ n:'Mars', t:'energy and action', rol:(t)=>`your energy and your initiative are directed at ${t}` },
  J:{ n:'Jupiter', t:'confidence and opportunities', rol:(t)=>`growth and good fortune are linked with ${t}` },
  Sa:{ n:'Saturn', t:'responsibilities and boundaries', rol:(t)=>`discipline and long-term lessons focus on ${t}` }
};

// Aspectos de la Luna (2 formas cada uno)
export const ASPECTO = {
  0:  [(p,t)=>`The Moon joins ${p}: ${t} feel amplified and hard to ignore.`,(p,t)=>`The Moon and ${p} meet in the sky, so ${t} take center stage in your attention.`],
  60: [(p,t)=>`The Moon and ${p} gaze at each other in gentle harmony: a small initiative in ${t} finds support.`,(p,t)=>`The sextile between the Moon and ${p} opens a friendly door in ${t}, if you take the first step.`],
  90: [(p,t)=>`The Moon forms tension with ${p}: ${t} call for patience and an adjustment before moving on.`,(p,t)=>`The square between the Moon and ${p} may bring friction in ${t}; take a breath before reacting.`],
  120:[(p,t)=>`The Moon and ${p} flow in a trine: ${t} come out naturally and with little effort.`,(p,t)=>`The trine between the Moon and ${p} favors ${t}: make the most of the ease of the moment.`],
  180:[(p,t)=>`The Moon opposes ${p}: ${t} ask you to balance two opposing needs.`,(p,t)=>`The opposition between the Moon and ${p} holds ${t} up to a mirror; look for the middle ground.`]
};

// Retrógrados
export const RETRO = {
  Me:(sg,h,t)=>`Mercury is retrograde in ${sg}, in your ${h} house: review, repeat, and confirm everything related to ${t}.`,
  V:(sg,h,t)=>`Venus is retrograde in ${sg}, in your ${h} house: it is a time to rethink tastes and bonds in ${t}, without rushed decisions.`,
  Ma:(sg,h,t)=>`Mars is retrograde in ${sg}, in your ${h} house: energy builds up; channel it patiently into ${t}.`,
  J:(sg,h,t)=>`Jupiter is retrograde in ${sg}, in your ${h} house: it is time to look inward at what you want to grow in ${t}.`,
  Sa:(sg,h,t)=>`Saturn is retrograde in ${sg}, in your ${h} house: it is time to review structures and commitments in ${t}.`
};

// El Sol en cada casa (semana y mes)
export const SOL_CASA = [
  null,
  'It is time to renew yourself and show who you are.',
  'Your finances and your self-esteem call for attention.',
  'You learn, talk, and move around more than usual.',
  'Home and family are your priority.',
  'Joy, romance, and creativity are on the rise.',
  'It is a season for organizing routines and caring for your health.',
  'Partnerships and your significant other take center stage.',
  'Processes of transformation and shared matters are activated.',
  'Curiosity pushes you to travel, study, and explore what you believe.',
  'Your career and your goals take the spotlight.',
  'Friendships and group projects give you a boost.',
  'It is a time for introspection and closing cycles before your new solar year.'
];
