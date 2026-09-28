(function(root){
 function loading(old={},now=Date.now()) {return {...old,status:'loading',refreshing:true,refreshStartedAt:now,note:'更新中 · 前回取得値を表示しています。'};}
 function accept(old={},incoming,now=Date.now()) {
  if(incoming.status==='login')return {...incoming,windows:[],extras:[],capturedAt:null,refreshing:false};
  if(incoming.status!=='ready')return {...old,status:'error',refreshing:false,note:'取得できませんでした · 前回取得値を表示しています。'};
  const windows=incoming.windows.map(w=>{const prev=old.windows?.find(p=>p.label===w.label);return {...w,previous:prev&&prev.remaining!==w.remaining?{remaining:prev.remaining,capturedAt:old.capturedAt}:prev?.previous};});
  const extras=(incoming.extras||[]).map(e=>{const prev=old.extras?.find(p=>p.label===e.label),sameReset=e.label==='利用上限のリセット'&&prev?.value===e.value&&prev.expiresAt>now;return {...e,...(sameReset&&!e.expiresAt?{expiresAt:prev.expiresAt,detail:prev.detail,observedAt:prev.observedAt}:{}),previous:prev&&prev.value!==e.value?{value:prev.value,capturedAt:old.capturedAt}:prev?.previous};});
  const oldReset=old.extras?.find(e=>e.label==='利用上限のリセット'),hasReset=extras.some(e=>e.label==='利用上限のリセット');
  if(!hasReset&&oldReset?.expiresAt>now)extras.push(oldReset);
  const plan=incoming.plan&&incoming.plan!=='未取得'?incoming.plan:(old.plan||'未取得');
  return {...incoming,plan,windows,extras,capturedAt:now,refreshing:false};
 }
 root.GlanceState={loading,accept};if(typeof module!=='undefined')module.exports=root.GlanceState;
})(globalThis);
