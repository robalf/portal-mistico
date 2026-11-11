// Calculadoras de numerología (versión nativa, sin iframe). Misma lógica que la app original.
import { RICH, PIN, CHAL, MES, SOUL, PERS, KEY, FOCO_DIA, FOCO_TXT, afinidad } from './numerologia-game/numerologia-extra.js?v=1';
function fail(form, message) { form.querySelector('.pc-err').textContent = message; form.querySelector('.pc-result').innerHTML = ''; }
function show(form, html, kind) { form.querySelector('.pc-err').textContent = ''; const out = form.querySelector('.pc-result'); out.innerHTML = '<div class="pc-res">' + html + '</div>'; out.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); if (window.gtag) window.gtag('event', 'reading_complete', { kind: kind + '_native' }); }
function orbit(number, kicker, cls = '') { return `<div class="pc-orbit"><div><div class="pc-kicker">${kicker}</div><div class="pc-num ${cls ? 'pc-pct' : ''}">${number}</div></div></div>`; }
const meanings = {
  1: { title: 'The Spark of Initiation', text: 'Your energy opens paths. You have independence, creativity, and the courage to turn an intuition into a concrete beginning. Your best compass is to act with confidence without isolating yourself.' },
  2: { title: 'The Sensitive Bridge', text: 'You perceive nuances that other people overlook. Cooperation, tact, and listening are your strengths; when you protect your boundaries, your sensitivity becomes a powerful guide.' },
  3: { title: 'The Luminous Voice', text: 'Expression, humor, and imagination add color to your path. Your presence inspires when you share what you feel with simplicity and give your ideas a steady form.' },
  4: { title: 'The Builder Root', text: 'You have a talent for organizing, sustaining, and creating lasting foundations. Patience favors you; leaving a little room for the unexpected turns discipline into freedom.' },
  5: { title: 'The Wind of Change', text: 'Curiosity and adaptability fuel your growth. You learn by living, moving, and experimenting; choosing one clear intention helps keep your energy from scattering.' },
  6: { title: 'The Harmonizing Heart', text: 'Care, beauty, and responsibility form your natural language. You create a refuge for those you love, and you flourish even more when you include yourself in the attention you offer.' },
  7: { title: 'The Deep Gaze', text: 'You seek to understand the invisible behind the everyday. Intuition, analysis, and an inner life are your gifts; sharing your discoveries lets wisdom connect as well.' },
  8: { title: 'The Conscious Power', text: 'You have practical vision and the ability to make things real. You lead best when success and purpose walk together, using your firmness to build shared abundance.' },
  9: { title: 'The Generous Soul', text: 'Compassion, breadth of heart, and a calling to serve mark your vibration. You know how to close cycles with learning; caring for your energy makes your giving calmer and more fruitful.' },
  11: { title: 'The Inspiring Antenna', text: 'Your intuition is intense and picks up on possibilities before they are obvious. You are here to inspire from a place of authenticity; rest and a gentle routine help ground your vision.' },
  22: { title: 'The Great Builder', text: 'You combine a broad vision with the ability to make it real. Your projects can benefit many people when you move forward in stages and trust your team as well.' },
  33: { title: 'The Master Heart', text: 'Your vibration brings together empathy, creativity, and a calling to support others. Your influence grows when you teach by example and remember that serving does not mean demanding perfection of yourself.' }
};

const yearMeanings = {
  1: ['Year of Beginnings', '__Y__ opens a door to choose a direction, start projects, and renew your identity. Take the first step even if the map is not yet complete.'],
  2: ['Year of Connections', 'Patience and cooperation will be your allies. Nurture partnerships, listen to your intuition, and let processes mature at their own pace.'],
  3: ['Year of Expression', 'Your creativity is asking for space. Communicate, learn, celebrate, and let a joyful idea find its audience without chasing an impossible perfection.'],
  4: ['Year of Foundations', 'It is time to set priorities and build with consistency. Each small habit can become a structure that supports you for a long time.'],
  5: ['Year of Movement', 'Changes, discoveries, and new experiences broaden your horizon. Be flexible, but keep one central intention so you can choose with clarity.'],
  6: ['Year of the Heart', 'Home, affection, and meaningful commitments take center stage. Harmony is born from caring for your relationships without forgetting your own needs.'],
  7: ['Year of Wisdom', 'A conscious pause reveals deep answers. Studying, observing, and listening to your inner world will prepare more aligned decisions.'],
  8: ['Year of Harvest', 'Your ability to lead and manifest grows stronger. Organize your resources, recognize your worth, and seek results that also bring well-being.'],
  9: ['Year of Release', 'A cycle reaches its synthesis. Be grateful for what you have learned, let go of what has lost its meaning, and make emotional space for the next stage.']
};

