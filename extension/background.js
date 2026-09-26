const URLS={chatgpt:'https://chatgpt.com/settings/usage?tab=overview',claude:'https://claude.ai/new#settings/usage',gemini:'https://gemini.google.com/usage'};
const HOSTS={chatgpt:'chatgpt.com',claude:'claude.ai',gemini:'gemini.google.com'};
const ALLOWED=new Set(['https://ai-usage-glance.ntusnog.chatgpt.site','http://localhost:4173','http://127.0.0.1:4173']);
let queue=Promise.resolve();
function serialize(fn){const p=queue.then(fn);queue=p.catch(()=>{});return p;}
async function state(){return {settings:{opacity:80,position:'bottom-right',enabled:true,...(await chrome.storage.local.get('settings')).settings},data:(await chrome.storage.session.get('data')).data||{}};}
async function managed(){return (await chrome.storage.session.get('managed')).managed||{}};
async function setService(id,snapshot){const {data={}}=await chrome.storage.session.get('data');data[id]=snapshot;await chrome.storage.session.set({data});}
function usageURL(id,url){try{const u=new URL(url);return u.hostname===HOSTS[id]&&(id==='chatgpt'?u.pathname==='/settings/usage':id==='gemini'?u.pathname==='/usage':u.pathname==='/settings/usage'||u.hash==='#settings/usage');}catch{return false}}
async function openService(id){if(!URLS[id])throw Error('サービスが見つかりません');const m=await managed();if(m[id]){try{const t=await chrome.tabs.get(m[id]);await chrome.tabs.update(t.id,{active:true,...(!usageURL(id,t.url)?{url:URLS[id]}:{})});return {ok:true};}catch{delete m[id]}}
 const t=await chrome.tabs.create({url:URLS[id],active:true});m[id]=t.id;await chrome.storage.session.set({managed:m});await setService(id,{status:'loading',windows:[],capturedAt:null,note:'公式画面を読み込み中です。'});return {ok:true};}
async function refresh(){const m=await managed();for(const [id,tabId]of Object.entries(m)){try{const t=await chrome.tabs.get(tabId);if(usageURL(id,t.url)){await chrome.tabs.reload(tabId);}else{await setService(id,{status:'login',windows:[],capturedAt:null,note:'公式画面でログインし、使用量画面に戻ってください。'});}}catch{delete m[id];await setService(id,{status:'error',windows:[],capturedAt:null,note:'使用量タブが閉じられました。接続し直してください。'});}}await chrome.storage.session.set({managed:m});return {ok:true};}
async function handle(message,sender,external){
 if(!message||typeof message!=='object')throw Error('無効なリクエスト');
 const origin=(()=>{try{return new URL(sender.url).origin}catch{return ''}})();
 const trusted=external?ALLOWED.has(origin):sender.url?.startsWith(chrome.runtime.getURL(''));
 if(message.type==='SNAPSHOT'&&!external){const id=message.service,m=await managed();if(!HOSTS[id]||sender.tab?.id!==m[id]||origin!==`https://${HOSTS[id]}`)return {ok:false};
 const windows=(message.windows||[]).filter(w=>typeof w.remaining==='number'&&Number.isFinite(w.remaining)&&w.remaining>=0&&w.remaining<=100).slice(0,6).map(w=>({label:String(w.label).slice(0,80),remaining:w.remaining,reset:String(w.reset||'').slice(0,150)}));
 await setService(id,{windows:message.status==='login'?[]:windows,status:['ready','login','unavailable'].includes(message.status)?message.status:'unavailable',capturedAt:Date.now(),note:message.status==='login'?'公式サイトでログインしてください。':windows.length?'公式画面から取得。':'数値を読み取れません。公式画面を確認してください。'});return {ok:true};}
 // Content scripts can only read state; no arbitrary webpages may open tabs or change settings.
 if(message.type==='GET'&&(!external||trusted))return state();
 if(!trusted)throw Error('このページからの操作は許可されていません');
 if(message.type==='OPEN')return openService(message.service);
 if(message.type==='REFRESH')return refresh();
 if(message.type==='SETTINGS'){const s=message.settings||{},settings={opacity:Math.min(100,Math.max(35,Number(s.opacity)||80)),position:['bottom-right','bottom-left','top-right','top-left'].includes(s.position)?s.position:'bottom-right',enabled:s.enabled!==false};await chrome.storage.local.set({settings});return {ok:true};}
 throw Error('未対応の操作');
}
function listener(external){return (m,s,reply)=>{serialize(()=>handle(m,s,external)).then(reply,e=>reply({error:e.message}));return true;};}
chrome.runtime.onMessage.addListener(listener(false));chrome.runtime.onMessageExternal.addListener(listener(true));
chrome.action.onClicked.addListener(()=>chrome.tabs.create({url:chrome.runtime.getURL('index.html')}));
chrome.runtime.onInstalled.addListener(()=>chrome.alarms.create('glance-refresh',{periodInMinutes:1}));
chrome.runtime.onStartup.addListener(()=>chrome.alarms.create('glance-refresh',{periodInMinutes:1}));
chrome.alarms.onAlarm.addListener(a=>{if(a.name==='glance-refresh')serialize(refresh)});
chrome.tabs.onRemoved.addListener(tabId=>serialize(async()=>{const m=await managed();for(const[id,t]of Object.entries(m))if(t===tabId){delete m[id];await setService(id,{status:'error',windows:[],capturedAt:null,note:'使用量タブが閉じられました。再接続してください。'})}await chrome.storage.session.set({managed:m})}));
chrome.tabs.onUpdated.addListener((tabId,change)=>{if(change.status!=='loading')return;serialize(async()=>{const m=await managed();for(const[id,t]of Object.entries(m))if(t===tabId)await setService(id,{status:'loading',windows:[],capturedAt:null,note:'使用量画面を確認しています。'})})});
