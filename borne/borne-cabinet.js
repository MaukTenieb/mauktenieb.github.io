/* Borne Insert Koin (site d'essai) : range la page d'Insert Koin dans une borne d'arcade.
   Rien n'est réécrit : les éléments de la page changent de place, leurs fonctions restent les leurs
   (juke-box et Jack the Box, Koins, Kapture, psychopompes, dé de Katabatik, Bio, Baku Boom, FR/EN). */
(function(){
  var $=function(id){return document.getElementById(id);};
  var root=document.documentElement;root.classList.add('borne');root.dataset.habit='repos';
  var wrap=document.querySelector('.wrap'),bar=$('bar'),home=$('home');if(!wrap||!bar||!home)return;

  /* fronton : l'habit en petit sous l'enseigne */
  var brand=$('brand'),hab=document.createElement('span');hab.className='b-habit';hab.setAttribute('aria-hidden','true');
  if(brand)brand.appendChild(hab);

  /* caméra de Kapture */
  var cam=document.createElement('div');cam.className='b-cam';if($('kapture'))cam.appendChild($('kapture'));

  /* écran : Skoporhogo en attraction, la date républicaine, puis chaque programme */
  var scr=document.createElement('div');scr.className='b-screen';
  var glass=document.createElement('div');glass.className='b-glass';glass.id='b-glass';scr.appendChild(glass);
  var att=document.createElement('div');att.className='b-attract';
  var skf=document.createElement('iframe');skf.title='Skoporhogo';skf.setAttribute('tabindex','-1');skf.setAttribute('aria-hidden','true');
  att.appendChild(skf);glass.appendChild(att);
  var date=document.createElement('div');date.className='b-date';date.innerHTML='<b></b><i></i>';glass.appendChild(date);
  ['select','game','calque'].forEach(function(id){if($(id))glass.appendChild($(id));});

  /* panneau : les cabinets et le menu, plus le tilt */
  var panel=document.createElement('div');panel.className='b-panel';
  var cabs=home.querySelector('.cabinets'),menu=home.querySelector('.menu');
  home.insertBefore(cam,home.firstChild);home.insertBefore(scr,cam.nextSibling);home.insertBefore(panel,scr.nextSibling);
  if(cabs)panel.appendChild(cabs);if(menu)panel.appendChild(menu);
  var tilt=document.createElement('button');tilt.type='button';tilt.className='b-tilt';tilt.textContent='TILT';tilt.setAttribute('aria-label','Tilt : Baku Boom');panel.appendChild(tilt);
  if(cabs){var li=document.createElement('div');li.className='cab';li.style.cssText='--th:url(borne-liseuse.jpg);--nc:#e2c27a';
    li.innerHTML='<button type="button" class="hit" data-go="liseuse"><b>LISEUSE</b></button>';cabs.appendChild(li);
    li.querySelector('button').addEventListener('click',function(){var ik=window.__ik;if(ik&&ik.go)ik.go('liseuse');});}

  /* porte à Koins : la fente mène au 3615 KOINS, le compteur suit */
  var door=document.createElement('div');door.className='b-door';
  var slot=document.createElement('button');slot.type='button';slot.className='b-slot';slot.setAttribute('aria-label','Insert Koin : 3615 KOINS');
  slot.innerHTML='<span>KOINS</span><i></i>';door.appendChild(slot);
  if($('koins'))door.appendChild($('koins'));if($('kal'))door.appendChild($('kal'));
  wrap.appendChild(door);
  var SL=['KOINS','KINOS',"O'SKIN"],si=0;setInterval(function(){si=(si+1)%SL.length;slot.firstChild.textContent=SL[si];},4200);

  /* l'habit suit le programme */
  var HABIT={terminal:'minitel',kal:'minitel',vhs:'vhs',photo:'photo',kapture:'photo',liseuse:'liseuse',puck:'korong',room:'korong'};
  var LABEL={minitel:'3615',vhs:'VHS',photo:'PHOTOFAUNA',liseuse:'LISEUSE',korong:'KORONG!',arcade:'',repos:''};
  function dress(h){root.dataset.habit=h;hab.textContent=LABEL[h]||'';
    if(h==='repos')wake();else sleep();}
  function mark(k){if(!cabs)return;cabs.querySelectorAll('.cab').forEach(function(c){var b=c.querySelector('[data-go]');c.classList.toggle('on-air',!!b&&b.dataset.go===k);});}

  var IK=function(){return window.__ik||{};};
  window.__borneGo=function(k){
    if(k==='liseuse'){IK().ac&&IK().ac();dress('liseuse');mark(k);IK().openCalque('borne-liseuse.html','LISEUSE');return true;}
    if(k==='skopo'){dress('arcade');mark(k);IK().openCalque('skoporhogo-borne.html','Skoporhogo');return true;}
    dress(HABIT[k]||'arcade');mark(k);
    /* programme refusé (Koins à zéro) : la borne reprend son habit de repos */
    setTimeout(function(){if(document.body.className.indexOf('on-home')>=0){dress('repos');mark(null);}},120);return false;};
  window.__borneHome=function(){dress('repos');mark(null);};
  window.__borneGame=function(k){if(k==='kapture')dress('photo');};
  slot.onclick=function(){IK().go&&IK().go('kal');};
  tilt.onclick=function(){var away=document.body.className.indexOf('on-home')<0;
    if(IK().boom)IK().boom(function(){if(away)IK().goHome();});};

  /* Skoporhogo tourne seulement quand il est à l'écran */
  function wake(){if(!skf.src||skf.src.indexOf('skoporhogo-borne.html')<0)skf.src='skoporhogo-borne.html?attract=1';
    try{skf.contentWindow.postMessage({borne:'wake'},'*');}catch(e){}}
  function sleep(){try{skf.contentWindow.postMessage({borne:'sleep'},'*');}catch(e){}}
  document.addEventListener('visibilitychange',function(){if(document.hidden)sleep();else if(root.dataset.habit==='repos')wake();});

  /* la date du visiteur, en calendrier républicain, et son heure */
  var MO=['vendémiaire','brumaire','frimaire','nivôse','pluviôse','ventôse','germinal','floréal','prairial','messidor','thermidor','fructidor','sans-culottides'];
  function tick(){var d=new Date(),r=window.ikRep?window.ikRep(d):null,h=d.getHours(),m=d.getMinutes();
    date.firstChild.textContent=r?(r.month===13?'jour '+r.day+' des sans-culottides an '+r.year:r.day+' '+MO[r.month-1]+' '+r.year):'';
    var fr=(function(){try{return LANG;}catch(e){return 'en';}})()==='fr',ph=h<5?(fr?'nuit':'night'):h<8?(fr?'aube':'dawn'):h<18?(fr?'jour':'day'):h<21?(fr?'soir':'evening'):(fr?'nuit':'night');
    date.lastChild.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+' · '+ph;}
  tick();setInterval(tick,20000);

  dress('repos');
})();