const zodiac = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
function reduce(value, masters = true) {
  let n = Math.abs(Number(value)) || 0;
  while (n > 9 && !(masters && [11, 22, 33].includes(n))) n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  return n;
}
function digits(text) { return String(text).replace(/\D/g, '').split('').reduce((a, d) => a + Number(d), 0); }
function cleanName(name) { return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, ''); }
function nameValue(name) { return cleanName(name).split('').reduce((sum, c) => sum + ((c.charCodeAt(0) - 65) % 9 + 1), 0); }
function validDate(value) { const d = new Date(`${value}T12:00:00`); return value && !Number.isNaN(d.valueOf()) && d <= new Date(); }
function esc(s) { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

const MESES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function onYear(form) {
  const value = form.birth.value;
  if (!validDate(value)) return fail(form, 'Choose a valid date of birth.');
  const [, m, d] = value.split('-').map(Number); const yr = Number(form.yr ? form.yr.value : 2027) || 2027; const number = reduce(d + m + String(yr).split('').reduce((a, c) => a + Number(c), 0), false); const [title, rawText] = yearMeanings[number]; const text = rawText.replace('__Y__', yr);
  const meses = MESES.map((n, i) => `<strong>${n}:</strong> ${MES[reduce(number + i + 1, false)]}`).join('<br>');
  show(form, `${orbit(number, 'Your year ' + yr)}<h3>${title}</h3><p>${text}</p><p><strong>Key of the year:</strong> the underlying energy is that of ${PIN[number]}</p><h3>Month by month</h3><p>Each month has its own number (your year plus the month) and a theme that colors it:</p><p>${meses}</p>`, 'year');
}
function seeded(seed) { let x = seed | 0; return () => { x = Math.imul(x ^ x >>> 16, 2246822507); x = Math.imul(x ^ x >>> 13, 3266489909); return ((x ^= x >>> 16) >>> 0) / 4294967296; }; }
function onLucky(form) {
  const sign = form.sign.value;
  if (!sign) return fail(form, 'Choose a sign to open the reading for today.');
  const now = new Date(); const stamp = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate(); const rand = seeded(stamp + zodiac.indexOf(sign) * 7919); const nums = new Set(); while (nums.size < 5) nums.add(1 + Math.floor(rand() * 49));
  const tone = reduce(stamp + zodiac.indexOf(sign) + 1, false); const focus = FOCO_DIA[tone - 1];
  show(form, `${orbit(sign.slice(0,1), sign)}<div class="lucky-row">${[...nums].sort((a,b)=>a-b).map(n => `<span class="lucky">${n}</span>`).join('')}</div><h3>Your key for today: ${focus}</h3><p>${FOCO_TXT[tone - 1]}</p><p>The numbers are a symbolic game: they serve to give the day intention, and they do not predict results or lotteries.</p>`, 'lucky');
}
function nameNums(name) {
  const c = cleanName(name), v = c.replace(/[^AEIOU]/g, ''), k = c.replace(/[AEIOU]/g, '');
  const expr = reduce(nameValue(name)), soul = v ? reduce(nameValue(v)) : 0, pers = k ? reduce(nameValue(k)) : 0;
  return { expr, soul, pers };
}
function onMatch(form) {
  const a = form.name1.value.trim(), b = form.name2.value.trim();
  if (cleanName(a).length < 2 || cleanName(b).length < 2) return fail(form, 'Enter two names of at least two letters each.');
  const A = nameNums(a), B = nameNums(b), r = x => reduce(x, false);
  const ex = afinidad(r(A.expr), r(B.expr)), so = (A.soul && B.soul) ? afinidad(r(A.soul), r(B.soul)) : ex;
  const percent = Math.round((ex.n + so.n) / 2);
  let title = 'A Connection That Is Cultivated';
  if (percent >= 85) title = 'Magnetic Harmony'; else if (percent >= 75) title = 'Affinity in Motion';
  const na = r(A.expr), nb = r(B.expr);
  show(form, `${orbit(`${percent}%`, 'Compatibility', 'percent')}<h3>${title}</h3>`
    + `<p><strong>${esc(a)}</strong> vibrates at ${A.expr} (${KEY[na]}) and <strong>${esc(b)}</strong> at ${B.expr} (${KEY[nb]}).</p>`
    + `<p><strong>In the way you act:</strong> ${ex.txt}</p>`
    + (A.soul && B.soul ? `<p><strong>In intimacy</strong> (numbers ${A.soul} and ${B.soul}): ${so.txt}</p>` : '')
    + `<p><strong>To care for the relationship:</strong> ${na === nb ? 'For both of you: ' + RICH[na].consejo.charAt(0).toLowerCase() + RICH[na].consejo.slice(1) : esc(a) + ': ' + RICH[na].consejo.charAt(0).toLowerCase() + RICH[na].consejo.slice(1) + ' ' + esc(b) + ': ' + RICH[nb].consejo.charAt(0).toLowerCase() + RICH[nb].consejo.slice(1)}</p>`
    + `<p>The percentage comes from comparing the number of each name and the number of their vowels; it is a symbolic guide, not a verdict.</p>`, 'match');
}
function onName(form) {
  const name = form.fullName.value.trim();
  if (cleanName(name).length < 3) return fail(form, 'Enter a full name of at least three letters.');
  const N = nameNums(name); const number = N.expr; const m = meanings[number] || meanings[reduce(number, false)]; const r = x => reduce(x, false);
  const master = [11, 22, 33].includes(number) ? `<p>Your number is a master number (${number}): it is lived as ${r(number)} in everyday life and as ${number} when you dare to step into its highest calling.</p>` : '';
  show(form, `${orbit(number, 'Name vibration')}<h3>${m.title}</h3><p><strong>${esc(name)}</strong>: ${m.text}</p>${master}`
    + (N.soul ? `<p><strong>Your inner desire (vowels, number ${N.soul}):</strong> ${SOUL[r(N.soul)]}</p>` : '')
    + (N.pers ? `<p><strong>Your outer image (consonants, number ${N.pers}):</strong> ${PERS[r(N.pers)]}</p>` : '')
    + `<p>This reading speaks to how you present yourself and create; you can make it your own, without rigid labels.</p>`, 'name');
}


const HANDLERS = { year: onYear, lucky: onLucky, match: onMatch, name: onName };
export function mount(kind) {
  const form = document.querySelector('form.pc-form'); if (!form) return;
  form.addEventListener('submit', e => { e.preventDefault(); HANDLERS[kind](form); });
}
