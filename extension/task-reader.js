(()=>{
 if(globalThis.llmsTaskReader)return;globalThis.llmsTaskReader=true;
 const T=LLMTaskList,service=Object.keys(T.HOSTS).find(id=>T.HOSTS[id]===location.hostname);
 chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(sender.id!==chrome.runtime.id||message?.type!=='TASK_LIST_READ'||!service)return false;
  reply(T.collect(document,service));return false;
 });
})();
