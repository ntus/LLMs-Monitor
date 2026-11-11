/* Interpretation of adapter-scoped usage cards. No storage, network or fixed plan allowances. */
(function(root){
 'use strict';
 const VERSION=1,MAX_CARDS=12,MAX_TEXT=1600;
 const normalize=value=>typeof value==='string'?value.normalize('NFKC').replace(/\u2212/g,'-').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim():'';
 const used=/\b(?:used|consumed)\b|使用済み|利用済み|消費済み|已使用/i;
 const left=/\b(?:remaining|available|left)\b|残り|残量|利用可能|剩余|可用/i;
 const excluded=/\b(?:budget|spending|discount|auto.?reload|auto.?top.?up|invoice)\b|予算|支出|割引|自動チャージ|請求額/i;
 function direction(text){const u=used.test(text),r=left.test(text);return u===r?null:u?'used':'remaining'}
 function period(text){const found=[];for(const [name,re] of [['week',/\bweekly\b|\b(?:1|one)\s*week\b|週間|今週/i],['month',/\bmonthly\b|\b(?:1|one)\s*month\b|月間|今月/i],['day',/\bdaily\b|\b(?:1|one)\s*day\b|日間|本日|今日/i],['session',/\bsession\b|セッション/i]])if(re.test(text))found.push(name);return found.length>1?'ambiguous':found[0]||'unknown'}
 function reset(text){const rows=normalize(text).split('\n').map(s=>s.trim()).filter(s=>/reset|リセット|重置/i.test(s));return rows.length===1&&rows[0].length<=120?rows[0]:''}
 function percent(text){const n=normalize(text),matches=[...n.matchAll(/(?<![a-zA-Z0-9.,+-])(\d{1,3}(?:\.\d+)?)\s*%/g)];return (n.match(/%/g)||[]).length===1&&matches.length===1&&Number(matches[0][1])<=100?Number(matches[0][1]):null}
 function count(text){const m=normalize(text).match(/^(?:[a-z\u3040-\u30ff\u4e00-\u9fff ]{0,60}[:：]?\s*)?(\d{1,9}(?:,\d{3})*(?:\.\d+)?)\s*\/\s*(\d{1,9}(?:,\d{3})*(?:\.\d+)?)\s*(messages?|requests?|queries|credits?|tokens?|回|件|クレジット|トークン)(?:\s+(?:used|remaining|left|available)|\s*(?:使用済み|残り))?$/i);if(!m)return null;const value=Number(m[1].replaceAll(',','')),total=Number(m[2].replaceAll(',',''));return total>0&&total<=1e9&&value>=0&&value<=total?{value,total,unit:/credit|クレジット/i.test(m[3])?'credits':/token|トークン/i.test(m[3])?'tokens':'count'}:null}
 function money(text){return root.GlanceApiCredits?.money?.(normalize(text))||null}
 function scoped(cards){if(!Array.isArray(cards)||cards.length>MAX_CARDS)return [];const ids=new Set(),out=[];for(const c of cards){if(!c||typeof c.id!=='string'||!/^[-a-zA-Z0-9_]{1,40}$/.test(c.id)||ids.has(c.id)||!['quota','prepaid','promotional'].includes(c.kind)||typeof c.label!=='string'||!c.label.trim()||c.label.length>100||typeof c.text!=='string'||c.text.length>MAX_TEXT)return [];ids.add(c.id);out.push({id:c.id,kind:c.kind,label:normalize(c.label),text:normalize(c.text)})}return out}
 function parseCard(card){
  const lines=card.text.split('\n').map(s=>s.trim()).filter(Boolean),context=card.label+'\n'+card.text;
  if(excluded.test(context))return null;
  const cycle=period(context),resetText=reset(card.text);if(cycle==='ambiguous')return null;
  if(card.kind!=='quota'){
   // The adapter supplies the separately verified balance lane, never an AI-inferred account.
   if(!/balance|remaining credits|available credits|残高|残りクレジット|利用可能なクレジット|余额/i.test(card.label))return null;
   const values=lines.map(money).filter(Boolean);if(values.length!==1)return null;
   return {evidenceId:card.id,kind:card.kind,label:card.label,unit:'money',value:values[0].amount,currency:values[0].currency,direction:'remaining',period:'unknown',resetText};
  }
  const observed=[];
  for(const line of lines){
   if(/%|\d\s*\/\s*\d/.test(line)&&/[<>≤≥≈~\u2010-\u2015]|\b(?:about|approximately|up to|at least|not used|not consumed)\b|約|およそ|程度|以下|以上|未満|ではない|ではありません/i.test(line))return null;
   const p=percent(line),c=p===null?count(line):null;if(p===null&&!c)continue;
   const direct=direction(line),labelDirection=direction(card.label);if(direct&&labelDirection&&direct!==labelDirection)return null;
   const d=direct||labelDirection;if(!d||used.test(line)&&left.test(line))continue;
   const value=p!==null?p:c.value,total=p!==null?100:c.total,unit=p!==null?'percent':c.unit;
   observed.push({value,total,unit,direction:d,remaining:d==='remaining'?value:total-value});
  }
  // A label and a standalone numeric row may be adjacent within the same bounded card.
  if(!observed.length){for(let i=0;i<lines.length-1;i++){const d=direction(lines[i]);if(!d||lines[i].length>100)continue;const p=percent(lines[i+1]);if(p!==null&&/^\d+(?:\.\d+)?\s*%$/.test(lines[i+1]))observed.push({value:p,total:100,unit:'percent',direction:d,remaining:d==='remaining'?p:100-p})}}
  if(!observed.length||observed.length>2)return null;
  const base=observed[0];if(observed.some(v=>v.unit!==base.unit||v.total!==base.total||Math.abs(v.remaining-base.remaining)>0.0001))return null;
  if(observed.length===2&&observed[0].direction===observed[1].direction)return null;
  return {evidenceId:card.id,kind:'quota',label:card.label,...base,period:cycle,resetText};
 }
 function analyze(cards){const input=scoped(cards),found=input.map(parseCard).filter(Boolean),groups=new Map();for(const m of found){const key=JSON.stringify([m.kind,m.label,m.period,m.unit]);groups.set(key,[...(groups.get(key)||[]),m])}const metrics=[...groups.values()].filter(v=>v.length===1).flat();return {schemaVersion:VERSION,status:metrics.length?'ready':'unavailable',metrics,unresolved:input.filter(c=>!metrics.some(m=>m.evidenceId===c.id)).map(c=>c.id)}}
 function validate(proposal,cards){
  // A model is a candidate selector, never authority to manufacture values, units, lanes or dates.
  if(proposal?.schemaVersion!==VERSION||!Array.isArray(proposal.metrics)||proposal.metrics.length>MAX_CARDS)return {schemaVersion:VERSION,status:'unavailable',metrics:[],unresolved:[]};
  const parsed=analyze(cards),seen=new Set(),accepted=[];
  for(const p of proposal.metrics){const exact=parsed.metrics.find(m=>m.evidenceId===p?.evidenceId);if(!exact||seen.has(p.evidenceId)||Object.keys(exact).some(k=>p[k]!==exact[k]))return {schemaVersion:VERSION,status:'unavailable',metrics:[],unresolved:parsed.unresolved};seen.add(p.evidenceId);accepted.push(exact)}
  return {schemaVersion:VERSION,status:accepted.length?'ready':'unavailable',metrics:accepted,unresolved:parsed.unresolved};
 }
 // Provider adapters opt into scoped collection. Never walk/read the document body or chat transcript.
 function section(doc,label){const heads=[...doc.querySelectorAll('h1,h2,h3,h4,[role="heading"]')].filter(n=>n.getClientRects().length&&normalize(n.textContent)===label&&!n.closest?.('[hidden],[aria-hidden="true"]'));if(heads.length!==1)return [];
  let anchor=heads[0];for(let depth=0;anchor&&depth<3;depth++,anchor=anchor.parentElement){const next=anchor.nextElementSibling;if(!next||next===doc.body||!next.getClientRects().length||next.closest?.('[hidden],[aria-hidden="true"]')||next.querySelector('input,textarea,[contenteditable="true"],h1,h2,h3,h4,[role="heading"]'))continue;const text=next.innerText;if(typeof text==='string'&&text.length<=MAX_TEXT&&/(?:%|\d\s*\/\s*\d)/.test(normalize(text)))return [{id:'usage',kind:'quota',label,text}]}
  return [];
 }
 root.GlanceUsageEvidence=Object.freeze({VERSION,analyze,validate,section});if(typeof module!=='undefined')module.exports=root.GlanceUsageEvidence;
})(globalThis);
