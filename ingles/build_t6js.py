import jsx,json,re
WB=json.load(open('tr/js_words_bundle.json',encoding='utf8'))
ELN="var ELN = { fuego: 'fire', tierra: 'earth', aire: 'air', agua: 'water', cardinal: 'cardinal', fijo: 'fixed', mutable: 'mutable' };\n"
def post_bundle(f,s):
    s=s.replace('es-ES','en-US').replace('language=es&','language=en&').replace("DateTimeFormat('es'","DateTimeFormat('en-US'")
    # nombres de elementos/modalidades (los ids internos siguen en español; solo cambia lo que se muestra)
    s=s.replace("window.CartaTextos = (function () {","window.ELN = { fuego: 'fire', tierra: 'earth', aire: 'air', agua: 'water', cardinal: 'cardinal', fijo: 'fixed', mutable: 'mutable' };\nwindow.CartaTextos = (function () {",1)
    s=s.replace("' + cap(k) + '</span>","' + cap(ELN[k]) + '</span>")
    s=s.replace("<strong>' + domE + '</strong>","<strong>' + ELN[domE] + '</strong>")
    s=s.replace("' + lowE + ',","' + ELN[lowE] + ',")
    s=s.replace("<strong>' + domM + '</strong>","<strong>' + ELN[domM] + '</strong>")
    s=s.replace("<strong>' + S.el + '</strong>","<strong>' + ELN[S.el] + '</strong>").replace("<strong>' + S.mod + '</strong>","<strong>' + ELN[S.mod] + '</strong>")
    s=s.replace('ELN[N[m1]]','N[m1]').replace('ELN[N[m2]]','N[m2]').replace('N[m1]','ELN[N[m1]]').replace('N[m2]','ELN[N[m2]]')
    # fecha y hora a la usanza de EE. UU.
    s=re.sub(r"return d\[2\] \+ '/' \+ d\[1\] \+ '/' \+ d\[0\] \+ \(input\.time \? ' · ' \+ input\.time \+ ' h' :",
      "var mo = ['January','February','March','April','May','June','July','August','September','October','November','December'][+d[1] - 1]; var tm = input.time ? (function (t) { var p = t.split(':'), h = +p[0]; return ((h % 12) || 12) + ':' + p[1] + ' ' + (h >= 12 ? 'PM' : 'AM'); })(input.time) : ''; return mo + ' ' + (+d[2]) + ', ' + d[0] + (input.time ? ' · ' + tm :",s,1)
    return s
def post_br(f,s):
    s=s.replace("['L', 'M', 'X', 'J', 'V', 'S', 'D']","['M', 'T', 'W', 'T', 'F', 'S', 'S']")
    s=s.replace('es-ES','en-US').replace('Estado simbólico para el ${','Symbolic status for ${').replace("'Todays Moon'","'Today\\'s Moon'").replace('<h2>Todays Moon</h2>',"<h2>Today's Moon</h2>")
    return s
# 1) bundle de la carta astral (solo la parte de la aplicación, línea 262 en adelante)
jsx.FORCE=set(WB); jsx.RANGES={'assets/js/carta-astral.bundle.js':[(262,100000)]}
jsx.build([('assets/js/carta-astral.bundle.js','carta-astral-en.bundle.js')],'assets/js',post=post_bundle)
# 2) Brújula lunar
jsx.FORCE=set(json.load(open('tr/js_words.json',encoding='utf8'))); jsx.RANGES={}
jsx.build([('juegos/brujula-game/'+x,x) for x in ['main-inline.js','astro.js','datos-astro.js']],'en/tools/brujula-game',post=post_br)
