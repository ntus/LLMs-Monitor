/* Optional Muse settings adapter. Only the bounded General / Usage section; no chat or wallet reads. */
(function(root){
 'use strict';
 const officialReset=value=>{if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)$/.test(value))return null;const y=Number(value.slice(0,4)),m=Number(value.slice(5,7)),d=Number(value.slice(8,10)),h=Number(value.slice(11,13)),min=Number(value.slice(14,16)),day=new Date(Date.UTC(y,m-1,d));if(day.getUTCFullYear()!==y||day.getUTCMonth()!==m-1||day.getUTCDate()!==d||h>23||min>59)return null;const n=Date.parse(value);return Number.isFinite(n)?n:null};
 const planName=value=>{if(typeof value!=='string')return '';const text=value.trim();if(/^(?:無料(?:プラン)?|Free(?: plan)?)$/i.test(text))return 'Free Plan';if(/^(?:パワー(?:プラン)?|Power(?: plan)?)$/i.test(text))return 'Power';if(/^(?:マキシマム(?:プラン)?|Maximum(?: plan)?)$/i.test(text))return 'Maximum';const m=text.match(/^(?:Muse )?(Pro|Plus|Premium|Max|Ultra|Business|Enterprise)(?: plan|プラン)?$/i);return m?m[1][0].toUpperCase()+m[1].slice(1).toLowerCase():''};
 const headings='h1,h2,h3,h4,[role="heading"]',usage=/^(?:利用状況|Usage)$/i,settings=/^(?:設定|Settings)$/i;
 const visible=n=>n&&n.getClientRects().length&&!n.closest?.('[hidden],[aria-hidden="true"]');
 function activate(node){
  // The observed Radix menu trigger opens on pointerdown, not HTMLElement.click().
  if(node.getAttribute?.('aria-haspopup')==='menu'&&typeof root.PointerEvent==='function'){
   for(const type of ['pointerdown','pointerup'])node.dispatchEvent(new root.PointerEvent(type,{bubbles:true,button:0,pointerType:'mouse',isPrimary:true}));
  }else node.click();
 }
 function prepare(doc){
  // Caller must first prove an inactive owned acquisition tab. Only observed read-only settings actions.
  const panels=settingsPanels(doc);if(panels.length===1){const panel=panels[0],general=[...panel.querySelectorAll(headings)].filter(n=>visible(n)&&/^(?:一般|General)$/i.test(n.textContent.trim()));if(general.length)return false;const buttons=[...panel.querySelectorAll('button,[role="button"]')].filter(n=>visible(n)&&/^(?:一般|General)$/i.test(n.textContent.trim()));if(buttons.length===1){activate(buttons[0]);return true}return false}
  // Current Muse dock opens a dialog-shaped navigation menu, not role=menu.
  for(const menu of [...doc.querySelectorAll('[role="dialog"]')]){
   if(menu.querySelector?.('input,textarea,[contenteditable="true"]'))continue;
   const buttons=[...menu.querySelectorAll('button,[role="button"]')].filter(n=>!n.disabled&&!n.closest?.('[hidden],[aria-hidden="true"]'));
   const labels=buttons.map(n=>n.textContent.trim()),targets=buttons.filter(n=>/^(?:設定|Settings)$/i.test(n.textContent.trim()));
   if(targets.length===1&&labels.some(v=>/^(?:キーボードショートカット|Keyboard shortcuts)$/i.test(v))&&labels.some(v=>/^(?:問題を報告|Report (?:a )?(?:problem|issue)|アプリをダウンロード|Download (?:the )?app)$/i.test(v))){activate(targets[0]);return true;}
  }
  const choices=[['[role="menu"] [role="menuitem"], [role="menu"] button',/^(?:設定|Settings)(?:\s*⌘\s*,)?$/i],['button[aria-label="設定"],button[aria-label="Settings"],[role="button"][aria-label="設定"],[role="button"][aria-label="Settings"]',null]];
  for(const [selector,pattern] of choices){const nodes=[...doc.querySelectorAll(selector)].filter(n=>visible(n)&&(!pattern||pattern.test(n.textContent.trim())));if(nodes.length===1&&typeof nodes[0].click==='function'){activate(nodes[0]);return true}}
  // The observed dock control can have no layout box while its background page
  // is render-skipped. Permit only this exact read-only Settings dialog trigger,
  // never an arbitrary hidden button or a chat/menu item.
  const dock=[...doc.querySelectorAll('button[data-testid="hatch-dock-more"][aria-haspopup="dialog"]')].filter(n=>/^(?:設定|Settings)$/i.test(n.getAttribute?.('aria-label')||'')&&!n.disabled&&!n.closest?.('[hidden],[aria-hidden="true"]'));
  if(dock.length===1&&typeof dock[0].click==='function'){activate(dock[0]);return true;}
  return false;
 }
 function settingsPanels(doc){
  // Identify the actual settings navigation without reading its container or the conversation text.
  const starts=[...doc.querySelectorAll(headings)].filter(n=>visible(n)&&settings.test(n.textContent.trim()));
  const roots=new Set();for(const start of starts){let node=start.parentElement;for(let depth=0;node&&node!==doc.body&&depth<5;depth++,node=node.parentElement){
   if(node.querySelector('textarea,[contenteditable="true"],input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]):not([type="range"])'))break;
   const labels=[...node.querySelectorAll('button,[role="button"]')].filter(visible).map(n=>n.textContent.trim());
   if(!labels.some(v=>/^(?:一般|General)$/i.test(v))||!labels.some(v=>/^(?:コネクター|Connectors)$/i.test(v))||!labels.some(v=>/^(?:ログアウト|Log out|Sign out)$/i.test(v)))continue;
   roots.add(node);break;
  }}
  // Mobile/narrow settings replace the navigation with a General dialog and Back button.
  for(const dialog of [...doc.querySelectorAll('[role="dialog"]')]){
   if(!visible(dialog)||dialog.querySelector('textarea,[contenteditable="true"],input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]):not([type="range"])'))continue;
   const hs=[...dialog.querySelectorAll(headings)].filter(visible).map(n=>n.textContent.trim()),buttons=[...dialog.querySelectorAll('button,[role="button"]')].filter(visible).map(n=>n.getAttribute?.('aria-label')||n.textContent.trim());
   if(hs.some(v=>settings.test(v))&&buttons.some(v=>/^(?:一般|General)$/i.test(v))&&buttons.some(v=>/^(?:コネクター|Connectors)$/i.test(v))&&buttons.some(v=>/^(?:ログアウト|Log out|Sign out)$/i.test(v)))roots.add(dialog);
   if(hs.some(v=>/^(?:一般|General)$/i.test(v))&&hs.some(v=>usage.test(v))&&buttons.some(v=>/^(?:戻る|Back)$/i.test(v))&&buttons.some(v=>/^(?:アカウントセンター|Accounts? Cent(?:er|re))/.test(v)))roots.add(dialog);
  }
  return [...roots].filter(n=>![...roots].some(other=>other!==n&&other.contains?.(n)));
 }
 function refreshGeneral(doc){
  // Re-open only the read-only settings dialog in a freshly authorized hidden source.
  if(doc.hidden!==true)return false;
  const panels=settingsPanels(doc);if(panels.length!==1)return false;
  const panel=panels[0],dialog=panel.matches?.('[role="dialog"]')?panel:panel.closest?.('[role="dialog"]');
  if(!dialog||dialog.querySelector('textarea,[contenteditable="true"],input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]):not([type="range"])'))return false;
  const general=[...panel.querySelectorAll(headings)].filter(n=>visible(n)&&/^(?:一般|General)$/i.test(n.textContent.trim()));
  const closes=[...dialog.querySelectorAll('button[aria-label="閉じる"],button[aria-label="Close"]')].filter(n=>visible(n)&&!n.disabled);
  if(general.length!==1||closes.length!==1)return false;
  activate(closes[0]);return true;
 }
 function collect(doc){
  const roots=settingsPanels(doc);if(roots.length!==1)return [];
  const panel=roots[0],heads=[...panel.querySelectorAll(headings)].filter(n=>visible(n)&&usage.test(n.textContent.trim()));if(heads.length!==1)return [];const h=heads[0];
  const section=h.nextElementSibling;
  if(section&&visible(section)&&!section.querySelector('input,textarea,[contenteditable="true"],h1,h2,h3,h4,[role="heading"]')){
   const bars=[...section.querySelectorAll?.('[role="progressbar"]')||[]].filter(visible);
   if(bars.length){
    const cards=[];for(const bar of bars){const row=bar.parentElement;if(!row||row.querySelectorAll('[role="progressbar"]').length!==1)return [];const text=row.innerText;if(typeof text!=='string'||text.length>1600)return [];
     const extra=/^(?:追加のトークン|Additional tokens|Extra tokens)$/i.test(bar.getAttribute('aria-label')||'');const times=[...row.querySelectorAll('time[datetime]')].filter(n=>n.tagName==='TIME'&&visible(n)&&/reset|リセット/i.test(n.parentElement?.textContent||'')&&officialReset(n.getAttribute('datetime')));cards.push({id:extra?'extra-tokens':'usage',kind:'quota',label:extra?'Additional tokens':h.textContent.trim(),text,...(!extra&&planName(bar.getAttribute('aria-label'))?{plan:planName(bar.getAttribute('aria-label'))}:{}),...(!extra&&times.length===1?{resetISO:times[0].getAttribute('datetime')}:{})});
    }return cards.length<=2&&new Set(cards.map(c=>c.id)).size===cards.length?cards:[];
   }
  }
  return root.GlanceUsageEvidence.section(panel,h.textContent.trim());
 }
 function extract(cards){
  // Only quota observations from this known section. A wallet balance is not a usage allowance.
  if(!Array.isArray(cards)||cards.length<1||cards.length>2||cards.filter(c=>c?.id==='usage'&&c.kind==='quota'&&usage.test(c.label||'')).length!==1||cards.some(c=>c?.id!=='usage'&&(c?.id!=='extra-tokens'||c.kind!=='quota'||c.label!=='Additional tokens')))return {schemaVersion:1,status:'unavailable',metrics:[]};
  const result=root.GlanceUsageEvidence.analyze(cards.filter(c=>c.id==='usage')),out={schemaVersion:1,status:result.status,metrics:result.metrics};
  const quota=cards.find(c=>c.id==='usage'),plan=planName(quota?.plan)||planName(quota?.text?.split('\n')[0]);if(plan&&out.status==='ready')out.plan=plan;
  const resetAt=officialReset(quota?.resetISO);if(out.status==='ready'&&resetAt&&resetAt>Date.now()&&resetAt-Date.now()<370*86400000)out.metrics=out.metrics.map(m=>({...m,officialResetAt:resetAt}));
  const extra=cards.find(c=>c.id==='extra-tokens');if(extra&&typeof extra.text==='string'&&extra.text.length<=1600){const match=extra.text.normalize('NFKC').match(/残り[0-9][0-9,.]*(?:兆|億|万)?トークン|[0-9][0-9,.]*(?: billion| million)? tokens? remaining/i);if(match)out.extraTokensText=match[0]}
  return out;
 }
 function sanitize(value){
  if(value?.schemaVersion!==1||value.status!=='ready'||!Array.isArray(value.metrics)||value.metrics.length!==1)return {schemaVersion:1,status:'unavailable',metrics:[]};
  const m=value.metrics[0];if(!m||m.evidenceId!=='usage'||m.kind!=='quota'||!usage.test(m.label||'')||!['percent','count','credits','tokens'].includes(m.unit)||!['used','remaining'].includes(m.direction)||!['unknown','week','month','day','session'].includes(m.period)||![m.value,m.total,m.remaining].every(n=>typeof n==='number'&&Number.isFinite(n))||m.total<=0||m.total>1e9||m.value<0||m.value>m.total||m.remaining!==(m.direction==='remaining'?m.value:m.total-m.value)||m.unit==='percent'&&m.total!==100||typeof m.resetText!=='string'||m.resetText.length>120)return {schemaVersion:1,status:'unavailable',metrics:[]};
  const extra=typeof value.extraTokensText==='string'&&/^(?:残り[0-9][0-9,.]*(?:兆|億|万)?トークン|[0-9][0-9,.]*(?: billion| million)? tokens? remaining)$/i.test(value.extraTokensText)&&value.extraTokensText.length<=80?{extraTokensText:value.extraTokensText}:{};
  return {schemaVersion:1,status:'ready',...extra,...(planName(value.plan)?{plan:planName(value.plan)}:{}),metrics:[{evidenceId:'usage',kind:'quota',label:m.label,unit:m.unit,value:m.value,total:m.total,remaining:m.remaining,direction:m.direction,period:m.period,resetText:m.resetText,...(typeof m.officialResetAt==='number'&&Number.isFinite(m.officialResetAt)&&m.officialResetAt>0?{officialResetAt:m.officialResetAt}:{})}]};
 }
 const HISTORY_LIMIT=10000;
 function normalizeHistory(saved,now=Date.now()){
  if(!Array.isArray(saved))return [];
  return saved.slice(-HISTORY_LIMIT).filter(r=>r&&Number.isFinite(r.capturedAt)&&r.capturedAt>0&&r.capturedAt<=now+5000&&['percent','count','credits','tokens'].includes(r.unit)&&['unknown','week','month','day','session'].includes(r.period)&&[r.remaining,r.total].every(Number.isFinite)&&r.total>0&&r.total<=1e9&&r.remaining>=0&&r.remaining<=r.total&&(r.unit!=='percent'||r.total===100)).map(r=>({capturedAt:r.capturedAt,remaining:r.remaining,total:r.total,unit:r.unit,period:r.period})).sort((a,b)=>a.capturedAt-b.capturedAt);
 }
 function recordHistory(saved,usage,at=Date.now()){
  const rows=normalizeHistory(saved,at),metric=sanitize(usage).metrics[0],last=rows[rows.length-1];if(!metric||!Number.isFinite(at)||at<=0||last&&at<=last.capturedAt)return rows;
  if(last&&['remaining','total','unit','period'].every(key=>last[key]===metric[key]))return rows;
  rows.push({capturedAt:at,remaining:metric.remaining,total:metric.total,unit:metric.unit,period:metric.period});return rows.slice(-HISTORY_LIMIT);
 }
 function historyView(saved,compact=false,options={}){
  const ja=root.GlanceLocale?.language?.()!=='en',rows=normalizeHistory(saved),esc=root.Glance?.escape||(v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))),used=options.usageDisplay!=='remaining',title=ja?'変化履歴（このブラウザー）':'History (this browser)';
  const groups=[...new Set(rows.map(r=>r.period))].sort((a,b)=>Number(b==='week')-Number(a==='week')).map(period=>{const records=rows.filter(r=>r.period===period),label=(ja?{week:'週間',month:'月間',day:'日間',session:'セッション',unknown:'利用枠'}:{week:'Weekly',month:'Monthly',day:'Daily',session:'Session',unknown:'Usage'})[period],text=records.slice().reverse().map(r=>{const unit=r.unit==='percent'?'%':r.unit==='tokens'?(ja?'トークン':' tokens'):r.unit==='credits'?(ja?'クレジット':' credits'):(ja?'回':' count'),amount=used?r.total-r.remaining:r.remaining,value=Number(amount.toFixed(3)).toLocaleString(ja?'ja-JP':'en-US')+unit,date=root.Glance?.historyDate?.(r.capturedAt)||new Date(r.capturedAt).toLocaleString(ja?'ja-JP':'en-US',{hour12:false});return date+'  '+(ja?(used?'使用量 ':'残り使用量 '):(used?'Used ':'Remaining '))+value}).join('\n');return `<section class="history-group"><div class="history-label">${label}<span>${records.length}${ja?'件':' entries'}</span></div><textarea class="history-log" readonly wrap="off" aria-label="Muse ${label} ${ja?'変化履歴':'history'}">${esc(text)}</textarea></section>`}).join('')||`<div class="history-empty">${ja?'取得後の残量変化を記録します':'Changes will be recorded after acquisition'}</div>`;
  return compact?`<details class="history widget-history" data-history-id="muse"><summary>${title}</summary>${groups}</details>`:`<div class="history"><div class="extras-title">${title}</div>${groups}</div>`;
 }
 function resetTiming(text,capturedAt,now=Date.now()){
  if(typeof text!=='string'||text.length>120||!Number.isFinite(capturedAt))return null;
  const normalized=text.normalize('NFKC'),matches=[...normalized.matchAll(/(?:(\d{4})[年/.-])?(\d{1,2})[月/.-](\d{1,2})(?:日)?/g)];
  let year,month,day;
  if(matches.length===1){year=Number(matches[0][1])||new Date(capturedAt).getFullYear();month=Number(matches[0][2]);day=Number(matches[0][3]);}
  else {const english=[...normalized.matchAll(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:,?\s+(\d{4}))?\b/gi)];if(matches.length||english.length!==1)return null;month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(english[0][1].slice(0,3).toLowerCase())+1;day=Number(english[0][2]);year=Number(english[0][3])||new Date(capturedAt).getFullYear();}
  const times=[...normalized.matchAll(/\b(\d{1,2}):(\d{2})\b/g)];if(times.length>1||/UTC|GMT|[+-]\d{2}:?\d{2}|午前|午後|\b[AP]M\b/i.test(normalized))return null;
  const hour=times.length?Number(times[0][1]):0,minute=times.length?Number(times[0][2]):0;if(month<1||month>12||day<1||hour>23||minute>59)return null;
  let date=new Date(year,month-1,day,hour,minute);if(date.getMonth()!==month-1||date.getDate()!==day)return null;
  if(date.getTime()<capturedAt-180*86400000&&!/\b\d{4}\b/.test(normalized))date=new Date(year+1,month-1,day,hour,minute);
  const resetAt=date.getTime();if(resetAt>capturedAt+370*86400000)return null;
  return {resetAt,estimated:times.length===0,remainingMinutes:Math.ceil((resetAt-now)/60000),month,day};
 }
 function resetRemaining(timing,ja=true){if(!timing)return '';if(timing.remainingMinutes<=0)return ja?'想定日時を経過・再取得待ち':'Reset passed · awaiting refresh';const n=timing.remainingMinutes,d=Math.floor(n/1440),h=Math.floor(n%1440/60),m=n%60;return ja?`あと${d?d+'日':''}${h?h+'時間':''}${m}分${timing.estimated?'・想定':''}`:`${d?d+'d ':''}${h?h+'h ':''}${m}m left${timing.estimated?' · estimated':''}`;}
 function localizedTokens(text,ja){
  if(ja)return text;const m=String(text).match(/^残り([0-9,.]+)(兆|億|万)?トークン$/);if(!m)return text;
  const n=Number(m[1].replaceAll(',',''))*({'兆':1e12,'億':1e8,'万':1e4}[m[2]]||1);return Number.isFinite(n)?n.toLocaleString('en-US')+' tokens remaining':'Token remainder unavailable';
 }
 function localizedReset(text,at,ja){if(ja||!/[\u3040-\u30ff\u3400-\u9fff]/.test(text||''))return text;const t=resetTiming(text,at);return t?'Weekly limit resets '+new Date(t.resetAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'Reset date unavailable';}
 function resetAnswer(text,now=Date.now()){
  if(typeof text!=='string'||text.length>500)return null;
  const clean=text.normalize('NFKC').replace(/\*\*/g,'').replace(/`/g,'');
  const matches=[...clean.matchAll(/(?:次回(?:の)?(?:週次)?リセット(?:日時|時刻)?|Next (?:weekly )?reset(?: time| date)?)(?:は|:|\s|\*|=)*\s*(\d{4})(?:年|[\/-])(\d{1,2})(?:月|[\/-])(\d{1,2})日?(?:\s*\([日月火水木金土](?:曜日)?\))?\s*(\d{1,2}):(\d{2})\s*JST/gi)];if(matches.length!==1)return null;
  const [,y,m,d,h,min]=matches[0],stamp=`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}T${h.padStart(2,'0')}:${min}:00+09:00`,at=officialReset(stamp);if(!at||at<=now||at>now+8*86400000)return null;
  return {resetAt:at,observedAt:now,source:'muse-answer'};
 }
 function validResetHint(hint,metric,now=Date.now()){
  if(hint?.source!=='muse-answer'||!Number.isSafeInteger(hint.observedAt)||hint.observedAt>now||now-hint.observedAt>7*86400000||!Number.isSafeInteger(hint.resetAt)||hint.resetAt<=now||hint.resetAt-hint.observedAt>8*86400000||!metric)return null;
  const dateOnly=resetTiming(metric.resetText,hint.observedAt,now),jst=new Date(hint.resetAt+9*3600000);if(!dateOnly||dateOnly.month!==jst.getUTCMonth()+1||dateOnly.day!==jst.getUTCDate())return null;return hint;
 }
 function view(p,s={},compact=false,options={}){
  const G=root.Glance,L=root.GlanceLocale,ja=L?.language?.()!=='en',esc=G?.escape||(v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  const login=s.acquisition?.reason==='login',valid=!login&&s.enabled&&Number.isFinite(s.capturedAt)&&s.capturedAt<=Date.now()+5000&&Date.now()-s.capturedAt<125000;
  const observed=s.enabled&&Number.isFinite(s.capturedAt)&&s.capturedAt>0&&s.capturedAt<=Date.now()+5000?sanitize(s.usage):null,clean=!login?observed:null,extra=clean?.extraTokensText?`<p class="muse-extra-tokens"><a data-muse-usage href="${p.home}" target="_blank" rel="noopener noreferrer">${esc((ja?'追加のトークン：':'Additional tokens: ')+localizedTokens(clean.extraTokensText,ja))}</a></p>`:'',m=clean?.metrics[0],used=options.usageDisplay!=='remaining',remaining=m?.unit==='percent'?Math.round(m.remaining):m?.remaining,amount=m?(used?m.total-remaining:remaining):null;
  const periods=ja?{week:'週間',month:'月間',day:'日間',session:'セッション',unknown:'利用枠'}:{week:'Weekly',month:'Monthly',day:'Daily',session:'Session',unknown:'Usage'};
  const label=periods[m?.period||'unknown'],caption=(m&&!valid?(ja?'前回取得値 · ':'Previous read · '):'')+(ja?(used?'使用量':'残り使用量'):(used?'Used':'Remaining'));
  const number=!m?'—':m.unit==='percent'?Math.round(amount)+'%':Number(amount.toFixed(3)).toLocaleString()+' / '+m.total.toLocaleString()+' '+({credits:ja?'クレジット':'credits',tokens:ja?'トークン':'tokens',count:ja?'回':'count'}[m.unit]);
  const answerHint=validResetHint(s.resetHint,m),exact=m?.officialResetAt||answerHint?.resetAt,timing=exact?{resetAt:exact,estimated:false,remainingMinutes:Math.ceil((exact-Date.now())/60000)}:m?resetTiming(m.resetText,s.capturedAt):null,remainingText=valid&&timing&&!timing.estimated?resetRemaining(timing,ja):'',reset=exact?(answerHint?(ja?'Muse回答・参考 ':'Muse answer · reference '):'')+new Date(exact).toLocaleString(ja?'ja-JP':'en-US',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})+(ja?'（':' (')+remainingText+(ja?'）':')'):timing?.estimated?`${timing.month}/${timing.day}`+(ja?'（時刻未確認）':' (time unavailable)'):(localizedReset(m?.resetText,s.capturedAt,ja)||(ja?'リセット日時未取得':'Reset unavailable'))+(timing?` · ${timing.estimated?(ja?'現地時間0:00想定':'assumed local 00:00'):''}（${remainingText}）`:''),officialNote=ja?'公式の利用状況から取得。日付だけの場合、リセット時刻は未確認です。':'Read from official Usage; date-only resets have no verified time.';
  const retryAt=s.acquisition?.reason==='retry-backoff'&&Number.isSafeInteger(s.acquisition.retryAt)&&s.acquisition.retryAt>0?s.acquisition.retryAt:0,retryMinutes=retryAt?Math.max(1,Math.ceil((retryAt-Date.now())/60000)):0,pausedReason=({ 'missing-tab':ja?'取得用タブが閉じられました。':'The acquisition tab was closed.',ownership:ja?'取得用タブが操作または移動されたため、操作を保護しています。':'The acquisition tab was used or moved and is protected.',timeout:ja?'読み込みが制限時間を超えました。':'Loading exceeded the time limit.'})[s.acquisition?.reason]||'';
  const acquisition=['inactive','paused','waiting','ready','unavailable'].includes(s.acquisition?.state)?s.acquisition.state:(m?'ready':'unavailable'),note=!s.enabled?(ja?'セットアップでMuseの読取りを有効にしてください。':'Enable Muse reading in Setup.'):({paused:login?(ja?'⚠︎ Museへのログインが必要です。公式画面でログイン後、［今すぐ更新］を押してください。':'⚠ Sign in to Muse on the official page, then choose Refresh now.'):ja?'自動取得は一時停止中です。'+pausedReason+(s.acquisition?.reason==='ownership'?'セットアップでMuseを再接続してください。':'［今すぐ更新］で再試行してください。'):'Automatic reading is paused. '+pausedReason+(s.acquisition?.reason==='ownership'?'Reconnect Muse in Setup.':'Choose Refresh now to retry.'),inactive:ja?'自動取得は開始されていません。［今すぐ更新］で再試行してください。':'Automatic reading has not started. Choose Refresh now to retry.',waiting:retryAt?(ja?'読み込みに時間がかかったため、約'+retryMinutes+'分後に同じ裏タブで自動再試行します。':'Loading took too long. Automatic retry in about '+retryMinutes+' minutes in the same background tab.'):(ja?'Museの利用状況の表示完了を待っています。':'Waiting for Muse Usage to finish rendering.'),ready:m?officialNote:(ja?'前回取得後の更新を待っています。':'Waiting for an update after the previous read.'),unavailable:ja?'自動取得の状態を確認できません。［今すぐ更新］で再試行してください。':'Automatic reading status is unavailable. Choose Refresh now to retry.'})[acquisition];
  const prior=!valid&&observed?.metrics[0],priorValue=prior?(used?prior.total-prior.remaining:prior.remaining):null,priorNumber=prior?(prior.unit==='percent'?Math.round(priorValue)+'%':Number(priorValue.toFixed(3)).toLocaleString()+' / '+prior.total.toLocaleString()+' '+({credits:ja?'クレジット':'credits',tokens:ja?'トークン':'tokens',count:ja?'回':'count'}[prior.unit])):'',priorAt=G?.historyDate?.(s.capturedAt)||new Date(s.capturedAt).toLocaleString(ja?'ja-JP':'en-US',{hour12:false}),previous=prior?`<p class="extra-detail muse-previous-usage">${esc((ja?'前回取得（':'Previous read (')+priorAt+') · '+caption+' '+priorNumber)}${prior.resetText?`<br>${esc((ja?'前回のリセット表示：':'Previous reset text: ')+localizedReset(prior.resetText,s.capturedAt,ja))}`:''}</p>`:'',badge=login?(ja?'⚠︎ ログインが必要':'⚠ Sign-in required'):!s.enabled?(ja?'未接続':'Not connected'):m&&valid?(ja?'取得済み':'Acquired'):acquisition==='paused'?(ja?'取得停止中':'Paused'):acquisition==='waiting'?(ja?'更新待ち':'Waiting'):observed?.metrics[0]?(ja?'前回取得':'Previous read'):(ja?'未取得':'Unavailable');
  const count=m?.unit==='percent'?amount:null,warning=valid&&m?.unit==='percent'&&m.remaining<=15,low=valid&&!!m&&m.remaining/m.total*100<=5,metric=`<span class="quota-percent muse-metric${warning?' quota-attention':''}${low?' quota-value-low':''}" style="--quota-value-base:var(--color)" data-muse-unit="${m?.unit||'unknown'}">${esc(number)}</span>`;
  const bar=count!==null?`<div class="track weekly-quota-track${low?' quota-bar-low':''}" style="--quota-bar-fill:var(--color)"><i style="width:${count}%"></i></div>`:'';
  const task=`<a class="card-task-button" href="https://llmsmonitor.ntus.org/tasks?service=muse" target="_blank" rel="noopener noreferrer">${ja?'作業メモ ↗':'Work notes ↗'}</a>`;
  const shownHistory=normalizeHistory(s.history).length?s.history:(valid?recordHistory([],s.usage,s.capturedAt):[]);
  const observedAge=G?.age?G.age(s):(ja?'取得 ':'Read ')+(s.capturedAt?new Date(s.capturedAt).toLocaleTimeString(ja?'ja-JP':'en-US',{hour12:false}):'—');
  const official=`<a class="muse-official-usage" data-muse-usage href="${p.home}" target="_blank" rel="noopener noreferrer" title="${ja?'設定 → 一般 → 利用状況':'Settings → General → Usage'}">${ja?'Muse公式の利用状況 ↗':'Muse official usage ↗'}</a>`;
  if(compact)return `<section class="widget-row" style="--color:${p.color}"><div class="widget-service"><span class="widget-mark">${p.mark}</span><a class="service-home" href="${p.home}" target="_blank" rel="noopener noreferrer">Muse</a></div><div class="widget-primary"><b>${metric}</b><span>${esc(label+' · '+caption)}</span></div>${bar}<div class="widget-reset">${esc(reset)}</div><p>${esc(note)}</p>${extra}${previous}${official}${historyView(shownHistory,true,options)}${task}</section>`;
  return `<article class="card muse-usage-card" style="--color:${p.color}"><div class="card-head"><span class="service-mark">${p.mark}</span><div class="service-title"><h2><a class="service-home" href="${p.home}" target="_blank" rel="noopener noreferrer">Muse</a></h2><span class="plan">${esc(clean?.plan?(clean.plan):(ja?'プラン未取得':'Plan unavailable'))}</span></div><span class="badge">${badge}</span>${task}</div><div class="gauge quota-overview" style="--session-color:${p.color}" role="${m?'img':'group'}" aria-label="${esc('Muse '+label+' '+caption+' '+number)}">${count===null?'':`<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="weekly-ring-track${low?' quota-ring-low':''}" cx="60" cy="60" r="51"/><circle class="weekly-ring-fill${low?' quota-ring-low':''}" cx="60" cy="60" r="51" stroke-dasharray="${count*3.2044} 320.44"/></svg>`}<div class="quota-center"><div class="quota-caption">${caption}</div><div class="quota-session-label">${esc(label)}</div><div class="quota-current-number">${metric}</div>${!m?`<button type="button" data-connect-service="muse">${ja?'接続・ログイン確認':'Connect / sign in'}</button>`:''}${remainingText?`<div class="quota-countdown${valid&&G?.resetSoon?.({resetAt:m?.officialResetAt})?' reset-soon':''}">（${esc(remainingText)}）</div>`:''}</div></div><div class="quota-bar-block"><div class="metric-row"><span>${esc(label)}</span><b>${metric}</b></div>${bar}<p class="quota-reset-line${valid&&G?.resetSoon?.({resetAt:m?.officialResetAt})?' reset-soon':''}">${esc(reset)}</p></div><div class="grok-session-absent" aria-hidden="true"></div><p class="card-note">${esc(note)}</p><div class="extras"><button type="button" data-bus-timing-open>${ja?'Bus参考日時':'Bus reference time'}</button><button type="button" data-muse-reset-answer>${ja?'Muse回答の日時を反映':'Use reset time from Muse answer'}</button>${extra}${previous}<small>${ja?'金額の残高とは別です。AIによる外部解析は無効です。':'Separate from monetary balances. External AI interpretation is disabled.'}</small>${official}</div>${historyView(shownHistory,false,options)}<div class="card-bottom"><span class="age" data-quota-age="muse" data-captured-at="${Number(s.capturedAt)||0}">${esc(observedAge)}</span><a data-muse-usage href="${p.home}" target="_blank" rel="noopener noreferrer">${ja?'利用状況を開く ↗':'Open usage ↗'}</a></div></article>`;
 }
 root.GlanceMuseUsage=Object.freeze({planName,collect,extract,sanitize,view,prepare,refreshGeneral,resetTiming,resetRemaining,normalizeHistory,recordHistory,historyView,HISTORY_LIMIT,resetAnswer,validResetHint});if(typeof module!=='undefined')module.exports=root.GlanceMuseUsage;
})(globalThis);
