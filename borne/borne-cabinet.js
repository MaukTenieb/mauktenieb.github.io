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
  if($('koins')){$('koins').classList.add('b-credit');glass.appendChild($('koins'));}
  ['select','game','calque'].forEach(function(id){if($(id))glass.appendChild($(id));});
  var land=el('button','b-sticker b-land','<span>BURROWS</span>');land.type='button';land.setAttribute('aria-label','Burrows');
  var foot=el('div','b-bezelfoot');
  var badge=el('button','b-sticker b-badge','<b>MAUK</b><b>TENIEB</b>');badge.type='button';badge.setAttribute('aria-label','Mauk Tenieb');
  var menu=home.querySelector('.menu'),loreHref=((menu&&menu.querySelector('a[href*="substack"]'))||{}).href||'https://mauktenieb.substack.com';
  var lore=el('a','b-sticker b-lore','LORE');lore.href=loreHref;lore.target='_blank';lore.rel='noopener';
  foot.appendChild(badge);foot.appendChild(lore);
  bezel.appendChild(land);bezel.appendChild(scr);bezel.appendChild(foot);
  home.insertBefore(bezel,home.firstChild);

  /* ---------- le panneau ---------- */
  var panel=el('div','b-panel'),cabs=home.querySelector('.cabinets');home.insertBefore(panel,bezel.nextSibling);
  var row1=el('div','b-row1'),row2=el('div','b-row2'),sub=el('div','b-sub'),store=el('div','b-store');sub.hidden=true;store.hidden=true;
  var stick=el('div','b-stick','<i></i>');stick.setAttribute('aria-hidden','true');
  var keys=el('div','b-keys');if(cabs)keys.appendChild(cabs);keys.appendChild(sub);
  var bb=el('button','b-boom','<i></i><span>BAKU BOOM</span>');bb.type='button';bb.setAttribute('aria-label','Baku Boom');
  row1.appendChild(stick);row1.appendChild(keys);row1.appendChild(bb);
  if(menu)row2.appendChild(menu);
  panel.appendChild(row1);panel.appendChild(row2);panel.appendChild(store);

  function cabOf(k){var b=document.querySelector('.cabinets [data-go="'+k+'"],.b-store [data-go="'+k+'"]');return b?b.closest('.cab'):null;}
  function tile(k,title,th,nc){var c=cabOf(k);if(c)return c;c=el('div','cab');c.style.cssText='--th:url('+th+');--nc:'+nc;
    c.innerHTML='<button type="button" class="hit" data-go="'+k+'"><b></b></button>';c.querySelector('b').textContent=title;
    c.querySelector('button').addEventListener('click',function(){IK().go&&IK().go(k);});return c;}
  var GROUPS={korhogame:{t:'KORHOGAME',th:'thumb-puck.jpg',nc:'#ffa726',items:[['puck','KORONG!','thumb-puck.jpg','#ffa726'],['chess','FAUNA CHESS','thumb-chess.jpg','#ab47bc'],
      ['erratic','ERRATIK','thumb-erratic.jpg','#42a5f5'],['faunarratics','FAUNARRATIK','thumb-faunarratics.jpg','#4fc3f7'],['katabatik','KATABATIK','thumb-katabatik.jpg','#f48fb1']]},
    fauneye:{t:'FAUNEYE',th:'borne-fauneye.jpg',nc:'#e2c27a',items:[['fauneye','LISEUSE','borne-fauneye.jpg','#e2c27a'],['vhs','VHS','thumb-vhs.jpg','#b9d84a'],['photo','FOTOFAUNA','thumb-photo.jpg','#ff5a5a']]},
    surf:{t:'SURFAUNA',th:'thumb-repo.jpg',nc:'#7fe0ff',items:[['repo','REPORHOGO','thumb-repo.jpg','#b9d84a'],['tor','FAUNATOR','thumb-repo.jpg','#9e9e9e']]}};
  function group(g){var G=GROUPS[g],c=el('div','cab b-group');c.style.cssText='--th:url('+G.th+');--nc:'+G.nc;
    c.innerHTML='<button type="button" class="hit" aria-expanded="false"><b></b></button>';c.querySelector('b').textContent=G.t;
    c.querySelector('button').addEventListener('click',function(){unfold(g);});return c;}
  if(cabs){
    /* les programmes des groupes vont en réserve ; les cabinets sans place y restent branchés (dé, chambre, Mask de Bio) */
    Object.keys(GROUPS).forEach(function(g){GROUPS[g].els=GROUPS[g].items.map(function(it){var c=tile(it[0],it[1],it[2],it[3]);store.appendChild(c);return c;});});
    var sk=cabOf('skopo');if(sk)sk.remove();
    var mt=tile('terminal','3615','thumb-3615.jpg','#66bb6a');
    [].slice.call(cabs.children).forEach(function(c){if(c.classList.contains('cab'))store.appendChild(c);});
    [group('korhogame'),group('fauneye'),mt,group('surf')].forEach(function(c){cabs.appendChild(c);});
  }
  /* trois petits boutons : BC, TL, IG */
  if(menu){[].slice.call(menu.children).forEach(function(x){if(!/threadless|instagram/.test(x.getAttribute('href')||''))x.remove();});
    [].slice.call(menu.children).forEach(function(x){x.textContent=/threadless/.test(x.getAttribute('href')||'')?'TL':'IG';});
    var bc=el('a',null,'BC');bc.href='https://mauktenieb.bandcamp.com';bc.target='_blank';bc.rel='noopener';bc.style.setProperty('--mc','#1da0c3');menu.insertBefore(bc,menu.firstChild);}
  var subT=el('div','b-subbar','<button type="button" class="b-fold" aria-label="◀">◀</button><b></b>'),subG=el('div','b-subgrid');sub.appendChild(subT);sub.appendChild(subG);
  var openG=null;
  function unfold(g){var G=GROUPS[g];openG=g;subG.innerHTML='';G.els.forEach(function(c){subG.appendChild(c);});subT.querySelector('b').textContent=G.t;
    sub.hidden=false;if(cabs)cabs.hidden=true;panel.classList.remove('b-unfold');void panel.offsetWidth;panel.classList.add('b-unfold');}
  function fold(){if(!openG)return;GROUPS[openG].els.forEach(function(c){store.appendChild(c);});openG=null;sub.hidden=true;if(cabs)cabs.hidden=false;}
  subT.querySelector('.b-fold').onclick=fold;

  /* ---------- la porte : la fente, le son, la langue ---------- */
  var door=el('div','b-door'),slot=el('button','b-slot','<b><em>INSERT</em> <u>KOIN</u></b><i></i>');slot.type='button';slot.setAttribute('aria-label','Insert Koin · 3615 KOINS');
  var knobs=el('div','b-knobs');door.appendChild(slot);door.appendChild(knobs);
  /* le bouton SKIN : le meuble en bois, en métal, ou en jeu électromécanique des années 1960 */
  var SKINS=['bois','metal','1960'],skin='bois';try{skin=localStorage.getItem('borne.skin')||'bois';}catch(e){}if(SKINS.indexOf(skin)<0)skin='bois';root.dataset.skin=skin;
  var sw=el('div','b-knobw'),sb=el('button','b-knob b-skin');sb.type='button';sb.setAttribute('aria-label','Skin');sb.dataset.pos=SKINS.indexOf(skin);
  sw.appendChild(sb);sw.appendChild(el('span','b-knoblab','SKIN'));knobs.appendChild(sw);
  sb.onclick=function(){skin=SKINS[(SKINS.indexOf(skin)+1)%SKINS.length];sb.dataset.pos=SKINS.indexOf(skin);try{localStorage.setItem('borne.skin',skin);}catch(e){}
    try{IK().tone&&IK().tone(220,.05,'square',.03);IK().tone&&IK().tone(330,.05,'square',.03,0,.06);}catch(e){}
    scr.classList.remove('b-morph');void scr.offsetWidth;scr.classList.add('b-morph');setTimeout(function(){root.dataset.skin=skin;},250);};
  [['snd','SON'],['lang','FR · EN']].forEach(function(p){var b=$(p[0]);if(!b)return;var w=el('div','b-knobw');b.classList.add('b-knob');w.appendChild(b);w.appendChild(el('span','b-knoblab',p[1]));knobs.appendChild(w);
    var sync=function(){var t=(b.textContent||'').toUpperCase();b.dataset.on=(p[0]==='snd'?/ON/.test(t):/FR/.test(t))?'1':'0';};sync();
    new MutationObserver(sync).observe(b,{childList:true,characterData:true,subtree:true});});
  if($('kal'))door.appendChild($('kal'));
  wrap.appendChild(door);
  var SL=['KOIN','KINOS',"O'SKIN"],si=0,kw=slot.querySelector('u');
  setInterval(function(){si=(si+1)%SL.length;kw.classList.remove('flip');void kw.offsetWidth;kw.textContent=SL[si];kw.classList.add('flip');},4200);
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
    root.dataset.habit=h;root.dataset.mode=mode;hab.classList.remove('tilt');hab.textContent=LABEL[h]||'';
    [120,500,800,1100].forEach(function(t){setTimeout(relayout,t);});
    if(h==='repos')wake();else sleep();}
  function mark(k){[cabs,subG].forEach(function(r){if(r)r.querySelectorAll('.cab').forEach(function(c){var b=c.querySelector('[data-go]');c.classList.toggle('on-air',!!b&&b.dataset.go===k);});});}
  window.__borneGo=function(k){
    if(k==='fauneye'){IK().ac&&IK().ac();dress('fauneye');mark(k);IK().openCalque('borne-fauneye.html','FAUNEYE');return true;}
    if(k==='skopo'){dress('arcade');mark(k);IK().openCalque('skoporhogo-borne.html','SkopoRhogo');return true;}
    if(k==='visit'){full('/katabase/','BURROWS');return true;}
    dress(HABIT[k]||'arcade',!!DEVICE[k]);mark(k);
    /* programme refusé (Koins à zéro) : la borne reprend son habit de repos */
    setTimeout(function(){if(document.body.className.indexOf('on-home')>=0){dress('repos');mark(null);}},120);return false;};
  window.__borneHome=function(){dress('repos');mark(null);};
  window.__borneGame=function(k){if(k==='kapture')dress('photo',true);};

  /* ---------- Baku Boom : un coup de tilt, pour tous les boutons Baku Boom de la page ---------- */
  var tilting=false;
  window.__borneBoom=function(cb){if(tilting)return;tilting=true;
    try{IK().burst&&IK().burst(90,'lowpass',.35,.5);IK().tone&&IK().tone(70,.5,'sawtooth',.06,-30);IK().tone&&IK().tone(1046,.08,'square',.025,0,.45);}catch(e){}
    wrap.classList.remove('b-shake');void wrap.offsetWidth;wrap.classList.add('b-shake');hab.textContent='TILT';hab.classList.add('tilt');
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
  var tilt=function(x,y){stick.style.setProperty('--x',x);stick.style.setProperty('--y',y);},held={};
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
    if(/^←\s*(BACK|RETOUR)$/.test(t)||t==='BAKU BOOM'||b.hasAttribute('data-back'))b.classList.add('b-dup');});}
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
    var key=(r?r.month*40+r.day:0)+'/'+Math.round(health()*10)+'/'+cs().cut;if(key!==lastM){lastM=key;plant.innerHTML=bornePlant(r);plant.title=r?MO[r.month-1]:'';}}
  tick();setInterval(tick,15000);

  /* ---------- Motel Sound joue dès l'arrivée, haut-parleur coupé ; la cloche barrée le rallume ---------- */
  var bell=el('button','b-bell','🔕');bell.type='button';bell.setAttribute('aria-label','Motel Sound : son coupé');bell.setAttribute('aria-pressed','false');
  var docks=bar.querySelectorAll('.dock');(docks[0]||bar).appendChild(bell);
  var muted=true,jp=function(){try{return window.__juke&&window.__juke();}catch(e){return null;}};
  function applyMute(){var p=jp();if(!p||!p.mute)return false;try{if(muted)p.mute();else{p.unMute();p.setVolume&&p.setVolume(80);}}catch(e){}return true;}
  function paintBell(){bell.textContent=muted?'🔕':'🔔';bell.classList.toggle('on',!muted);bell.setAttribute('aria-pressed',String(!muted));
    bell.setAttribute('aria-label','Motel Sound : '+(muted?'son coupé':'son ouvert'));}
  var guard=setInterval(function(){var p=jp();if(p&&p.mute){applyMute();if(muted&&p.getPlayerState&&p.getPlayerState()!==1&&p.playVideo){try{p.playVideo();}catch(e){}}}},150);
  setTimeout(function(){clearInterval(guard);guard=setInterval(applyMute,1000);},15000);
  setTimeout(function(){var n=$('radio-note'),t=$('radio-toggle');if(t&&!(n&&n.classList.contains('on')))t.click();},600);
  bell.onclick=function(e){e.stopPropagation();muted=!muted;paintBell();var n=$('radio-note'),t=$('radio-toggle');
    if(!muted&&t&&!(n&&n.classList.contains('on')))t.click();applyMute();};
  paintBell();

  dress('repos');
})();
