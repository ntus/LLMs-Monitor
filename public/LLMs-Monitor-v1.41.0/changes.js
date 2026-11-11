(function(root){
 const numbers=text=>String(text??'').match(/\d+(?:,\d{3})*(?:\.\d+)?/g)||[];
 function createTracker(){
  const last=new Map(),until=new Map();let revision=0,level='normal',lastChangeAt=0;
  function observe(id,key,text,now=Date.now()){
   const k=JSON.stringify([id,key]),current=numbers(text),prior=last.get(k);
   let changed=false;
   if(prior)current.forEach((n,i)=>{if(prior[i]!==undefined&&prior[i]!==n){until.set(JSON.stringify([id,key,i]),now+10000);changed=true}});
   if(changed){const value=key.startsWith('window:')?Number(current[0]):NaN,observed=Number.isFinite(value)?value<=1?'critical':value<=5?'low':'normal':'normal';level=now-lastChangeAt<250?(level==='critical'||observed==='critical'?'critical':level==='low'||observed==='low'?'low':'normal'):observed;lastChangeAt=now;revision++;}
   last.set(k,current);
  }
  function clear(id){for(const map of [last,until])for(const key of map.keys())if(JSON.parse(key)[0]===id)map.delete(key);}
  function deadline(id,key,index,now=Date.now()){const t=until.get(JSON.stringify([id,key,index]))||0;return t>now?t:0;}
  function next(now=Date.now()){return Math.min(...Array.from(until.values()).filter(t=>t>now));}
  function active(now=Date.now()){return Number.isFinite(next(now));}
  function eventId(){return revision;}
  function alertLevel(){return level;}
  return {observe,clear,deadline,next,active,eventId,alertLevel};
 }
 root.GlanceChanges={createTracker};if(typeof module!=='undefined')module.exports=root.GlanceChanges;
})(globalThis);
