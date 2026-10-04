(function(root){
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function used(text){const m=clean(text).match(/(\d+(?:\.\d+)?)\s*[%％]\s*(?:使用済み|使用中|used)/i);return m&&Number(m[1])<=100?100-Number(m[1]):null;}
function remaining(text){const t=clean(text),m=t.match(/(?:残り\s*|remaining\s*)(\d+(?:\.\d+)?)\s*[%％]/i)||t.match(/(\d+(?:\.\d+)?)\s*[%％]\s*(?:remaining|left)/i);return m&&Number(m[1])<=100?Number(m[1]):null;}
function reset(text){return String(text||'').split(/\n/).map(clean).find(s=>/リセット|resets?|refreshes?/i.test(s)&&s.length<150)||'';}
function label(el,doc){return clean(el.getAttribute('aria-label')||(el.getAttribute('aria-labelledby')||'').split(' ').map(id=>doc.getElementById(id)?.textContent||'').join(' '));}
function vicinity(el,needsWindow=false){let p=el.parentElement;for(let i=0;i<6&&p;i++,p=p.parentElement){const t=p.innerText||'';if(/リセット|resets?|refreshes?/i.test(t)&&t.length<500&&(!needsWindow||/利用上限|usage limit|weekly|five.hour|5.hour/i.test(t)))return t;}return '';}
function parse(doc,service){
 const windows=[];
 if(service==='gemini')for(const [selector,name]of [['[data-test-id="gxu-currently"]','現在のセッション'],['[data-test-id="gxu-weekly"]','週間']]){const e=doc.querySelector(selector);if(!e)continue;const v=used(e.innerText),resetText=reset(e.innerText);if(v!==null)windows.push({label:name,remaining:v,reset:resetText,resetAt:resetTime(resetText)});}
 if(service==='claude')for(const e of doc.querySelectorAll('[role="meter"],[role="progressbar"]')){const l=label(e,doc);if(!/^(現在のセッション|今週|Current session|Weekly limits|All models|すべてのモデル)$/i.test(l))continue;const val=e.getAttribute('aria-valuenow');if(val===null||!Number.isFinite(Number(val))||Number(val)<0||Number(val)>100)continue;const t=e.getAttribute('aria-valuetext')||'';const v=remaining(t)??used(t);if(v===null)continue;const name=/今週|Weekly|All models|すべて/i.test(l)?'週間':'現在のセッション',resetText=reset(vicinity(e)),shown=resetText||(name==='現在のセッション'&&v===100?'最初のメッセージから開始します':'');windows.push({label:name,remaining:v,reset:shown,resetAt:resetTime(resetText)});}
 if(service==='claude'&&!windows.some(w=>w.label==='現在のセッション')){
  const body=String(doc.body?.innerText||''),start=body.search(/(?:^|\n)\s*(?:現在のセッション|Current session)\s*(?:\n|$)/i);
  if(start>=0){const section=body.slice(start,start+350).split(/(?:^|\n)\s*(?:今週|This week|Weekly limits|今週のFable|上限のリセット)\s*(?:\n|$)/i)[0],v=remaining(section)??used(section),resetText=reset(section);
   if(v!==null)windows.unshift({label:'現在のセッション',remaining:v,reset:resetText||(v===100?'最初のメッセージから開始します':''),resetAt:resetTime(resetText)});
  }
 }
 if(service==='claude'&&!windows.some(w=>w.label==='週間')){
  const body=String(doc.body?.innerText||''),start=body.search(/(?:^|\n)\s*(?:今週|This week|Weekly limits|All models|すべてのモデル)\s*(?:\n|$)/i);
  if(start>=0){const section=body.slice(start,start+450).split(/(?:^|\n)\s*(?:今週のFable|Fable|上限のリセット|Reset limits|クラウドセッションクレジット|Cloud session credits)\s*(?:\n|$)/i)[0],v=remaining(section)??used(section),resetText=reset(section);
   if(v!==null)windows.push({label:'週間',remaining:v,reset:resetText,resetAt:resetTime(resetText)});
  }
 }
 if(service==='chatgpt')for(const e of doc.querySelectorAll('progress,[role="progressbar"]')){const l=label(e,doc);if(!/残りの利用可能量|remaining/i.test(l))continue;const text=vicinity(e,true);const v=remaining(text);if(v===null)continue;const weekly=/週|week/i.test(text),five=/5\s*時間|5.hour|five.hour/i.test(text),resetText=reset(text);if(!weekly&&!five||weekly&&five)continue;windows.push({label:weekly?'週間 (Work / Codex)':'Work / Codex · 5時間',remaining:v,reset:resetText,resetAt:resetTime(resetText)});}
 return windows.slice(0,6);
}
function creditValue(text){
 const t=clean(text),jp=t.match(/([$＄€£￥¥][\d,.]+)\s*中\s*([$＄€£￥¥][\d,.]+)\s*が?残/),en=t.match(/([$€£￥¥][\d,.]+)\s*(?:remaining|left)/i);
 if(jp)return `残り ${jp[2]} / ${jp[1]}`;
 if(en)return `残り ${en[1]}`;
 const u=used(t);if(u!==null)return `残り ${Math.round(u)}%`;
 const m=t.match(/[$＄€£￥¥]\s*[\d,.]+/);return m?m[0]:'未取得';
}
function expiryTime(text){
 const t=clean(text);if(/^\d{10}(?:\d{3})?$/.test(t)){const numeric=Number(t),time=numeric>1e12?numeric:numeric*1000;return Number.isFinite(time)?time:null;}const iso=t.match(/20\d\d[-/]\d{1,2}[-/]\d{1,2}(?:[T\s]\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?/i)?.[0];if(iso){const time=new Date(iso.replace(/\//g,'-')).getTime();return Number.isNaN(time)?null:time;}
 const japanese=t.match(/(?:(20\d\d)年)?\s*(\d{1,2})月(\d{1,2})日(?:\s*(\d{1,2}):(\d{2}))?/),slash=t.match(/(?:(20\d\d)[-/])?(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/),english=t.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(20\d\d))?(?:\s+(?:at\s+)?(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i);
 let parts=japanese||slash,year,month,day,hour,minute;if(parts){year=parts[1]?Number(parts[1]):null;month=Number(parts[2]);day=Number(parts[3]);hour=Number(parts[4]||23);minute=Number(parts[5]||59);}else if(english){const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];year=english[3]?Number(english[3]):null;month=months.indexOf(english[1].slice(0,3).toLowerCase())+1;day=Number(english[2]);hour=Number(english[4]||23);minute=Number(english[5]||59);if(english[6])hour=hour%12+(english[6].toUpperCase()==='PM'?12:0);}else return null;
 if(month<1||month>12||day<1||day>31||hour>23||minute>59)return null;const now=new Date(),resolvedYear=year||now.getFullYear();let date=new Date(resolvedYear,month-1,day,hour,minute);if(date.getMonth()!==month-1||date.getDate()!==day)return null;if(!year&&date.getTime()<now.getTime()-86400000)date=new Date(resolvedYear+1,month-1,day,hour,minute);return date.getTime();
}
function resetTime(text,now=Date.now()){const t=clean(text);if(!t)return null;let match=t.match(/(?:(\d+)\s*日)?\s*(?:(\d+)\s*時間)?\s*(?:(\d+)\s*分)?\s*後/);if(match&&(match[1]||match[2]||match[3]))return now+((Number(match[1]||0)*24+Number(match[2]||0))*60+Number(match[3]||0))*60000;match=t.match(/in\s+(?:(\d+)\s*days?)?\s*(?:(\d+)\s*hours?)?\s*(?:(\d+)\s*minutes?)?/i);if(match&&(match[1]||match[2]||match[3]))return now+((Number(match[1]||0)*24+Number(match[2]||0))*60+Number(match[3]||0))*60000;const absolute=expiryTime(t.replace(/日の?/g,'日 '));if(absolute)return absolute;match=t.match(/(?:^|\s)(\d{1,2}):(\d{2})(?=.*(?:リセット|reset))/i);if(!match)return null;const current=new Date(now),date=new Date(current.getFullYear(),current.getMonth(),current.getDate(),Number(match[1]),Number(match[2]));const weekday=t.match(/(?:日曜日|月曜日|火曜日|水曜日|木曜日|金曜日|土曜日|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)/i)?.[0],days=["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],en=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],target=weekday?(days.indexOf(weekday)>=0?days.indexOf(weekday):en.indexOf(weekday.toLowerCase())):-1;if(target>=0)date.setDate(date.getDate()+(target-current.getDay()+7)%7);if(date.getTime()<=now)date.setDate(date.getDate()+(target>=0?7:1));return date.getTime();}
function expiryDetail(time){if(!time)return '';const date=new Date(time),days=Math.max(0,Math.ceil((time-Date.now())/86400000)),left=time<=Date.now()?'期限切れ':days<=1?'24時間以内':`あと${days}日`;return `有効期限 ${date.toLocaleString('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})}（${left}）`;}
function chatGPTReset(doc){
 const tabs=Array.from(doc.querySelectorAll?.('[role="tab"]')||[]),tab=tabs.find(t=>/(?:利用可能|Available)\s*\d+/i.test(clean(t.textContent))),label=clean(tab?.textContent);let count=label.match(/(\d+)/)?.[1];
 const panels=Array.from(doc.querySelectorAll?.('[role="tabpanel"]')||[]),linked=tab?.id&&panels.find(p=>p.getAttribute?.('aria-labelledby')===tab.id),panel=linked||panels.find(p=>/(?:available|利用可能)/i.test(`${p.id||''} ${p.getAttribute?.('aria-labelledby')||''}`));
 const body=clean(doc.body?.innerText||doc.body?.textContent||''),section=/(?:利用上限のリセット|Usage limit resets?|Rate limit resets?)/i.test(body);if(count==null)count=body.match(/(?:利用上限のリセット|Usage limit resets?|Rate limit resets?)[\s\S]{0,250}?(?:利用可能|Available)\s*(\d+)/i)?.[1];
 if(!tab&&!panel&&!section)return null;
 const scope=panel||doc,texts=Array.from(scope.querySelectorAll?.('span,div,p,li,[role="listitem"]')||[]).map(e=>clean(e.textContent)).filter(t=>t&&t.length<180),expiryPattern=/(?:有効期限|期限|expires?|expiration(?:\s+date)?|valid\s+(?:until|through)|use\s+by|redeem\s+by)\s*[:：]?\s*(?:(?:on|at|is|date)\s*[:：]?\s*)?(?:20\d\d[-/]\d{1,2}[-/]\d{1,2}|(?:20\d\d年)?\s*\d{1,2}月\d{1,2}日|(?:20\d\d[-/])?\d{1,2}\/\d{1,2}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2})(?:[^\n]{0,28})?/i,visibleExpiry=texts.find(t=>expiryPattern.test(t))||'',scopeText=clean(scope.innerText||scope.textContent||''),scopeExpiry=scopeText.match(expiryPattern)?.[0]||'',bodyExpiry=body.match(expiryPattern)?.[0]||'';
 const expiryAttributes=['data-expires-at','data-expires','data-expiration','data-expiration-date','data-expiry','data-valid-until','data-use-by','datetime'],attrNodes=Array.from(scope.querySelectorAll?.(`[${expiryAttributes.join('],[')}],[aria-label],[title]`)||[]),attributeExpiry=attrNodes.map(e=>{const values=expiryAttributes.map(key=>({key,value:e.getAttribute?.(key)})).concat(['aria-label','title'].map(key=>({key,value:e.getAttribute?.(key)}))).filter(item=>item.value);return values.find(item=>expiryPattern.test(clean(item.value))||expiryAttributes.includes(item.key)&&/^\d{10}(?:\d{3})?$/.test(clean(item.value)))?.value||'';}).find(Boolean)||'';
 const officialCandidates=texts.filter(t=>/(?:完全リセット|full reset)/i.test(t)&&expiryPattern.test(t)).sort((a,b)=>a.length-b.length),bodyOfficial=(scopeText+' '+body).match(/(?:完全リセット|full reset)[^。\n]{0,100}?(?:有効期限|expires?|valid\s+(?:until|through))\s*[:：]?\s*(?:(?:20\d\d年)?\s*\d{1,2}月\d{1,2}日|20\d\d[-/]\d{1,2}[-/]\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2})/i)?.[0]||'',officialText=clean(officialCandidates[0]||bodyOfficial).slice(0,160),expiryText=officialText||visibleExpiry||attributeExpiry||scopeExpiry||bodyExpiry,expiresAt=expiryTime(expiryText);
 const kind=texts.find(t=>/(?:完全リセット|週間.*5\s*時間|full reset|weekly.*5.hour)/i.test(t))||'';
 return {label:'利用上限のリセット',value:count!=null?`利用可能 ${count}`:'有無を取得できません',detail:[kind,expiresAt?expiryDetail(expiresAt):Number(count)>0?'期限未取得':''].filter(Boolean).join(' · '),officialText,expiresAt,observedAt:Date.now()};
}
function parseExtras(doc,service){
 if(service!=='claude'&&service!=='chatgpt')return [];
 const targets=service==='claude'?[
  [/^(クラウドセッションクレジット|Cloud session credits)$/i,'クラウドセッションクレジット'],
  [/^(プロジェクトセットアップクレジット|Project setup credits)$/i,'プロジェクトセットアップクレジット'],
  [/^(使用クレジット|Usage credits|Extra usage)$/i,'使用クレジット']
 ]:[[/^(クレジット|Credits)$/i,'クレジット']];
 const headings=Array.from(doc.querySelectorAll('h1,h2,h3,h4,[role="heading"]'));
 const entries=targets.map(([pattern,name])=>{const index=headings.findIndex(h=>pattern.test(clean(h.textContent)));if(index<0)return {label:name,value:'未取得',detail:''};
  const h=headings[index],range=doc.createRange();range.setStartAfter(h);if(headings[index+1])range.setEndBefore(headings[index+1]);else range.setEndAfter(h.parentElement);
  const content=range.cloneContents(),text=clean(content.textContent),value=creditValue(text);
  const expiry=text.match(/(?:\d{1,4}年)?\s*\d{1,2}月\d{1,2}日[^。]{0,45}?(?:期限切れ|失効|期限)|本日[^。]{0,35}?(?:失効|期限切れ)|(?:expires?|expires? on)[^。]{0,60}/i)?.[0]||'',meter=content.querySelector('[role="meter"],[role="progressbar"]'),usedPercent=Number(meter?.getAttribute('aria-valuenow')),barPercent=Number.isFinite(usedPercent)?Math.max(0,Math.min(100,100-usedPercent)):null;
  const toggle=content.querySelector('[role="switch"]'),disabled=toggle?.getAttribute('aria-checked')==='false';
  return {label:name,value,detail:[disabled?'無効':null,expiry].filter(Boolean).join(' · '),expiresAt:expiryTime(expiry),barPercent};
 }).filter(e=>e.value!=='未取得'||service==='claude');
 if(service==='chatgpt'){const reset=chatGPTReset(doc);if(reset)entries.push(reset);}
 return entries;
}
function normalizePlan(value,service){
 const text=clean(value).replace(/[_-]+/g,' '),allowed={chatgpt:['Free','Go','Plus','Pro','Business','Enterprise','Edu','Team'],claude:['Free','Pro','Max 5x','Max 20x','Max','Team','Enterprise'],gemini:['Free','Google AI Plus','Google AI Pro','Google AI Ultra','AI Plus','AI Pro','AI Ultra','Pro','Ultra']}[service]||[];
 if(service==='gemini'){if(/Google One AI Premium|Gemini Advanced/i.test(text))return 'Google AI Pro';if(/^Google AI Ultra$/i.test(text))return 'Google AI Ultra';if(/^Google AI Plus$/i.test(text))return 'Google AI Plus';}
 for(const item of allowed)if(text.toLowerCase()===item.toLowerCase()||text.toLowerCase()===`chatgpt ${item}`.toLowerCase()||text.toLowerCase()===`claude ${item}`.toLowerCase())return service==='gemini'&&/^(?:pro|ai pro)$/i.test(item)?'Google AI Pro':service==='gemini'&&/^(?:ultra|ai ultra)$/i.test(item)?'Google AI Ultra':item;
 const keyed=text.match(/(?:current|your|subscription|account|契約|現在の)\s*(?:plan|プラン)?\s*[:：]?\s*(?:ChatGPT\s*)?(Free|Go|Plus|Pro|Business|Enterprise|Edu|Team|Max\s*(?:5x|20x)|Google AI (?:Plus|Pro|Ultra))/i);
 return keyed?normalizePlan(keyed[1],service):'未取得';
}
function planFromObject(value,service,depth=0){
 if(depth>7||value==null)return '未取得';
 if(typeof value==='string')return normalizePlan(value,service);
 if(Array.isArray(value)){for(const item of value){const found=planFromObject(item,service,depth+1);if(found!=='未取得')return found;}return '未取得';}
 if(typeof value!=='object')return '未取得';
 const preferred=/^(plan(?:_?type|Name)?|current_?plan|paid_?tier|membership_?tier|product_?name|subscription(?:_?plan|_?type)?|account(?:_?plan|_?type)?|tier)$/i;
 for(const [key,item]of Object.entries(value))if(preferred.test(key)){const found=planFromObject(item,service,depth+1);if(found!=='未取得')return found;}
 for(const item of Object.values(value))if(item&&typeof item==='object'){const found=planFromObject(item,service,depth+1);if(found!=='未取得')return found;}
 return '未取得';
}
function parsePlan(doc,service){
 if(service==='chatgpt'){const bootstrap=doc.querySelector?.('script#client-bootstrap');if(bootstrap)try{const payload=JSON.parse(bootstrap.textContent||''),value=payload?.session?.account?.planType||payload?.statsigPayload?.user?.custom?.plan_type,found=normalizePlan(value,service);if(found!=='未取得')return found;}catch{}}
 const selectors='[data-testid*="plan" i],[data-testid*="subscription" i],[aria-label*="plan" i],[aria-label*="プラン"],[class*="plan" i],.tier-pill,[class*="tier-pill"]';
 for(const el of doc.querySelectorAll(selectors)){for(const value of [el.textContent,el.getAttribute?.('aria-label')]){const found=normalizePlan(value,service);if(found!=='未取得')return found;}}
 for(const script of doc.querySelectorAll('script#__NEXT_DATA__,script[type="application/json"]')){const text=script.textContent||'';if(!text||text.length>1500000)continue;try{const found=planFromObject(JSON.parse(text),service);if(found!=='未取得')return found;}catch{}}
 const body=clean(doc.body?.innerText||''),contextual=body.match(/(?:current plan|your plan|subscription plan|account plan|現在のプラン|契約プラン|ご利用中のプラン|現在利用中)\s*[:：]?\s*(?:ChatGPT\s*)?(Free|Go|Plus|Pro|Business|Enterprise|Edu|Team|Max\s*(?:5x|20x)|Google AI (?:Plus|Pro|Ultra)|Google One AI Premium|Gemini Advanced)/i);
 if(contextual)return normalizePlan(contextual[1],service);
 if(service==='gemini'){
  const candidates=Array.from(doc.querySelectorAll('a,button,[role="button"],[role="link"],span,div')).filter(el=>el.getClientRects?.().length).map(el=>clean(el.textContent)).filter(text=>text.length>0&&text.length<100&&!/(?:アップグレード|upgrade|試す|try|購入|buy)/i.test(text));
  for(const text of candidates){const exact=text.match(/(?:^|[·:：｜|\s])(Google AI (?:Ultra|Pro|Plus)|Google One AI Premium|Gemini Advanced)(?=$|[·｜|\s])/i);if(exact)return normalizePlan(exact[1],service);}
 }
 return '未取得';
}
root.GlanceParser={parse,used,remaining,reset,resetTime,parseExtras,creditValue,expiryTime,chatGPTReset,parsePlan,normalizePlan,planFromObject};
if(typeof module!=='undefined')module.exports=root.GlanceParser;
})(globalThis);
