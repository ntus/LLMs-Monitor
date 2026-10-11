/* User-clicked metadata handoff only: short-lived, single-use, isolated from quota storage. */
(function(root){
 const pending=new Map(),TTL=120000,ORIGINS=new Set(['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site']);
 function route(value,service){const basic=root.LLMTaskList.link(value,service);if(basic)return basic.url;try{const u=new URL(value);return service==='claude'&&u.origin==='https://claude.ai'&&!u.username&&!u.password&&!u.hash&&/^\/code\/project\/[a-zA-Z0-9_-]+\/?$/.test(u.pathname)&&[...u.searchParams].length===1&&/^cmsg_[a-zA-Z0-9_-]+$/.test(u.searchParams.get('thread')||'')?u.href:''}catch{return ''}}
 function prune(){for(const [id,v] of pending)if(Date.now()-v.createdAt>TTL)pending.delete(id);}
 async function register(message,sender){
  prune();const service=message.service,url=route(sender.url,service);
  if(sender.id!==chrome.runtime.id||sender.frameId!==0||!Number.isInteger(sender.tab?.id)||!url||message.url!==url||pending.size>=20)return {status:'unavailable'};
  const title=typeof message.title==='string'?message.title.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,200):'';if(!title)return {status:'unavailable'};
  const token=crypto.randomUUID();pending.set(token,{service,url,title,createdAt:Date.now()});
  const target=new URL('https://llmsmonitor.ntus.info/tasks');target.searchParams.set('service',service);target.searchParams.set('lang',message.language==='ja'?'ja':'en');target.searchParams.set('note',token);target.searchParams.set('extension',chrome.runtime.id);
  try{await chrome.windows.create({url:target.href,type:'popup',width:420,height:800});return {status:'opened'};}catch{try{await root.GlanceWindows.createNormalTab(chrome,target.href);return {status:'opened'};}catch{pending.delete(token);return {status:'unavailable'};}}
 }
 function read(message,sender){prune();let u;try{u=new URL(sender.url)}catch{return {status:'unavailable'}}
  if(sender.frameId!==0||!ORIGINS.has(u.origin)||!/^\/tasks(?:\.html)?$/.test(u.pathname)||u.searchParams.get('service')!==message.service||u.searchParams.get('note')!==message.token)return {status:'unavailable'};
  const v=pending.get(message.token);if(!v||v.service!==message.service)return {status:'unavailable'};pending.delete(message.token);return {status:'ready',task:{service:v.service,url:v.url,title:v.title}};
 }
 root.LLMTaskNoteBackground={register,read,route};if(typeof module!=='undefined')module.exports=root.LLMTaskNoteBackground;
})(globalThis);
