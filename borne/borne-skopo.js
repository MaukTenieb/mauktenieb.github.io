/* Skoporhogo dans la borne : la chambre suit l'heure du visiteur, en temps réel.
   À l'ouverture, la journée des Masks a déjà eu lieu : la simulation rejoue les heures écoulées
   depuis le matin (depuis la veille au soir, la nuit), puis avance au rythme de l'horloge.
   ?attract=1 : écran titre de la borne, sans réglages ni fiches ; la molette et le pincement zooment. */
(function(){
  var attract=/[?&]attract=1/.test(location.search);
  if(attract){var st=document.createElement('style');
    st.textContent='header,aside{display:none!important}main{display:block!important;margin:0!important;padding:0!important}#stage{position:fixed!important;inset:0!important;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000}body{margin:0;overflow:hidden;background:#000}#view{border:0!important;box-shadow:none!important;outline:0!important;flex:none!important;max-width:none!important;max-height:none!important}';
    document.head.appendChild(st);}
  function nowMin(){var d=new Date();return d.getHours()*60+d.getMinutes()+d.getSeconds()/60;}
  /* minutes du jeu : jour 1 à 00:00 = 0 ; le jour courant est le jour 2 */
  function target(){return 1440+nowMin();}
  function catchUp(to){var R=window.__room;if(!R)return;var g=to-R.tMin;if(g<=0)return;g=Math.min(g,26*60);
    while(g>0){var s=Math.min(g,.2);R.step(s);g-=s;}}
  function cover(){if(!attract)return;var v=document.getElementById('view');if(!v)return;var k=Math.max(innerWidth/800,innerHeight/500);
    v.style.setProperty('width',Math.ceil(800*k)+'px','important');v.style.setProperty('height',Math.ceil(500*k)+'px','important');}
  function init(){var R=window.__room;if(!R||!R.SPEEDS)return setTimeout(init,80);
    var m=nowMin();R.tMin=m>=390?1440+390:18*60;catchUp(target());
    R.SPEEDS[1]=1/60;R.setSpeed(1);
    /* l'écran 4:3 de la borne : la chambre l'emplit */
    if(attract&&R.VIEW&&R.applyView){R.VIEW.z=1.15;R.applyView();}
    cover();addEventListener('resize',function(){setTimeout(cover,0);});setTimeout(cover,300);setTimeout(cover,1500);
    setInterval(function(){var d=target()-R.tMin;if(Math.abs(d)>2){if(d>0)catchUp(target());else R.tMin=target();}},30000);}
  addEventListener('message',function(e){var R=window.__room,d=e.data||{};if(!R||!d.borne)return;
    if(d.borne==='sleep')R.setSpeed(0);else if(d.borne==='wake'){catchUp(target());R.setSpeed(1);}});
  if(document.readyState==='complete')init();else addEventListener('load',init);
})();
