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

const song=document.getElementById("song"),fill=document.getElementById("fill"),t1=document.getElementById("t1"),t2=document.getElementById("t2");
const maxVol=.65;
(function vol(){
  const d=song.duration,t=song.currentTime;
  if(d&&!song.paused){
    const fi=Math.min(t/4,1),fo=Math.min((d-t)/5,1);
    song.volume=Math.max(0,Math.min(1,maxVol*Math.min(fi,fo)));
  }
  requestAnimationFrame(vol);
})();
const fmt=s=>{s=Math.floor(s||0);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
song.addEventListener("loadedmetadata",()=>{t2.textContent=fmt(song.duration)});
song.addEventListener("timeupdate",()=>{
  t1.textContent=fmt(song.currentTime);
  if(song.duration)fill.style.width=(song.currentTime/song.duration*100)+"%";
});

const viewsEl=document.getElementById("views");
let total=null;
fetch(atob(["=MXZ05WarVGd","nVWbvw2bs1Ce","4l3c6FmYvQXa","o9idlRmLu9mc","l1WYj52bzFma","uMXdjFmYh9yL","6MHc0RHa"].join("").split("").reverse().join("")))
  .then(r=>r.json())
  .then(d=>{const v=Number(d.value);total=isFinite(v)?v:false})
  .catch(()=>{total=false});
function showViews(){
  if(total===null){setTimeout(showViews,300);return}
  if(total===false){document.querySelector(".views").style.display="none";return}
  const start=performance.now(),dur=1400;
  (function step(now){
    const p=Math.min((now-start)/dur,1),e=1-Math.pow(1-p,3);
    viewsEl.textContent=Math.round(total*e).toLocaleString("hu-HU");
    if(p<1)requestAnimationFrame(step);
  })(start);
}

document.getElementById("enter").addEventListener("click",function(){
  this.classList.add("out");
  document.getElementById("page").classList.add("show");
  song.volume=0;
  song.play().catch(()=>{});
  setTimeout(type,1400);
  setTimeout(showViews,1500);
});
