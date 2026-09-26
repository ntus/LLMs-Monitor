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
function creditValue(text){
 const t=clean(text),jp=t.match(/([$＄€£￥¥][\d,.]+)\s*中\s*([$＄€£￥¥][\d,.]+)\s*が?残/),en=t.match(/([$€£￥¥][\d,.]+)\s*(?:remaining|left)/i);
 if(jp)return `残り ${jp[2]} / ${jp[1]}`;
 if(en)return `残り ${en[1]}`;
 const u=used(t);if(u!==null)return `残り ${Math.round(u)}%`;
 const m=t.match(/[$＄€£￥¥]\s*[\d,.]+/);return m?m[0]:'未取得';
}
function parseExtras(doc,service){
 if(service!=='claude'&&service!=='chatgpt')return [];
 const targets=service==='claude'?[
  [/^(クラウドセッションクレジット|Cloud session credits)$/i,'クラウドセッションクレジット'],
  [/^(プロジェクトセットアップクレジット|Project setup credits)$/i,'プロジェクトセットアップクレジット'],
  [/^(使用クレジット|Usage credits|Extra usage)$/i,'使用クレジット']
 ]:[[/^(クレジット|Credits)$/i,'クレジット']];
 const headings=Array.from(doc.querySelectorAll('h1,h2,h3,h4,[role="heading"]'));
 return targets.map(([pattern,name])=>{const index=headings.findIndex(h=>pattern.test(clean(h.textContent)));if(index<0)return {label:name,value:'未取得',detail:''};
  const h=headings[index],range=doc.createRange();range.setStartAfter(h);if(headings[index+1])range.setEndBefore(headings[index+1]);else range.setEndAfter(h.parentElement);
  const content=range.cloneContents(),text=clean(content.textContent),value=creditValue(text);
  const expiry=text.match(/(?:\d{1,4}年)?\s*\d{1,2}月\d{1,2}日[^。]{0,45}?(?:期限切れ|失効|期限)|本日[^。]{0,35}?(?:失効|期限切れ)|(?:expires?|expires? on)[^。]{0,60}/i)?.[0]||'';
  const toggle=content.querySelector('[role="switch"]'),disabled=toggle?.getAttribute('aria-checked')==='false';
  return {label:name,value,detail:[disabled?'無効':null,expiry].filter(Boolean).join(' · ')};
 }).filter(e=>e.value!=='未取得'||service==='claude');
}
root.GlanceParser={parse,used,remaining,reset,parseExtras,creditValue};
if(typeof module!=='undefined')module.exports=root.GlanceParser;
})(globalThis);
