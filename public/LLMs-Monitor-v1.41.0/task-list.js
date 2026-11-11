/* Metadata-only sidebar adapter; independent from quota parsers, storage and alerts. */
(function(root){
 const HOSTS={chatgpt:'chatgpt.com',claude:'claude.ai',gemini:'gemini.google.com'};
 const HOMES={chatgpt:'https://chatgpt.com/',claude:'https://claude.ai/new',gemini:'https://gemini.google.com/app'};
 const SIDEBARS={chatgpt:'aside nav[aria-label]',claude:'aside[aria-label]',gemini:'bard-sidenav[aria-label]'};
 // TASK-CODE-001: exact, observed sidebar icon labels; never infer completion.
 function codeBadge(a,now){
  const labels=[...(a.querySelectorAll?.('[aria-label]')||[])].map(n=>n.getAttribute('aria-label'));
  const allowed={'入力待ち':'waiting','Awaiting input':'waiting','アイドル':'idle','Idle':'idle','未読の返答':'unknown','Unread response':'unknown'};
  const found=[...new Set(labels.filter(v=>Object.hasOwn(allowed,v)))];
  return found.length===1?{label:found[0],status:allowed[found[0]],observedAt:now}:null;
 }
 function link(href,service){try{const u=new URL(href,HOMES[service]);if(u.origin!==new URL(HOMES[service]).origin||u.search||u.hash||u.username||u.password)return null;
  const m=service==='chatgpt'?u.pathname.match(/^\/(?:g\/(g-p-[a-zA-Z0-9_-]+)\/)?c\/([a-zA-Z0-9_-]+)\/?$/):service==='claude'?u.pathname.match(/^\/(chat|cowork|code)\/([a-zA-Z0-9_-]+)\/?$/):u.pathname.match(/^\/(?:u\/\d+\/)?app\/([a-zA-Z0-9_-]+)\/?$/);
  if(u.href.length>600||!m||service==='claude'&&m[1]==='code'&&!m[2].startsWith('session_'))return null;
  return {id:service==='chatgpt'?m[2]:service==='claude'?m[1]+':'+m[2]:m[1],url:u.href,kind:service==='claude'&&m[1]!=='chat'?m[1]:'chat',projectId:service==='chatgpt'?m[1]||null:null};
 }catch{return null}}
 const text=(v,n=100)=>String(v||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n);
 function context(a,service,names){
  let groupTitle='',groupId='',pinned=false;
  if(service==='chatgpt')pinned=!!a.closest?.('[data-pinned-content-tab-drop-key]');
  if(service==='claude'){
   pinned=!!a.closest?.('[data-pinned-list]');
   const group=a.closest?.('[data-group-list][data-group-label]');
   if(group){groupTitle=text(group.getAttribute('data-group-label'));groupId=text(group.getAttribute('data-group-list'),120);}
  }
  if(service==='gemini'){
   // Explicit accessible pin icon/label only; absence is not proof of no pins.
   const row=a.closest?.('gem-nav-list-item');
   pinned=!!row?.querySelector?.('[aria-label="Pinned"], [aria-label="ピン留め済み"], [data-mat-icon-name="push_pin"]');
  }
  const projectId=link(a.getAttribute('href'),service)?.projectId;
  return {groupId,groupTitle,pinned,projectTitle:projectId?(names.get(projectId)||''):''};
 }
 function pinURL(href,service){try{const u=new URL(href,HOMES[service]);if(u.origin!==new URL(HOMES[service]).origin||u.username||u.password||u.hash)return '';if(service==='claude'&&/^\/artifact\/[a-zA-Z0-9_-]+\/?$/.test(u.pathname)){const q=[...u.searchParams];return !q.length||q.length===1&&q[0][0]==='org'&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(q[0][1])?u.href:'';}if(u.search)return '';if(link(u.href,service))return u.href;
  const re=service==='claude'?/^\/(?:code\/project|project)\/[a-zA-Z0-9_-]+\/?$/:service==='chatgpt'?/^\/g\/g-p-[a-zA-Z0-9_-]+(?:\/project)?\/?$/:/^\/notebook\/[a-zA-Z0-9_-]+\/?$/;return re.test(u.pathname)?u.href:'';}catch{return ''}}
 function prepare(doc,service){
  const areas=[...doc.querySelectorAll(SIDEBARS[service])].filter(n=>n.getClientRects().length);let count=0;
  for(const area of areas){const selector=service==='claude'?'[data-group-toggle][aria-expanded="false"]':service==='chatgpt'?'[data-app-action-sidebar-project-id][aria-expanded="false"], [data-app-action-sidebar-section-toggle][aria-expanded="false"]':'button[aria-expanded="false"][aria-label="Pinned"], button[aria-expanded="false"][aria-label="「ピン留め」を切り替える"]';
   for(const b of area.querySelectorAll(selector)){if(count>=50)return count;if(service==='chatgpt'&&b.hasAttribute?.('data-app-action-sidebar-section-toggle')&&!/^(?:Pinned|ピン留め)$/.test(text(b.innerText)))continue;if(b.getClientRects().length&&typeof b.click==='function'){b.click();count++}}}
  return count;
 }
 function collect(doc,service,now=Date.now()){
  if(!HOSTS[service])return {status:'unavailable'};
  const areas=[...doc.querySelectorAll(SIDEBARS[service])].filter(n=>n.getClientRects().length),rows=new Map(),names=new Map(),pins=new Map(),seenPins=new Set();let rejected=0;
  if(!areas.length)return {status:'unavailable'};
  for(const area of areas)for(const n of area.querySelectorAll('[data-app-action-sidebar-project-id][data-app-action-sidebar-project-label]')){const id=n.getAttribute('data-app-action-sidebar-project-id'),label=text(n.getAttribute('data-app-action-sidebar-project-label'));if(id&&label&&!names.has(id))names.set(id,label)}
  for(const area of areas)for(const a of area.querySelectorAll('a[href]')){
   if(!a.getClientRects().length)continue;const ctx=context(a,service,names),href=a.getAttribute('href'),pin=pinURL(href,service);if(ctx.pinned&&!seenPins.has(href)){seenPins.add(href);const title=text(a.innerText||a.getAttribute('aria-label'),200);if(pin&&title)pins.set(pin,{url:pin,title,kind:link(pin,service)?'chat':pin.includes('/artifact/')?'artifact':'project'});else rejected++;}const item=link(a.getAttribute('href'),service);if(!item)continue;
   const title=String(a.innerText||a.getAttribute('aria-label')||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,200);if(!title||item.id.length>120||item.projectId?.length>120)continue;
   const listedState=service==='claude'&&item.kind==='code'?codeBadge(a,now):null;
   const prior=rows.get(item.id);if(prior){if(ctx.projectTitle)prior.projectTitle=ctx.projectTitle;if(ctx.groupTitle){prior.groupTitle=ctx.groupTitle;prior.groupId=ctx.groupId}prior.pinned=prior.pinned||ctx.pinned;continue;}
   rows.set(item.id,{...item,...ctx,title,status:'unknown',listedState,parentId:null,updatedAt:null,summary:''});if(rows.size>500)rows.delete(item.id);
  }
  if(!rows.size&&!pins.size)return {status:'unavailable'}; // Empty/loading/signed-out cannot erase a previous list.
  return {status:'ready',snapshot:{schemaVersion:1,service,capturedAt:new Date(now).toISOString(),source:'official-sidebar',coverage:'Rendered sidebar only; no chat contents or inferred execution states. Unknown affiliations are not inferred. Desktop Codex tasks are not included.',pins:[...pins.values()].slice(0,500),pinCoverage:'partial',pinAudit:{observed:seenPins.size,accepted:pins.size,rejected,limited:pins.size>500,sectionSeen:service==='claude'?areas.some(a=>!!a.querySelector?.('[data-pinned-list]')):service==='chatgpt'?seenPins.size>0:seenPins.size>0},tasks:[...rows.values()]}};
 }
 function advance(doc,service){const areas=[...doc.querySelectorAll(SIDEBARS[service])].filter(n=>n.getClientRects().length);let more=false;for(const area of areas){for(const n of [area,...area.querySelectorAll('*')]){if(n.scrollHeight>n.clientHeight+2&&n.clientHeight>0&&n.scrollTop+n.clientHeight<n.scrollHeight-2){n.scrollTop=Math.min(n.scrollTop+Math.max(100,n.clientHeight-40),n.scrollHeight);more=true;break;}}}return more;}
 root.LLMTaskList={HOSTS,HOMES,SIDEBARS,link,pinURL,prepare,advance,collect};if(typeof module!=='undefined')module.exports=root.LLMTaskList;
})(globalThis);
