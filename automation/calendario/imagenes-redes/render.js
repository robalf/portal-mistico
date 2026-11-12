const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=JSON.parse(fs.readFileSync('/tmp/calimg/data.json','utf8'));
const F='file:///tmp/calimg/node_modules/@fontsource';
const fonts=`
@font-face{font-family:Fr;font-weight:400;src:url(${F}/fraunces/files/fraunces-latin-400-normal.woff2)}
@font-face{font-family:Fr;font-weight:600;src:url(${F}/fraunces/files/fraunces-latin-600-normal.woff2)}
@font-face{font-family:Fr;font-weight:400;font-style:italic;src:url(${F}/fraunces/files/fraunces-latin-400-italic.woff2)}
@font-face{font-family:Ws;font-weight:400;src:url(${F}/work-sans/files/work-sans-latin-400-normal.woff2)}
@font-face{font-family:Ws;font-weight:500;src:url(${F}/work-sans/files/work-sans-latin-500-normal.woff2)}
@font-face{font-family:Ws;font-weight:600;src:url(${F}/work-sans/files/work-sans-latin-600-normal.woff2)}
${[...Array(11).keys()].map(i=>`@font-face{font-family:Em;src:url(${F}/noto-color-emoji/files/noto-color-emoji-${i}-400-normal.woff2)}`).join('')}`;
const T={es:{kicker:'Calendario esotérico',tz:'Fechas según la hora del Este de EE. UU.',cta:'Todo el mes, día por día',url:'elportalmistico.com/calendario',save:'Guárdalo para tenerlo a mano ✦'},
         en:{kicker:'Esoteric calendar',tz:'Dates in U.S. Eastern Time',cta:'The whole month, day by day',url:'elportalmistico.com/en/calendar',save:'Save it for later ✦'}};
