(function(root){
 const FEED_URL='https://llmsmonitor.ntus.info/api/intelligence.json';
 const SOURCE_HOSTS=new Set(['x.com']);
 const providers={openai:'OpenAI',anthropic:'Anthropic',google:'Google'};
 const clean=value=>String(value??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,360);
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 function safeUrl(value){try{const url=new URL(String(value));return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&!url.search&&!url.hash&&SOURCE_HOSTS.has(url.hostname)&&/^\/[A-Za-z0-9_]{1,30}\/status\/[A-Za-z0-9_-]{1,100}\/?$/.test(url.pathname)?url.href:''}catch{return ''}}
 function normalizeAlert(row){
  if(!row||typeof row!=='object')return null;
  const id=clean(row.id).slice(0,100),url=safeUrl(row.url),provider=Object.hasOwn(providers,row.provider)?row.provider:'',kind=['usage','reset','recovery','model-update'].includes(row.kind)?row.kind:'',severity=['info','warning','critical'].includes(row.severity)?row.severity:'info';
  if(!id||!url||!provider||!kind)return null;
  const number=value=>Number.isFinite(Number(value))?Number(value):null;
  return {id,provider,kind,severity,account:clean(row.account).slice(0,80),title:clean(row.title).slice(0,160),summary:clean(row.summary),url,publishedAt:number(row.publishedAt),detectedAt:number(row.detectedAt),model:clean(row.model).slice(0,100),currentPower:number(row.currentPower),previousPower:number(row.previousPower),resetAt:number(row.resetAt)};
 }
 function normalize(feed){
  const alerts=(Array.isArray(feed?.alerts)?feed.alerts:[]).map(normalizeAlert).filter(Boolean).sort((a,b)=>(b.publishedAt||b.detectedAt||0)-(a.publishedAt||a.detectedAt||0)).slice(0,50);
  return {status:['ready','unavailable','unconfigured'].includes(feed?.status)?feed.status:'unavailable',checkedAt:Number(feed?.checkedAt)||0,lastReadyAt:Number(feed?.lastReadyAt)||(feed?.status==='ready'?Number(feed?.checkedAt)||0:0),alerts};
 }
 function key(feed){return normalize(feed).alerts.map(row=>row.id).sort().join('|')}
 function newAlerts(previous,current){const before=new Set(normalize(previous).alerts.map(row=>row.id));if(!normalize(previous).lastReadyAt||normalize(current).status!=='ready')return [];return normalize(current).alerts.filter(row=>!before.has(row.id));}
 function label(row,language){const ja=language!=='en';if(row.kind==='recovery')return ja?'利用枠の復旧情報':'Usage recovery';if(row.kind==='reset')return ja?'リセット速報':'Reset update';if(row.kind==='usage')return ja?'利用枠速報':'Usage-limit update';return ja?'モデル速報':'Model update'}
 function tiboDetails(feed,language='en',now=Date.now()){
  const row=normalize(feed).alerts.find(a=>a.provider==='openai'&&a.kind==='reset'&&/^@thsottiaux(?: · OpenAI staff)?$/.test(a.account)&&a.url===`https://x.com/thsottiaux/status/${a.id}`&&Number.isFinite(a.resetAt)&&Number.isFinite(new Date(a.resetAt).getTime())&&a.resetAt>now&&a.resetAt-now<=604800000&&a.publishedAt>0&&a.publishedAt<=now&&now-a.publishedAt<=604800000);
  if(!row)return null;const d=new Date(row.resetAt),p=n=>String(n).padStart(2,'0'),stamp=`${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`,ja=language!=='en';
  const tip=`${row.summary} · ${d.toLocaleString(ja?'ja-JP':'en-US',{timeZoneName:'short'})} · ${ja?'告知のEOD PST期限を換算した目安です。正確な実施時刻・個人の残量回復は未確認。':'Approximate announced EOD PST deadline; exact execution and personal quota recovery are unverified.'}${normalize(feed).status!=='ready'?(ja?' 最新取得は未確認。':' Latest read unavailable.'):''}`;
  return {url:row.url,label:`Tibo 𝕏 Reset? (${stamp})`,title:tip};
 }
 function tiboMark(feed,language='en',now=Date.now()){const mark=tiboDetails(feed,language,now);if(!mark)return '';return `<a class="tibo-reset-mark" href="${mark.url}" target="_blank" rel="noopener noreferrer" title="${escape(mark.title)}" aria-label="${escape(mark.label+' · '+mark.title)}">${escape(mark.label)}</a>`;
 }
 function view(feed,language='en',open=false){
  const data=normalize(feed),ja=language!=='en',latest=data.alerts[0],state=data.status==='ready'?'ready':data.status==='unconfigured'?'unconfigured':'unavailable';
  const title=latest?`${label(latest,language)} · ${providers[latest.provider]}`:state==='ready'?(ja?'AI速報':'AI intelligence'):state==='unconfigured'?(ja?'AI速報の接続待ち':'AI feed setup required'):(ja?'AI速報を確認できません':'AI feed unavailable');
  const body=latest?`<article class="intelligence-item ${latest.severity}"><div><strong>${escape(latest.title||label(latest,language))}</strong><span>${escape(latest.summary)}</span><small>${escape([latest.account,latest.model].filter(Boolean).join(' · '))}</small></div><a href="${latest.url}" target="_blank" rel="noopener noreferrer">${ja?'出典 ↗':'Source ↗'}</a></article>`:`<p>${escape(state==='ready'?(ja?'該当する新着情報はありません。':'No matching updates.'):(ja?'利用残量の取得には影響しません。':'Usage monitoring is unaffected.'))}</p>`;
  const note=state==='unconfigured'?(ja?'無料のTibo公開ページ読取りは［Tibo連携］で有効化できます。対象ページを開いてください。利用残量・公式障害監視とは独立です。':'Enable free public-page reading in Tibo connections and keep the public page open. Quota and official status monitoring are independent.'):(ja?'1分ごとに表示済み投稿を確認。自動リロードはしません。告知は個人の残量回復を意味しません。':'Checks rendered posts each minute without reloading. Announcements do not confirm personal quota recovery.');
  return `<details class="intelligence-feed ${state}${latest?' has-alert':''}"${open?' open':''}><summary>◉ ${escape(title)}${latest&&latest.severity!=='info'?' ⚠︎':''}</summary><div class="intelligence-popover">${body}<small>${escape(note)}</small></div></details>`;
 }
 root.GlanceIntelligence={tiboDetails,tiboMark,FEED_URL,providers,clean,safeUrl,normalizeAlert,normalize,key,newAlerts,label,view};if(typeof module!=='undefined')module.exports=root.GlanceIntelligence;
})(globalThis);
