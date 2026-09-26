(function(root){
 const services={chatgpt:{name:'ChatGPT',color:'#6dd8bf',mark:'◎',url:'https://chatgpt.com/settings/usage?tab=overview'},claude:{name:'Claude',color:'#eda681',mark:'✳',url:'https://claude.ai/new#settings/usage'},gemini:{name:'Gemini',color:'#93b3ff',mark:'✦',url:'https://gemini.google.com/usage'}};
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function fresh(s){return !!s?.capturedAt && Date.now()-s.capturedAt<125000;}
 function percent(v){return typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100?v:null;}
 function value(v){return percent(v)===null?'—':`${Math.round(v)}%`;}
 function updating(s){return !!s?.refreshing&&Date.now()-(s.refreshStartedAt||0)<45000;}
 function status(s){if(!s)return '未接続';if(s.status==='login')return 'ログインが必要';if(updating(s))return '更新中';if(s.status==='loading'||s.status==='error')return '更新待ち（前回値）';if(!fresh(s))return '更新待ち';return s.windows?.length?'取得済み':'数値未取得';}
 function date(t){return t?new Date(t).toLocaleString('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}):'日時未取得';}
 function previous(w){return w?.previous?`<div class="previous">前回 ${escape(w.previous.value??value(w.previous.remaining))} · ${escape(date(w.previous.capturedAt))}</div>`:'';}
 function extras(data){const entries=Object.entries(services).flatMap(([id,p])=>(data[id]?.extras||[]).map(e=>`<div class="extra-row ${updating(data[id])?'is-updating':''}"><div class="extra-line"><span>${escape(p.name+' · '+e.label)}</span><b>${escape(e.value)}</b></div>${e.detail?`<div class="extra-detail">${escape(e.detail)}</div>`:''}${previous(e)}</div>`));return entries.length?'<div class="extras"><div class="extras-title">クレジット・その他</div>'+entries.join('')+'</div>':'';}
 function age(s){if(!s?.capturedAt)return '未取得';const n=Math.max(0,Math.floor((Date.now()-s.capturedAt)/1000));return n<60?`${n}秒前に取得`:`${Math.floor(n/60)}分前に取得`;}
 function widget(data={}){return `<div class="widget-title">◔ glance <span>残り使用量</span></div>`+Object.entries(services).map(([id,p])=>{const s=data[id],w=s?.windows?.[0],v=percent(w?.remaining);return `<div class="widget-row ${updating(s)?'is-updating':''}" style="--color:${p.color}" aria-busy="${updating(s)}"><div class="widget-line"><span>${p.name}</span><b>${value(v)}</b></div><div class="track"><i style="width:${v??0}%"></i></div><div class="widget-meta">${escape(w?.label||'未取得')} · ${escape(status(s))}${id==='chatgpt'?' / Chat対象外':''}</div>${previous(w)}${(s?.windows||[]).slice(1).map(x=>`<div class="widget-meta">${escape(x.label)} · 残り ${value(x.remaining)}</div>${previous(x)}`).join('')}</div>`}).join('')+extras(data)+'<div class="widget-foot">公式画面を60秒ごとに確認</div>';}
 root.Glance={services,escape,fresh,percent,value,status,age,widget,previous,extras,updating};
})(globalThis);
