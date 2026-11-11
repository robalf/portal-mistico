import jsstr,json,re,os
from bs4 import BeautifulSoup
G='../juegos/tarot-game/'
FORCE={'Pasado','Presente','Futuro','carta','cartas'}
def cand(t): return jsstr.candidate(t) or t in FORCE
def collect():
    out=[]
    for f in ['generated-cards.js','main.js','tarot-extra.js']:
        s=open(G+f,encoding='utf8').read()
        for x in jsstr.strings(s):
            if cand(x[3]) and x[3] not in out: out.append(x[3])
    # index.html: nodos de texto y atributos + scripts en línea
    h=open(G+'index.html',encoding='utf8').read()
    soup=BeautifulSoup(h,'lxml')
    for t in soup.find_all(string=True):
        if t.parent.name in('script','style'): continue
        v=str(t).strip()
        if re.search('[A-Za-záéíóúñ¿¡]{2}',v) and v not in out: out.append(v)
    for e in soup.find_all(True):
        for a in('aria-label','title','alt','placeholder','content'):
            v=e.get(a)
            if v and re.search('[a-záéíóúñ]{3}',v) and ' ' in v and v not in out and e.name!='meta': out.append(v)
    return out
if __name__=='__main__':
    L=collect(); print(len(L),sum(map(len,L)))
    os.makedirs('pendientes',exist_ok=True)
    n=7;k=(len(L)+n-1)//n
    for i in range(n):
        json.dump(L[i*k:(i+1)*k],open(f'pendientes/t3_game_{i}.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
        print(i,len(L[i*k:(i+1)*k]))
