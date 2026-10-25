"""Borne Insert Koin : fabrique les pages de la borne depuis les copies d'Insert Koin (aspire-borne.sh).
insertkoin.html -> index.html (meuble, écran, panneau, porte à Koins) ;
skoporhogo.html -> skoporhogo-borne.html (horloge du visiteur, temps réel).
Les copies restent telles qu'aspirées ; seuls les fichiers borne-* et ces deux pages viennent d'ici."""
import os, re
D = os.path.dirname(os.path.abspath(__file__))

def rd(n): return open(os.path.join(D, n), encoding="utf-8").read()
def wr(n, s): open(os.path.join(D, n), "w", encoding="utf-8").write(s)

def once(s, old, new):
    assert s.count(old) >= 1, old
    return s.replace(old, new, 1)

s = rd("insertkoin.html")
s = once(s, "<head>", '<head>\n<meta name="robots" content="noindex,nofollow">')
s = once(s, "</head>", '<link rel="stylesheet" href="borne-cabinet.css">\n</head>')
i = s.rfind("</body>")
s = s[:i] + '<script src="borne-cabinet.js"></script>\n' + s[i:]
# crochets de la borne dans le code de la page (fermé dans une fonction) : go, goHome, openGame, et une poignée
s = once(s, "function go(k){ac();", "function go(k){if(window.__borneGo&&window.__borneGo(k))return;ac();")
s = once(s, "function boom(cb){", "function boom(cb){if(window.__borneBoom)return window.__borneBoom(cb);")
s = once(s, "function openGame(k,title){", "function openGame(k,title){window.__borneGame&&window.__borneGame(k);")
i = s.index("function goHome(){"); j = s.index("\n", i)
s = s[:i] + "function goHome(){window.__borneHome&&window.__borneHome();" + s[i+len("function goHome(){"):j+1] \
    + "window.__ik={go:k=>go(k),goHome:()=>goHome(),openCalque:(a,b,c,d)=>openCalque(a,b,c,d),openGame:(k,t)=>openGame(k,t),boom:cb=>boom(cb),ac:()=>ac(),tone:(...a)=>tone(...a),burst:(...a)=>burst(...a),lang:()=>LANG};\n" + s[j+1:]
s = re.sub(r"<title>[^<]*</title>", "<title>Borne Insert Koin — essai</title>", s, count=1)
# devant Korong! : l'image de l'écran titre, avec ses zones cliquables (borne-lobby.json, repères de poster.webp, 1200 x 896)
import json
B = json.load(open(os.path.join(D, "borne-lobby.json"), encoding="utf-8"))
s = once(s, '<img id="lobbyImg" src="room.webp" width="512" height="382"', '<img id="lobbyImg" src="poster.webp" width="1200" height="896"')
for mid, box in B.items():
    pat = re.compile(r'("id": "' + mid + r'"(?:(?!"id": ).)*?"box": )\[[0-9, ]+\]', re.S)
    s, n = pat.subn(lambda m: m.group(1) + json.dumps(box), s, count=1)
    assert n == 1, mid
wr("index.html", s)

k = rd("skoporhogo.html")
k = once(k, "window.__room={step:stepSim,", "window.__room={SPEEDS,VIEW,applyView,step:stepSim,")
k = once(k, "<head>", '<head>\n<meta name="robots" content="noindex,nofollow">')
i = k.rfind("</body>")
k = k[:i] + '<script src="borne-skopo.js"></script>\n' + k[i:]
wr("skoporhogo-borne.html", k)
print("index.html, skoporhogo-borne.html")
