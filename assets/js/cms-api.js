(function (global) {
"use strict";
const config=global.PORTFOLIO_CMS||{};
let session=null;
const configured=()=>/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url||"") && !!config.anonKey;
async function request(path,options={},authenticated=false) {
 if(!configured()) throw new Error("Complete the Supabase setup first.");
 if(authenticated&&!session) throw new Error("Please sign in.");
 if(authenticated&&session.expiresAt<Date.now()+30000) {
  setSession(await request("/auth/v1/token?grant_type=refresh_token",{method:"POST",body:JSON.stringify({refresh_token:session.refresh_token})}));
 }
 const headers={apikey:config.anonKey,...options.headers};
 if(session&&authenticated) headers.Authorization="Bearer "+session.access_token;
 if(typeof options.body==="string") headers["Content-Type"]="application/json";
 const response=await fetch(config.url+path,{cache:"no-store",...options,headers,signal:typeof AbortSignal!=="undefined"&&AbortSignal.timeout?AbortSignal.timeout(20000):undefined});
 const raw=await response.text();let result;try{result=raw?JSON.parse(raw):null;}catch{throw new Error("Unexpected server response.");}
 if(!response.ok) throw new Error(response.status===401?"Session expired or incorrect sign-in details. Please sign in again.":result?.message||result?.msg||result?.error_description||"Request failed ("+response.status+").");
 return result;
}
function setSession(value){session={...value,expiresAt:Date.now()+value.expires_in*1000};}
async function login(email,password){
 setSession(await request("/auth/v1/token?grant_type=password",{method:"POST",body:JSON.stringify({email,password})}));
 try{const rows=await request("/rest/v1/portfolio_admins?select=user_id&user_id=eq."+encodeURIComponent(session.user.id),{},true);if(!rows.length)throw new Error("This account is not authorized to edit the portfolio.");}
 catch(error){session=null;throw error;}
 return session.user;
}
async function logout(){try{if(session)await request("/auth/v1/logout",{method:"POST"},true);}finally{session=null;}}
async function read(){const rows=await request("/rest/v1/portfolio_content?id=eq.main&select=content,version,updated_at");return rows[0]||null;}
async function publish(content,version){global.PortfolioCore.validate(content);return request("/rest/v1/rpc/publish_portfolio",{method:"POST",body:JSON.stringify({new_content:content,expected_version:version})},true);}
async function upload(file,kind){
 const types=kind==="pdf"?["application/pdf"]:["image/jpeg","image/png","image/webp"];
 if(!types.includes(file.type)||file.size>10*1024*1024||!file.size)throw new Error("Choose a PDF or JPG/PNG/WebP image under 10 MB.");
 const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());
 const valid=file.type==="application/pdf"?String.fromCharCode(...bytes.slice(0,5))==="%PDF-":file.type==="image/jpeg"?bytes[0]===255&&bytes[1]===216:file.type==="image/png"?[137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b):String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP";
 if(!valid)throw new Error("The file does not match its declared format.");
 if(!session)throw new Error("Sign in before uploading.");
 const extension={"application/pdf":"pdf","image/jpeg":"jpg","image/png":"png","image/webp":"webp"}[file.type];
 const path=session.user.id+"/"+crypto.randomUUID()+"."+extension;
 await request("/storage/v1/object/portfolio-media/"+path,{method:"POST",headers:{"Content-Type":file.type,"x-upsert":"false"},body:file},true);
 return config.url+"/storage/v1/object/public/portfolio-media/"+path;
}
global.PortfolioAPI={configured,login,logout,read,publish,upload,history:()=>request("/rest/v1/portfolio_history?select=version,content,created_at&order=version.desc&limit=10",{},true)};
})(window);

