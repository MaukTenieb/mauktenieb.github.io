/* Borne Insert Koin (site d'essai) : range la page d'Insert Koin dans une borne d'arcade.
   Rien n'est réécrit : les éléments de la page changent de place, leurs fonctions restent les leurs
   (juke-box et Jack the Box, Koins, Kapture, psychopompes, dé de Katabatik, Bio, FR/EN).
   Baku Boom donne un coup de tilt ; les appareils (VHS, Photofauna, Kapture, 3615) transforment le meuble ;
   Bio et Burrows s'ouvrent en plein écran, prêts à imprimer. */
(function(){
  var $=function(id){return document.getElementById(id);};
  var root=document.documentElement;root.classList.add('borne');root.dataset.habit='repos';root.dataset.mode='arcade';
  var wrap=document.querySelector('.wrap'),bar=$('bar'),home=$('home');if(!wrap||!bar||!home)return;
  var IK=function(){return window.__ik||{};};
  var lang=function(){try{return IK().lang?IK().lang():'en';}catch(e){return 'en';}};

  /* fronton : l'habit en petit sous l'enseigne */
  var brand=$('brand'),hab=document.createElement('span');hab.className='b-habit';hab.setAttribute('aria-hidden','true');
  if(brand)brand.appendChild(hab);

  /* bandeau : fente à Koins et compteur à gauche, objectif de Kapture au centre, réglages à droite */
  var strip=document.createElement('div');strip.className='b-strip';
  var sL=document.createElement('div'),sC=document.createElement('div'),sR=document.createElement('div');
  var slot=document.createElement('button');slot.type='button';slot.className='b-slot';
  slot.innerHTML='<i></i><b><span>INSERT KOIN</span><span>3615 KOINS</span></b>';
  sL.appendChild(slot);if($('koins'))sL.appendChild($('koins'));if($('kal'))sL.appendChild($('kal'));
  if($('kapture'))sC.appendChild($('kapture'));
  ['snd','lang'].forEach(function(id){if($(id))sR.appendChild($(id));});
  strip.appendChild(sL);strip.appendChild(sC);strip.appendChild(sR);
  bar.parentNode.insertBefore(strip,bar.nextSibling);
  function slotText(){var t=lang()==='fr'?['INSERT KOIN','3615 KOINS : gagnez des Koins']:['INSERT KOIN','3615 KOINS: earn Koins'];
    slot.querySelector('b span:first-child').textContent=t[0];slot.querySelector('b span:last-child').textContent=t[1];slot.setAttribute('aria-label',t[0]+' · '+t[1]);}
  var SL=['INSERT KOIN','INSERT KINOS',"INSERT O'SKIN"],si=0;
  setInterval(function(){si=(si+1)%SL.length;slot.querySelector('b span:first-child').textContent=SL[si];},4200);

  /* écran : Skoporhogo en attraction, la date républicaine, puis chaque programme */
  var scr=document.createElement('div');scr.className='b-screen';
  var glass=document.createElement('div');glass.className='b-glass';glass.id='b-glass';scr.appendChild(glass);
  var att=document.createElement('div');att.className='b-attract';
  var skf=document.createElement('iframe');skf.title='Skoporhogo';skf.setAttribute('tabindex','-1');
  att.appendChild(skf);glass.appendChild(att);
  var date=document.createElement('div');date.className='b-date';date.innerHTML='<b></b><i></i>';glass.appendChild(date);
  ['select','game','calque'].forEach(function(id){if($(id))glass.appendChild($(id));});

  /* panneau : cinq grandes touches (KorhoGame, FaunEye, 3615, Biography, Korhogo), les liens en petits boutons, Baku Boom.
     KorhoGame et FaunEye déplient leurs programmes ; les cabinets de la page gardent leurs fonctions (dé, chambre, Mask de Bio). */
  var panel=document.createElement('div');panel.className='b-panel';
  var cabs=home.querySelector('.cabinets'),menu=home.querySelector('.menu');
  home.insertBefore(scr,home.firstChild);home.insertBefore(panel,scr.nextSibling);
  var sub=document.createElement('div');sub.className='b-sub';sub.hidden=true;
  var store=document.createElement('div');store.hidden=true;store.className='b-store';
  panel.appendChild(sub);if(cabs)panel.appendChild(cabs);if(menu)panel.appendChild(menu);panel.appendChild(store);
  function cabOf(k){var b=document.querySelector('.cabinets [data-go="'+k+'"],.b-store [data-go="'+k+'"]');return b?b.closest('.cab'):null;}
  function tile(k,title,th,nc){var c=cabOf(k);if(c)return c;c=document.createElement('div');c.className='cab';c.style.cssText='--th:url('+th+');--nc:'+nc;
    c.innerHTML='<button type="button" class="hit" data-go="'+k+'"><b></b></button>';c.querySelector('b').textContent=title;
    c.querySelector('button').addEventListener('click',function(){IK().go&&IK().go(k);});return c;}
  function chip(k,title,mc){var b=menu&&menu.querySelector('[data-go="'+k+'"]');if(b)return;b=document.createElement('button');b.type='button';b.textContent=title;b.style.setProperty('--mc',mc);
    b.addEventListener('click',function(){IK().go&&IK().go(k);});if(menu)menu.appendChild(b);}
  var GROUPS={korhogame:{t:'KORHOGAME',th:'thumb-puck.jpg',nc:'#ffa726',items:[['puck','KORONG!','thumb-puck.jpg','#ffa726'],['chess','FAUNA CHESS','thumb-chess.jpg','#ab47bc'],
      ['erratic','ERRATIK','thumb-erratic.jpg','#42a5f5'],['faunarratics','FAUNARRATIK','thumb-faunarratics.jpg','#4fc3f7'],['katabatik','KATABATIK','thumb-katabatik.jpg','#f48fb1']]},
    fauneye:{t:'FAUNEYE',th:'borne-fauneye.jpg',nc:'#e2c27a',items:[['fauneye','LISEUSE','borne-fauneye.jpg','#e2c27a'],['vhs','VHS','thumb-vhs.jpg','#b9d84a'],['photo','FOTOFAUNA','thumb-photo.jpg','#ff5a5a']]},
    /* SurFauna : surf, consultation et requête (Reporhogo, FaunaTor) */
    surf:{t:'SURFAUNA',th:'thumb-repo.jpg',nc:'#b9d84a',items:[['repo','REPORHOGO','thumb-repo.jpg','#b9d84a'],['tor','FAUNATOR','thumb-repo.jpg','#9e9e9e']]}};
  if(cabs){
    /* les programmes des groupes vont en réserve, hors de la vue */
    Object.keys(GROUPS).forEach(function(g){GROUPS[g].els=GROUPS[g].items.map(function(it){var c=tile(it[0],it[1],it[2],it[3]);store.appendChild(c);return c;});});
    /* Skoporhogo tourne à l'écran */
    ['skopo'].forEach(function(k){var c=cabOf(k);if(c)c.remove();});
    /* trois petits boutons : BC, TL, IG ; les autres liens partent */
    if(menu){[].slice.call(menu.children).forEach(function(x){var h=(x.getAttribute('href')||'');if(!/threadless|instagram/.test(h))x.remove();});
      [].slice.call(menu.children).forEach(function(x){var h=x.getAttribute('href')||'';x.textContent=/threadless/.test(h)?'TL':'IG';});
      var bc=document.createElement('a');bc.href='https://mauktenieb.bandcamp.com';bc.target='_blank';bc.rel='noopener';bc.textContent='BC';bc.style.setProperty('--mc','#1da0c3');menu.insertBefore(bc,menu.firstChild);}
    /* les grandes touches */
    function group(g){var G=GROUPS[g],c=document.createElement('div');c.className='cab b-group';c.style.cssText='--th:url('+G.th+');--nc:'+G.nc;
      c.innerHTML='<button type="button" class="hit" aria-expanded="false"><b></b></button>';c.querySelector('b').textContent=G.t;
      c.querySelector('button').addEventListener('click',function(){unfold(g);});return c;}
    var mt=tile('terminal','3615','thumb-3615.jpg','#66bb6a');
    [].slice.call(cabs.children).forEach(function(c){if(c.classList.contains('cab'))store.appendChild(c);});
    [group('korhogame'),group('fauneye'),mt,group('surf')].forEach(function(c){cabs.appendChild(c);});
    /* reste en réserve : les cabinets sans place dans la borne (rien n'est jeté, leurs fonctions restent branchées) */
  }
  var subT=document.createElement('div');subT.className='b-subbar';subT.innerHTML='<button type="button" class="b-fold">◀</button><b></b>';
  var subG=document.createElement('div');subG.className='b-subgrid';sub.appendChild(subT);sub.appendChild(subG);
  var openG=null;
  function unfold(g){var G=GROUPS[g];openG=g;subG.innerHTML='';G.els.forEach(function(c){subG.appendChild(c);});subT.querySelector('b').textContent=G.t;
    sub.hidden=false;cabs.hidden=true;panel.classList.remove('b-unfold');void panel.offsetWidth;panel.classList.add('b-unfold');}
  function fold(){if(!openG)return;GROUPS[openG].els.forEach(function(c){store.appendChild(c);});openG=null;sub.hidden=true;cabs.hidden=false;}
  subT.querySelector('.b-fold').onclick=fold;
  var land=document.createElement('button');land.type='button';land.className='b-sticker b-land';land.setAttribute('aria-label','Burrows');
  land.innerHTML='<span>BURROWS</span>';strip.parentNode.insertBefore(land,strip);
  land.onclick=function(){full('/katabase/','BURROWS');};
  var badge=document.createElement('button');badge.type='button';badge.className='b-sticker b-badge';badge.setAttribute('aria-label','Mauk Tenieb : biography');
  badge.innerHTML='<b>MAUK</b><b>TENIEB</b>';
  if(menu)menu.parentNode.insertBefore(badge,menu);
  badge.onclick=function(){full('borne-bio.html','MAUK TENIEB');};
  var bb=document.createElement('button');bb.type='button';bb.className='b-boom';bb.textContent='BAKU BOOM';panel.appendChild(bb);

  /* l'habit suit le programme ; les appareils transforment le meuble */
  var HABIT={terminal:'minitel',kal:'minitel',vhs:'vhs',photo:'photo',kapture:'photo',fauneye:'fauneye',puck:'korong',room:'korong'};
  var DEVICE={terminal:1,kal:1,vhs:1,photo:1,kapture:1};
  var LABEL={minitel:'3615',vhs:'FAUNEYE · VHS',photo:'FAUNEYE · FOTOFAUNA',fauneye:'FAUNEYE',korong:'KORHOGAME · KORONG!',arcade:'',repos:''};
  var morphT=0;
  function relayout(){try{window.dispatchEvent(new Event('resize'));}catch(e){}
    try{var f=$('cf');if(f&&f.contentWindow)f.contentWindow.dispatchEvent(new Event('resize'));}catch(e){}}
  function dress(h,device){var mode=device?'device':'arcade',change=root.dataset.habit!==h||root.dataset.mode!==mode;
    if(change&&!matchMedia('(prefers-reduced-motion:reduce)').matches){scr.classList.remove('b-morph');void scr.offsetWidth;scr.classList.add('b-morph');
      clearTimeout(morphT);morphT=setTimeout(function(){scr.classList.remove('b-morph');},1000);}
    root.dataset.habit=h;root.dataset.mode=mode;hab.classList.remove('tilt');hab.textContent=LABEL[h]||'';
    [120,500,800,1100].forEach(function(t){setTimeout(relayout,t);});
    if(h==='repos')wake();else sleep();}
  function mark(k){if(!cabs)return;cabs.querySelectorAll('.cab').forEach(function(c){var b=c.querySelector('[data-go]');c.classList.toggle('on-air',!!b&&b.dataset.go===k);});}

  window.__borneGo=function(k){
    if(k==='fauneye'){IK().ac&&IK().ac();dress('fauneye');mark(k);IK().openCalque('borne-fauneye.html','FAUNEYE');return true;}
    if(k==='skopo'){dress('arcade');mark(k);IK().openCalque('skoporhogo-borne.html','Skoporhogo');return true;}
    if(k==='visit'){full('/katabase/','BURROWS');return true;}
    dress(HABIT[k]||'arcade',!!DEVICE[k]);mark(k);
    /* programme refusé (Koins à zéro) : la borne reprend son habit de repos */
    setTimeout(function(){if(document.body.className.indexOf('on-home')>=0){dress('repos');mark(null);}},120);return false;};
  window.__borneHome=function(){dress('repos');mark(null);};
  window.__borneGame=function(k){if(k==='kapture')dress('photo',true);};

  /* la fente : une pièce y glisse, puis le 3615 KOINS s'ouvre */
  slot.onclick=function(){var c=document.createElement('span');c.className='b-coin';slot.appendChild(c);
    try{IK().tone&&IK().tone(1320,.06,'square',.03);IK().tone&&IK().tone(660,.12,'triangle',.03,0,.25);}catch(e){}
    setTimeout(function(){c.remove();IK().go&&IK().go('kal');},560);};

  /* Baku Boom : un coup de tilt au lieu de l'explosion, pour tous les boutons Baku Boom de la page */
  var tilting=false;
  window.__borneBoom=function(cb){if(tilting)return;tilting=true;
    try{IK().burst&&IK().burst(90,'lowpass',.35,.5);IK().tone&&IK().tone(70,.5,'sawtooth',.06,-30);IK().tone&&IK().tone(1046,.08,'square',.025,0,.45);}catch(e){}
    wrap.classList.remove('b-shake');void wrap.offsetWidth;wrap.classList.add('b-shake');
    hab.textContent='TILT';hab.classList.add('tilt');
    glass.classList.remove('b-on');glass.classList.add('b-off');
    setTimeout(function(){try{cb&&cb();}catch(e){}glass.classList.remove('b-off');glass.classList.add('b-on');},480);
    setTimeout(function(){glass.classList.remove('b-on');wrap.classList.remove('b-shake');hab.classList.remove('tilt');hab.textContent=LABEL[root.dataset.habit]||'';tilting=false;},1150);};
  bb.onclick=function(){var away=document.body.className.indexOf('on-home')<0;window.__borneBoom(function(){if(away)IK().goHome();});};

  /* Bio et Burrows : la borne s'efface, la page s'ouvre en plein écran, prête à imprimer (ou PDF) */
  function full(src,title){var o=document.createElement('div');o.className='b-full';o.setAttribute('role','dialog');o.setAttribute('aria-label',title);
    var fr=lang()==='fr';
    o.innerHTML='<header><button type="button" data-x>'+(fr?'◀ BORNE':'◀ CABINET')+'</button><b></b><button type="button" data-p>'+(fr?'IMPRIMER · PDF':'PRINT · PDF')+'</button></header><iframe title=""></iframe>';
    o.querySelector('b').textContent=title;var f=o.querySelector('iframe');f.title=title;f.src=src;
    document.body.appendChild(o);wrap.classList.add('b-crushed');sleep();
    var close=function(){o.classList.add('out');wrap.classList.remove('b-crushed');setTimeout(function(){o.remove();if(root.dataset.habit==='repos')wake();},450);};
    o.querySelector('[data-x]').onclick=close;
    o.querySelector('[data-p]').onclick=function(){try{f.contentWindow.focus();f.contentWindow.print();}catch(e){window.print();}};
    addEventListener('keydown',function esc(e){if(e.key==='Escape'&&document.body.contains(o)){removeEventListener('keydown',esc);close();}});}
  panel.addEventListener('click',function(e){var a=e.target.closest('[data-swap="bio"]');if(!a)return;e.preventDefault();e.stopPropagation();full('borne-bio.html','BIOGRAPHY');},true);

  /* Skoporhogo tourne seulement quand il est à l'écran ; un appui sur l'écran l'ouvre en grand */
  function wake(){if(!skf.src||skf.src.indexOf('skoporhogo-borne.html')<0)skf.src='skoporhogo-borne.html?attract=1';
    try{skf.contentWindow.postMessage({borne:'wake'},'*');}catch(e){}}
  function sleep(){try{skf.contentWindow.postMessage({borne:'sleep'},'*');}catch(e){}}
  addEventListener('message',function(e){if(e.source===skf.contentWindow&&e.data&&e.data.borne==='open'&&root.dataset.habit==='repos')IK().go&&IK().go('skopo');});
  document.addEventListener('visibilitychange',function(){if(document.hidden)sleep();else if(root.dataset.habit==='repos')wake();});

  /* la date du visiteur, en calendrier républicain, et son heure */
  var MO=['vendémiaire','brumaire','frimaire','nivôse','pluviôse','ventôse','germinal','floréal','prairial','messidor','thermidor','fructidor','sans-culottides'];
  function tick(){var d=new Date(),r=window.ikRep?window.ikRep(d):null,h=d.getHours(),m=d.getMinutes(),fr=lang()==='fr';
    date.firstChild.textContent=r?(r.month===13?'jour '+r.day+' des sans-culottides an '+r.year:r.day+' '+MO[r.month-1]+' '+r.year):'';
    var ph=h<5?(fr?'nuit':'night'):h<8?(fr?'aube':'dawn'):h<18?(fr?'jour':'day'):h<21?(fr?'soir':'evening'):(fr?'nuit':'night');
    date.lastChild.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+' · '+ph;slotText();}
  tick();setInterval(tick,20000);if($('lang'))$('lang').addEventListener('click',function(){setTimeout(tick,50);});

  dress('repos');
})();
