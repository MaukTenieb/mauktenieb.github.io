"""Borne Insert Koin : fabrique les pages de la borne depuis les copies d'Insert Koin (aspire-borne.sh).
insertkoin.html -> index.html (meuble, écran, panneau, porte à Koins) ;
skoporhogo.html -> skoporhogo-borne.html (horloge du visiteur, temps réel).
Les copies restent telles qu'aspirées, aux noms canoniques près (CANON) ; les fichiers borne-* et ces deux pages viennent d'ici."""
import os, re
D = os.path.dirname(os.path.abspath(__file__))

def rd(n): return open(os.path.join(D, n), encoding="utf-8").read()
def wr(n, s): open(os.path.join(D, n), "w", encoding="utf-8").write(s)

def once(s, old, new):
    assert s.count(old) >= 1, old
    return s.replace(old, new, 1)

s = rd("insertkoin.html")
s = once(s, "<head>", '<head>\n<meta name="robots" content="noindex,nofollow">')
s = once(s, "</head>", '<style id="b-veil">html:not(.borne-ready) body{background:transparent!important}html:not(.borne-ready) body>*{visibility:hidden!important}html:not(.borne-ready){background:#0b0908!important;min-height:100%}html:not(.borne-ready)::before{content:"";position:fixed;inset:7vmin;z-index:2147483647;background:var(--wait) center/contain no-repeat;box-shadow:none}html.borne-ready{transition:background-color .4s}</style>\n<script>(function(){var i=1+Math.floor(Math.random()*27),d=document.documentElement.style;d.setProperty("--wait","url(attente-"+(i<10?"0":"")+i+".webp)");d.setProperty("--waitsz","contain");setTimeout(function(){document.documentElement.classList.add("borne-ready")},5000)})()</script>\n<link rel="stylesheet" href="borne-cabinet.css">\n<link rel="stylesheet" href="borne-charte.css">\n</head>')
i = s.rfind("</body>")
s = s[:i] + '<script src="borne-cabinet.js"></script>\n<script src="borne-aimant.js"></script>\n<script src="borne-jeu.js"></script>\n<script src="borne-presence.js"></script>\n<script src="borne-son.js"></script>\n<script src="borne-dekonect.js"></script>\n' + s[i:]
# crochets de la borne dans le code de la page (fermé dans une fonction) : go, goHome, openGame, et une poignée
# les psychopompes : les répliques de l'artiste restent telles quelles ; borne-say.txt ajoute une phrase aux seuls arrêts propres à la borne
import re as _re
_say=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'borne-say.txt'),encoding='utf-8').read().rstrip()
assert len(_re.findall(r'  const SAY=\{.*?\};\n',s))==1
s=_re.sub(r'(  const SAY=\{.*?\};\n)',lambda m:m.group(1)+_say+'\n',s,count=1)
s = once(s, "const go=(el.querySelector('[data-go]')||el).dataset.go||(el.id==='kapture'", "const go=el.dataset.grp||(el.querySelector('[data-go]')||el).dataset.go||(/bandcamp/.test(hr)?'bc':'')||(el.id==='kapture'")
# psychopompes de la borne : premier arrêt Burrows ou Mauk Tenieb ; rebonds sur les bords de l'écran, trois au moins
s = once(s, "    TQ=stops;\n", "    if(!(resume&&resume.length)&&window.__borneFirst){const F=window.__borneFirst();stops=stops.filter(x=>F.indexOf(x)<0);stops.splice(1+Math.floor(Math.random()*stops.length),0,F[1]);stops.unshift(F[0]);}\n    TQ=stops;\n")
s = once(s, "function bounds(){const b=home.getBoundingClientRect(),gw=parseFloat(g.style.getPropertyValue('--gw'))||60;return{", "function bounds(){const b=home.getBoundingClientRect(),gw=parseFloat(g.style.getPropertyValue('--gw'))||60;const S=window.__borneScreen&&window.__borneScreen();if(S)return{x0:S.left-b.left,x1:Math.max(S.left-b.left,S.right-b.left-gw),y0:S.top-b.top,y1:Math.max(S.top-b.top,S.bottom-b.top-H)};return{")
s = once(s, "fl={vx:vx*k,vy:vy*k,t:performance.now()", "const s0=sp*k,an=sp<1?Math.random()*6.283:Math.atan2(vy,vx),S0=Math.max(window.__borneScreen?1500:0,s0);fl={vx:Math.cos(an)*S0,vy:Math.sin(an)*S0,t:performance.now()")
s = once(s, "const f=Math.pow(.42,dt);fl.vx*=f;fl.vy*=f;", "const f=Math.pow(window.__borneScreen?.6:.42,dt);fl.vx*=f;fl.vy*=f;if(window.__borneScreen&&fl.hits<3){const v=Math.hypot(fl.vx,fl.vy)||1;if(v<700){fl.vx*=700/v;fl.vy*=700/v;}}")
s = once(s, 'allow="autoplay; fullscreen; clipboard-write"', 'allow="autoplay; fullscreen; clipboard-write; microphone; camera"')
# l'enseigne change de nom en douceur : le néon baisse, le nom change dans la pénombre, le néon revient ; plus rarement
s = once(s, "morph(cur,nx,()=>{cur=nx;if(br)br.textContent=cur;", "morph(cur,nx,()=>{cur=nx;if(br){const B=br;B.classList.add('b-dim');setTimeout(()=>{const k=B.querySelector('.b-habit');B.firstChild&&B.firstChild.nodeType===3?B.firstChild.nodeValue=cur:B.insertBefore(document.createTextNode(cur),B.firstChild);if(k&&!B.contains(k))B.appendChild(k);B.classList.remove('b-dim');},900);}")
s = once(s, "function later(){setTimeout(go2,7000+Math.random()*11000);}", "function later(){setTimeout(go2,26000+Math.random()*34000);}")
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
# Koins : 99 au plus ; à zéro, le décompte de la Koin gratuite part tout de suite (30 s), sans attendre un refus
s = once(s, "if(k!==null)koins=+k;freeAt=", "if(k!==null)koins=Math.min(99,+k);freeAt=")
s = once(s, "koins=Math.min(Number.MAX_SAFE_INTEGER,koins+1)", "koins=Math.min(99,koins+1)")
s = once(s, "setInterval(()=>{if(koins<1&&freeAt&&Date.now()>=freeAt)", "setInterval(()=>{if(koins>99){koins=99;saveKoins();}if(koins<1&&!freeAt){freeAt=Date.now()+30000;saveKoins();}if(koins<1&&freeAt&&Date.now()>=freeAt)")
# Korong! : un toucher sur un Mask lance le duel (son nom s'affiche dès l'appui) ; la table reste dans la borne, sans plein écran automatique
s = once(s, "b.onpointerdown=e=>{b._touch=e.pointerType==='touch';};", "b.onpointerdown=e=>{b._touch=e.pointerType==='touch';say();};")
s = once(s, "b.onclick=()=>{if(b._touch&&!b.classList.contains('armed')){lb.querySelectorAll('.spot.armed').forEach(x=>x.classList.remove('armed'));b.classList.add('armed');say();return;}pickGuest(i);};", "b.onclick=()=>{pickGuest(i);};")
s = once(s, "$('cv').addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||document.fullscreenElement)return;", "$('cv').addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||document.fullscreenElement||document.documentElement.classList.contains('borne'))return;")
# Kapture : deux boutons (SKREEN, KAM), Échap ferme le choix
s = once(s, '<button class="btn hot" type="button">KAM</button><button class="btn" type="button" aria-label="${tr(\'no\')}">✕</button></div>`;', '<button class="btn hot" type="button">KAM</button></div>`;')
s = once(s, "a.onclick=()=>{m.remove();skreen();};b.onclick=()=>{m.remove();openGame('kapture','KAPTURE');};c.onclick=()=>m.remove();a.focus();}",
  "a.onclick=()=>{m.remove();skreen();};b.onclick=()=>{m.remove();openGame('kapture','KAPTURE');};const esc=e=>{if(e.key==='Escape'&&document.body.contains(m)){e.stopImmediatePropagation();e.preventDefault();m.remove();removeEventListener('keydown',esc,true);}};addEventListener('keydown',esc,true);m.addEventListener('click',e=>{if(e.target===m)m.remove();});a.focus();}")
