import re, json, os, sys, posixpath, copy
from bs4 import BeautifulSoup, NavigableString, Comment
sys.path.insert(0, os.path.dirname(__file__))
from mapa import M
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SITE = 'https://elportalmistico.com'
MEM_PATH = os.path.join(os.path.dirname(__file__), 'memoria.json')
BLOCK = {'div','section','article','main','aside','header','footer','nav','ul','ol','li','table','thead','tbody','tr','td','th','p','h1','h2','h3','h4','h5','h6',
         'details','summary','figure','figcaption','form','select','option','blockquote','dl','dt','dd','body','html','head','fieldset','legend','caption','textarea','iframe','canvas','noscript'}
SKIP = {'script','style','svg','noscript','code','pre','template'}
ATTRS = ('alt','title','aria-label','placeholder')
META = {'description','keywords','twitter:title','twitter:description','og:title','og:description','og:image:alt','twitter:image:alt'}
JSON_KEYS = {'name','headline','description','text','alternateName','caption','articleSection','about','keywords'}
def norm(s): return re.sub(r'\s+',' ',s).strip()
def mem():
    return json.load(open(MEM_PATH,encoding='utf8')) if os.path.exists(MEM_PATH) else {}
def save_mem(m): json.dump(m,open(MEM_PATH,'w',encoding='utf8'),ensure_ascii=False,indent=0,sort_keys=True)
def has_block_child(e): return any(getattr(c,'name',None) in BLOCK for c in e.descendants if getattr(c,'name',None))
def has_text(e): return any(isinstance(c,NavigableString) and not isinstance(c,Comment) and c.strip() and not (c.parent.name in SKIP) for c in e.descendants)
def in_skip(e):
    return any(getattr(p,'name',None) in SKIP for p in [e]+list(e.parents))
def walk(soup):
    """Devuelve lista de (tipo, nodo/clave, texto) en orden."""
    out=[]
    if soup.title and soup.title.string: out.append(('title',soup.title,soup.title.string))
    for m in soup.find_all('meta'):
        k=m.get('name') or m.get('property')
        if k in META and m.get('content'): out.append(('meta',m,m['content']))
    for e in soup.find_all(True):
        if in_skip(e): continue
        for a in ATTRS:
            if e.get(a) and re.search(r'[A-Za-zÁÉÍÓÚáéíóúñ]{2}',e[a]) and not e[a].startswith(('http','/')): out.append(('attr:'+a,e,e[a]))
    seen=set()
    def visit(e):
        if in_skip(e) or e.name in ('head','title'): return
        if e.name not in BLOCK and e.parent is not None and e.parent.name in BLOCK and False: return
        if not has_block_child(e) and has_text(e) and e.name not in ('html','body'):
            kids=[c for c in e.children if getattr(c,'name',None) and has_text(c)]
            direct=any(isinstance(c,NavigableString) and not isinstance(c,Comment) and c.strip() for c in e.children)
            if not direct and len(kids)>=2:
                for c in kids: out.append(('html',c,c.decode_contents()))
                return
            out.append(('html',e,e.decode_contents())); return
        for c in list(e.children):
            if isinstance(c,NavigableString) and not isinstance(c,Comment):
                if c.strip() and e.name not in SKIP and e.name not in ('head',):
                    out.append(('text',c,str(c)))
            elif getattr(c,'name',None): visit(c)
    visit(soup.body)
    for s in soup.find_all('script',type='application/ld+json'):
        try: data=json.loads(s.string)
        except Exception: continue
        def jw(o):
            if isinstance(o,dict):
                for k,v in o.items():
                    if isinstance(v,str) and k in JSON_KEYS: out.append(('json',(o,k),v))
                    else: jw(v)
            elif isinstance(o,list):
                for v in o: jw(v)
        jw(data); s._data=data
    return out
def clean(soup):
    for a in soup.find_all('a',class_='pm-lang'): a.decompose()
    for a in soup.find_all('a',class_='pm-lt'): a.decompose()
    for l in soup.find_all('link',href=re.compile(r'lang-toggle')): l.decompose()
    for sc in soup.find_all('script',src=re.compile(r'lang-toggle')): sc.decompose()
    for l in soup.find_all('link',rel='alternate'):
        if l.get('hreflang'): l.decompose()
    return soup
def segments(es_path):
    soup=clean(BeautifulSoup(open(os.path.join(ROOT,es_path),encoding='utf8').read(),'lxml'))
    segs=[]
    for t,n,s in walk(soup):
        k=norm(s)
        if k and re.search(r'[A-Za-zÁÉÍÓÚáéíóúñ]{2}',re.sub(r'<[^>]+>','',k)): segs.append(k)
    return segs
def missing(es_path,m=None):
    m=m if m is not None else mem()
    return [s for s in dict.fromkeys(segments(es_path)) if s not in m]
