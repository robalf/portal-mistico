import re,os
R=os.path.join(os.path.dirname(__file__),'..','assets','js')
g=open(R+'/musica-global.js',encoding='utf8').read()
rep=[("'Pausar música' : 'Activar música'","'Pause music' : 'Play music'"),("'Volver atrás'","'Go back'"),
 ("['blog', 'glosario', 'zodiaco', 'recursos', 'tienda'].indexOf(seg[0]) !== -1 && !/^index(\\.html)?$/.test(seg[seg.length - 1])) return '/' + seg[0] + '/index.html';\n    return '/index.html';",
  "['blog', 'glossary', 'zodiac', 'resources', 'shop'].indexOf(seg[1]) !== -1 && !/^index(\\.html)?$/.test(seg[seg.length - 1])) return '/en/' + seg[1] + '/index.html';\n    return '/en/index.html';"),
 ("seg.length > 1 && ['blog'","seg.length > 2 && ['blog'"),
 ("/^\\/(index\\.html)?$/.test(location.pathname)","/^\\/en\\/(index\\.html)?$/.test(location.pathname)"),
 ("script[src*=\"opinion.js\"]","script[src*=\"opinion-en.js\"]"),("/assets/js/opinion.js?v=3","/assets/js/opinion-en.js?v=1")]
for a,b in rep:
    if a not in g: print('NO ENCONTRADO en musica:',a[:60])
    g=g.replace(a,b)
open(R+'/musica-global-en.js','w',encoding='utf8').write(g)
o=open(R+'/opinion.js',encoding='utf8').read()
rep=[("/\\/(contacto|privacidad|cookies|terminos|aviso-legal)(\\.html)?$/","/\\/(contact|privacy-policy|cookies|terms-of-use|legal-notice)(\\.html)?$/"),
("'Tu opinión'","'Your feedback'"),("'Cerrar'","'Close'"),("'¿Encontraste lo que buscabas?'","'Did you find what you were looking for?'"),
("'Tu opinión nos ayuda a mejorar Portal Místico. ¿Cómo calificarías tu visita?'","'Your feedback helps us improve Portal Místico. How would you rate your visit?'"),
("'Es anónimo. Solo vemos la calificación y lo que escribas.'","'It\\'s anonymous. We only see the rating and whatever you write.'"),
("'¡Gracias! 🌟 Nos alegra que lo hayas encontrado.'","'Thank you! 🌟 We\\'re glad you found it.'"),
("'Gracias. ¿Qué podríamos mejorar o qué te faltó?'","'Thanks. What could we improve, or what was missing?'"),
("'Lamentamos que no fuera lo que esperabas. ¿Qué buscabas o qué falló?'","'Sorry it wasn\\'t what you expected. What were you looking for, or what went wrong?'"),
("'Tu comentario'","'Your comment'"),("'Escribe aquí lo que buscabas o lo que podemos mejorar…'","'Write here what you were looking for or what we can improve…'"),
("'Enviar'","'Send'"),("'¡Gracias por ayudarnos a mejorar! 💜'","'Thank you for helping us improve! 💜'"),("'Ahora no'","'Not now'"),
("(n === 1 ? ' estrella' : ' estrellas')","(n === 1 ? ' star' : ' stars')"),
("'Opinión de visitante: ' + rating + ' de 5 estrellas — Portal Místico'","'English visitor feedback: ' + rating + ' out of 5 stars — Portal Místico'")]
for a,b in rep:
    if a not in o: print('NO ENCONTRADO en opinion:',a[:60])
    o=o.replace(a,b)
open(R+'/opinion-en.js','w',encoding='utf8').write(o)
print('ok')
