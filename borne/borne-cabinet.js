/* Borne Insert Koin (site d'essai) : range la page d'Insert Koin dans une borne d'arcade, d'après le plan d'une vraie borne.
   De haut en bas : le toit (une plante qui suit le calendrier républicain, la caméra Kapture), le fronton (l'enseigne entre
   deux haut-parleurs, le juke-box dans celui de gauche), le cadre de l'écran (Burrows au-dessus ; Mauk Tenieb et Lore dessous),
   l'écran (le programme, les Koins, la date), le panneau (la manette en miroir, quatre touches, Baku Boom ; BC TL IG),
   la porte (la fente, le son, la langue). Rien n'est réécrit : les éléments de la page changent de place, leurs fonctions restent. */
(function(){
  var $=function(id){return document.getElementById(id);};
  var root=document.documentElement;root.classList.add('borne');root.dataset.habit='repos';root.dataset.mode='arcade';
  var wrap=document.querySelector('.wrap'),bar=$('bar'),home=$('home');if(!wrap||!bar||!home)return;
  var IK=function(){return window.__ik||{};};
  var lang=function(){try{return IK().lang?IK().lang():'en';}catch(e){return 'en';}};
  var el=function(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};

  /* ---------- le toit : la plante et la caméra ---------- */
  var roof=el('div','b-roof'),pot=el('div','b-pot'),plant=el('div','b-plant'),care=el('div','b-care'),cam=el('div','b-cam');
  pot.tabIndex=0;pot.setAttribute('role','group');pot.setAttribute('aria-label','Plante');
  [['water','💧','EAU'],['sun','☀','SOLEIL'],['cut','✂','TAILLE']].forEach(function(a){var b=el('button',null,'<i>'+a[1]+'</i><span>'+a[2]+'</span>');b.type='button';b.dataset.care=a[0];care.appendChild(b);});
  pot.appendChild(care);pot.appendChild(plant);roof.appendChild(pot);if($('kapture'))cam.appendChild($('kapture'));roof.appendChild(cam);
  wrap.parentNode.insertBefore(roof,wrap);

  /* ---------- le fronton : l'enseigne, et l'habit en petit dessous ---------- */
  var brand=$('brand'),hab=el('span','b-habit');hab.setAttribute('aria-hidden','true');if(brand)brand.appendChild(hab);

  /* ---------- le cadre et l'écran ---------- */
  var bezel=el('div','b-bezel'),scr=el('div','b-screen'),glass=el('div','b-glass');glass.id='b-glass';scr.appendChild(glass);
  var att=el('div','b-attract'),skf=document.createElement('iframe');skf.title='SkopoRhogo';skf.setAttribute('tabindex','-1');att.appendChild(skf);glass.appendChild(att);
  var date=el('div','b-date','<b></b>');glass.appendChild(date);
  
  ['select','game','calque'].forEach(function(id){if($(id))glass.appendChild($(id));});
  var land=el('button','b-sticker b-land','<span>BURROWS</span>');land.type='button';land.setAttribute('aria-label','Burrows');
  var foot=el('div','b-bezelfoot');
  var badge=el('button','b-sticker b-badge','<b>MAUK TENIEB</b>');badge.type='button';badge.setAttribute('aria-label','Mauk Tenieb');
  var menu=home.querySelector('.menu'),loreHref=((menu&&menu.querySelector('a[href*="substack"]'))||{}).href||'https://mauktenieb.substack.com';
  var lore=el('a','b-sticker b-lore','LORE');lore.href=loreHref;lore.target='_blank';lore.rel='noopener';
  if($('koins')){$('koins').classList.add('b-credit');foot.appendChild($('koins'));}lore.classList.add('b-stuck');
  bezel.appendChild(land);bezel.appendChild(scr);bezel.appendChild(foot);bezel.appendChild(lore);
  home.insertBefore(bezel,home.firstChild);

  /* ---------- le panneau ---------- */
  var panel=el('div','b-panel'),cabs=home.querySelector('.cabinets');home.insertBefore(panel,bezel.nextSibling);
  var row1=el('div','b-row1'),row2=el('div','b-row2'),sub=el('div','b-sub'),store=el('div','b-store');sub.hidden=true;store.hidden=true;
  var stick=el('div','b-stick','<i></i>');stick.setAttribute('aria-hidden','true');
  var keys=el('div','b-keys');if(cabs)keys.appendChild(cabs);keys.appendChild(sub);
  var bb=el('button','b-boom','<i></i>');bb.type='button';bb.setAttribute('aria-label','Baku Boom');foot.appendChild(bb);
  row1.appendChild(keys);
  if(menu)row2.appendChild(menu);
  /* console : les boutons BC TL IG en rangée de départ, au-dessus ; la manette au milieu, deux touches de chaque côté ; la plaque du fabricant sur le bord avant */
  panel.appendChild(row2);panel.appendChild(row1);var plate=el('div','b-plate');plate.appendChild(badge);panel.appendChild(plate);panel.appendChild(store);

  function cabOf(k){var b=document.querySelector('.cabinets [data-go="'+k+'"],.b-store [data-go="'+k+'"]');return b?b.closest('.cab'):null;}
  function tile(k,title,th,nc){var c=cabOf(k);if(c)return c;c=el('div','cab');c.style.cssText='--th:url('+th+');--nc:'+nc;
    c.innerHTML='<button type="button" class="hit" data-go="'+k+'"><b></b></button>';c.querySelector('b').textContent=title;
    c.querySelector('button').addEventListener('click',function(){IK().go&&IK().go(k);});return c;}
  /* KorhoGame : les grands jeux d'un côté ; de l'autre, Katabatik : le dé choisit parmi les mini-jeux (⚀ à ⚃ ; ⚄ et ⚅ : le hasard) */
  var KATA=['c4','bb','hang','mm','fi'],DICE='⚀⚁⚂⚃⚄⚅';
  var MINIS=[['c4','KONNECT4','borne-mini-c4.jpg','#f48fb1',0],['hang','AKASZTÓFA','borne-mini-hang.jpg','#f48fb1',2],['mm','MASTERMIND','borne-mini-mm.jpg','#f48fb1',3],['erratic','ERRATIK','thumb-erratic.jpg','#42a5f5',5]];
  function kata(g){var d=document.querySelector('.cab.dice b');if(d)d.dataset.d=DICE[KATA.indexOf(g)];IK().go&&IK().go('katabatik');}
  function play(g){if(g==='erratic')IK().go&&IK().go('erratic');else kata(g);}
  function ktile(g,title,th,nc,face){var c=el('div','cab b-kata');c.style.cssText='--th:url('+th+');--nc:'+nc;
    c.innerHTML='<button type="button" class="hit" data-kata="'+g+'"><b></b>'+(face!=null?'<i class="b-face">'+DICE[face]+'</i>':'')+'</button>';c.querySelector('b').textContent=title;
    c.querySelector('button').addEventListener('click',function(){play(g);});return c;}
  var GROUPS={korhogame:{t:'KORHOGAME',th:'thumb-puck.jpg',nc:'#ffa726',items:[['puck','KORONG!','thumb-puck.jpg','#ffa726'],['chess','FAUNA CHESS','thumb-chess.jpg','#ab47bc'],
      ['faunarratics','FAUNARRATIK','thumb-faunarratics.jpg','#4fc3f7']],extra:[['fi','FAUNINVADERS','borne-big-fi.jpg','#c9a84c',3],['bb','SAMPLER','borne-big-bb.jpg','#ff7043',2]]},
    fauneye:{t:'FAUNEYE',th:'borne-fauneye.jpg',nc:'#e2c27a',items:[['fauneye','LISEUSE','borne-fauneye.jpg','#e2c27a'],['vhs','VHS','thumb-vhs.jpg','#b9d84a'],['photo','FOTOFAUNA','thumb-photo.jpg','#ff5a5a']]},
    surf:{t:'SURFAUNA',th:'thumb-repo.jpg',nc:'#7fe0ff',items:[['repo','REPORHOGO','thumb-repo.jpg','#b9d84a'],['tor','FAUNATOR','thumb-repo.jpg','#9e9e9e']]}};
  function group(g){var G=GROUPS[g],c=el('div','cab b-group');c.dataset.grp='g-'+g;c.style.cssText='--th:url('+G.th+');--nc:'+G.nc;
    c.innerHTML='<button type="button" class="hit" aria-expanded="false"><b></b></button>';c.querySelector('b').textContent=G.t;
    c.querySelector('button').addEventListener('click',function(){unfold(g);});return c;}
  if(cabs){
    /* les programmes des groupes vont en réserve ; les cabinets sans place y restent branchés (dé, chambre, Mask de Bio) */
    Object.keys(GROUPS).forEach(function(g){GROUPS[g].els=GROUPS[g].items.map(function(it){var c=tile(it[0],it[1],it[2],it[3]);store.appendChild(c);return c;});});
    var KG=GROUPS.korhogame;(KG.extra||[]).forEach(function(it){var c=ktile(it[0],it[1],it[2],it[3]);KG.els.push(c);store.appendChild(c);});
    var ORD=['chess','fi','puck','faunarratics','bb'],keyOf=function(c){var b=c.querySelector('[data-go],[data-kata]');return b.dataset.go||b.dataset.kata;};
    KG.els.sort(function(a,b){return ORD.indexOf(keyOf(a))-ORD.indexOf(keyOf(b));});
    /* le côté des mini-jeux : le dé, puis chaque mini-jeu sous sa face */
    var DIMG=['de-a.webp','de-b.webp','de-c.webp'],die=el('button','b-die','<img class="b-dimg" alt="" src="'+DIMG[0]+'"><span>'+DICE[0]+'</span><b>KATABATIK</b>');die.type='button';die.setAttribute('aria-label','Katabatik');
    KG.minis=[die].concat(MINIS.map(function(m){return ktile(m[0],m[1],m[2],m[3],m[4]);}));KG.minis.forEach(function(c){store.appendChild(c);});
    var rolling=false;die.onclick=function(){if(rolling)return;rolling=true;var n=0,N=9,pick=MINIS[Math.floor(Math.random()*MINIS.length)],f=pick[4],sp=die.querySelector('span');
      var iv=setInterval(function(){var x=++n>=N?f:Math.floor(Math.random()*6);var di=die.querySelector('.b-dimg');di.src=DIMG[n%3];di.style.transform='rotate('+(n>=N?0:Math.round((Math.random()-.5)*120))+'deg)';sp.textContent=DICE[x];sp.style.setProperty('--r',(n>=N?0:(Math.random()-.5)*90)+'deg');
        try{IK().tone&&IK().tone(300+Math.random()*500,.03,'square',.02);}catch(e){}
        if(n>=N){clearInterval(iv);var g=pick[0];
          [].forEach.call(subG.querySelectorAll('[data-kata]'),function(b){b.closest('.cab').classList.toggle('lit',b.dataset.kata===g);});
          setTimeout(function(){rolling=false;play(g);},650);}},70);};
    var sk=cabOf('skopo');if(sk)sk.remove();
    var mt=tile('terminal','3615','thumb-3615.jpg','#66bb6a');
    [].slice.call(cabs.children).forEach(function(c){if(c.classList.contains('cab'))store.appendChild(c);});
    [group('korhogame'),group('fauneye'),stick,mt,group('surf')].forEach(function(c){cabs.appendChild(c);});
  }
  /* trois petits boutons : BC, TL, IG */
  if(menu){[].slice.call(menu.children).forEach(function(x){if(!/threadless|instagram/.test(x.getAttribute('href')||''))x.remove();});
    [].slice.call(menu.children).forEach(function(x){x.textContent=/threadless/.test(x.getAttribute('href')||'')?'TL':'IG';});
    var bc=el('a',null,'BC');bc.href='https://mauktenieb.bandcamp.com';bc.target='_blank';bc.rel='noopener';bc.style.setProperty('--mc','#1da0c3');menu.insertBefore(bc,menu.firstChild);}
  var subT=el('div','b-subbar','<b></b>'),subG=el('div','b-subgrid');sub.appendChild(subT);sub.appendChild(subG);
  var openG=null;
  function unfold(g){var G=GROUPS[g];openG=g;subG.innerHTML='';subT.querySelector('b').textContent=G.t;
    if(G.minis){var big=el('div','b-side b-big'),mini=el('div','b-side b-minis');G.els.forEach(function(c){big.appendChild(c);});G.minis.forEach(function(c){mini.appendChild(c);});
      subG.appendChild(big);subG.appendChild(mini);subG.classList.add('b-split');}
    else{subG.classList.remove('b-split');G.els.forEach(function(c){subG.appendChild(c);});}
    sub.hidden=false;if(cabs)cabs.hidden=true;panel.classList.remove('b-unfold');void panel.offsetWidth;panel.classList.add('b-unfold');}
  function fold(){if(!openG)return;GROUPS[openG].els.concat(GROUPS[openG].minis||[]).forEach(function(c){store.appendChild(c);});[].forEach.call(subG.querySelectorAll('.lit'),function(c){c.classList.remove('lit');});openG=null;sub.hidden=true;if(cabs)cabs.hidden=false;}

  /* ---------- la porte : la fente, le son, la langue ---------- */
  var door=el('div','b-door'),slot=el('button','b-slot','<b><em>INSERT</em> <u>KOIN</u></b><i></i>');slot.type='button';slot.setAttribute('aria-label','Insert Koin · 3615 KOINS');
  var knobs=el('div','b-knobs');door.appendChild(slot);door.appendChild(knobs);
  /* le bouton SKIN : le meuble en bois, en métal, ou en jeu électromécanique des années 1960 */
  var SKINS=['bois','metal','1960'],skin=null;try{skin=localStorage.getItem('borne.skin');}catch(e){}
  /* première visite : un skin au hasard ; ensuite, celui que le visiteur a choisi */
  if(SKINS.indexOf(skin)<0)skin=SKINS[Math.floor(Math.random()*SKINS.length)];root.dataset.skin=skin;
  /* variantes du skin 1960, tirées à chaque visite et à chaque retour sur ce skin : enseigne, cadre, panneau, porte */
  var V1960={fronton:['skin-1960-fronton-a.webp','skin-1960-fronton-b.webp'],
    cadre:[['skin-1960-cadre-a.webp','223 172 221 171'],['skin-1960-cadre-b.webp','213 202 137 177'],['skin-1960-cadre-c.webp','227 175 226 182']],
    panneau:['skin-1960-panneau-a.webp','skin-1960-panneau-b.webp'],
    porte:[['skin-1960-porte-a.webp','1024/572','31%','59%','38%','12%'],['skin-1960-porte-b.webp','1024/434','20%','76%','34%','14%']]};
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function variants(){var s=root.style,c=pick(V1960.cadre),p=pick(V1960.porte);s.setProperty('--v-fronton','url('+pick(V1960.fronton)+')');s.setProperty('--v-cadre','url('+c[0]+')');s.setProperty('--v-cs',c[1]);
    s.setProperty('--v-panneau','url('+pick(V1960.panneau)+')');s.setProperty('--v-porte','url('+p[0]+')');s.setProperty('--v-pr',p[1]);s.setProperty('--v-sx',p[2]);s.setProperty('--v-sy',p[3]);s.setProperty('--v-sw',p[4]);s.setProperty('--v-sh',p[5]);}
  variants();
  /* pièces tirées au hasard à chaque visite : l'autocollant Lore, la caméra, la manette */
  (function(){var s=root.style;s.setProperty('--i-lore','url('+pick(['sticker-lore-a.webp','sticker-lore-b.webp'])+')');
    s.setProperty('--i-cam','url('+pick(['camera-a.webp','camera-b.webp'])+')');s.setProperty('--i-stick','url('+pick(['manette-a.webp','manette-b.webp'])+')');})();
  var sw=el('div','b-knobw'),sb=el('button','b-knob b-skin');sb.type='button';sb.setAttribute('aria-label','Skin');sb.dataset.pos=SKINS.indexOf(skin);
  sw.appendChild(sb);sw.appendChild(el('span','b-knoblab','SKIN'));knobs.appendChild(sw);
  sb.onclick=function(){skin=SKINS[(SKINS.indexOf(skin)+1)%SKINS.length];sb.dataset.pos=SKINS.indexOf(skin);try{localStorage.setItem('borne.skin',skin);}catch(e){}
    try{IK().tone&&IK().tone(220,.05,'square',.03);IK().tone&&IK().tone(330,.05,'square',.03,0,.06);}catch(e){}
    scr.classList.remove('b-morph');void scr.offsetWidth;scr.classList.add('b-morph');setTimeout(function(){if(skin==='1960')variants();root.dataset.skin=skin;},250);};
  [['snd','FX'],['lang','FR · EN']].forEach(function(p){var b=$(p[0]);if(!b)return;var w=el('div','b-knobw');b.classList.add('b-knob');b.setAttribute('aria-label',p[1]);w.appendChild(b);w.appendChild(el('span','b-knoblab',p[1]));knobs.appendChild(w);
    var sync=function(){var t=(b.textContent||'').toUpperCase();b.dataset.on=(p[0]==='snd'?/ON/.test(t):/FR/.test(t))?'1':'0';};sync();
    new MutationObserver(sync).observe(b,{childList:true,characterData:true,subtree:true});});
  if($('kal'))door.appendChild($('kal'));
  wrap.appendChild(door);
  /* le copyright, petit, tout en bas du meuble */
  var cp=document.querySelector('#home .copy');if(cp){cp.classList.add('b-copy');wrap.appendChild(cp);}
  var SL=['KOIN','KINOS',"O'SKIN"],si=0,kw=slot.querySelector('u');
  setInterval(function(){if(slot.classList.contains('b-wait'))return;si=(si+1)%SL.length;kw.classList.remove('flip');void kw.offsetWidth;kw.textContent=SL[si];kw.classList.add('flip');},4200);
  /* zéro Koin : la fente affiche le décompte de la Koin gratuite */
  setInterval(function(){var kn=$('kn'),m=kn&&/·\s*(\d+)\s*s/.exec(kn.textContent||''),w=slot.classList.contains('b-wait');
    if(m){slot.classList.add('b-wait');kw.textContent='+1 · '+m[1]+'s';}else if(w){slot.classList.remove('b-wait');kw.textContent=SL[si];}},500);
  slot.onclick=function(){var c=el('span','b-coin');slot.appendChild(c);
    try{IK().tone&&IK().tone(1320,.06,'square',.03);IK().tone&&IK().tone(660,.12,'triangle',.03,0,.25);}catch(e){}
    setTimeout(function(){c.remove();IK().go&&IK().go('kal');},560);};

  /* ---------- l'habit suit le programme ; les appareils transforment le meuble ---------- */
  var HABIT={terminal:'minitel',kal:'minitel',vhs:'vhs',photo:'photo',kapture:'photo',fauneye:'fauneye',puck:'korong',room:'korong'};
  var DEVICE={terminal:1,kal:1,vhs:1,photo:1,kapture:1};
  var LABEL={minitel:'3615',vhs:'VHS',photo:'FOTOFAUNA',fauneye:'FAUNEYE',korong:'KORONG!',arcade:'',repos:''};
  var morphT=0;
  function relayout(){try{window.dispatchEvent(new Event('resize'));}catch(e){}try{var f=$('cf');if(f&&f.contentWindow)f.contentWindow.dispatchEvent(new Event('resize'));}catch(e){}}
  function dress(h,device){var mode=device?'device':'arcade',change=root.dataset.habit!==h||root.dataset.mode!==mode;
    if(change&&!matchMedia('(prefers-reduced-motion:reduce)').matches){scr.classList.remove('b-morph');void scr.offsetWidth;scr.classList.add('b-morph');
      clearTimeout(morphT);morphT=setTimeout(function(){scr.classList.remove('b-morph');},1000);}
    root.dataset.habit=h;root.dataset.mode=mode;if(h==='repos')delete root.dataset.prog;else{root.dataset.prog='1';[60,700].forEach(function(t){setTimeout(function(){scrollTo({top:0,behavior:t>100?'smooth':'auto'});},t);});}hab.classList.remove('tilt');hab.textContent=LABEL[h]||'';
    [120,500,800,1100].forEach(function(t){setTimeout(relayout,t);});
    if(h==='repos'){wake();camsOff();}else sleep();}
  /* la caméra s'éteint dès que FotoFauna quitte l'écran */
  function camsOff(){[].forEach.call(document.querySelectorAll('iframe'),function(f){try{var w=f.contentWindow;if(w&&typeof w.stopCam==='function')w.stopCam();}catch(e){}});}
  function mark(k){[cabs,subG].forEach(function(r){if(r)r.querySelectorAll('.cab').forEach(function(c){var b=c.querySelector('[data-go]');c.classList.toggle('on-air',!!b&&b.dataset.go===k);});});}
  /* les grands jeux agrandissent l'écran à la hauteur de la fenêtre ; FaunInvaders redresse l'écran à la verticale, comme les bornes de 1978 */
  function bigOf(k){if(k==='katabatik'){var d=document.querySelector('.cab.dice b'),f=d?DICE.indexOf(d.dataset.d):-1;return f===4?'tate':f===1?'wide':'';}
    return {puck:'wide',chess:'wide',faunarratics:'wide'}[k]||'';}
  function setBig(v){if(v)root.dataset.big=v;else delete root.dataset.big;
    setTimeout(relayout,820);}
  window.__borneGo=function(k){setBig(bigOf(k));CUR=k==='katabatik'?(function(){var d=document.querySelector('.cab.dice b'),f=d?DICE.indexOf(d.dataset.d):0;return KATA[f]||'c4';})():k;paintDots();
    if(k==='fauneye'){IK().ac&&IK().ac();dress('fauneye');mark(k);IK().openCalque('borne-fauneye.html','FAUNEYE');return true;}
    if(k==='skopo'){dress('arcade');mark(k);IK().openCalque('skoporhogo-borne.html','SkopoRhogo');return true;}
    if(k==='visit'){full('/katabase/','BURROWS');return true;}
    dress(HABIT[k]||'arcade',!!DEVICE[k]);mark(k);
    /* programme refusé (Koins à zéro) : la borne reprend son habit de repos */
    return false;};
  /* l'écran de la page commande l'habit : de retour à l'accueil (programme refusé, retour), la borne reprend son habit de repos */
  new MutationObserver(function(){var home=document.body.className.indexOf('on-home')>=0;
    if(home&&root.dataset.habit!=='repos'&&!SWAP){dress('repos');mark(null);setBig('');}else if(!home&&root.dataset.habit==='repos')dress('arcade');}).observe(document.body,{attributes:true,attributeFilter:['class']});
  window.__borneHome=function(){if(SWAP)return;CUR=null;paintDots();fold();dress('repos');mark(null);setBig('');scrollTo({top:0,behavior:'smooth'});};
  window.__borneGame=function(k){if(k==='kapture')dress('photo',true);};

  /* ---------- d'un programme à l'autre : un glissé depuis le bord de l'écran, ou Page préc. / Page suiv. ; des points sous l'écran, comme les chaînes d'un téléviseur ----------
     L'ordre suit le panneau. À zéro Koin, un jeu payant se saute : le glissé va au programme suivant. */
  var ORDER=['chess','fi','puck','faunarratics','bb','c4','hang','mm','erratic','fauneye','vhs','photo','terminal','repo','tor'];
  var GRP=[['chess','fi','puck','faunarratics','bb','c4','hang','mm','erratic'],['fauneye','vhs','photo'],['terminal'],['repo','tor']];
  var NAME={chess:'FAUNA CHESS',fi:'FAUNINVADERS',puck:'KORONG!',faunarratics:'FAUNARRATIK',bb:'SAMPLER',c4:'KONNECT4',hang:'AKASZTÓFA',mm:'MASTERMIND',erratic:'ERRATIK',
    fauneye:'LISEUSE',vhs:'VHS',photo:'FOTOFAUNA',terminal:'3615',repo:'REPORHOGO',tor:'FAUNATOR'};
  var CUR=null,SWAP=false;
  function launch(g){if(KATA.indexOf(g)>=0)kata(g);else IK().go&&IK().go(g);}
  var dots=el('div','b-dots');dots.setAttribute('role','tablist');scr.appendChild(dots);
  function paintDots(){dots.innerHTML='';var G=null;GRP.forEach(function(g){if(g.indexOf(CUR)>=0)G=g;});if(!G||G.length<2){dots.hidden=true;return;}dots.hidden=false;
    G.forEach(function(g){var b=el('button','b-dot'+(g===CUR?' on':''));b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(g===CUR));b.setAttribute('aria-label',NAME[g]);b.title=NAME[g];
      b.onclick=function(){if(g!==CUR)swap(ORDER.indexOf(g)>ORDER.indexOf(CUR)?1:-1,g);};dots.appendChild(b);});}
  var label=el('div','b-chan');glass.appendChild(label);
  function swap(dir,target,tries){if(!CUR||SWAP&&!tries)return;tries=tries||0;if(tries>=ORDER.length)return;
    var PAID={chess:1,fi:1,faunarratics:1,bb:1,c4:1,hang:1,mm:1,erratic:1},broke=(parseInt(($('kn')||{}).textContent,10)||0)<1;
    var i=ORDER.indexOf(CUR),g=target;if(!g){for(var n=1;n<=ORDER.length;n++){var c=ORDER[(i+dir*n+ORDER.length*n)%ORDER.length];if(!(broke&&PAID[c])){g=c;break;}}}if(!g||g===CUR)return;SWAP=true;
    glass.classList.remove('b-snow');void glass.offsetWidth;glass.classList.add('b-snow');label.textContent=NAME[g];label.classList.remove('on');void label.offsetWidth;label.classList.add('on');
    try{IK().tone&&IK().tone(180,.25,'sawtooth',.02);IK().burst&&IK().burst(3000,'highpass',.04,.25);}catch(e){}
    setTimeout(function(){IK().goHome&&IK().goHome();setTimeout(function(){CUR=g;launch(g);
      setTimeout(function(){if(document.body.className.indexOf('on-home')>=0){CUR=g;swap(dir,null,tries+1);return;}SWAP=false;paintDots();},700);},40);},180);}
  /* les bandes des bords : un glissé qui part du bord change de programme, le milieu de l'écran reste aux programmes */
  ['l','r'].forEach(function(s){var e=el('div','b-edge b-edge-'+s);e.setAttribute('aria-hidden','true');e.innerHTML='<i>'+(s==='l'?'‹':'›')+'</i>';glass.appendChild(e);var x0=null,y0=0;
    e.addEventListener('pointerdown',function(ev){x0=ev.clientX;y0=ev.clientY;try{e.setPointerCapture(ev.pointerId);}catch(_){}});
    e.addEventListener('pointerup',function(ev){if(x0==null)return;var dx=ev.clientX-x0,dy=ev.clientY-y0;x0=null;
      if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))swap(dx<0?1:-1);else if(Math.abs(dx)<8&&Math.abs(dy)<8)swap(s==='l'?-1:1);});
    e.addEventListener('pointercancel',function(){x0=null;});});
  function navKey(e){if(!CUR||document.body.className.indexOf('on-home')>=0)return;if(e.key==='PageDown'){e.preventDefault();swap(1);}else if(e.key==='PageUp'){e.preventDefault();swap(-1);}}
  addEventListener('keydown',navKey,true);

  /* ---------- Baku Boom : un coup de tilt, pour tous les boutons Baku Boom de la page ---------- */
  var tilting=false;
  window.__borneBoom=function(cb){if(tilting)return;tilting=true;
    try{IK().burst&&IK().burst(90,'lowpass',.35,.5);IK().tone&&IK().tone(70,.5,'sawtooth',.06,-30);IK().tone&&IK().tone(1046,.08,'square',.025,0,.45);}catch(e){}
    wrap.classList.remove('b-shake');void wrap.offsetWidth;wrap.classList.add('b-shake');hab.textContent='TILT';hab.classList.add('tilt');
    var fl=el('div','b-bbflash','BAKU BOOM'),gr=glass.getBoundingClientRect();fl.style.left=(gr.left+gr.width/2)+'px';fl.style.top=(gr.top+gr.height/2)+'px';document.body.appendChild(fl);setTimeout(function(){fl.remove();},1200);
    glass.classList.remove('b-on');glass.classList.add('b-off');
    setTimeout(function(){try{cb&&cb();}catch(e){}glass.classList.remove('b-off');glass.classList.add('b-on');},480);
    setTimeout(function(){glass.classList.remove('b-on');wrap.classList.remove('b-shake');hab.classList.remove('tilt');hab.textContent=LABEL[root.dataset.habit]||'';tilting=false;},1150);};
  bb.onclick=function(){var away=document.body.className.indexOf('on-home')<0;fold();window.__borneBoom(function(){if(away)IK().goHome();});};

  /* ---------- Burrows et la bio : la borne s'efface, la page s'ouvre en plein écran, prête à imprimer ---------- */
  function full(src,title){var o=el('div','b-full'),fr=lang()==='fr';o.setAttribute('role','dialog');o.setAttribute('aria-label',title);
    o.innerHTML='<header><button type="button" data-x aria-label="'+(fr?'Borne':'Cabinet')+'">◀</button><b></b><button type="button" data-p>'+(fr?'IMPRIMER · PDF':'PRINT · PDF')+'</button></header><iframe title=""></iframe>';
    o.querySelector('b').textContent=title;var f=o.querySelector('iframe');f.title=title;f.src=src;document.body.appendChild(o);wrap.classList.add('b-crushed');sleep();
    var close=function(){o.classList.add('out');wrap.classList.remove('b-crushed');setTimeout(function(){o.remove();if(root.dataset.habit==='repos')wake();},450);};
    o.querySelector('[data-x]').onclick=close;o.querySelector('[data-p]').onclick=function(){try{f.contentWindow.focus();f.contentWindow.print();}catch(e){window.print();}};
    addEventListener('keydown',function esc(e){if(e.key==='Escape'&&document.body.contains(o)){removeEventListener('keydown',esc);close();}});}
  land.onclick=function(){full('/katabase/','BURROWS');};
  badge.onclick=function(){full('borne-bio.html','MAUK TENIEB');};
  wrap.addEventListener('click',function(e){var a=e.target.closest('[data-swap="bio"]');if(!a)return;e.preventDefault();e.stopPropagation();full('borne-bio.html','MAUK TENIEB');},true);

  /* ---------- SkopoRhogo tourne seulement quand il est à l'écran ---------- */
  function wake(){if(!skf.src||skf.src.indexOf('skoporhogo-borne.html')<0)skf.src='skoporhogo-borne.html?attract=1';try{skf.contentWindow.postMessage({borne:'wake'},'*');}catch(e){}}
  function sleep(){try{skf.contentWindow.postMessage({borne:'sleep'},'*');}catch(e){}}
  addEventListener('message',function(e){if(e.source===skf.contentWindow&&e.data&&e.data.borne==='open'&&root.dataset.habit==='repos')IK().go&&IK().go('skopo');});
  document.addEventListener('visibilitychange',function(){if(document.hidden)sleep();else if(root.dataset.habit==='repos')wake();});

  /* ---------- la manette, en miroir : elle penche avec les flèches et les glissés dans l'écran ---------- */
  var mini=el('div','b-stick b-stick-mini','<i></i>');mini.setAttribute('aria-hidden','true');foot.insertBefore(mini,bb);
  var tilt=function(x,y){[stick,mini].forEach(function(s){s.style.setProperty('--x',x);s.style.setProperty('--y',y);});},held={};
  var KX={ArrowLeft:-1,ArrowRight:1,a:-1,q:-1,d:1},KY={ArrowUp:-1,ArrowDown:1,w:-1,z:-1,s:1};
  var clamp=function(v){return Math.max(-1,Math.min(1,v));};
  function fromKeys(){var x=0,y=0;Object.keys(held).forEach(function(k){x+=KX[k]||0;y+=KY[k]||0;});tilt(clamp(x),clamp(y));}
  addEventListener('keydown',function(e){if(KX[e.key]!=null||KY[e.key]!=null){held[e.key]=1;fromKeys();}},true);
  addEventListener('keyup',function(e){if(held[e.key]){delete held[e.key];fromKeys();}},true);
  var g0=null;glass.addEventListener('pointerdown',function(e){g0=[e.clientX,e.clientY];},true);
  glass.addEventListener('pointermove',function(e){if(g0)tilt(clamp((e.clientX-g0[0])/70),clamp((e.clientY-g0[1])/70));},true);
  addEventListener('pointerup',function(){if(g0){g0=null;tilt(0,0);}},true);
  addEventListener('pointercancel',function(){g0=null;tilt(0,0);},true);

  /* ---------- les retours en double des programmes disparaissent : la borne fournit Baku Boom ---------- */
  function hideDup(r){if(!r)return;[].forEach.call(r.querySelectorAll('button,a'),function(b){var t=(b.textContent||'').trim().toUpperCase();
    if(/^←\s*(BACK|RETOUR|MENU|EXIT|SORTIE|KATABATIK)$/.test(t)||t==='BAKU BOOM'||b.hasAttribute('data-back')||b.id==='m-quit'||b.id==='kapture-close')b.classList.add('b-dup');});}
  [$('select'),$('game'),$('kg-root')].forEach(function(r){if(!r)return;hideDup(r);new MutationObserver(function(){hideDup(r);}).observe(r,{childList:true,subtree:true});});

  /* ---------- l'entretien de la plante : l'eau, le soleil, la taille ; elle s'en souvient d'une visite à l'autre ----------
     sans eau depuis quatre jours ou sans soleil depuis six, elle s'affaisse et jaunit ; chaque taille la rend plus touffue, jusqu'à trois. */
  var DAY=864e5,cs=function(){var c={};try{c=JSON.parse(localStorage.getItem('borne.plant')||'{}')||{};}catch(e){}var n=Date.now();
    if(!c.water)c.water=n;if(!c.sun)c.sun=n;if(c.cut==null)c.cut=0;return c;};
  function health(){var c=cs(),n=Date.now();return Math.max(0,Math.min(1,1.25-Math.max((n-c.water)/(4*DAY),(n-c.sun)/(6*DAY))));}
  pot.addEventListener('click',function(e){var b=e.target.closest('[data-care]');if(!b){pot.classList.toggle('open');return;}
    var c=cs(),a=b.dataset.care;if(a==='cut')c.cut=Math.min(3,c.cut+1);else c[a]=Date.now();try{localStorage.setItem('borne.plant',JSON.stringify(c));}catch(_){}
    try{a==='water'?IK().tone(520,.18,'sine',.03,-200):a==='sun'?IK().tone(880,.25,'triangle',.025,300):IK().tone(1500,.04,'square',.02);}catch(_){}
    pot.classList.remove('fx-water','fx-sun','fx-cut');void pot.offsetWidth;pot.classList.add('fx-'+a);lastM=-1;tick();});
  pot.addEventListener('mouseleave',function(){pot.classList.remove('open');});

  /* ---------- la plante du toit : elle suit les mois du calendrier républicain ----------
     vendémiaire : vendange ; brumaire, frimaire : les feuilles tombent ; nivôse : neige ; pluviôse : pluie ; ventôse : bourgeons ;
     germinal : pousse ; floréal, prairial : fleurs ; messidor, thermidor : plein été ; fructidor : fruits. */
  var P={1:[6,0,3,'#c9772b','#6b2a5a',0],2:[4,0,0,'#a5522a',0,0],3:[2,0,0,'#7a5a3a',0,'frost'],4:[0,0,0,0,0,'snow'],5:[0,0,0,0,0,'rain'],6:[0,3,0,'#9bbf5a',0,0],
    7:[3,0,0,'#9fd36a',0,0],8:[6,3,0,'#6fb04a','#f7a8c8',0],9:[8,5,0,'#4f9a3a','#fff1a8',0],10:[8,2,0,'#3f8030','#ffd54f',0],11:[8,0,2,'#3f7a2e','#9ccc65',0],
    12:[7,0,5,'#4a7a30','#e0442e',0],13:[6,0,3,'#7a8a30','#e0442e',0]};
  var PIMG={7:'germinal',8:'floreal',9:'floreal',10:'messidor',11:'messidor',12:'fructidor',1:'fructidor',13:'fructidor',2:'brumaire',3:'brumaire',4:'brumaire',5:'brumaire',6:'brumaire'};
  function plantImg(r){var m=r?r.month:2,n=health()<.5?'assoiffee':PIMG[m]||'brumaire';return '<img alt="" src="plante-'+n+'.webp">';}
  function bornePlant(r){var m=r?r.month:2,d=r?r.day:1,p=P[m]||P[2],f=Math.min(1,(d||1)/30),s='',hl=health(),ex=cs().cut,droop=(1-hl)*35;
    var grow=m===7?.45+.55*f:m===6?.4:1,H=48*grow*(.8+.2*hl),L=(m===7?Math.max(1,Math.round(p[0]*f)):p[0])+(p[0]?ex:0);
    var pts=[];for(var i=0;i<9;i++){var t=(i+1)/10;pts.push([60+Math.sin(t*3)*5,62-t*H]);}
    s+='<path d="M60 62 C 64 '+(62-H*.35)+', 55 '+(62-H*.7)+', '+(pts[8][0]+droop*.5).toFixed(1)+' '+pts[8][1].toFixed(1)+'" fill="none" stroke="#4a3a1e" stroke-width="2.2" stroke-linecap="round"/>';
    for(i=0;i<L;i++){var q=pts[Math.min(8,1+(i%8))],side=i%2?1:-1,a=-side*(12+(i*17)%25)+side*droop,sc=.7+((i*7)%5)/10;
      s+='<path transform="translate('+q[0].toFixed(1)+' '+q[1].toFixed(1)+') rotate('+a+') scale('+sc+')" d="M0 0 C '+(6*side)+' -4, '+(14*side)+' -2, '+(17*side)+' 3 C '+(11*side)+' 6, '+(4*side)+' 5, 0 0Z" fill="'+(hl<.5?'#b9a24a':p[3])+'"/>';}
    for(i=0;i<p[1]*(hl<.5?0:1);i++){q=pts[[8,6,4,7,5][i]];
      s+=m===6?'<circle cx="'+(q[0]+(i%2?4:-4)).toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="2" fill="#c8e08a"/>'
        :'<g transform="translate('+(q[0]+(i%2?7:-7)).toFixed(1)+' '+(q[1]-2).toFixed(1)+')"><circle r="2.2" fill="#ffd54f"/>'+[0,72,144,216,288].map(function(a){return '<ellipse rx="2" ry="3.6" transform="rotate('+a+') translate(0 -4)" fill="'+p[4]+'"/>';}).join('')+'</g>';}
    for(i=0;i<p[2];i++){q=pts[[5,7,3,6,4][i]];s+='<circle cx="'+(q[0]+(i%2?6:-6)).toFixed(1)+'" cy="'+(q[1]+5).toFixed(1)+'" r="'+(m===1?2.6:3.4)+'" fill="'+p[4]+'"/>';}
    if(m===2||m===3)s+='<path d="M78 82 q4 -3 9 0 q-5 3 -9 0Z" fill="'+p[3]+'"/><path d="M38 84 q4 -3 8 1 q-5 2 -8 -1Z" fill="'+p[3]+'"/>';
    if(p[5]==='snow')s+='<path d="M44 62 q16 -6 32 0Z" fill="#f4f7fb"/>'+[[40,20],[70,12],[86,32],[52,40],[30,44],[94,8]].map(function(c){return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="1.4" fill="#f4f7fb"/>';}).join('');
    if(p[5]==='rain')s+=[[40,10],[58,22],[76,6],[90,26],[30,30],[66,38]].map(function(c){return '<path d="M'+c[0]+' '+c[1]+' l-2 6" stroke="#8fb8e8" stroke-width="1.2" stroke-linecap="round"/>';}).join('');
    if(p[5]==='frost')s+='<path d="M60 62 l0 -'+(H*.9).toFixed(1)+'" stroke="#dfe9f5" stroke-width=".7" stroke-dasharray="1 3"/>';
    s+='<path d="M42 60 h36 l-4 24 h-28Z" fill="#a8532e"/><path d="M40 58 h40 v6 h-40Z" fill="#c2643a"/><path d="M47 64 l-3 20" stroke="rgba(255,255,255,.12)" stroke-width="2"/>';
    return '<svg viewBox="0 0 120 86" width="100%" height="100%">'+s+'</svg>';}

  /* ---------- la date du visiteur, en calendrier républicain, et son heure ---------- */
  var MO=['vendémiaire','brumaire','frimaire','nivôse','pluviôse','ventôse','germinal','floréal','prairial','messidor','thermidor','fructidor','sans-culottides'];
  var lastM=-1;
  function tick(){var d=new Date(),r=window.ikRep?window.ikRep(d):null,h=d.getHours(),m=d.getMinutes();
    date.firstChild.textContent=(r?(r.month===13?'jour '+r.day+' des sans-culottides an '+r.year:r.day+' '+MO[r.month-1]+' '+r.year)+' · ':'')+String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
    var key=(r?r.month*40+r.day:0)+'/'+Math.round(health()*10)+'/'+cs().cut;if(key!==lastM){lastM=key;plant.innerHTML=plantImg(r);plant.title=r?MO[r.month-1]:'';}}
  tick();setInterval(tick,15000);

  /* ---------- Échap vaut Baku Boom, partout, même dans les programmes en cadre ; un programme qui s'en sert d'abord (fermer un tiroir, quitter une partie d'échecs) garde la main ---------- */
  function escHome(e){if(e.key!=='Escape'||e.defaultPrevented)return;if(document.querySelector('.b-full')||document.pointerLockElement)return;
    var open=function(id){var x=$(id);return x&&x.classList.contains('open');};if(open('chess')||open('mem'))return;
    if(document.body.className.indexOf('on-home')>=0){fold();return;}e.preventDefault();bb.click();}
  addEventListener('keydown',escHome);
  function hookFrame(f){if(f.__esc)return;f.__esc=1;var on=function(){try{var w=f.contentWindow,d=w.document;w.addEventListener('keydown',function(e){if(e.key==='Escape')setTimeout(function(){escHome(e);},0);if(e.key==='PageUp'||e.key==='PageDown')navKey(e);});
      var f0=null;w.addEventListener('pointerdown',function(e){f0=[e.clientX,e.clientY];},true);w.addEventListener('pointermove',function(e){if(f0)tilt(clamp((e.clientX-f0[0])/70),clamp((e.clientY-f0[1])/70));},true);
      w.addEventListener('pointerup',function(){f0=null;tilt(0,0);},true);w.addEventListener('keydown',function(e){if(KX[e.key]!=null||KY[e.key]!=null){held[e.key]=1;fromKeys();}},true);w.addEventListener('keyup',function(e){if(held[e.key]){delete held[e.key];fromKeys();}},true);
      [].forEach.call(d.querySelectorAll('iframe'),hookFrame);new MutationObserver(function(){[].forEach.call(d.querySelectorAll('iframe'),hookFrame);}).observe(d.documentElement,{childList:true,subtree:true});
      if(/3615/.test(w.location.pathname)&&!d.getElementById('b-3615')){var st=d.createElement('style');st.id='b-3615';st.textContent='#lg{display:none!important}';(d.head||d.documentElement).appendChild(st);}}catch(x){}};
    f.addEventListener('load',on);on();}
  new MutationObserver(function(){[].forEach.call(glass.querySelectorAll('iframe'),hookFrame);}).observe(glass,{childList:true,subtree:true});
  [].forEach.call(glass.querySelectorAll('iframe'),hookFrame);

  /* ---------- le clavier vaut les gestes dans les mini-jeux : flèches et Entrée pour Konnect4, chiffres, ⌫ et Entrée pour Mastermind, Espace pour le Sampler ---------- */
  var shown=function(id){var x=$(id);return x&&x.style.display&&x.style.display!=='none';};
  addEventListener('keydown',function(e){if(/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||''))return;var K=window.__c4k;
    if(shown('c4-panel')&&K){var h=K.s.hover>=0?K.s.hover:3;
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){K.s.hover=Math.max(0,Math.min(K.n-1,h+(e.key==='ArrowLeft'?-1:1)));K.r();e.preventDefault();}
      else if(e.key==='Enter'||e.key===' '||e.key==='ArrowDown'){K.d(h);e.preventDefault();}return;}
    if(shown('mm-panel')){if(/^[1-9]$/.test(e.key)&&window.mmPick){var pal=document.querySelectorAll('#mm-palette .mm-peg'),n=+e.key-1;if(n<pal.length){pal[n].click();e.preventDefault();}}
      else if(e.key==='Backspace'&&window.mmPop){mmPop();e.preventDefault();}else if(e.key==='Enter'&&window.mmSubmit){mmSubmit();e.preventDefault();}return;}
    if(shown('bb-panel')&&e.key===' '&&window.bbTogglePlay){bbTogglePlay();e.preventDefault();}},true);
  /* Fauna Chess : le toucher qui choisit le niveau ne joue pas en même temps un coup sur la case dessous */
  document.addEventListener('touchend',function(e){if(e.target.closest&&e.target.closest('.ch-sel-btn'))window.__chSelT=Date.now();},true);
  document.addEventListener('touchend',function(e){if(Date.now()-(window.__chSelT||0)<450&&e.target.closest&&e.target.closest('#chess-board, .ch-board, [id^=chess] .sq')&&!e.target.closest('.ch-sel-btn')){e.stopImmediatePropagation();e.preventDefault();}},true);

  /* ---------- les Koins à l'écran d'accueil, comme le CREDIT des bornes ; à zéro, le décompte de la Koin gratuite ---------- */
  var cr=el('div','b-credit-scr','<b>KOINS</b> <span></span>');glass.appendChild(cr);
  function credit(){var t=(($('kn')||{}).textContent||'').trim(),m=/^0\s*·\s*(\d+)\s*s/.exec(t);cr.querySelector('span').textContent=m?'0 · +1 '+m[1]+'s':t;cr.classList.toggle('wait',!!m);if($('koins'))$('koins').classList.toggle('wait',!!m);}
  if($('kn'))new MutationObserver(credit).observe($('kn'),{childList:true,characterData:true,subtree:true});credit();setInterval(credit,500);

  /* ---------- Motel Sound joue dès l'arrivée, haut-parleur coupé ; la cloche barrée le rallume ---------- */
  var bell=el('button','b-bell','🔕');bell.type='button';bell.setAttribute('aria-label','Motel Sound : son coupé');bell.setAttribute('aria-pressed','false');
  var docks=bar.querySelectorAll('.dock');(docks[0]||bar).appendChild(bell);
  var muted=true,jp=function(){try{return window.__juke&&window.__juke();}catch(e){return null;}};
  function applyMute(){var p=jp();if(!p||!p.mute)return false;try{if(muted)p.mute();else{p.unMute();p.setVolume&&p.setVolume(80);}}catch(e){}return true;}
  var BELL='<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M10 2.6a5.2 5.2 0 0 0-5.2 5.2v3.6L3.2 14.6h13.6l-1.6-3.2V7.8A5.2 5.2 0 0 0 10 2.6z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 16.4a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.3"/><path class="x" d="M3 3l14 14" stroke="currentColor" stroke-width="1.5"/></svg>';
  function paintBell(){bell.innerHTML=BELL;bell.classList.toggle('on',!muted);bell.setAttribute('aria-pressed',String(!muted));
    bell.setAttribute('aria-label','Motel Sound : '+(muted?'son coupé':'son ouvert'));}
  var guard=setInterval(function(){var p=jp();if(p&&p.mute){applyMute();if(muted&&p.getPlayerState&&p.getPlayerState()!==1&&p.playVideo){try{p.playVideo();}catch(e){}}}},150);
  setTimeout(function(){clearInterval(guard);guard=setInterval(applyMute,1000);},15000);
  setTimeout(function(){var n=$('radio-note'),t=$('radio-toggle');if(t&&!(n&&n.classList.contains('on')))t.click();},600);
  bell.onclick=function(e){e.stopPropagation();muted=!muted;paintBell();var n=$('radio-note'),t=$('radio-toggle');
    if(!muted&&t&&!(n&&n.classList.contains('on')))t.click();applyMute();};
  paintBell();
  /* le titre du juke-box défile quand il dépasse la bande d'affichage */
  (function(){var l=document.querySelector('#radio-toggle .motel-l');if(!l)return;
    function fit(){l.classList.remove('b-run');l.style.removeProperty('--sx');var d=l.scrollWidth-l.clientWidth;if(d>4){l.style.setProperty('--sx',(-d-12)+'px');l.style.setProperty('--sd',Math.max(6,d/18)+'s');l.classList.add('b-run');}}
    new MutationObserver(fit).observe(l,{childList:true,characterData:true,subtree:true});addEventListener('resize',fit);setTimeout(fit,400);})();

  /* les psychopompes : premier arrêt Burrows ou la plaque Mauk Tenieb, au hasard ; jetés, ils rebondissent sur les bords de l'écran */
  land.dataset.grp='visit';badge.dataset.grp='bio';
  window.__borneFirst=function(){var a=[land,badge];if(Math.random()<.5)a.reverse();return a;};
  window.__borneScreen=function(){var r=glass.getBoundingClientRect();return r.width>40&&r.height>40?r:null;};

  dress('repos');
  /* la page d'origine reste voilée jusqu'ici : le visiteur voit la borne d'emblée */
  requestAnimationFrame(function(){root.classList.add('borne-ready');});
})();

