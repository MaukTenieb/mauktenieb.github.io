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
    function place(){var W=w.getBoundingClientRect(),B=bar.getBoundingClientRect(),L=document.querySelector('.b-land'),Lr=L?L.getBoundingClientRect():B;
      m.style.top=(B.top-W.top-10)+'px';m.style.height=(Math.max(B.bottom,Lr.bottom)-B.top+60)+'px';}
    place();addEventListener('resize',place);setInterval(place,2000);
    var INK={korong:'255,170,90',minitel:'120,240,150',vhs:'200,220,255',photo:'255,220,170',fauneye:'255,214,150',repos:'255,176,110',arcade:'255,190,120'};
    setInterval(function(){var h=root.dataset.habit||'repos',c=INK[h]||INK.arcade,dim=!!document.querySelector('.bar .brand.b-dim');
      s.style.setProperty('--sp',c);m.classList.toggle('b-off',dim);s.classList.toggle('b-hi',!!root.dataset.prog);},500);}
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
/* la Koin se paie au premier geste de jeu dans l'écran (toucher, clic, touche du clavier) ; zapper d'un écran-titre à l'autre reste gratuit */
(function(){var pend=null,prog='';
  window.__bornePayLater=function(pay){pend=pay;prog='';setTimeout(function(){prog=(window.__borneCur&&window.__borneCur())||'';},300);};
  function hit(e){if(!pend)return;var cur=(window.__borneCur&&window.__borneCur())||'';if(prog&&cur!==prog){pend=null;return;}
    if(e.type==='keydown'&&/^(Escape|PageUp|PageDown|Tab|Shift|Control|Alt|Meta)$/.test(e.key))return;
    var g=document.querySelector('.b-glass');if(e.type==='pointerdown'&&!(g&&(g.contains(e.target)||e.target.tagName==='IFRAME')))return;
    var p=pend;pend=null;try{p();}catch(_){}}
  document.addEventListener('pointerdown',hit,true);document.addEventListener('keydown',hit,true);
  setInterval(function(){if(!pend)return;var r=document.documentElement;if(!r.dataset.prog&&!r.hasAttribute('data-cam'))pend=null;else{var cur=(window.__borneCur&&window.__borneCur())||'';if(prog&&cur!==prog)pend=null;}},300);
  /* les gestes à l'intérieur des jeux en cadre comptent aussi */
  setInterval(function(){document.querySelectorAll('.b-glass iframe').forEach(function(f){try{var d=f.contentDocument;if(d&&!d._bpay){d._bpay=1;d.addEventListener('pointerdown',function(){if(pend){var p=pend;pend=null;try{p();}catch(_){}}},true);d.addEventListener('keydown',function(e){if(pend&&!/^(Escape|Tab)$/.test(e.key)){var p=pend;pend=null;try{p();}catch(_){}}},true);}}catch(_){}});},1000);})();


/* 30 oct., nuit — l'écran entier à l'arrivée sur ordinateur : la largeur de l'image se calcule sur la hauteur libre sous le fronton, mesurée ; le meuble garde sa largeur de borne */
(function(){
  var R=document.documentElement,busy=0,arrived=0;
  function home(){return innerWidth>700&&!R.hasAttribute('data-prog')&&R.getAttribute('data-mode')!=='device'&&R.getAttribute('data-habit')!=='fauneye'&&!R.classList.contains('b-immersion')}
  function px(e,p){return parseFloat(getComputedStyle(e)[p])||0}
  function fit(){
    if(busy)return;busy=1;
    try{
      if(!home()){R.removeAttribute('data-bfit');R.removeAttribute('data-bsmall');['--fitW','--wc','--bzs'].forEach(function(k){R.style.removeProperty(k)});return}
      var scr=document.querySelector('.b-bezel .b-screen'),foot=document.querySelector('.b-bezelfoot');if(!scr)return;
      var H=innerHeight,W=innerWidth,gw=640,wc;
      for(var i=0;i<3;i++){
        wc=Math.max(600,Math.min(W-32,Math.max(gw*1.357+150,Math.min(H*.98+30,gw*1.537+150))));
        R.style.setProperty('--fitW',Math.round(gw)+'px');R.style.setProperty('--wc',Math.round(wc)+'px');R.setAttribute('data-bfit','');
        var r=scr.getBoundingClientRect(),top=r.top+scrollY+px(scr,'borderTopWidth'),bot=px(scr,'borderBottomWidth'),fh=foot?foot.getBoundingClientRect().height+16:60;
        var byH=(H-top-bot-fh-8)/.925,byW=(wc-150)/(W<1000?1.2:1.357),ng=Math.max(360,Math.min(byH,byW,1100));
        if(Math.abs(ng-gw)<1.5){gw=ng;break}gw=ng;
      }
      /* le meuble garde une largeur de borne ; la vitre imprimée s'étire sur les côtés d'une fois et demie au plus */
      wc=Math.max(600,Math.min(W-32,Math.max(gw*1.357+150,Math.min(H*.98+30,gw*1.537+150))));
      R.style.setProperty('--fitW',Math.round(gw)+'px');R.style.setProperty('--wc',Math.round(wc)+'px');
      if(gw<500)R.setAttribute('data-bsmall','');else R.removeAttribute('data-bsmall');
      R.style.setProperty('--bzs',Math.max(0,Math.round((scr.clientWidth-gw)/2))+'px');
      /* fenêtre très basse : à l'arrivée, la page descend juste assez pour montrer l'écran entier et son pied */
      if(!arrived&&document.readyState==='complete'){arrived=1;var fb=foot?foot.getBoundingClientRect().bottom+scrollY:0;if(scrollY===0&&fb>H)scrollTo(0,Math.ceil(fb-H+6))}
    }finally{busy=0}
  }
  var t;function later(){clearTimeout(t);t=setTimeout(fit,60)}
  addEventListener('resize',later);window.__borneFit=fit;
  new MutationObserver(later).observe(R,{attributes:true,attributeFilter:['data-prog','data-mode','data-habit','data-skin','class']});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  addEventListener('load',function(){fit();setTimeout(fit,800)});fit();
})();

