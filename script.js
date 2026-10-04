const cv=document.getElementById("bg"),cx=cv.getContext("2d");
let W,H,pts=[],mouse={x:-999,y:-999};
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;const n=Math.min(110,Math.floor(W*H/14000));pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.6+.4}))}
size();addEventListener("resize",size);
function draw(){
  cx.clearRect(0,0,W,H);
  for(let i=0;i<pts.length;i++){
    const p=pts[i];p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);
    if(d<140){p.x+=dx/d*1.2;p.y+=dy/d*1.2}
    cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fillStyle="rgba(255,255,255,.55)";cx.fill();
    for(let j=i+1;j<pts.length;j++){
      const q=pts[j],l=Math.hypot(p.x-q.x,p.y-q.y);
      if(l<120){cx.strokeStyle="rgba(255,255,255,"+(.12*(1-l/120))+")";cx.lineWidth=.6;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}
    }
  }
  requestAnimationFrame(draw);
}
draw();

const glow=document.querySelector(".glow");
addEventListener("mousemove",e=>{
  mouse.x=e.clientX;mouse.y=e.clientY;
  glow.style.setProperty("--gx",e.clientX+"px");glow.style.setProperty("--gy",e.clientY+"px");
});

const card=document.getElementById("card");
card.addEventListener("mousemove",e=>{
  const b=card.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
  card.style.setProperty("--mx",x+"px");card.style.setProperty("--my",y+"px");
  const rY=((x/b.width)-.5)*10,rX=-((y/b.height)-.5)*10;
  card.style.transform="rotateX("+rX+"deg) rotateY("+rY+"deg)";
});
card.addEventListener("mouseleave",()=>{card.style.transform=""});

const words=["yvxal • he/him","yvxal","Bazsyxx"];
const out=document.getElementById("type");
let wi=0,ci=0,del=false;
function type(){
  const w=words[wi];
  out.textContent=w.slice(0,ci);
  if(!del&&ci<w.length){ci++;setTimeout(type,110)}
  else if(!del){del=true;setTimeout(type,2200)}
  else if(ci>0){ci--;setTimeout(type,55)}
  else{del=false;wi=(wi+1)%words.length;setTimeout(type,400)}
}

document.getElementById("enter").addEventListener("click",function(){
  this.classList.add("out");
  document.getElementById("page").classList.add("show");
  setTimeout(type,1400);
});
