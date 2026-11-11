"""Traducción genérica de literales de cadena de archivos JS. 
 collect(files)->lista de literales en español; build(files, outdir, T, post=None) escribe copias en inglés.
 Memoria: tr/js_*.json (mapa literal->inglés)."""
import jsstr,json,re,os,glob
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
HERE=os.path.dirname(__file__)
FORCE=set(json.load(open(os.path.join(os.path.dirname(__file__),'tr','js_words.json'),encoding='utf8')))
def cand(t): return jsstr.candidate(t) or t in FORCE
RANGES={}   # archivo -> [(linea_ini,linea_fin)] : solo se traducen literales en esas líneas
def inrange(f,s,a):
    r=RANGES.get(f)
    if not r: return True
    ln=s.count('\n',0,a)+1
    return any(x<=ln<=y for x,y in r)
def collect(files):
    out=[]
    for f in files:
        s=open(os.path.join(ROOT,f),encoding='utf8').read()
        for x in jsstr.strings(s):
            if cand(x[3]) and x[3] not in out and inrange(f,s,x[0]): out.append(x[3])
    return out
def loadT():
    T={}
    for f in sorted(glob.glob(os.path.join(HERE,'tr','js_*.json'))+glob.glob(os.path.join(HERE,'tr','t3_game_*.json'))): T.update(json.load(open(f,encoding='utf8')))
    return T
def esc(t,q): return re.sub(r'(?<!\\)'+re.escape(q),'\\'+q,t) if q!='`' else t
def translate(s,T,f=None):
    out=[];p=0
    for a,b,q,c in jsstr.strings(s):
        out.append(s[p:a])
        out.append(q+esc(T[c],q)+q if (cand(c) and c in T and (f is None or inrange(f,s,a))) else s[a:b]); p=b
    out.append(s[p:]); return ''.join(out)
def build(files,outdir,T=None,post=None):
    T=T or loadT()
    for f,dst in files:
        s=open(os.path.join(ROOT,f),encoding='utf8').read()
        miss=[c for a,b,q,c in jsstr.strings(s) if cand(c) and c not in T and inrange(f,s,a)]
        if miss: print('FALTAN',f,len(miss),miss[:2])
        s=translate(s,T,f)
        if post: s=post(f,s)
        p=os.path.join(ROOT,outdir,dst); os.makedirs(os.path.dirname(p),exist_ok=True); open(p,'w',encoding='utf8').write(s)
def inline_literals(pages):
    out=[]
    for pg in pages:
        h=open(os.path.join(ROOT,pg),encoding='utf8').read()
        for sc in re.findall(r'<script(?![^>]*(?:ld\+json|src=))[^>]*>(.*?)</script>',h,flags=re.S):
            for a,b,q,c in jsstr.strings(sc):
                if cand(c) and c not in out: out.append(c)
    return out

def rename_idents(s,mapping):
    """Renombra identificadores (claves de objeto sin comillas) fuera de las cadenas."""
    st=jsstr.strings(s); out=[];p=0
    pat=re.compile(r'(?<![\w$])(%s)(?![\w$])'%'|'.join(map(re.escape,mapping)))
    for a,b,q,c in st:
        out.append(pat.sub(lambda m:mapping[m.group(1)],s[p:a])); out.append(s[a:b]); p=b
    out.append(pat.sub(lambda m:mapping[m.group(1)],s[p:])); return ''.join(out)
