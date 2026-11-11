/* Keep one current reference only. Report computation and DOM live in an explicit tab. */
(function(root){
 let state={data:{},additionalServices:{}},tab,button;
 const english=()=>root.GlanceLocale?.language?.()==='en';
 function update(next){state={data:next?.data||{},additionalServices:next?.additionalServices||{},theme:next?.settings?.theme==='standard'?'standard':'dark'};if(button)button.textContent=english()?'Usage report':'利用状況レポート';}
 function read(){
  // Only report inputs cross into the child. The child clones once, so it never retains
  // an obsolete full monitor snapshot, feed, task data or billing response.
  const data={},additionalServices={};
  const history=s=>s?{history:s.history,...(s._usageDisplay?{_usageDisplay:s._usageDisplay}:{}),...(s.accountKey?{accountKey:s.accountKey}:{}),...(s.extraHistory?{extraHistory:s.extraHistory}:{})}:null;
  for(const id of ['chatgpt','claude','gemini','grok'])if(state.data[id])data[id]=history(state.data[id]);
  if(state.additionalServices.muse)additionalServices.muse={history:state.additionalServices.muse.history};
  if(state.additionalServices.grok?.quota)additionalServices.grok={quota:history(state.additionalServices.grok.quota)};
  for(const id of ['deepseek','perplexity','genspark'])if(state.data[id]||state.additionalServices[id]?.enabled)additionalServices[id]={enabled:true};
  return {data,additionalServices,language:english()?'en':'ja',fits:root.GlanceAdvice?.planFits(state.data)||[],theme:state.theme};
 }

 if(typeof document!=='undefined'){
  const anchor=document.querySelector('.header-web-links')||document.querySelector('.top-actions');
  if(anchor){button=document.createElement('button');button.type='button';button.id='usage-report-open';button.className='header-product-link';button.textContent=english()?'Usage report':'利用状況レポート';anchor.insertBefore(button,anchor.querySelector('.header-product-link'));button.onclick=()=>{if(tab&&!tab.closed){tab.focus();return;}tab=root.open('usage-report.html','_blank');if(!tab)button.textContent=english()?'Allow a new report tab':'レポートのタブ表示を許可してください';};}
 }
 function readCurrentQuota(){
  const result={};
  for(const id of ['chatgpt','claude','gemini']){
   const s=state.data[id];if(!s)continue;
   result[id]={status:s.status,source:s.source,capturedAt:s.capturedAt,metadataAt:s.metadataAt,windows:(Array.isArray(s.windows)?s.windows:[]).slice(0,16).map(w=>({label:w.label,_source:w._source,remaining:w.remaining,resetAt:w.resetAt,expired:w.expired,conflict:w.conflict,usageEvidence:w.usageEvidence?{source:w.usageEvidence.source,window:w.usageEvidence.window,usedPercent:w.usageEvidence.usedPercent}:null}))};
  }
  return result;
 }
 root.GlanceUsageReports=Object.freeze({update,read,readCurrentQuota});
})(globalThis);
