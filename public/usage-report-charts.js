/* Pure presentation projection. Bounded charts never invent samples or join unknown intervals. */
(function(root){
 const key=r=>JSON.stringify([r.provider,r.window,r.lane,r.unit,r.scope]);
 const names={chatgpt:'ChatGPT / dots',claude:'Claude',gemini:'Gemini',grok:'Grok / Cursor',muse:'Muse',deepseek:'DeepSeek',perplexity:'Perplexity',genspark:'Genspark'};
 function series(report){const groups=new Map();for(const r of report.historyRows||[]){const id=key(r);if(!groups.has(id))groups.set(id,{id,provider:r.provider,window:r.window,lane:r.lane,unit:r.unit,rows:[]});groups.get(id).rows.push(r);}return [...groups.values()].sort((a,b)=>Object.keys(names).indexOf(a.provider)-Object.keys(names).indexOf(b.provider)||Number(!/week|週間/i.test(a.window))-Number(!/week|週間/i.test(b.window))||a.window.localeCompare(b.window));}
 function project(source,used=true,limit=600){
  const input=source?.rows||[],rows=input.slice(-Math.min(600,Math.max(1,limit))),points=[];let previous=null;
  for(const r of rows){const value=source.lane==='quota'?(used?r.usedPct:r.remainingPct):r.rawRemaining;if(!Number.isFinite(value))continue;
   const connected=!!previous&&r.intervalStartAt===previous.at&&['decrease-observed','no-net-change'].includes(r.intervalStatus);
   points.push({at:r.capturedAt,value,connected,increase:r.renewalObserved===true,status:r.intervalStatus});previous={at:r.capturedAt};
  }
  return {points,omitted:Math.max(0,input.length-rows.length),max:source?.lane==='quota'?100:Math.max(1,...points.map(p=>p.value)),unit:source?.unit||'unknown'};
 }
 function buckets(report,source){return (report.summaryRows||[]).filter(r=>key(r)===source.id).slice().sort((a,b)=>a.bucket.localeCompare(b.bucket)).slice(-60);}
 function hourly(source){
  const rows=source?.rows||[],by=new Map(),valid=r=>typeof r.localTimestamp==='string'&&/^\d{4}-\d\d-\d\dT\d\d:/.test(r.localTimestamp),days=[...new Set(rows.filter(valid).map(r=>r.localTimestamp.slice(0,10)))].sort().slice(-28),allowed=new Set(days);let previous=null;
  for(const r of rows){if(!valid(r))continue;const day=r.localTimestamp.slice(0,10),hour=Number(r.localTimestamp.slice(11,13)),key=day+':'+hour;if(!allowed.has(day)||hour>23){previous=r;continue}if(!by.has(key))by.set(key,{day,hour,observations:0,comparable:0,unknown:0,drop:null});const c=by.get(key);c.observations++;
   const comparable=source.lane==='quota'&&previous&&r.intervalStartAt===previous.capturedAt&&previous.localTimestamp?.slice(0,13)===r.localTimestamp.slice(0,13)&&['decrease-observed','no-net-change'].includes(r.intervalStatus)&&Number.isFinite(r.dropPP);
   if(comparable){c.comparable++;c.drop=Math.round(((c.drop||0)+r.dropPP)*1e6)/1e6}else c.unknown++;previous=r;
  }
  return {days,cells:days.flatMap(day=>Array.from({length:24},(_,hour)=>by.get(day+':'+hour)||{day,hour,observations:0,comparable:0,unknown:0,drop:null})),omittedDays:Math.max(0,new Set(rows.filter(valid).map(r=>r.localTimestamp.slice(0,10))).size-days.length)};
 }
 function unsupportedText(items,en=false){const ids=[...new Set((items||[]).map(r=>typeof r==='object'?r.provider:'').filter(x=>names[x]))];return ids.length?(en?'History report unavailable for ':'履歴レポート未対応：')+ids.map(x=>names[x]).join(' / ')+(en?'. Their live cards are separate from history reporting.':'。メイン画面での取得とは別の対応状況です。'):en?'Some observations could not be summarized.':'一部の観測は集計できませんでした。';}
 function windowLabel(w,en=false){return ({week:en?'Weekly':'週間',month:en?'Monthly':'月間',day:en?'Daily':'日間',session:en?'Session':'セッション','週間':en?'Weekly':'週間','週間 (Work / Codex)':en?'Weekly (Work / Codex)':'週間 (Work / Codex)','Work / Codex · 5時間':en?'Work / Codex · 5 hours':w,'現在のセッション':en?'Current session':w,'追加使用クレジット':en?'Monthly extra allowance (native units)':'月間追加使用枠（内部単位）'})[w]||w;}
 root.GlanceReportCharts=Object.freeze({windowLabel,series,project,buckets,hourly,names,unsupportedText});if(typeof module!=='undefined')module.exports=root.GlanceReportCharts;
})(globalThis);
