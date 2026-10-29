/* Borne Insert Koin — la plante du toit, vivante.
   Elle respire doucement ; la main qui passe dans ses feuilles les froisse, dans le sens du geste, et elles reviennent en ressort ;
   deux tapes rapides l'arrosent : l'eau tombe en gouttes, la terre fonce puis sèche ; les feuilles mortes de l'automne et les pétales des mois en fleur
   tombent de temps en temps. Les touches EAU, SOLEIL et TAILLE restent, gravées sur une étiquette du pot. */
(function(){var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function go(){var pot=document.querySelector('.b-pot'),pl=pot&&pot.querySelector('.b-plant');if(!pot||!pl){setTimeout(go,600);return;}
    var A={a:0,v:0,run:false,lx:null,lt:0};
    function frame(){var k=120,c=7,dt=1/60;A.v+=(-A.a*k-A.v*c)*dt;A.a+=A.v*dt;pl.style.setProperty('--rs',A.a.toFixed(2)+'deg');
      if(Math.abs(A.a)>.05||Math.abs(A.v)>.05)requestAnimationFrame(frame);else{A.run=false;pl.style.setProperty('--rs','0deg');}}
    function kick(v){A.v+=v;if(!A.run){A.run=true;requestAnimationFrame(frame);}}
    var lastSnd=0;
    pot.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse'&&e.buttons===0&&e.pointerType!=='pen')return;var t=performance.now();
      if(A.lx!=null){var dx=e.clientX-A.lx,sp=dx/Math.max(8,t-A.lt);if(Math.abs(sp)>.25){kick(Math.max(-60,Math.min(60,sp*28)));
        if(t-lastSnd>140&&window.__borneSon){lastSnd=t;try{window.__borneSon.tick();}catch(_){}}}}A.lx=e.clientX;A.lt=t;});
    pot.addEventListener('pointerleave',function(){A.lx=null;});
    /* deux tapes rapides l'arrosent (l'appui long, lui, déplace la plante à l'aimant) */
    function water(){var c={};try{c=JSON.parse(localStorage.getItem('borne.plant')||'{}')||{};}catch(_){}c.water=Date.now();try{localStorage.setItem('borne.plant',JSON.stringify(c));}catch(_){}
      pot.classList.add('b-wet');setTimeout(function(){pot.classList.remove('b-wet');},9000);
      var b=pot.querySelector('[data-care=water]');if(b)b.click();
      if(!RM)for(var i=0;i<14;i++)(function(i){setTimeout(function(){var d=document.createElement('i');d.className='b-drop';d.style.left=(30+Math.random()*40)+'%';d.style.animationDuration=(.5+Math.random()*.35)+'s';pot.appendChild(d);setTimeout(function(){d.remove();},900);},i*55);})(i);}
    var lastUp=0;
    pot.addEventListener('pointerup',function(e){if(e.target.closest('[data-care]'))return;var t=performance.now();if(t-lastUp<380){lastUp=0;water();}else lastUp=t;});
    /* ce qui tombe, selon le mois de la plante */
    function season(){var img=pl.querySelector('img'),s=img?img.src:'';return /brumaire|assoiffee/.test(s)?'leaf':/floreal/.test(s)?'petal':/fructidor/.test(s)?'leaf':'';}
    function fall(){var k=season();if(k&&!RM&&!document.hidden){var f=document.createElement('i');f.className='b-fall b-'+k;f.style.left=(25+Math.random()*50)+'%';
        f.style.setProperty('--dx',((Math.random()*2-1)*40).toFixed(0)+'px');f.style.animationDuration=(3.5+Math.random()*2.5).toFixed(1)+'s';pot.appendChild(f);setTimeout(function(){f.remove();},6500);}
      setTimeout(fall,k==='petal'?9000+Math.random()*12000:14000+Math.random()*20000);}
    setTimeout(fall,6000);}
  go();})();
