(function(){
  'use strict';
  if(window.innerWidth<480)return;
  var c=document.createElement('canvas');
  c.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.3;';
  document.body.appendChild(c);
  var ctx=c.getContext('2d'),w,h,ps=[],mx=-1e3,my=-1e3;
  function rs(){w=c.width=window.innerWidth;h=c.height=window.innerHeight;}
  rs();window.addEventListener('resize',rs);
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
  var n=Math.min(40,Math.floor(w/28));
  for(var i=0;i<n;i++){var g=Math.random()>0.55;ps.push({x:Math.random()*w,y:Math.random()*h,r:g?Math.random()*2+0.8:Math.random()*1.2+0.3,dx:(Math.random()-0.5)*0.25,dy:(Math.random()-0.5)*0.1-0.08,ph:Math.random()*Math.PI*2,sp:Math.random()*0.003+0.001,g:g,pp:Math.random()*Math.PI*2,ps:Math.random()*0.015+0.006});}
  function dr(){ctx.clearRect(0,0,w,h);ps.forEach(function(p){p.ph+=p.sp;p.pp+=p.ps;p.x+=p.dx+Math.sin(p.ph)*0.15;p.y+=p.dy;var dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);if(d<120){var f=(1-d/120)*0.5;p.x+=(dx/d)*f;p.y+=(dy/d)*f;}if(p.y<-10){p.y=h+10;p.x=Math.random()*w;}if(p.x<-10)p.x=w+10;if(p.x>w+10)p.x=-10;var pr=p.r*(1+Math.sin(p.pp)*0.25);if(p.g){var gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,pr*3);gr.addColorStop(0,'rgba(212,168,83,0.35)');gr.addColorStop(0.5,'rgba(212,168,83,0.08)');gr.addColorStop(1,'rgba(212,168,83,0)');ctx.beginPath();ctx.arc(p.x,p.y,pr*3,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();}ctx.beginPath();ctx.arc(p.x,p.y,pr,0,Math.PI*2);ctx.fillStyle=p.g?'rgba(212,168,83,0.5)':'rgba(200,200,200,0.25)';ctx.fill();});for(var i=0;i<ps.length;i++)for(var j=i+1;j<ps.length;j++){var dx=ps[i].x-ps[j].x,dy=ps[i].y-ps[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.beginPath();ctx.moveTo(ps[i].x,ps[i].y);ctx.lineTo(ps[j].x,ps[j].y);ctx.strokeStyle='rgba(212,168,83,'+0.06*(1-d/120)+')';ctx.lineWidth=0.4;ctx.stroke();}}requestAnimationFrame(dr);}dr();
})();
