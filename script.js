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
card.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;
  const b=card.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
  card.style.setProperty("--mx",x+"px");card.style.setProperty("--my",y+"px");
  const rY=((x/b.width)-.5)*10,rX=-((y/b.height)-.5)*10;
  card.style.transform="rotateX("+rX+"deg) rotateY("+rY+"deg)";
});
card.addEventListener("mouseleave",()=>{card.style.transform=""});

const clip=document.getElementById("clip"),more=document.getElementById("more");
function checkBio(){
  clip.classList.remove("short");
  if(clip.scrollHeight<=68+4){clip.classList.add("short");more.classList.add("hide")}
}
addEventListener("load",checkBio);
more.addEventListener("click",()=>{
  const open=clip.classList.toggle("open");
  more.classList.toggle("open",open);
  clip.style.maxHeight=open?clip.scrollHeight+"px":"";
  more.firstChild.textContent=open?"Kevesebb":"Tovább olvasom";
});

const words=["yvxal • he/him","yvxal • holy/moly","Bazsyxx • :3"];
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
  document.getElementById("page").classList.add("show");document.getElementById("clockw").classList.add("show");
  song.volume=0;
  song.play().catch(()=>{});
  setTimeout(type,1400);
  setTimeout(showViews,1500);
});

(function(){
  const NS="http://www.w3.org/2000/svg",ticks=document.getElementById("ticks");
  for(let i=0;i<12;i++){const l=document.createElementNS(NS,"line"),big=i%3===0;
    l.setAttribute("x1",50);l.setAttribute("x2",50);l.setAttribute("y1",big?6:8);l.setAttribute("y2",big?13:11);
    l.setAttribute("class","tk"+(big?" big":""));l.setAttribute("transform","rotate("+i*30+" 50 50)");ticks.appendChild(l)}
  const tz="Europe/Budapest";
  const f=new Intl.DateTimeFormat("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
  const df=new Intl.DateTimeFormat("hu-HU",{timeZone:tz,year:"numeric",month:"long",day:"numeric",weekday:"long"});
  const hh=document.getElementById("hh"),mh=document.getElementById("mh"),sh=document.getElementById("sh"),
        hm=document.getElementById("hm"),ss=document.getElementById("ss"),dt=document.getElementById("date");
  let lastDate="",lastSec="";
  function tick(){
    const now=new Date(),p={};
    f.formatToParts(now).forEach(x=>p[x.type]=x.value);
    const H=+p.hour,M=+p.minute,S=+p.second+now.getMilliseconds()/1000;
    sh.setAttribute("transform","rotate("+S*6+" 50 50)");
    mh.setAttribute("transform","rotate("+(M+S/60)*6+" 50 50)");
    hh.setAttribute("transform","rotate("+((H%12)+M/60)*30+" 50 50)");
    if(p.second!==lastSec){lastSec=p.second;hm.textContent=p.hour+":"+p.minute;ss.textContent=p.second;
      const d=df.format(now);if(d!==lastDate){dt.textContent=d;lastDate=d}}
    requestAnimationFrame(tick);
  }
  tick();
})();

(function(){
  const ID="688189917427269744",el=document.getElementById("status"),ok=["online","idle","dnd","offline"];
  const set=s=>{el.dataset.s=ok.includes(s)?s:"offline"};
  let ws,hb,poll;
  function startPoll(){
    if(poll)return;
    const go=()=>fetch("https://api.lanyard.rest/v1/users/"+ID).then(r=>r.json()).then(d=>{if(d&&d.success)set(d.data.discord_status)}).catch(()=>{});
    go();poll=setInterval(go,10000);
  }
  function stopPoll(){clearInterval(poll);poll=null}
  function connect(){
    try{ws=new WebSocket("wss://api.lanyard.rest/socket")}catch(e){startPoll();return}
    ws.onmessage=e=>{
      const m=JSON.parse(e.data);
      if(m.op===1){
        ws.send(JSON.stringify({op:2,d:{subscribe_to_id:ID}}));
        clearInterval(hb);hb=setInterval(()=>ws.readyState===1&&ws.send(JSON.stringify({op:3})),m.d.heartbeat_interval);
      }else if(m.op===0&&m.d){set(m.d.discord_status);stopPoll()}
    };
    ws.onclose=()=>{clearInterval(hb);startPoll();setTimeout(connect,5000)};
    ws.onerror=()=>ws.close();
  }
  startPoll();connect();
})();

document.querySelectorAll(".bdg").forEach(b=>{
  b.addEventListener("click",e=>{e.stopPropagation();const on=b.classList.contains("tip");document.querySelectorAll(".bdg").forEach(x=>x.classList.remove("tip"));if(!on){b.classList.add("tip");setTimeout(()=>b.classList.remove("tip"),2200)}});
});
addEventListener("click",()=>document.querySelectorAll(".bdg").forEach(x=>x.classList.remove("tip")));

addEventListener("pointerdown",e=>{
  if(e.target.closest("#enter"))return;
  for(let i=0;i<7;i++){
    const s=document.createElement("i"),a=Math.random()*6.283,d=18+Math.random()*26;
    s.className="spark";s.style.left=e.clientX+"px";s.style.top=e.clientY+"px";
    s.style.setProperty("--dx",Math.cos(a)*d+"px");s.style.setProperty("--dy",Math.sin(a)*d+"px");
    document.body.appendChild(s);setTimeout(()=>s.remove(),700);
  }
});

(function(){
  const s=document.createElement("canvas");s.id="stars";document.body.appendChild(s);
  const g=s.getContext("2d");let w,h,list=[];
  const fit=()=>{w=s.width=innerWidth;h=s.height=innerHeight};fit();addEventListener("resize",fit);
  function spawn(){const a=.6+Math.random()*.4;list.push({x:Math.random()*w*1.1,y:-20,vx:-(4+Math.random()*4),vy:(2.5+Math.random()*3)*a,l:60+Math.random()*50,life:1})}
  (function f(){
    g.clearRect(0,0,w,h);
    if(Math.random()<.012)spawn();
    list=list.filter(p=>p.life>0&&p.y<h+80);
    list.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.life-=.004;
      const m=Math.hypot(p.vx,p.vy),tx=p.x-p.vx/m*p.l,ty=p.y-p.vy/m*p.l;
      const gr=g.createLinearGradient(p.x,p.y,tx,ty);gr.addColorStop(0,"rgba(255,255,255,"+.8*p.life+")");gr.addColorStop(1,"rgba(255,255,255,0)");
      g.strokeStyle=gr;g.lineWidth=1.4;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(tx,ty);g.stroke();
    });
    requestAnimationFrame(f);
  })();
})();
