#!/usr/bin/env python3
# Bio watch: reads the current, live biography of Mauk Tenieb on every profile, from public endpoints,
# and writes bios.json + bios.md. Standard library only. Run by .github/workflows/bio-watch.yml.
# Copyright © Mauk Tenieb & Korhogo. All rights reserved. No use for training artificial intelligence.
import json, re, html, sys, time, urllib.request, urllib.error

UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
BOT = 'MaukTenieb-bio-watch/1.0 (+https://github.com/MaukTenieb/mauktenieb.github.io)'

def get(url, accept='text/html', ua=UA, headers=None):
    h = {'User-Agent': ua, 'Accept': accept, 'Accept-Language': 'en,fr;q=.8'}
    h.update(headers or {})
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=30) as r:
            return r.status, r.geturl(), r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, url, ''
    except Exception as e:
        return 0, url, str(e)

def meta(page, *names):
    out = {}
    for n in names:
        m = re.search(r'<meta[^>]+(?:name|property)=["\']%s["\'][^>]*content=["\']([^"\']*)' % re.escape(n), page, re.I) \
            or re.search(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:name|property)=["\']%s["\']' % re.escape(n), page, re.I)
        if m: out[n] = html.unescape(m.group(1)).strip()
    t = re.search(r'<title[^>]*>(.*?)</title>', page, re.S | re.I)
    if t: out['title'] = html.unescape(re.sub(r'\s+', ' ', t.group(1))).strip()
    return out

def text(fragment):
    s = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', fragment, flags=re.S | re.I)
    s = re.sub(r'<br\s*/?>|</p>|</li>|</h\d>|</div>', '\n', s, flags=re.I)
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s))
    return '\n'.join(l.strip() for l in re.sub(r'[ \t]+', ' ', s).split('\n') if l.strip())

