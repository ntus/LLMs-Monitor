(function(root){
 function record(history={},last={},id,windows,capturedAt){
  const next=structuredClone(history),nextLast=structuredClone(last),service=next[id]||{},baseline=nextLast[id]||{};
  for(const w of windows){const key=String(w.label).slice(0,80),list=Array.isArray(service[key])?service[key]:[],before=baseline[key];if(typeof before!=='number'||before!==w.remaining)list.push({capturedAt,remaining:w.remaining});service[key]=list.slice(-100);baseline[key]=w.remaining;}
  next[id]=service;nextLast[id]=baseline;return {history:next,last:nextLast};
 }
 root.GlanceHistory={record};if(typeof module!=='undefined')module.exports=root.GlanceHistory;
})(globalThis);
