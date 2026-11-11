function PMS(r){try{var t=window.top;if(t!==window&&t.PortalMusic&&t.PortalMusic.sfx)return t.PortalMusic.sfx(new URL(r,location.href).href);}catch(e){}return new Audio(r);}
import { additionalCards } from './generated-cards.js?v=4';
import { enrich } from './tarot-extra.js?v=4';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const readingTypes = {
  daily: {
    id: 'daily',
    name: 'Tarot of the Day',
    description: 'A card to hear the tone and energy of your day.',
    count: 1,
    image: '/juegos/tarot-game/assets/tarot-the-sun.webp',
    positions: [{ label: 'Your card for today', sub: '' }]
  },
  pastPresentFuture: {
    id: 'pastPresentFuture',
    name: 'Past, Present and Future',
    description: 'The classic three-card spread to understand your journey and what comes next.',
    count: 3,
    image: '/juegos/tarot-game/assets/tarot-the-hermit.webp',
    positions: [
      { label: 'Past', sub: 'The root' },
      { label: 'Present', sub: 'The threshold' },
      { label: 'Future', sub: 'The possibility' }
    ]
  },
  love: {
    id: 'love',
    name: 'Love Tarot',
    description: 'Three perspectives to understand your situation, the encounter and its path.',
    count: 3,
    image: '/juegos/tarot-game/assets/tarot-the-moon.webp',
    positions: [
      { label: 'You', sub: 'Your situation' },
      { label: 'The other person', sub: 'Their energy' },
      { label: 'The path', sub: 'Where it is heading' }
    ]
  }
};

let currentType = readingTypes.daily;
let positions = currentType.positions;

