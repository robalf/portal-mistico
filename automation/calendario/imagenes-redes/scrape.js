const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
// zona horaria fija: Nueva York (público principal en EE. UU.)
const out={};
for(const [lang,url] of [['es','juegos/calendario-esoterico.html'],['en','en/tools/esoteric-calendar.html']]){
 out[lang]={};
 for(let y=2026,m=12;y<2028;){
  const key=y+'-'+String(m).padStart(2,'0');
  await p.goto(`http://localhost:8765/${url}#${key}`);await p.waitForSelector('#cal-list .cal-ev,#cal-list .cal-none');await p.waitForTimeout(200);
  out[lang][key]={title:await p.textContent('#cal-title'),ev:await p.$$eval('#cal-list .cal-ev',a=>a.map(e=>({cat:[...e.classList].find(c=>c.startsWith('c-')).slice(2),icon:e.querySelector('.cal-ev-ic').textContent,title:e.querySelector('strong').textContent,when:(e.querySelector('small')||{}).textContent||''})))};
  m++;if(m>12){m=1;y++;}
 }
 out[lang].legend=await p.$$eval('#cal-filters .cal-f',a=>a.map(x=>({cat:[...x.classList].find(c=>c.startsWith('c-')).slice(2),label:x.textContent,color:getComputedStyle(x).borderColor})));
}
fs.writeFileSync('/tmp/calimg/data.json',JSON.stringify(out,null,1));
console.log(Object.keys(out.es).length, out.es['2026-12'].ev.length, JSON.stringify(out.es['2026-12'].ev.slice(0,14)), JSON.stringify(out.es.legend));
await b.close()})();
