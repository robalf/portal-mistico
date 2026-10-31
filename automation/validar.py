#!/usr/bin/env python3
"""Valida el sitio antes de publicar: enlaces internos y recursos locales rotos, en los archivos cambiados o en todo el sitio."""
import re, sys, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parent.parent
files = [ROOT/f for f in sys.argv[1:]] if len(sys.argv) > 1 else [p for p in ROOT.rglob('*.html') if '-game' not in str(p)]
bad = 0
for f in files:
    s = f.read_text(encoding='utf8')
    for m in re.finditer(r'(?:href|src)="([^"#?]+)', s):
        u = m.group(1)
        if re.match(r'(https?:|mailto:|tel:|data:|javascript:|//|/assets|wa\.me)', u): 
            if u.startswith('/'):
                if not (ROOT/u.lstrip('/')).exists(): print('ROTO', f.relative_to(ROOT), u); bad += 1
            continue
        if not (f.parent/u).resolve().exists(): print('ROTO', f.relative_to(ROOT), u); bad += 1
print('enlaces rotos:', bad); sys.exit(1 if bad else 0)
