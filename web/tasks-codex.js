/* Codex desktop metadata stays independent from official browser snapshots. */
(function(root){
 'use strict';
 const UUID=/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
 const safeURL=v=>typeof v==='string'&&new RegExp('^codex://threads/'+UUID.source.slice(1,-1)+'$','i').test(v)?v:'';
 function normalize(value,now=Date.now()){
  if(value?.status!=='ready'||value.scope!=='local-desktop'||value.schemaVersion!==1||!['shared','metadata-only'].includes(value.runtime)||!Array.isArray(value.tasks)||value.tasks.length>500)return null;
  const checked=Date.parse(value.checkedAt);if(!Number.isFinite(checked)||checked>now+5000||now-checked>90000)return null;
  const seen=new Set(),tasks=[];
  for(const row of value.tasks){if(!row||typeof row.title!=='string'||!row.title.trim()||row.title.length>160||!UUID.test(row.id||'')||seen.has(row.id)||safeURL(row.url)!==`codex://threads/${row.id}`)return null;seen.add(row.id);
   const status=value.runtime==='shared'&&Date.parse(row.observedAt)===checked&&['running','idle','waiting','failed'].includes(row.status)?row.status:'unknown';
   tasks.push({id:row.id,title:row.title.replace(/[\x00-\x1f\x7f]/g,' '),url:row.url,pinned:row.pinned===true,status,observedAt:status==='unknown'?null:row.observedAt,updatedAt:typeof row.updatedAt==='string'&&Number.isFinite(Date.parse(row.updatedAt))?row.updatedAt:null});
  }
  tasks.sort((a,b)=>Number(b.pinned)-Number(a.pinned)||(Date.parse(b.updatedAt)||0)-(Date.parse(a.updatedAt)||0)||a.id.localeCompare(b.id));
  const pins=tasks.filter(t=>t.pinned).length,a=value.pinAudit||{};
  return {status:'ready',schemaVersion:1,scope:'local-desktop',runtime:value.runtime,checkedAt:value.checkedAt,limited:value.limited===true,tasks,pinAudit:{observed:Number.isInteger(a.observed)&&a.observed>=0&&a.observed<=500?a.observed:null,resolved:pins,complete:a.complete===true&&a.observed===pins&&a.resolved===pins}};
 }
 function expire(value,now=Date.now()){return value&&now-Date.parse(value.checkedAt)>90000?{...value,tasks:value.tasks.map(t=>({...t,status:'unknown',observedAt:null})),stale:true}:value;}
 const api={normalize,expire,safeURL};if(typeof module==='object'&&module.exports){module.exports=api;return}
 const $=id=>document.getElementById(id),el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
 let lang='en',active=false,automatic=true,epoch=0,busy=false,snapshot=null,status='disabled',query='',filter='all',changed=()=>{};
 const C={ja:{heading:'Codex — デスクトップ',connect:'Codexを接続',helperDownload:'連携ヘルパー v1.30.1 をダウンロード',disabled:'Codex連携は無効です。専用設定画面で有効にしてください。',apiMissing:'権限は許可済みですが、ブラウザーの接続APIが利用できません。［Codexを接続］を開き、復旧案内を確認してください。',unavailable:'Codexを取得できません。連携ヘルパーと任意権限を確認してください。前回一覧があれば保持します。',unsupported:'Codex連携には拡張機能v1.30.0以降が必要です。',pair:'メイン画面で拡張機能を接続してください。',missing:'この端末でCodexが見つかりません。',reading:'Codexの一覧を取得中…',scope:'端末内のCodex一覧です。ブラウザ版とは別の取得で、アカウントの一致や他のホストの全件は確認していません。',metadata:'一覧のみ取得。実行状態を観測できないため未確認です。',live:'共有サーバーの状態を取得。待機は完了を意味しません。',pins:'ピン留め',local:'端末内ID一覧と照合',partial:'全件確認未完了',count:'取得',stale:'前回の一覧。観測状態の有効期限切れ。',pause:'自動取得は停止中です。',empty:'Codexのタスクはありません。',noResults:'条件に合うCodexタスクはありません。',open:'Codexで開く',observed:'状態観測日時',updated:'最終更新',running:'稼働中',waiting:'確認・入力待ち',idle:'待機中',failed:'エラー',unknown:'状態未確認'},en:{heading:'Codex — Desktop',connect:'Connect Codex',helperDownload:'Download helper v1.30.1',disabled:'Codex access is disabled. Enable it in the dedicated connection page.',apiMissing:'Permission is granted, but the browser native API is unavailable. Open Connect Codex for recovery instructions.',unavailable:'Could not read Codex. Check the helper and optional permission. The previous list is retained.',unsupported:'Codex requires extension v1.30.0 or later.',pair:'Connect the extension in the main monitor first.',missing:'Codex was not found on this computer.',reading:'Reading Codex metadata…',scope:'Local Codex metadata, separate from browser conversations. Browser account matching and other-host coverage are not verified.',metadata:'Metadata only. Runtime cannot be observed; states remain Unknown.',live:'Shared-server state. Idle does not mean completed.',pins:'Pinned',local:'Local pin-ID list matched',partial:'Completeness not verified',count:'Tasks',stale:'Previous list. State observations expired.',pause:'Automatic reading is paused.',empty:'No Codex tasks.',noResults:'No matching Codex tasks.',open:'Open in Codex',observed:'State observed',updated:'Last updated',running:'Running',waiting:'Awaiting input / approval',idle:'Idle',failed:'Error',unknown:'Unknown'}};
 const t=k=>C[lang][k]||k,when=v=>v?new Date(v).toLocaleString(lang==='ja'?'ja-JP':'en-US'):'—';
 function render(){
  if(!active)return;snapshot=expire(snapshot);$('codex-heading').textContent=t('heading');const panel=$('codex-tasks'),opened=new Set([...panel.querySelectorAll('details[open]')].map(x=>x.dataset.codexId));
  const connect=el('button',t('connect'));connect.type='button';connect.onclick=()=>LLMTaskBridge.codexSetup().catch(()=>{});const download=el('a',t('helperDownload'));download.href='https://llmsmonitor.ntus.info/LLMs-Monitor-Codex-Helper-v1.30.1.zip';download.rel='noopener noreferrer';const helper=el('p');helper.append(download);panel.replaceChildren(connect,helper,el('p',t('scope')));
  let notice=busy?t('reading'):status==='disabled'?t('disabled'):status==='unsupported'?t('unsupported'):status==='not-connected'?t('pair'):status==='codex-not-found'?t('missing'):status==='native-api-unavailable'?t('apiMissing'):status==='unavailable'?t('unavailable'):'';
  if(!automatic)notice=t('pause')+(notice?' '+notice:'');if(notice)panel.append(el('p',notice,'codex-notice'));
  if(!snapshot)return;
  panel.append(el('p',`${t('count')} ${snapshot.tasks.length}${snapshot.limited?' (500件上限 / limited)':''} · ${t('pins')} ${snapshot.pinAudit.resolved}/${snapshot.pinAudit.observed??'?'} · ${snapshot.pinAudit.complete?t('local'):t('partial')}`),el('p',snapshot.stale?t('stale'):t(snapshot.runtime==='shared'?'live':'metadata')));
  const tasks=selected();
  if(!tasks.length){panel.append(el('p',t(snapshot.tasks.length?'noResults':'empty')));return}
  for(const task of tasks){const d=el('details',undefined,'codex-task');d.dataset.codexId=task.id;d.open=opened.has(task.id);const summary=el('summary'),title=el('span',`${LLMTaskModel.stateIcon(task)} ${task.pinned?'📌 ':''}${task.title}`,'task-title'),badge=el('span',t(task.status),'task-state');badge.dataset.status=task.status;if(root.LLMTaskWork)summary.append(LLMTaskWork.star(task));summary.append(title,badge);d.append(summary);const meta=el('div',undefined,'task-meta');meta.append(el('p',`${t('updated')}: ${when(task.updatedAt)}`));if(task.observedAt)meta.append(el('p',`${t('observed')}: ${when(task.observedAt)}`));const a=el('a',t('open')+' ↗');a.href=task.url;a.rel='noopener noreferrer';meta.append(a);if(root.LLMTaskWork)meta.append(LLMTaskWork.button(task));d.append(meta);panel.append(d)}
 }
 async function read(){if(!active||busy||document.hidden)return;const generation=epoch;busy=true;render();
  try{const result=await LLMTaskBridge.codex();if(generation!==epoch)return;if(result.status==='ready'){const next=normalize(result);if(next){snapshot=next;status='ready'}else status='unavailable'}else if(result.status!=='cooldown'){status=result.status;if(status==='disabled')snapshot=null}}
  catch{if(generation===epoch)status='unavailable'}finally{busy=false;render();changed()}
 }
 function mount(service,language,onChange){active=service==='chatgpt';lang=language;changed=onChange||changed;$('codex-section').hidden=!active;render()}
 function selected(){return snapshot?.tasks.filter(x=>(filter==='all'||x.status===filter)&&(!query||x.title.toLocaleLowerCase().includes(query)))||[];}
 function control(enabled,clear=false){automatic=enabled;epoch++;if(clear){snapshot=null;query='';filter='all'}render()}
 function text(){snapshot=expire(snapshot);const tasks=selected();return tasks.length?t('heading')+'\n'+tasks.map(x=>`${LLMTaskModel.stateIcon(x)} ${x.pinned?'📌 ':''}${x.title} [${t(x.status)}]`).join('\n'):''}
 root.LLMTaskCodex={mount,read,control,hasData:()=>!!snapshot,text,filter:(q,s)=>{query=q.trim().toLocaleLowerCase();filter=s;render()}};
 setInterval(()=>{if(active&&automatic&&!document.hidden)read()},60000);setInterval(()=>{if(active){const next=expire(snapshot);if(next?.stale&&!snapshot?.stale){snapshot=next;render()}}},5000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active){render();if(automatic)read()}});
})(globalThis);