const arcana = [
  {
    name: 'The Star',
    image: '/juegos/tarot-game/assets/tarot-the-star.webp',
    meaning: 'The Star heralds hope, inspiration and a deep recovery of confidence. After a demanding stage, a direction that feels authentic appears once again. It does not promise instant results: it reminds you that faith becomes powerful when you accompany it with small gestures, patience and a sincere willingness to receive help. Waite reads it as loss, theft, privation or abandonment; another reading speaks of hope and good prospects.',
    history: 'The Star represents the calm that comes after the storm: a figure pours water beneath an open sky, a reminder that trust can also be a form of guidance. In the Tarot tradition, her nakedness symbolizes truth and vulnerability, while the waters she tends speak of healing what is within and what is without.',
    meanings: {
      daily: 'Your day brings a sign of relief, renewal and emotional clarity. A kind conversation, an inspiring idea or a feeling of breathing again with more room may arise. Do not let the hope remain only a thought: choose one concrete gesture to care for what gives you hope again, and let your sensitivity show you where to begin.',
      weekly: 'The week opens with a luminous direction and an energy that favors recovering confidence. Something that seemed distant may begin to take shape if you sustain it with constancy, without demanding an immediate answer. Listen to the ideas that return again and again, share your vision with like-minded people and let patience turn inspiration into real progress.',
      pastPresentFuture: 'In the past, this card speaks of a hope that sustained you or a wound you learned to heal; in the present, it points to an inspiration that is igniting again; and toward the future, it shows a luminous possibility that grows slowly. Your task is to protect that vision without idealizing it and to give it a workable form through sustained action.',
      love: 'In love, sincerity, tenderness and vulnerability can repair distance. This card favors a bond in which both people can show themselves without acting from fear or demand. If you are looking for a relationship, let your authenticity attract a healthier encounter; if a bond already exists, nurture hope with actions and transparent conversations.',
      friendship: 'In friendship, a transparent gesture can restore trust and remind you why the bond matters. Share what you value, acknowledge what has supported you and avoid hiding your needs behind a false self-sufficiency. Closeness will return naturally when there is room for joy, honesty and mutual care.',
      work: 'At work, a clear vision can become a valuable opportunity, especially if you present it with simplicity and purpose. Your creativity deserves to be heard, but it will need a plan to support it. Trust your ability, seek alliances with people who understand your approach and move forward step by step, without measuring your progress by speed alone.'
    }
  },
  {
    name: 'The Moon',
    image: '/juegos/tarot-game/assets/tarot-the-moon.webp',
    meaning: 'The Moon speaks of intuition, dreams, deep emotions and paths that do not yet reveal all their details. What is invisible also communicates, but not every hunch is a certainty. This card invites you to cross through uncertainty with sensitivity, check the facts and give truth time to appear without forcing it. Waite associates it with hidden enemies, danger, slander, darkness, terror, deception, occult forces and error.',
    history: 'The Moon opens a landscape of intuition, reflections and ambiguous paths. Its light does not remove the shadows: it teaches you to walk with sensitivity until you recognize the truth. The creatures that answer its call and the path that vanishes into the distance remind us that the subconscious may point to something important, even if it still needs interpretation and care.',
    meanings: {
      daily: 'Your sensitivity will be especially awake, and you may perceive nuances that usually go unnoticed. Observe your emotions with respect, but do not turn every hunch into a definitive conclusion. Before reacting, breathe, ask questions and wait for a clearer sign; what seems confusing today may look different once you have rested or see it from another perspective.',
      weekly: 'The week may bring mixed signals, mood swings or incomplete information. Review the important facts, listen to your intuition and avoid rushing to a conclusion just to feel in control. It is a good time to investigate, write down what you know and separate facts from fears; clarity will come when you stop feeding stories without confirmation.',
      pastPresentFuture: 'In the past, there may have been doubts, secrets or unclear paths that left an emotional mark; the present asks you to observe without assuming and to recognize which fear is having an influence; the future becomes clear when you allow the truth to mature. You do not need to resolve everything at once: move forward with prudence, verify and trust what becomes coherent.',
      love: 'In love, there are deep emotions that have not yet found words, and perhaps one of the two people is interpreting silences from insecurity. Ask gently, express what you need and do not fill the empty spaces with assumptions. The card does not deny the feeling: it asks you to tell apart a true intuition, an old fear and a promise that has no actions behind it yet.',
      friendship: 'In friendship, it is wise to distinguish a perception from a fact before pulling away or demanding explanations. Speak from what you feel, listen to the other person’s side and avoid repeating rumors. An honest bond can get through discomfort if both parties give themselves time to clear up the misunderstanding without turning it into a verdict.',
      work: 'At work, a poorly defined situation calls for investigation and attention to detail. Do not decide based on rumor or promise more than you can verify: gather data, ask in writing when necessary and review your assumptions. Your intuition will be useful as an alarm, but the final decision must rest on evidence and a clear strategy.'
    }
  },
  {
    name: 'The Sun',
    image: '/juegos/tarot-game/assets/tarot-the-sun.webp',
    meaning: 'The Sun illuminates truth, vitality, shared joy and confidence in your own ability. It brings an energy of openness in which things can be named without disguises and enjoyed without guilt. Its message is not to hide difficulties, but to face them with clarity, generosity and the certainty that life can also be simple.',
    history: 'The Sun celebrates visible life, shared joy and truth without disguises. Its light is a reminder that growing can also feel warm, simple and full. The solar image is tied to awareness, vitality and recognition: after passing through shadows, what was hidden can show itself with a clarity that lets you move forward with fewer defenses.',
    meanings: {
      daily: 'Your day favors clarity, energy and encounters that give you back your enthusiasm. Make visible what matters to you, celebrate a concrete step forward and let your good mood be contagious without turning it into an obligation. If a problem appears, look at it head on: you will get better results by speaking honestly than by complicating what can be resolved simply.',
      weekly: 'The week has a fertile, expansive center that is favorable for communication. Your efforts may receive recognition, especially when you share the credit and make your way of thinking accessible. Celebrate your progress without losing perspective, organize your energy and use it to simplify what seemed complicated; joy will last longer if it also includes rest and gratitude.',
      pastPresentFuture: 'The past left you an important truth, a joy or an experience that taught you to trust your strength; the present illuminates what you truly want; and the future promises expansion if you show yourself clearly. The card asks you not to hide your talents: the path opens when you stop asking permission to take your place.',
      love: 'In love, honesty can open a joyful, warm stage, freer of interpretations. Enjoy each other’s presence, express affection naturally and allow the bond to have moments of play. If there is a conversation still pending, the light of the Sun favors telling the truth without punishment or drama, remembering that a healthy relationship should also feel alive.',
      friendship: 'In friendship, shared joy strengthens the bond and makes visible the affection that is sometimes taken for granted. Seek a real meeting, celebrate the other person and acknowledge their presence in your life. This card also invites you to mend things with frankness: a clear, affectionate message can bring warmth back to a relationship that had grown distant.',
      work: 'At work, showing your abilities naturally can bring recognition, visibility and new responsibilities. Collaborate, celebrate the team’s achievements and lead from transparency instead of competing from fear. It is a fertile time to present projects, ask for clarity about your growth and turn a good idea into a result everyone can see.'
    }
  },
  {
    name: 'The Hermit',
    image: '/juegos/tarot-game/assets/tarot-the-hermit.webp',
    meaning: 'The Hermit invites fertile silence, introspection and the search for a truth of your own. The answer will not come from accumulating more opinions, but from separating the noise from what is essential. His solitude is neither isolation nor punishment: it is a conscious space to let a decision mature, regain perspective and walk with an inner light that does not depend on outside approval. Waite reads it as prudence and circumspection, and also warns of treason, dissimulation and corruption.',
    history: 'The Hermit walks forward with a lantern in the night. His wisdom is not born of isolating himself, but of taking the time needed to listen to a truth of his own. The lantern lights only the next stretch of the road: an image of patience, experience and discernment that reminds us we do not need to know the whole future to take the next step with dignity.',
    meanings: {
      daily: 'Your day asks you to turn down the noise and recover a more intimate rhythm. A brief pause, without screens or other people’s opinions, can give you back the perspective you need to tell desire from pressure. Do not mistake slowness for failure: today an honest observation, a quiet read or a conversation with someone wise may be worth more than ten impulsive answers.',
      weekly: 'The week invites you to choose quality over speed. Set aside time to think, sort out priorities and review which commitments still make sense. It may be necessary to set a limit on constant availability or to ask advice from someone with experience. Moving forward with a more conscious intention will take you farther than trying to respond to everything at once.',
      pastPresentFuture: 'The past taught you to look for answers within and to learn from periods of distance; the present asks for a conscious pause to listen to what you truly know; and the future is revealed step by step when you follow your own light. Do not force an immediate definition: the understanding you are building will be more solid because it is born of experience, reflection and honesty.',
      love: 'In love, a space for reflection can be more useful than an immediate reaction. Listen to your needs before asking the bond for answers, and ask yourself which part of your desire comes from affection and which from the fear of being alone. The card favors a calm, mature conversation, but it also reminds you that withdrawing too much can become a way of not letting yourself be known.',
      friendship: 'In friendship, respecting each other’s rhythms protects trust. Take a moment to understand what you want to offer before seeking a conversation, and explain your silence so it does not turn into unexplained distance. A friend may need your simple presence, not a perfect solution; being available with honesty will be more valuable than saying a lot.',
      work: 'At work, concentration, accumulated experience and research are your best resources. Review the plan in silence, identify the underlying problem and come back with a mature proposal, even if it is not yet spectacular. Avoid deciding under group pressure: a short period of study can give you the quiet authority you need to defend a better solution.'
    }
  },
  {
    name: 'Wheel of Fortune',
    image: '/juegos/tarot-game/assets/tarot-wheel-fortune.webp',
    meaning: 'The Wheel heralds movement, changes of cycle and opportunities that appear when a stage stops being static. It reminds you that not everything is under your control, but you can choose how to respond to the turn. Accepting change does not mean giving up your will: it means recognizing the moment, learning from what happens and making the most of the direction that opens.',
    history: 'The Wheel speaks of the movement of cycles and of the opportunities that appear when a stage changes. Nothing stays still forever. Its turning recalls the alternation between rises and falls, fortune and learning: the key is not to cling to a position, but to develop the presence needed to act when the movement offers you a new possibility.',
    meanings: {
      daily: 'Something may shift in rhythm during the day: a piece of news, a coincidence or a change of plans may disrupt your schedule. Stay flexible without losing your center; the unexpected variation could open a door you were not looking for. Before resisting, ask what resource, encounter or lesson becomes available thanks to that turn.',
      weekly: 'The week is in motion and may change your plans, priorities or expectations. Adapt without interpreting every change as a loss: the turn may also free you from a structure that no longer worked. Prepare alternatives, keep what is essential and stay alert to the opportunities that appear precisely because the scene stopped being predictable.',
      pastPresentFuture: 'The past marks a cycle that has already changed and left lessons you can now use; the present is turning and asks you to respond with agility; the future opens an opportunity when you accept moving forward without trying to control every detail. Luck may play a part, but your preparation, your flexibility and the decision to get moving will be just as important.',
      love: 'In love, the relationship is going through a change of stage and can no longer be sustained exactly as before. Do not try to freeze the moment: talk about what you both need now, even if the answer changes your expectations. A turn can bring you closer, renew things or reveal a truth; what matters most is to respond honestly instead of clinging to a past version of the bond.',
      friendship: 'In friendship, a new dynamic can renew the bond. Accept that people change, that rhythms may drift apart for a while and that closeness can also find new forms. If an opportunity to reconnect arises, take part without insisting that everything be the same as before: the friendship will grow by adapting to present reality.',
      work: 'At work, an opportunity may arise from a change in structure, team or priorities. Prepare to respond with agility and judgment, but avoid moving out of sheer anxiety. Update your skills, ask how the new scene affects you and turn uncertainty into an advantage: whoever understands the turn first can take a decisive place in the next stage.'
    }
  },
  {
    name: 'The High Priestess',
    image: '/juegos/tarot-game/assets/tarot-high-priestess.webp',
    meaning: 'The High Priestess represents intuition, deep knowledge and truths that are not yet ready to be fully shown. Your inner wisdom already knows part of the answer, but it needs silence, observation and time to tell an authentic sign from a passing desire. Protect what is being gestated: not everything should be announced before it matures.',
    history: 'The High Priestess guards the threshold between the visible and the secret. Her presence teaches that waiting, observing and keeping silent are also acts of power. Seated between two pillars, she represents the balance of opposites and the understanding of mysteries that are not conquered by force, but through attention, memory, intuition and respect for hidden rhythms.',
    meanings: {
      daily: 'Not everything needs to be explained today or shared with everyone. Keep a space for intuition, notice what repeats and listen to your body’s reactions before taking a stance. An answer may come in a seemingly casual conversation or in a detail you used to overlook; stay receptive without forcing the search for signs.',
      weekly: 'The week holds an answer that reveals itself little by little. Trust observation, protect your energy and avoid announcing a project before you are clear about what it needs. It is a good time to read, research, listen and prepare a strategy in silence. When the moment to act arrives, you will have more confidence because you respected everything that was still taking shape.',
      pastPresentFuture: 'The past holds a silent lesson that perhaps only now can you understand; the present asks you to listen to your intuition and observe what goes unsaid; the future opens when you protect what is still being gestated. Do not confuse mystery with a block: some processes need privacy to grow strong before becoming a visible decision.',
      love: 'In love, there is a subtle truth asking to be heard, and it may appear in the consistency between words, gestures and silences. Do not force definitions to calm anxiety: observe, ask when necessary and let trust be built over time. The card also reminds you to keep your boundaries and not reveal more than makes you feel safe.',
      friendship: 'In friendship, attentive listening will be more valuable than quick advice. Respect confidentiality, acknowledge what the other person cannot yet name and let the bond reveal its need without invading it. If you sense tension, approach with tact: a discreet, steady presence can heal more than a brilliant explanation.',
      work: 'At work, information that is not yet visible matters. Investigate, listen to the conversations between the lines and keep your best strategy until you have the right moment to share it. This is not about acting secretively, but about nurturing an idea in development and making decisions based on knowledge, not on the pressure to prove you already have all the answers.'
    }
  }
];

