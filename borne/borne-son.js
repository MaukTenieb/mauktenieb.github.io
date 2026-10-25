/* Borne Insert Koin — les sons de la mécanique.
   Tout est synthétisé à la volée (Web Audio), avec du hasard à chaque coup : hauteur, timbre, phase, petits retards.
   Touches qui s'enfoncent et remontent, micro-contacts, ressort de la manette, butée, crans des molettes, Koin qui sonne et tombe,
   TILT de Baku Boom, aspiration et claquement des blocs aimantés ; la machine ronronne et s'échauffe un peu quand on joue.
   Le bouton FX de la porte coupe tout. */
(function(){
  var C=null,M=null,hum=null,heat=0,R=Math.random;
  function on(){try{return !window.__ikFx||window.__ikFx.on();}catch(e){return true;}}
  function ctx(){if(!on())return null;if(!C){try{C=new (window.AudioContext||window.webkitAudioContext)();M=C.createGain();M.gain.value=.9;M.connect(C.destination);}catch(e){return null;}}
    if(C.state==='suspended')C.resume();return C;}
  function j(v,p){return v*(1+(R()*2-1)*(p||.08));}
  function env(g,t,a,d,peak){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);}
  var NB=null;function nbuf(c){if(NB)return NB;NB=c.createBuffer(1,c.sampleRate*.5,c.sampleRate);var d=NB.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=R()*2-1;return NB;}
  function noise(c,t,type,f,q,a,d,peak){var s=c.createBufferSource();s.buffer=nbuf(c);s.playbackRate.value=j(1,.2);var fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;
    var g=c.createGain();env(g,t,a,d,peak);s.connect(fl);fl.connect(g);g.connect(M);s.start(t,R()*.3);s.stop(t+a+d+.05);}
  function osc(c,t,type,f,f2,a,d,peak,ph){var o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+a+d);
    var g=c.createGain();env(g,t,a,d,peak);if(ph){var p=c.createStereoPanner?c.createStereoPanner():null;if(p){p.pan.value=ph;o.connect(g);g.connect(p);p.connect(M);}else{o.connect(g);g.connect(M);}}else{o.connect(g);g.connect(M);}
    o.start(t+R()*.004);o.stop(t+a+d+.05);}
  function warm(x){heat=Math.min(1,heat+x);}
  var S={
    press:function(){var c=ctx();if(!c)return;var t=c.currentTime;osc(c,t,'sine',j(120),j(70),.002,.09,.22);noise(c,t,'lowpass',j(900,.3),.8,.001,.06,.18);noise(c,t+.004,'bandpass',j(4200,.2),3,.0005,.012,.08);warm(.05);},
    release:function(){var c=ctx();if(!c)return;var t=c.currentTime;noise(c,t,'bandpass',j(3600,.25),4,.0005,.01,.09);osc(c,t+.01,'triangle',j(260),j(180),.001,.035,.05);},
    tick:function(){var c=ctx();if(!c)return;var t=c.currentTime;noise(c,t,'highpass',j(5000,.2),1,.0005,.008,.07);},
    detent:function(n){var c=ctx();if(!c)return;var t=c.currentTime;for(var i=0;i<(n||3);i++){noise(c,t+i*j(.045,.3),'bandpass',j(2600,.25),6,.0005,.012,.1);}},
    knock:function(f){var c=ctx();if(!c)return;var t=c.currentTime;f=f||.6;noise(c,t,'lowpass',j(700,.3),1,.001,.07,.25*f);osc(c,t,'square',j(95),j(60),.001,.05,.05*f);noise(c,t+.003,'bandpass',j(3000,.3),5,.0005,.015,.08*f);warm(.08*f);},
    twang:function(x){var c=ctx();if(!c)return;var t=c.currentTime,f=j(230+Math.abs(x||1)*90,.12);
      var o=c.createOscillator(),g=c.createGain(),l=c.createOscillator(),lg=c.createGain();o.type='sine';o.frequency.value=f;l.frequency.value=j(17,.3);lg.gain.value=f*.04;l.connect(lg);lg.connect(o.frequency);
      env(g,t,.003,.38,.07);o.connect(g);g.connect(M);o.start(t);l.start(t);o.stop(t+.45);l.stop(t+.45);noise(c,t,'bandpass',j(1800,.3),8,.001,.05,.05);},
    coin:function(){var c=ctx();if(!c)return;var t=c.currentTime;[2093,3389,4790].forEach(function(f,i){osc(c,t+i*.002,'sine',j(f,.03),0,.001,j(.5,.2)/(i+1),.07/(i+1),(R()*2-1)*.3);});warm(.04);},
    drop:function(){var c=ctx();if(!c)return;var t=c.currentTime,n=3+Math.floor(R()*3);for(var i=0;i<n;i++){var u=t+.05+i*j(.06,.4)*(1-i*.12);noise(c,u,'bandpass',j(3200,.3),9,.0005,.02,.09*(1-i*.15));}
      osc(c,t+.05+n*.06,'sine',j(150),j(80),.002,.12,.18);},
    tilt:function(){var c=ctx();if(!c)return;var t=c.currentTime;
      /* le TILT : un bourdon de relais, le tremblé du solénoïde, puis le coup sourd */
      var o=c.createOscillator(),g=c.createGain(),tr=c.createOscillator(),tg=c.createGain();o.type='sawtooth';o.frequency.value=j(110,.04);tr.frequency.value=j(22,.2);tg.gain.value=.05;tr.connect(tg);tg.connect(g.gain);
      var fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=j(1400,.2);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.08,t+.02);g.gain.setValueAtTime(.08,t+.62);g.gain.exponentialRampToValueAtTime(.0001,t+.9);
      o.connect(fl);fl.connect(g);g.connect(M);o.start(t);tr.start(t);o.stop(t+.95);tr.stop(t+.95);
      for(var i=0;i<4;i++)noise(c,t+i*j(.13,.25),'bandpass',j(2400,.3),4,.0005,.03,.12);
      noise(c,t+.7,'lowpass',j(260,.2),1,.004,.5,.35);osc(c,t+.7,'sine',j(55),j(32),.004,.55,.3);warm(.3);},
    suck:function(){var c=ctx();if(!c)return;var t=c.currentTime,s=c.createBufferSource();s.buffer=nbuf(c);var fl=c.createBiquadFilter();fl.type='bandpass';fl.Q.value=3;fl.frequency.setValueAtTime(j(400),t);fl.frequency.exponentialRampToValueAtTime(j(2600),t+.16);
      var g=c.createGain();env(g,t,.06,.12,.08);s.connect(fl);fl.connect(g);g.connect(M);s.start(t);s.stop(t+.25);},
    clack:function(){var c=ctx();if(!c)return;var t=c.currentTime;noise(c,t,'bandpass',j(1700,.25),3,.0008,.03,.16);osc(c,t,'sine',j(180),j(110),.001,.06,.1);}
  };
  window.__borneSon=S;
  /* la machine s'échauffe : un ronronnement très bas, qui monte un peu quand on joue et retombe ensuite */
  function startHum(){var c=ctx();if(!c||hum)return;var o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();o.type='sine';o.frequency.value=50;o2.type='sine';o2.frequency.value=100.3;
    fl.type='lowpass';fl.frequency.value=180;g.gain.value=0;o.connect(fl);o2.connect(fl);fl.connect(g);g.connect(M);o.start();o2.start();hum={g:g,o2:o2};
    setInterval(function(){if(!hum||!C)return;var t=C.currentTime,lv=on()?.004+heat*.018:0;hum.g.gain.setTargetAtTime(lv,t,.4);hum.o2.frequency.setTargetAtTime(100+(R()-.5)*.8+heat*1.5,t,.8);heat*=.94;},250);}
  var first=true;
  /* les gestes */
  function closest(e,s){return e.target&&e.target.closest?e.target.closest(s):null;}
  document.addEventListener('pointerdown',function(e){if(first){first=false;startHum();}
    var k=closest(e,'.b-panel .cab, .b-row2 .menu a, .b-slot, .b-badge, .b-land, .b-lore, #koins, .b-boom');if(!k)return;
    if(k.matches('.b-panel .cab, .b-row2 .menu a')){S.press();k.classList.remove('b-up');k.classList.add('b-down');}
    else if(k.matches('.b-boom')){}
    else S.tick();},true);
  function up(e){document.querySelectorAll('.b-down').forEach(function(k){k.classList.remove('b-down');void k.offsetWidth;k.classList.add('b-up');setTimeout(function(){k.classList.remove('b-up');},420);S.release();});}
  document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);
  document.addEventListener('click',function(e){if(closest(e,'.b-knob'))S.detent(2+Math.floor(R()*3));if(closest(e,'.b-boom'))S.tilt();if(closest(e,'.b-slot')){S.coin();setTimeout(S.drop,260);}},true);
})();
