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
    c.innerHTML='<div class="b-tc-top"><span>1UP</span><span>CREDIT '+cr+'</span></div>'+
      '<div class="b-tc-mid"><b>'+esc(NAME[k]||k.toUpperCase())+'</b>'+(say(k)?'<i>'+esc(say(k))+'</i>':'')+'</div>'+
      '<div class="b-tc-go">'+go+'</div><div class="b-tc-foot">© KORHOGO</div>';
    return c;}
  function koinCard(){var c=document.createElement('div');c.className='b-tcard b-tdemo b-tkoin';var cr=credits();
    c.innerHTML='<div class="b-tc-top"><span>1UP</span><span>CREDIT '+cr+'</span></div><div class="b-tc-mid"><b>INSERT<br>KOIN</b><i>1 KOIN — 1 PLAY</i></div><div class="b-tc-go">'+(cr>0?'PRESS START':'INSERT KOIN')+'</div><div class="b-tc-foot">© KORHOGO</div>';return c;}
  var shown=null,hideT=0;
  function show(c,ms){var g=glass();if(!g)return;hide(true);shown=c;g.appendChild(c);void c.offsetWidth;c.classList.add('on');clearTimeout(hideT);hideT=setTimeout(function(){hide();},ms);}
  function hide(now){clearTimeout(hideT);var c=shown;shown=null;if(!c)return;if(now||RM){c.remove();return;}c.classList.remove('on');c.classList.add('off');setTimeout(function(){c.remove();},380);}
  /* l'écran-titre à l'ouverture d'un programme */
  var last='';
  setInterval(function(){var cur=(window.__borneCur&&window.__borneCur())||'',on=!!root.dataset.prog;
    if(!on){last='';return;}
    if(cur&&cur!==last){last=cur;if(!demo)show(card(cur,false),RM?700:1500);}},200);
  /* la démo au repos */
  var demo=false,idleT=0,stepT=0,ORDER=['koin','motel','prog','motel','prog','motel','koin','motel','prog','motel'],si=0,LIST=['chess','puck','faunarratics','erratic','terminal','vhs','photo','repo','tor','skopo','fauneye','fi','mm','c4','hang','bb','diktat'];
  function home(){return !root.dataset.prog&&root.dataset.habit==='repos'&&!root.classList.contains('b-immersion')&&!document.hidden;}
  function step(){if(!demo)return;if(!home()){stop();return;}var s=ORDER[si++%ORDER.length];
    if(s==='motel'){hide();stepT=setTimeout(step,7000);return;}
    var c=s==='koin'?koinCard():card(LIST[Math.floor(Math.random()*LIST.length)],true);show(c,4200);stepT=setTimeout(step,4400);}
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
