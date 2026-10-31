import astronomy as A, json, math
from datetime import date, timedelta
B=[('J',A.Body.Jupiter),('Sa',A.Body.Saturn),('U',A.Body.Uranus),('N',A.Body.Neptune),('P',A.Body.Pluto)]
RB=[('Me',A.Body.Mercury),('V',A.Body.Venus),('Ma',A.Body.Mars),('J',A.Body.Jupiter),('Sa',A.Body.Saturn)]
def lon(b,t): return A.Ecliptic(A.GeoVector(b,t,True)).elon
def T(d,h=12): return A.Time.Make(d.year,d.month,d.day,h,0,0)
def node(d):
    t=(T(d).ut)/36525.0   # siglos desde J2000
    return (125.04452-1934.136261*t)%360   # nodo medio ascendente
out={}
for Y in (2027,2028,2029,2030):
    d0=date(Y,1,1); d1=date(Y,12,31)
    days=[d0+timedelta(n) for n in range((d1-d0).days+1)]
    res={'lentos':{},'retro':[],'eclipses':[]}
    for k,b in B+[('Nn',None)]:
        seg=[]
        for d in days:
            l=node(d) if k=='Nn' else lon(b,T(d))
            s=int(l//30)
            if not seg or seg[-1][0]!=s: seg.append([s,d.isoformat()])
        res['lentos'][k]=seg
    # retrógrados: con margen de un día
    for k,b in RB:
        cur=None
        dd=[d0-timedelta(200)+timedelta(n) for n in range((d1-d0).days+402)]
        for i in range(1,len(dd)-1):
            m=((lon(b,T(dd[i+1]))-lon(b,T(dd[i-1]))+540)%360)-180
            r=m<0
            if r and cur is None: cur=[dd[i],int(lon(b,T(dd[i]))//30)]
            if not r and cur is not None:
                if dd[i]>=d0 and cur[0]<=d1: res['retro'].append([k,cur[0].isoformat(),dd[i].isoformat(),cur[1]])
                cur=None
    # eclipses
    se=A.SearchGlobalSolarEclipse(A.Time.Make(Y,1,1,0,0,0))
    while se.peak.Utc().year==Y:
        u=se.peak.Utc(); kd=str(se.kind)
        kind='total' if 'Total' in kd else 'anular' if 'Annular' in kd else 'parcial' if 'Partial' in kd else 'híbrido'
        res['eclipses'].append([u.strftime('%Y-%m-%d'),'solar',kind,int(lon(A.Body.Sun,se.peak)//30)])
        se=A.NextGlobalSolarEclipse(se.peak)
    le=A.SearchLunarEclipse(A.Time.Make(Y,1,1,0,0,0))
    while le.peak.Utc().year==Y:
        u=le.peak.Utc(); kd=str(le.kind)
        kind='total' if 'Total' in kd else 'parcial' if 'Partial' in kd else 'penumbral'
        res['eclipses'].append([u.strftime('%Y-%m-%d'),'lunar',kind,int(((lon(A.Body.Sun,le.peak)+180)%360)//30)])
        le=A.NextLunarEclipse(le.peak)
    res['eclipses'].sort()
    out[Y]=res
js='export const ANUAL='+json.dumps(out,separators=(',',':'),ensure_ascii=False)+';\n'
open('juegos/horoscopo-game/anual-data.js','w').write(js)
S=['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi']
for Y,r in out.items():
    print(Y,{k:[(S[s],d[5:]) for s,d in v] for k,v in r['lentos'].items()})
    print('  retro',[(k,a[5:],b[5:],S[s]) for k,a,b,s in r['retro']])
    print('  ecl',[(d[5:],t,kd,S[s]) for d,t,kd,s in r['eclipses']])
print(len(js)//1024,'KB')
