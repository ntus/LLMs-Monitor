(function(root){
 const DB_NAME='llms-monitor-diagnostics-v1',STORE='events',MAX_EVENTS=6000,MAX_BYTES=3000000,SAMPLE_AGE=72*3600000,INCIDENT_AGE=30*86400000;
 const services=new Set(['chatgpt','claude','gemini']),sources=new Set(['api','dom','system']),decisions=new Set(['accepted','api-zero','api-zero-unverified','error','login','missing']),errorCodes=new Set(['AUTH','TIMEOUT','HTTP_OR_PARSE','FETCH']);
 const number=value=>value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value))?Number(value):null;
 const limit=(value,max)=>String(value||'').slice(0,max);
 function windowKey(label){const text=String(label||'');if(/現在のセッション|current session|5時間|5.hour/i.test(text))return 'session';if(/sonnet/i.test(text))return 'weekly-sonnet';if(/opus/i.test(text))return 'weekly-opus';if(/cowork/i.test(text))return 'weekly-cowork';if(/週間|今週|week/i.test(text))return 'weekly';return 'other';}
 function event(input={},now=Date.now()){
  const service=services.has(input.service)?input.service:'unknown',source=sources.has(input.source)?input.source:'system',decision=decisions.has(input.decision)?input.decision:'accepted';
  const windows=(Array.isArray(input.windows)?input.windows:[]).slice(0,6).map(row=>({key:windowKey(row.label),rawUtilization:number(row.rawUtilization),inputRemaining:number(row.inputRemaining),shownRemaining:number(row.shownRemaining),resetAt:number(row.resetAt),decision:decisions.has(row.decision)?row.decision:decision}));
  const result={schema:1,at:number(input.at)??now,version:limit(input.version,16),service,source,decision,refreshId:limit(input.refreshId,40),elapsedMs:number(input.elapsedMs),errorCode:errorCodes.has(input.errorCode)?input.errorCode:'',windows};
  result.kind=decision==='accepted'&&!windows.some(row=>row.decision!=='accepted')?'sample':'incident';
  return result;
 }
 function keep(events,now=Date.now()){
  const valid=events.filter(row=>Number.isFinite(row?.at)&&now-row.at<=(row.kind==='incident'?INCIDENT_AGE:SAMPLE_AGE)).sort((a,b)=>a.at-b.at);
  let bytes=valid.reduce((sum,row)=>sum+JSON.stringify(row).length,0);
  while(valid.length>MAX_EVENTS||bytes>MAX_BYTES){const row=valid.shift();bytes-=JSON.stringify(row).length;}
  return valid;
 }
 function open(){return new Promise((resolve,reject)=>{if(!root.indexedDB)return reject(Error('IndexedDB unavailable'));const request=root.indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id',autoIncrement:true})};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||Error('IndexedDB open failed'))})}
 async function all(db){return new Promise((resolve,reject)=>{const rows=[],tx=db.transaction(STORE,'readonly'),request=tx.objectStore(STORE).openCursor();request.onsuccess=()=>{const cursor=request.result;if(cursor){rows.push(cursor.value);cursor.continue()}else resolve(rows)};request.onerror=()=>reject(request.error||Error('Diagnostic read failed'))})}
 async function prune(db){const rows=await all(db),saved=new Set(keep(rows).map(row=>row.id)),removed=rows.filter(row=>!saved.has(row.id));if(!removed.length)return;await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);for(const row of removed)store.delete(row.id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Diagnostic prune failed'))})}
 let writes=0;
 async function record(input){let db;try{db=await open();const row=event(input);await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).add(row);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Diagnostic write failed'))});if(++writes%24===0)await prune(db);return true}catch{if(db)try{await prune(db)}catch{}return false}finally{db?.close()}}
 async function exportRows(){let db;try{db=await open();await prune(db);return (await all(db)).map(({id,...row})=>row)}catch{return []}finally{db?.close()}}
 async function clear(){let db;try{db=await open();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Diagnostic clear failed'))});return true}catch{return false}finally{db?.close()}}
 root.GlanceDiagnostics={event,keep,record,exportRows,clear,MAX_EVENTS,MAX_BYTES};if(typeof module!=='undefined')module.exports=root.GlanceDiagnostics;
})(globalThis);
