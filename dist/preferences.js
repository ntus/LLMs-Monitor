(function(root){
 const SERVICES=['chatgpt','claude','gemini'],ADDITIONAL=['grok','deepseek','perplexity','genspark'],CATALOG=[...SERVICES,...ADDITIONAL];
 function order(value){
  const selected=Array.isArray(value)?value.filter(id=>CATALOG.includes(id)):[];
  return [...new Set(selected),...SERVICES.filter(id=>!selected.includes(id))];
 }
 function hidden(value){return Array.isArray(value)?[...new Set(value.filter(id=>CATALOG.includes(id)))]:[];}
 function normalize(settings={}){return {...settings,usageDisplay:settings.usageDisplay==='used'?'used':'remaining',serviceOrder:order(settings.serviceOrder),hiddenServices:hidden(settings.hiddenServices??ADDITIONAL)};}
 function visible(settings={}){const selected=normalize(settings);return selected.serviceOrder.filter(id=>!selected.hiddenServices.includes(id));}
 root.GlancePreferences={SERVICES,ADDITIONAL,CATALOG,order,hidden,normalize,visible};
 if(typeof module!=='undefined')module.exports=root.GlancePreferences;
})(globalThis);