arcana.push(...additionalCards);
arcana.forEach(enrich);

const music = (function(){try{var t=window.top;if(t!==window&&t.PortalMusic)return t.PortalMusic.proxy;}catch(e){}return null;})() || new Audio('/assets/audio/musica-portal.mp3');
music.loop = true;
music.volume = 0.22;
const selectSound = PMS('/juegos/tarot-game/assets/audio/card-selection-chime.mp3');
selectSound.volume = 0.46;
const revealSound = PMS('/juegos/tarot-game/assets/audio/tarot-reveal-flip.mp3');
revealSound.volume = 0.5;

let muted = false;
let audioUnlocked = false;
let chosen = [];
let busy = false;
let activeIndex = 38;
let stage;
let stageWorld;
let deck;
let cards = [];
let manualLarge = false;

function build() {
  const mount = document.querySelector('#game-container');
  mount.innerHTML = `
    <main id="stage" class="presentation-active" aria-label="Tarot reading table">
      <div id="stage-world">
      <div id="stars"></div><div class="mist m1"></div><div class="mist m2"></div>
      <header><p class="eyebrow">Tarot</p><h1 id="current-reading-name">Tarot</h1><div class="rule"></div></header>
      <section id="presentation-screen" aria-label="Tarot presentation">
        <div class="presentation-frame">
          <p class="presentation-badge">The oracle</p>
          <h2 class="presentation-title">Tarot</h2>
          <p class="presentation-subtitle">Tarot Readings</p>
          <div class="presentation-actions">
            <button id="begin-reading">✦ &nbsp; Begin reading</button>
          </div>
        </div>
      </section>
      <section id="selection-screen" aria-label="Select your type of Tarot">
        <div class="selection-panel">
          <p class="eyebrow">Before consulting the cards</p>
          <h2>What reading are you seeking today?</h2>
          <p class="selection-intro">Choose a focus so the oracle can prepare a spread tailored to you.</p>
          <div class="type-options">${Object.values(readingTypes).map(type => `
            <button type="button" class="type-option" data-type="${type.id}" aria-label="Choose ${type.name}">
              <span class="type-art" style="background-image:url('${type.image}')"></span>
              <span class="type-option-copy"><strong>${type.name}</strong><small>${type.count} ${type.count === 1 ? 'card' : 'cards'}</small><em>${type.description}</em></span>
              <span class="type-arrow">✦</span>
            </button>`).join('')}</div>
        </div>
      </section>
      <section id="table-ui" aria-label="Reading table">
        <div id="current-type"></div>
        <div id="prompt" aria-live="polite">Choose a card to discover your <strong>Beginning</strong></div>
        <div id="deck" role="button" tabindex="0" aria-label="Deck of 78 cards. Choose a card"></div>
        <div id="counter">78 CARDS · 3 CHOICES</div>
        <section id="spread" aria-label="Three-card spread"></section>
        <button id="details-button">✦ &nbsp; View details</button>
      </section>
      <button id="expand-button" aria-label="Enter full screen" title="Enter full screen">⛶</button>
      <button id="sound-button" aria-label="Mute sound" title="Sound">♫</button>
      <section id="reading" role="dialog" aria-modal="true" aria-label="Details of your reading"><div class="reading-panel">
        <p class="eyebrow">Your inner map</p><h2 id="reading-title">Tarot Reading</h2><p class="reading-intro" id="reading-intro"></p>
        <div id="special-tools">
          <p class="special-heading">Create a special reading</p>
          <div class="reading-modes" role="tablist" aria-label="Reading focus">
            <button type="button" class="mode-button selected" data-mode="clarity" role="tab" aria-selected="true">✦ Clarity</button>
            <button type="button" class="mode-button" data-mode="connection" role="tab" aria-selected="false">♡ Bonds</button>
            <button type="button" class="mode-button" data-mode="purpose" role="tab" aria-selected="false">☾ Purpose</button>
          </div>
          <article class="special-reading" id="special-reading" aria-live="polite"></article>
        </div>
        <div class="reading-grid" id="reading-grid"></div><p class="synthesis" id="synthesis"></p>
        <div class="panel-actions"><button type="button" id="restart">New reading</button><button type="button" class="secondary" id="choose-type">Choose another Tarot</button><button type="button" class="secondary" id="close-reading">Back to the cards</button></div>
      </div></section>
      </div>
    </main>`;
  stage = document.querySelector('#stage');
  stageWorld = document.querySelector('#stage-world');
  deck = document.querySelector('#deck');
  renderSpread();
  makeStars();
  makeDeck();
  bindEvents();
  updateTableHeader();
  resize();
  requestAnimationFrame(resize);
}

