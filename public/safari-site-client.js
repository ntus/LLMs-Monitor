/* Website-side companion: dormant in Chrome; bounded, fixed-origin handshake. */
(function(root){
 'use strict';
 if(window!==window.top||location.origin!=='https://llmsmonitor.ntus.org')return;
 let ready=false;const pending=new Map();
 window.addEventListener('message',e=>{
  if(e.source!==window||e.origin!==location.origin)return;
  if(e.data?.source==='llms-safari-ready'){if(!ready){ready=true;window.dispatchEvent(new Event('llms-safari-connected'));}return;}
  const m=e.data;if(m?.source!=='llms-safari-response'||!pending.has(m.id))return;
  const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.response?.error?p.reject(Error(m.response.error)):p.resolve(m.response);
 });
 function call(request){if(!ready||pending.size>=4)return Promise.reject(Error('Safari extension not connected'));return new Promise((resolve,reject)=>{const id=crypto.randomUUID(),timer=setTimeout(()=>{pending.delete(id);reject(Error('Safari extension timeout'));},15000);pending.set(id,{resolve,reject,timer});window.postMessage({source:'llms-safari-request',id,request},location.origin);});}
 window.addEventListener('pagehide',()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Page closed'));}pending.clear();});
 root.GlanceSafariSite={get ready(){return ready;},call};
 const discover=()=>window.postMessage({source:'llms-safari-discover'},location.origin);
 window.addEventListener('pageshow',event=>{if(event.persisted)discover();});
 discover();
})(globalThis);
