(function(root){
 function notifyOnce(results=[],notify=()=>{}){
  const changed=results.some(result=>result?.status==='fulfilled'&&result.value===true);
  if(changed)notify();
  return changed;
 }
 root.GlanceNotificationBatch={notifyOnce};if(typeof module!=='undefined')module.exports=root.GlanceNotificationBatch;
})(globalThis);