function rnd(seed){return()=>{seed=(seed*16807)%2147483647;return seed/2147483647}}
function stars(w,h,seed){const r=rnd(seed);let s='';for(let i=0;i<130;i++){const x=r()*w,y=r()*h,z=r()*2.2+.4,o=r()*.6+.15;s+=`<i style="left:${x}px;top:${y}px;width:${z}px;height:${z}px;opacity:${o}"></i>`}return s}
function html(lang,key,W,H){
 const m=D[lang][key],t=T[lang],col={};D[lang].legend.forEach(l=>col[l.cat]=l.color);
 const story=H>1500, n=m.ev.length;
 const rowH=story? Math.min(84,880/n) : Math.min(82,720/n);
 const fs=story? Math.min(34,rowH*.44): Math.min(31,rowH*.46);
 const rows=m.ev.map(e=>{const day=(e.when.match(/\d+/)||[''])[0];
   return `<div class="r" style="height:${rowH}px"><b class="d">${day}</b><span class="ic" style="border-color:${col[e.cat]};color:${col[e.cat]}">${e.icon}</span><span class="t" style="font-size:${fs}px">${e.title}</span></div>`}).join('');
 const [mon,yr]=m.title.split(' ');
 const used=[...new Set(m.ev.map(e=>e.cat))];
 const legend=D[lang].legend.filter(l=>used.includes(l.cat)).map(l=>`<span><i style="background:${l.color}"></i>${l.label}</span>`).join('');
 return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
 *{margin:0;padding:0;box-sizing:border-box}
 body{width:${W}px;height:${H}px;overflow:hidden;font-family:Ws,Em,sans-serif;color:#EEE7D6;
 background:radial-gradient(120% 70% at 50% -10%,#2a1f55 0%,#120f2e 45%,#05060F 80%);position:relative}
 .st i{position:absolute;border-radius:50%;background:#fff}
 .glow{position:absolute;width:${W*1.1}px;height:${W*1.1}px;left:${-W*.05}px;top:${H-W*.45}px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.16),transparent 62%)}
 .wrap{position:absolute;inset:${story?'150px 90px 280px':'70px 72px 60px'};display:flex;flex-direction:column}
 .brand{font:500 ${story?26:22}px Ws;letter-spacing:.28em;text-transform:uppercase;color:#D4AF37;display:flex;align-items:center;gap:14px}
 .brand:before,.brand:after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,.6),transparent)}
 .k{margin-top:${story?40:26}px;font:italic 400 ${story?40:32}px Fr;color:#C9B8F0;text-align:center}
 h1{font:600 ${story?150:112}px/0.95 Fr;text-align:center;color:#F4E6B8;letter-spacing:-.01em;margin-top:6px;text-shadow:0 0 40px rgba(212,175,55,.35)}
 h1 small{display:block;font:400 ${story?54:42}px Fr;color:#D4AF37;letter-spacing:.2em;margin-top:${story?14:8}px}
 .list{margin-top:${story?60:34}px;border-top:1px solid rgba(212,175,55,.3);border-bottom:1px solid rgba(212,175,55,.3);padding:${story?14:8}px 0}
 .r{display:flex;align-items:center;gap:${story?26:20}px;border-bottom:1px dashed rgba(255,255,255,.07)}
 .r:last-child{border-bottom:0}
 .d{width:${story?78:62}px;text-align:right;font:600 ${story?48:38}px Fr;color:#F4E6B8}
 .ic{flex:none;width:${story?60:48}px;height:${story?60:48}px;border:2px solid;border-radius:50%;display:grid;place-items:center;font:${story?28:23}px Em,Ws;background:rgba(255,255,255,.04)}
 .t{font-weight:500;line-height:1.15;color:#EEE7D6}
 .lg{margin-top:${story?30:18}px;display:flex;flex-wrap:wrap;justify-content:center;gap:10px 22px;font:500 ${story?24:19}px Ws;color:#B9B2C9}
 .lg i{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:8px;vertical-align:middle}
 .ft{margin-top:auto;padding-top:${story?36:22}px;text-align:center}
 .cta{font:italic 400 ${story?40:31}px Fr;color:#C9B8F0}
 .url{margin-top:${story?16:10}px;display:inline-block;font:600 ${story?34:27}px Ws;color:#05060F;background:linear-gradient(90deg,#E9CF7A,#D4AF37);padding:${story?'16px 36px':'12px 28px'};border-radius:999px}
 .tz{margin-top:${story?20:12}px;font:400 ${story?22:17}px Ws;color:#8F88A6}
 ${story?`.sv{margin-top:14px;font:500 26px Ws;color:#D4AF37}`:''}
 </style></head><body><div class="st">${stars(W,H,key.replace('-','')*7+W)}</div><div class="glow"></div>
 <div class="wrap"><div class="brand">Portal Místico</div><div class="k">${t.kicker}</div>
 <h1>${mon.charAt(0).toUpperCase()+mon.slice(1)}<small>${yr}</small></h1>
 <div class="list">${rows}</div><div class="lg">${legend}</div>
 <div class="ft"><div class="cta">${t.cta}</div><div class="url">${t.url}</div><div class="tz">${t.tz}</div>${story?`<div class="sv">${t.save}</div>`:''}</div></div></body></html>`;
}
(async()=>{const b=await chromium.launch();const only=process.argv[2];
 for(const lang of ['es','en']) for(const key of Object.keys(D[lang]).filter(k=>k!=='legend')){
  if(only&&key!==only)continue;
  for(const [W,H,tag] of [[1080,1350,'post'],[1080,1920,'story']]){
   const p=await b.newPage({viewport:{width:W,height:H}});
   await p.setContent(html(lang,key,W,H),{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
   const dir=`/tmp/calimg/out/${lang==='es'?'espanol':'english'}/${tag==='post'?(lang==='es'?'publicacion-1080x1350':'post-1080x1350'):(lang==='es'?'historia-tiktok-1080x1920':'story-tiktok-1080x1920')}`;
   fs.mkdirSync(dir,{recursive:true});
   const name=(lang==='es'?'calendario-esoterico-':'esoteric-calendar-')+key+'.png';
   await p.screenshot({path:path.join(dir,name)});await p.close();
 }}
 await b.close()})();