function makeStars() {
  const field = document.querySelector('#stars');
  const rng = mulberry32(7821);
  for (let i = 0; i < 44; i++) {
    const s = document.createElement('i');
    s.className = 'star';
    s.style.left = `${rng() * 100}%`;
    s.style.top = `${rng() * 72}%`;
    s.style.setProperty('--t', `${1.2 + rng() * 2.8}s`);
    s.style.animationDelay = `${-rng() * 3}s`;
    field.appendChild(s);
  }
}

function makeDeck() {
  cards = [];
  for (let i = 0; i < 78; i++) {
    const card = document.createElement('div');
    card.className = 'deck-card';
    card.dataset.index = i;
    deck.appendChild(card);
    cards.push(card);
  }
  layoutDeck();
  updateActive(activeIndex);
}

function layoutDeck() {
  if (!deck || !cards.length) return;
  const styles = getComputedStyle(cards[0]);
  const cardWidth = parseFloat(styles.width) || 96;
  const cardHeight = parseFloat(styles.height) || 156;
  const portrait = stage?.classList.contains('portrait-layout');
  const fanAngle = portrait ? 58 : 52;
  const pivotX = deck.clientWidth / 2;
  const pivotY = deck.clientHeight - (portrait ? 22 : 16);
  const fanRadius = portrait ? 210 : 90;

  cards.forEach((card, i) => {
    const t = i / 77;
    const angle = -fanAngle + t * fanAngle * 2;
    const radians = angle * Math.PI / 180;
    const bottomX = pivotX + Math.sin(radians) * fanRadius;
    const bottomY = pivotY - Math.cos(radians) * fanRadius;

    // A radial fan: the lower edges follow a hand-held arc and the cards
    // open outward from one low central grip, showing only their backs.
    card.style.left = `${bottomX - cardWidth / 2}px`;
    card.style.top = `${bottomY - cardHeight}px`;
    card.style.zIndex = String(i + 1);
    card.style.transform = `rotate(${angle}deg)`;
  });
}

