/* Task state observes control metadata only. Never inspect message text or editable values. */
(function(root){
 'use strict';
 const T=root.LLMTaskList;
 const STOP=/^(?:stop(?: generating| response| responding)?|cancel response|生成を停止|応答を停止|回答の生成を停止|回答を停止|停止)$/i;
 const SEND=/^(?:send(?: message)?|submit|送信|プロンプトを送信|メッセージを送信)$/i;
 const VOICE=/^(?:start voice mode|start voice chat|voice mode|use microphone|dictate|音声会話を開始|音声入力(?:\s*\([^)]*\))?)$/i;
 const visible=n=>{if(!n?.getClientRects().length||n.hidden||n.getAttribute('aria-hidden')==='true')return false;const style=n.ownerDocument?.defaultView?.getComputedStyle(n);return !style||(style.visibility!=='hidden'&&style.display!=='none'&&style.opacity!=='0')};
 function identity(url,service){return T.link(url,service)}
 function same(a,b,service){return !!a&&!!b&&a.id===b.id&&a.kind===b.kind&&(service!=='gemini'||a.url.replace(/\/$/,'')===b.url.replace(/\/$/,''))}
 function observe(doc,service,url,now=Date.now()){
  const task=identity(url,service);if(!task)return {status:'unavailable'};
  const result={...task,status:'unknown',reason:'no-signal',evidence:'',observedAt:now};
  const composers=[...doc.querySelectorAll('[contenteditable="true"][role="textbox"]')].slice(0,10).filter(visible);
  if(composers.length!==1)return result;
  const composer=composers[0];let scope=composer.closest('form,fieldset');
  if(!scope){let parent=composer.parentElement;for(let i=0;parent&&i<6;i++,parent=parent.parentElement){
   if(/^(?:MAIN|ARTICLE|BODY|HTML)$/.test(parent.tagName))break;
   const buttons=[...parent.querySelectorAll('button')];if(buttons.length&&buttons.length<=12){scope=parent;break}
  }}
  if(!scope||!visible(scope))return result;
  const controls=[...scope.querySelectorAll('button')].slice(0,24).filter(visible).map(b=>({label:(b.getAttribute('aria-label')||'').trim().slice(0,100),test:(b.getAttribute('data-testid')||'').slice(0,80),disabled:!!b.disabled||b.getAttribute('aria-disabled')==='true'}));
  const stops=controls.filter(b=>STOP.test(b.label)||/^(?:stop-button|stop-response-button|stop-generating-button|chat-input-stop|code-prompt-stop)$/.test(b.test));
  if(stops.some(b=>!b.disabled))return {...result,status:'running',reason:'',evidence:'stop-control'};
  if(stops.length)return result;
  // Code/Cowork can continue in the background while accepting another prompt.
  if(task.kind!=='chat')return result;
  const ready=composer.getAttribute('aria-disabled')!=='true'&&controls.some(b=>SEND.test(b.label)||VOICE.test(b.label)||/^(?:send-button|send-message-button)$/.test(b.test));
  return ready?{...result,status:'idle',reason:'',evidence:'composer-ready'}:result;
 }
 const api={identity,same,observe};if(typeof module==='object'&&module.exports)module.exports=api;else root.LLMTaskStatus=Object.freeze(api);
})(globalThis);
