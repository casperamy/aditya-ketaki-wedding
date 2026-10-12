(() => {
  'use strict';
  const root = document.documentElement;
  const journey = document.querySelector('#journey');
  const stage = document.querySelector('#stage');
  const reveal = document.querySelector('#reveal');
  const skip = document.querySelector('#skip');
  const replay = document.querySelector('#replay');
  const description = document.querySelector('#scene-description');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const ids = ['man-upper','woman-head','back-leg','back-leg-ink','front-leg','front-leg-ink','back-crease','front-crease','back-shoe','front-shoe','man-shadow','man-arm','man-arm-ink','man-arm-seam','man-far-arm','man-far-arm-ink','man-hand','woman-arm','woman-arm-fill','woman-hand','ring','ring-glint'];
  const parts = Object.fromEntries(ids.map(id => [id,document.getElementById(id)]));
  const clamp = n => Math.max(0,Math.min(1,n));
  const ease = n => (n=clamp(n))*n*(3-2*n);
  const phase = (p,a,b) => ease((p-a)/(b-a));
  const lerp = (a,b,t) => a+(b-a)*t;
  const point = (a,b,t) => [lerp(a[0],b[0],t),lerp(a[1],b[1],t)];
  const fmt = v => v.map(n=>n.toFixed(2)).join(' ');
  const attr = (id,key,value) => parts[id].setAttribute(key,value);
  const path = (id,value) => attr(id,'d',value);
  let frame = 0, lastChapter = -1, finishFocus = false, pointer = 0;
  let travel = 1;
  function measure() { travel = Math.max(1,journey.offsetHeight-innerHeight); update(); }
  function pose(p) {
    const k = phase(p,.36,.70);
    const reach = phase(p,.52,.75);
    const hip = point([205,315],[207,410],k);
    // A small anticipation precedes the descent. Feet remain at ground level.
    const anticipation = Math.sin(phase(p,.29,.39)*Math.PI)*4;
    const angle = lerp(0,7,k) + anticipation;
    attr('man-upper','transform',`translate(${fmt(hip)}) rotate(${angle})`);
    attr('woman-head','transform',`rotate(${-7*reach} 401 180)`);
    const leftHip = [hip[0]-18,hip[1]+6], rightHip = [hip[0]+19,hip[1]+6];
    const leftKnee = point([187,405],[204,488],k);
    const rightKnee = point([254,407],[292,409],k);
    const leftAnkle = point([180,496],[128,496],phase(p,.39,.65));
    const rightAnkle = [271,496];
    const legD = (h,k,a) => `M${fmt(h)} Q${fmt(point(h,k,.7))} ${fmt(k)} L${fmt(a)}`;
    const backD=legD(leftHip,leftKnee,leftAnkle),frontD=legD(rightHip,rightKnee,rightAnkle);
    ['back-leg','back-leg-ink'].forEach(id=>path(id,backD));
    ['front-leg','front-leg-ink'].forEach(id=>path(id,frontD));
    path('back-crease',`M${fmt(point(leftHip,leftKnee,.22))} L${fmt(point(leftHip,leftKnee,.83))}`);
    path('front-crease',`M${fmt(point(rightHip,rightKnee,.22))} L${fmt(point(rightHip,rightKnee,.83))}`);
    attr('back-shoe','transform',`translate(${fmt(leftAnkle)}) rotate(${-12*k})`);
    attr('front-shoe','transform',`translate(${fmt(rightAnkle)})`);
    attr('man-shadow','cx',lerp(222,206,k));attr('man-shadow','rx',lerp(77,113,k));
    const rad=angle*Math.PI/180;
    const anchored = (x,y) => [hip[0]+x*Math.cos(rad)-y*Math.sin(rad),hip[1]+x*Math.sin(rad)+y*Math.cos(rad)];
    const shoulder = anchored(24,-111);
    const elbow = point([255,272],[290,350],k);
    const hand = point([274,309],[346,353],reach);
    // The elbow leads the hand as he offers the ring, rather than stretching the torso.
    const armD=`M${fmt(shoulder)} Q${fmt(point(shoulder,elbow,.75))} ${fmt(elbow)} L${fmt([hand[0]-12,hand[1]+2])}`;
    ['man-arm','man-arm-ink','man-arm-seam'].forEach(id=>path(id,armD));
    const farShoulder=anchored(-26,-102),farElbow=point([208,281],[251,376],k),farHand=[hand[0]-17,hand[1]+13];
    const farD=`M${fmt(farShoulder)} Q${fmt(point(farShoulder,farElbow,.8))} ${fmt(farElbow)} L${fmt(farHand)}`;
    ['man-far-arm','man-far-arm-ink'].forEach(id=>path(id,farD));
    attr('man-hand','transform',`translate(${fmt(hand)}) rotate(${-8*reach})`);
    attr('ring','transform',`translate(${hand[0]+4} ${hand[1]-15})`);
    attr('ring','opacity',phase(p,.49,.61));
    attr('ring-glint','opacity',Math.sin(phase(p,.69,.80)*Math.PI));
    const womanHand=point([386,306],[350,352],phase(p,.64,.79));
    const womanElbow=point([357,280],[354,302],reach);
    const womanD=`M363 233 Q${fmt(womanElbow)} ${fmt([womanHand[0]+3,womanHand[1]-4])}`;
    ['woman-arm','woman-arm-fill'].forEach(id=>path(id,womanD));
    attr('woman-hand','transform',`translate(${fmt(womanHand)}) rotate(${30*reach})`);
  }
  function update() {
    frame=0;
    const p = reduced.matches ? 1 : clamp(scrollY/travel);
    const approach=phase(p,.03,.43), arrival=phase(p,.26,.52), end=phase(p,.86,.99);
    const css = {
      '--p':p, '--camera':lerp(1.02,1.08,approach), '--tilt':`${pointer*.7}deg`, '--land-scale':lerp(1,1.025,approach),
      '--land-y':`${-12*approach}px`, '--pan-x':`${pointer*3}px`, '--sun-y':`${20*approach}px`,
      '--left-x':`${-42*approach}%`, '--right-x':`${48*approach}%`, '--leaf-y':`${72*approach}px`,
      '--leaf-scale':lerp(1.25,1.02,approach), '--near-x':`${-160*approach}px`,
      '--couple-opacity':phase(p,.12,.27), '--couple-scale':lerp(.69,1.08,arrival), '--couple-y':`${12*(1-arrival)}px`,
      '--haze':lerp(.95,.12,approach), '--vignette':lerp(.82,.18,approach), '--water-y':`${8*approach}px`,
      '--cue':1-phase(p,.01,.13), '--caption':phase(p,.75,.81)*(1-phase(p,.84,.88)), '--caption-y':`${10*(1-phase(p,.75,.81))}px`,
      '--reveal':end, '--reveal-y':`${24*(1-end)}px`
    };
    Object.entries(css).forEach(([key,value])=>root.style.setProperty(key,String(value)));
    pose(p);
    const visible=end>.001,complete=end>.97;
    reveal.classList.toggle('is-visible',visible);reveal.classList.toggle('is-complete',complete);
    reveal.setAttribute('aria-hidden',String(!complete));reveal.inert=!complete;
    skip.hidden=complete;
    const chapter=complete?3:p>.68?2:p>.25?1:0;
    if(chapter!==lastChapter){
      description.textContent=[
        'A garden waits beyond the leaves. Scroll to enter, or use Skip to the reveal.',
        'The leaves part. A couple stands together in a Maharashtrian garden courtyard.',
        'He lowers onto one knee and offers a ring. She reaches for his hand.',
        'Aditya and Ketaki. Their wedding is on 27 December 2026, in Sunol, California.'
      ][chapter];lastChapter=chapter;
    }
    if(complete && finishFocus){document.querySelector('#names').focus({preventScroll:true});finishFocus=false;}
  }
  function queue(){if(!frame)frame=requestAnimationFrame(update);}
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',measure);
  reduced.addEventListener('change',measure);
  stage.addEventListener('pointermove',e=>{if(finePointer.matches&&!reduced.matches){const r=stage.getBoundingClientRect();pointer=(e.clientX-r.left)/r.width-.5;queue();}});
  stage.addEventListener('pointerleave',()=>{pointer=0;queue();});
  skip.addEventListener('click',()=>{finishFocus=true;window.scrollTo({top:document.documentElement.scrollHeight,behavior:reduced.matches?'instant':'smooth'});queue();});
  replay.addEventListener('click',()=>{finishFocus=false;window.scrollTo({top:0,behavior:'instant'});update();skip.focus({preventScroll:true});});
  // Avoid restoring a browser's old invitation anchor midway through this new experience.
  if(location.hash){history.replaceState(null,'',location.pathname+location.search);}
  history.scrollRestoration='manual';
  measure();
})();
