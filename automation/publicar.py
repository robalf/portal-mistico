#!/usr/bin/env python3
"""Publica un artículo del blog a partir de un JSON. Uso: python3 automation/publicar.py spec.json
Campos del JSON: slug, title, description, category (p.ej. "🔮 Tarot"), theme (tarot|horoscopo|numerologia|quiromancia|aura|vidas),
read_min, date (YYYY-MM-DD), body_html, image_alt, [tool_links: [[url_relativa_desde_blog, texto]]]
Si falta assets/blog/<slug>-01.jpg y -thumb.jpg, genera una portada de marca automática."""
import json, re, sys, os, html, urllib.parse, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
TPL = ROOT/'blog'/'tarot-del-amor.html'
OLD = dict(slug='tarot-del-amor', title='Tarot del amor: lo que las cartas revelan sobre tu vida sentimental',
  desc='Las cartas del tarot más asociadas al amor y cómo interpretarlas en una lectura sentimental.',
  ttl='Tarot del amor: qué revelan las cartas | Portal Místico', date_h='20 de septiembre de 2026', date_i='2026-09-20',
  alt='Tirada de tarot Pasado, Presente y Futuro con las cartas La Luna, El Sol y La Estrella')
MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
E = html.escape

def cover(slug, title, category):
    from playwright.sync_api import sync_playwright
    page_html = f"""<html><body style="margin:0;width:1200px;height:675px;background:radial-gradient(circle at 70% 20%,#2A2560,#05060F 70%);font-family:Georgia,serif;color:#F4EFE3;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box;position:relative;overflow:hidden">
<div style="position:absolute;right:-120px;top:-120px;width:520px;height:520px;border-radius:50%;border:2px solid rgba(199,162,75,.35)"></div>
<div style="position:absolute;right:-40px;top:-40px;width:360px;height:360px;border-radius:50%;border:1px solid rgba(199,162,75,.5)"></div>
<div style="color:#C7A24B;letter-spacing:.2em;text-transform:uppercase;font-size:26px;margin-bottom:28px">{E(category)}</div>
<div style="font-size:64px;line-height:1.15;font-style:italic;max-width:900px">{E(title)}</div>
<div style="margin-top:40px;color:#C7A24B;font-size:28px">✦ Portal Místico ✦</div></body></html>"""
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width':1200,'height':675})
        pg.set_content(page_html); pg.screenshot(path=str(ROOT/'assets/blog'/f'{slug}-01.jpg'), type='jpeg', quality=88)
        pg.set_viewport_size({'width':500,'height':500})
        pg.set_content(page_html.replace('width:1200px;height:675px','width:500px;height:500px').replace('padding:0 90px','padding:0 40px').replace('font-size:64px','font-size:34px').replace('font-size:26px','font-size:16px').replace('font-size:28px','font-size:18px'))
        pg.screenshot(path=str(ROOT/'assets/blog'/f'{slug}-thumb.jpg'), type='jpeg', quality=88); b.close()

