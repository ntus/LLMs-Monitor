/* User-clicked metadata handoff only. Browser-memory session storage survives worker sleep. */
(function(root){
 const KEY='llms-task-note-pending-v1',TTL=120000,ORIGINS=new Set(['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site']);let queue=Promise.resolve();
 function serialize(fn){const result=queue.then(fn);queue=result.catch(()=>{});return result.catch(()=>({status:'unavailable'}));}
 function route(value,service){const basic=root.LLMTaskList.link(value,service);if(basic)return basic.url;try{const u=new URL(value);return service==='claude'&&u.origin==='https://claude.ai'&&!u.username&&!u.password&&!u.hash&&/^\/code\/project\/[a-zA-Z0-9_-]+\/?$/.test(u.pathname)&&[...u.searchParams].length===1&&/^cmsg_[a-zA-Z0-9_-]+$/.test(u.searchParams.get('thread')||'')?u.href:''}catch{return ''}}
 async function pending(){const saved=await chrome.storage.session.get(KEY),now=Date.now(),out={};for(const [id,v] of Object.entries(saved[KEY]||{}).slice(0,20)){if(!/^[-a-zA-Z0-9]{1,80}$/.test(id)||!v||typeof v.title!=='string'||!v.title.trim()||v.title.length>200||route(v.url,v.service)!==v.url||!Number.isFinite(v.createdAt)||v.createdAt>now||now-v.createdAt>TTL)continue;out[id]={service:v.service,url:v.url,title:v.title,createdAt:v.createdAt};}return out;}
 async function write(items){const rows=Object.values(items);if(rows.length){await chrome.storage.session.set({[KEY]:items});chrome.alarms?.create('llms-task-note-expiry',{when:Math.min(...rows.map(v=>v.createdAt))+TTL+1});}else{await chrome.storage.session.remove(KEY);await chrome.alarms?.clear('llms-task-note-expiry');}}
 function register(message,sender){return serialize(async()=>{
  const service=message.service,url=route(sender.url,service);
  if(sender.id!==chrome.runtime.id||sender.frameId!==0||!Number.isInteger(sender.tab?.id)||!url||message.url!==url)return {status:'unavailable'};
  const title=typeof message.title==='string'?message.title.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,200):'';if(!title)return {status:'unavailable'};
  const items=await pending();if(Object.keys(items).length>=20)return {status:'unavailable'};const token=crypto.randomUUID();items[token]={service,url,title,createdAt:Date.now()};await write(items);
  const target=new URL('https://llmsmonitor.ntus.info/tasks');target.searchParams.set('service',service);target.searchParams.set('lang',message.language==='ja'?'ja':'en');target.searchParams.set('note',token);target.searchParams.set('extension',chrome.runtime.id);
  try{await chrome.windows.create({url:target.href,type:'popup',width:420,height:800});return {status:'opened'};}catch{try{await root.GlanceWindows.createNormalTab(chrome,target.href);return {status:'opened'};}catch{delete items[token];await write(items);return {status:'unavailable'};}}
 });}
 function read(message,sender){return serialize(async()=>{let u;try{u=new URL(sender.url)}catch{return {status:'unavailable'}}
  if(sender.frameId!==0||!ORIGINS.has(u.origin)||u.username||u.password||!/^\/tasks(?:\.html)?$/.test(u.pathname)||u.searchParams.getAll('service').length!==1||u.searchParams.getAll('note').length!==1||u.searchParams.get('service')!==message.service||u.searchParams.get('note')!==message.token)return {status:'unavailable'};
  const items=await pending(),v=items[message.token];if(!v||v.service!==message.service){await write(items);return {status:'unavailable'};}delete items[message.token];await write(items);return {status:'ready',task:{service:v.service,url:v.url,title:v.title}};
 });}
 chrome.alarms?.onAlarm?.addListener(alarm=>{if(alarm.name==='llms-task-note-expiry')serialize(async()=>{await write(await pending());return {status:'cleared'}})});
 root.LLMTaskNoteBackground={register,read,route};if(typeof module!=='undefined')module.exports=root.LLMTaskNoteBackground;
})(globalThis);