function bindEvents() {
  document.querySelector('#begin-reading').addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    showTypeSelection(false);
  });
  document.querySelectorAll('.type-option').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      selectReadingType(button.dataset.type);
    });
  });
  bindSelectionScrolling();
  deck.addEventListener('pointermove', e => {
    if (busy || chosen.length >= currentType.count) return;
    updateActive(deckIndexFromPointer(e));
  });
  deck.addEventListener('pointerleave', () => updateActive(38));
  deck.addEventListener('click', e => chooseCard(deckIndexFromPointer(e)));
  deck.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); updateActive(Math.max(0, activeIndex - 1)); }
    if (e.key === 'ArrowRight') { e.preventDefault(); updateActive(Math.min(77, activeIndex + 1)); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chooseCard(activeIndex); }
  });
  document.querySelector('#details-button').addEventListener('click', openReading);
  document.querySelectorAll('.mode-button').forEach(button => {
    button.addEventListener('click', () => renderSpecialReading(button.dataset.mode));
  });
  document.querySelector('#close-reading').addEventListener('click', closeReading);
  document.querySelector('#choose-type').addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    showTypeSelection(true);
  });
  document.querySelector('#restart').addEventListener('click', restart);
  document.querySelector('#sound-button').addEventListener('click', toggleSound);
  document.querySelector('#expand-button').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  window.addEventListener('resize', resize);
  window.visualViewport?.addEventListener('resize', resize);
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
}

function bindSelectionScrolling() {
  const selection = document.querySelector('#selection-screen');
  if (!selection) return;

  let pointerId = null;
  let startY = 0;
  let startScrollTop = 0;
  let dragging = false;

  const endDrag = event => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    dragging = false;
    if (selection.hasPointerCapture?.(event.pointerId)) selection.releasePointerCapture(event.pointerId);
  };

  selection.addEventListener('pointerdown', event => {
    if (!stage?.classList.contains('compact-landscape')) return;
    pointerId = event.pointerId;
    startY = event.clientY;
    startScrollTop = selection.scrollTop;
    dragging = false;
    selection.setPointerCapture?.(event.pointerId);
  }, { passive: true });

  selection.addEventListener('pointermove', event => {
    if (pointerId !== event.pointerId) return;
    const distance = startY - event.clientY;
    if (!dragging && Math.abs(distance) < 5) return;
    dragging = true;
    event.preventDefault();
    selection.scrollTop = Math.max(0, startScrollTop + distance);
  }, { passive: false });

  selection.addEventListener('pointerup', endDrag, { passive: true });
  selection.addEventListener('pointercancel', endDrag, { passive: true });
  selection.addEventListener('wheel', event => {
    if (!stage?.classList.contains('compact-landscape')) return;
    if (selection.scrollHeight <= selection.clientHeight) return;
    event.preventDefault();
    selection.scrollTop += event.deltaY;
  }, { passive: false });

  selection.addEventListener('keydown', event => {
    if (!stage?.classList.contains('compact-landscape')) return;
    if (event.key === 'PageDown' || event.key === 'ArrowDown') {
      event.preventDefault();
      selection.scrollTop += event.key === 'PageDown' ? selection.clientHeight * .82 : 80;
    }
    if (event.key === 'PageUp' || event.key === 'ArrowUp') {
      event.preventDefault();
      selection.scrollTop -= event.key === 'PageUp' ? selection.clientHeight * .82 : 80;
    }
    if (event.key === 'End') {
      event.preventDefault();
      selection.scrollTop = selection.scrollHeight;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      selection.scrollTop = 0;
    }
  });
}


/* Una tirada al día por tipo: queda guardada hasta medianoche. */
function pmDay() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function pmLoad(id) { try { const r = JSON.parse(localStorage.getItem('pm-daily-tarot-' + id) || 'null'); return r && r.day === pmDay() ? r : null; } catch { return null; } }
function pmSave(id, cardsDone) { try { localStorage.setItem('pm-daily-tarot-' + id, JSON.stringify({ day: pmDay(), cards: cardsDone.map(c => ({ name: c.name, reversed: !!c.reversed })) })); } catch {} }
function pmLeft() { const n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), t = Math.ceil((m - n) / 60000); return `${Math.floor(t / 60)} h ${t % 60} min`; }
function lockedToday() { return !!pmLoad(currentType.id); }
function restoreToday() {
  const saved = pmLoad(currentType.id);
  if (!saved) return false;
  const restored = saved.cards.map(c => { const a = arcana.find(x => x.name === c.name); return a ? { ...a, reversed: c.reversed } : null; }).filter(Boolean);
  if (restored.length !== currentType.count) return false;
  chosen = restored;
  cards.forEach(c => { c.classList.add('used'); c.classList.remove('active'); });
  chosen.forEach((card, i) => {
    const target = document.querySelector(`[data-slot="${i}"]`);
    if (!target) return;
    const el = createCard(card, 'placed-card');
    el.querySelector('.card-inner').classList.add('flipped');
    target.classList.add('filled');
    target.appendChild(el);
  });
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('current'));
  document.querySelector('#prompt').innerHTML = `Your ${currentType.name.toLowerCase()} for today has already spoken <strong>✦</strong> New spread in ${pmLeft()}`;
  document.querySelector('#counter').textContent = `TODAY’S SPREAD · COME BACK TOMORROW`;
  document.querySelector('#details-button').classList.add('show');
  return true;
}
function markDoneTypes() {
  document.querySelectorAll('.type-option').forEach(b => {
    const sm = b.querySelector('small'); if (!sm) return;
    sm.textContent = sm.textContent.replace(/ · .*$/, '');
    if (pmLoad(b.dataset.type)) sm.textContent += ' · ✓ done today, come back tomorrow';
  });
}

function selectReadingType(id) {
  currentType = readingTypes[id] || readingTypes.daily;
  positions = currentType.positions;
  renderSpread();
  resetBoard();
  restoreToday();
  setScreen('table');
  requestAnimationFrame(() => deck?.focus({ preventScroll: true }));
}

