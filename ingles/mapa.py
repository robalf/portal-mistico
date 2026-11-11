# Mapa es -> en (rutas bajo /en/). Los slugs en inglés buscan la consulta típica en inglés.
M = {
# T1
'index.html':'index.html','sobre-nosotros.html':'about.html','contacto.html':'contact.html','aviso-legal.html':'legal-notice.html',
'cookies.html':'cookies.html','privacidad.html':'privacy-policy.html','terminos.html':'terms-of-use.html','metodologia.html':'how-our-tools-work.html',
'recursos/index.html':'resources/index.html','blog/index.html':'blog/index.html','glosario/index.html':'glossary/index.html',
# T2 glosario
'glosario/arcanos-mayores.html':'glossary/major-arcana.html','glosario/arcanos-menores.html':'glossary/minor-arcana.html','glosario/ascendente.html':'glossary/rising-sign.html',
'glosario/aura.html':'glossary/aura.html','glosario/carta-astral.html':'glossary/birth-chart.html','glosario/casas-astrales.html':'glossary/astrological-houses.html',
'glosario/luna-llena.html':'glossary/full-moon.html','glosario/luna-nueva.html':'glossary/new-moon.html','glosario/mercurio-retrogrado.html':'glossary/mercury-retrograde.html',
'glosario/numero-maestro.html':'glossary/master-number.html','glosario/signo-lunar.html':'glossary/moon-sign.html','glosario/sinastria.html':'glossary/synastry.html',
# T2 zodiaco
'zodiaco/index.html':'zodiac/index.html','zodiaco/aries.html':'zodiac/aries.html','zodiaco/tauro.html':'zodiac/taurus.html','zodiaco/geminis.html':'zodiac/gemini.html',
'zodiaco/cancer.html':'zodiac/cancer.html','zodiaco/leo.html':'zodiac/leo.html','zodiaco/virgo.html':'zodiac/virgo.html','zodiaco/libra.html':'zodiac/libra.html',
'zodiaco/escorpio.html':'zodiac/scorpio.html','zodiaco/sagitario.html':'zodiac/sagittarius.html','zodiaco/capricornio.html':'zodiac/capricorn.html',
'zodiaco/acuario.html':'zodiac/aquarius.html','zodiaco/piscis.html':'zodiac/pisces.html',
# T3 tarot
'juegos/tarot.html':'tools/free-online-tarot-reading.html','juegos/tarot-del-amor-gratis.html':'tools/free-love-tarot-reading.html','juegos/tarot-del-dia.html':'tools/daily-tarot-card.html',
'juegos/tarot-pasado-presente-futuro.html':'tools/past-present-future-tarot-spread.html','juegos/tarot-si-o-no.html':'tools/yes-or-no-tarot.html',
'blog/tarot-del-amor.html':'blog/love-tarot-cards-meaning.html','blog/tarot-del-dia-carta-diaria.html':'blog/daily-tarot-card-how-to-read.html',
'blog/tirada-tarot-tres-cartas.html':'blog/three-card-tarot-spread.html','blog/elegir-primera-baraja-tarot.html':'blog/how-to-choose-your-first-tarot-deck.html',
'blog/arcanos-mayores-tarot.html':'blog/major-arcana-meanings.html',
# T4 numerologia
'juegos/numerologia.html':'tools/free-numerology-calculator.html','juegos/calcular-numero-de-vida.html':'tools/life-path-number-calculator.html',
'juegos/ano-personal-2027.html':'tools/personal-year-number-2027.html','juegos/numeros-de-la-suerte-hoy.html':'tools/lucky-numbers-today.html',
'juegos/compatibilidad-de-nombres.html':'tools/name-compatibility-numerology.html','juegos/personalidad-segun-tu-nombre.html':'tools/name-numerology-personality.html',
'blog/numero-camino-de-vida.html':'blog/life-path-number-meaning.html','blog/numerologia-del-nombre.html':'blog/name-numerology.html',
'blog/numerologia-fecha-nacimiento.html':'blog/birth-date-numerology.html','blog/numeros-angelicales-significado.html':'blog/angel-numbers-meaning.html',
'blog/numeros-maestros-11-22-33.html':'blog/master-numbers-11-22-33.html',
# T5 horoscopo y signos
'juegos/horoscopo.html':'tools/free-horoscope.html','juegos/horoscopo-de-hoy.html':'tools/daily-horoscope.html','juegos/horoscopo-de-manana.html':'tools/tomorrows-horoscope.html',
'juegos/horoscopo-semanal.html':'tools/weekly-horoscope.html','juegos/horoscopo-mensual.html':'tools/monthly-horoscope.html','juegos/horoscopo-chino.html':'tools/chinese-zodiac-calculator.html',
'juegos/signos.html':'tools/zodiac-signs-love.html','juegos/celos-e-infidelidad-segun-tu-signo.html':'tools/jealousy-and-cheating-by-zodiac-sign.html',
'juegos/como-afronta-una-ruptura-cada-signo.html':'tools/how-each-zodiac-sign-handles-breakups.html','juegos/como-besa-cada-signo.html':'tools/how-each-zodiac-sign-kisses.html',
'juegos/como-conquistar-a-cada-signo.html':'tools/how-to-win-over-each-zodiac-sign.html','juegos/compatibilidad-amorosa-de-cada-signo.html':'tools/zodiac-love-compatibility.html',
'juegos/por-que-enamorarte-de-cada-signo.html':'tools/why-fall-in-love-with-each-zodiac-sign.html','juegos/que-regalarle-a-cada-signo.html':'tools/gifts-for-each-zodiac-sign.html',
'juegos/compatibilidad-entre-signos.html':'tools/zodiac-compatibility-calculator.html','juegos/compatibilidad-padres-e-hijos-horoscopo-chino.html':'tools/chinese-zodiac-parent-child-compatibility.html',
# T6 astro tools + brujula
'juegos/carta-astral.html':'tools/free-birth-chart.html','juegos/calcular-ascendente.html':'tools/rising-sign-calculator.html','juegos/signo-lunar.html':'tools/moon-sign-calculator.html',
'juegos/sinastria.html':'tools/synastry-chart-calculator.html','juegos/revolucion-solar.html':'tools/solar-return-calculator.html','juegos/transitos.html':'tools/daily-transits.html',
'juegos/brujula.html':'tools/moon-phase-today.html','juegos/calendario-lunar.html':'tools/lunar-calendar.html','juegos/fase-lunar-hoy.html':'tools/current-moon-phase-and-sign.html',
'juegos/planetas-retrogrados-hoy.html':'tools/is-mercury-retrograde-today.html','juegos/ritual-del-dia.html':'tools/daily-moon-ritual.html',
# T7 blog astro
'blog/calendario-lunar-noviembre-2026.html':'blog/lunar-calendar-november-2026.html','blog/calendario-lunar-octubre-2026.html':'blog/lunar-calendar-october-2026.html',
'blog/horoscopo-2026-signos.html':'blog/horoscope-2026-all-signs.html','blog/horoscopo-2027-signos.html':'blog/horoscope-2027-all-signs.html',
'blog/horoscopo-noviembre-2026-signos.html':'blog/horoscope-november-2026-all-signs.html','blog/horoscopo-semanal-como-leerlo.html':'blog/how-to-read-your-weekly-horoscope.html',
'blog/leonidas-2026-lluvia-de-estrellas.html':'blog/leonids-meteor-shower-2026.html','blog/mercurio-retrogrado-octubre-2026.html':'blog/mercury-retrograde-october-2026.html',
'blog/que-es-el-ascendente.html':'blog/what-is-a-rising-sign.html','blog/elementos-zodiaco.html':'blog/zodiac-elements.html',
'blog/compatibilidad-signos-zodiacales.html':'blog/zodiac-sign-compatibility.html','blog/dia-de-muertos-samhain-ritual-2026.html':'blog/day-of-the-dead-samhain-ritual-2026.html',
'blog/portal-11-11-ritual.html':'blog/11-11-portal-meaning-and-ritual.html',
# T8 parejas
**{'blog/compatibilidad-%s.html'%p:'blog/%s-compatibility.html'%q for p,q in [('aries-leo','aries-and-leo'),('aries-escorpio','aries-and-scorpio'),('tauro-virgo','taurus-and-virgo'),
 ('tauro-escorpio','taurus-and-scorpio'),('geminis-libra','gemini-and-libra'),('cancer-piscis','cancer-and-pisces'),('leo-sagitario','leo-and-sagittarius'),
 ('virgo-capricornio','virgo-and-capricorn'),('libra-acuario','libra-and-aquarius'),('escorpio-piscis','scorpio-and-pisces'),('leo-escorpio','leo-and-scorpio'),
 ('cancer-capricornio','cancer-and-capricorn')]},
# T9 aura, quiromancia, vidas pasadas
'juegos/aura.html':'tools/aura-color-test.html','juegos/quiromancia.html':'tools/online-palm-reading.html',
'blog/colores-del-aura-significado.html':'blog/aura-colors-meaning.html','blog/como-saber-color-de-tu-aura.html':'blog/how-to-find-your-aura-color.html',
'blog/limpiar-proteger-energia-aura.html':'blog/how-to-cleanse-and-protect-your-aura.html','blog/formas-de-mano-quiromancia.html':'blog/hand-shapes-in-palmistry.html',
'blog/letra-m-en-la-mano.html':'blog/letter-m-in-the-palm.html','blog/linea-del-corazon-quiromancia.html':'blog/heart-line-palmistry.html',
'blog/lineas-de-la-mano-quiromancia.html':'blog/palm-lines-meaning.html','blog/almas-gemelas-vidas-pasadas.html':'blog/soulmates-and-past-lives.html',
'blog/regresion-vidas-pasadas.html':'blog/past-life-regression-how-to.html','blog/senales-vida-pasada.html':'blog/signs-of-a-past-life.html',
# T10 oraculo / novedades
'juegos/novedades.html':'tools/dream-meanings-and-angel-messages.html','juegos/mensajes-angelicales.html':'tools/angel-messages-today.html',
'juegos/rituales-y-hechizos.html':'tools/simple-rituals-and-spells.html','juegos/significado-de-los-suenos.html':'tools/dream-meanings.html',
'juegos/test-de-intuicion.html':'tools/intuition-test.html','juegos/i-ching.html':'tools/free-i-ching-reading.html','juegos/runas.html':'tools/free-rune-reading.html',
'juegos/oraculo-de-respuestas.html':'tools/oracle-yes-or-no-runes-i-ching.html','juegos/angel-de-la-guarda.html':'tools/find-your-guardian-angel.html','tienda/index.html':'shop/index.html',
}
TANDAS = {1:['index.html','sobre-nosotros.html','contacto.html','aviso-legal.html','cookies.html','privacidad.html','terminos.html','metodologia.html','recursos/index.html','blog/index.html','glosario/index.html']}
