/* Borne Insert Koin — l'écran d'arcade (DA.md).
   Chaque programme s'ouvre sur son écran-titre : 1UP et CREDIT en haut, le nom en pixels, sa phrase, PRESS START ou INSERT KOIN qui clignote.
   Au repos, après 25 secondes sans geste, la borne passe en démo : cartes INSERT KOIN et écrans-titres des programmes, entre deux vues du motel,
   et les touches du panneau s'allument en chenillard. Le premier geste rend la main. */
(function(){
  var root=document.documentElement,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var NAME={puck:'KORONG!',chess:'FAUNA CHESS',erratic:'ERRATIK',faunarratics:'FAUNARRATIK',c4:'KONNECT4',hang:'AKASZTÓFA',mm:'MASKERMIND',bb:'SAMPLER',fi:'FAUNINVADERS',
    diktat:'DIKTATFAUNE',fauneye:'BAKUBOOK',vhs:'VHS',photo:'FOTOFAUNA',kapture:'KAPTURE',terminal:'3615',kal:'3615',repo:'REPORHOGO',tor:'FAUNATOR',skopo:'SKOPORHOGO'};
  var SAYK={c4:'katabatik',hang:'katabatik',mm:'katabatik',kal:'terminal'};
  var INK={fauneye:'#e2c27a',vhs:'#e2c27a',photo:'#e2c27a',kapture:'#e2c27a',terminal:'#66bb6a',kal:'#66bb6a',repo:'#7fe0ff',tor:'#7fe0ff',skopo:'#4fc3f7'};
  var PAID={chess:1,fi:1,faunarratics:1,bb:1,c4:1,hang:1,mm:1,erratic:1};
  function $(i){return document.getElementById(i);}
  function credits(){return parseInt((($('kn')||{}).textContent||'0'),10)||0;}
  function say(k){try{var S=window.__borneSAY&&window.__borneSAY();return (S&&S[SAYK[k]||k])||'';}catch(e){return '';}}
  function glass(){return document.querySelector('.b-glass');}
  function esc(t){return String(t).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
  function card(k,demo){var c=document.createElement('div');c.className='b-tcard'+(demo?' b-tdemo':'');c.style.setProperty('--tc-ink',INK[k]||'#ffa726');
    var cr=credits(),go=(PAID[k]&&cr<1)?'INSERT KOIN':'PRESS START';
    var H=hi(k);c.innerHTML='<div class="b-tc-top"><span>1UP</span>'+(H!=null?'<span class="b-tc-hi">HI-SCORE '+esc(String(H))+'</span>':'')+'<span>CREDIT '+cr+'</span></div>'+
      '<div class="b-tc-mid"><b>'+esc(NAME[k]||k.toUpperCase())+'</b>'+(say(k)?'<i>'+esc(say(k))+'</i>':'')+'</div>'+
      '<div class="b-tc-go">'+go+'</div><div class="b-tc-foot">© KORHOGO</div>';
    return c;}
  function koinCard(){var c=document.createElement('div');c.className='b-tcard b-tdemo b-tkoin';var cr=credits();
    c.innerHTML='<div class="b-tc-top"><span>1UP</span><span>CREDIT '+cr+'</span></div><div class="b-tc-mid"><b>INSERT<br>KOIN</b><i>1 KOIN — 1 PLAY</i></div><div class="b-tc-go">'+(cr>0?'PRESS START':'INSERT KOIN')+'</div><div class="b-tc-foot">© KORHOGO</div>';return c;}

  /* les vrais palmarès de Korong! et de FaunInvaders (IKP : palmares.json et les relais Nostr), relus toutes les 5 minutes */
  var HOF={},hofT=0;
  function hof(){if(!window.IKP||Date.now()-hofT<300000)return;hofT=Date.now();['korong','fauninvaders'].forEach(function(g){IKP.top(g).then(function(t){if(t&&t.length)HOF[g]=t;}).catch(function(){});});}
  setTimeout(hof,4000);setInterval(hof,60000);
  var GK={fi:'fauninvaders'};
  function hi(k){var t=HOF[GK[k]];return t&&t[0]?t[0].a:null;}
  function hofCard(g){var t=HOF[g];if(!t||!t.length)return null;var c=document.createElement('div');c.className='b-tcard b-tdemo b-thof';
    var rows=t.slice(0,5).map(function(e,i){return '<tr><td>'+['1ST','2ND','3RD','4TH','5TH'][i]+'</td><td>'+esc(String(e.a))+'</td><td>'+esc(String(e.ini||'???').slice(0,3))+'</td></tr>';}).join('');
    c.innerHTML='<div class="b-tc-top"><span>HI-SCORES</span><span>CREDIT '+credits()+'</span></div><div class="b-tc-mid"><b>'+(g==='korong'?'KORONG!':'FAUNINVADERS')+'</b><table>'+rows+'</table></div><div class="b-tc-go">'+(credits()>0?'PRESS START':'INSERT KOIN')+'</div><div class="b-tc-foot">© KORHOGO</div>';return c;}
  var shown=null,hideT=0;
  function show(c,ms){var g=glass();if(!g)return;hide(true);shown=c;g.appendChild(c);void c.offsetWidth;c.classList.add('on');clearTimeout(hideT);hideT=setTimeout(function(){hide();},ms);}
  function hide(now){clearTimeout(hideT);var c=shown;shown=null;if(!c)return;if(now||RM){c.remove();return;}c.classList.remove('on');c.classList.add('off');setTimeout(function(){c.remove();},380);}
  /* l'écran-titre à l'ouverture d'un programme */
  var last='';
  setInterval(function(){var cur=(window.__borneCur&&window.__borneCur())||'',on=!!root.dataset.prog;
    if(!on){last='';return;}
    if(cur&&cur!==last){last=cur;if(!demo)show(card(cur,false),RM?700:1500);}},200);
  /* la démo au repos */
  var demo=false,idleT=0,stepT=0,ORDER=['koin','motel','prog','motel','hof:korong','motel','prog','motel','koin','motel','hof:fauninvaders','motel','prog','motel'],si=0,LIST=['chess','puck','faunarratics','erratic','terminal','vhs','photo','repo','tor','skopo','fauneye','fi','mm','c4','hang','bb','diktat'];
  function home(){return !root.dataset.prog&&root.dataset.habit==='repos'&&!root.classList.contains('b-immersion')&&!document.hidden&&!window.__borneTour;}
  function step(){if(!demo)return;if(!home()){stop();return;}var s=ORDER[si++%ORDER.length];
    if(s==='motel'){hide();stepT=setTimeout(step,7000);return;}
    var c=s==='koin'?koinCard():s.indexOf('hof:')===0?hofCard(s.slice(4)):card(LIST[Math.floor(Math.random()*LIST.length)],true);if(!c){step();return;}show(c,s.indexOf('hof:')===0?6000:4200);stepT=setTimeout(step,s.indexOf('hof:')===0?6200:4400);}
  function start(){if(demo)return;if(!home()){if(window.__borneTour){clearTimeout(idleT);idleT=setTimeout(start,20000);}return;}demo=true;si=0;root.classList.add('b-demo');step();}
  function stop(){if(!demo)return;demo=false;clearTimeout(stepT);root.classList.remove('b-demo');hide();}
  function poke(){if(demo)stop();clearTimeout(idleT);idleT=setTimeout(start,25000);}
  ['pointerdown','keydown','wheel','touchstart'].forEach(function(ev){addEventListener(ev,poke,{capture:true,passive:true});});
  addEventListener('keydown',function(e){if(shown&&!shown.classList.contains('b-tdemo'))hide();},true);
  document.addEventListener('pointerdown',function(e){if(shown&&!shown.classList.contains('b-tdemo')&&glass()&&glass().contains(e.target))hide();},true);
  poke();
  /* le chenillard : chaque touche et chaque bouton rond reçoit son rang */
  function rank(){var L=[].slice.call(document.querySelectorAll('#home .b-panel .cabinets>.cab, .b-row2 .menu a'));if(!L.length){setTimeout(rank,600);return;}
    L.forEach(function(e,i){e.style.setProperty('--ci',i);});root.style.setProperty('--cn',L.length);}
  rank();
  window.__borneDemo=function(on){if(on){clearTimeout(idleT);start();}else stop();};
})();
/* la lumière : le tube de l'enseigne éclaire le haut du meuble, l'écran éclaire le panneau de commande dans la couleur du programme ;
   l'écran d'accueil garde la trace brûlée d'INSERT KOIN, comme les tubes restés allumés des années en salle */
(function(){var root=document.documentElement;
  function mount(){var w=document.querySelector('.wrap'),bar=document.querySelector('.wrap .bar'),pan=document.querySelector('#home .b-panel'),g=document.querySelector('.b-glass');
    if(!w||!bar||!pan||!g){setTimeout(mount,600);return;}
    var m=document.createElement('div');m.className='b-mql';m.setAttribute('aria-hidden','true');w.appendChild(m);
    var s=document.createElement('div');s.className='b-spill';s.setAttribute('aria-hidden','true');pan.appendChild(s);
    var b=document.createElement('div');b.className='b-burn';b.setAttribute('aria-hidden','true');b.textContent='INSERT KOIN';g.appendChild(b);
    function place(){var W=w.getBoundingClientRect(),B=bar.getBoundingClientRect(),L=document.querySelector('.b-land'),Lr=L?L.getBoundingClientRect():B;
      m.style.top=(B.top-W.top-10)+'px';m.style.height=(Math.max(B.bottom,Lr.bottom)-B.top+60)+'px';}
    place();addEventListener('resize',place);setInterval(place,2000);
    var INK={korong:'255,170,90',minitel:'120,240,150',vhs:'200,220,255',photo:'255,220,170',fauneye:'255,214,150',repos:'255,176,110',arcade:'255,190,120'};
    setInterval(function(){var h=root.dataset.habit||'repos',c=INK[h]||INK.arcade,dim=!!document.querySelector('.bar .brand.b-dim');
      s.style.setProperty('--sp',c);m.classList.toggle('b-off',dim);s.classList.toggle('b-hi',!!root.dataset.prog);},500);}
  mount();})();
/* l'œuvre peinte de la caisse : deux décors en miroir, aux coins bas, sous la fente et les molettes */
(function(){function mount(){var d=document.querySelector('.b-door');if(!d){setTimeout(mount,600);return;}if(d.querySelector('.b-cart'))return;
  ['l','r'].forEach(function(s){var e=document.createElement('i');e.className='b-cart b-cart-'+s;e.setAttribute('aria-hidden','true');d.insertBefore(e,d.firstChild);});}
  mount();})();
/* les deux fentes à Koin éclairées de la porte */
(function(){function mount(){var s=document.querySelector('.b-slot');if(!s){setTimeout(mount,600);return;}if(s.querySelector('.b-lamp'))return;
  ['b-l1','b-l2'].forEach(function(c){var e=document.createElement('i');e.className='b-lamp '+c;e.setAttribute('aria-hidden','true');e.textContent='1 KOIN';s.appendChild(e);});}
  mount();})();
/* la tranche peinte des flancs : la bande de rayures de chaque côté du meuble, en miroir, sur toute la hauteur */
(function(){function mount(){var w=document.querySelector('.wrap');if(!w){setTimeout(mount,600);return;}if(w.querySelector('.b-edgeart'))return;
  ['l','r'].forEach(function(s){var e=document.createElement('i');e.className='b-edgeart b-edgeart-'+s;e.setAttribute('aria-hidden','true');w.appendChild(e);});}
  mount();})();
/* la visite des psychopompes a la priorité : la démo s'efface dès qu'elle commence */
setInterval(function(){if(window.__borneTour&&document.documentElement.classList.contains('b-demo')&&window.__borneDemo)window.__borneDemo(false);},400);
/* l'aimant de Dekonect dessiné en fer à cheval rouge, pôles d'acier, reflet ; ses lignes de champ s'allument au survol */
(function(){function go(){var b=document.querySelector('.b-dekonect');if(!b){setTimeout(go,600);return;}if(b._art)return;b._art=1;
  b.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="bmg" x1="0" x2="1"><stop offset="0" stop-color="#7a1210"/><stop offset=".35" stop-color="#e0443a"/><stop offset=".6" stop-color="#c9302a"/><stop offset="1" stop-color="#6a0e0c"/></linearGradient><linearGradient id="bms" x1="0" x2="1"><stop offset="0" stop-color="#6a6e74"/><stop offset=".45" stop-color="#f2f4f6"/><stop offset="1" stop-color="#7a7e84"/></linearGradient></defs>'+
    '<path d="M8 6h9v15a3 3 0 0 0 6 0V6h9v15a12 12 0 0 1-24 0z" fill="url(#bmg)" stroke="#3a0806" stroke-width="1"/>'+
    '<rect x="8" y="3" width="9" height="6" rx="1" fill="url(#bms)" stroke="#2a2c2e" stroke-width=".8"/><rect x="23" y="3" width="9" height="6" rx="1" fill="url(#bms)" stroke="#2a2c2e" stroke-width=".8"/>'+
    '<path d="M11 13v8a9 9 0 0 0 4 7" fill="none" stroke="rgba(255,220,210,.5)" stroke-width="1.4" stroke-linecap="round"/>'+
    '<g class="bfield" fill="none" stroke="#ffb02a" stroke-width="1" stroke-linecap="round"><path d="M12 1.5q8-5 16 0"/><path d="M10 .2q10-6.5 20 0" opacity=".6"/></g></svg>';}
  go();})();
/* AUDIT 30 oct. — dans un programme, le fronton et le toit se replient pour laisser l'écran grand ; leurs commandes passent au pied de l'écran :
   le son (et sa diode), PL, Kapture et Burrows. Chaque touche du pied actionne la vraie commande du meuble. */
(function(){function go(){var foot=document.querySelector('.b-bezelfoot'),bell=document.querySelector('.b-bell'),pl=document.getElementById('export-pl'),kap=document.getElementById('kapture'),land=document.querySelector('.b-land');
  if(!foot||!bell){setTimeout(go,700);return;}if(foot.querySelector('.b-pfx'))return;
  var box=document.createElement('div');box.className='b-pfx';
  function mk(cls,html,label,fn){var b=document.createElement('button');b.type='button';b.className='b-px '+cls;b.innerHTML=html;b.setAttribute('aria-label',label);b.addEventListener('click',function(e){e.stopPropagation();fn();});box.appendChild(b);return b;}
  var sb=mk('b-px-son','','Motel Sound',function(){bell.click();sync();});
  if(pl)mk('b-px-pl','PL','Playlist',function(){pl.click();});
  if(kap)mk('b-px-kap','<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 7l1.6-2.4h4.8L16 7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>','Kapture',function(){kap.click();});
  if(land)mk('b-px-bur','BURROWS','Burrows',function(){land.click();});
  function sync(){sb.innerHTML=bell.innerHTML;sb.classList.toggle('on',bell.classList.contains('on'));}
  new MutationObserver(sync).observe(bell,{attributes:true,childList:true,subtree:true});sync();
  var imm=foot.querySelector('.b-imm');foot.insertBefore(box,imm||null);}
  go();})();
/* Lore luit de temps en temps, au hasard */
(function(){function t(){var l=document.querySelector('.b-lore');if(l&&!document.hidden){l.classList.remove('b-shine');void l.offsetWidth;l.classList.add('b-shine');}setTimeout(t,9000+Math.random()*16000);}setTimeout(t,5000);})();

/* AUDIT 30 oct. — au clavier, à l'accueil : les flèches choisissent une touche du panneau, Entrée l'ouvre */
addEventListener('keydown',function(e){var r=document.documentElement;if(r.dataset.prog||e.altKey||e.ctrlKey||e.metaKey)return;var t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
  if(!window.__borneMark||!window.__borneA)return;
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();window.__borneMark(1);}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();window.__borneMark(-1);}
  else if(e.key==='Enter'&&document.querySelector('.b-panel .cab.b-sel')){e.preventDefault();window.__borneA();}});
