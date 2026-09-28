(function(root){
 const names={chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini'};
 const pct=value=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(100,value)):null;
 const hours=(time,now)=>Number.isFinite(Number(time))?Math.max(0,(Number(time)-now)/3600000):null;
 const compactHours=value=>value===null?'時刻未取得':value<1?`あと${Math.max(1,Math.ceil(value*60))}分`:value<48?`あと${Math.ceil(value)}時間`:`あと${Math.ceil(value/24)}日`;
 function rowsFor(service,window){const history=service?.history||{},direct=history[window?.label];if(Array.isArray(direct))return direct;const old=window?.label==='週間 (Work / Codex)'?history['Work / Codex · 週間']:window?.label==='Work / Codex · 週間'?history['週間 (Work / Codex)']:null;return Array.isArray(old)?old:[];}
 function stats(service,window,now=Date.now()){
  const rows=rowsFor(service,window).filter(row=>Number.isFinite(Number(row?.capturedAt))&&pct(row?.remaining)!==null).sort((a,b)=>a.capturedAt-b.capturedAt).slice(-10000),remaining=pct(window?.remaining),spanHours=rows.length>1?(rows.at(-1).capturedAt-rows[0].capturedAt)/3600000:0;
  let consumed=0;for(let i=1;i<rows.length;i++)consumed+=Math.max(0,Number(rows[i-1].remaining)-Number(rows[i].remaining));
  const burn=spanHours>=.25?consumed/spanHours:null,left=hours(window?.resetAt,now),projected=remaining!==null&&burn!==null&&left!==null?Math.max(0,remaining-burn*left):null;
  return {samples:rows.length,spanHours,consumed,burn,hoursLeft:left,remaining,projected};
 }
 function weeklyWindow(service){return (service?.windows||[]).find(window=>/(?:週間|今週|week)/i.test(window.label))||(service?.windows||[])[1]||(service?.windows||[])[0];}
 function evidence(stat){const observed=stat.spanHours<1?`${Math.round(stat.spanHours*60)}分`:`${stat.spanHours.toFixed(stat.spanHours<10?1:0)}時間`,forecast=stat.projected===null?'予測待ち':`リセット時 約${Math.round(stat.projected)}%`;return `変化履歴 ${stat.samples}件・${observed}を分析 / 現在 ${Math.round(stat.remaining)}% / ${forecast}`;}
 function usageAdvice(id,service,now){
  const window=weeklyWindow(service);if(!window||pct(window.remaining)===null)return null;const stat=stats(service,window,now),name=names[id]||id,plan=service.plan&&service.plan!=='未取得'?service.plan:'現行プラン',enough=stat.samples>=3&&stat.spanHours>=6;
  if(enough&&(stat.remaining<=15||(stat.projected!==null&&stat.projected<=5&&stat.hoursLeft!==null&&stat.hoursLeft>3)))return {id:`${id}-usage`,service:name,tone:'alert',title:'上位プランを比較',text:`${plan}ではリセット前に枠を使い切る傾向です。作業停止が繰り返す場合は、上位プランを比較候補にしてください。`,evidence:evidence(stat)};
  if(enough&&stat.spanHours>=24&&stat.remaining>=65&&((stat.hoursLeft!==null&&stat.hoursLeft<=24)||(stat.projected!==null&&stat.projected>=55)))return {id:`${id}-usage`,service:name,tone:'consider',title:'下位プランも比較候補',text:`現在のペースでは利用枠が多く残る見込みです。同じ傾向が数回のリセット周期で続く場合は、下位プランとの費用差を比較できます。`,evidence:evidence(stat)};
  if(enough&&stat.projected!==null&&stat.projected>=10&&stat.projected<=40)return {id:`${id}-usage`,service:name,tone:'good',title:'現行プランを有効活用',text:`${plan}の枠を使いながら、突発的な作業に備える余裕も残せるペースです。現在の使い方を維持できます。`,evidence:evidence(stat)};
  if(enough&&stat.projected!==null)return {id:`${id}-usage`,service:name,tone:'neutral',title:'利用ペースを調整',text:stat.projected>40?'リセット時に余裕が残る見込みです。優先度の高い長時間作業をリセット前へ寄せると、プラン内の枠を活用できます。':'残量低下が速めです。重要な作業を先に行い、軽い作業はリセット後へ回すと停止を避けやすくなります。',evidence:evidence(stat)};
  const need=Math.max(0,3-stat.samples);return {id:`${id}-usage`,service:name,tone:'learning',title:'利用傾向を学習中',text:need?`あと${need}回ほど残量が変化すると、消費速度とプラン適合度を判定できます。`:'リセット時刻を取得すると、現在のペースから残量予測を表示できます。',evidence:`現在 ${Math.round(stat.remaining)}% / ${compactHours(stat.hoursLeft)}`};
 }
 function resetAdvice(service,now){
  const extra=(service?.extras||[]).find(item=>item.label==='利用上限のリセット'),count=Number(String(extra?.value||'').match(/\d+/)?.[0]);if(!extra||!Number.isFinite(count)||count<1)return null;
  const primary=(service.windows||[])[0],weekly=weeklyWindow(service),primaryRemaining=pct(primary?.remaining),weeklyRemaining=pct(weekly?.remaining),lowest=Math.min(...[primaryRemaining,weeklyRemaining].filter(value=>value!==null)),expiryHours=hours(extra.expiresAt,now),expiry=extra.expiresAt?new Date(extra.expiresAt).toLocaleString('ja-JP',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}):'期限未取得',urgent=expiryHours!==null&&expiryHours<=168;
  if(lowest<=30)return {id:'chatgpt-reset',service:'ChatGPT',tone:'action',title:'リセット権の行使候補',text:`利用枠が${Math.round(lowest)}%まで低下しています。期限内に大きな作業を続けるなら、リセット権の行使候補です。`,evidence:`利用可能 ${count} / 有効期限 ${expiry}${urgent?' / 期限まで1週間以内':''}`};
  if(urgent)return {id:'chatgpt-reset',service:'ChatGPT',tone:'alert',title:'リセット権の期限を優先',text:'失効前の作業日に、週間枠または5時間枠が30%以下になった時点での行使が目安です。利用予定がなければ無理に消費する必要はありません。',evidence:`利用可能 ${count} / 有効期限 ${expiry}`};
  return {id:'chatgpt-reset',service:'ChatGPT',tone:'neutral',title:'リセット権は温存',text:'現在は残量に余裕があります。大きな作業の直前、または週間枠が30%以下になった時のために温存できます。',evidence:`利用可能 ${count} / 有効期限 ${expiry}`};
 }
 function build(data={},now=Date.now()){
  const items=[];for(const id of ['chatgpt','claude','gemini']){const service=data[id];if(!service||service.status!=='ready')continue;const usage=usageAdvice(id,service,now);if(usage)items.push(usage);if(id==='chatgpt'){const reset=resetAdvice(service,now);if(reset)items.push(reset);}}
  return items.length?items:[{id:'waiting',service:'MONITOR',tone:'learning',title:'分析データを待っています',text:'各サービスへ接続すると、残量の変化履歴から利用ペースとプラン適合度を判定します。',evidence:'判定には残量変化3件以上を使用します'}];
 }
 root.GlanceAdvice={stats,usageAdvice,resetAdvice,build};if(typeof module!=='undefined')module.exports=root.GlanceAdvice;
})(globalThis);
