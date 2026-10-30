#!/usr/bin/env python3
"""Contrôle de la borne : cinq fenêtres, mêmes chiffres avant et après chaque lot.

Usage : python3 borne-controle.py <url de la borne> <dossier de sortie> [--court]
Sortie : controle.json (chiffres par fenêtre) et une capture par fenêtre à l'arrivée et pendant la visite.
Chiffres : écran entier à l'arrivée, défilement de la page pendant la visite, débordement horizontal,
texte sous 12 px, cibles tactiles sous 44 px, images par seconde à l'accueil, erreurs de la page.
"""
import asyncio, json, sys, os
from playwright.async_api import async_playwright

FEN = [(1920, 1080, False), (1366, 768, False), (820, 1180, True), (390, 844, True), (844, 390, True)]

MESURE = """(()=>{
  const H=innerHeight,W=innerWidth,s=document.querySelector('.b-screen'),r=s?s.getBoundingClientRect():null;
  const vis=e=>{const q=e.getBoundingClientRect();if(q.width<1||q.height<1||q.bottom<0||q.top>H)return null;const c=getComputedStyle(e);if(c.visibility==='hidden'||c.display==='none'||+c.opacity===0)return null;return q};
  let petit=0,ex=[];
  for(const e of document.querySelectorAll('body *')){if(!e.childNodes.length)continue;let t='';for(const n of e.childNodes)if(n.nodeType===3)t+=n.textContent.trim();if(!t)continue;
    if(e.closest('iframe,svg,.guide,.gtip'))continue;const q=vis(e);if(!q)continue;const f=parseFloat(getComputedStyle(e).fontSize);if(f<12){petit++;if(ex.length<6)ex.push(t.slice(0,24)+' '+f+'px')}}
  let cible=0,cx=[];
  for(const e of document.querySelectorAll('a,button,[role=button],input,select,.cab')){const q=vis(e);if(!q)continue;if(Math.min(q.width,q.height)<44*(W<900?1:0.6)){cible++;if(cx.length<6)cx.push((e.textContent||e.className||'').toString().trim().slice(0,18)+' '+Math.round(q.width)+'x'+Math.round(q.height))}}
  return {ecran:r?[Math.round(r.top),Math.round(r.bottom)]:null,ecranEntier:!!r&&r.top>=0&&r.bottom<=H,
    debordeX:document.documentElement.scrollWidth>W+1,hauteurPage:document.documentElement.scrollHeight,
    textePetit:petit,textePetitEx:ex,ciblesPetites:cible,ciblesEx:cx}
})()"""

FPS = "()=>new Promise(r=>{let n=0,t0=performance.now();function f(){n++;if(performance.now()-t0<3000)requestAnimationFrame(f);else r(Math.round(n/3*10)/10)}requestAnimationFrame(f)})"

async def fenetre(b, url, out, w, h, mob, court):
    ctx = await b.new_context(viewport={"width": w, "height": h}, is_mobile=mob, has_touch=mob)
    pg = await ctx.new_page(); err = []
    pg.on("pageerror", lambda e: err.append(str(e)[:160]))
    await pg.goto(url, wait_until="load"); await pg.wait_for_timeout(6000)
    R = {"fenetre": f"{w}x{h}", "arrivee": await pg.evaluate(MESURE)}
    await pg.screenshot(path=os.path.join(out, f"{w}x{h}-arrivee.png"))
    R["fpsAccueil"] = await pg.evaluate(FPS)
    ys, entier = [], 0
    for i in range(20 if court else 60):
        await pg.wait_for_timeout(500)
        y, e = await pg.evaluate("(()=>{const r=document.querySelector('.b-screen').getBoundingClientRect();return [Math.round(scrollY),r.top>=0&&r.bottom<=innerHeight]})()")
        ys.append(y); entier += e
        if i == 14: await pg.screenshot(path=os.path.join(out, f"{w}x{h}-visite.png"))
    R["visite"] = {"mouvements": sum(abs(a - c) > 4 for a, c in zip(ys, ys[1:])), "trajetPx": sum(abs(a - c) for a, c in zip(ys, ys[1:])), "ecranEntier": f"{entier}/{len(ys)}"}
    R["erreurs"] = err
    await ctx.close(); return R

async def main():
    url, out = sys.argv[1], sys.argv[2]; court = "--court" in sys.argv
    os.makedirs(out, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        res = [await fenetre(b, url, out, w, h, m, court) for w, h, m in FEN]  # une fenêtre à la fois : images par seconde comparables
        await b.close()
    json.dump(res, open(os.path.join(out, "controle.json"), "w"), ensure_ascii=False, indent=1)
    for r in res:
        a = r["arrivee"]
        print(f'{r["fenetre"]:>9}  écran entier à l\'arrivée {"oui" if a["ecranEntier"] else "NON"}  visite {r["visite"]["ecranEntier"]} ({r["visite"]["trajetPx"]} px)  '
              f'texte<12px {a["textePetit"]}  cibles<44px {a["ciblesPetites"]}  débord {"OUI" if a["debordeX"] else "non"}  {r["fpsAccueil"]} img/s  erreurs {len(r["erreurs"])}')

asyncio.run(main())
