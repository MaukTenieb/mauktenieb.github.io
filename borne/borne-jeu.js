/* Borne Insert Koin — le jeu à l'écran.
   1. Chaque jeu remplit l'écran : son contenu est agrandi et centré, à la mesure de l'écran.
   2. La manette sert : à l'accueil, elle passe d'une touche à l'autre et l'enfonce ; dans un jeu, elle envoie les flèches,
      et un appui sur la boule envoie Espace (tir, validation). La manette se déplace par son socle. */
(function(){
  var root=document.documentElement;
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
      stick.classList.add('b-grip');},true);
    stick.addEventListener('pointermove',function(e){if(!st||e.pointerId!==st.id)return;var dx=e.clientX-st.x,dy=e.clientY-st.y,ax=Math.abs(dx),ay=Math.abs(dy);
      var tx=Math.max(-1,Math.min(1,dx/40)),ty=Math.max(-1,Math.min(1,dy/40));stick.style.setProperty('--x',tx);stick.style.setProperty('--y',ty);
      if(ax>10||ay>10)st.moved=true;
      var set=[];if(dx<-14)set.push('ArrowLeft');if(dx>14)set.push('ArrowRight');if(dy<-14)set.push('ArrowUp');if(dy>14)set.push('ArrowDown');
      if(inGame())hold(set);
      else{var n=performance.now();if(set.length&&n-lastStep>320){lastStep=n;mark(set.indexOf('ArrowLeft')>=0||set.indexOf('ArrowUp')>=0?-1:1);}}},true);
    function end(e){if(!st||e.pointerId!==st.id)return;var m=st.moved;st=null;stick.classList.remove('b-grip');stick.style.setProperty('--x',0);stick.style.setProperty('--y',0);hold([]);
      if(!m)press();}
    stick.addEventListener('pointerup',end,true);stick.addEventListener('pointercancel',end,true);
    stick.addEventListener('click',function(e){e.stopPropagation();},true);}
  function scan(){document.querySelectorAll('.b-stick').forEach(wire);}
  setTimeout(scan,800);setTimeout(scan,3000);
})();
