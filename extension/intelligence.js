(function(root){
 const FEED_URL='https://llmsmonitor.ntusnog.chatgpt.site/api/intelligence.json';
 const SOURCE_HOSTS=new Set(['x.com']);
 const providers={openai:'OpenAI',anthropic:'Anthropic',google:'Google'};
 const clean=value=>String(value??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,360);
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 function safeUrl(value){try{const url=new URL(String(value));return url.protocol==='https:'&&SOURCE_HOSTS.has(url.hostname)?url.href:''}catch{return ''}}
 function normalizeAlert(row){
  if(!row||typeof row!=='object')return null;
  const id=clean(row.id).slice(0,100),url=safeUrl(row.url),provider=Object.hasOwn(providers,row.provider)?row.provider:'',kind=['usage','reset','recovery','model-update'].includes(row.kind)?row.kind:'',severity=['info','warning','critical'].includes(row.severity)?row.severity:'info';
  if(!id||!url||!provider||!kind)return null;
  const number=value=>Number.isFinite(Number(value))?Number(value):null;
  return {id,provider,kind,severity,account:clean(row.account).slice(0,80),title:clean(row.title).slice(0,160),summary:clean(row.summary),url,publishedAt:number(row.publishedAt),detectedAt:number(row.detectedAt),model:clean(row.model).slice(0,100),currentPower:number(row.currentPower),previousPower:number(row.previousPower)};
 }
 function normalize(feed){
  const alerts=(Array.isArray(feed?.alerts)?feed.alerts:[]).map(normalizeAlert).filter(Boolean).sort((a,b)=>(b.publishedAt||b.detectedAt||0)-(a.publishedAt||a.detectedAt||0)).slice(0,50);
  return {status:['ready','unavailable','unconfigured'].includes(feed?.status)?feed.status:'unavailable',checkedAt:Number(feed?.checkedAt)||0,alerts};
 }
 function key(feed){return normalize(feed).alerts.map(row=>row.id).sort().join('|')}
 function newAlerts(previous,current){const before=new Set(normalize(previous).alerts.map(row=>row.id));if(!normalize(previous).checkedAt)return [];return normalize(current).alerts.filter(row=>!before.has(row.id));}
 function label(row,language){const ja=language!=='en';if(row.kind==='recovery')return ja?'性能回復':'Performance recovery';if(row.kind==='reset')return ja?'リセット速報':'Reset update';if(row.kind==='usage')return ja?'利用枠速報':'Usage-limit update';return ja?'モデル速報':'Model update'}
 function view(feed,language='en',open=false){
  const data=normalize(feed),ja=language!=='en',latest=data.alerts[0],state=data.status==='ready'?'ready':data.status==='unconfigured'?'unconfigured':'unavailable';
  const title=latest?`${label(latest,language)} · ${providers[latest.provider]}`:state==='ready'?(ja?'AI速報':'AI intelligence'):state==='unconfigured'?(ja?'AI速報の接続待ち':'AI feed setup required'):(ja?'AI速報を確認できません':'AI feed unavailable');
  const body=latest?`<article class="intelligence-item ${latest.severity}"><div><strong>${escape(latest.title||label(latest,language))}</strong><span>${escape(latest.summary)}</span><small>${escape([latest.account,latest.model].filter(Boolean).join(' · '))}</small></div><a href="${latest.url}" target="_blank" rel="noopener noreferrer">${ja?'出典 ↗':'Source ↗'}</a></article>`:`<p>${escape(state==='ready'?(ja?'該当する新着情報はありません。':'No matching updates.'):(ja?'利用残量の取得には影響しません。':'Usage monitoring is unaffected.'))}</p>`;
  const note=ja?'1分ごとに確認。X投稿は外部情報であり、各社公式の利用量とは区別して表示します。':'Checked every minute. X posts are external intelligence, separate from official provider usage values.';
  return `<details class="intelligence-feed ${state}${latest?' has-alert':''}"${open?' open':''}><summary>◉ ${escape(title)}${latest&&latest.severity!=='info'?' ⚠︎':''}</summary><div class="intelligence-popover">${body}<small>${escape(note)}</small></div></details>`;
 }
 root.GlanceIntelligence={FEED_URL,providers,clean,safeUrl,normalizeAlert,normalize,key,newAlerts,label,view};if(typeof module!=='undefined')module.exports=root.GlanceIntelligence;
})(globalThis);
