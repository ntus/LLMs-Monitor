(function(root){
 const SERVICES=['chatgpt','claude','gemini'],ADDITIONAL=['grok','deepseek','perplexity','genspark'],CATALOG=[...SERVICES,...ADDITIONAL];
 function order(value){
  const selected=Array.isArray(value)?value.filter(id=>CATALOG.includes(id)):[];
  return [...new Set(selected),...SERVICES.filter(id=>!selected.includes(id))];
 }
 function hidden(value){return Array.isArray(value)?[...new Set(value.filter(id=>CATALOG.includes(id)))]:[];}
 function normalize(settings={}){return {...settings,usageDisplay:settings.usageDisplay==='used'?'used':'remaining',serviceOrder:order(settings.serviceOrder),hiddenServices:hidden(settings.hiddenServices??ADDITIONAL)};}
 function visible(settings={}){const selected=normalize(settings);return selected.serviceOrder.filter(id=>!selected.hiddenServices.includes(id));}
 function settingsInput(prior,message){const input=message.settings||{};return Array.isArray(message.fields)?{...prior,...Object.fromEntries(message.fields.filter(k=>['opacity','position','enabled','theme','language','sound','volume','usageDisplay','serviceOrder','hiddenServices'].includes(k)&&Object.hasOwn(input,k)).map(k=>[k,input[k]]))}:input;}
 function restoreSelection(settings,backup){if(!backup||!Number.isFinite(backup.updatedAt)||!Array.isArray(backup.serviceOrder)||!Array.isArray(backup.hiddenServices))return null;const server=normalize(settings),stamp=Number(settings.selectionUpdatedAt)||0,defaults=JSON.stringify(server.serviceOrder)===JSON.stringify(SERVICES)&&server.hiddenServices.every(id=>ADDITIONAL.includes(id));return backup.updatedAt>stamp&&(stamp>0||defaults)?{serviceOrder:order(backup.serviceOrder),hiddenServices:hidden(backup.hiddenServices)}:null;}
 root.GlancePreferences={settingsInput,restoreSelection,SERVICES,ADDITIONAL,CATALOG,order,hidden,normalize,visible};
 if(typeof module!=='undefined')module.exports=root.GlancePreferences;
})(globalThis);
