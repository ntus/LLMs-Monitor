/* Separate task acquisition path. Never uses quota queues or persists private task lists. */
(function(root){
 const T=root.LLMTaskList,pending=new Map(),lastAttempt=new Map();
 function bounded(task,ms=2500){let timer;return Promise.race([task,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('task timeout')),ms)})]).finally(()=>clearTimeout(timer));}
 async function request(id,service){try{return await bounded(chrome.tabs.sendMessage(id,{type:'TASK_LIST_READ',service}))}catch{return null}}
 async function acquire(service){
  let created=null;
  try{
   // A fresh inactive home prevents reuse of an old sidebar after account changes.
   created=await chrome.tabs.create({url:T.HOMES[service],active:false});const started=Date.now();
   while(Date.now()-started<20000){const r=await request(created.id,service);if(r?.status==='ready')return r;await new Promise(resolve=>setTimeout(resolve,800));}
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
