/* Task-window-only read-only overview; no quota acquisition or saved history. */
(function(root){
 'use strict';
 const SOURCES={chatgpt:'https://status.openai.com/',claude:'https://status.claude.com/',gemini:'https://www.google.com/appsstatus/dashboard/products/npdyhgECDJ6tB66MxXyo/history'};
 const clean=(v,n)=>typeof v==='string'?v.slice(0,n):'';
 const validTime=v=>typeof v==='number'&&Number.isFinite(v)&&v>0?v:null;
 function normalize(r,service,now=Date.now()){
  if(r?.schemaVersion!==1||r.service!==service||!Object.hasOwn(SOURCES,service))return null;
  const u=r.usage||{},p=r.incident||{},capturedAt=validTime(u.capturedAt),checkedAt=validTime(p.checkedAt),fresh=capturedAt&&capturedAt<=now+5000&&now-capturedAt<125000;
  const windows=(Array.isArray(u.windows)?u.windows:[]).slice(0,6).map(w=>{const resetAt=validTime(w?.resetAt),expired=w?.expired===true||!!resetAt&&resetAt<=now;return {label:clean(w?.label,80),remaining:!expired&&typeof w?.remaining==='number'&&Number.isFinite(w.remaining)&&w.remaining>=0&&w.remaining<=100?w.remaining:null,expired,resetAt};});
  return {tiboFeed:service==='chatgpt'&&root.GlanceIntelligence?root.GlanceIntelligence.normalize(r.tiboFeed):null,usage:{plan:u.status==='login'?'':clean(u.plan,80),status:u.status==='login'?'login':u.status==='loading'?'loading':u.status==='ready'&&fresh?'ready':capturedAt?'previous':'unknown',capturedAt,windows:u.status==='login'?[]:windows},incident:{state:['ok','issue','recovered'].includes(p.state)?p.state:'unknown',summary:clean(p.summary,180),checkedAt,current:!!checkedAt&&checkedAt<=now+5000&&now-checkedAt<125000,url:SOURCES[service]}};
 }
 let service='',language='en',last=null,connected=false,busy=false,started=false;
 const copy={en:{title:'Remaining usage',ready:'Official usage · every minute',previous:'Previous usage · waiting for update',loading:'Updating · previous usage',unknown:'Usage unavailable',login:'Sign in on the official site',pair:'Connect or update the extension',reset:'Reset',expired:'Reset passed · awaiting update',alert:'Service incident',old:'Previous incident · status update pending',status:'Official status unavailable',source:'Official status ↗'},ja:{title:'利用残量',ready:'公式使用量 · 約1分ごと',previous:'前回の残量 · 更新待ち',loading:'更新中 · 前回の残量',unknown:'残量未取得',login:'公式サイトでログイン',pair:'拡張機能の接続・更新が必要です',reset:'リセット',expired:'リセット済み · 再取得待ち',alert:'サービス障害',old:'前回の障害情報 · 更新待ち',status:'公式障害情報を確認できません',source:'公式ステータス ↗'}};
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const LABELS={en:{'現在のセッション':'Current session','週間':'Weekly','Work / Codex · 5時間':'Work / Codex · 5 hours','週間 (Work / Codex)':'Weekly (Work / Codex)'},ja:{'Current session':'現在のセッション','Weekly':'週間','Work / Codex · 5 hours':'Work / Codex · 5時間','Weekly (Work / Codex)':'週間 (Work / Codex)'}};
 function countdown(at,now=Date.now(),lang=language){const n=Math.ceil((at-now)/60000);if(!Number.isFinite(n)||n<=0)return '';const d=Math.floor(n/1440),h=Math.floor(n%1440/60),m=n%60;return lang==='ja'?`（あと${d?d+'日':''}${h?h+'時間':''}${m||(!d&&!h)?m+'分':''}）`:` (${d?d+'d ':''}${h?h+'h ':''}${m||(!d&&!h)?m+'m ':''}left)`;}
 function render(){
  const host=document.getElementById('task-monitor');if(!host)return;
  const c=copy[language],data=last&&normalize(last,service),u=data?.usage,p=data?.incident;
  host.setAttribute('aria-label',c.title);host.replaceChildren();
  const line=el('div',undefined,'task-usage-head');line.append(el('strong',c.title),el('small',connected?(c[u?.status]||c.unknown):last?c.previous:c.pair));host.append(line);
  const mark=data?.tiboFeed&&root.GlanceIntelligence?.tiboDetails(data.tiboFeed,language);if(mark){const a=el('a',mark.label,'task-tibo-reset');a.href=mark.url;a.title=mark.title;a.setAttribute('aria-label',mark.label+' · '+mark.title);a.target='_blank';a.rel='noopener noreferrer';host.append(a);}
  if(u?.plan&&u.plan!=='未取得')host.append(el('small',u.plan,'task-usage-plan'));
  for(const w of u?.windows||[]){
   const label=LABELS[language][w.label]||w.label,row=el('div',undefined,'task-usage-row'),head=el('div',undefined,'task-usage-label');head.append(el('span',label),el('strong',w.remaining===null?'—':`${Math.round(w.remaining)}%`));row.append(head);
   const track=el('div',undefined,'task-usage-track');track.setAttribute('role','progressbar');track.setAttribute('aria-label',label);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');if(w.remaining!==null){track.setAttribute('aria-valuenow',String(w.remaining));const bar=el('span');bar.style.width=w.remaining+'%';track.append(bar);}else track.setAttribute('aria-valuetext',c.unknown);row.append(track);
   if(w.expired)row.append(el('small',c.expired));else if(w.resetAt)row.append(el('small',`${c.reset} ${new Date(w.resetAt).toLocaleString(language==='ja'?'ja-JP':'en-US',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})}${countdown(w.resetAt)}`));host.append(row);
  }
  if(p?.state==='issue'||!p?.current||p?.state==='unknown'){
   const incident=el('div',undefined,'task-incident');if(p?.state==='issue')incident.classList.add('issue');incident.append(el('strong',p?.state==='issue'?(p.current&&connected?c.alert:c.old):c.status));if(p?.state==='issue')incident.append(el('span',p.summary));
   const a=el('a',c.source);a.href=SOURCES[service];a.target='_blank';a.rel='noopener noreferrer';incident.append(a);if(service==='chatgpt'){const tibo=el('a','Tibo 𝕏 ↗');tibo.href='https://x.com/thsottiaux';tibo.target='_blank';tibo.rel='noopener noreferrer';tibo.title=language==='ja'?'OpenAIスタッフの発信':'OpenAI staff source';incident.append(tibo);}host.append(incident);
  }
 }
 async function read(){if(busy||document.hidden)return;busy=true;try{const r=await root.LLMTaskBridge.monitor(service);if(normalize(r,service)){last=r;connected=true;}else connected=false;}catch{connected=false;}finally{busy=false;render();}}
 function mount(s,l){service=s;language=l==='ja'?'ja':'en';render();if(!started){started=true;read();setInterval(()=>{render();read()},10000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)read()});}}
 root.LLMTaskMonitor={normalize,mount,countdown};if(typeof module!=='undefined')module.exports=root.LLMTaskMonitor;
})(globalThis);
