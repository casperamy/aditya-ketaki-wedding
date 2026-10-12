(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const states=new Map();
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};

 // Deform only the painted trunk. The body, tusks, feet and textile stay anchored.
 function elephantPainter(element){
  const source=element.querySelector('img'),canvas=element.querySelector('canvas');
  const ctx=canvas.getContext('2d');
  if(!ctx)return null;
  const W=1536,H=1024,patchX=1120,patchBottom=560,cols=12,rows=16;
  const sx=canvas.width/W,sy=canvas.height/H;
  const grid=[];
  for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++){
   const x=patchX+(W-patchX)*col/cols,y=patchBottom*row/rows;
   // Smooth falloff prevents a hinge line where the trunk meets the face.
   const influence=smooth((x-1200)/170)*(1-smooth((y-340)/80));
   grid.push({p:[x,y],influence});
  }
  function triangle(from,to){
   const [s0,s1,s2]=from,[d0,d1,d2]=to;
   const x1=s1[0]-s0[0],y1=s1[1]-s0[1],x2=s2[0]-s0[0],y2=s2[1]-s0[1],det=x1*y2-x2*y1;
   const a=((d1[0]-d0[0])*y2-(d2[0]-d0[0])*y1)/det;
   const b=((d1[1]-d0[1])*y2-(d2[1]-d0[1])*y1)/det;
   const c=(x1*(d2[0]-d0[0])-x2*(d1[0]-d0[0]))/det;
   const d=(x1*(d2[1]-d0[1])-x2*(d1[1]-d0[1]))/det;
   ctx.save();ctx.beginPath();
   const cx=(d0[0]+d1[0]+d2[0])/3,cy=(d0[1]+d1[1]+d2[1])/3;
   to.forEach((p,i)=>{const x=cx+(p[0]-cx)*1.015,y=cy+(p[1]-cy)*1.015;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
   ctx.closePath();ctx.clip();
   ctx.transform(a,b,c,d,d0[0]-a*s0[0]-c*s0[1],d0[1]-b*s0[0]-d*s0[1]);
   ctx.drawImage(source,0,0,W,H);ctx.restore();
  }
  function draw(amount){
   if(!source.complete||!source.naturalWidth)return false;
   ctx.setTransform(sx,0,0,sy,0,0);ctx.clearRect(0,0,W,H);
   if(amount<.001){ctx.drawImage(source,0,0,W,H);return true;}
   ctx.drawImage(source,0,0,patchX,H,0,0,patchX,H);
   ctx.drawImage(source,patchX,patchBottom,W-patchX,H-patchBottom,patchX,patchBottom,W-patchX,H-patchBottom);
   const target=grid.map(({p:[x,y],influence})=>{
    const angle=-.14*amount*influence,px=x-1210,py=y-410;
    return [1210+px*Math.cos(angle)-py*Math.sin(angle),410+px*Math.sin(angle)+py*Math.cos(angle)];
   });
   for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const a=row*(cols+1)+col,b=a+1,c=a+cols+1,d=c+1;
    for(const ids of [[a,b,c],[b,d,c]])triangle(ids.map(i=>grid[i].p),ids.map(i=>target[i]));
   }
   return true;
  }
  return {draw,source};
 }

 // Read the untransformed section/art bounds; motion is a direct function of scroll.
 // There are no timers, playback loops, hover triggers, or entrance bursts.
 const clamp=n=>Math.max(0,Math.min(1,n));
 let frame=0;
 function update(){
  frame=0;
  if(document.hidden)return;
  const height=document.documentElement.clientHeight;
  states.forEach(state=>{
   const {element,type,anchor}=state;
   if(!element.getClientRects().length)return;
   const rect=anchor.getBoundingClientRect();
   if(!reduced.matches&&(rect.bottom< -100||rect.top>height+100))return;
   // One gesture spans the artwork's complete passage through the viewport.
   const progress=reduced.matches?0:smooth(clamp((height-rect.top)/(height+rect.height)));
   if(type==='elephant'){
    if(reduced.matches){element.classList.remove('is-painted');state.last=-1;return;}
    if(!state.painter)state.painter=elephantPainter(element);
    if(state.painter&&Math.abs(progress-state.last)>.002&&state.painter.draw(progress)){
     element.classList.add('is-painted');state.last=progress;
    }
   }else if(type==='mango'){
    // Fixed-size branches drift upwards inside their own decorative space.
    element.style.translate=`0 ${reduced.matches?0:-26*progress}px`;
   }else if(type==='house'){
    const depth=reduced.matches?0:progress;
    element.querySelector('.venue-far').setAttribute('transform',`translate(0 ${16*depth})`);
    element.querySelector('.venue-house').setAttribute('transform',`translate(0 ${-24*depth})`);
    element.querySelector('.venue-water').setAttribute('transform',`translate(${-26*depth} ${-42*depth})`);
   }
  });
 }
 function queue(){if(!frame)frame=requestAnimationFrame(update);}
 document.querySelectorAll('[data-micro]').forEach(element=>{
  const type=element.dataset.micro;
  if(type==='ganpati')return; // The original reveal already brings Ganpati into view.
  const anchor=type==='mango'?element.closest('section'):element;
  states.set(element,{element,type,anchor,painter:null,last:-1});
  const img=element.matches('img')?element:element.querySelector('img');
  if(img)img.addEventListener('load',queue);
 });
 addEventListener('scroll',queue,{passive:true});
 addEventListener('resize',queue);
 reduced.addEventListener('change',queue);
 document.addEventListener('visibilitychange',queue);
 // Unlocking the invitation changes its geometry without necessarily scrolling.
 new MutationObserver(queue).observe(document.querySelector('#wedding-site'),{attributes:true,attributeFilter:['hidden']});
 new ResizeObserver(queue).observe(document.querySelector('#wedding-site'));
 queue();
})();