wr("index.html", s)

k = rd("skoporhogo.html")
k = once(k, "window.__room={step:stepSim,", "window.__room={SPEEDS,VIEW,applyView,zoomAt,step:stepSim,")
# la marche des Masks à vitesse naturelle, l'horloge à la minute exacte (window.__walk, posé par borne-skopo.js)
k = once(k, "a.mv.t+=a.speed*dt/a.mv.len; a.ph+=a.speed*dt*5.5;", "a.mv.t+=a.speed*dt*(window.__walk||1)/a.mv.len; a.ph+=a.speed*dt*(window.__walk||1)*5.5;")
k = once(k, "stepL=a.speed*.8*dt;", "stepL=a.speed*.8*dt*(window.__walk||1);")
k = once(k, "<head>", '<head>\n<meta name="robots" content="noindex,nofollow">')
i = k.rfind("</body>")
k = k[:i] + '<script src="borne-skopo.js"></script>\n' + k[i:]
wr("skoporhogo-borne.html", k)
# noms canoniques (KorhoBidule, FaunMachin) : appliqués aux pages de la borne et aux copies qu'elle affiche
CANON = {"Photofauna": "FotoFauna", "PHOTOFAUNA": "FOTOFAUNA", "Korhoname": "KorhoName", "Skoporhogo": "SkopoRhogo", "Mastermind": "MaskerMind", "MASTERMIND": "MASKERMIND"}
def canon(t):
    for a, b in CANON.items():
        t = t.replace(a, b)
    return t
for n in ("index.html", "skoporhogo-borne.html", "fotofauna.html", "fotofauna-test.html", "kg-kapture.js", "kg-katabatik.js", "kg-katabatik.html"):
    if os.path.exists(os.path.join(D, n)):
        wr(n, canon(rd(n)))
