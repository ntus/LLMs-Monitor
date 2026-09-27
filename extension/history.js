(function(root){
 function record(history={},id,windows,capturedAt){const next=structuredClone(history),service=next[id]||{};for(const w of windows){const key=String(w.label).slice(0,80),list=Array.isArray(service[key])?service[key]:[];if(!list.length||list[list.length-1].capturedAt!==capturedAt)list.push({capturedAt,remaining:w.remaining});service[key]=list.slice(-100)}next[id]=service;return next;}
 root.GlanceHistory={record};if(typeof module!=='undefined')module.exports=root.GlanceHistory;
})(globalThis);
