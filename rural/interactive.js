const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".bar-col").forEach((col,i)=>{
 const values=[800,3792,643,2189,21592],value=values[i],bar=col.querySelector(".bar"),number=col.querySelector("span");
 col.tabIndex=0;col.setAttribute("role","button");col.setAttribute("aria-label", (2021+i)+"年，"+value+"万元。悬停或点击重播增长动画");
 const height=value/21592*210;bar.style.height=height+"px";let frame;
 function grow(){cancelAnimationFrame(frame);if(reduce)return;const start=performance.now();function tick(now){let p=Math.min((now-start)/1300,1);p=1-Math.pow(1-p,3);bar.style.height=height*p+"px";number.textContent=Math.round(value*p).toLocaleString("en-US");if(p<1)frame=requestAnimationFrame(tick)}frame=requestAnimationFrame(tick)}
 col.addEventListener("pointerenter",grow);col.addEventListener("focus",grow);col.addEventListener("click",grow);col.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();grow()}});
});
document.querySelector(".bars").setAttribute("role","group");
const panel=document.querySelector(".tourism-panel");
panel.querySelector("figure").remove();
panel.querySelector(".chart-title span").textContent="2021—2025 / 估算占比";
panel.querySelector(".source").textContent="按原图扇区面积估算占比，并非实际人数；四舍五入后合计 100%。";
const pie=document.createElement("div");pie.className="pie-layout";
pie.innerHTML='<svg viewBox="0 0 320 320" role="group" aria-label="旅游人数估算占比"></svg><div class="pie-legend"></div>';
panel.insertBefore(pie,panel.querySelector(".source"));
const data=[{year:2021,value:15.2,color:"#393939"},{year:2022,value:16.3,color:"#dbe522"},{year:2023,value:19.3,color:"#f15b27"},{year:2024,value:22.4,color:"#8dc63f"},{year:2025,value:26.8,color:"#fb961c"}];
let angle=-Math.PI/2;const svg=pie.querySelector("svg"),legend=pie.querySelector(".pie-legend");
data.forEach((d,index)=>{
 const end=angle+d.value/100*Math.PI*2,mid=(angle+end)/2,point=a=>[160+123*Math.cos(a),160+123*Math.sin(a)],start=point(angle),stop=point(end);
 const path=document.createElementNS("http://www.w3.org/2000/svg","path");
 path.setAttribute("d",`M160,160 L${start} A123,123 0 0,1 ${stop} Z`);
 path.setAttribute("fill",d.color);path.setAttribute("class","pie-slice");path.setAttribute("tabindex","0");path.setAttribute("role","button");path.setAttribute("aria-label",d.year+"年，约"+d.value+"%");
 path.style.setProperty("--dx",Math.cos(mid)*10+"px");path.style.setProperty("--dy",Math.sin(mid)*10+"px");svg.append(path);
 const button=document.createElement("button");button.innerHTML=`<i style="--color:${d.color}"></i>${d.year}<strong>≈ ${d.value.toFixed(1)}%</strong>`;legend.append(button);
 const active=()=>{pie.querySelectorAll(".active").forEach(el=>el.classList.remove("active"));path.classList.add("active");button.classList.add("active")};
 [path,button].forEach(el=>{el.addEventListener("pointerenter",active);el.addEventListener("focus",active);el.addEventListener("click",active)});
 angle=end;
});
pie.addEventListener("pointerleave",()=>pie.querySelectorAll(".active").forEach(el=>el.classList.remove("active")));
const stage=document.querySelector("#huoshaodian .gallery");stage.classList.add("gallery-stage");
const hint=document.createElement("p");hint.className="gallery-instruction";hint.textContent="悬停探索 / 点击图片聚焦 · 移出或按 ESC 恢复";stage.before(hint);
const figures=[...stage.querySelectorAll("figure")];
const rects=[[38,190,544,409],[605,190,532,400],[38,616,542,270],[606,617,524,270]];
let active=-1,raf,clone,canvas,anim;
function reset(){active=-1;cancelAnimationFrame(raf);anim?.cancel();clone?.remove();canvas?.remove();stage.classList.remove("is-exploring")}
function explore(index){
 if(active===index)return;
 const imgs=figures.map(f=>f.querySelector("img"));if(imgs.some(img=>!img.complete||!img.naturalWidth))return;
 reset();active=index;
 const bounds=stage.getBoundingClientRect();
 const boxes=figures.map(f=>f.querySelector(".crop").getBoundingClientRect());
 const selected=boxes[index],sr=rects[index];
 // The duplicate starts exactly over the selected original and travels to the centre.
 clone=document.createElement("div");clone.className="focus-image";clone.setAttribute("aria-hidden","true");
 const focusCanvas=document.createElement("canvas");focusCanvas.width=sr[2];focusCanvas.height=sr[3];focusCanvas.style.cssText="width:100%;height:100%;display:block";
 focusCanvas.getContext("2d").drawImage(imgs[index],...sr,0,0,sr[2],sr[3]);clone.append(focusCanvas);stage.append(clone);
 const tw=Math.min(bounds.width*.76,850),th=Math.min(tw*sr[3]/sr[2],bounds.height*.88),targetW=th*sr[2]/sr[3];
 const from={left:selected.left-bounds.left+"px",top:selected.top-bounds.top+"px",width:selected.width+"px",height:selected.height+"px"};
 const to={left:(bounds.width-targetW)/2+"px",top:(bounds.height-th)/2+"px",width:targetW+"px",height:th+"px"};
 Object.assign(clone.style,to);anim=clone.animate([from,to],{duration:reduce?0:2000,easing:"cubic-bezier(.22,.72,.16,1)",fill:"both"});
 stage.classList.add("is-exploring");
 if(reduce)return;
 canvas=document.createElement("canvas");canvas.className="particle-canvas";const dpr=Math.min(devicePixelRatio,1.5);canvas.width=bounds.width*dpr;canvas.height=bounds.height*dpr;canvas.style.width=bounds.width+"px";canvas.style.height=bounds.height+"px";stage.append(canvas);
 const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);const pieces=[];const cell=Math.max(12,Math.sqrt(bounds.width*bounds.height/4500));
 boxes.forEach((box,i)=>{const r=rects[i];for(let y=0;y<box.height;y+=cell){for(let x=0;x<box.width;x+=cell){const w=Math.min(cell,box.width-x),h=Math.min(cell,box.height-y);pieces.push({i,x:box.left-bounds.left+x,y:box.top-bounds.top+y,w,h,sx:r[0]+x/box.width*r[2],sy:r[1]+y/box.height*r[3],sw:w/box.width*r[2],sh:h/box.height*r[3],dx:(Math.random()-.4)*100,dy:-30-Math.random()*100,delay:Math.random()*.55});}}});
 const begin=performance.now();
 function dissolve(now){const t=Math.min((now-begin)/2000,1);ctx.clearRect(0,0,bounds.width,bounds.height);pieces.forEach(p=>{const progress=Math.max(0,Math.min((t-p.delay)/(1-p.delay),1));ctx.globalAlpha=1-progress;const scale=1-progress*.8;ctx.drawImage(imgs[p.i],p.sx,p.sy,p.sw,p.sh,p.x+p.dx*progress,p.y+p.dy*progress,p.w*scale+.4,p.h*scale+.4)});ctx.globalAlpha=1;if(t<1)raf=requestAnimationFrame(dissolve);else canvas?.remove()}
 raf=requestAnimationFrame(dissolve);
}
figures.forEach((f,i)=>{f.tabIndex=0;f.setAttribute("role","button");f.setAttribute("aria-label",f.querySelector("img").alt+"，聚焦图片");f.addEventListener("pointerenter",e=>{if(e.pointerType!=="touch")explore(i)});f.addEventListener("focus",()=>{if(f.matches(":focus-visible"))explore(i)});f.addEventListener("click",()=>active===i?reset():explore(i));f.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();active===i?reset():explore(i)}})});
stage.addEventListener("pointerleave",e=>{if(e.pointerType!=="touch")reset()});
stage.addEventListener("focusout",e=>{if(!stage.contains(e.relatedTarget))reset()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")reset()});window.addEventListener("resize",reset);

