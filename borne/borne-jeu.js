/* Borne Insert Koin — le jeu à l'écran.
   1. Chaque jeu remplit l'écran : son contenu est agrandi et centré, à la mesure de l'écran.
   2. La manette sert : à l'accueil, elle passe d'une touche à l'autre et l'enfonce ; dans un programme, gauche et droite zappent
      dans le groupe, sauf dans FaunInvaders et le VHS, qui reçoivent les flèches ; un appui sur la boule envoie Espace. La manette se déplace par son socle. */
(function(){
  var root=document.documentElement;
  /* la charte commune, allumée par défaut : #sanscharte l'éteint, #charte la rallume ; le choix reste dans ce navigateur.
     Les pages en cadre de même origine reçoivent borne-charte-frame.css, et html[data-ch] nomme la page. */
  var CHF={'3615-local.html':'minitel','borne-fauneye.html':'bakubook','fotofauna.html':'fotofauna','reporhogo.html':'reporhogo','tor.html':'tor','borne-diktat.html':'diktat','skoporhogo-borne.html':'skopo','kg-vhs.html':'vhs'};
  function chFrame(f,on){try{var d=f.contentDocument;if(!d||!d.head||!d.documentElement)return;var n=(d.location.pathname.split('/').pop()||''),k=CHF[n],l=d.getElementById('b-charte');
      if(!k||!on){if(l)l.remove();d.documentElement.classList.remove('b-charte');return;}
      d.documentElement.dataset.ch=k;d.documentElement.classList.add('b-charte');
      if(!l){l=d.createElement('link');l.id='b-charte';l.rel='stylesheet';l.href='borne-charte-frame.css';d.head.appendChild(l);}}catch(e){}}
  function chFrames(){var on=root.classList.contains('b-charte');document.querySelectorAll('iframe').forEach(function(f){chFrame(f,on);if(!f._bch){f._bch=1;f.addEventListener('load',function(){chFrame(f,root.classList.contains('b-charte'));});}});}
  function charte(){var h=location.hash,v=null;try{if(/sanscharte/.test(h))localStorage.setItem('borne.charte','0');else if(/charte/.test(h))localStorage.setItem('borne.charte','1');v=localStorage.getItem('borne.charte');}catch(e){v=/sanscharte/.test(h)?'0':null;}
    root.classList.toggle('b-charte',v!=='0');chFrames();}
  charte();addEventListener('hashchange',charte);setInterval(chFrames,1000);
  /* ---------- 1. le jeu à la taille de l'écran ---------- */
  var MAXZ=2.4;
  function panel(){var k=document.getElementById('kg-root');if(!k||!k.offsetParent)return null;var kr=k.getBoundingClientRect(),A=kr.width*kr.height,best=null;
    if(!A)return null;
    k.querySelectorAll('[id]').forEach(function(c){if(c.id==='scanlines'||c.closest('#scanlines'))return;var s=getComputedStyle(c);if(s.display==='none'||s.visibility==='hidden'||!/fixed|absolute/.test(s.position))return;
      var r=c.getBoundingClientRect();if(r.width*r.height<A*.8)return;if(best&&best.contains(c))return;best=c;});
    return best;}
  function bounds(p){var pr=p.getBoundingClientRect(),L=1e9,T=1e9,R=-1e9,B=-1e9,n=0;
    var all=p.querySelectorAll('*');for(var i=0;i<all.length&&n<3000;i++){var e=all[i];
      if(e.children.length&&!/^(CANVAS|SVG|IMG|BUTTON|svg)$/.test(e.tagName))continue;
      var r=e.getBoundingClientRect();if(r.width<3||r.height<3)continue;var s=getComputedStyle(e);if(s.visibility==='hidden'||+s.opacity===0)continue;
      if(r.right<pr.left||r.left>pr.right||r.bottom<pr.top||r.top>pr.bottom)continue;n++;
      L=Math.min(L,r.left);T=Math.min(T,r.top);R=Math.max(R,r.right);B=Math.max(B,r.bottom);}
    if(!n)return null;return {l:Math.max(L,pr.left)-pr.left,t:Math.max(T,pr.top)-pr.top,r:Math.min(R,pr.right)-pr.left,b:Math.min(B,pr.bottom)-pr.top,W:pr.width,H:pr.height};}
  var cur=null,busy=0;
  function fit(){busy=0;var p=panel();
    if(cur&&cur!==p){cur.style.transform='';cur.style.transformOrigin='';cur.classList.remove('b-fit');cur=null;}
    if(!p)return;var old=p.style.transform;p.classList.add('b-fitting');p.style.transform='';var b=bounds(p);
    function done(){void getComputedStyle(p).transform;p.classList.remove('b-fitting');}
    if(!b){p.style.transform=old;done();return;}
    var cw=b.r-b.l,ch=b.b-b.t,f=Math.min(MAXZ,(b.W*.94)/cw,(b.H*.92)/ch);
    if(!(f>1.06)){p.classList.remove('b-fit');cur=p;done();return;}
    var cx=(b.l+b.r)/2,cy=(b.t+b.b)/2;
    p.style.transformOrigin=cx+'px '+cy+'px';p.style.transform='translate('+(b.W/2-cx)+'px,'+(b.H/2-cy)+'px) scale('+f.toFixed(3)+')';p.classList.add('b-fit');cur=p;done();}
  function soon(){if(!busy)busy=setTimeout(fit,180);}
  function hook(){var k=document.getElementById('kg-root');if(!k){setTimeout(hook,800);return;}
    new MutationObserver(function(m){for(var i=0;i<m.length;i++){if(m[i].target&&m[i].target.closest&&m[i].target.closest('.b-fit')&&m[i].type==='attributes'&&m[i].attributeName==='style'&&m[i].target.classList.contains('b-fit'))continue;soon();return;}})
      .observe(k,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
    addEventListener('resize',soon);setInterval(soon,1500);}
  hook();

  /* ---------- MaskerMind : Koins et signes échiquéens mêlés, tirés au hasard à chaque partie ---------- */
  var KOIN={},sig='';
  function roll(){KOIN={};var names=[].map.call(document.querySelectorAll('#mm-panel button.mm-peg[title]'),function(b){return b.title;});
    names.forEach(function(n){if(Math.random()<.5)KOIN[n]=1;});if(names.length&&!Object.keys(KOIN).length)KOIN[names[Math.floor(Math.random()*names.length)]]=1;}
  function paintMM(){var P=document.getElementById('mm-panel');if(!P||!P.getClientRects().length||getComputedStyle(P).display==='none')return;
    var t=(P.textContent.match(/(\d+)\s*\/\s*\d+/)||[])[1]||'',lv=(document.querySelector('#mm-panel .mm-lv.on')||{}).textContent||'',g=lv+'|'+(t==='1'?'new':'');
    if(!Object.keys(KOIN).length||(g!==sig&&t==='1'))roll();sig=g;
    P.querySelectorAll('.mm-peg[title]').forEach(function(e){e.classList.toggle('b-koin',!!KOIN[e.title]);});}
  setInterval(paintMM,400);


  /* ---------- Immersion : l'écran seul, en plein écran ; glissés à gauche ou à droite pour changer de programme ---------- */
  var imm=false;
  function setImm(on){imm=on;root.classList.toggle('b-immersion',on);var d=document;
    try{if(on&&!d.fullscreenElement&&root.requestFullscreen)root.requestFullscreen({navigationUI:'hide'}).catch(function(){});
      else if(!on&&d.fullscreenElement&&d.exitFullscreen)d.exitFullscreen().catch(function(){});}catch(e){}
    try{window.__borneSon&&window.__borneSon.clack();}catch(e){}setTimeout(soon,350);}
  document.addEventListener('fullscreenchange',function(){if(!document.fullscreenElement&&imm)setImm(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&imm)setImm(false);});
  /* en immersion, un glissé qui part d'un bord de l'écran change de programme ; ailleurs, le geste reste au programme (pages du BakuBook, jeux) */
  function swipeOn(doc){if(!doc||doc._bswipe)return;doc._bswipe=1;var s=null,w=doc.defaultView||window;
    function W(){return window.innerWidth;}
    w.addEventListener('pointerdown',function(e){if(!imm)return;var x=e.screenX-(window.screenX||0);s=null;var fx=0;try{var fe=w.frameElement;if(fe)fx=fe.getBoundingClientRect().left;}catch(_){}var gx=e.clientX+fx;
      if((e.pointerType==='touch'||e.pointerType==='pen')&&(gx<18||gx>W()-18))s={x:e.screenX,y:e.screenY,lx:e.screenX,ly:e.screenY,t:performance.now()};},true);
    w.addEventListener('pointermove',function(e){if(s){s.lx=e.screenX;s.ly=e.screenY;}},true);
    function end(){if(!imm||!s)return;var dx=s.lx-s.x,dy=s.ly-s.y,dt=performance.now()-s.t;s=null;
      if(Math.abs(dx)>120&&Math.abs(dx)>2.2*Math.abs(dy)&&dt<600&&window.__borneZap){window.__borneZap(dx<0?1:-1);if(window.__borneTilt){window.__borneTilt(dx<0?1.4:-1.4,0);setTimeout(function(){window.__borneTilt(0,0);},120);}}}
    w.addEventListener('pointerup',end,true);w.addEventListener('pointercancel',end,true);}
  swipeOn(document);
  setInterval(function(){document.querySelectorAll('iframe').forEach(function(f){try{swipeOn(f.contentDocument);}catch(e){}});},1500);
  function mountImm(){var foot=document.querySelector('.b-bezelfoot'),glass=document.querySelector('.b-glass');if(!foot||!glass){setTimeout(mountImm,600);return;}
    var b=document.createElement('button');b.type='button';b.className='b-imm';b.setAttribute('aria-label','Immersion');b.innerHTML='<i></i><span>IMMERSION</span>';
    b.onclick=function(){setImm(!imm);};var boom=foot.querySelector('.b-boom');foot.insertBefore(b,boom);
    var x=document.createElement('button');x.type='button';x.className='b-imm-x';x.setAttribute('aria-label','Sortir');x.textContent='✕';x.onclick=function(){setImm(false);};glass.appendChild(x);}
  mountImm();

  /* ---------- le Minitel : lettres plus lumineuses par défaut ---------- */
  setInterval(function(){document.querySelectorAll('iframe').forEach(function(f){try{var d=f.contentDocument;if(!d||!d.querySelector('.crt canvas')||d.getElementById('b-lum'))return;
    var st=d.createElement('style');st.id='b-lum';st.textContent='.crt canvas,.crt.color canvas{filter:brightness(1.55) contrast(1.06) drop-shadow(0 0 2.5px rgba(226,240,230,.6))!important}html.ike-on .crt canvas,html.ike-on .crt.color canvas{filter:var(--ike-filter,contrast(1)) brightness(1.55)!important}';
    d.head.appendChild(st);var sc=d.getElementById('scr');if(sc)sc.addEventListener('click',function(){try{c.focus({preventScroll:true});}catch(_){}});}catch(e){}});},1000);
  /* la ligne de saisie du Minitel : une fine ligne de phosphore vert, intégrée au boîtier */
  setInterval(function(){document.querySelectorAll('iframe').forEach(function(f){try{var d=f.contentDocument;var c=d&&d.getElementById('cmd');if(!c||d.getElementById('b-cmd'))return;var st=d.createElement('style');st.id='b-cmd';
    st.textContent='/* la saisie s\u2019affiche déjà sur l\u2019écran, au prompt : la barre noire disparaît, le clavier physique tape toujours */#form{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important;margin:0!important;padding:0!important}#scr{cursor:text}';d.head.appendChild(st);}catch(e){}});},1000);

  /* ---------- la Kam de Kapture : FRONT ou BAK ---------- */
  var face='BAK';
  setInterval(function(){if(window.kaptureFlip&&!window.kaptureFlip._b){var o=window.kaptureFlip;window.kaptureFlip=function(){face=face==='BAK'?'FRONT':'BAK';return o.apply(this,arguments);};window.kaptureFlip._b=1;}
    var f=document.getElementById('kapture-flip');if(f&&f.textContent!==face)f.textContent=face;},400);

  /* ---------- 2. la manette ---------- */
  var KC={ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,' ':32};
  function target(){var f=document.activeElement&&document.activeElement.tagName==='IFRAME'?document.activeElement:null;
    try{if(f&&f.contentDocument)return f.contentDocument;}catch(e){}return document;}
  function key(type,k){var o={key:k,code:k===' '?'Space':k,keyCode:KC[k],which:KC[k],bubbles:true,cancelable:true};
    var d=target(),ev=new KeyboardEvent(type,o);try{Object.defineProperty(ev,'keyCode',{get:function(){return KC[k];}});Object.defineProperty(ev,'which',{get:function(){return KC[k];}});}catch(e){}
    (d.activeElement&&d.activeElement!==d.body?d.activeElement:d.body||d).dispatchEvent(ev);}
  var held={},rep=0;
  function hold(set){['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].forEach(function(k){var on=set.indexOf(k)>=0;if(on&&!held[k]){held[k]=1;key('keydown',k);}else if(!on&&held[k]){delete held[k];key('keyup',k);}});}
  function inGame(){return !!root.dataset.prog;}
  /* à l'accueil : les touches du panneau, l'une après l'autre */
  var sel=-1;
  function keys(){return [].slice.call(document.querySelectorAll('.b-panel .cabinets > .cab, .b-panel .b-sub .cab')).filter(function(c){return c.offsetParent;});}
  function mark(d){var K=keys();if(!K.length)return;sel=(sel<0?(d>0?0:K.length-1):(sel+d+K.length)%K.length);K.forEach(function(c,i){c.classList.toggle('b-sel',i===sel);});}
  function press(){if(inGame()){key('keydown',' ');setTimeout(function(){key('keyup',' ');},90);return;}
    var K=keys(),c=K[sel];if(c){var h=c.querySelector('.hit,button')||c;h.click();sel=-1;K.forEach(function(x){x.classList.remove('b-sel');});}}
  function wire(stick){if(!stick||stick._jeu)return;stick._jeu=1;
    var st=null,lastStep=0;
    stick.addEventListener('pointerdown',function(e){var r=stick.getBoundingClientRect();if(e.clientY>r.top+r.height*.74)return;/* le socle : il déplace la manette */
      e.stopPropagation();e.preventDefault();st={x:e.clientX,y:e.clientY,id:e.pointerId,moved:false};try{stick.setPointerCapture(e.pointerId);}catch(_){}
      stick.classList.add('b-grip');if(window.__borneSon)window.__borneSon.press();},true);
    stick.addEventListener('pointermove',function(e){if(!st||e.pointerId!==st.id)return;var dx=e.clientX-st.x,dy=e.clientY-st.y,ax=Math.abs(dx),ay=Math.abs(dy);
      if(window.__borneTilt)window.__borneTilt(dx/38,dy/38);
      if((ax>14)!==!!st.sw){st.sw=ax>14;if(window.__borneSon)window.__borneSon.tick();}
      if(ax>10||ay>10)st.moved=true;
      var set=[];if(dx<-14)set.push('ArrowLeft');if(dx>14)set.push('ArrowRight');if(dy<-14)set.push('ArrowUp');if(dy>14)set.push('ArrowDown');
      var cur=window.__borneCur&&window.__borneCur(),arrows=/^(fi|vhs)$/.test(cur||'');
      if(inGame()&&arrows)hold(set);
      else if(inGame()){var n2=performance.now();if((set.indexOf('ArrowLeft')>=0||set.indexOf('ArrowRight')>=0)&&n2-lastStep>700&&window.__borneZap){lastStep=n2;window.__borneZap(set.indexOf('ArrowLeft')>=0?-1:1);}}
      else{var n=performance.now();if(set.length&&n-lastStep>320){lastStep=n;mark(set.indexOf('ArrowLeft')>=0||set.indexOf('ArrowUp')>=0?-1:1);}}},true);
    function end(e){if(!st||e.pointerId!==st.id)return;var m=st.moved;st=null;stick.classList.remove('b-grip');if(window.__borneTilt)window.__borneTilt(0,0);if(m&&window.__borneSon)window.__borneSon.twang(1);hold([]);
      if(!m)press();}
    stick.addEventListener('pointerup',end,true);stick.addEventListener('pointercancel',end,true);
    stick.addEventListener('click',function(e){e.stopPropagation();},true);}
  function scan(){document.querySelectorAll('.b-stick').forEach(wire);}
  setTimeout(scan,800);setTimeout(scan,3000);
})();
