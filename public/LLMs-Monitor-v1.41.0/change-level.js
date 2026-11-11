(function(root){
 function changeLevel(old={},next={}){
  if(!old.capturedAt||next.status!=='ready')return '';
  let changed=false,level='normal';
  for(const item of next.windows||[]){
   const before=old.windows?.find(row=>row.label===item.label);
   if(!before||typeof before.remaining!=='number'||typeof item.remaining!=='number')continue;
   // Notify only when the integer percentage shown in the UI changes.
   if(Math.round(before.remaining)===Math.round(item.remaining))continue;
   changed=true;
   if(item.remaining<=1&&before.remaining>1)level='critical';
   else if(item.remaining<=5&&before.remaining>5&&level!=='critical')level='low';
  }
  return changed?level:'';
 }
 root.GlanceChangeLevel=changeLevel;
 if(typeof module!=='undefined')module.exports=changeLevel;
})(globalThis);
