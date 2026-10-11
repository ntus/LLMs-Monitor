/* Independent task-view contract. No quota state or persistence. */
(function(root){
 'use strict';
 const SERVICES=['chatgpt','claude','gemini'];
 const STATUSES=['running','idle','waiting','completed','failed','unknown'];
 const MAX_BYTES=524288,MAX_TASKS=500,MAX_DEPTH=12,STATE_TTL=15000;
 const CODE_LIST_TTL=90000,CODE_LABELS={'入力待ち':'waiting','Awaiting input':'waiting','アイドル':'idle','Idle':'idle','未読の返答':'unknown','Unread response':'unknown'};
 function listed(value,service,kind,source){const r=value?.listedState;
  return service==='claude'&&kind==='code'&&source==='official-sidebar'&&r&&Object.hasOwn(CODE_LABELS,r.label)&&r.status===CODE_LABELS[r.label]&&Number.isFinite(r.observedAt)?{label:r.label,status:r.status,observedAt:r.observedAt}:null;
 }
 function listProjection(task,now){const r=task.listedState;return r&&now-r.observedAt<=CODE_LIST_TTL&&r.observedAt<=now+1000?{status:r.status,stateObservedAt:r.observedAt,stateEvidence:'official-code-list',stateReason:'',listedLabel:r.label}:null;}
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
 function pinURL(value,service){if(safeURL(value,service))return safeURL(value,service);try{const u=new URL(value);if(u.protocol!=='https:'||u.hostname!=={chatgpt:'chatgpt.com',claude:'claude.ai',gemini:'gemini.google.com'}[service]||u.port||u.username||u.password||u.hash)return '';if(service==='claude'&&/^\/artifact\/[a-zA-Z0-9_-]+\/?$/.test(u.pathname)){const q=[...u.searchParams];return !q.length||q.length===1&&q[0][0]==='org'&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(q[0][1])?u.href:'';}if(u.search)return '';const re=service==='claude'?/^\/(?:code\/project|project)\/[a-zA-Z0-9_-]+\/?$/:service==='chatgpt'?/^\/g\/g-p-[a-zA-Z0-9_-]+(?:\/project)?\/?$/:/^\/notebook\/[a-zA-Z0-9_-]+\/?$/;return re.test(u.pathname)?u.href:''}catch{return ''}}
 function audit(a){if(!a||typeof a!=='object')return null;const out={};for(const k of ['observed','accepted','rejected'])out[k]=Number.isInteger(a[k])&&a[k]>=0?Math.min(10000,a[k]):0;for(const k of ['limited','sectionSeen','scanFinished'])out[k]=a[k]===true;return out;}
 function codexURL(value,service){return service==='chatgpt'&&typeof value==='string'&&/^codex:\/\/threads\/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(value)?value:''}
 function noteURL(value,service){if(codexURL(value,service))return value;if(safeURL(value,service))return safeURL(value,service);try{const u=new URL(value);return service==='claude'&&u.origin==='https://claude.ai'&&!u.username&&!u.password&&!u.hash&&/^\/code\/project\/[a-zA-Z0-9_-]+\/?$/.test(u.pathname)&&[...u.searchParams].length===1&&/^cmsg_[a-zA-Z0-9_-]+$/.test(u.searchParams.get('thread')||'')?u.href:''}catch{return ''}}
 function stateIcon(task){return {running:'🟢',waiting:'🟠',idle:'🔵',completed:'✅',failed:'🔴',unknown:'⚪'}[task?.status]||'⚪';}
 function groupLabel(group,language='en',index=0){if(group.groupTitle)return group.groupTitle;const title=group.projectTitle;if(title&&!/^g-p-[a-zA-Z0-9_-]+$/.test(title))return title;return group.projectId?(language==='ja'?`プロジェクト名未取得 ${index+1}`:`Project name unavailable ${index+1}`):(language==='ja'?'その他の会話（所属未確認）':'Other conversations (affiliation unknown)');}
 function normalize(input,service){
  if(!SERVICES.includes(service)||!input||input.schemaVersion!==1||input.service!==service||!Array.isArray(input.tasks)||input.tasks.length>MAX_TASKS)throw Error('schema');
  const capturedAt=date(input.capturedAt);if(!capturedAt)throw Error('date');
  const ids=new Set(),projects=new Map();
  const tasks=input.tasks.map(value=>{
   if(!value||typeof value!=='object')throw Error('task');
   const id=clean(value.id,120),title=clean(value.title,200),parentId=reference(value.parentId);
   if(!id||!title||id!==value.id||ids.has(id))throw Error('id');ids.add(id);
   const projectId=reference(value.projectId),projectTitle=projectId?clean(value.projectTitle,100):'';
   if(projectId){if(projects.has(projectId)&&projects.get(projectId)!==projectTitle)throw Error('project');projects.set(projectId,projectTitle)}
   const kind=service==='chatgpt'&&value.kind==='codex'?'codex':service==='claude'&&['code','cowork'].includes(value.kind)?value.kind:'chat';
   const task={id,title,parentId,projectId,projectTitle,groupId:clean(value.groupId,120),groupTitle:clean(value.groupTitle,100),pinned:value.pinned===true,kind,status:STATUSES.includes(value.status)?value.status:'unknown',updatedAt:date(value.updatedAt),summary:clean(value.summary,500),url:safeURL(value.url,service)};
   const state=listed(value,service,kind,input.source);if(state&&task.url){task.listedState=state;Object.assign(task,listProjection(task,Date.now())||{})}return task;
  });
  const byId=new Map(tasks.map(t=>[t.id,t]));
  for(const task of tasks){let cursor=task,seen=new Set(),depth=0;
   while(cursor){if(seen.has(cursor.id)||++depth>MAX_DEPTH)throw Error('cycle');seen.add(cursor.id);
    if(!cursor.parentId)break;const parent=byId.get(cursor.parentId);if(!parent||parent.projectId!==task.projectId||parent.kind!==task.kind)throw Error('parent');cursor=parent;
   }
  }
  const pins=(Array.isArray(input.pins)?input.pins:[]).slice(0,500).map(p=>({title:clean(p.title,200),url:pinURL(p.url,service),kind:['project','artifact'].includes(p.kind)?p.kind:'chat'})).filter(p=>p.title&&p.url);
  return {schemaVersion:1,service,capturedAt,pins,pinCoverage:'partial',pinAudit:audit(input.pinAudit),source:['codex-app','local-export','demo','official-sidebar'].includes(input.source)?input.source:'local-export',coverage:clean(input.coverage,250),tasks};
 }
 function parse(text,service){if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('size');const input=JSON.parse(text);if(input&&typeof input==='object')input.source='local-export';return normalize(input,service)}
 function select(snapshot,query='',status='all'){
  const byId=new Map(snapshot.tasks.map(t=>[t.id,t])),visible=new Set(),needle=clean(query,200).toLocaleLowerCase();
  for(const t of snapshot.tasks){if(status!=='all'&&t.status!==status)continue;if(needle&&!`${t.title} ${t.projectTitle} ${t.groupTitle} ${t.summary}`.toLocaleLowerCase().includes(needle))continue;
   visible.add(t.id);let cursor=t;while(cursor.parentId){visible.add(cursor.parentId);cursor=byId.get(cursor.parentId)}
  }
  return snapshot.tasks.filter(t=>visible.has(t.id));
 }
 function groups(tasks){const out=new Map();for(const task of tasks){const key=JSON.stringify([task.kind,task.projectId,task.groupId]);if(!out.has(key))out.set(key,{key,kind:task.kind,projectId:task.projectId,projectTitle:task.projectTitle,groupTitle:task.groupTitle,pinned:false,tasks:[]});out.get(key).tasks.push(task);out.get(key).pinned ||= task.pinned}return [...out.values()].sort((a,b)=>Number(b.pinned)-Number(a.pinned)).map(g=>({...g,tasks:g.tasks.slice().sort((a,b)=>Number(b.pinned)-Number(a.pinned))}))}
 function states(snapshot,result,now=Date.now()){
  if(snapshot?.source!=='official-sidebar')return snapshot;
  const ready=result?.status==='ready'&&result.service===snapshot.service&&Number.isFinite(result.checkedAt)&&now-result.checkedAt<=STATE_TTL&&result.checkedAt<=now+1000;
  const observations=ready&&Array.isArray(result.observations)?result.observations.slice(0,40):[];
  const tasks=snapshot.tasks.map(task=>{
   const matches=observations.filter(r=>r?.id===task.id&&r.kind===task.kind&&task.url&&safeURL(r.url,snapshot.service)&&(snapshot.service==='chatgpt'?new URL(r.url).pathname.split('/').filter(Boolean).at(-1)===new URL(task.url).pathname.split('/').filter(Boolean).at(-1):r.url.replace(/\/$/,'')===task.url.replace(/\/$/,'')));
   const fresh=matches.filter(r=>Number.isFinite(r.observedAt)&&now-r.observedAt<=STATE_TTL&&r.observedAt<=now+1000);
   const validated=fresh.map(r=>({...r,status:r.status==='running'&&r.evidence==='stop-control'?'running':r.status==='idle'&&task.kind==='chat'&&r.evidence==='composer-ready'?'idle':'unknown'}));
   const conflict=new Set(validated.map(r=>r.status)).size>1;
   const r=conflict?null:validated[0];
   const list=listProjection(task,now);
   if(list&&!conflict&&(!r||r.status==='unknown'))return {...task,...list};
   if(list&&r?.status==='running'&&['waiting','idle'].includes(list.status))return {...task,status:'unknown',stateObservedAt:null,stateReason:'conflict',stateEvidence:'',listedLabel:''};
   return {...task,status:r?.status||'unknown',stateObservedAt:r?.observedAt||null,stateReason:conflict?'conflict':r?.status==='unknown'?'no-signal':r?'':ready?'not-open':'unavailable',stateEvidence:r?.status!=='unknown'&&r?r.evidence:'',listedLabel:''};
  });return {...snapshot,tasks,stateCheckedAt:ready?result.checkedAt:null};
 }
 function expireStates(snapshot,now=Date.now()){
  if(snapshot?.source!=='official-sidebar')return snapshot;
  const expired=t=>t.stateObservedAt&&now-t.stateObservedAt>(t.stateEvidence==='official-code-list'?CODE_LIST_TTL:STATE_TTL);
  if(!snapshot.tasks.some(expired))return snapshot;
  return {...snapshot,tasks:snapshot.tasks.map(t=>expired(t)?{...t,status:'unknown',stateObservedAt:null,stateReason:'stale',stateEvidence:'',listedLabel:''}:t)};
 }
 function demo(service,now=Date.now()){
  const iso=new Date(now).toISOString();return normalize({schemaVersion:1,service,capturedAt:iso,source:'demo',coverage:'Synthetic example',tasks:[
   {id:'sample-1',title:'Example: website refresh',projectId:'example-project',projectTitle:'Example project',status:'running',updatedAt:iso,summary:'Synthetic data for trying the task tree.'},
   {id:'sample-2',parentId:'sample-1',title:'Example: review accessibility',projectId:'example-project',projectTitle:'Example project',status:'waiting',updatedAt:iso},
   {id:'sample-3',title:'Example: documentation',projectId:'example-project',projectTitle:'Example project',status:'completed',updatedAt:iso}
  ]},service);
 }
 const api={SERVICES,STATUSES,MAX_BYTES,MAX_TASKS,MAX_DEPTH,STATE_TTL,normalize,parse,select,groups,groupLabel,stateIcon,pinURL,safeURL,noteURL,codexURL,states,expireStates,demo};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.LLMTaskModel=Object.freeze(api);
})(globalThis);
