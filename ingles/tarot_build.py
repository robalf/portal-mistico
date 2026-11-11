import jsstr,json,re,os,glob,shutil
from bs4 import BeautifulSoup, Comment, Doctype
import tarot_extract as X
G='../juegos/tarot-game/'; O='../en/tools/tarot-game/'
T={}
for f in sorted(glob.glob('tr/t3_game_*.json')): T.update(json.load(open(f,encoding='utf8')))
L=X.collect(); miss=[x for x in L if x not in T]; print('faltan',len(miss),miss[:3])
ph=lambda s:sorted(re.findall(r'\$\{[^}]*\}|%s|\\.',s))
bad=[x for x in L if x in T and ph(x)!=ph(T[x])]; print('placeholders distintos',len(bad))
for b in bad[:5]: print(repr(b[:100]),'=>',repr(T[b][:100]))
os.makedirs(O,exist_ok=True)
def esc(t,q):  # escapa comillas no escapadas del tipo q
    return re.sub(r'(?<!\\)'+re.escape(q),'\\'+q,t) if q!='`' else t
def tr_js(s):
    out=[];p=0
    for a,b,q,c in jsstr.strings(s):
        out.append(s[p:a])
        if X.cand(c) and c in T: out.append(q+esc(T[c],q)+q)
        else: out.append(s[a:b])
        p=b
    out.append(s[p:]); return ''.join(out)
R={'As':'Ace','Dos':'Two','Tres':'Three','Cuatro':'Four','Cinco':'Five','Seis':'Six','Siete':'Seven','Ocho':'Eight','Nueve':'Nine','Diez':'Ten','Sota':'Page','Caballero':'Knight','Reina':'Queen','Rey':'King'}
S={'Bastos':'Wands','Copas':'Cups','Espadas':'Swords','Oros':'Pentacles'}
for f in ['generated-cards.js','main.js','tarot-extra.js']:
    s=tr_js(open(G+f,encoding='utf8').read())
    if f=='tarot-extra.js':
        s=s.replace("(As|Dos|Tres|Cuatro|Cinco|Seis|Siete|Ocho|Nueve|Diez|Sota|Caballero|Reina|Rey) de (Bastos|Copas|Espadas|Oros)","(Ace|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Page|Knight|Queen|King) of (Wands|Cups|Swords|Pentacles)")
        # claves de RANGO/CIERRE (comillas) y PALO (sin comillas)
        for k,v in R.items():
            s=re.sub(r"(?m)^(\s*)'"+k+"'\s*:",lambda m:m.group(1)+"'"+v+"':",s)
            s=s.replace('"'+k+'":','"'+v+'":')
        for k,v in S.items(): s=re.sub(r'(?m)^(\s*)'+k+r'\s*:',lambda m:m.group(1)+v+':',s)
    s=s.replace("'The Wheel'","'Wheel of Fortune'")
    s=re.sub(r"(['\"(`])assets/",r"\1/juegos/tarot-game/assets/",s)
    open(O+f,'w',encoding='utf8').write(s)
# index.html
h=open(G+'index.html',encoding='utf8').read()
soup=BeautifulSoup(h,'lxml')
for t in list(soup.find_all(string=True)):
    if isinstance(t,(Comment,Doctype)) or t.parent.name in('script','style'): continue
    v=str(t).strip()
    if v in T: t.replace_with(str(t).replace(v,T[v]))
for e in soup.find_all(True):
    for a in('aria-label','title','alt','placeholder'):
        v=e.get(a)
        if v in T: e[a]=T[v]
soup.html['lang']='en'
out=str(soup)
out=re.sub(r"(url\(['\"]?)assets/",r"\1/juegos/tarot-game/assets/",out)
out=out.replace('./main.js?v=t5','./main.js?v=t5')
open(O+'index.html','w',encoding='utf8').write(out)
for f in ['rosebud-game-defaults.css','rosebud-game-defaults.js']: shutil.copy(G+f,O+f)
print('ok')
