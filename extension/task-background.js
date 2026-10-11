/* Separate task acquisition path. Never uses quota queues or persists private task lists. */
(function(root){
 const T=root.LLMTaskList,pending=new Map(),lastAttempt=new Map();
 function bounded(task,ms=2500){let timer;return Promise.race([task,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('task timeout')),ms)})]).finally(()=>clearTimeout(timer));}
 async function request(id,service){try{return await bounded(chrome.tabs.sendMessage(id,{type:'TASK_LIST_READ',service}))}catch{return null}}
 async function acquire(service){
  if(service==='claude'){
   const results=await Promise.all([home(service,T.HOMES[service]),home(service,'https://claude.ai/code')]);
   const ready=results.filter(r=>r?.status==='ready'&&r.snapshot?.service===service);
   if(!ready.length)return {status:'unavailable'};
   const tasks=new Map(),pins=new Map();for(const r of ready)for(const p of r.snapshot.pins||[])pins.set(p.url,p);for(const r of ready)for(const t of r.snapshot.tasks){if(!tasks.has(t.id)||t.listedState)tasks.set(t.id,t)}
   return {status:'ready',snapshot:{...ready[0].snapshot,pins:[...pins.values()].slice(0,500),pinCoverage:'partial',tasks:[...tasks.values()].slice(0,500)}};
  }
  return home(service,T.HOMES[service]);
 }
 async function home(service,url){
  let created=null;
  try{
   // A fresh inactive home prevents reuse of an old sidebar after account changes.
   created=await chrome.tabs.create({url,active:false});const started=Date.now();
   while(Date.now()-started<20000){const r=await request(created.id,service);if(r?.status==='ready'){try{await bounded(chrome.tabs.sendMessage(created.id,{type:'TASK_LIST_PREPARE',service}));}catch{}await new Promise(resolve=>setTimeout(resolve,400));const refreshed=await request(created.id,service);return refreshed?.status==='ready'?refreshed:r;}await new Promise(resolve=>setTimeout(resolve,800));}
   return {status:'unavailable'};
  }catch{return {status:'unavailable'}}finally{if(Number.isInteger(created?.id))try{await chrome.tabs.remove(created.id)}catch{}}
 }
 function read(service){
  if(!Object.hasOwn(T.HOSTS,service))return Promise.resolve({status:'unavailable'});
  if(pending.has(service))return pending.get(service);
  if(Date.now()-(lastAttempt.get(service)||0)<55000)return Promise.resolve({status:'cooldown'});
  lastAttempt.set(service,Date.now());const task=acquire(service).finally(()=>pending.delete(service));pending.set(service,task);return task;
 }
 root.LLMTaskBackground={read};
})(globalThis);
