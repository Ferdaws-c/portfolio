(function (global) {
"use strict";
const categories = ["ai","mobile","embedded","interactive"];
function url(value, required = false) {
 if (!value) { if (required) throw new Error("A file or link is required."); return ""; }
 if (typeof value !== "string" || value.length > 2048 || /[\\\\<>\x00-\x20]/.test(value)) throw new Error("Links cannot contain spaces, HTML, or backslashes.");
 if (/^https:\/\//i.test(value)) { const parsed = new URL(value); if (!parsed.hostname || parsed.username || parsed.password) throw new Error("Invalid HTTPS link."); return value; }
 if (/^(assets\/images\/|CV\/)/.test(value) && !value.split(/[/?#]/).some(s=>s==="..")) return value;
 throw new Error("Use an HTTPS link or an existing assets/images/ or CV/ path.");
}
function validate(data) {
 if (!data || data.schemaVersion!==1 || !data.profile || !Array.isArray(data.projects) || !Array.isArray(data.education) || !Array.isArray(data.cvs)) throw new Error("Unsupported portfolio data.");
 for (const [key,max] of Object.entries({projects:60,education:20,cvs:30})) if(data[key].length>max) throw new Error("Too many "+key+" entries.");
 if (!data.cvs.length || data.cvs.filter(c=>c.isDefault===true).length!==1) throw new Error("Choose exactly one default CV.");
 const strings=(obj,keys)=>{for(const key of keys) if(typeof obj[key]!=="string" || obj[key].length>8000) throw new Error("Invalid or too long field: "+key);};
 strings(data.profile,["name","availability","eyebrow","headline","highlight","summary","note","email","phone","location","github","linkedin","photo","photoAlt","contactSummary"]);
 for(const key of ["name","headline","highlight","availability","eyebrow"])if(data.profile[key].length>180)throw new Error("Keep "+key+" under 180 characters to preserve the layout.");
 if(!data.profile.name.trim() || !data.profile.headline.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email)) throw new Error("Enter a name, headline, and valid email.");
 ["github","linkedin","photo"].forEach(k=>url(data.profile[k]));
 data.projects.forEach(p=>{
  strings(p,["title","category","label","context","description","image","imageAlt","stack","results","source","demo","article"]);
  if(!p.title.trim() || !categories.includes(p.category) || typeof p.featured!=="boolean") throw new Error("Projects need a title and valid category.");
  ["image","source","demo","article"].forEach(k=>url(p[k]));
 });
 data.education.forEach(e=>{strings(e,["period","degree","school","description","courses","badge"]); if(!e.degree.trim()) throw new Error("Education needs a degree or program title.");});
 data.cvs.forEach(c=>{strings(c,["title","field","description","url"]);if(!c.title.trim()||!c.field.trim()||typeof c.isDefault!=="boolean") throw new Error("CVs need a title and field.");url(c.url,true);});
 return data;
}
const escape=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tags=value=>value.split(",").map(s=>s.trim()).filter(Boolean).map(s=>"<span>"+escape(s)+"</span>").join("");
const link=(href,label)=>href?'<a href="'+escape(url(href))+'" target="_blank" rel="noopener noreferrer">'+escape(label)+' ↗</a>':"";
global.PortfolioCore={validate,url,escape,tags,link,categories};
})(typeof window==="undefined"?globalThis:window);

