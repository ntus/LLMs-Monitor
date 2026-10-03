(function(root){
 function currentLabel(label){return /現在のセッション|current session/i.test(String(label||''));}
 function expireWindows(windows=[],now=Date.now()){return windows.map(window=>window?.resetAt&&Number(window.resetAt)<=now?{...window,remaining:100,reset:currentLabel(window.label)?'最初のメッセージから開始します':'リセット後の更新待ち',resetAt:null}:window);}
 function loading(old={},now=Date.now()) {return {...old,windows:expireWindows(old.windows,now),status:'loading',refreshing:true,refreshStartedAt:now,note:'更新中 · 前回取得値を表示しています。'};}
 function accept(old={},incoming,now=Date.now()) {
  if(incoming.status==='login')return {...incoming,windows:[],extras:[],capturedAt:null,refreshing:false};
  if(incoming.status!=='ready')return {...old,windows:expireWindows(old.windows,now),status:'error',refreshing:false,note:'取得できませんでした · 前回取得値を表示しています。'};
  const accountChanged=!!old.accountKey&&!!incoming.accountKey&&old.accountKey!==incoming.accountKey,prior=accountChanged?{}:old,source=incoming.source||'api',origin=item=>item?._source||prior.source||'legacy';
  const receivedWindows=expireWindows(Array.isArray(incoming.windows)?incoming.windows:[],now).map(item=>({...item,_source:source})),windowInput=[...receivedWindows,...expireWindows(prior.windows||[],now).filter(oldWindow=>origin(oldWindow)!==source&&!receivedWindows.some(w=>w.label===oldWindow.label))];
  const windows=windowInput.map(w=>{const prev=prior.windows?.find(p=>p.label===w.label),resetAt=Number.isFinite(Number(w.resetAt))?Number(w.resetAt):prev?.resetAt>now?prev.resetAt:null;return {...w,resetAt,previous:prev&&prev.remaining!==w.remaining?{remaining:prev.remaining,capturedAt:prior.capturedAt}:prev?.previous};});
  const receivedExtras=(Array.isArray(incoming.extras)?incoming.extras:[]).map(item=>({...item,_source:source})),extraInput=[...receivedExtras,...(prior.extras||[]).filter(oldExtra=>origin(oldExtra)!==source&&!receivedExtras.some(e=>e.label===oldExtra.label)&&(!oldExtra.expiresAt||oldExtra.expiresAt>now))];
  const extras=extraInput.map(e=>{const prev=prior.extras?.find(p=>p.label===e.label),missing=e.value==='未取得'&&prev&&prev.value!=='未取得';if(missing)return prev;if(e.label==='利用上限のリセット'&&prev){const count=value=>Number(String(value||'').match(/(?:利用可能|Available)\s*(\d+)/i)?.[1]),incomingCount=count(e.value),previousCount=count(prev.value),uncertain=!Number.isFinite(incomingCount),keepValue=uncertain&&previousCount>0,keepExpiry=!e.expiresAt&&prev.expiresAt>now&&incomingCount!==0&&(incomingCount>0||uncertain);return {...e,...(keepValue?{value:prev.value}:{}),...(keepExpiry?{expiresAt:prev.expiresAt,detail:prev.detail,observedAt:prev.observedAt}:{}),previous:prev&&prev.value!==(keepValue?prev.value:e.value)?{value:prev.value,capturedAt:prior.capturedAt}:prev?.previous};}return {...e,previous:prev&&prev.value!==e.value?{value:prev.value,capturedAt:prior.capturedAt}:prev?.previous};});
  const oldReset=prior.extras?.find(e=>e.label==='利用上限のリセット'),hasReset=extras.some(e=>e.label==='利用上限のリセット');
  if(!hasReset&&oldReset?.expiresAt>now)extras.push(oldReset);
  const plan=incoming.plan&&incoming.plan!=='未取得'?incoming.plan:(prior.plan||'未取得');
  return {...incoming,plan,windows,extras,capturedAt:now,refreshing:false};
 }
 root.GlanceState={loading,accept};if(typeof module!=='undefined')module.exports=root.GlanceState;
})(globalThis);
