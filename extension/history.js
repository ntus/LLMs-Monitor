(function(root){
 const LIMIT=1000;
 const aliases=label=>label==='週間 (Work / Codex)'?['週間 (Work / Codex)','Work / Codex · 週間']:label==='Work / Codex · 週間'?['Work / Codex · 週間','週間 (Work / Codex)']:[label];
 function record(history={},last={},id,windows,capturedAt){
  const next=structuredClone(history),nextLast=structuredClone(last),service=next[id]||{},baseline=nextLast[id]||{};
  for(const w of windows){const key=String(w.label).slice(0,80),keys=aliases(key),list=keys.flatMap(name=>Array.isArray(service[name])?service[name]:[]).sort((a,b)=>a.capturedAt-b.capturedAt).filter((row,index,rows)=>index===0||row.capturedAt!==rows[index-1].capturedAt||row.remaining!==rows[index-1].remaining),before=keys.map(name=>baseline[name]).find(value=>typeof value==='number');if(typeof before!=='number'||before!==w.remaining)list.push({capturedAt,remaining:w.remaining});service[key]=list.slice(-LIMIT);baseline[key]=w.remaining;for(const oldKey of keys.slice(1)){delete service[oldKey];delete baseline[oldKey];}}
  next[id]=service;nextLast[id]=baseline;return {history:next,last:nextLast};
 }
 root.GlanceHistory={record,LIMIT};if(typeof module!=='undefined')module.exports=root.GlanceHistory;
})(globalThis);
