(function(root){
 const SERVICES=['chatgpt','claude','gemini'];
 function order(value){
  const selected=Array.isArray(value)?value.filter(id=>SERVICES.includes(id)):[];
  return [...new Set(selected),...SERVICES.filter(id=>!selected.includes(id))];
 }
 function hidden(value){return Array.isArray(value)?[...new Set(value.filter(id=>SERVICES.includes(id)))]:[];}
 function normalize(settings={}){return {...settings,serviceOrder:order(settings.serviceOrder),hiddenServices:hidden(settings.hiddenServices)};}
 function visible(settings={}){const selected=normalize(settings);return selected.serviceOrder.filter(id=>!selected.hiddenServices.includes(id));}
 root.GlancePreferences={SERVICES,order,hidden,normalize,visible};
 if(typeof module!=='undefined')module.exports=root.GlancePreferences;
})(globalThis);
