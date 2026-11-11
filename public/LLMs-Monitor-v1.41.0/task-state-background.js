/* Independent, bounded reads of existing tabs. No tab creation, quota queue or persistence. */
(function(root){
 'use strict';
 const T=root.LLMTaskList,S=root.LLMTaskStatus,pending=new Map(),lastAttempt=new Map(),recent=new Map();
 async function boundedRead(tab,service){let timer;
  try{return await Promise.race([chrome.tabs.sendMessage(tab.id,{type:'TASK_STATE_READ',service}),new Promise(resolve=>{timer=setTimeout(()=>resolve(null),900)})])}catch{return null}finally{clearTimeout(timer)}
 }
 async function acquire(service){
  const now=Date.now(),observations=[];let timer;
  try{
   await Promise.race([(async()=>{
    const tabs=(await chrome.tabs.query({url:`https://${T.HOSTS[service]}/*`})).filter(t=>Number.isInteger(t.id)&&S.identity(t.url,service)).slice(0,40);let cursor=0;
    await Promise.all(Array.from({length:Math.min(4,tabs.length)},async()=>{while(cursor<tabs.length&&Date.now()-now<3000){
     const tab=tabs[cursor++],expected=S.identity(tab.url,service),r=await boundedRead(tab,service),observedAt=Date.now();
     if(!r||!S.same(expected,S.identity(r.url,service),service)||r.id!==expected.id||r.kind!==expected.kind||!Number.isFinite(r.observedAt)||observedAt-r.observedAt>15000||r.observedAt>observedAt+1000)continue;
     const status=['running','idle','unknown'].includes(r.status)?r.status:'unknown';
     const evidence=status==='running'&&r.evidence==='stop-control'?'stop-control':status==='idle'&&expected.kind==='chat'&&r.evidence==='composer-ready'?'composer-ready':'';
     observations.push({id:expected.id,kind:expected.kind,url:expected.url,status:evidence?status:'unknown',evidence,reason:evidence?'':r.reason==='hidden'?'hidden':'no-signal',observedAt:r.observedAt});
    }}));
   })(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('state deadline')),3500)})]);
   return {status:'ready',service,checkedAt:Date.now(),observations:observations.slice()};
  }catch{return {status:'unavailable'}}finally{clearTimeout(timer)}
 }
 function read(service){
  if(!Object.hasOwn(T.HOSTS,service))return Promise.resolve({status:'unavailable'});
  if(pending.has(service))return pending.get(service);
  if(Date.now()-(lastAttempt.get(service)||0)<4000){const result=recent.get(service);return Promise.resolve(result?.status==='ready'&&Date.now()-result.checkedAt<4000?result:{status:'cooldown'})}
  lastAttempt.set(service,Date.now());const task=acquire(service).then(result=>{recent.set(service,result);return result}).finally(()=>pending.delete(service));pending.set(service,task);return task;
 }
 root.LLMTaskStateBackground={read};
})(globalThis);