def main(spec_path):
    s = json.load(open(spec_path, encoding='utf8'))
    slug = s['slug']; assert re.fullmatch(r'[a-z0-9-]{5,90}', slug), 'slug inválido'
    out = ROOT/'blog'/f'{slug}.html'; assert not out.exists(), 'ya existe ese artículo'
    for k in ('title','description','category','theme','read_min','date','body_html','image_alt'): assert s.get(k), f'falta {k}'
    words = len(re.sub(r'<[^>]+>',' ',s['body_html']).split()); assert words >= int(os.environ.get('MIN_WORDS', 900)), f'solo {words} palabras'
    y,m,d = map(int, s['date'].split('-')); date_h = f'{d} de {MESES[m-1]} de {y}'
    if not (ROOT/'assets/blog'/f'{slug}-01.jpg').exists(): cover(slug, s['title'], s['category'])
    t = TPL.read_text(encoding='utf8'); a = t.index('<article class="post">'); z = t.index('</article>')
    head, tail = t[:a], t[z:]
    # artículos previos para la navegación
    idx = (ROOT/'blog'/'index.html').read_text(encoding='utf8')
    prev = re.findall(r'<a href="([a-z0-9-]+)\.html" class="post-card"[^>]*>.*?post-card-title">(.*?)</h2>', idx, re.S)[:2]
    nav = '<div class="post-nav">' + (f'<a href="{prev[0][0]}.html">← {E(prev[0][1][:48])}</a>' if prev else '') + '<a href="index.html">Volver al blog</a>' + (f'<a href="{prev[1][0]}.html">{E(prev[1][1][:48])} →</a>' if len(prev)>1 else '') + '</div>'
    art = f'''<article class="post">
  <div class="wrap">
    <div class="post-category">{E(s['category'])}</div>
    <h1>{E(s['title'])}</h1>
    <p class="post-meta">Por <a href="../sobre-nosotros.html#autor" rel="author" style="color:inherit;text-decoration:underline;">Roberto Rodriguez</a> · <time datetime="{s['date']}">{date_h}</time> · Lectura de {s['read_min']} min</p>
    <div class="post-hero"><img src="../assets/blog/{slug}-01.jpg" alt="{E(s['image_alt'])}" style="width:100%; height:auto; display:block;"></div>
    <div class="post-body">
{s['body_html']}
    </div>
    {nav}
  </div>
'''
    page = head + art + tail
    page = page.replace(OLD['ttl'], E(s['title'])[:60] + ' | Portal Místico').replace(OLD['title'], E(s['title'])).replace(OLD['desc'], E(s['description']))
    page = page.replace(OLD['alt'], E(s['image_alt'])).replace('tarot-del-amor-gratis','@@TDAG@@').replace('tarot-del-amor-01', f'{slug}-01').replace('tarot-del-amor', slug).replace('@@TDAG@@','tarot-del-amor-gratis')
    page = page.replace('2026-09-20', s['date'])
    q = urllib.parse.quote
    page = page.replace(q(OLD['title'], safe=''), q(s['title'], safe=''))
    out.write_text(page, encoding='utf8')
    # índice del blog
    card = f'''<a href="{slug}.html" class="post-card" data-theme="{s['theme']}">
  <div class="post-card-hero"><img src="../assets/blog/{slug}-thumb.jpg" alt="{E(s['image_alt'])}" style="width:100%; height:100%; object-fit:cover; display:block;"></div>
  <div class="post-card-body">
    <div class="post-card-cat">{E(s['category'])}</div>
    <h2 class="post-card-title">{E(s['title'])}</h2>
    <p>{E(s['description'])}</p>
    <span class="read-time">Lectura de {s['read_min']} min</span>
  </div>
</a>
'''
    idx = idx.replace('<div class="post-grid" id="postGrid">\n', '<div class="post-grid" id="postGrid">\n'+card, 1)
    (ROOT/'blog'/'index.html').write_text(idx, encoding='utf8')
    # sitemap y llms
    sm = (ROOT/'sitemap.xml').read_text(encoding='utf8')
    sm = sm.replace('</urlset>', f'<url><loc>https://elportalmistico.com/blog/{slug}.html</loc><lastmod>{s["date"]}</lastmod></url>\n</urlset>')
    (ROOT/'sitemap.xml').write_text(sm, encoding='utf8')
    ll = (ROOT/'llms.txt').read_text(encoding='utf8')
    ll = ll.replace('\n## Otras páginas', f'\n- [{s["title"]}](https://elportalmistico.com/blog/{slug}.html): {s["description"]}\n\n## Otras páginas',1) if '\n## Otras páginas' in ll else ll
    (ROOT/'llms.txt').write_text(ll, encoding='utf8')
    print('OK', out, words, 'palabras')
    return slug

if __name__ == '__main__': main(sys.argv[1])
