"use strict";
const api=window.PortfolioAPI,C=window.PortfolioCore,$=s=>document.querySelector(s),esc=C.escape;
const draftKey="portfolio-studio-draft-v1";
let content,version=0,active="profile",local=false,dirty=false,busy=false,historyRows=[];
const specs={
 profile:[["name","Full name"],["availability","Availability"],["eyebrow","Engineering areas"],["headline","Headline"],["highlight","Highlighted headline"],["summary","About me","textarea"],["note","Profile note","textarea"],["email","Email","email"],["phone","Phone"],["location","Location"],["github","GitHub URL"],["linkedin","LinkedIn URL"],["photo","Personal photo","image"],["photoAlt","Photo description"],["contactSummary","Contact message","textarea"]],
 projects:[["title","Project title"],["category","Category","select"],["label","Area label"],["context","Context"],["description","Description","textarea"],["image","Preview image","image"],["imageAlt","Image description"],["stack","Technologies (comma separated)"],["results","Highlights (one per line)","textarea"],["source","Source URL"],["demo","Demo URL"],["article","Article URL"],["featured","Wide featured card","checkbox"]],
 education:[["degree","Degree or program"],["period","Dates"],["school","University and location"],["description","Details / GPA","textarea"],["courses","Courses (comma separated)"],["badge","Additional label"]],
 cvs:[["title","CV title"],["field","Target field"],["description","Description","textarea"],["url","PDF file","pdf"],["isDefault","Use for the main CV buttons","checkbox"]]
};
const blank={
 projects:{title:"New project",category:"ai",label:"",context:"",description:"",image:"",imageAlt:"",stack:"",results:"",source:"",demo:"",article:"",featured:false},
 education:{degree:"New program",period:"",school:"",description:"",courses:"",badge:""},
 cvs:{title:"New CV",field:"",description:"",url:"",isDefault:false}
};
function status(message){$("#status").textContent=message;}
function controls(){["publish","history"].forEach(id=>$("#"+id).disabled=local||busy);$("#revision").textContent=local?"Local draft only":"Published version "+version+(dirty?" · Unpublished edits":"");}
function saveDraft(){dirty=true;try{localStorage.setItem(draftKey,JSON.stringify(content));status("Draft saved on this device. Preview or publish when ready.");}catch{status("Device storage is unavailable. Export a backup to keep your draft.");}controls();sendPreview();}
function sendPreview(){try{C.validate(content);$("#preview").contentWindow.postMessage({type:"portfolio:preview",content},location.origin);}catch{/* Incomplete fields stay in the editor until valid. */}}
function field(spec,obj,index){
 const [key,label,type="text"]=spec,id=active+"-"+index+"-"+key,value=obj[key]??"",path=active==="profile"?key:index+"."+key;
 if(type==="checkbox")return '<label class="check-label"><input type="checkbox" data-path="'+path+'" '+(value?'checked':'')+'>'+esc(label)+'</label>';
 let input;
 if(type==="textarea")input='<textarea id="'+id+'" data-path="'+path+'">'+esc(value)+'</textarea>';
 else if(type==="select")input='<select id="'+id+'" data-path="'+path+'">'+C.categories.map(c=>'<option '+(c===value?'selected':'')+'>'+c+'</option>').join("")+'</select>';
 else input='<input id="'+id+'" data-path="'+path+'" type="'+(type==="email"?"email":"text")+'" value="'+esc(value)+'" maxlength="8000">';
 const upload=["pdf","image"].includes(type)?'<input type="file" aria-label="Upload '+esc(label)+'" data-upload="'+path+'" data-kind="'+type+'" accept="'+(type==="pdf"?"application/pdf":"image/jpeg,image/png,image/webp")+'" '+(local?'disabled':'')+'><span class="upload-note">Upload '+(type==="pdf"?"a PDF":"a JPG, PNG, or WebP")+' up to 10 MB, or paste a public HTTPS URL above.</span>':"";
 return '<label class="'+(["textarea","image","pdf"].includes(type)?"full":"")+'" for="'+id+'">'+esc(label)+input+upload+'</label>';
}
function render(){
 $("#tabs").querySelectorAll("button").forEach(b=>b.classList.toggle("selected",b.dataset.tab===active));
 if(active==="profile"){
  const p=content.profile;
  $("#fields").innerHTML='<section class="profile-fields"><h2>About & personal photo</h2><p>Your photo appears in the profile panel. Leave its link empty to show your initials.</p>'+(p.photo?'<img class="photo-thumb" src="'+esc(C.url(p.photo))+'" alt="'+esc(p.photoAlt)+'">':"")+'<div class="field-grid">'+specs.profile.map(s=>field(s,p,0)).join("")+'</div></section>';
 }else{
  $("#fields").innerHTML=content[active].map((obj,index)=>'<section class="entry"><div class="entry-head"><h2>'+esc(obj.title||obj.degree||"Entry")+'</h2><div class="entry-controls"><button type="button" data-move="'+index+'" data-direction="-1" aria-label="Move entry up" '+(index===0?'disabled':'')+'>↑</button><button type="button" data-move="'+index+'" data-direction="1" aria-label="Move entry down" '+(index===content[active].length-1?'disabled':'')+'>↓</button><button type="button" data-remove="'+index+'" class="danger">Remove</button></div></div><div class="field-grid">'+specs[active].map(s=>field(s,obj,index)).join("")+'</div></section>').join("")+'<button type="button" class="btn btn-secondary" id="add-entry">+ Add '+({projects:"project",education:"education",cvs:"CV"}[active])+'</button>';
 }
 controls();sendPreview();
}
function change(path,value){
 const parts=path.split(".");const target=active==="profile"?content.profile:content[active][Number(parts[0])];const key=parts.at(-1);
 if(active==="cvs"&&key==="isDefault"&&value)content.cvs.forEach(c=>c.isDefault=false);
 target[key]=value;saveDraft();
 if(key==="isDefault")render();
}
async function begin(isLocal){
 local=isLocal;const response=await fetch("../content/portfolio.json");if(!response.ok)throw new Error("Cannot load the original portfolio.");
 content=C.validate(await response.json());version=0;
 if(!local){const row=await api.read();if(row){content=C.validate(row.content);version=row.version;}}
 $("#welcome").hidden=true;$("#editor").hidden=false;$("#signout").hidden=local;
 $("#account").textContent=local?"Local editing mode — sign in after setup to publish.":"Signed in as portfolio administrator.";
 dirty=false;render();status("Edit a field to start a draft.");
}
$("#login").addEventListener("submit",async e=>{
 e.preventDefault();const button=e.submitter;button.disabled=true;status("Signing in…");
 try{await api.login(e.target.email.value.trim(),e.target.password.value);e.target.password.value="";await begin(false);}
 catch(error){status(error.message);}finally{button.disabled=false;}
});
if(!api.configured()){$("#setup").hidden=false;$("#login").hidden=true;}
$("#local-edit").addEventListener("click",()=>begin(true).catch(e=>status(e.message)));
$("#content-form").addEventListener("submit",e=>e.preventDefault());
$("#tabs").addEventListener("click",e=>{if(e.target.dataset.tab){active=e.target.dataset.tab;render();}});
$("#fields").addEventListener("input",e=>{if(e.target.dataset.path)change(e.target.dataset.path,e.target.type==="checkbox"?e.target.checked:e.target.value);});
$("#fields").addEventListener("change",async e=>{
 if(!e.target.dataset.upload)return;
 const input=e.target,file=input.files[0];if(!file)return;
 const collection=active,parts=input.dataset.upload.split("."),target=collection==="profile"?content.profile:content[collection][Number(parts[0])];
 input.disabled=true;busy=true;controls();status("Uploading public file…");
 try{const value=await api.upload(file,input.dataset.kind);target[parts.at(-1)]=value;saveDraft();render();status("File uploaded. Preview and publish to show it on your website.");}
 catch(error){status(error.message);}finally{busy=false;controls();input.disabled=false;}
});
$("#fields").addEventListener("click",e=>{
 const button=e.target.closest("button");if(!button)return;
 if(button.id==="add-entry"){if(content[active].length>=({projects:60,education:20,cvs:30}[active]))return status("Collection limit reached.");content[active].push({...blank[active]});}
 else if(button.dataset.remove!==undefined){
  const index=Number(button.dataset.remove);
  if(active==="cvs"&&content.cvs.length===1)return status("Keep at least one CV.");
  if(!confirm("Remove this entry from the draft? Published content changes only after publishing."))return;
  const wasDefault=content[active][index].isDefault;content[active].splice(index,1);
  if(wasDefault&&active==="cvs")content.cvs[0].isDefault=true;
 }else if(button.dataset.move!==undefined){const i=Number(button.dataset.move),j=i+Number(button.dataset.direction);[content[active][i],content[active][j]]=[content[active][j],content[active][i]];}
 else return;
 saveDraft();render();
});
$("#preview-toggle").addEventListener("click",()=>{
 $("#preview-panel").hidden=!$("#preview-panel").hidden;$(".workspace").classList.toggle("with-preview",!$("#preview-panel").hidden);
 $("#preview-toggle").textContent=$("#preview-panel").hidden?"Show preview":"Hide preview";sendPreview();
});
window.addEventListener("message",e=>{if(e.origin===location.origin&&e.source===$("#preview").contentWindow&&e.data?.type==="portfolio:preview-ready")sendPreview();});
$("#restore").addEventListener("click",()=>{
 try{const raw=localStorage.getItem(draftKey);if(!raw)return status("No device draft found.");const restored=C.validate(JSON.parse(raw));if(!confirm("Replace the current draft with the saved device draft?"))return;content=restored;dirty=true;render();status("Device draft restored. Review before publishing.");}
 catch(error){status("Could not restore draft: "+error.message);}
});
$("#export").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify(content,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="portfolio-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 status("Backup exported. Uploaded files remain in Supabase storage.");
});
$("#discard").addEventListener("click",async()=>{
 if(busy||!confirm("Discard your device draft and reload the current published portfolio?"))return;
 try{await begin(local);localStorage.removeItem(draftKey);status("Draft discarded. Current portfolio reloaded.");}catch(error){status(error.message);}
});
$("#publish").addEventListener("click",async()=>{
 if(local||busy)return;
 try{C.validate(content);if(!$("#content-form").reportValidity())return;
 if(!confirm("Publish these changes to your public website?"))return;
 busy=true;controls();status("Publishing…");
 const snapshot=JSON.stringify(content);
 const result=await api.publish(JSON.parse(snapshot),version);version=Number(result);dirty=JSON.stringify(content)!==snapshot;
 if(!dirty){try{localStorage.removeItem(draftKey);}catch{}}
 controls();status("Published version "+version+"."+(dirty?" Your newer edits are still in the draft.":" Visitors see the update on their next page load."));
 }catch(error){status(error.message.includes("conflict")?"Another session published newer changes. Export your draft, sign out, and sign in again before editing.":error.message);}
 finally{busy=false;controls();}
});
$("#history").addEventListener("click",async()=>{
 try{
  historyRows=await api.history();$("#history-list").hidden=false;
  $("#history-list").innerHTML='<h2>Published versions</h2><p>Restoring loads a version into your draft. Publish after reviewing it.</p>'+historyRows.map((h,i)=>'<button data-history="'+i+'">Version '+h.version+' · '+esc(new Date(h.created_at).toLocaleString())+'</button>').join("");
 }catch(error){status(error.message);}
});
$("#history-list").addEventListener("click",e=>{
 if(e.target.dataset.history===undefined)return;
 if(!confirm("Load this published version into your draft?"))return;
 content=C.validate(structuredClone(historyRows[Number(e.target.dataset.history)].content));saveDraft();render();status("Historical version loaded into the draft.");
});
$("#signout").addEventListener("click",async()=>{
 if(dirty&&!confirm("Sign out? Your device draft will remain available."))return;
 try{await api.logout();}catch{/* Local credentials are still cleared. */}
 location.reload();
});
window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue="";}});

