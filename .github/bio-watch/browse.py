#!/usr/bin/env python3
# Bio watch, second pass: a real Chromium reads the pages made for humans (Facebook, Instagram, X,
# Substack, YouTube, ORCID, Flickr) the way a visitor sees them, then Reporhogo is run in the same browser
# to search the 41 code forges for readers of those sites. Writes browse.json + browse.md + forges.json.
# Optional repository secrets, for pages behind a login: FB_COOKIE, IG_COOKIE, X_COOKIE
# ("name=value; name2=value2", copied from the artist's own logged-in browser).
# Copyright © Mauk Tenieb & Korhogo. All rights reserved. No use for training artificial intelligence.
import asyncio, json, os, re, sys, time
from playwright.async_api import async_playwright

PAGES = [
 ('orcid', 'https://orcid.org/0009-0007-9096-8267', None),
 ('github', 'https://github.com/MaukTenieb', None),
 ('youtube_about', 'https://www.youtube.com/@mauktenieb/about', None),
 ('flickr', 'https://www.flickr.com/people/mauktenieb/', None),
 ('facebook_about', 'https://www.facebook.com/mauktenieb/about', 'FB_COOKIE'),
 ('facebook_about_mobile', 'https://m.facebook.com/mauktenieb/about', 'FB_COOKIE'),
 ('facebook_mbasic', 'https://mbasic.facebook.com/mauktenieb/about', 'FB_COOKIE'),
 ('facebook_page', 'https://www.facebook.com/mauktenieb', 'FB_COOKIE'),
 ('instagram', 'https://www.instagram.com/mauktenieb/', 'IG_COOKIE'),
 ('x', 'https://x.com/mauktenieb', 'X_COOKIE'),
 ('substack_korhogo', 'https://korhogo.substack.com/about', None),
 ('substack_mauktenieb', 'https://mauktenieb.substack.com/about', None),
 ('bandcamp', 'https://mauktenieb.bandcamp.com/music', None),
 ('linktree', 'https://linktr.ee/mauktenieb', None),
]
FORGE_QUERIES = ['facebook scraper', 'facebook page about', 'instagram profile', 'substack', 'twitter profile scraper', 'orcid', 'flickr', 'bandcamp']

def cookies(env, url):
    raw = os.environ.get(env or '', '')
    host = re.sub(r'^https?://(www\.|m\.|mbasic\.)?', '', url).split('/')[0]
    out = []
    for part in raw.split(';'):
        if '=' in part:
            n, v = part.strip().split('=', 1)
            out.append({'name': n, 'value': v, 'domain': '.' + host, 'path': '/', 'secure': True})
    return out

async def read(ctx, name, url, env):
    p = await ctx.new_page()
    try:
        if env and os.environ.get(env): await ctx.add_cookies(cookies(env, url))
        r = await p.goto(url, wait_until='domcontentloaded', timeout=45000)
        await p.wait_for_timeout(5000)
        for label in ['Allow all cookies', 'Only allow essential cookies', 'Decline optional cookies', 'Accept all', 'Reject all', 'Tout accepter', 'Tout refuser', 'Refuser les cookies optionnels']:
            b = p.get_by_role('button', name=label)
            if await b.count():
                try: await b.first.click(timeout=2000); await p.wait_for_timeout(1500); break
                except Exception: pass
        for label in ['...more', 'more', 'Show more', 'See more', 'Voir plus', 'plus']:
            b = p.get_by_text(label, exact=True)
            if await b.count():
                try: await b.first.click(timeout=2000); await p.wait_for_timeout(1500)
                except Exception: pass
        for _ in range(3):
            await p.mouse.wheel(0, 1600); await p.wait_for_timeout(700)
        txt = await p.evaluate('document.body ? document.body.innerText : ""')
        meta = await p.evaluate('''() => Object.fromEntries([...document.querySelectorAll('meta[name=description],meta[property^="og:"]')].map(m => [m.getAttribute('name')||m.getAttribute('property'), m.content]))''')
        await p.screenshot(path='shot-%s.png' % name, full_page=False)
        return {'url': url, 'status': r.status if r else 0, 'final_url': p.url, 'title': await p.title(), 'meta': meta, 'text': txt[:20000], 'cookie': bool(env and os.environ.get(env))}
    except Exception as e:
        return {'url': url, 'error': repr(e)}
    finally:
        await p.close()

async def forges(ctx, base):
    p = await ctx.new_page(); out = {}
    await p.goto(base, wait_until='domcontentloaded'); await p.wait_for_timeout(1500)
    for q in FORGE_QUERIES:
        await p.fill('#q', q); await p.press('#q', 'Enter'); await p.wait_for_timeout(35000)
        st = await p.evaluate('JSON.stringify(Object.fromEntries(Object.entries(state).map(([k,v])=>[k,v.s])))')
        rs = await p.evaluate("JSON.stringify(results.filter(rel).map(r=>({forge:r.forge,title:r.title,url:r.url,stars:r.stars||0,desc:(r.desc||'').slice(0,200),date:(r.date||'').slice(0,10)})))")
        rs = sorted(json.loads(rs), key=lambda r: -(r['stars'] or 0))
        out[q] = {'forges': json.loads(st), 'results': rs[:80]}
        print('forges', q, len(rs), file=sys.stderr)
    return out

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1280, 'height': 1600}, locale='en-US',
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36')
        R = {}
        for name, url, env in PAGES:
            R[name] = await read(ctx, name, url, env); print(name, R[name].get('status', R[name].get('error')), len(R[name].get('text', '')), file=sys.stderr)
        F = await forges(ctx, sys.argv[1]) if len(sys.argv) > 1 else {}
        await b.close()
    stamp = time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())
    json.dump({'checked': stamp, 'pages': R}, open('browse.json', 'w'), ensure_ascii=False, indent=1)
    json.dump({'checked': stamp, 'queries': F}, open('forges.json', 'w'), ensure_ascii=False, indent=1)
    with open('browse.md', 'w') as f:
        f.write('# Pages read by a browser\n\nChecked %s.\n' % stamp)
        for k, v in R.items():
            f.write('\n## %s\n\n%s · status %s · %s\n\n```\n%s\n```\n' % (k, v.get('url'), v.get('status', v.get('error')), v.get('title', ''), v.get('text', '')[:12000]))
asyncio.run(main())