# 99 au plus, partout : cassettes, morceaux d'une cassette, Kuration, récits de Faunarratik (copies de la borne, retouchées une fois)
def cap(n, old, new):
    t = rd(n)
    if new in t: return
    assert t.count(old) == 1, (n, old)
    wr(n, t.replace(old, new))
cap("kg-vhs-library.js", 'a.push({ channel: tape.channel, channel_url: tape.channel_url || "", count: tape.tracks.length, tracks: tape.tracks.slice(0, 5000) });\n      writeLocal(a);',
    'a.push({ channel: tape.channel, channel_url: tape.channel_url || "", count: Math.min(99, tape.tracks.length), tracks: tape.tracks.slice(0, 99) });\n      writeLocal(a.slice(-99));')
cap("kg-vhs-library.js", "maxTracks: 600,", "maxTracks: 9801,")
cap("kg-vhs-library.js", "    var tracks = [], all = 0;\n    for (var i = 0; i < tapes.length; i++) {\n      var tt = (tapes[i] && tapes[i].tracks) || [];",
    "    var tracks = [], all = 0;\n    tapes = tapes.slice(0, 99);\n    for (var i = 0; i < tapes.length; i++) {\n      if (tapes[i] && tapes[i].tracks && tapes[i].tracks.length > 99) tapes[i].tracks = tapes[i].tracks.slice(0, 99);\n      var tt = (tapes[i] && tapes[i].tracks) || [];")
cap("ik-kuration.js", "MAX = 200,", "MAX = 99,")
cap("ik-kuration.js", "var list = mine(), on = !has(t.id);", "var list = mine(), on = !has(t.id);\n    if (on && list.length >= MAX) return false;")
cap("kuration.html", "k.tracks.slice(0,50)", "k.tracks.slice(0,99)")
cap("kg-faunarratics.js", "if(arr.length>50)arr=arr.slice(0,50);", "if(arr.length>99)arr=arr.slice(0,99);")
# grammaire commune (audit du 25 octobre) : un toucher agit ; Échap revient ; le clavier vaut les gestes
cap("kg-katabatik.js", "var W=Math.min(window.innerWidth-32,440);", "var _hr=document.getElementById('kg-root'),W=Math.max(196,Math.min(((_hr&&_hr.clientWidth)||window.innerWidth)-32,((_hr&&_hr.clientHeight)||window.innerHeight)-150,560));")
cap("kg-katabatik.js", "      ctx.fillText(ln(state.levelNames[_li]),W/2,CW*0.78);",
    "      [CW,CW*3.5,CW*6].forEach(function(x,j){ctx.fillStyle=j===_li?'rgba(255,224,138,.95)':'rgba(201,168,76,.4)';ctx.fillText(ln(state.levelNames[j]),x,CW*0.82);});")
cap("kg-katabatik.js", "  function drop(col){\n    if(state.over||state.turn!==1) return;",
    "  window.__c4k={s:state,d:function(c){drop(c);},r:function(){draw();},n:COLS};\n  function drop(col){\n    if(state.over||state.turn!==1) return;")
cap("kg-katabatik.js", "go:['space / tap','espace / touche']", "go:['','']")
# pages en cadre : feuille commune de la borne (borne-frames.css)
for n in ("reporhogo.html", "tor.html"):
    t = rd(n)
    if "borne-frames.css" not in t:
        wr(n, t.replace("</head>", '<link rel="stylesheet" href="borne-frames.css">\n</head>', 1))
cap("reporhogo.html", ' placeholder="Comma-separated URLs appear here."', '')
# SkopoRhogo : Échap désélectionne d'abord le Mask, sans quitter le programme
k2 = rd("skoporhogo-borne.html")
k2 = k2.replace("if(e.key==='Escape'&&selected>=0) select(selected);", "if(e.key==='Escape'&&selected>=0){ e.preventDefault(); select(selected); }")
wr("skoporhogo-borne.html", k2)
# FotoFauna : le logo déclenche, caméra avant ou arrière, pile et pellicule (borne-fotofauna.js, borne-fotofauna.css)
cap("fotofauna.html", 'getUserMedia({video:{facingMode:"user",width:{ideal:1280}},audio:false})', 'getUserMedia({video:{facingMode:(window.__ffFacing||"user"),width:{ideal:1280}},audio:false})')
cap("fotofauna.html", "let img=vframe(src,!!CAM,VSIDE);", "let img=vframe(src,!!CAM&&window.__ffMirror!==false,VSIDE);")
cap("fotofauna.html", "</head>", '<link rel="stylesheet" href="borne-fotofauna.css">\n</head>')
t = rd("fotofauna.html")
if "borne-fotofauna.js" not in t:
    i = t.rfind("</body>"); wr("fotofauna.html", t[:i] + '<script src="borne-fotofauna.js"></script>\n' + t[i:])
print("index.html, skoporhogo-borne.html ; noms canoniques ; plafond 99 ; FotoFauna")
