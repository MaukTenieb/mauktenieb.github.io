/* Borne Insert Koin — l'écran d'arcade (DA.md).
   Chaque programme s'ouvre sur son écran-titre : 1UP et CREDIT en haut, le nom en pixels, sa phrase, PRESS START ou INSERT KOIN qui clignote.
   Au repos, après 25 secondes sans geste, la borne passe en démo : cartes INSERT KOIN et écrans-titres des programmes, entre deux vues du motel,
   et les touches du panneau s'allument en chenillard. Le premier geste rend la main. */
(function(){
  var root=document.documentElement,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var NAME={puck:'KORONG!',chess:'FAUNA CHESS',erratic:'ERRATIK',faunarratics:'FAUNARRATIK',c4:'KONNECT4',hang:'AKASZTÓFA',mm:'MASKERMIND',bb:'SAMPLER',fi:'FAUNINVADERS',
    diktat:'DIKTATFAUNE',fauneye:'BAKUBOOK',vhs:'VHS',photo:'FOTOFAUNA',kapture:'KAPTURE',terminal:'3615',kal:'3615',repo:'REPORHOGO',tor:'FAUNATOR',skopo:'SKOPORHOGO'};
  var SAYK={c4:'katabatik',hang:'katabatik',mm:'katabatik',bb:'katabatik',fi:'katabatik',kal:'terminal'};
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
  var GK={puck:'korong',fi:'fauninvaders'};
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
  function home(){return !root.dataset.prog&&root.dataset.habit==='repos'&&!root.classList.contains('b-immersion')&&!document.hidden;}
  function step(){if(!demo)return;if(!home()){stop();return;}var s=ORDER[si++%ORDER.length];
    if(s==='motel'){hide();stepT=setTimeout(step,7000);return;}
    var c=s==='koin'?koinCard():s.indexOf('hof:')===0?hofCard(s.slice(4)):card(LIST[Math.floor(Math.random()*LIST.length)],true);if(!c){step();return;}show(c,s.indexOf('hof:')===0?6000:4200);stepT=setTimeout(step,s.indexOf('hof:')===0?6200:4400);}
  function start(){if(demo||!home())return;demo=true;si=0;root.classList.add('b-demo');step();}
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
/* START et BACK : les deux boutons d'action de la borne, de part et d'autre de BC, TL et IG.
   START (A) valide : à l'accueil, il ouvre la touche choisie à la manette ; dans un programme, il appuie sur le bouton du jeu. BACK (B) revient, comme Échap. */
(function(){function mount(){var nav=document.querySelector('.b-row2 .menu');if(!nav||!window.__borneA){setTimeout(mount,600);return;}if(nav.querySelector('.b-ab'))return;
  function mk(cls,lab,col,fn){var a=document.createElement('a');a.className='b-ab '+cls;a.setAttribute('role','button');a.tabIndex=0;a.textContent=lab;a.style.setProperty('--mc',col);
    a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();fn();});a.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}});return a;}
  var A=mk('b-a','START','#f3e8d2',function(){var r=document.documentElement;if(!r.dataset.prog&&!document.querySelector('.b-panel .cab.b-sel')&&window.__borneMark)window.__borneMark(1);else window.__borneA();});
  var B=mk('b-b','BACK','#c9302a',function(){var e=new KeyboardEvent('keydown',{key:'Escape',code:'Escape',keyCode:27,bubbles:true,cancelable:true});window.dispatchEvent(e);});
  nav.insertBefore(A,nav.firstChild);nav.appendChild(B);}
  mount();})();
/* l'œuvre peinte de la caisse : deux décors en miroir, aux coins bas, sous la fente et les molettes */
(function(){function mount(){var d=document.querySelector('.b-door');if(!d){setTimeout(mount,600);return;}if(d.querySelector('.b-cart'))return;
  ['l','r'].forEach(function(s){var e=document.createElement('i');e.className='b-cart b-cart-'+s;e.setAttribute('aria-hidden','true');d.insertBefore(e,d.firstChild);});}
  mount();})();
