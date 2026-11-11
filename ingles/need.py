"""Uso: python3 need.py <nombre> <pagina_es> [...]  -> escribe pendientes/<nombre>.json con los segmentos aún sin traducir"""
import sys,json,os
sys.path.insert(0,os.path.dirname(__file__))
import pipeline as P
name=sys.argv[1]; m=P.mem(); allm=[]
for f in sorted(os.listdir(os.path.join(os.path.dirname(__file__),'tr'))):
    if f.endswith('.json'): m.update(json.load(open(os.path.join(os.path.dirname(__file__),'tr',f),encoding='utf8')))
miss=[]
for p in sys.argv[2:]:
    for s in P.missing(p,m):
        if s not in miss: miss.append(s)
os.makedirs(os.path.join(os.path.dirname(__file__),'pendientes'),exist_ok=True)
json.dump(miss,open(os.path.join(os.path.dirname(__file__),'pendientes',name+'.json'),'w',encoding='utf8'),ensure_ascii=False,indent=0)
print(name,len(miss),'segmentos',sum(len(x) for x in miss),'caracteres')
