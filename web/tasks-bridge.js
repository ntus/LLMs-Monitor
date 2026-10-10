/* Dedicated metadata RPC, no quota RPC, audio, private history or provider credentials. */
(function(root){
 const ORIGINS=new Set(['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site']);
 const inFlight=new Set();
 function request(service,type,timeout){
  if(!ORIGINS.has(location.origin)||!['chatgpt','claude','gemini'].includes(service))return Promise.resolve({status:'unavailable'});
  let id='';try{id=localStorage.getItem('glance-extension-id')||''}catch{}
  if(!/^[a-p]{32}$/.test(id)||!root.chrome?.runtime?.sendMessage)return Promise.resolve({status:'not-connected'});
  if(inFlight.has(type))return Promise.resolve({status:'cooldown'});inFlight.add(type);
  return new Promise(resolve=>{let finished=false;const finish=result=>{if(finished)return;finished=true;clearTimeout(timer);inFlight.delete(type);resolve(result)},timer=setTimeout(()=>finish({status:'unavailable'}),timeout);
   try{chrome.runtime.sendMessage(id,{type,service},result=>{const failed=chrome.runtime.lastError;finish(failed?{status:'unavailable'}:result?.error&&/未対応|unsupported/i.test(result.error)?{status:'unsupported'}:result?.error?{status:'unavailable'}:result||{status:'unavailable'})})}catch{finish({status:'unavailable'})}
  });
 }
 root.LLMTaskBridge={read:service=>request(service,'TASKS_READ',26000),states:service=>request(service,'TASKS_STATE',5000)};
})(globalThis);
