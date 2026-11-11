import jsx,json,re
W=json.load(open('tr/js_words.json',encoding='utf8'))
IDS={k:W[k] for k in ['Tauro','Géminis','Cáncer','Escorpio','Sagitario','Capricornio','Acuario','Piscis','Fuego','Tierra','Aire','Agua','Madera','Rata','Buey','Tigre','Conejo','Dragón','Serpiente','Caballo','Cabra','Mono','Gallo','Perro','Cerdo']}
jsx.RANGES={'juegos/novedades-game/main-inline.js':[(1,46),(1006,1045)]}
def post(f,s):
    if f.endswith('novedades-game/main-inline.js'):
        s=jsx.rename_idents(s,IDS); s=s.replace('alt="Oráculo de cristal"','alt="Crystal oracle"'); s=s.replace('["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]','["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]')
        s=re.sub(r"(?<![/\w])novedades-game/(assets|rueda-mistica)",r"/juegos/novedades-game/\1",s)
    return s
files=[(f,f[len('juegos/'):]) for f in ['juegos/horoscopo-native.js','juegos/horoscopo-game/cielo.js','juegos/horoscopo-game/anual.js','juegos/horoscopo-game/cielo-textos.js','juegos/horoscopo-game/cielo-planetas.js','juegos/horoscopo-game/anual-textos.js','juegos/horoscopo-game/cielo-data.js','juegos/horoscopo-game/anual-data.js','juegos/signos-native.js','juegos/signos-game/signos-extra.js','juegos/novedades-game/main-inline.js']]
jsx.build(files,'en/tools',post=post)
