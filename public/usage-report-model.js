/* Browser-local sampled-history reports. No fetching, storage or downloads in this model. */
(function(root){
 'use strict';
 const PROVIDERS=['chatgpt','claude','gemini','grok','muse'],PER_WINDOW_LIMIT=10000,TOTAL_LIMIT=50000,GAP_MS=15*60000;
 const finite=n=>typeof n==='number'&&Number.isFinite(n),pct=n=>finite(n)&&n>=0&&n<=100,raw=n=>finite(n)&&n>=0&&n<=1e12;
 const clean=s=>typeof s==='string'?s.slice(0,160):'',iso=n=>Number.isSafeInteger(n)&&n>0&&n<=8640000000000000?new Date(n).toISOString():'',round=n=>Math.round(n*1e6)/1e6;
 function calendar(timeZone){
  const formatter=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  let previousAt=null,previousParts=null;function parts(at){if(at!==previousAt){previousAt=at;previousParts=Object.fromEntries(formatter.formatToParts(new Date(at)).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));}return previousParts;}
  const day=p=>p.year+'-'+p.month+'-'+p.day;
  return {bucket(at,period){const p=parts(at);if(period==='monthly')return p.year+'-'+p.month;if(period==='weekly'){const d=new Date(Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day)));d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10)}return day(p)},local(at){const p=parts(at),offset=Math.round((Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-Math.floor(at/1000)*1000)/60000),abs=Math.abs(offset);return day(p)+'T'+p.hour+':'+p.minute+':'+p.second+(offset>=0?'+':'-')+String(Math.floor(abs/60)).padStart(2,'0')+':'+String(abs%60).padStart(2,'0')}};
 }
 function build(data={},additionalServices={},options={}){
  const period=options.period??'daily',now=options.now??Date.now(),timeZone=options.timeZone??'Asia/Tokyo';
  if(!['daily','weekly','monthly'].includes(period)||!Number.isSafeInteger(now)||now<=0||now>8640000000000000||typeof timeZone!=='string')throw new TypeError('Invalid report options');
  const cal=calendar(timeZone),historyRows=[],summaryRows=[],unsupported=[];let rejectedRows=0,truncated=false;
  const timestamp=n=>Number.isSafeInteger(n)&&n>0&&n<=now&&n<=8640000000000000;
  function process(provider,window,input,lane,unit,scope){
   if(historyRows.length>=TOTAL_LIMIT){truncated=true;return;}
   if(!Array.isArray(input)){unsupported.push({provider,window,reason:'unsupported-history-shape'});return;}
   if(input.length>PER_WINDOW_LIMIT)truncated=true;
   const valid=[];let rejected=0;
   for(const r of input.slice(-PER_WINDOW_LIMIT)){
    if(!r||!timestamp(r.capturedAt)||(r.accountKey!==undefined&&r.accountKey!==scope.key)||(r.scope!==undefined&&r.scope!==scope.key)){rejected++;continue;}
    if(lane==='quota'){
     if(!pct(r.remaining)){rejected++;continue;}
     valid.push({segment:provider==='muse'?r._reportSegment:0,capturedAt:r.capturedAt,remainingPct:r.remaining,usedPct:round(100-r.remaining),rawRemaining:null,rawUsed:null,rawLimit:null});
    }else{
     if(!raw(r.remaining)||(r.used!==undefined&&!raw(r.used))||(r.limit!==undefined&&!raw(r.limit))||(r.total!==undefined&&!raw(r.total))){rejected++;continue;}
     const limit=r.limit??r.total??null;
     if(limit!==null&&(r.remaining>limit||r.used!==undefined&&r.used>limit)){rejected++;continue;}
     valid.push({segment:provider==='muse'?r._reportSegment:0,capturedAt:r.capturedAt,remainingPct:null,usedPct:null,rawRemaining:r.remaining,rawUsed:r.used??null,rawLimit:limit});
    }
   }
   valid.sort((a,b)=>a.capturedAt-b.capturedAt);
   const unique=[];let conflict=false;
   for(let i=0;i<valid.length;){let j=i+1;while(j<valid.length&&valid[j].capturedAt===valid[i].capturedAt)j++;
    const rows=valid.slice(i,j),key=r=>JSON.stringify([r.remainingPct,r.rawRemaining,r.rawUsed,r.rawLimit]);
    if(rows.some(r=>key(r)!==key(rows[0]))){rejected+=rows.length;conflict=true;}else unique.push(rows[0]);i=j;
   }
   rejectedRows+=rejected;const compromised=rejected>0||conflict||scope.compromised,groups=new Map();let previous=null;
   if(!unique.length){summaryRows.push({bucket:cal.bucket(now,period),provider,window,lane,unit,scope:scope.label,observations:0,firstAt:null,lastAt:null,startRemaining:null,endRemaining:null,observedDropPP:null,replenishments:0,gaps:0,unknownIntervals:1,status:'unknown'});return;}
   for(const r of unique){
    if(historyRows.length>=TOTAL_LIMIT){truncated=true;break;}
    const bucket=cal.bucket(r.capturedAt,period),sameBucket=previous&&previous.bucket===bucket,remaining=lane==='quota'?r.remainingPct:r.rawRemaining,priorRemaining=previous&&(lane==='quota'?previous.remainingPct:previous.rawRemaining),gap=!!previous&&r.capturedAt-previous.capturedAt>GAP_MS,limitChanged=!!previous&&lane==='raw'&&r.rawLimit!==previous.rawLimit;
    let intervalStatus='initial',dropPP=null,renewalObserved=null;
    if(compromised)intervalStatus='invalid-source';
    else if(previous){
     renewalObserved=limitChanged||r.segment!==previous.segment?null:remaining>priorRemaining;
     if(r.segment!==previous.segment)intervalStatus='source-segment-change';
     else if(limitChanged)intervalStatus='limit-change';
     else if(!sameBucket)intervalStatus='bucket-boundary';
     else if(gap)intervalStatus='observation-gap';
     else if(remaining>priorRemaining)intervalStatus='increase-observed';
     else {intervalStatus=remaining<priorRemaining?'decrease-observed':'no-net-change';if(lane==='quota')dropPP=round(priorRemaining-remaining);}
    }
    const row={...r,timestamp:new Date(r.capturedAt).toISOString(),localTimestamp:cal.local(r.capturedAt),timeZone,bucket,period,provider,window,lane,unit,scope:scope.label,renewalObserved,resetConfirmed:null,intervalStatus,dropPP,intervalStartAt:previous?.capturedAt??null,attribution:'later-observation'};
    historyRows.push(row);
    let summary=groups.get(bucket);
    if(!summary){summary={bucket,provider,window,lane,unit,scope:scope.label,observations:0,firstAt:r.capturedAt,lastAt:r.capturedAt,startRemaining:remaining,endRemaining:remaining,observedDropPP:null,replenishments:0,gaps:0,unknownIntervals:0,status:'unknown'};groups.set(bucket,summary)}
    summary.observations++;summary.lastAt=r.capturedAt;summary.endRemaining=remaining;
    if(dropPP!==null){summary.observedDropPP=round((summary.observedDropPP??0)+dropPP);summary.status='observed';}
    if(renewalObserved===true)summary.replenishments++;
    if(gap)summary.gaps++;
    if(dropPP===null)summary.unknownIntervals++;
    previous=row;
   }
   summaryRows.push(...groups.values());
  }
  for(const provider of PROVIDERS.filter(p=>p!=='muse')){
   const s=data?.[provider]??(provider==='grok'?additionalServices?.grok?.quota:null);if(!s)continue;
   if(s._usageDisplay==='used'){unsupported.push({provider,window:'',reason:'display-transformed-input'});continue;}
   const scoped=provider==='claude'&&typeof s.accountKey==='string'&&/^claude:[a-f0-9]{64}$/.test(s.accountKey),scope={label:scoped?'current':'unscoped',key:scoped?s.accountKey:''},groups=new Map();
   for(const [rawName,rows]of Object.entries(s.history||{}).slice(0,12)){
    const window=provider==='chatgpt'&&rawName==='Work / Codex · 週間'?'週間 (Work / Codex)':clean(rawName);if(!window)continue;
    if(!Array.isArray(rows)){unsupported.push({provider,window,reason:'unsupported-history-shape'});continue;}
    if(rows.length>PER_WINDOW_LIMIT)truncated=true;
    groups.set(window,[...(groups.get(window)||[]),...rows.slice(-PER_WINDOW_LIMIT)]);
   }
   for(const [window,rows]of groups)process(provider,window,rows,'quota','percent',scope);
   if(provider==='claude'){
    const rows=s.extraHistory?.['追加使用クレジット'];
    if(Array.isArray(rows)){const safe=rows.filter(r=>r?.unit==='unknown');rejectedRows+=rows.length-safe.length;process(provider,'追加使用クレジット',safe,'raw','unknown',scope)}
   }
  }
  const muse=additionalServices?.muse;if(muse?.history!==undefined){
   if(!Array.isArray(muse.history))unsupported.push({provider:'muse',window:'',reason:'unsupported-history-shape'});
   else {const groups=new Map();if(muse.history.length>PER_WINDOW_LIMIT)truncated=true;let segment=0,previousKind='',invalid=0;
    const source=muse.history.slice(-PER_WINDOW_LIMIT).slice().sort((a,b)=>(a?.capturedAt||0)-(b?.capturedAt||0));
    for(const r of source){
     if(!r||!timestamp(r.capturedAt)||!['percent','tokens','credits','count'].includes(r.unit)||!['week','month','day','session','unknown'].includes(r.period)||!raw(r.total)||r.total<=0||r.unit==='percent'&&r.total!==100){rejectedRows++;invalid++;segment++;previousKind='';continue;}
     const k=r.period+'|'+r.unit;if(k!==previousKind)segment++;previousKind=k;if(!groups.has(k))groups.set(k,{period:r.period,unit:r.unit,rows:[]});groups.get(k).rows.push({...r,_reportSegment:segment});
    }
    for(const g of groups.values())process('muse',g.period,g.rows,g.unit==='percent'?'quota':'raw',g.unit,{label:'unscoped',key:'',compromised:invalid>0});
   }
  }

  for(const provider of ['deepseek','perplexity','genspark'])if(data?.[provider]||additionalServices?.[provider]?.enabled)unsupported.push({provider,window:'',reason:'provider-history-adapter-unavailable'});
  historyRows.sort((a,b)=>a.capturedAt-b.capturedAt||a.provider.localeCompare(b.provider)||a.window.localeCompare(b.window));summaryRows.sort((a,b)=>b.bucket.localeCompare(a.bucket)||a.provider.localeCompare(b.provider)||a.window.localeCompare(b.window));
  return {schemaVersion:1,period,timeZone,generatedAt:now,summaryRows,historyRows,unsupported,rejectedRows,truncated,observationGapMs:GAP_MS,limitations:['sampled-change-history-not-total-usage','percentage-points-not-tokens-or-money','increases-not-confirmed-resets','no-interpolation-or-cross-bucket-allocation','long-observation-intervals-not-measured-downtime','missing-baseline-and-invalid-source-unknown','current-projected-account-history-only','native-and-unknown-unit-lanes-not-summed','provider-and-window-series-not-additive']};
 }
 function cell(value,type){let s='';if(type==='number')s=finite(value)?String(value):'';else if(type==='boolean')s=typeof value==='boolean'?String(value):'';else if(typeof value==='string'){s=value.replace(/\u0000/g,'');if(/^[\s\u0001-\u001f]*[=+\-@]/u.test(s.normalize('NFKC')))s="'"+s;}return '"'+s.replaceAll('"','""')+'"';}
 function tableCSV(columns,rows){return '\uFEFF'+[columns.map(c=>cell(c[0],'text')).join(','),...rows.map(r=>columns.map(c=>cell(r[c[1]],c[2])).join(','))].join('\r\n')+'\r\n';}
 const RAW_COLUMNS=[['timestamp_utc','timestamp'],['timestamp_local','localTimestamp'],['time_zone','timeZone'],['calendar_bucket','bucket'],['period','period'],['provider','provider'],['window','window'],['lane','lane'],['unit','unit'],['account_scope','scope'],['remaining_pct','remainingPct','number'],['used_pct','usedPct','number'],['raw_remaining','rawRemaining','number'],['raw_used','rawUsed','number'],['raw_limit','rawLimit','number'],['increase_observed_not_reset','renewalObserved','boolean'],['reset_confirmed','resetConfirmed','boolean'],['interval_status','intervalStatus'],['observed_net_drop_pp','dropPP','number'],['interval_start_utc','intervalStartISO'],['attribution','attribution']];
 function rawCSV(report){return tableCSV(RAW_COLUMNS,(report?.historyRows||[]).map(r=>({...r,intervalStartISO:iso(r.intervalStartAt)})));}
 const SUMMARY_COLUMNS=[['calendar_bucket','bucket'],['period','period'],['time_zone','timeZone'],['provider','provider'],['window','window'],['lane','lane'],['unit','unit'],['account_scope','scope'],['observations','observations','number'],['first_utc','firstISO'],['last_utc','lastISO'],['start_remaining','startRemaining','number'],['end_remaining','endRemaining','number'],['observed_net_drop_pp_not_total','observedDropPP','number'],['increase_observations_not_resets','replenishments','number'],['long_observation_intervals','gaps','number'],['unknown_intervals','unknownIntervals','number'],['status','status']];
 function summaryCSV(report){return tableCSV(SUMMARY_COLUMNS,(report?.summaryRows||[]).map(r=>({...r,period:report.period,timeZone:report.timeZone,firstISO:iso(r.firstAt),lastISO:iso(r.lastAt)})));}
 root.GlanceUsageReport=Object.freeze({build,rawCSV,summaryCSV,PER_WINDOW_LIMIT,TOTAL_LIMIT,GAP_MS});if(typeof module!=='undefined')module.exports=root.GlanceUsageReport;
})(globalThis);
