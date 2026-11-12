import * as A from 'astronomy-engine';
import fs from 'fs';
const START=new Date(Date.UTC(2026,10,1)), END=new Date(Date.UTC(2028,0,1));
const SIGNS=['aries','tauro','geminis','cancer','leo','virgo','libra','escorpio','sagitario','capricornio','acuario','piscis'];
const ev=[]; const iso=d=>d.toISOString().slice(0,16)+'Z';
const add=(d,type,o={})=>{ if(d>=START&&d<END) ev.push({t:iso(d),type,...o}); };
const sign=l=>SIGNS[Math.floor((((l%360)+360)%360)/30)];
const moonSign=d=>sign(A.EclipticGeoMoon(d).lon);
// moon phases
let q=A.SearchMoonQuarter(START);
while(q.time.date<END){ const d=q.time.date;
  if(q.quarter===0) add(d,'luna_nueva',{sign:moonSign(d)});
  else if(q.quarter===2){ const dist=A.EclipticGeoMoon(d).dist*149597870.7; add(d,'luna_llena',{sign:moonSign(d),super:dist<361000,km:Math.round(dist)}); }
  else add(d,q.quarter===1?'cuarto_creciente':'cuarto_menguante',{sign:moonSign(d)});
  q=A.NextMoonQuarter(q);}
// eclipses
let le=A.SearchLunarEclipse(START); while(le.peak.date<END){ add(le.peak.date,'eclipse_lunar',{kind:le.kind.toLowerCase(),sign:moonSign(le.peak.date)}); le=A.NextLunarEclipse(le.peak);}
let se=A.SearchGlobalSolarEclipse(START); while(se.peak.date<END){ add(se.peak.date,'eclipse_solar',{kind:se.kind.toLowerCase(),sign:sign(A.SunPosition(se.peak.date).elon)}); se=A.NextGlobalSolarEclipse(se.peak);}
// seasons
for(const y of [2026,2027]){const s=A.Seasons(y);
 add(s.mar_equinox.date,'estacion',{kind:'mar'});add(s.jun_solstice.date,'estacion',{kind:'jun'});add(s.sep_equinox.date,'estacion',{kind:'sep'});add(s.dec_solstice.date,'estacion',{kind:'dec'});}
// sun ingress
for(let k=0;k<12;k++){ let t=new Date(START); while(true){ const r=A.SearchSunLongitude(k*30,t,400); if(!r)break; if(r.date>=END)break; add(r.date,'ingreso',{body:'sol',sign:SIGNS[k]}); t=new Date(r.date.getTime()+86400000*30);} }
// ingresses + stations for planets
const bodies=['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
const elon=(b,d)=>A.Ecliptic(A.GeoVector(b,d,true)).elon;
const speed=(b,d)=>{let a=elon(b,new Date(d-3600e3)),c=elon(b,new Date(+d+3600e3));let x=c-a;if(x>180)x-=360;if(x<-180)x+=360;return x;};
for(const b of bodies){
  const step=86400000; let prev=START-5*step, ps=speed(b,new Date(prev)), pl=sign(elon(b,new Date(prev)));
  for(let t=prev+step;t<=+END;t+=step){ const d=new Date(t), s=speed(b,d), sg=sign(elon(b,d));
    if(ps>0&&s<=0||ps<0&&s>=0){ let lo=t-step,hi=t; for(let i=0;i<40;i++){const m=(lo+hi)/2; (speed(b,new Date(m))>0)===(ps>0)?lo=m:hi=m;}
      const dd=new Date(hi); add(dd,ps>0?'retro_inicio':'retro_fin',{body:b.toLowerCase(),sign:sign(elon(b,dd))}); }
    if(sg!==pl && ['Jupiter','Saturn','Uranus','Neptune','Pluto'].includes(b)){ let lo=t-step,hi=t; for(let i=0;i<40;i++){const m=(lo+hi)/2; sign(elon(b,new Date(m)))===pl?lo=m:hi=m;} add(new Date(hi),'ingreso',{body:b.toLowerCase(),sign:sg}); }
    ps=s; pl=sg; }
}
// lluvias de estrellas (picos: IMO 2027 para 2027; 2026 aproximados)
const SH=[
['2026-11-05T12:00Z','taurids_s',5,1,'Táuridas del Sur'],['2026-11-12T12:00Z','taurids_n',5,1],
['2026-11-18T06:00Z','leonids',15,1],['2026-12-14T12:00Z','geminids',150,1],['2026-12-22T12:00Z','ursids',10,1],
['2027-01-04T03:25Z','quadrantids',80,0],['2027-04-23T01:40Z','lyrids',18,0],['2027-05-06T09:00Z','eta_aquariids',50,0],
['2027-08-13T09:00Z','perseids',110,0],['2027-09-01T15:30Z','aurigids',6,0],['2027-10-09T07:00Z','draconids',5,0],['2027-10-22T12:00Z','orionids',20,0],
['2027-11-06T12:00Z','taurids_s',7,0],['2027-11-13T12:00Z','taurids_n',5,0],['2027-11-18T06:00Z','leonids',15,0],['2027-12-14T20:00Z','geminids',150,0],['2027-12-23T04:00Z','ursids',10,0]];
for(const [t,id,zhr,approx] of SH){const d=new Date(t);const ill=A.Illumination('Moon',d).phase_fraction;add(d,'lluvia',{id,zhr,moon:Math.round(ill*100),approx:!!approx});}
// portales numéricos y tradiciones (fecha local, todo el día)
const day=(d,type,o)=>ev.push({d,type,...o});
for(const [y,m] of [[2026,12],...Array.from({length:12},(_,i)=>[2027,i+1])]) day(`${y}-${String(m).padStart(2,'0')}-${String(m).padStart(2,'0')}`,'portal',{n:m});
day('2026-11-22','portal',{n:22,master:1});
day('2027-01-01','tradicion',{id:'ano_nuevo'});
for(const [d,id] of [['2027-02-02','imbolc'],['2027-05-01','beltane'],['2027-06-23','sanjuan'],['2027-08-01','lughnasadh'],['2027-10-31','samhain'],['2027-11-02','muertos'],['2026-12-31','nochevieja'],['2027-12-31','nochevieja']]) day(d,'tradicion',{id});
ev.sort((a,b)=>((a.t||a.d)<(b.t||b.d)?-1:1));
fs.writeFileSync(process.argv[2]||'events.json',JSON.stringify({generated:'astronomy-engine',range:['2026-11-01','2027-12-31'],events:ev}));
console.log(ev.length); const c={}; ev.forEach(e=>c[e.type]=(c[e.type]||0)+1); console.log(c);
for(const e of ev.filter(e=>/eclipse|retro|super/.test(e.type)||e.super)) console.log(e.t,e.type,e.body||'',e.kind||'',e.sign||'',e.super?'SUPER':'');
