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
  const clamp = n => Math.max(0,Math.min(1,n));
  const ease = n => (n=clamp(n))*n*(3-2*n);
  const phase = (p,a,b) => ease((p-a)/(b-a));
  const lerp = (a,b,t) => a+(b-a)*t;
  let frame = 0, lastChapter = -1, finishFocus = false, pointer = 0;
  let travel = 1, finished = false;
  function measure() { travel = Math.max(1,journey.offsetHeight-innerHeight); update(); }
  function update() {
    frame=0;
    const p = (reduced.matches || finished) ? 1 : clamp(scrollY/travel);
    const approach=phase(p,.03,.43), arrival=phase(p,.26,.52), end=phase(p,.86,.99);
    const css = {
      '--p':p, '--camera':lerp(1.02,1.08,approach), '--tilt':`${pointer*.7}deg`, '--land-scale':lerp(1,1.025,approach),
      '--land-y':`${-12*approach}px`, '--pan-x':`${pointer*3}px`, '--sun-y':`${20*approach}px`,
      '--left-x':`${-42*approach}%`, '--right-x':`${48*approach}%`, '--leaf-y':`${72*approach}px`,
      '--leaf-scale':lerp(1.25,1.02,approach), '--near-x':`${-160*approach}px`,
      '--couple-opacity':phase(p,.12,.27), '--couple-scale':1, '--couple-y':`${12*(1-arrival)}px`,
      '--haze':lerp(.95,.12,approach), '--vignette':lerp(.82,.18,approach), '--water-y':`${8*approach}px`,
      '--cue':1-phase(p,.01,.13), '--caption':phase(p,.75,.81)*(1-phase(p,.84,.88)), '--caption-y':`${10*(1-phase(p,.75,.81))}px`,
      '--reveal':end, '--reveal-y':`${24*(1-end)}px`
    };
    Object.entries(css).forEach(([key,value])=>root.style.setProperty(key,String(value)));
    // The people share the terrace's transform; their scale never changes.
    document.querySelector('#distant-plane').setAttribute('transform',`translate(${pointer*3} ${22*approach})`);
    document.querySelector('#courtyard-plane').setAttribute('transform',`translate(${pointer*8} ${-30*approach})`);
    document.querySelector('#water-plane').setAttribute('transform',`translate(${-42*approach+pointer*15} ${-48*approach})`);
    if(window.paintProposal)window.paintProposal(phase(p,.33,.76));
    const visible=end>.001,complete=end>.97;
    // Settle into a normal page after the opener, so input focus and mobile keyboards
    // cannot scrub the completed scene backwards or hide the invitation gate.
    if(complete && !finished){
      finished=true;journey.classList.add('is-finished');
      window.scrollTo({top:0,behavior:'instant'});
    }
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
  addEventListener('painted-poses-ready',queue);
  addEventListener('resize',measure);
  reduced.addEventListener('change',measure);
  stage.addEventListener('pointermove',e=>{if(finePointer.matches&&!reduced.matches){const r=stage.getBoundingClientRect();pointer=(e.clientX-r.left)/r.width-.5;queue();}});
  stage.addEventListener('pointerleave',()=>{pointer=0;queue();});
  skip.addEventListener('click',()=>{finishFocus=true;window.scrollTo({top:journey.offsetTop + travel,behavior:reduced.matches?'instant':'smooth'});queue();});
  replay.addEventListener('click',()=>{finishFocus=false;finished=false;journey.classList.remove('is-finished');window.scrollTo({top:0,behavior:'instant'});measure();skip.focus({preventScroll:true});});
  // Avoid restoring a browser's old invitation anchor midway through this new experience.
  if(location.hash){history.replaceState(null,'',location.pathname+location.search);}
  history.scrollRestoration='manual';
  measure();
})();
