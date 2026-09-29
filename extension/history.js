(function(root){
 const LIMIT=10000,LOAD_LIMIT=10000;
 const aliases=label=>label==='週間 (Work / Codex)'?['週間 (Work / Codex)','Work / Codex · 週間']:label==='Work / Codex · 週間'?['Work / Codex · 週間','週間 (Work / Codex)']:[label];
 function record(history={},last={},id,windows,capturedAt){
  const next=structuredClone(history),nextLast=structuredClone(last),service=next[id]||{},baseline=nextLast[id]||{};let changed=false;
  for(const w of windows){const key=String(w.label).slice(0,80),keys=aliases(key),list=keys.flatMap(name=>Array.isArray(service[name])?service[name]:[]).sort((a,b)=>a.capturedAt-b.capturedAt).filter((row,index,rows)=>index===0||row.capturedAt!==rows[index-1].capturedAt||row.remaining!==rows[index-1].remaining),before=keys.map(name=>baseline[name]).find(value=>typeof value==='number');if(typeof before!=='number'||before!==w.remaining){list.push({capturedAt,remaining:w.remaining});changed=true;}service[key]=list.slice(-LIMIT);baseline[key]=w.remaining;for(const oldKey of keys.slice(1)){delete service[oldKey];delete baseline[oldKey];}}
  next[id]=service;nextLast[id]=baseline;return {history:next,last:nextLast,changed};
 }
 function view(history={},options={}){
  const limit=Math.max(1,Number(options.limit)||LOAD_LIMIT),budgetMs=Math.max(1,Number(options.budgetMs)||2600),clock=typeof options.clock==='function'?options.clock:()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now(),started=clock(),all=[];
  for(const [service,groups]of Object.entries(history||{}))for(const [label,rows]of Object.entries(groups||{}))for(const row of Array.isArray(rows)?rows:[]){const capturedAt=Number(row?.capturedAt),remaining=Number(row?.remaining);if(Number.isFinite(capturedAt)&&Number.isFinite(remaining))all.push({service,label,capturedAt,remaining});}
  all.sort((a,b)=>b.capturedAt-a.capturedAt);const selected=[];for(const row of all){if(selected.length>=limit)break;if(selected.length&&clock()-started>=budgetMs)break;selected.push(row);}
  const output={};for(const row of selected.reverse()){const groups=output[row.service]||(output[row.service]={}),rows=groups[row.label]||(groups[row.label]=[]);rows.push({capturedAt:row.capturedAt,remaining:row.remaining});}
  const times=selected.map(row=>row.capturedAt),elapsedMs=Math.max(0,Math.round(clock()-started));return {history:output,meta:{total:all.length,loaded:selected.length,firstAt:times.length?Math.min(...times):null,lastAt:times.length?Math.max(...times):null,truncated:selected.length<all.length,elapsedMs,limit,budgetMs}};
 }
 root.GlanceHistory={record,view,LIMIT,LOAD_LIMIT};if(typeof module!=='undefined')module.exports=root.GlanceHistory;
})(globalThis);
