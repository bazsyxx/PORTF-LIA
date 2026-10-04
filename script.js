const enter=document.getElementById("enter");
const page=document.getElementById("page");
enter.addEventListener("click",()=>{
  enter.classList.add("out");
  page.classList.remove("hidden");
  requestAnimationFrame(()=>page.classList.add("show"));
});
