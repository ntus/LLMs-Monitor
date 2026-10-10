/* Metadata-only sidebar adapter; independent from quota parsers, storage and alerts. */
(function(root){
 const HOSTS={chatgpt:'chatgpt.com',claude:'claude.ai',gemini:'gemini.google.com'};
 const HOMES={chatgpt:'https://chatgpt.com/',claude:'https://claude.ai/new',gemini:'https://gemini.google.com/app'};
 const SIDEBARS={chatgpt:'aside nav[aria-label]',claude:'aside[aria-label]',gemini:'bard-sidenav[aria-label]'};
 function link(href,service){try{const u=new URL(href,HOMES[service]);if(u.origin!==new URL(HOMES[service]).origin||u.search||u.hash||u.username||u.password)return null;
  const m=service==='chatgpt'?u.pathname.match(/^\/(?:g\/(g-p-[a-zA-Z0-9_-]+)\/)?c\/([a-zA-Z0-9_-]+)\/?$/):service==='claude'?u.pathname.match(/^\/(chat|cowork|code)\/([a-zA-Z0-9_-]+)\/?$/):u.pathname.match(/^\/(?:u\/\d+\/)?app\/([a-zA-Z0-9_-]+)\/?$/);
  if(u.href.length>600||!m||service==='claude'&&m[1]==='code'&&!m[2].startsWith('session_'))return null;
  return {id:service==='chatgpt'?m[2]:service==='claude'?m[1]+':'+m[2]:m[1],url:u.href,kind:service==='claude'&&m[1]!=='chat'?m[1]:'chat',projectId:service==='chatgpt'?m[1]||null:null};
 }catch{return null}}
 function collect(doc,service,now=Date.now()){
  if(!HOSTS[service])return {status:'unavailable'};
  const areas=[...doc.querySelectorAll(SIDEBARS[service])].filter(n=>n.getClientRects().length),rows=new Map();
  if(!areas.length)return {status:'unavailable'};
  for(const area of areas)for(const a of area.querySelectorAll('a[href]')){
   if(!a.getClientRects().length)continue;const item=link(a.getAttribute('href'),service);if(!item)continue;
   const title=String(a.innerText||a.getAttribute('aria-label')||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,200);if(!title||item.id.length>120||item.projectId?.length>120||rows.has(item.id))continue;
   rows.set(item.id,{...item,title,status:'unknown',parentId:null,projectTitle:item.projectId?item.projectId:'',updatedAt:null,summary:''});if(rows.size>=500)break;
  }
  if(!rows.size)return {status:'unavailable'}; // Empty/loading/signed-out cannot erase a previous list.
  return {status:'ready',snapshot:{schemaVersion:1,service,capturedAt:new Date(now).toISOString(),source:'official-sidebar',coverage:'Rendered sidebar only; no chat contents or inferred execution states. Project labels may be IDs. Desktop Codex tasks are not included.',tasks:[...rows.values()]}};
 }
 root.LLMTaskList={HOSTS,HOMES,SIDEBARS,link,collect};if(typeof module!=='undefined')module.exports=root.LLMTaskList;
})(globalThis);