def skeleton(s):
    return [re.sub(r'\s+',' ',t) for t in re.findall(r'<[^>]+>',s) if not t.startswith('<!--')]
def skel_key(s):
    out=[]
    for t in re.findall(r'<[^>]+>',s):
        name=re.match(r'</?\s*([a-zA-Z0-9]+)',t); h=re.search(r'href="([^"]*)"',t)
        out.append((name.group(1).lower() if name else t, h.group(1) if h else None))
    return out
def check_pair(es,en):
    return skel_key(es)==skel_key(en)
def en_url(path): return '%s/en/%s'%(SITE,path if not path.endswith('index.html') else path[:-len('index.html')])
def es_url(path): return SITE+'/'+(path if not path.endswith('index.html') else path[:-len('index.html')])
def built(es):  # ¿existe ya la página en inglés?
    return es in M and os.path.exists(os.path.join(ROOT,'en',M[es]))
def resolve(href, es_path, to_en=True):
    """Reescribe un enlace interno de una página española."""
    if not href or href.startswith(('http://','https://','mailto:','tel:','#','javascript:','data:','//')):
        if href.startswith(SITE+'/') or href==SITE:
            p=href[len(SITE):].lstrip('/'); frag=''
            if '#' in p: p,frag=p.split('#',1); frag='#'+frag
            p=p or 'index.html'
            if p.endswith('/'): p+='index.html'
            if p in M and built(p): return '/en/'+M[p]+frag
        return href
    frag=''; q=''
    base=href
    if '#' in base: base,frag=base.split('#',1); frag='#'+frag
    if '?' in base: base,q=base.split('?',1); q='?'+q
    if base=='' : return href
    tgt=posixpath.normpath(posixpath.join(posixpath.dirname(es_path),base)) if not base.startswith('/') else base.lstrip('/')
    if tgt.endswith('/') or tgt=='.' : tgt=(tgt if tgt!='.' else '')+'index.html'
    if os.path.isdir(os.path.join(ROOT,tgt)): tgt=posixpath.join(tgt,'index.html')
    if tgt in M and tgt.endswith('.html'):
        if built(tgt): return '/en/'+M[tgt]+q+frag
        return '/'+tgt+q+frag     # aún sin versión en inglés: apunta a la española
    return '/'+tgt+q+frag
_JSTC=[None]
def _JST():
    if _JSTC[0] is None:
        import jsx; _JSTC[0]=jsx.loadT()
    return _JSTC[0]
