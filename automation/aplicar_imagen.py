#!/usr/bin/env python3
"""Convierte las imágenes que Roberto sube a imagenes-pendientes/<slug>.(png|jpg|jpeg|webp) en portada (1200x675) y miniatura (500x500)
de assets/blog/<slug>-01.jpg y -thumb.jpg, solo si ya existe el artículo blog/<slug>.html. Borra el archivo pendiente al terminar."""
import pathlib
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
def fit(im, w, h):
    r = max(w/im.width, h/im.height); im = im.resize((round(im.width*r), round(im.height*r)), Image.LANCZOS)
    l, t = (im.width-w)//2, (im.height-h)//2; return im.crop((l, t, l+w, t+h))
n = 0
for f in sorted((ROOT/'imagenes-pendientes').glob('*')):
    if f.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'): continue
    slug = f.stem
    if not (ROOT/'blog'/f'{slug}.html').exists(): print('aún no existe el artículo', slug); continue
    im = Image.open(f).convert('RGB')
    fit(im, 1200, 675).save(ROOT/'assets/blog'/f'{slug}-01.jpg', quality=88)
    fit(im, 500, 500).save(ROOT/'assets/blog'/f'{slug}-thumb.jpg', quality=88)
    f.unlink(); n += 1; print('imagen aplicada', slug)
print('imágenes aplicadas:', n)
