(function(){
"use strict";
const C=window.PortfolioCore,esc=C.escape;
const set=(selector,text)=>{const e=document.querySelector(selector);if(e)e.textContent=text;};
function render(data){
 C.validate(data);const p=data.profile;
 set(".logo-text",p.name);document.querySelector(".nav-logo").setAttribute("aria-label",p.name+", home");
 document.title=p.name+" | Engineering Portfolio";
 document.querySelector('meta[name="description"]').content=p.summary;
 const availability=document.querySelector(".availability");availability.replaceChildren(Object.assign(document.createElement("span"),{ariaHidden:"true"}),document.createTextNode(p.availability));
 set(".eyebrow",p.eyebrow);
 document.querySelector("h1").innerHTML=esc(p.headline)+" <span>"+esc(p.highlight)+"</span>";
 set(".hero-summary",p.summary);set(".profile-note p",p.note);
 set("#photo-placeholder p",p.name);
 document.querySelector(".hero-links").innerHTML=C.link(p.github,"GitHub")+C.link(p.linkedin,"LinkedIn")+'<a href="mailto:'+esc(p.email)+'">Email</a>';
 const photo=document.querySelector("#profile-photo"),placeholder=document.querySelector("#photo-placeholder");
 if(p.photo){photo.src=C.url(p.photo);photo.alt=p.photoAlt;photo.hidden=false;placeholder.hidden=true;}
 else{photo.removeAttribute("src");photo.hidden=true;placeholder.hidden=false;set("#photo-initials",p.name.split(/\s+/).filter(Boolean).map(s=>s[0]).slice(0,2).join("")); }
 document.querySelector(".projects-grid").innerHTML=data.projects.map((x,i)=>'<article class="project-card'+(x.featured?' project-card--wide':'')+'" data-category="'+esc(x.category)+'">'+
 (x.image?'<a class="project-media" href="'+esc(C.url(x.source||x.demo||x.article)||"#projects")+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc("View "+x.title)+'"><img src="'+esc(C.url(x.image))+'" alt="'+esc(x.imageAlt)+'" width="1264" height="848" loading="'+(i===0?'eager':'lazy')+'" decoding="async"><span class="project-index">'+String(i+1).padStart(2,"0")+'</span><span class="project-open" aria-hidden="true">View project ↗</span></a>':'')+
 '<div class="project-content"><div class="project-meta"><span>'+esc(x.label)+'</span><span>'+esc(x.context)+'</span></div><h3>'+esc(x.title)+'</h3><p>'+esc(x.description)+'</p>'+
 (x.results?'<ul class="project-results" role="list">'+x.results.split("\n").filter(Boolean).map(s=>'<li>'+esc(s)+'</li>').join("")+'</ul>':'')+
 '<div class="project-stack">'+C.tags(x.stack)+'</div><div class="project-actions">'+C.link(x.source,"Source")+C.link(x.demo,"Demo")+C.link(x.article,"Article")+'</div></div></article>').join("");
 document.querySelector(".education-list").innerHTML=data.education.map(e=>'<article class="education-item"><div class="education-period">'+esc(e.period)+'</div><div><h3>'+esc(e.degree)+'</h3><p class="education-school">'+esc(e.school)+'</p><p>'+esc(e.description)+'</p></div>'+(e.courses?'<div class="education-courses">'+C.tags(e.courses)+'</div>':'<div class="education-badge">'+esc(e.badge)+'</div>')+'</article>').join("");
 const selected=data.cvs.find(c=>c.isDefault);
 document.querySelectorAll(".nav-cv,.hero-actions a:nth-child(2)").forEach(a=>a.href=C.url(selected.url));
 document.querySelector("#cv-list").innerHTML=data.cvs.map(c=>'<article class="cv-card"><p class="section-kicker">'+esc(c.field)+(c.isDefault?' · Default':'')+'</p><h3>'+esc(c.title)+'</h3><p>'+esc(c.description)+'</p>'+C.link(c.url,"View CV")+'</article>').join("");
 set("#contact .contact-card > div > p:last-child",p.contactSummary);
 document.querySelector("#contact .btn-primary").href="mailto:"+p.email;
 document.querySelector("#copy-email").dataset.email=p.email;
 document.querySelector(".contact-details").innerHTML='<a href="mailto:'+esc(p.email)+'">'+esc(p.email)+'</a><a href="tel:'+esc(p.phone.replace(/[^+0-9]/g,""))+'">'+esc(p.phone)+'</a><span>'+esc(p.location)+'</span>';
 document.querySelector(".footer-brand").innerHTML="<span>FQ</span> "+esc(p.name);
 document.querySelector(".footer-inner > div").innerHTML=C.link(p.github,"GitHub")+C.link(p.linkedin,"LinkedIn")+'<a href="admin/">Edit portfolio</a>';
 set(".profile-metrics div:first-child strong",data.projects.length);
 document.dispatchEvent(new CustomEvent("portfolio:rendered"));
}
const preview=new URLSearchParams(location.search).get("preview")==="1"&&window.parent!==window;
if(preview){
 const banner=document.createElement("div");banner.className="preview-banner";banner.textContent="Draft preview — changes are not published";document.body.append(banner);
 window.addEventListener("message",event=>{if(event.origin===location.origin&&event.source===window.parent&&event.data?.type==="portfolio:preview"){try{render(event.data.content);}catch(error){console.warn(error.message);}}});
 window.parent.postMessage({type:"portfolio:preview-ready"},location.origin);
 return;
}
(async()=>{
 try{
  const response=await fetch("content/portfolio.json");if(!response.ok)throw new Error("Fallback unavailable");const fallback=await response.json();render(fallback);
  if(window.PortfolioAPI.configured()){
   const remote=await window.PortfolioAPI.read();
   if(remote)render(remote.content);
  }
 }catch(error){console.warn("Portfolio content fallback:",error.message);}
})();
})();

