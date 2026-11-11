/* Explicit local support drafts and reference-only Bus imports. No transport. */
(function(root){
 'use strict';
 const D=root.GlanceSupportDraft,B=root.GlanceBusTiming,KEY='llms-bus-timing-reference-v1';
 const ja=()=>root.GlanceLocale?.language()!=='en',say=(a,b)=>ja()?a:b;
 function node(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;}
 function button(text,action){const b=node('button',text);b.type='button';b.onclick=action;return b;}
 function panel(title){const d=node('dialog');d.className='beta-tools-panel';const h=node('h2',title);h.id='beta-tools-title';d.setAttribute('aria-labelledby',h.id);d.append(h);d.addEventListener('close',()=>d.remove(),{once:true});document.body.append(d);return d;}
 function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function support(){
  if(document.querySelector('.beta-tools-panel'))return;
  const d=panel(say('サポート · 送信前の下書き','Support · local draft'));
  d.append(node('p',say('この画面から送信・アップロードはしません。共有したい診断項目だけ選び、下書きを保存して内容を確認してください。','Nothing is sent or uploaded here. Select diagnostic fields, save the draft and review its contents.')));
  const fields=node('fieldset'),legend=node('legend',say('共有する項目（既定：なし）','Include fields (default: none)'));fields.append(legend);
  const values={appVersion:root.Glance?.APP_VERSION||'',service:'muse',error:'unavailable',os:'unknown'},checks=[];
  for(const [key,label,options]of [['appVersion',say('画面の版番号','App version'),null],['service',say('対象サービス','Service'),D.SERVICES],['error',say('症状の分類','Error category'),D.ERRORS],['os',say('OSの種類','OS family'),D.OS]]){
   const row=node('div'),labelNode=node('label'),check=node('input');check.type='checkbox';check.value=key;checks.push(check);labelNode.append(check,document.createTextNode(label));row.append(labelNode);
   if(options){const select=node('select');select.setAttribute('aria-label',label);for(const value of options){const names={chatgpt:'ChatGPT / dots',claude:'Claude',gemini:'Gemini',grok:'Grok / Cursor',muse:'Muse',copilot:'Copilot',deepseek:'DeepSeek',perplexity:'Perplexity',genspark:'Genspark',unavailable:say('取得できない','Unavailable'),'login-required':say('ログインが必要','Sign-in required'),'permission-required':say('読取り権限が必要','Permission required'),loading:say('読込みが終わらない','Still loading'),stale:say('情報が古い','Stale data'),layout:say('表示崩れ','Layout'),other:say('その他','Other'),unknown:say('不明','Unknown')};const o=node('option',names[value]||value);o.value=value;select.append(o);}select.value=values[key];select.onchange=()=>{values[key]=select.value;paint();};row.append(select);}else row.append(node('span',' '+values[key]));check.onchange=paint;fields.append(row);
  }
  d.append(fields);
  const preview=node('textarea');preview.readOnly=true;preview.rows=14;preview.setAttribute('aria-label',say('共有内容の正確なプレビュー','Exact draft preview'));d.append(preview);
  const status=node('p');status.setAttribute('role','status');
  function paint(){preview.value=D.preview(values,checks.filter(c=>c.checked).map(c=>c.value));}
  const actions=node('div');actions.className='beta-tools-actions';actions.append(button(say('下書きを保存','Save draft'),()=>{download(preview.value,'LLMs-Monitor-support-draft.md');status.textContent=say('端末へ保存しました。送信はしていません。','Saved locally; nothing sent.');}),button(say('閉じる','Close'),()=>d.close()));
  d.append(node('p',say('残高・会話・アカウント情報は自動取得しません。再現手順は保存後に追記できます。スクショはご自身で切取り・伏字を確認してください。GitHub送信先は確認中です。','No balances, conversations or accounts are collected. Add reproduction steps after saving. Crop/redact screenshots yourself. GitHub submission destination is not configured.')),actions,status);paint();d.showModal();
 }
 function readReference(){try{const raw=localStorage.getItem(KEY);return raw?B.parse(raw).result:null;}catch{return null;}}
 function bus(){
  if(document.querySelector('.beta-tools-panel'))return;
  const d=panel(say('Bus · Muse参考日時','Bus · Muse reference time'));
  d.append(node('p',say('LLMs Bus usage-timing.v1 のデータを端末内で読み込みます。自動接続・Museへの自動送信はまだ有効ではありません。日時は自己申告の参考値で、公式残量や回復判定には使いません。','Import LLMs Bus usage-timing.v1 locally. Automatic connection and Muse sending are not enabled. Self-reported times are references, never official quotas or recovery evidence.')));
  const output=node('p');output.setAttribute('role','status');
  const labels={reference:['参考日時','Reference time'],stale:['期限切れ・再取得が必要','Stale; refresh required'],future:['観測時刻が未来','Future observation'],conflict:['日時の矛盾','Conflicting time'],requires_action:['取得元での操作が必要','Source action required'],unavailable:['日時未取得','Time unavailable'],unknown:['未接続','Disconnected']};
  function paint(){const r=readReference(),label=labels[r?.state]||labels.unknown;output.textContent=say(...label)+(r?.reference?' · '+new Date(r.reference.resetAt).toLocaleString(ja()?'ja-JP':'en-US',{hour12:false,timeZoneName:'short'})+say('（送信元・アカウント未検証）',' (sender/account unverified)'):'');}
  const input=node('input');input.type='file';input.accept='.json,application/json';input.setAttribute('aria-label',say('usage-timing.v1 JSONを選択','Choose usage-timing.v1 JSON'));input.onchange=async()=>{const file=input.files?.[0];if(!file)return;try{if(file.size>4096)throw Error();const parsed=B.parse(await file.text());localStorage.setItem(KEY,JSON.stringify(parsed.payload));paint();}catch{output.textContent=say('形式が不正、または保存できません。前の参考情報は保持しました。','Invalid format or storage unavailable. Previous reference retained.');}finally{input.value='';}};
  const actions=node('div');actions.className='beta-tools-actions';actions.append(button(say('形式サンプルを保存','Save format example'),()=>download(JSON.stringify({schema:'usage-timing.v1',provider:'muse',observationKind:'quota-reset',status:'unavailable',observedAt:null,resetAt:null,sourceKind:'unknown',sourceRef:null,accountBinding:'unverified'},null,2)+'\n','usage-timing-example.json')),button(say('参考日時を消去','Clear reference'),()=>{try{localStorage.removeItem(KEY);paint();}catch{output.textContent=say('消去できませんでした。','Could not clear.');}}),button(say('質問文をコピー','Copy question'),async()=>{try{await navigator.clipboard.writeText('リセットの正確な次回日時を、年月日・時刻・タイムゾーン付きで教えてください。分からない場合は不明と回答してください。');output.textContent=say('質問文をコピーしました。Museへの送信は行っていません。','Question copied; not sent to Muse.');}catch{output.textContent=say('質問例：次回リセットの年月日・時刻・タイムゾーンを教えてください。','Ask Muse for the next reset date, time and timezone.');}}),button(say('閉じる','Close'),()=>d.close()));
  d.append(output,input,node('p',say('読込み内容はこのブラウザーだけに保存します。公式の利用枠・履歴・通知音には影響しません。ファイルには指定形式の項目だけを含めてください。','Stored only in this browser. No effect on official quotas, history or sounds. Import only the specified payload fields.')),actions);paint();d.showModal();
 }
 function mount(){const header=document.querySelector('.header-web-links');if(header){const open=button(say('サポート','Support'),support);open.id='support-open';header.prepend(open);document.querySelector('#language-toggle')?.addEventListener('click',()=>queueMicrotask(()=>open.textContent=say('サポート','Support')));}
  document.addEventListener('click',e=>{if(e.target.closest('[data-bus-timing-open]'))bus();});
 }
 root.GlanceBetaTools={support,bus,readReference};if(typeof document!=='undefined')mount();
})(globalThis);