def build(es_path, m=None, lang_switch=True):
    m=m if m is not None else mem()
    html=open(os.path.join(ROOT,es_path),encoding='utf8').read()
    soup=clean(BeautifulSoup(html,'lxml'))
    miss=[]
    items=walk(soup)
    for t,n,s in items:
        k=norm(s)
        if not k or not re.search(r'[A-Za-zÁÉÍÓÚáéíóúñ]{2}',re.sub(r'<[^>]+>','',k)): continue
        if k not in m: miss.append(k); continue
        en=m[k]
        if t=='title': n.string=en
        elif t=='meta': n['content']=en
        elif t.startswith('attr:'): n[t[5:]]=en
        elif t=='html':
            n.clear(); frag=BeautifulSoup('<x>'+en+'</x>','lxml').find('x'); 
            for c in list(frag.contents): n.append(c)
        elif t=='text': n.replace_with(en)
        elif t=='json': o,key=n; o[key]=en
    if miss: return None, list(dict.fromkeys(miss))
    # JSON-LD
    for s in soup.find_all('script',type='application/ld+json'):
        try: data=json.loads(s.string)
        except Exception: continue
        d=getattr(s,'_data',data)
        txt=json.dumps(d,ensure_ascii=False)
        txt=re.sub(r'"inLanguage": "es"','"inLanguage": "en"',txt)
        def fix(mo):
            u=mo.group(0)[len(SITE):].lstrip('/') ; frag=''
            if '#' in u: u,frag=u.split('#',1); frag='#'+frag
            u=u or 'index.html'
            if u in M: return en_url(M[u]) if False else (SITE+'/en/'+(M[u] if not M[u].endswith('index.html') else M[u][:-10])+frag)
            return mo.group(0)
        txt=re.sub(re.escape(SITE)+r'/[^"\s]*',fix,txt)
        s.string=txt
    # enlaces y recursos
    for e in soup.find_all(True):
        for a in ('href','src','action','data-url','poster','data-src','data-bg','data-poster'):
            if e.get(a):
                if e.name=='link' and e.get('rel') and ('canonical' in e['rel'] or 'alternate' in e['rel']): continue
                if (e.name=='iframe' and e[a].startswith('tarot-game/')) or (e.name=='script' and e[a].startswith(('novedades-game/main-inline.js','brujula-game/main-inline.js','aura-game/','quiromancia-game/'))): continue
                e[a]=resolve(e[a],es_path)

    # scripts propios de cada página
    import tools_en
    for sc in soup.find_all('script'):
        t=sc.string or ''
        if sc.get('src') and 'carta-astral.bundle.js' in sc['src']: sc['src']='/assets/js/carta-astral-en.bundle.js?v=1'
        if sc.get('src') and 'oraculo.bundle.js' in sc['src']: sc['src']='/assets/js/oraculo-en.bundle.js?v=1'
        if sc.get('src') and 'musica-global.js' in sc['src']: sc['src']='/assets/js/musica-global-en.js?v=1'
        if 'var T=[[' in t:
            mo=re.search(r'var T=(\[\[.*?\]\]);',t,re.S)
            arr=json.loads(mo.group(1)); new=[]
            for slug,name,kw,emo in arr:
                es='juegos/%s.html'%slug
                if es in M and built(es) and slug in tools_en.T:
                    n,k=tools_en.T[slug]; new.append(['/en/'+M[es],n,k,emo])
            t=t.replace(mo.group(0),'var T='+json.dumps(new,ensure_ascii=False)+';')
            t=t.replace("""'<li><a href="juegos/'+t[0]+'.html">""","""'<li><a href="'+t[0]+'">""")
            t=t.replace("No encontramos esa herramienta. Prueba con otra palabra.","We could not find that tool. Try another word.")
            sc.string=t
        for a,b in tools_en.SCRIPT_MAP.items():
            if a in t: t=t.replace(a,b); sc.string=t
        if not sc.get('src') and 'ld+json' not in str(sc.get('type') or '') and t:
            import jsx
            t2=jsx.translate(t,_JST())
            if t2!=t: t=t2; sc.string=t
        if 'Nuevo comentario' in t:
            t=t.replace("Nuevo comentario en Portal Místico","New comment (English site) on Portal Místico").replace("¡Gracias por tu comentario!","Thanks for your comment!").replace("No se pudo enviar. Inténtalo de nuevo en un momento.","Could not send it. Please try again in a moment.")
            sc.string=t
    html_tag=soup.find('html'); html_tag['lang']='en'
    for mt in soup.find_all('meta'):
        if mt.get('property')=='og:locale': mt['content']='en_US'
        if mt.get('property')=='og:url': mt['content']=en_url(M[es_path])
    can=soup.find('link',rel='canonical')
    if can: can['href']=en_url(M[es_path])
    for l in soup.find_all('link',rel='alternate'):
        if l.get('hreflang'): l.decompose()
    head=soup.head
    for lang,u in (('en',en_url(M[es_path])),('es',es_url(es_path)),('x-default',es_url(es_path))):
        l=soup.new_tag('link',rel='alternate',hreflang=lang,href=u); head.append(l)
    if lang_switch:
        href='/'+es_path if not es_path.endswith('index.html') else '/'+es_path[:-10]
        brand=soup.select_one('.pm-nav-in .pm-brand')
        bb=soup.find('a',class_='back-btn')
        if brand:
            brand.insert_after(BeautifulSoup(lang_toggle('en',href),'html.parser'))
        elif bb:
            bb.insert_after(BeautifulSoup(lang_toggle('en',href,True),'html.parser'))
        if brand or bb:
            soup.head.append(BeautifulSoup(TOGGLE_HEAD,'html.parser'))
    h1=soup.find('h1')
    if h1:
        for e in soup.select('[data-title]'): e['data-title']=h1.get_text(' ',strip=True)
    out=str(soup)
    out=re.sub(r'^<!DOCTYPE[^>]*>','<!DOCTYPE html>',out) if out.startswith('<!DOCTYPE') else '<!DOCTYPE html>\n'+out
    return out, []

def lang_toggle(cur,href,fixed=False):
    tgt='en' if cur=='es' else 'es'
    lab='Switch to English' if cur=='es' else 'Cambiar a español'
    return '<a class="pm-lt pm-lt-%s%s" href="%s" hreflang="%s" lang="%s" aria-label="%s" title="%s" onclick="event.stopPropagation()"><span>ES</span><span>EN</span><i aria-hidden="true"></i></a>'%(cur,' pm-lt-fixed' if fixed else '',href,tgt,tgt,lab,lab)
TOGGLE_HEAD='<link rel="stylesheet" href="/assets/css/lang-toggle.css?v=5"><script src="/assets/js/lang-toggle.js?v=1" defer></script>'
def write_en(es_path,out):
    out=re.sub(r'(href="|src=")((?:aura|quiromancia)-game/(?:scoped\.css))',r'\1/juegos/\2',out)
    p=os.path.join(ROOT,'en',M[es_path]); os.makedirs(os.path.dirname(p),exist_ok=True); open(p,'w',encoding='utf8').write(out); return p