/* ---------- éclats et reflets (25 oct.) : les boutons scintillent de temps en temps ; les autocollants et les plaques prennent un reflet qui suit la souris, le doigt ou le défilement ---------- */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var root=document.documentElement;
  function add(e,c){if(!e||e.querySelector(':scope>.'+c))return;var s=document.createElement('s');s.className=c;s.setAttribute('aria-hidden','true');e.appendChild(s);}
  function setup(){
    document.querySelectorAll('.b-panel .cab,.b-row2 .menu a,.b-boom,.b-slot,.b-knob,#koins').forEach(function(e){add(e,'b-gl');});
    document.querySelectorAll('.b-land,.b-lore,.b-badge').forEach(function(e){add(e,'b-sheen');});
  }
  setTimeout(setup,600);setTimeout(setup,2500);
  function glint(){var L=[].slice.call(document.querySelectorAll('.b-gl')).filter(function(s){var r=s.parentNode.getBoundingClientRect();return r.width&&r.bottom>0&&r.top<innerHeight;});
    if(L.length&&!document.hidden){var n=1+(Math.random()<.35?1:0);for(var i=0;i<n;i++){var s=L[Math.floor(Math.random()*L.length)];s.classList.remove('on');void s.offsetWidth;s.classList.add('on');}}
    setTimeout(glint,1400+Math.random()*2600);}
  setTimeout(glint,2000);
  var raf=0,px=.5,py=.5;
  function paint(){raf=0;root.style.setProperty('--rx',px.toFixed(3));root.style.setProperty('--ry',py.toFixed(3));}
  function at(x,y){px=x/innerWidth;py=y/innerHeight;if(!raf)raf=requestAnimationFrame(paint);}
  addEventListener('pointermove',function(e){at(e.clientX,e.clientY);},{passive:true});
  addEventListener('scroll',function(){if(matchMedia('(pointer:coarse)').matches){px=.5+.5*Math.sin(scrollY/240);py=.5;if(!raf)raf=requestAnimationFrame(paint);}},{passive:true});
})();
