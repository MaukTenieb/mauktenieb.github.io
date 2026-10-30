/* Borne Insert Koin — l'essai : ce que la session propose, visible en ligne à côté de la borne telle qu'elle est.
   https://mauktenieb.github.io/borne/?essai : la vitre tirée des images attente-25 et attente-07, le bandeau Burrows dans la lumière du meuble,
   les pictogrammes gravés de BC, TL, IG et PL, la barre sous l'écran en objets de borne (compteur à rouleaux, voyant, afficheur du Motel Sound,
   manette, objectif de Kapture, Baku Boom ; Immersion au double toucher sur l'écran). L'adresse sans ?essai garde la borne actuelle. */
(function(){if(!/[?&]essai\b/.test(location.search))return;
  var R=document.documentElement;R.classList.add('b-essai');
  var css=document.createElement('style');css.id='b-essai-css';css.textContent=[
    /* 1. la vitre */
    "html.borne.b-essai .b-bezel .b-screen::before{border-image-source:url(art-bezel-burrows.webp)!important}",
    /* 2. le bandeau Burrows : tirage sépia, la lumière de l'enseigne par le haut, l'ombre en bas */
    "html.borne.b-essai .b-land{filter:sepia(.62) saturate(1.35) brightness(.92) contrast(1.08)!important}",
    "html.borne.b-essai[data-skin=metal] .b-land{filter:sepia(.35) saturate(1.1) brightness(.9) contrast(1.1)!important}",
    "html.borne.b-essai .b-land::before{background:linear-gradient(180deg,rgba(255,176,96,.30) 0%,rgba(255,176,96,.06) 38%,rgba(0,0,0,0) 60%,rgba(0,0,0,.45) 100%),linear-gradient(90deg,rgba(0,0,0,.5),transparent 45%)!important;z-index:1}",
    /* 3. pictogrammes gravés */
    "html.borne.b-essai .b-ico{display:inline-block;width:12px;height:12px;vertical-align:-1px;margin-right:4px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round;opacity:.85;filter:drop-shadow(0 1px 0 rgba(0,0,0,.9)) drop-shadow(0 -1px 0 rgba(255,240,210,.15))}",
    /* 4. la barre : compteur à rouleaux */
    "html.borne.b-essai #koins{background:none!important;border:0!important;box-shadow:none!important;padding:0 6px!important;gap:8px!important;display:inline-flex!important;align-items:center}",
    "html.borne.b-essai #koins>*:not(.b-kicon):not(.b-drums):not(.b-kcount){display:none!important}",
    "html.borne.b-essai #koins .b-kicon{width:22px!important;height:22px!important}",
    "html.borne.b-essai #koins::before{display:none!important}",
    "html.borne.b-essai .b-drums{display:inline-flex;gap:2px;padding:3px;background:#050404;border-radius:3px;box-shadow:inset 0 2px 4px #000,0 0 0 1px #3a322b}",
    "html.borne.b-essai .b-drums i{width:18px;height:30px;display:grid;place-items:center;font:22px/1 'Bebas Neue',Impact,sans-serif;font-style:normal;color:#f2ede3;background:linear-gradient(#1a1715 0%,#2c2724 18%,#3a3430 50%,#2c2724 82%,#151210 100%);border-radius:2px;text-shadow:0 1px 0 #000;transition:transform .25s cubic-bezier(.5,1.6,.5,1)}",
    "html.borne.b-essai .b-drums i.b-roll{transform:translateY(-3px)}",
    "html.borne.b-essai .b-kcount{font:12px 'Press Start 2P',monospace;color:#ffa726;text-shadow:0 0 6px rgba(255,160,40,.6)}",
    /* voyant des Applicants */
    "html.borne.b-essai .b-online{display:inline-flex!important;align-items:center;gap:8px;color:#9fb79a!important;font:13px 'DM Mono',monospace!important}",
    "html.borne.b-essai .b-online i{width:9px!important;height:9px!important;border-radius:50%;background:radial-gradient(circle at 40% 35%,#d9ffcf,#46d14a 45%,#1d6b22)!important;box-shadow:0 0 8px 2px rgba(80,230,90,.55)!important}",
    "html.borne.b-essai .b-online span{font:12px 'Bebas Neue',sans-serif!important;letter-spacing:.18em!important;color:#6f675d!important;text-transform:uppercase}",
    /* afficheur du Motel Sound */
    "html.borne.b-essai .b-vfd{flex:1 1 0;width:0;max-width:100%;contain:inline-size;min-width:0;height:30px;display:flex;align-items:center;gap:10px;margin:0 14px;padding:0 12px;background:#060504;border:0;border-radius:3px;box-shadow:inset 0 2px 5px #000,0 0 0 1px #3a322b;overflow:hidden;cursor:pointer;color:inherit}",
    "html.borne.b-essai .b-vfd s{flex:none;width:20px;height:20px;border-radius:50%;background:repeating-radial-gradient(circle,#2b2522 0 2px,#0c0a09 2px 4px);box-shadow:0 0 0 1px #3a322b}",
    "html.borne.b-essai .b-vfd.on s{box-shadow:0 0 0 1px #ffa726,0 0 8px rgba(255,167,38,.5)}",
    "html.borne.b-essai .b-vfd b{min-width:0;flex:1 1 auto;font:22px/1 VT323,monospace;color:#ffb24a;text-shadow:0 0 6px rgba(255,160,40,.7);white-space:nowrap;letter-spacing:.04em;overflow:hidden;text-overflow:ellipsis}",
    "html.borne.b-essai .b-vfd:not(.on) b{color:#7a5a2a;text-shadow:none}",
    "@media (max-width:520px){html.borne.b-essai .b-vfd em{display:none}html.borne.b-essai .b-vfd{margin:0 6px;padding:0 8px}}",
    "html.borne.b-essai .b-vfd em{flex:none;font:12px 'Bebas Neue',sans-serif;font-style:normal;letter-spacing:.2em;color:#7a5a2a}",
    /* ce qui part : le son et PL rejoignent l'afficheur, Immersion passe au double toucher */
    "html.borne.b-essai .b-px-son,html.borne.b-essai .b-px-pl,html.borne.b-essai .b-imm{display:none!important}",
    /* l'objectif de Kapture */
    "html.borne.b-essai .b-px-kap{width:30px!important;height:30px!important;border-radius:50%!important;border:0!important;background:radial-gradient(circle at 38% 34%,#7fa8d8 0 8%,#1b2f4a 22%,#05070b 48%,#1c1a18 50%,#3a332d 62%,#151210 76%)!important;box-shadow:0 0 0 2px #2a2420,0 2px 4px #000!important}",
    "html.borne.b-essai .b-px-kap svg{display:none}"
  ].join('\n');document.head.appendChild(css);

  var ICO={BC:'<circle cx="8" cy="8" r="6.2"/><circle cx="8" cy="8" r="1.6"/><path d="M8 3.6a4.4 4.4 0 0 1 4.4 4.4"/>',
    TL:'<path d="M5.2 2.5 2 4.4l1.4 2.6 1.6-.8V13.5h6V6.2l1.6.8L14 4.4 10.8 2.5c-.4 1-1.5 1.7-2.8 1.7S5.6 3.5 5.2 2.5z"/>',
    IG:'<rect x="2.5" y="2.5" width="11" height="11" rx="3"/><circle cx="8" cy="8" r="2.7"/><circle cx="11.4" cy="4.6" r=".6"/>',
    PL:'<path d="M3 4.5h10M3 8h10M3 11.5h6"/>'};
  function pictos(){document.querySelectorAll('.b-panel .menu a, button').forEach(function(e){if(e.querySelector('.b-ico'))return;
    var tn=[].find.call(e.childNodes,function(n){return n.nodeType===3&&ICO[n.nodeValue.trim()];});if(!tn)return;
    var t=tn.nodeValue.trim(),s=document.createElement('span');s.innerHTML='<svg class="b-ico" viewBox="0 0 16 16" aria-hidden="true">'+ICO[t]+'</svg>'+t;e.replaceChild(s,tn);});}

  function drums(){var k=document.getElementById('koins'),kn=document.getElementById('kn');if(!k||!kn)return false;
    var d=k.querySelector('.b-drums');if(!d){d=document.createElement('span');d.className='b-drums';d.setAttribute('aria-hidden','true');k.appendChild(d);
      var c=document.createElement('span');c.className='b-kcount';k.appendChild(c);}
    var c2=k.querySelector('.b-kcount'),t=(kn.textContent||'').trim(),m=t.match(/^(\d+)(?:\s*·\s*(\d+)\s*s)?/);if(!m)return true;
    var v=('0'+m[1]).slice(-2);if(d.dataset.v!==v){var old=d.dataset.v||'';d.innerHTML='';v.split('').forEach(function(ch,i){var x=document.createElement('i');x.textContent=ch;if(old&&old[i]!==ch)x.classList.add('b-roll');d.appendChild(x);});d.dataset.v=v;
      setTimeout(function(){[].forEach.call(d.children,function(x){x.classList.remove('b-roll');});},260);}
    c2.textContent=m[2]?m[2]+'s':'';return true;}

  function vfd(){var foot=document.querySelector('.b-bezelfoot'),on=foot&&foot.querySelector('.b-online');if(!foot||!on)return false;if(foot.querySelector('.b-vfd'))return true;
    var bell=document.querySelector('.b-bell'),pl=document.getElementById('export-pl');
    var v=document.createElement('button');v.type='button';v.className='b-vfd';v.setAttribute('aria-label','Motel Sound');v.innerHTML='<s></s><b></b><em>MOTEL SOUND</em>';
    on.parentNode.insertBefore(v,on.nextSibling);
    function sync(){var l=document.querySelector('.motel-l');v.querySelector('b').textContent=((l&&l.textContent||'').split('◆')[0]).trim()||'MOTEL SOUND';v.classList.toggle('on',!!(bell&&bell.classList.contains('on')));}
    sync();setInterval(sync,1000);
    var t=0,long=false;v.addEventListener('pointerdown',function(){long=false;t=setTimeout(function(){long=true;if(pl)pl.click();},600);});
    v.addEventListener('pointerup',function(){clearTimeout(t);});v.addEventListener('pointerleave',function(){clearTimeout(t);});
    v.addEventListener('click',function(e){e.stopPropagation();if(long)return;if(bell)bell.click();setTimeout(sync,80);});
    return true;}

  /* Immersion : deux touchers rapides sur l'écran, hors de la surface de jeu (canevas, cases, boutons du jeu restent au jeu) ; au clavier, la touche F */
  var lastTap=0;function imm(){var b=document.querySelector('.b-imm');if(b)b.click();}
  document.addEventListener('pointerup',function(e){var g=document.querySelector('.b-glass');if(!g||!g.contains(e.target))return;
    if(e.target.closest('canvas,button,a,input,select,textarea,[data-action],.cab,.spot'))return;var n=Date.now();
    if(n-lastTap<320){lastTap=0;imm();}else lastTap=n;},true);
  addEventListener('keydown',function(e){if((e.key==='f'||e.key==='F')&&!e.ctrlKey&&!e.metaKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName||''))imm();});

  function tick(){pictos();drums();vfd();}
  setInterval(tick,500);tick();
})();
