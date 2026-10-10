(()=>{
 if(globalThis.llmsTaskReader)return;globalThis.llmsTaskReader=true;
 const T=LLMTaskList,service=Object.keys(T.HOSTS).find(id=>T.HOSTS[id]===location.hostname);
 chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(sender.id!==chrome.runtime.id||globalThis.top!==globalThis.self||!service||message?.service!==service)return false;
  if(message.type==='TASK_LIST_READ')reply(T.collect(document,service));
  else if(message.type==='TASK_STATE_READ')reply(LLMTaskStatus.observe(document,service,location.href));
  else return false;
  return false;
 });
})();