function showTypeSelection(reset = false) {
  if (!stage) return;
  if (reset) resetBoard();
  const selection = document.querySelector('#selection-screen');
  if (selection) selection.scrollTop = 0;
  markDoneTypes();
  setScreen('selection');
  requestAnimationFrame(() => document.querySelector('.type-option')?.focus({ preventScroll: true }));
}

function closeReading() {
  setScreen('table');
  requestAnimationFrame(() => deck?.focus({ preventScroll: true }));
}

function setScreen(screen) {
  if (!stage) return;
  const reading = document.querySelector('#reading');
  const selection = document.querySelector('#selection-screen');
  stage.classList.remove('presentation-active', 'selection-active');
  reading?.classList.remove('open');

  if (selection) {
    selection.style.removeProperty('z-index');
    selection.style.removeProperty('opacity');
    selection.style.removeProperty('visibility');
    selection.style.removeProperty('pointer-events');
  }
  if (reading) {
    reading.style.removeProperty('opacity');
    reading.style.removeProperty('visibility');
    reading.style.removeProperty('pointer-events');
    reading.style.removeProperty('transition');
  }

  if (screen === 'presentation') stage.classList.add('presentation-active');
  if (screen === 'selection') {
    stage.classList.add('selection-active');
    if (selection) {
      selection.style.zIndex = '50';
      selection.style.opacity = '1';
      selection.style.visibility = 'visible';
      selection.style.pointerEvents = 'auto';
    }
    if (reading) {
      reading.style.opacity = '0';
      reading.style.visibility = 'hidden';
      reading.style.pointerEvents = 'none';
      reading.style.transition = 'none';
    }
  }
  if (screen === 'reading' && reading) reading.classList.add('open');
}

function renderSpread() {
  const spread = document.querySelector('#spread');
  if (!spread) return;
  spread.classList.toggle('single-spread', currentType.count === 1);
  spread.setAttribute('aria-label', `Spread of ${currentType.count} ${currentType.count === 1 ? 'card' : 'cards'}`);
  spread.innerHTML = positions.map((p, i) => `<div class="position"><div class="slot ${i === 0 ? 'current' : ''}" data-slot="${i}" aria-label="${p.label}"></div><div class="position-label">${p.label}</div>${p.sub ? `<div class="position-subtitle">${p.sub}</div>` : ''}</div>`).join('');
}

function updateTableHeader() {
  document.querySelector('#current-type').textContent = `${currentType.name} · ${currentType.count} ${currentType.count === 1 ? 'CARD' : 'CARDS'}`;
  const title = document.querySelector('#current-reading-name');
  if (title) title.textContent = currentType.name;
}

function deckIndexFromPointer(event) {
  const rect = deck.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  return Math.max(0, Math.min(77, Math.round(ratio * 77)));
}

function updateActive(index) {
  cards[activeIndex]?.classList.remove('active');
  activeIndex = index;
  if (!cards[index]?.classList.contains('used')) cards[index]?.classList.add('active');
}

async function chooseCard(index) {
  if (busy || chosen.length >= currentType.count || cards[index]?.classList.contains('used')) return;
  if (lockedToday()) return;
  busy = true;
  unlockAudio();
  play(selectSound);
  const slotIndex = chosen.length;
  const available = arcana.filter(a => !chosen.some(c => c.name === a.name));
  const readingCard = { ...available[Math.floor(Math.random() * available.length)], reversed: Math.random() < 0.3 };
  chosen.push(readingCard);
  cards[index].classList.add('used');
  cards[index].classList.remove('active');

  const stageRect = stageWorld.getBoundingClientRect();
  const scale = stageRect.width / stageWorld.offsetWidth;
  const sourceRect = cards[index].getBoundingClientRect();
  const target = document.querySelector(`[data-slot="${slotIndex}"]`);
  const targetRect = target.getBoundingClientRect();
  const fly = createCard(readingCard, 'flying-card');
  fly.style.left = `${(sourceRect.left - stageRect.left) / scale}px`;
  fly.style.top = `${(sourceRect.top - stageRect.top) / scale}px`;
  fly.style.width = `${sourceRect.width / scale}px`;
  fly.style.height = `${sourceRect.height / scale}px`;
  const fanAngle = stage.classList.contains('portrait-layout') ? 38 : 34;
  const deckAngle = -fanAngle + (index / 77) * fanAngle * 2;
  fly.style.transform = `rotate(${deckAngle}deg) translateZ(0)`;
  stageWorld.appendChild(fly);
  fly.getBoundingClientRect();
  requestAnimationFrame(() => {
    fly.style.left = `${(targetRect.left - stageRect.left) / scale}px`;
    fly.style.top = `${(targetRect.top - stageRect.top) / scale}px`;
    fly.style.width = '165px';
    fly.style.height = '264px';
    fly.style.transform = 'rotate(0deg) translateZ(0)';
  });

  await wait(820);
  play(revealSound);
  fly.querySelector('.card-inner').classList.add('flipped');
  target.classList.add('filled');
  sparkle(target);
  await wait(850);
  fly.className = 'placed-card';
  fly.removeAttribute('style');
  target.appendChild(fly);
  document.querySelector('#counter').textContent = `${78 - chosen.length} CARDS · ${currentType.count - chosen.length} ${currentType.count - chosen.length === 1 ? 'CHOICE' : 'CHOICES'}`;
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('current'));
  const next = document.querySelector(`[data-slot="${chosen.length}"]`);
  if (next) next.classList.add('current');

  if (chosen.length < currentType.count) {
    document.querySelector('#prompt').innerHTML = promptForPosition(chosen.length);
    busy = false;
    updateActive((index + 23) % 78);
  } else {
    pmSave(currentType.id, chosen);
    document.querySelector('#prompt').innerHTML = `Your ${currentType.name.toLowerCase()} is complete <strong>✦</strong> You can do another tomorrow`;
    document.querySelector('#details-button').classList.add('show');
    document.querySelector('#counter').textContent = `${78 - chosen.length} CARDS · FULL READING`;
    busy = false;
  }
}

