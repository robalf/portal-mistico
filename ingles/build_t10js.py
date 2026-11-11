import jsx,json,re
W=json.load(open('tr/js_words.json',encoding='utf8'))
TITLES=json.load(open('tr/t10titles.json',encoding='utf8'))
IDS={k:W[k] for k in ['Tauro','Géminis','Cáncer','Escorpio','Sagitario','Capricornio','Acuario','Piscis','Fuego','Tierra','Aire','Agua','Madera','Rata','Buey','Tigre','Conejo','Dragón','Serpiente','Caballo','Cabra','Mono','Gallo','Perro','Cerdo']}

DREAM_AUG = r"""
// --- English keywords for the dream interpreter (added for the English site) ---
(function(){
  const extra=[
    ['animal','insect','bees','ants','bug','spiders','flies'],
    ['fear','afraid','scared','anxiety','anxious','crying','cried','sad','danger','nightmare'],
    ['love','kiss','family','friend','hug'],
    ['paralyzed','paralysed','frozen'],
    ['giant','tiny','huge'],
    ['loop','groundhog'],
    ['drowning','drowned','drown'],
    ['ghost house','haunted']
  ];
  const idx=[0,1,2,7,9,10,12,14];
  extra.forEach((words,n)=>{const t=dreamThemes[idx[n]];if(t)words.forEach(w=>{if(!t.keys.includes(w))t.keys.push(w)})});
  const add=(obj,pairs)=>pairs.forEach(([en,es])=>{if(obj[es]!==undefined&&obj[en]===undefined)obj[en]=obj[es]});
  add(dreamColorMeanings,[['white','blanco'],['black','negro'],['red','rojo'],['golden','dorado'],['gold','dorado'],['blue','azul'],['green','verde'],['gray','gris'],['grey','gris'],['silver','plateado'],['purple','morado'],['violet','morado']]);
  add(dreamQualityMeanings,[['beautiful','hermoso'],['lovely','hermoso'],['pretty','bello'],['ugly','feo'],['terrifying','aterrador'],['scary','aterrador'],['horrible','horrible'],['giant','gigante'],['huge','enorme'],['enormous','enorme'],['small','pequeño'],['tiny','diminuto']]);
  add(dreamAgencyMeanings,[['riding','montaba'],['rode','montaba'],['driving','conducia'],['drove','conducia'],['chasing','perseguia'],['chased','perseguia'],['attacking','atacaba'],['attacked','atacaba'],['petting','acariciaba'],['stroking','acariciaba'],['hugging','abrazaba'],['hugged','abrazaba'],['holding','sostenia'],['held','sostenia']]);
  // alias: English title of each symbol becomes a search key (e.g. "spider")
  Object.keys(dreams).slice().forEach(k=>{
    const e=dreams[k]; if(!e||!e[0])return;
    let t=String(e[0]).toLowerCase().replace(/^(the|a|an)\s+/,'').replace(/\s*\(.*?\)\s*/g,' ').trim();
    t.split(/\s*[\/,]\s*|\s+or\s+/).forEach(a=>{a=a.trim();if(a.length>=3&&dreams[a]===undefined){dreams[a]=e;if(a.length<=4)dreamsExtraExact.add(a)}});
  });
})();
"""
jsx.FORCE=set(W); jsx.RANGES={}
def post(f,s):
    s=s.replace('es-ES','en-US')
    if f.endswith('novedades-game/main-inline.js'):
        s=jsx.rename_idents(s,IDS); s=s.replace('alt="Oráculo de cristal"','alt="Crystal oracle"'); s=s.replace('["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]','["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]')
        s=re.sub(r"(?<![/\w])novedades-game/(assets|rueda-mistica)",r"/juegos/novedades-game/\1",s)
    if f.endswith('novedades-game/main-inline.js'):
        s=s.replace('function interpretDream(raw){',DREAM_AUG+'function interpretDream(raw){',1)
    if f.endswith('novedades-game/main-inline.js'):
        s=re.sub(r"(?m)^(  [\wñ]+:\[')([^']*)(',)",lambda m:m.group(1)+TITLES.get(m.group(2),m.group(2))+m.group(3),s)
        s=s.replace('Necesitas ·','You need ·').replace("k[0].toUpperCase()+k.slice(1)","({abundancia:'Abundance',amor:'Love',claridad:'Clarity',descanso:'Rest',soltar:'Letting go',sanar:'Healing'}[k]||k[0].toUpperCase()+k.slice(1))")
        s=s.replace("['agua','serpiente','volar','casa','caer','perseguir','examen','dientes']","['water','snake','flying','house','falling','being chased','exam','teeth']").replace("title:'Ahogarse'","title:'Drowning'")
    return s
jsx.build([('juegos/novedades-game/main-inline.js','main-inline.js')],'en/tools/novedades-game',post=post)
jsx.build([('assets/js/oraculo.bundle.js','oraculo-en.bundle.js')],'assets/js',post=post)
