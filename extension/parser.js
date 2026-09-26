(function(root){
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function used(text){const m=clean(text).match(/(\d+(?:\.\d+)?)\s*[%％]\s*(?:使用済み|使用中|used)/i);return m&&Number(m[1])<=100?100-Number(m[1]):null;}
function remaining(text){const t=clean(text),m=t.match(/(?:残り\s*|remaining\s*)(\d+(?:\.\d+)?)\s*[%％]/i)||t.match(/(\d+(?:\.\d+)?)\s*[%％]\s*(?:remaining|left)/i);return m&&Number(m[1])<=100?Number(m[1]):null;}
function reset(text){return String(text||'').split(/\n/).map(clean).find(s=>/リセット|resets?|refreshes?/i.test(s)&&s.length<150)||'';}
function label(el,doc){return clean(el.getAttribute('aria-label')||(el.getAttribute('aria-labelledby')||'').split(' ').map(id=>doc.getElementById(id)?.textContent||'').join(' '));}
function vicinity(el,needsWindow=false){let p=el.parentElement;for(let i=0;i<6&&p;i++,p=p.parentElement){const t=p.innerText||'';if(/リセット|resets?|refreshes?/i.test(t)&&t.length<500&&(!needsWindow||/利用上限|usage limit|weekly|five.hour|5.hour/i.test(t)))return t;}return '';}
function parse(doc,service){
 const windows=[];
 if(service==='gemini')for(const [selector,name]of [['[data-test-id="gxu-currently"]','現在のセッション'],['[data-test-id="gxu-weekly"]','週間']]){const e=doc.querySelector(selector);if(!e)continue;const v=used(e.innerText);if(v!==null)windows.push({label:name,remaining:v,reset:reset(e.innerText)});}
 if(service==='claude')for(const e of doc.querySelectorAll('[role="meter"],[role="progressbar"]')){const l=label(e,doc);if(!/^(現在のセッション|今週|Current session|Weekly limits|All models|すべてのモデル)$/i.test(l))continue;const val=e.getAttribute('aria-valuenow');if(val===null||!Number.isFinite(Number(val))||Number(val)<0||Number(val)>100)continue;const t=e.getAttribute('aria-valuetext')||'';const v=remaining(t)??used(t);if(v===null)continue;windows.push({label:/今週|Weekly|All models|すべて/i.test(l)?'週間':'現在のセッション',remaining:v,reset:reset(vicinity(e))});}
 if(service==='chatgpt')for(const e of doc.querySelectorAll('progress,[role="progressbar"]')){const l=label(e,doc);if(!/残りの利用可能量|remaining/i.test(l))continue;const text=vicinity(e,true);const v=remaining(text);if(v===null)continue;const weekly=/週|week/i.test(text),five=/5\s*時間|5.hour|five.hour/i.test(text);if(!weekly&&!five||weekly&&five)continue;windows.push({label:weekly?'Work / Codex · 週間':'Work / Codex · 5時間',remaining:v,reset:reset(text)});}
 return windows.slice(0,6);
}
root.GlanceParser={parse,used,remaining,reset};
if(typeof module!=='undefined')module.exports=root.GlanceParser;
})(globalThis);
