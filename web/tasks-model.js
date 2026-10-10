/* Independent task-view contract. No quota state or persistence. */
(function(root){
 'use strict';
 const SERVICES=['chatgpt','claude','gemini'];
 const STATUSES=['running','idle','waiting','completed','failed','unknown'];
 const MAX_BYTES=524288,MAX_TASKS=500,MAX_DEPTH=12;
 const clean=(v,n)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,n).trim():'';
 const reference=v=>{if(v===undefined||v===null||v==='')return null;const id=clean(v,120);if(!id||id!==v)throw Error('reference');return id};
 const date=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\dT/.test(v)&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():null;
 function safeURL(value,service){
  try{const u=new URL(value),host={chatgpt:'chatgpt.com',claude:'claude.ai',gemini:'gemini.google.com'}[service];
   if(u.protocol!=='https:'||u.hostname!==host||u.port||u.username||u.password||u.search||u.hash)return '';
   const route={chatgpt:/^\/(?:g\/g-p-[a-zA-Z0-9_-]+\/)?c\/[a-zA-Z0-9_-]+\/?$/,claude:/^\/(?:chat|cowork)\/[a-zA-Z0-9_-]+\/?$|^\/code\/session_[a-zA-Z0-9_-]+\/?$/,gemini:/^\/(?:u\/\d+\/)?app\/[a-zA-Z0-9_-]+\/?$/}[service];
   return route?.test(u.pathname)?u.href:'';
  }catch{return ''}
 }
 function normalize(input,service){
  if(!SERVICES.includes(service)||!input||input.schemaVersion!==1||input.service!==service||!Array.isArray(input.tasks)||input.tasks.length>MAX_TASKS)throw Error('schema');
  const capturedAt=date(input.capturedAt);if(!capturedAt)throw Error('date');
  const ids=new Set(),projects=new Map();
  const tasks=input.tasks.map(value=>{
   if(!value||typeof value!=='object')throw Error('task');
   const id=clean(value.id,120),title=clean(value.title,200),parentId=reference(value.parentId);
   if(!id||!title||id!==value.id||ids.has(id))throw Error('id');ids.add(id);
   const projectId=reference(value.projectId),projectTitle=projectId?clean(value.projectTitle,100):'';
   if(projectId){if(!projectTitle||projects.has(projectId)&&projects.get(projectId)!==projectTitle)throw Error('project');projects.set(projectId,projectTitle)}
   return {id,title,parentId,projectId,projectTitle,kind:service==='chatgpt'&&value.kind==='codex'?'codex':service==='claude'&&['code','cowork'].includes(value.kind)?value.kind:'chat',status:STATUSES.includes(value.status)?value.status:'unknown',updatedAt:date(value.updatedAt),summary:clean(value.summary,500),url:safeURL(value.url,service)};
  });
  const byId=new Map(tasks.map(t=>[t.id,t]));
  for(const task of tasks){let cursor=task,seen=new Set(),depth=0;
   while(cursor){if(seen.has(cursor.id)||++depth>MAX_DEPTH)throw Error('cycle');seen.add(cursor.id);
    if(!cursor.parentId)break;const parent=byId.get(cursor.parentId);if(!parent||parent.projectId!==task.projectId||parent.kind!==task.kind)throw Error('parent');cursor=parent;
   }
  }
  return {schemaVersion:1,service,capturedAt,source:['codex-app','local-export','demo','official-sidebar'].includes(input.source)?input.source:'local-export',coverage:clean(input.coverage,250),tasks};
 }
 function parse(text,service){if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('size');return normalize(JSON.parse(text),service)}
 function select(snapshot,query='',status='all'){
  const byId=new Map(snapshot.tasks.map(t=>[t.id,t])),visible=new Set(),needle=clean(query,200).toLocaleLowerCase();
  for(const t of snapshot.tasks){if(status!=='all'&&t.status!==status)continue;if(needle&&!`${t.title} ${t.projectTitle} ${t.summary}`.toLocaleLowerCase().includes(needle))continue;
   visible.add(t.id);let cursor=t;while(cursor.parentId){visible.add(cursor.parentId);cursor=byId.get(cursor.parentId)}
  }
  return snapshot.tasks.filter(t=>visible.has(t.id));
 }
 function groups(tasks){const out=new Map();for(const task of tasks){const key=JSON.stringify([task.kind,task.projectId]);if(!out.has(key))out.set(key,{key,kind:task.kind,projectTitle:task.projectTitle,tasks:[]});out.get(key).tasks.push(task)}return [...out.values()]}
 function demo(service,now=Date.now()){
  const iso=new Date(now).toISOString();return normalize({schemaVersion:1,service,capturedAt:iso,source:'demo',coverage:'Synthetic example',tasks:[
   {id:'sample-1',title:'Example: website refresh',projectId:'example-project',projectTitle:'Example project',status:'running',updatedAt:iso,summary:'Synthetic data for trying the task tree.'},
   {id:'sample-2',parentId:'sample-1',title:'Example: review accessibility',projectId:'example-project',projectTitle:'Example project',status:'waiting',updatedAt:iso},
   {id:'sample-3',title:'Example: documentation',projectId:'example-project',projectTitle:'Example project',status:'completed',updatedAt:iso}
  ]},service);
 }
 const api={SERVICES,STATUSES,MAX_BYTES,MAX_TASKS,MAX_DEPTH,normalize,parse,select,groups,safeURL,demo};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.LLMTaskModel=Object.freeze(api);
})(globalThis);
