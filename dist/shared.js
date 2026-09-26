(function(root){
 const services={chatgpt:{name:'ChatGPT',color:'#6dd8bf',mark:'◎',url:'https://chatgpt.com/settings/usage?tab=overview'},claude:{name:'Claude',color:'#eda681',mark:'✳',url:'https://claude.ai/new#settings/usage'},gemini:{name:'Gemini',color:'#93b3ff',mark:'✦',url:'https://gemini.google.com/usage'}};
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function fresh(s){return !!s?.capturedAt && Date.now()-s.capturedAt<125000;}
 function percent(v){return typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100?v:null;}
 function value(v){return percent(v)===null?'—':`${Math.round(v)}%`;}
 function status(s){if(!s)return '未接続';if(s.status==='login')return 'ログインが必要';if(s.status==='loading')return '取得中';if(s.status==='error')return '取得できません';if(!fresh(s))return '更新待ち';return s.windows?.length?'取得済み':'数値未取得';}
 function age(s){if(!s?.capturedAt)return '未取得';const n=Math.max(0,Math.floor((Date.now()-s.capturedAt)/1000));return n<60?`${n}秒前に取得`:`${Math.floor(n/60)}分前に取得`;}
 function widget(data={}){return `<div class="widget-title">◔ glance <span>残り使用量</span></div>`+Object.entries(services).map(([id,p])=>{const s=data[id],w=s?.windows?.[0],v=percent(w?.remaining);return `<div class="widget-row" style="--color:${p.color}"><div class="widget-line"><span>${p.name}</span><b>${value(v)}</b></div><div class="track"><i style="width:${v??0}%"></i></div><div class="widget-meta">${escape(w?.label||'未取得')} · ${escape(status(s))}${id==='chatgpt'?' / Chat対象外':''}</div></div>`}).join('')+'<div class="widget-foot">公式画面を60秒ごとに確認</div>';}
 root.Glance={services,escape,fresh,percent,value,status,age,widget};
})(globalThis);
