import astronomy as A, json
from datetime import date, timedelta
# Un dato por día a las 12:00 UTC. Longitudes eclípticas geocéntricas aparentes en décimas de grado.
BODIES=[('L',A.Body.Moon),('S',A.Body.Sun),('Me',A.Body.Mercury),('V',A.Body.Venus),('Ma',A.Body.Mars),('J',A.Body.Jupiter),('Sa',A.Body.Saturn)]
start=date(2026,9,29); end=date(2031,1,2)
def lon(b,t): return A.Ecliptic(A.GeoVector(b,t,True)).elon
rows=[]; d=start
while d<end:
    t=A.Time.Make(d.year,d.month,d.day,12,0,0)
    r=[round(lon(b,t)*10)%3600 for _,b in BODIES]
    rows.append(r); d+=timedelta(days=1)
# retrógrado: movimiento negativo entre día anterior y siguiente (para Me..Sa)
out={'inicio':start.isoformat(),'dias':rows}
# fases principales: lunas nuevas/llenas y cuartos con hora UTC exacta
q=A.SearchMoonQuarter(A.Time.Make(2026,9,25,0,0,0)); ev=[]
while q.time.Utc().date()<end:
    u=q.time.Utc(); ev.append([u.strftime('%Y-%m-%dT%H:%M'),q.quarter])  # 0 nueva,1 cuarto creciente,2 llena,3 cuarto menguante
    q=A.NextMoonQuarter(q)
out['fases']=ev
js='export const CIELO='+json.dumps(out,separators=(',',':'))+';\n'
open('juegos/horoscopo-game/cielo-data.js','w').write(js)
print(len(rows),'días',len(ev),'fases',len(js)//1024,'KB',ev[:6])
