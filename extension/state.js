(function(root){
 function currentLabel(label){return /現在のセッション|current session/i.test(String(label||''));}
 function claudeProtectedLabel(label){return currentLabel(label)||/^(?:週間|今週|This week|Weekly limits)$/i.test(String(label||''));}
 function expireWindows(windows=[],now=Date.now()){return windows.map(window=>window?.resetAt&&Number(window.resetAt)<=now?{...window,remaining:null,expired:true,reset:'リセット後の更新待ち',resetAt:null}:window);}
 // Read-time projection never rewrites the stored baseline or manufactures a new quota.
 function view(snapshot={},now=Date.now()) {
  let expired=false;
  const windows=(snapshot.windows||[]).map(w=>{if(w.expired||w.resetAt&&Number(w.resetAt)<=now){expired=true;return {...w,remaining:null,expired:true,reset:'リセット済み · 再取得待ち'};}return {...w};});
  const stuck=snapshot.refreshing&&now-(snapshot.refreshStartedAt||0)>=45000;
  return {...snapshot,windows,...(expired||stuck?{status:'error',refreshing:false,note:expired?'リセット済み · 新しい残量を再取得待ち。':'更新が完了していません · 前回取得値を表示しています。'}:{})};
 }
 function loading(old={},now=Date.now()) {return {...old,windows:expireWindows(old.windows,now),status:'loading',refreshing:true,refreshStartedAt:now,note:'更新中 · 前回取得値を表示しています。'};}
 function accept(old={},incoming,now=Date.now(),service='') {
  if(incoming.status==='login')return {...incoming,windows:[],extras:[],capturedAt:null,refreshing:false};
  if(incoming.status!=='ready')return {...old,windows:expireWindows(old.windows,now),status:'error',refreshing:false,note:'取得できませんでした · 前回取得値を表示しています。'};
  const accountChanged=!!old.accountKey&&!!incoming.accountKey&&old.accountKey!==incoming.accountKey,prior=accountChanged?{}:old,source=incoming.source||'api',origin=item=>item?._source||prior.source||'legacy';
  const receivedWindows=expireWindows(Array.isArray(incoming.windows)?incoming.windows:[],now).map(item=>({...item,_source:source})),windowInput=[...receivedWindows,...expireWindows(prior.windows||[],now).filter(oldWindow=>origin(oldWindow)!==source&&!receivedWindows.some(w=>w.label===oldWindow.label))];
  const windows=windowInput.map(w=>{const prev=prior.windows?.find(p=>p.label===w.label),resetAt=w.resetAt!=null&&Number.isFinite(Number(w.resetAt))?Number(w.resetAt):prev?.resetAt>now?prev.resetAt:null;
   // API zero needs confirmation from the official usage page for this window.
   if(service==='claude'&&source==='api'&&claudeProtectedLabel(w.label)&&w.remaining===0){
    const sameSession=!!prev&&(!prev.resetAt||prev.resetAt>now)&&(!resetAt||!prev.resetAt||Math.abs(resetAt-prev.resetAt)<60000);
    if(sameSession&&prev._source==='dom'&&prev.remaining===0)return {...prev,resetAt,conflict:null};
    if(sameSession&&typeof prev.remaining==='number'&&prev.remaining>0)return {...prev,resetAt,conflict:'api-zero',previous:prev.previous};
    return {...w,remaining:null,conflict:'api-zero-unverified',previous:prev?.previous};
   }
   return {...w,resetAt,previous:prev&&prev.remaining!==w.remaining?{remaining:prev.remaining,capturedAt:prior.capturedAt}:prev?.previous};});
  const receivedExtras=(Array.isArray(incoming.extras)?incoming.extras:[]).map(item=>({...item,_source:source})),extraInput=[...receivedExtras,...(prior.extras||[]).filter(oldExtra=>origin(oldExtra)!==source&&!receivedExtras.some(e=>e.label===oldExtra.label)&&(!oldExtra.expiresAt||oldExtra.expiresAt>now))];
  const extras=extraInput.map(e=>{const prev=prior.extras?.find(p=>p.label===e.label),missing=e.value==='未取得'&&prev&&prev.value!=='未取得';if(missing)return prev;if(e.label==='利用上限のリセット'&&prev){const count=value=>Number(String(value||'').match(/(?:利用可能|Available)\s*(\d+)/i)?.[1]),incomingCount=count(e.value),previousCount=count(prev.value),uncertain=!Number.isFinite(incomingCount),keepValue=uncertain&&previousCount>0,keepExpiry=!e.expiresAt&&prev.expiresAt>now&&incomingCount!==0&&(incomingCount>0||uncertain),keepOfficial=!e.officialText&&prev.officialText&&incomingCount!==0&&(incomingCount>0||uncertain);return {...e,...(keepValue?{value:prev.value}:{}),...(keepExpiry?{expiresAt:prev.expiresAt,detail:prev.detail,observedAt:prev.observedAt}:{}),...(keepOfficial?{officialText:prev.officialText}:{}),previous:prev&&prev.value!==(keepValue?prev.value:e.value)?{value:prev.value,capturedAt:prior.capturedAt}:prev?.previous};}return {...e,previous:prev&&prev.value!==e.value?{value:prev.value,capturedAt:prior.capturedAt}:prev?.previous};});
  const oldReset=prior.extras?.find(e=>e.label==='利用上限のリセット'),hasReset=extras.some(e=>e.label==='利用上限のリセット');
  if(!hasReset&&oldReset?.expiresAt>now)extras.push(oldReset);
  const plan=incoming.plan&&incoming.plan!=='未取得'?incoming.plan:(prior.plan||'未取得');
  return {...incoming,plan,windows,extras,note:service==='claude'&&windows.some(w=>w.conflict?.startsWith('api-zero'))?'公式APIの0%を確認中 · 直近の確認済み値を表示。':incoming.note,capturedAt:receivedWindows.length?now:prior.capturedAt||null,metadataAt:now,refreshing:false};
 }
 root.GlanceState={loading,accept,view};if(typeof module!=='undefined')module.exports=root.GlanceState;
})(globalThis);
