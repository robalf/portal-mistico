"""Tokenizador mínimo de literales de cadena JS. strings(src)-> lista de (ini,fin,quote,contenido)"""
import re
def strings(s):
    out=[];i=0;n=len(s)
    while i<n:
        c=s[i]
        if c=='/' and i+1<n and s[i+1]=='/':
            j=s.find('\n',i); i=n if j<0 else j; continue
        if c=='/' and i+1<n and s[i+1]=='*':
            j=s.find('*/',i+2); i=n if j<0 else j+2; continue
        if c in '\'"`':
            q=c;j=i+1
            while j<n:
                if s[j]=='\\': j+=2; continue
                if s[j]==q: break
                j+=1
            out.append((i,j+1,q,s[i+1:j])); i=j+1; continue
        if c=='/':
            # regex literal heuristic: previous non-space char
            k=i-1
            while k>=0 and s[k] in ' \t': k-=1
            if k<0 or s[k] in '(,=:[!&|?{};':
                j=i+1;cls=False
                while j<n and s[j]!='\n':
                    if s[j]=='\\': j+=2; continue
                    if s[j]=='[': cls=True
                    elif s[j]==']': cls=False
                    elif s[j]=='/' and not cls: break
                    j+=1
                i=j+1; continue
        i+=1
    return out
def candidate(t):
    return bool(re.search(r'[A-Za-záéíóúñÁÉÍÓÚÑ]{2}',t)) and (' ' in t or re.search('[áéíóúñÁÉÍÓÚÑ¿¡]',t))
