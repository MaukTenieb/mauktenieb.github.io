/* Borne Insert Koin — les blocs aimantés.
   Chaque bloc du meuble se saisit à la souris (appuyer puis glisser) ou au doigt (appui long), se déplace,
   s'aimante aux bords et aux axes des autres blocs, se colle contre eux, et revient à sa place s'il en passe près.
   Ramené près de sa place, le bloc s'y recolle. Positions gardées pour chaque skin, dans ce navigateur. */
(function(){
  var root=document.documentElement;
  var SEL=[
    ['plante','.b-pot'],['camera','.b-cam'],['fronton','.bar .brand'],['son','.bar .dock:first-of-type'],['hp','.bar .dock:last-of-type'],
    ['burrows','.b-land'],['lore','.b-lore'],['koins','.b-bezelfoot #koins'],['boom','.b-bezelfoot .b-boom'],
    ['boutons','.b-row2 .menu'],['manette','.b-panel .cabinets > .b-stick'],['plaque','.b-plate .b-badge'],['fente','.b-slot'],['molettes','.b-knobs']
  ];
  var MAG=14,HOME=26,LONG=330;
  var blocks=[],drag=null,suppress=0;
  function skin(){return root.dataset.skin||'bois';}
  function key(){return 'borne.aimant.'+skin();}
  function load(){try{return JSON.parse(localStorage.getItem(key())||'{}')||{};}catch(e){return {};}}
  function save(){var o={};blocks.forEach(function(b){if(b.dx||b.dy)o[b.id]=[Math.round(b.dx),Math.round(b.dy)];});try{localStorage.setItem(key(),JSON.stringify(o));}catch(e){}}
  function put(b,x,y,anim){b.dx=x;b.dy=y;b.el.classList.toggle('b-moved',!!(x||y));
    clearTimeout(b.tt);b.el.style.transition=anim?'translate .32s cubic-bezier(.2,1.5,.4,1),scale .25s':'';if(anim)b.tt=setTimeout(function(){b.el.style.transition='';},400);b.el.style.translate=(x||y)?(x+'px '+y+'px'):'';}
  function collect(){
    var keys=[].slice.call(document.querySelectorAll('.b-panel .cabinets > .cab'));
    var list=SEL.map(function(s){return [s[0],document.querySelector(s[1])];});
    keys.forEach(function(k,i){list.push(['touche'+(i+1),k]);});
    var saved=load(),seen={};
    blocks=list.filter(function(x){return x[1]&&!seen[x[0]]&&(seen[x[0]]=1);}).map(function(x){
      var b={id:x[0],el:x[1],dx:0,dy:0};x[1].classList.add('b-mag');var s=saved[x[0]];if(s)put(b,s[0],s[1],false);return b;});
  }
  function of(t){for(var i=0;i<blocks.length;i++)if(blocks[i].el===t||blocks[i].el.contains(t))return blocks[i];return null;}
  /* l'aimant : bords contre bords, bords alignés, axes alignés ; et la place d'origine */
  function snap(b,x,y){
    var r=b.el.getBoundingClientRect(),w=r.width,h=r.height,l0=r.left-b.dx,t0=r.top-b.dy,L=l0+x,T=t0+y,bx=null,by=null,dbx=MAG+1,dby=MAG+1;
    if(Math.hypot(x,y)<HOME)return [0,0,true];
    blocks.forEach(function(o){if(o===b||!o.el.offsetParent)return;var q=o.el.getBoundingClientRect();if(!q.width)return;
      [[q.left,0],[q.right,0],[q.left,w],[q.right,w],[q.left+q.width/2,w/2]].forEach(function(c){var d=Math.abs(L+c[1]-c[0]);if(d<dbx){dbx=d;bx=c[0]-c[1]-l0;}});
      [[q.top,0],[q.bottom,0],[q.top,h],[q.bottom,h],[q.top+q.height/2,h/2]].forEach(function(c){var d=Math.abs(T+c[1]-c[0]);if(d<dby){dby=d;by=c[0]-c[1]-t0;}});
    });
    return [bx!=null?bx:x,by!=null?by:y,false];
  }
  function grab(b,e){drag.on=true;b.el.classList.add('b-held');root.classList.add('b-holding');
    try{b.el.setPointerCapture(e.pointerId);}catch(_){}
    if(navigator.vibrate)try{navigator.vibrate(12);}catch(_){}}
  function down(e){if(e.button>0||drag)return;var b=of(e.target);if(!b)return;
    drag={b:b,id:e.pointerId,x:e.clientX,y:e.clientY,dx:b.dx,dy:b.dy,on:false,touch:e.pointerType!=='mouse',t:0};
    if(drag.touch)drag.t=setTimeout(function(){if(drag&&!drag.on&&!drag.moved)grab(b,e);},LONG);}
  function move(e){if(!drag||e.pointerId!==drag.id)return;var mx=e.clientX-drag.x,my=e.clientY-drag.y;
    if(!drag.on){if(Math.hypot(mx,my)>8){if(drag.touch){drag.moved=true;clearTimeout(drag.t);drag=null;return;}grab(drag.b,e);}else return;}
    e.preventDefault();var s=snap(drag.b,drag.dx+mx,drag.dy+my);put(drag.b,s[0],s[1],false);drag.b.el.classList.toggle('b-docked',s[2]);}
  function up(e){if(!drag||e.pointerId!==drag.id)return;clearTimeout(drag.t);var d=drag;drag=null;
    if(!d.on)return;suppress=Date.now();d.b.el.classList.remove('b-held','b-docked');root.classList.remove('b-holding');
    var s=snap(d.b,d.b.dx,d.b.dy);put(d.b,s[0],s[1],true);save();}
  document.addEventListener('pointerdown',down,true);
  document.addEventListener('pointermove',move,{capture:true,passive:false});
  document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);
  document.addEventListener('touchmove',function(e){if(drag&&drag.on)e.preventDefault();},{capture:true,passive:false});
  document.addEventListener('contextmenu',function(e){if(drag||Date.now()-suppress<600){if(of(e.target))e.preventDefault();}},true);
  document.addEventListener('click',function(e){if(Date.now()-suppress<350&&of(e.target)){e.preventDefault();e.stopImmediatePropagation();}},true);
  /* un autre skin, d'autres places */
  new MutationObserver(function(){var saved=load();blocks.forEach(function(b){var s=saved[b.id]||[0,0];put(b,s[0],s[1],true);});}).observe(root,{attributes:true,attributeFilter:['data-skin']});
  function start(){collect();}
  if(document.readyState==='complete')setTimeout(start,700);else addEventListener('load',function(){setTimeout(start,700);});
})();
