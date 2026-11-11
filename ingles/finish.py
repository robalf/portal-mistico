"""Tras traducir: reconstruye todas las páginas EN existentes, añade hreflang+selector a las páginas ES emparejadas y las URLs EN al sitemap."""
import sys,os,re
sys.path.insert(0,os.path.dirname(__file__))
import pipeline as P
from pipeline import M,ROOT
m=P.mem()
done=[es for es in M if os.path.exists(os.path.join(ROOT,'en',M[es]))]
for es in done:
    out,miss=P.build(es,m)
    if out is None: print('FALTAN',es,len(miss)); continue
    P.write_en(es,out)
def es_link(es):
    p=os.path.join(ROOT,es); h=open(p,encoding='utf8').read()
    en=P.en_url(M[es]); eu=P.es_url(es)
    h=re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\s*','',h)
    tags='<link rel="alternate" hreflang="es" href="%s">\n<link rel="alternate" hreflang="en" href="%s">\n<link rel="alternate" hreflang="x-default" href="%s">\n'%(eu,en,eu)
    h=h.replace('</head>',tags+'</head>',1)
    h=re.sub(r'<a class="pm-lang"[^>]*>[^<]*</a>','',h)
    sw='<a class="pm-lang" href="/en/%s" hreflang="en" onclick="event.stopPropagation()">🌐 English</a>'%(M[es] if not M[es].endswith('index.html') else M[es][:-10])
    h2=re.sub(r'(</a>)(</div>\s*</div></nav>)',lambda mo:mo.group(1)+sw+mo.group(2),h,count=1)
    if h2==h and 'pm-links' in h: print('sin selector (patrón no hallado):',es)
    open(p,'w',encoding='utf8').write(h2)
for es in done: es_link(es)
sm=open(os.path.join(ROOT,'sitemap.xml'),encoding='utf8').read()
add=''
for es in done:
    u=P.en_url(M[es])
    if '<loc>%s</loc>'%u not in sm: add+='<url><loc>%s</loc><lastmod>2026-11-11</lastmod></url>\n'%u
if add: sm=sm.replace('</urlset>',add+'</urlset>'); open(os.path.join(ROOT,'sitemap.xml'),'w',encoding='utf8').write(sm)
print('páginas en inglés:',len(done),'| nuevas en sitemap:',add.count('<url>'))
