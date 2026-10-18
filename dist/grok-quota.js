/* Only explicit usage-card metadata on account routes; never chat text or fixed plan allowances. */
(function(root){
 const LABEL=/^(?:(?:your |included )?weekly (?:Grok |SuperGrok )?(?:usage(?: limit)?|limit)|included weekly usage|weekly included usage|週間(?:の)?(?:使用量|利用量|使用率|利用率|上限|利用上限)|今週の使用量)$/i;
 const iso=v=>{if(typeof v!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)$/.test(v))return null;const n=Date.parse(v);return Number.isFinite(n)?n:null};
 function extract(cards=[],plan='',now=Date.now()){
  const candidates=[];
  for(const card of cards.slice(0,8)){
   if(!LABEL.test(String(card.label||'')))continue;const text=String(card.text||'').slice(0,1800);
   const values=[...text.matchAll(/(?:^|[^\d.-])(\d{1,3}(?:\.\d+)?)\s*%\s*(?:of (?:your )?weekly (?:usage|limit)\s*)?(used|remaining|使用済み|使用|残り)/gi)].map(m=>({n:Number(m[1]),remaining:/remaining|残り/i.test(m[2])}));
   if(!values.length){const m=text.match(/(?:Used|使用済み|使用量|Remaining|残り)\s*:?\s*(\d{1,3}(?:\.\d+)?)\s*%/i);if(m)values.push({n:Number(m[1]),remaining:/remaining|残り/i.test(m[0])})}
   if(!values.length&&/usage|使用量|利用量|使用率|利用率/i.test(card.label)){const matches=[...text.matchAll(/(?:^|[^\d.-])(\d{1,3}(?:\.\d+)?)\s*%/g)];if(matches.length===1)values.push({n:Number(matches[0][1]),remaining:false})}
   if(values.length!==1||values[0].n>100)continue;
   const at=iso(card.resetISO);if(at&&at<=now)continue;const remaining=values[0].remaining?values[0].n:100-values[0].n;
   const reset=(text.match(/(?:Resets?\s+[^\n·•]{1,80}|Next reset[^\n·•]{1,80}|次回リセット[^\n·•]{0,80}|リセット[^\n·•]{0,80})/i)?.[0]||'').trim().slice(0,100);
   candidates.push({label:'週間',remaining,resetAt:at&&at>now&&at-now<=8*86400000?at:null,reset:reset||'リセット時刻未取得'});
  }
  const windows=candidates.length===1?candidates:[],safePlan=/^(?:Free|Plus|Pro|Max|SuperGrok(?: Heavy| Lite| Plus)?|X (?:Plus|Pro|Max)|Premium\+?)$/i.test(plan)?plan:'未取得';
  return {status:windows.length?'ready':'unavailable',windows,plan:safePlan,source:'grok-official-usage',note:'Grok公式の利用状況画面から取得。'};
 }
 function sanitize(q,now=Date.now()){
  const w=q?.windows?.length===1?q.windows[0]:null;if(!w||w.label!=='週間'||typeof w.remaining!=='number'||!Number.isFinite(w.remaining)||w.remaining<0||w.remaining>100)return extract([],q?.plan,now);
  if(typeof w.resetAt==='number'&&w.resetAt<=now)return extract([],q?.plan,now);
  const at=typeof w.resetAt==='number'&&Number.isFinite(w.resetAt)&&w.resetAt>now&&w.resetAt-now<=8*86400000?w.resetAt:null;
  return {status:'ready',windows:[{label:'週間',remaining:w.remaining,resetAt:at,reset:String(w.reset||'').slice(0,100)}],plan:extract([],q.plan,now).plan,source:'grok-official-usage',note:'Grok公式の利用状況画面から取得。'};
 }
 function collect(doc){
  // Read the smallest visible card with an explicit weekly label. Dashboard labels may be spans.
  const nodes=[...doc.querySelectorAll('h1,h2,h3,h4,p,span,div,[role="heading"],[data-slot="card-title"]')].filter(n=>n.getClientRects().length),cards=[],panels=new Set();let plan='';
  for(const h of nodes){const label=h.textContent.trim();if(/^(?:Current plan|現在のプラン)$/i.test(label)){let parent=h.parentElement;for(let i=0;parent&&i<4;i++,parent=parent.parentElement){if(parent===doc.body||(parent.innerText||'').length>1800)break;const headings=[...parent.querySelectorAll('h2,h3')];if(headings.length===1){plan=headings[0].textContent.trim();break;}}}if(!LABEL.test(label)&&!/^Weekly included usage(?:\s*[·•].*)?$/i.test(label))continue;
   if([...h.children].some(n=>LABEL.test(n.textContent.trim())||/^Weekly included usage(?:\s*[·•].*)?$/i.test(n.textContent.trim())))continue;
   let panel=h;for(let depth=0;panel&&depth<6;depth++,panel=panel.parentElement){
    if(panel===doc.body||panel.querySelector('input,textarea,[contenteditable="true"]'))break;
    const text=panel.innerText||'';if(text.length>1800)break;
    if(!/(?:\d+(?:\.\d+)?)\s*%\s*(?:used|remaining)/i.test(text))continue;if(/Account balance|Monthly additional usage|Credits available/i.test(text))break;if(/^Weekly included usage/i.test(label)&&!/(?:Current plan|現在のプラン)/i.test(text))continue;
    if(panels.has(panel))break;panels.add(panel);
    const times=[...panel.querySelectorAll('time[datetime]')].filter(n=>iso(n.getAttribute('datetime'))&&/reset|リセット/i.test(n.parentElement?.textContent||''));
    const meters=[...panel.querySelectorAll('[role="progressbar"][aria-valuenow]')].filter(n=>/weekly included usage/i.test(n.getAttribute('aria-label')||''));if(meters.length===1){const observed=extract([{label:'Weekly included usage',text}]).windows[0],used=Number(meters[0].getAttribute('aria-valuenow'));if(!observed||!Number.isFinite(used)||used<0||used>100||Math.abs(100-observed.remaining-used)>1)break;}cards.push({label:'Weekly included usage',text,resetISO:times.length===1?times[0].getAttribute('datetime'):null});
    if(/Current plan|現在のプラン/i.test(text)){const values=[...panel.querySelectorAll('h2,h3')].map(n=>n.textContent.trim());if(values.length===1)plan=values[0];}
    break;
   }
  }return extract(cards,plan);
 }
 // Display-only estimate requested by the user. Never store it as an official reset or expire quota from it.
 function assumedWindow(w,anchor=Date.now()){
  if(!w||w.resetAt)return w;const m=String(w.reset||'').match(/Resets?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})\b/i);if(!m)return w;
  const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[1].toLowerCase()),day=Number(m[2]),base=new Date(anchor||Date.now());let year=base.getFullYear();if(base.getMonth()===11&&month===0)year++;
  const date=new Date(year,month,day,0,0,0,0);if(date.getMonth()!==month||date.getDate()!==day)return w;
  return {...w,resetAt:date.getTime(),resetIsEstimate:true};
 }
 function view(p,s={},compact=false,settings={}){const G=root.Glance,L=root.GlanceLocale,ja=L.language()==='ja',q=s.enabled?s.quota:null,raw=G.viewData({grok:q||{}}).grok,w=assumedWindow(raw?.windows?.[0],raw?.capturedAt),value=G.percent(w?.remaining),shown=value===null?null:settings.usageDisplay==='used'?100-value:value,esc=G.escape,attention=G.quotaAttention(raw,raw?.windows?.[0]),fresh=s.enabled&&raw?.status==='ready'&&G.fresh(raw),number=shown===null?'—':G.value(shown),caption=G.quotaCaption(settings);
  if(compact)return `<section class="widget-row" style="--color:${p.color}"><div class="widget-service"><span class="widget-mark">𝕏</span><span><a href="${p.home}" target="_blank" rel="noopener noreferrer">Grok</a><small>${esc(G.shownPlan(raw?.plan))}</small></span><em>${esc(s.enabled?G.status(raw):ja?'未接続':'Not connected')}</em></div><div class="widget-primary"><b class="${attention?'quota-attention':''}">${G.numeric('grok','window:週間',number)}</b><span>${ja?'週間':'Weekly'}</span></div><div class="track"><i style="width:${shown??0}%"></i></div><div class="widget-reset">${esc(G.resetTimestamp(w)+G.quotaCountdown(w))}</div>${root.GlanceApiCredits?.view('grok')||''}${G.historyBox(G.displayData({grok:raw},settings).grok,true,'grok')}<div class="widget-age" data-quota-age="grok">${esc(G.age(raw))}</div><a href="${p.url}" target="_blank" rel="noopener noreferrer">${ja?'公式Usage ↗':'Official Usage ↗'}</a></section>`;
  return `<${compact?'section':'article'} class="${compact?'widget-row':'card'} grok-quota-card" style="--color:${p.color}"><div class="card-head"><span class="service-mark">𝕏</span><div class="service-title"><h2><a href="${p.home}" target="_blank" rel="noopener noreferrer">Grok</a></h2><span class="plan">${esc(G.shownPlan(raw?.plan))}</span></div><span class="badge">${esc(s.enabled?G.status(raw):ja?'未接続':'Not connected')}</span><button type="button" class="card-task-button" disabled title="${ja?'Grokのタスク取得は未対応です':'Grok task collection is not supported'}">${ja?'タスク未対応':'Tasks unavailable'}</button></div><div class="gauge quota-overview grok-overview" style="--session-color:${p.color}" role="img" aria-label="Grok ${esc(caption)} ${esc(number)}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="weekly-ring-track" cx="60" cy="60" r="51"/><circle class="weekly-ring-fill" cx="60" cy="60" r="51" stroke-dasharray="${(shown??0)*3.2044} 320.44"/></svg><div class="quota-center"><div class="quota-caption">${esc(caption)}</div><div class="quota-session-label">${ja?'週間':'Weekly'}</div><div class="quota-current-number"><span class="quota-percent${attention?' quota-attention':''}">${G.numeric('grok','window:週間',number)}</span></div><div class="quota-countdown">${esc(G.quotaCountdown(w))}</div></div></div><div class="quota-bar-block"><div class="metric-row"><span>${ja?'週間':'Weekly'}</span><span class="quota-percent${attention?' quota-attention':''}">${esc(number)}</span></div><div class="track weekly-quota-track"><i style="width:${shown??0}%"></i></div><p class="quota-reset-line">${esc(G.resetTimestamp(w)+G.quotaCountdown(w))}</p></div><div class="grok-session-absent" aria-hidden="true"></div><p class="card-note">${esc(!s.enabled?(ja?'セットアップでGrokを有効にしてください。':'Enable Grok in Setup.'):fresh?(ja?'週間利用枠を約60秒ごとに更新。API残高とは別です。':'Official weekly pool; separate from API balance.'):(ja?'自動取得待ち。ログイン・画面確認が必要な場合は公式Usageを開き、確認後に今すぐ更新を押してください。':'Open official Usage. Unavailable limits are not estimated.'))}</p><div class="extras">${root.GlanceApiCredits?.view('grok',true)||''}<a href="${p.url}" target="_blank" rel="noopener noreferrer">${ja?'Grok公式の利用状況 ↗':'Grok official usage ↗'}</a></div>${G.historyBox(G.displayData({grok:raw},settings).grok)}<div class="card-bottom"><span data-quota-age="grok">${esc(G.age(raw))}</span><a href="${p.url}" target="_blank" rel="noopener noreferrer">${ja?'利用状況を開く':'Open usage'}</a></div></${compact?'section':'article'}>`;
 }
 root.GlanceGrokQuota={extract,sanitize,collect,view,assumedWindow};if(typeof module!=='undefined')module.exports=root.GlanceGrokQuota;
})(globalThis);
