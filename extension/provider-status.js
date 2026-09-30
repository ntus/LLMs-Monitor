(function(root){
 const sources={chatgpt:{name:'ChatGPT',url:'https://status.openai.com/'},claude:{name:'Claude',url:'https://status.claude.com/'},gemini:{name:'Gemini',url:'https://www.google.com/appsstatus/dashboard/products/npdyhgECDJ6tB66MxXyo/history'}};
 const clean=value=>String(value??'').replace(/<[^>]*>/g,' ').replace(/\[[^\]]+\]\([^)]*\)/g,' ').replace(/[*_#`]/g,' ').replace(/\s+/g,' ').trim().slice(0,180);
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 function result(id,state,summary,checkedAt=Date.now()){return {state,summary:clean(summary),checkedAt,url:sources[id].url};}
 function parseStatuspage(id,payload,checkedAt=Date.now()){
  if(!payload||!payload.status||!['none','minor','major','critical'].includes(payload.status.indicator))return result(id,'unknown','Status unavailable',checkedAt);
  const components=Array.isArray(payload.components)?payload.components:[];
  const relevant=id==='chatgpt'?components.filter(c=>/ChatGPT|Conversations|Codex|Login|GPTs|Deep Research|Voice mode|File uploads/i.test(String(c.name))):components.filter(c=>/Claude|API|Console/i.test(String(c.name)));
  const affected=relevant.filter(c=>c.status&&c.status!=='operational');
  const incidents=(Array.isArray(payload.incidents)?payload.incidents:[]).filter(i=>i.status!=='resolved'&&i.status!=='postmortem');
  const incident=incidents.find(i=>!Array.isArray(i.components)||!i.components.length||i.components.some(c=>affected.some(a=>a.id===c.id)))||null;
  if(id==='chatgpt'&&relevant.length&&affected.length===0)return result(id,'ok','All monitored components operational',checkedAt);
  if(affected.length||payload.status.indicator!=='none')return result(id,'issue',incident?.name||affected.map(c=>c.name+' · '+c.status.replaceAll('_',' ')).join(', ')||payload.status.description,checkedAt);
  return result(id,'ok',payload.status.description||'All systems operational',checkedAt);
 }
 function parseGemini(payload,checkedAt=Date.now()){
  if(!Array.isArray(payload))return result('gemini','unknown','Status unavailable',checkedAt);
  const active=payload.filter(i=>!i.end&&(i.service_name==='Gemini'||(Array.isArray(i.affected_products)&&i.affected_products.some(p=>p.title==='Gemini'))));
  const outage=active.find(i=>['SERVICE_DISRUPTION','SERVICE_OUTAGE'].includes(i.status_impact)||['medium','high','critical'].includes(i.severity));
  if(outage)return result('gemini','issue',clean(outage.external_desc).replace(/^(Summary|Title):?\s*/i,'')||'Gemini incident reported',checkedAt);
  return result('gemini','ok','No active Gemini disruption reported',checkedAt);
 }
 function normalize(saved){const out={};for(const id of Object.keys(sources)){const row=saved?.[id];out[id]=row&&['ok','issue','unknown','recovered'].includes(row.state)?{state:row.state,summary:clean(row.summary),checkedAt:Number(row.checkedAt)||0,url:sources[id].url,hadIssue:row.hadIssue===true,recoveryUntil:Number(row.recoveryUntil)||0}:result(id,'unknown','Not checked yet',0)}return out;}
 function transition(previous,current,now=Date.now()){const before=normalize(previous),next=normalize(current);for(const id of Object.keys(sources)){const prior=before[id],row=next[id];if(row.state==='issue'){row.hadIssue=true;continue}if(row.state==='unknown'){row.hadIssue=prior.hadIssue||prior.state==='issue';continue}if(row.state==='ok'&&(prior.state==='issue'||prior.hadIssue||prior.state==='recovered'&&prior.recoveryUntil>now)){row.state='recovered';row.summary='Recovered';row.recoveryUntil=prior.state==='recovered'&&prior.recoveryUntil>now?prior.recoveryUntil:now+600000}}return next;}
 function incidentKey(status){return Object.entries(normalize(status)).filter(([,row])=>row.state==='issue').map(([id,row])=>id+':'+row.summary).join('|');}
 function view(status,language='en',open=false){const en=language==='en',items=Object.entries(normalize(status)),issues=items.filter(([,row])=>row.state==='issue'),recovered=items.filter(([,row])=>row.state==='recovered'),title=issues.length?(en?`${issues.length} service alert${issues.length===1?'':'s'}`:`${issues.length}件のサービス障害情報`):recovered.length?(en?`${recovered.map(([id])=>sources[id].name).join(', ')} recovered`:`${recovered.map(([id])=>sources[id].name).join('・')} 復帰しました`):(en?'Provider status':'サービス稼働状況');return `<details class="provider-status${issues.length?' has-issue':recovered.length?' has-recovery':''}"${open?' open':''}><summary>ⓘ ${escape(title)}${issues.length?' ⚠︎':recovered.length?' ✓':''}</summary><div class="provider-status-popover"><div class="provider-status-list">${items.map(([id,row])=>`<div class="provider-status-row ${row.state}"><strong>${sources[id].name}</strong><span>${escape(row.state==='ok'?(en?'Operational':'異常報告なし'):row.state==='unknown'?(en?'Status unavailable':'状況を確認できません'):row.state==='recovered'?(en?'Recovered':'復帰しました'):row.summary)}</span><a href="${sources[id].url}" target="_blank" rel="noopener noreferrer">${en?'Official status ↗':'公式ステータス ↗'}</a></div>`).join('')}</div><small>${en?'Checks every minute. Official dashboards may not cover every individual issue.':'1分ごとに確認します。公式ダッシュボードに個別の障害が載らない場合があります。'}</small></div></details>`;}
 root.GlanceProviderStatus={sources,clean,parseStatuspage,parseGemini,normalize,transition,incidentKey,view};if(typeof module!=='undefined')module.exports=root.GlanceProviderStatus;
})(globalThis);
