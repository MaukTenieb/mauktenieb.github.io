/* SkopoRhogo dans la borne : la chambre suit l'heure du visiteur, à la minute exacte.
   À l'ouverture, la journée a déjà eu lieu : la simulation rejoue les heures écoulées depuis le matin (la veille au soir, la nuit).
   Ensuite, l'emploi du temps suit l'horloge réelle ; la marche et les gestes vont à vitesse naturelle.
   ?attract=1 : l'écran de la borne au repos. Glisser déplace, molette et pincement zooment, les boutons − et ＋ aussi ;
   un appui sur un Mask ouvre sa fiche dans un coin ; ⤢ ouvre SkopoRhogo en grand. */
(function(){
  var attract=/[?&]attract=1/.test(location.search);
  if(attract){var st=document.createElement('style');
    st.textContent='header,aside{display:none!important}main{display:block!important;margin:0!important;padding:0!important}'
      +'#stage{position:fixed!important;inset:0!important;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000}body{margin:0;overflow:hidden;background:#000}'
      +'#view{border:0!important;box-shadow:none!important;outline:0!important;flex:none!important;max-width:none!important;max-height:none!important;cursor:grab}'
      +'#card{position:fixed!important;right:10px;top:10px;z-index:20;width:min(300px,46vw);background:rgba(10,9,8,.86)!important;backdrop-filter:blur(3px);font-size:13px}'
      +'#card #hint{display:none!important}#card #cbody{grid-template-columns:72px 1fr!important}#card #pcv{width:72px!important;height:72px!important}#card #cname{font-size:20px!important}'
      +'#zoom{position:fixed!important;left:10px;bottom:10px;z-index:20;display:flex!important;gap:6px}#zoom button,.b-open{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,224,138,.5);background:rgba(10,9,8,.7);color:#ffe08a;font:18px/1 monospace;cursor:pointer}'
      +'.b-open{position:fixed;left:102px;bottom:10px;z-index:20}';
    document.head.appendChild(st);}
  function nowMin(){var d=new Date();return d.getHours()*60+d.getMinutes()+d.getSeconds()/60;}
  /* minutes du jeu : jour 1 à 00:00 = 0 ; le jour courant est le jour 2 */
  function target(){return 1440+nowMin();}
  function catchUp(to){var R=window.__room;if(!R)return;var g=to-R.tMin;if(g<=0)return;g=Math.min(g,26*60);
    /* rattrapage : la marche reprend le pas du jeu le temps de rejouer les heures */
    var w=window.__walk;window.__walk=1;while(g>0){var s=Math.min(g,.2);R.step(s);g-=s;}window.__walk=w;}
  function cover(){if(!attract)return;var v=document.getElementById('view');if(!v)return;var k=Math.max(innerWidth/800,innerHeight/500);
    v.style.setProperty('width',Math.ceil(800*k)+'px','important');v.style.setProperty('height',Math.ceil(500*k)+'px','important');}
  function init(){var R=window.__room;if(!R||!R.SPEEDS)return setTimeout(init,80);
    var m=nowMin();R.tMin=m>=390?1440+390:18*60;catchUp(target());
    /* l'horloge à la minute exacte ; la marche et les gestes à vitesse naturelle (×60 sur le temps du jeu) */
    R.SPEEDS[1]=1/60;window.__walk=60;R.setSpeed(1);
    setInterval(function(){var d=R.tMin-target();if(d>.5)R.tMin=target();else if(d<-.5)catchUp(target());},5000);
    if(attract){if(R.VIEW&&R.applyView){R.VIEW.z=1.25;R.applyView();}
      var zm=document.getElementById('zoom');if(zm)document.body.appendChild(zm);
      var cd=document.getElementById('card');if(cd)document.body.appendChild(cd);
      var op=document.createElement('button');op.className='b-open';op.type='button';op.textContent='⤢';op.setAttribute('aria-label','SkopoRhogo');
      op.onclick=function(){try{parent.postMessage({borne:'open'},'*');}catch(_){}};document.body.appendChild(op);
      pinch(R);}
    cover();addEventListener('resize',function(){setTimeout(cover,0);});setTimeout(cover,300);setTimeout(cover,1500);}
  /* pincement à deux doigts : la loupe suit les doigts */
  function pinch(R){var v=document.getElementById('view'),P={},d0=0;if(!v||!R.zoomAt)return;
    v.addEventListener('pointerdown',function(e){P[e.pointerId]=[e.clientX,e.clientY];var k=Object.keys(P);if(k.length===2){var a=P[k[0]],b=P[k[1]];d0=Math.hypot(a[0]-b[0],a[1]-b[1]);}});
    v.addEventListener('pointermove',function(e){if(!P[e.pointerId])return;P[e.pointerId]=[e.clientX,e.clientY];var k=Object.keys(P);if(k.length!==2||!d0)return;
      var a=P[k[0]],b=P[k[1]],d=Math.hypot(a[0]-b[0],a[1]-b[1]),r=v.getBoundingClientRect(),mx=((a[0]+b[0])/2-r.left)/r.width*2-1,my=-(((a[1]+b[1])/2-r.top)/r.height*2-1);
      if(Math.abs(d/d0-1)>.04){R.zoomAt(d/d0,mx,my);d0=d;}});
    ['pointerup','pointercancel'].forEach(function(t){v.addEventListener(t,function(e){delete P[e.pointerId];if(Object.keys(P).length<2)d0=0;});});}
  addEventListener('message',function(e){var R=window.__room,d=e.data||{};if(!R||!d.borne)return;
    if(d.borne==='sleep')R.setSpeed(0);else if(d.borne==='wake'){catchUp(target());window.__walk=60;R.setSpeed(1);}});
  if(document.readyState==='complete')init();else addEventListener('load',init);
})();
