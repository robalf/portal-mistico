"""Valida y junta tr/*.json en memoria.json (comprueba que las etiquetas y enlaces coinciden)."""
import sys,json,os,glob
sys.path.insert(0,os.path.dirname(__file__))
import pipeline as P
m=P.mem(); bad=[]; n=0
for f in sorted(glob.glob(os.path.join(os.path.dirname(__file__),'tr','*.json'))):
    d=json.load(open(f,encoding='utf8'))
    for k,v in d.items():
        k=P.norm(k)
        if not isinstance(v,str) or not v.strip(): bad.append((f,k[:60],'vacío')); continue
        if not P.check_pair(k,v): bad.append((os.path.basename(f),k[:70],'etiquetas distintas')); continue
        m[k]=P.norm(v); n+=1
P.save_mem(m); print('en memoria',len(m),'añadidos/actualizados',n,'rechazados',len(bad))
for b in bad[:30]: print(b)
