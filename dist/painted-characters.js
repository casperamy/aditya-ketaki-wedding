(() => {
  'use strict';
  const canvas = document.getElementById('couple-canvas');
  const output = canvas.getContext('2d');
  const image = new Image();
  const W=400,H=500,cols=12,rows=15;
  let frames=[],ready=false,last=-1;
  const top=[74,74,68,68,55,56,56,54],bottom=[479,479,478,478,464,462,462,462];
  const center=[293.9,293.7,286.9,287.8,296.1,290.3,287.4,289.6];
  // Corresponding painted landmarks register each drawing before interpolation.
  // The bride's height and floor baseline are identical in all eight poses.
  const keys=[
    [[121,104],[103,169],[106,320],[87,391],[134,392],[148,211],[269,250]],
    [[140,115],[116,180],[122,326],[97,387],[163,391],[158,213],[269,250]],
    [[161,169],[141,225],[147,343],[122,405],[190,357],[187,269],[261,244]],
    [[163,217],[142,272],[146,377],[114,451],[193,366],[178,316],[260,244]],
    [[149,206],[120,270],[118,393],[113,446],[211,361],[185,309],[271,235]],
    [[150,203],[126,269],[121,393],[111,446],[215,362],[205,243],[264,233]],
    [[151,203],[126,269],[121,393],[111,446],[215,362],[199,233],[260,233]],
    [[151,203],[126,269],[121,393],[111,446],[215,362],[200,234],[240,215]]
  ];
  const transforms=top.map((y,i)=>{const scale=405/(bottom[i]-y);return {s:scale,x:293.9-center[i]*scale,y:479-bottom[i]*scale};});
  const normal=(p,i)=>[p[0]*transforms[i].s+transforms[i].x,p[1]*transforms[i].s+transforms[i].y];
  const anchors=keys.map((pts,i)=>{
    const p=pts.map(v=>normal(v,i));
    return [p[0],[p[0][0],p[0][1]-42],[p[0][0]-25,p[0][1]], [p[0][0]+22,p[0][1]],
      p[1],p[2],p[3],p[4],p[5],p[6],
      [0,0],[W,0],[0,H],[W,H],[294,106],[294,173],[305,338],[305,464],
      [40,480],[130,480],[215,480],[375,260]];
  });
  const makeCanvas=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c;};
  const buffers=[makeCanvas(),makeCanvas()];
  function field(x,y,source,target){
    let sum=0,dx=0,dy=0;
    for(let i=0;i<source.length;i++){
      const distance=(x-source[i][0])**2+(y-source[i][1])**2+100;
      const weight=1/(distance*distance);
      sum+=weight;dx+=(target[i][0]-source[i][0])*weight;dy+=(target[i][1]-source[i][1])*weight;
    }
    return [x+dx/sum,y+dy/sum];
  }
  function triangle(ctx,source,from,to){
    const [s0,s1,s2]=from,[d0,d1,d2]=to;
    const x1=s1[0]-s0[0],y1=s1[1]-s0[1],x2=s2[0]-s0[0],y2=s2[1]-s0[1];
    const det=x1*y2-x2*y1;
    const a=((d1[0]-d0[0])*y2-(d2[0]-d0[0])*y1)/det;
    const b=((d1[1]-d0[1])*y2-(d2[1]-d0[1])*y1)/det;
    const c=(x1*(d2[0]-d0[0])-x2*(d1[0]-d0[0]))/det;
    const d=(x1*(d2[1]-d0[1])-x2*(d1[1]-d0[1]))/det;
    ctx.save();ctx.beginPath();
    // Small overlap avoids hairline seams between adjacent painted mesh cells.
    const cx=(d0[0]+d1[0]+d2[0])/3,cy=(d0[1]+d1[1]+d2[1])/3;
    to.forEach((p,i)=>{const px=cx+(p[0]-cx)*1.015,py=cy+(p[1]-cy)*1.015;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});
    ctx.closePath();ctx.clip();ctx.setTransform(a,b,c,d,d0[0]-a*s0[0]-c*s0[1],d0[1]-b*s0[0]-d*s0[1]);
    ctx.drawImage(source,0,0);ctx.restore();
  }
  function warp(index,target,buffer){
    const ctx=buffer.getContext('2d');ctx.clearRect(0,0,W,H);
    const vertices=[];
    for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
      const point=[x*W/cols,y*H/rows];vertices.push({from:point,to:field(...point,anchors[index],target)});
    }
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const a=y*(cols+1)+x,b=a+1,c=a+cols+1,d=c+1;
      for(const ids of [[a,b,c],[b,d,c]])triangle(ctx,frames[index],ids.map(i=>vertices[i].from),ids.map(i=>vertices[i].to));
    }
  }
  window.paintProposal = progress => {
    if(!ready)return;
    const position=Math.max(0,Math.min(7,progress*7));
    if(Math.abs(position-last)<.006)return;last=position;
    const start=Math.floor(position),end=Math.min(7,start+1),t=position-start;
    output.clearRect(0,0,W,H);
    if(t<.015||end===start){output.drawImage(frames[start],0,0);return;}
    const target=anchors[start].map((p,i)=>[p[0]+(anchors[end][i][0]-p[0])*t,p[1]+(anchors[end][i][1]-p[1])*t]);
    // Always render one opaque drawing. Blending silhouettes produces ghost limbs.
    // Registration carries the closest painted pose toward the intermediate joints.
    warp(t<.5?start:end,target,buffers[0]);
    output.drawImage(buffers[0],0,0);
  };
  image.onload=()=>{
    frames=Array.from({length:8},(_,i)=>{
      const frame=makeCanvas(),ctx=frame.getContext('2d'),t=transforms[i];
      ctx.setTransform(t.s,0,0,t.s,t.x,t.y);
      const left=Math.round(i%4*image.width/4),right=Math.round((i%4+1)*image.width/4);
      ctx.drawImage(image,left,Math.floor(i/4)*image.height/2,right-left,image.height/2,0,0,right-left,image.height/2);
      return frame;
    });
    ready=true;dispatchEvent(new Event('painted-poses-ready'));
  };
  image.src='assets/animation/painted-poses.webp';
})();