/* 30 oct. — la caméra : lancer un jeu, c'est s'approcher de la borne jusqu'à ce que l'écran remplisse la fenêtre ; Baku Boom ou l'accueil font reculer */
(function(){
  var R=document.documentElement,T=0,busy=0,IN=460,OUT=520,EASE='cubic-bezier(.55,.06,.25,1)';
  function wrap(){return document.querySelector('.wrap')}
  function glass(){return document.querySelector('.b-glass')}
  /* la place de l'écran sans les effets du tube (allumage, extinction) : la taille de la vitre, au centre de son cadre */
  function rect(){var g=glass();if(!g)return null;var S=(g.parentElement||g).getBoundingClientRect(),w=g.offsetWidth,h=g.offsetHeight,cx=S.left+S.width/2,cy=S.top+S.height/2;
    return {left:cx-w/2,top:cy-h/2,width:w,height:h}}
  function target(){var w=innerWidth,h=innerHeight;return w>700?{x:48,y:35,w:w-96,h:h-138}:{x:20,y:31,w:w-40,h:h-174}}
  function map(A,G){var W=wrap().getBoundingClientRect(),s=Math.min(G.w/A.width,G.h/A.height),
      gx=G.x+G.w/2,gy=G.y+G.h/2,ax=A.left+A.width/2,ay=A.top+A.height/2;
    return 'translate('+(gx-W.left-s*(ax-W.left)).toFixed(1)+'px,'+(gy-W.top-s*(ay-W.top)).toFixed(1)+'px) scale('+s.toFixed(4)+')'}
  /* après le recul, la borne se cadre comme à l'arrivée : en haut, ou juste assez bas pour montrer l'écran entier sur une fenêtre très basse */
  function settle(){if(R.hasAttribute('data-prog'))return;var ft=document.querySelector('.b-bezelfoot');if(!ft)return;var fb=ft.getBoundingClientRect().bottom+scrollY;
    var top=fb>innerHeight+1?Math.ceil(fb-innerHeight+6):0;if(Math.abs(top-scrollY)>2)try{scrollTo({top:top,left:0,behavior:'smooth'});}catch(e){scrollTo(0,top);}}
  function clear(){var wasOut=R.getAttribute('data-cam')==='out';if(wasOut)setTimeout(settle,300);var w=wrap();if(w){w.style.transition='';w.style.transform='';w.style.transformOrigin='';w.style.opacity='';}R.removeAttribute('data-cam');busy=0}
  function stop(){if(!busy)return;clearTimeout(T);var f=busy;busy=0;clear();if(typeof f==='function')f();}
  window.__borneCam={
    ok:function(){return !!(wrap()&&glass())&&!R.classList.contains('b-immersion')&&!matchMedia('(prefers-reduced-motion:reduce)').matches},
    rect:function(){var r=rect();return r?{x:r.left,y:r.top,w:r.width,h:r.height}:target()},
    stop:stop,
    zoomIn:function(cb){if(typeof busy==='function'){var prev=busy;busy=function(){prev();cb();};return;}stop();var w=wrap(),A=rect();if(!A||!A.width){cb();return;}
      busy=cb;R.setAttribute('data-cam','in');w.style.transformOrigin='0 0';w.style.transition='transform '+IN+'ms '+EASE;
      void w.offsetWidth;w.style.transform=map(A,target());
      T=setTimeout(function(){R.setAttribute('data-cam','swap');var f=busy;busy=0;try{f();}catch(e){}
        w.style.transition='none';w.style.transform='';void w.offsetWidth;
        requestAnimationFrame(function(){requestAnimationFrame(clear);});},IN+10);},
    swap:function(fn){stop();R.setAttribute('data-cam','swap');var w=wrap();if(w)w.style.transition='none';fn();try{window.__borneFit&&window.__borneFit();}catch(e){}try{scrollTo({top:0,left:0,behavior:'instant'});}catch(e){scrollTo(0,0);}},
    /* le recul : le temps que l'accueil se remonte, l'écran reste noir comme un tube qui se rallume ; puis on part de l'écran plein cadre et on recule jusqu'à la borne entière */
    zoomOut:function(G){var w=wrap();if(!w){clear();return;}busy=1;w.classList.remove('b-shake');w.style.transition='none';w.style.opacity='0';
      T=setTimeout(function(){try{window.__borneFit&&(window.__borneFit(),window.__borneFit());}catch(e){}
        var A=rect();if(!A||!A.width){w.style.opacity='';clear();return;}
        w.style.transformOrigin='0 0';w.style.transform=map(A,G);void w.offsetWidth;w.style.opacity='';
        requestAnimationFrame(function(){R.setAttribute('data-cam','out');w.style.transition='transform '+OUT+'ms '+EASE;w.style.transform='';
          T=setTimeout(clear,OUT+20);});},420);}
  };
})();