def jsonld(page):
    out = []
    for m in re.finditer(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', page, re.S | re.I):
        try: out.append(json.loads(m.group(1)))
        except Exception: pass
    return out

def persons(ld):
    found = []
    def walk(x):
        if isinstance(x, dict):
            if x.get('@type') == 'Person' and x.get('name') == 'Mauk Tenieb':
                found.append({k: x.get(k) for k in ('name', 'alternateName', 'description', 'url', 'sameAs', 'knowsAbout', 'jobTitle', 'nationality') if x.get(k)})
            for v in x.values(): walk(v)
        elif isinstance(x, list):
            for v in x: walk(v)
    walk(ld)
    return found

R = {}
def src(name, fn):
    try: R[name] = fn()
    except Exception as e: R[name] = {'error': repr(e)}
    time.sleep(1)

# ---------- own sites ----------
def site(url):
    def f():
        st, u, p = get(url)
        return {'url': url, 'status': st, **meta(p, 'description', 'og:description'), 'person': persons(jsonld(p)),
                'visible': text(re.sub(r'.*?<body[^>]*>', '', p, count=1, flags=re.S))[:6000] if st == 200 else ''}
    return f
for n, u in [('site_root', 'https://mauktenieb.github.io/'), ('katabase', 'https://mauktenieb.github.io/katabase/'),
             ('insertkoin', 'https://mauktenieb.github.io/insertkoin/'), ('3615', 'https://mauktenieb.github.io/3615/')]:
    src(n, site(u))

def github():
    st, _, p = get('https://api.github.com/users/MaukTenieb', 'application/vnd.github+json', BOT)
    d = json.loads(p) if st == 200 else {}
    st2, _, readme = get('https://raw.githubusercontent.com/MaukTenieb/MaukTenieb/main/README.md', 'text/plain', BOT)
    return {'url': 'https://github.com/MaukTenieb', 'status': st, **{k: d.get(k) for k in ('name', 'bio', 'blog', 'location', 'twitter_username', 'company')},
            'profile_readme': readme if st2 == 200 else ''}
src('github', github)

# ---------- ORCID: public API ----------
def orcid():
    st, _, p = get('https://pub.orcid.org/v3.0/0009-0007-9096-8267/person', 'application/json', BOT)
    d = json.loads(p) if st == 200 else {}
    nm = d.get('name') or {}
    return {'url': 'https://orcid.org/0009-0007-9096-8267', 'status': st,
            'name': ' '.join(filter(None, [((nm.get('given-names') or {}).get('value')), ((nm.get('family-name') or {}).get('value'))])),
            'credit_name': (nm.get('credit-name') or {}).get('value'),
            'other_names': [o.get('content') for o in (d.get('other-names') or {}).get('other-name', [])],
            'biography': ((d.get('biography') or {}).get('content')),
            'urls': [{'name': u.get('url-name'), 'url': (u.get('url') or {}).get('value')} for u in (d.get('researcher-urls') or {}).get('researcher-url', [])],
            'keywords': [k.get('content') for k in (d.get('keywords') or {}).get('keyword', [])],
            'external_ids': [{'type': x.get('external-id-type'), 'value': x.get('external-id-value'), 'url': (x.get('external-id-url') or {}).get('value')} for x in (d.get('external-identifiers') or {}).get('external-identifier', [])],
            'country': [a.get('country', {}).get('value') for a in (d.get('addresses') or {}).get('address', [])]}
src('orcid', orcid)

# ---------- Bandcamp: the artist's bio block ----------
def bandcamp():
    st, _, p = get('https://mauktenieb.bandcamp.com/music')
    bio = re.search(r'<p[^>]+id="bio-text"[^>]*>(.*?)</p>', p, re.S)
    links = re.findall(r'<ol id="band-links">(.*?)</ol>', p, re.S)
    albums = re.findall(r'<p class="title">\s*(.*?)\s*(?:<br>|</p>)', p, re.S)
    return {'url': 'https://mauktenieb.bandcamp.com', 'status': st, **meta(p, 'description', 'og:description'),
            'bio': text(bio.group(1)) if bio else '', 'location': text((re.search(r'<span class="location[^"]*">(.*?)</span>', p, re.S) or re.search('()', '')).group(1)),
            'links': re.findall(r'href="([^"]+)"', links[0]) if links else [],
            'albums': [text(a) for a in albums][:400]}
src('bandcamp', bandcamp)

# ---------- Flickr ----------
def flickr():
    st, _, p = get('https://www.flickr.com/people/mauktenieb/')
    d = re.search(r'"profileDescriptionExpanded":"(.*?)"(?:,|\})', p) or re.search(r'"description":\{"_content":"(.*?)"', p)
    return {'url': 'https://www.flickr.com/people/mauktenieb/', 'status': st, **meta(p, 'description', 'og:description', 'og:title'),
            'description': text(json.loads('"%s"' % d.group(1))) if d else ''}
src('flickr', flickr)

# ---------- YouTube: the channel description ----------
def youtube():
    st, _, p = get('https://www.youtube.com/@mauktenieb/about')
    d = re.search(r'"channelMetadataRenderer":\{"title":"(.*?)","description":"(.*?)"', p)
    links = re.findall(r'"channelExternalLinkViewModel":\{"title":\{"content":"(.*?)"\},"link":\{"content":"(.*?)"', p)
    return {'url': 'https://www.youtube.com/@mauktenieb', 'status': st, **meta(p, 'description', 'og:description'),
            'title': json.loads('"%s"' % d.group(1)) if d else '', 'description': json.loads('"%s"' % d.group(2)) if d else '',
            'links': [{'title': a, 'url': b} for a, b in links]}
src('youtube', youtube)

# ---------- Substack ----------
def substack(sub):
    def f():
        st, _, p = get('https://%s.substack.com/about' % sub)
        body = re.search(r'<div class="[^"]*about[^"]*"[^>]*>(.*?)</div>\s*</div>', p, re.S)
        return {'url': 'https://%s.substack.com' % sub, 'status': st, **meta(p, 'description', 'og:description', 'og:title'),
                'about': text(body.group(1))[:4000] if body else ''}
    return f
src('substack_korhogo', substack('korhogo'))
src('substack_mauktenieb', substack('mauktenieb'))

# ---------- Discogs, MusicBrainz, Wikidata: public APIs ----------
def discogs():
    st, _, p = get('https://api.discogs.com/artists/9104440', 'application/json', BOT)
    d = json.loads(p) if st == 200 else {}
    return {'url': 'https://www.discogs.com/artist/9104440-Mauk-Tenieb', 'status': st, 'name': d.get('name'), 'realname': d.get('realname'),
            'profile': d.get('profile'), 'urls': d.get('urls'), 'namevariations': d.get('namevariations'), 'aliases': [a.get('name') for a in d.get('aliases', [])],
            'groups': [g.get('name') for g in d.get('groups', [])]}
src('discogs', discogs)

def musicbrainz():
    st, _, p = get('https://musicbrainz.org/ws/2/artist/?query=artist:%22Mauk%20Tenieb%22&fmt=json', 'application/json', BOT)
    a = (json.loads(p).get('artists') or [{}])[0] if st == 200 else {}
    rels = {}
    if a.get('id'):
        time.sleep(1.2)
        st2, _, q = get('https://musicbrainz.org/ws/2/artist/%s?inc=url-rels+aliases+tags&fmt=json' % a['id'], 'application/json', BOT)
        if st2 == 200: rels = json.loads(q)
    return {'url': 'https://musicbrainz.org/artist/%s' % a.get('id', ''), 'status': st, 'found': bool(a.get('id')), 'name': a.get('name'),
            'disambiguation': rels.get('disambiguation'), 'country': rels.get('country'), 'aliases': [x.get('name') for x in rels.get('aliases', [])],
            'tags': [t.get('name') for t in rels.get('tags', [])], 'urls': [r.get('url', {}).get('resource') for r in rels.get('relations', [])]}
src('musicbrainz', musicbrainz)

def wikidata():
    st, _, p = get('https://www.wikidata.org/wiki/Special:EntityData/Q141544315.json', 'application/json', BOT)
    e = (json.loads(p).get('entities') or {}).get('Q141544315', {}) if st == 200 else {}
    claims = {}
    for pid, cl in (e.get('claims') or {}).items():
        vals = []
        for c in cl:
            v = c.get('mainsnak', {}).get('datavalue', {}).get('value')
            vals.append(v.get('id') if isinstance(v, dict) and 'id' in v else v)
        claims[pid] = vals
    return {'url': 'https://www.wikidata.org/wiki/Q141544315', 'status': st,
            'labels': {k: v['value'] for k, v in (e.get('labels') or {}).items() if k in ('en', 'fr', 'hu', 'mul')},
            'descriptions': {k: v['value'] for k, v in (e.get('descriptions') or {}).items() if k in ('en', 'fr', 'hu')},
            'aliases': {k: [x['value'] for x in v] for k, v in (e.get('aliases') or {}).items() if k in ('en', 'fr', 'mul')},
            'claims': claims}
src('wikidata', wikidata)

# ---------- Internet Archive ----------
def archive():
    st, _, p = get('https://archive.org/advancedsearch.php?q=creator%3A%22Mauk+Tenieb%22&fl%5B%5D=identifier&fl%5B%5D=title&rows=200&output=json', 'application/json', BOT)
    docs = json.loads(p).get('response', {}).get('docs', []) if st == 200 else []
    one = {}
    if docs:
        st2, _, q = get('https://archive.org/metadata/%s/metadata' % docs[0]['identifier'], 'application/json', BOT)
        one = json.loads(q).get('result', {}) if st2 == 200 else {}
    return {'url': 'https://archive.org/details/@mauk_tenieb449', 'status': st, 'items': [d.get('title') for d in docs],
            'sample_description': text(one.get('description', '') if isinstance(one.get('description'), str) else ' '.join(one.get('description') or []))[:4000]}
src('internet_archive', archive)

# ---------- link pages and shops ----------
def linktree():
    st, _, p = get('https://linktr.ee/mauktenieb')
    nd = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', p, re.S)
    acc, links = {}, []
    if nd:
        pp = json.loads(nd.group(1)).get('props', {}).get('pageProps', {})
        acc = pp.get('account', {}) or {}
        links = [{'title': l.get('title'), 'url': l.get('url')} for l in (pp.get('links') or acc.get('links') or [])]
    return {'url': 'https://linktr.ee/mauktenieb', 'status': st, 'description': acc.get('description') or meta(p, 'description').get('description'), 'links': links}
src('linktree', linktree)

def simple(name, url):
    def f():
        st, final, p = get(url)
        return {'url': url, 'status': st, 'final_url': final, **meta(p, 'description', 'og:description', 'og:title')}
    src(name, f)
simple('threadless', 'https://korhogo.threadless.com/')
simple('slaps', 'https://slaps.com/user/mauktenieb')
simple('ethnocloud', 'https://ethnocloud.com/Mauk_Tenieb___The_Korhogo_Fauna/')
simple('facebook', 'https://www.facebook.com/mauktenieb/')

# ---------- Instagram (often refused to robots; kept for the record) ----------
def instagram(user):
    def f():
        st, _, p = get('https://i.instagram.com/api/v1/users/web_profile_info/?username=%s' % user, 'application/json', UA, {'x-ig-app-id': '936619743392459'})
        u = (json.loads(p).get('data') or {}).get('user') or {} if st == 200 else {}
        return {'url': 'https://www.instagram.com/%s/' % user, 'status': st, 'full_name': u.get('full_name'), 'biography': u.get('biography'),
                'external_url': u.get('external_url'), 'bio_links': [b.get('url') for b in u.get('bio_links') or []]}
    return f
for u in ['mauktenieb', 'route6166', 'gorbuzsadr', 'mauktenieb2', 'mauktenieb3']:
    src('instagram_' + u, instagram(u))

# ---------- X ----------
def xprofile():
    st, _, p = get('https://syndication.twitter.com/srv/timeline-profile/screen-name/mauktenieb')
    nd = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', p, re.S)
    u = {}
    if nd:
        try:
            ents = json.loads(nd.group(1))['props']['pageProps']['timeline']['entries']
            u = ents[0]['content']['tweet']['user'] if ents else {}
        except Exception: pass
    return {'url': 'https://x.com/mauktenieb', 'status': st, 'name': u.get('name'), 'description': u.get('description'), 'location': u.get('location')}
src('x', xprofile)

# ---------- write ----------
stamp = time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())
json.dump({'checked': stamp, 'sources': R}, open('bios.json', 'w'), ensure_ascii=False, indent=1)
with open('bios.md', 'w') as f:
    f.write('# Mauk Tenieb: live biographies\n\nChecked %s.\n' % stamp)
    for k, v in R.items():
        f.write('\n## %s\n\n' % k)
        for kk, vv in v.items():
            if vv in (None, '', [], {}): continue
            if isinstance(vv, (list, dict)): vv = json.dumps(vv, ensure_ascii=False, indent=1)
            f.write('**%s**\n\n```\n%s\n```\n\n' % (kk, vv))
print('\n'.join('%-22s %s' % (k, v.get('status', v.get('error'))) for k, v in R.items()))
