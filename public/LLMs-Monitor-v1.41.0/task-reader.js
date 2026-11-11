(()=>{
 if(globalThis.llmsTaskReader)return;globalThis.llmsTaskReader=true;
 const T=LLMTaskList,service=Object.keys(T.HOSTS).find(id=>T.HOSTS[id]===location.hostname);
 chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(sender.id!==chrome.runtime.id||globalThis.top!==globalThis.self||!service||message?.service!==service)return false;
  if(message.type==='TASK_LIST_PREPARE'&&[T.HOMES[service],service==='claude'?'https://claude.ai/code':''].includes(location.href)){reply({status:'prepared',count:T.prepare(document,service)});}
  else if(message.type==='TASK_PIN_ADVANCE'&&[T.HOMES[service],service==='claude'?'https://claude.ai/code':''].includes(location.href))reply({status:'scanned',more:T.advance(document,service)});
  else if(message.type==='TASK_LIST_READ')reply(T.collect(document,service));
  else if(message.type==='TASK_STATE_READ')reply(LLMTaskStatus.observe(document,service,location.href));
  else return false;
  return false;
 });
})();