function promptForPosition(index) {
  if (currentType.count === 1) return `Reveal <strong>${positions[index].label}</strong>`;
  return `Now choose a card for your <strong>${positions[index].label}</strong>`;
}

function createCard(data, className) {
  const el = document.createElement('div');
  el.className = className;
  el.innerHTML = data.reversed
    ? `<div class="card-inner"><div class="card-side card-back"></div><div class="card-side card-face"><div class="face-art" style="background-image:url('${data.image}')"></div><div class="card-name">${data.name}</div></div></div>`
    : `<div class="card-inner"><div class="card-side card-back"></div><div class="card-side card-face" style="background-image:url('${data.image}')"><div class="card-name">${data.name}</div></div></div>`;
  return el;
}

function sparkle(target) {
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = i % 3 === 0 ? '✦' : '·';
    s.style.left = `${target.offsetLeft + target.offsetWidth / 2}px`;
    s.style.top = `${target.offsetTop + target.offsetHeight / 2}px`;
    const a = (Math.PI * 2 * i) / 14;
    const d = 90 + Math.random() * 80;
    s.style.setProperty('--dx', `${Math.cos(a) * d}px`);
    s.style.setProperty('--dy', `${Math.sin(a) * d}px`);
    stageWorld.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
}

function openReading() {
  const grid = document.querySelector('#reading-grid');
  grid.className = `reading-grid ${chosen.length === 1 ? 'single-reading' : 'three-reading'}`;
  grid.innerHTML = chosen.map((c, i) => `<article class="reading-item">
    <div class="reading-art${c.reversed ? ' rev' : ''}" style="background-image:url('${c.image}')" aria-label="${c.name}${c.reversed ? ' (reversed)' : ''}"></div>
    <div class="reading-copy">
      <div class="time">${positions[i].label}${positions[i].sub ? ` · ${positions[i].sub}` : ''}</div>
      <h3>${c.name}${c.reversed ? ' <small class="rev-tag">· reversed</small>' : ''}</h3>
      <div class="reading-section"><span>Interpretation of your spread</span><p>${contextualMeaning(c)}</p></div>
      <div class="reading-section insight"><span>Practical key</span><p>${cardGuidance(c)}</p></div>
      <div class="reading-section reflection"><span>A question to contemplate</span><p>${readingQuestion(c, i)}</p></div>
      <div class="reading-section history"><span>History and symbols</span><p>${c.history}</p></div>
    </div>
  </article>`).join('');
  document.querySelector('#reading-title').textContent = currentType.name;
  document.querySelector('#reading-intro').textContent = currentType.description;
  document.querySelector('#synthesis').textContent = synthesis();
  document.querySelector('#special-tools').hidden = chosen.length === 1;
  if (chosen.length === 3) renderSpecialReading('clarity');

  const readingPanel = document.querySelector('.reading-panel');
  if (readingPanel) {
    readingPanel.scrollTop = 0;
    readingPanel.scrollLeft = 0;
  }
  setScreen('reading');
  requestAnimationFrame(() => {
    const panel = document.querySelector('.reading-panel');
    panel?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });
}

function contextualMeaning(card) {
  if (card.reversed && card.rev) return card.rev.meanings[currentType.id] || `${card.name}, reversed, speaks of ${card.rev.theme}. ${card.rev.advice}`;
  return card.meanings[currentType.id] || card.meaning;
}

function cardGuidance(card) {
  if (card.reversed && card.rev) return card.rev.guidance[currentType.id] || card.rev.advice;
  if (card.guidance?.[currentType.id]) return card.guidance[currentType.id];
  const focus = {
    daily: 'today',
    pastPresentFuture: 'your complete journey',
    love: 'the way you connect with others'
  }[currentType.id] || 'your current situation';
  return `For ${focus}, turn the message of ${card.name} into a small, conscious action. Notice what response you receive and adjust your next step without losing sight of what you truly need.`;
}

function readingQuestion(card, index) {
  const focus = {
    daily: 'What gesture can express this energy today?',
    pastPresentFuture: index === 0
      ? 'What lesson from your past is still asking to be acknowledged?'
      : index === 1
        ? 'What present decision can turn this energy into progress?'
        : 'What possibility do you want to nurture from now on?',
    love: 'How can you live this message with honesty, care, and clear boundaries?'
  }[currentType.id] || 'Which part of this message deserves your attention?';
  return `${focus} Let ${card.name} be an open question, not a verdict.`;
}

