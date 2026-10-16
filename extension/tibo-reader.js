(function(root){
 const ORIGIN='https://x.com/*',KEY='llms-tibo-reader-v1';
 function route(value){try{const u=new URL(value);return u.origin==='https://x.com'&&!u.username&&!u.password&&!u.hash&&[...u.searchParams.keys()].every(k=>['s','t'].includes(k))&&new Set(u.searchParams.keys()).size===[...u.searchParams.keys()].length&&/^\/thsottiaux(?:\/status\/\d{1,25})?\/?$/.test(u.pathname)}catch{return false}}
 function deadline(text,publishedAt){
  // Announced timing is approximate; it is never proof of individual quota recovery.
  const relative=text.match(/\blanding\s+within\s+(?:the\s+)?next\s+(\d{1,2})\s+hours?\b/i)||text.match(/(?:今後|これから)\s*(\d{1,2})\s*時間以内(?:に)?(?:着陸|実施|反映)/);
  if(relative){const hours=Number(relative[1]);return hours>=1&&hours<=24?publishedAt+hours*3600000:null;}
  if(!(/\b(?:by|today|tonight)\b/i.test(text)||/本日|今日/.test(text))||!(/\bEOD\s+PST(?:\s+time)?\b/i.test(text)||/PST(?:時間)?\s*EODまで/i.test(text)))return null;
  const day=new Date(publishedAt-8*3600000);return Date.UTC(day.getUTCFullYear(),day.getUTCMonth(),day.getUTCDate()+1,8)-60000;
 }
 function classify(row,now=Date.now(),context=null){
  if(!row||!/^\d{1,25}$/.test(String(row.id||''))||row.account!=='thsottiaux'||typeof row.text!=='string')return null;
  const raw=row.text.slice(0,2000),text=raw.replace(/\s+/g,' ').trim().slice(0,360),at=Date.parse(row.createdAt);
  if(!Number.isFinite(at)||at>now+300000||now-at>604800000)return null;
  const excluded=/password|credential|account\s+reset|パスワード|認証/i.test(raw);
  const contextual=!!context&&row.conversationId===context.id&&row.id!==context.id&&at>=context.publishedAt&&at-context.publishedAt<=600000&&deadline(raw,at)!==null&&/landing|着陸|実施|反映/i.test(raw);
  if(excluded||!contextual&&!(/\breset(?:s|ting)?\b|リセット/i.test(raw)))return null;
  const relevant=contextual||/\b(?:Codex|quota|limit|usage|global\s+reset)\b|利用枠|上限|グローバルリセット/i.test(raw)||/(?:\bDay\s+\d{1,3}\s*[/／]\s*Reset\b|\d{1,3}日目\s*[/／]\s*リセット)/i.test(raw);
  if(!relevant)return null;
  return {id:row.id,provider:'openai',kind:'reset',severity:'warning',account:'@thsottiaux · OpenAI staff',title:'Tibo · Reset announcement',summary:text,url:`https://x.com/thsottiaux/status/${row.id}`,publishedAt:at,detectedAt:now,resetAt:deadline(raw,at)};
 }
 // Only rendered public articles from the fixed author; never inspect inputs or account/session data.
 function readPage(){
  const u=new URL(location.href);if(u.origin!=='https://x.com'||u.username||u.password||u.hash||[...u.searchParams.keys()].some(k=>!['s','t'].includes(k))||new Set(u.searchParams.keys()).size!==[...u.searchParams.keys()].length||!/^\/thsottiaux(?:\/status\/\d{1,25})?\/?$/.test(u.pathname))return [];
  return Array.from(document.querySelectorAll('article[data-testid="tweet"]')).slice(0,50).flatMap(article=>{
   if(article.getBoundingClientRect().width===0)return [];
   const name=article.querySelector('[data-testid="User-Name"]'),author=name&&Array.from(name.querySelectorAll('a[href]')).find(a=>a.textContent.trim()==='@thsottiaux'&&a.getAttribute('href')==='/thsottiaux');
   const time=article.querySelector('time'),link=time?.closest('a'),match=link?.getAttribute('href')?.match(/^\/thsottiaux\/status\/(\d{1,25})$/),body=article.querySelector('[data-testid="tweetText"]');
   if(!author||!match||!body||name.closest('[data-testid="quoteTweet"]')||body.closest('[data-testid="quoteTweet"]'))return [];return [{id:match[1],account:'thsottiaux',text:body.textContent.slice(0,2000),createdAt:time.getAttribute('datetime'),conversationId:u.pathname.match(/^\/thsottiaux\/status\/(\d{1,25})\/?$/)?.[1]||''}];
  });
 }
 async function read(chrome,prior,now=Date.now()){
  const enabled=(await chrome.storage.local.get(KEY))[KEY]===true;if(!enabled)return null;
  let alerts=prior.alerts||[],readerState='permission-required';
  try{
   if(!await chrome.permissions.contains({permissions:['scripting'],origins:[ORIGIN]}))throw Error('Permission unavailable');
   readerState='api-unavailable';if(typeof chrome.scripting?.executeScript!=='function')throw Error('Public reader API unavailable');readerState='no-public-page';const tabs=(await chrome.tabs.query({url:ORIGIN})).filter(t=>route(t.url)).slice(0,3);if(!tabs.length)throw Error('No public page');
   readerState='no-public-posts';const rows=[],boundedRead=async tab=>{let timer;try{return await Promise.race([chrome.scripting.executeScript({target:{tabId:tab.id,frameIds:[0]},func:readPage}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Public reader timeout')),1500)})])}finally{clearTimeout(timer)}};await Promise.all(tabs.map(async tab=>{try{for(const item of await boundedRead(tab))if(item.frameId===0&&Array.isArray(item.result))rows.push(...item.result.slice(0,50));}catch{}}));
   if(!rows.length)throw Error('No public posts');
   const contexts=new Map(rows.map(row=>classify(row,now)).filter(Boolean).map(a=>[a.id,a]));
   const classified=rows.map(row=>classify(row,now,contexts.get(row.conversationId))).filter(Boolean);
   const merged=new Map(alerts.map(a=>[a.id,a]));for(const a of classified){if(a){const previous=merged.get(a.id);if(!previous)merged.set(a.id,a);else if(a.resetAt&&a.resetAt!==previous.resetAt)merged.set(a.id,{...a,detectedAt:previous.detectedAt||a.detectedAt});}}
   alerts=[...merged.values()].filter(a=>now-a.publishedAt<=604800000).sort((a,b)=>b.publishedAt-a.publishedAt).slice(0,50);
   return {status:'ready',readerState:'ready',readerInfo:{pages:tabs.length,posts:rows.length,resetPosts:classified.length},checkedAt:now,lastReadyAt:now,alerts};
  }catch{return {...prior,status:'unavailable',readerState,checkedAt:now,alerts};}
 }
 root.GlanceTiboReader={ORIGIN,KEY,route,deadline,classify,readPage,read};if(typeof module!=='undefined')module.exports=root.GlanceTiboReader;
})(globalThis);