function renderSpecialReading(mode) {
  if (chosen.length < 3) return;
  const [first, second, third] = chosen;
  const readings = {
    clarity: {
      kicker: `Special reading · Clarity · ${currentType.name}`,
      title: 'The light for your next step',
      text: `${first.name} shows the root of the matter, ${second.name} points to the pulse of your present, and ${third.name} opens a possibility that will grow when you act with simplicity.`,
      advice: 'Name one single decision that can bring you closer to that possibility today.'
    },
    connection: {
      kicker: `Special reading · Connections · ${currentType.name}`,
      title: 'What lies between the moons',
      text: `A conversation emerges between ${first.name}, ${second.name}, and ${third.name}: acknowledge what you bring, listen to what is happening, and let the bond find its true shape.`,
      advice: 'Offer an honest conversation without trying to control the response.'
    },
    purpose: {
      kicker: `Special reading · Purpose · ${currentType.name}`,
      title: 'The compass of your path',
      text: `Your journey moves from ${first.name} to ${second.name} and projects toward ${third.name}: it is not a verdict, but an invitation to turn intuition into small, steady action.`,
      advice: 'Set aside a moment of silence and write down which value you want to embody this week.'
    }
  };
  const reading = readings[mode] || readings.clarity;
  document.querySelectorAll('.mode-button').forEach(button => {
    const selected = button.dataset.mode === mode;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  document.querySelector('#special-reading').innerHTML = `<div class="special-kicker">${reading.kicker}</div><h3>${reading.title}</h3><p>${reading.text}</p><div class="special-advice"><span>Key from the oracle</span>${reading.advice}</div>`;
}

function synthesis() {
  const names = chosen.map(c => c.name);
  const nInv = chosen.filter(c => c.reversed).length;
  if (nInv === chosen.length && chosen.length > 1) return 'All the cards came up reversed: this is not a bad omen, but an invitation to look inward, review what is blocked, and adjust slowly before acting.';
  if (names.includes('The Sun') && names.includes('The Star')) return 'Clarity and hope answer each other: what began as intuition can become a luminous direction if you choose to act with simplicity.';
  if (names.includes('The Moon') && names.includes('The High Priestess')) return 'This spread highlights your sensitivity. You do not need to force an immediate certainty; your best compass will be to observe what repeats in your dreams, emotions, and silences.';
  if (names.includes('Wheel of Fortune')) return 'There is movement among the three moons. Honor what you have learned, stay attentive to the present turn, and leave room for a possibility that does not yet have a name.';
  if (currentType.id === 'love') return 'The bond shines brightest when each person can show up with honesty and freedom. Pay attention to present gestures, not only to promises of the future.';
  if (currentType.id === 'daily') return 'Today’s card is an invitation, not a destiny. Carry it with you as a gentle question to see the day with more presence.';
  if (currentType.id === 'pastPresentFuture') return 'This spread weaves together what you have learned, what you are living, and the possibility that is beginning to take shape. See the future as an open direction, not a verdict.';
  return 'Your reading traces a passage from experience toward a more conscious understanding. Move forward without hurry: the answer becomes visible when intention and intuition walk together.';
}

function resetBoard() {
  document.querySelector('#reading')?.classList.remove('open');
  chosen = [];
  busy = false;
  cards.forEach(c => c.classList.remove('used', 'active'));
  document.querySelectorAll('.placed-card, .flying-card').forEach(c => c.remove());
  document.querySelectorAll('.slot').forEach((s, i) => { s.classList.remove('filled', 'current'); if (i === 0) s.classList.add('current'); });
  updateTableHeader();
  document.querySelector('#prompt').innerHTML = promptForPosition(0);
  document.querySelector('#counter').textContent = `78 CARDS · ${currentType.count} ${currentType.count === 1 ? 'CHOICE' : 'CHOICES'}`;
  document.querySelector('#details-button').classList.remove('show');
  document.querySelector('#special-reading').innerHTML = '';
  document.querySelectorAll('.mode-button').forEach((button, i) => {
    const selected = i === 0;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  updateActive(38);
}

function restart() {
  if (lockedToday()) return;
  resetBoard();
}

function unlockAudio() {
  if (audioUnlocked || muted) return;
  audioUnlocked = true;
  music.play().catch(() => { audioUnlocked = false; });
}

function play(audio) {
  if (muted) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function toggleSound() {
  muted = !muted;
  const button = document.querySelector('#sound-button');
  button.textContent = muted ? '♩' : '♫';
  button.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off');
  if (muted) music.pause(); else { audioUnlocked = false; unlockAudio(); }
}

function toggleFullscreen() {
  const container = document.querySelector('#game-container');
  if (document.fullscreenElement) {
    const exit = document.exitFullscreen?.();
    exit?.catch(() => {});
    return;
  }
  if (container.requestFullscreen) {
    container.requestFullscreen().catch(() => {
      manualLarge = !manualLarge;
      resize();
    });
    return;
  }
  manualLarge = !manualLarge;
  resize();
}

function updateFullscreenButton() {
  const button = document.querySelector('#expand-button');
  if (!button) return;
  const active = Boolean(document.fullscreenElement);
  button.textContent = active ? '×' : '⛶';
  button.setAttribute('aria-label', active ? 'Exit full screen' : 'Expand to full screen');
  button.title = active ? 'Exit full screen' : 'Expand to full screen';
  resize();
}

function resize() {
  if (!stage || !stageWorld) return;
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const availableWidth = Math.min(stage.clientWidth || viewportWidth, viewportWidth);
  const availableHeight = Math.min(stage.clientHeight || viewportHeight, viewportHeight);
  const portrait = viewportHeight > viewportWidth;
  const compactLandscape = !portrait && viewportHeight <= 800;
  stage.classList.toggle('portrait-layout', portrait);
  stage.classList.toggle('compact-landscape', compactLandscape);
  const layoutWidth = portrait ? 1200 : DESIGN_WIDTH;
  const baseScale = portrait
    ? Math.min(availableWidth / layoutWidth, 1)
    : Math.min(availableWidth / layoutWidth, availableHeight / DESIGN_HEIGHT);
  const layoutHeight = portrait
    ? Math.max(DESIGN_HEIGHT, availableHeight / baseScale)
    : DESIGN_HEIGHT;
  stageWorld.style.width = `${layoutWidth}px`;
  stageWorld.style.height = `${layoutHeight}px`;
  layoutDeck();
  const scale = baseScale * (manualLarge ? 1.18 : 1);
  stageWorld.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function mulberry32(seed) { return function() { let t = seed += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

build();
setScreen('presentation');

/* PM-DEEPLINK */
(function(){var id=decodeURIComponent((location.hash||'').slice(1));if(!id||!/^[\w-]+$/.test(id))return;var n=0;(function go(){var b=document.querySelector('.type-option[data-type="%s"]'.replace('%s',id));if(b){b.click();setTimeout(function(){try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();window.scrollTo(0,0);if(window.parent!==window)window.parent.scrollTo(0,0);}catch(e){}},350);return;}if(++n<50)setTimeout(go,100);})();})();
