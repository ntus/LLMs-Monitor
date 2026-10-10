(()=>{
 'use strict';
 const M=globalThis.LLMTaskModel,$=id=>document.getElementById(id),params=new URLSearchParams(location.search);
 const service=M.SERVICES.includes(params.get('service'))?params.get('service'):'chatgpt';
 const names={chatgpt:['ChatGPT','◎','#6bd6c0'],claude:['Claude','✳','#efaa86'],gemini:['Gemini','✦','#98b5ff']};
 let language=['en','ja'].includes(params.get('lang'))?params.get('lang'):(navigator.language.startsWith('ja')?'ja':'en');
 let theme=params.get('theme')==='standard'?'standard':'dark',snapshot=null,noticeKey='',reading=false,automatic=true,acquiring=false,autoGeneration=0,stateReading=false,stateNotice='';
 const COPY={en:{stateChecked:'State checked',stateCoverage:'Open chats with verified controls',stateFailed:'State unavailable. Update the extension to v1.26.0 if necessary.',stateUpdate:'State reading requires extension v1.26.0 or later.',observed:'State observed',notOpen:'No open conversation tab',noSignal:'No explicit state control',stateConflict:'Open tabs report conflicting states',stateStale:'Observation expired',stateUnavailable:'State could not be read',liveRunning:'Generating response',liveIdle:'Response idle',automatic:'Auto',refresh:'Refresh list',fetching:'Reading the official sidebar…',autoLoaded:'Official sidebar updated.',autoFailed:'Could not read the sidebar. The previous list is retained. Check sign-in and update the extension.',pair:'Connect the extension in the main monitor first.',autoSource:'Official sidebar · partial coverage',autoCoverage:'Rendered sidebar only. States without explicit evidence are unknown. Project labels may be IDs. Desktop Codex tasks are not included.',code:'Claude Code',cowork:'Cowork',taskDetails:'Task details',notConnected:'Task data not connected',boundary:'Automatic reading uses the signed-in provider sidebar through the extension once a minute. Chat contents, input drafts and credentials are excluded. Open conversation controls are checked every 5 seconds. Lists and states stay in this window.',import:'Open task list (JSON)',demo:'Try a demo',expand:'Expand all',collapse:'Collapse all',copy:'Copy tree',clear:'Clear',legend:'Open conversation controls are checked about every 5 seconds. Idle does not mean completed. Closed chats and states without explicit evidence remain unknown.',empty:'Open a task list to display projects and chats.',noResults:'No matching tasks.',search:'Search tasks or projects',filter:'Filter by status',all:'All states',running:'Running (at capture)',idle:'Idle (at capture)',waiting:'Waiting',completed:'Completed (reported)',failed:'Failed (reported)',unknown:'Unknown',local:'Local snapshot · no live connection',sample:'Demo · synthetic data',captured:'Captured',updated:'Last updated',unassigned:'No project',chat:'Chat',codex:'Codex / Work',open:'Open original chat',badFile:'Could not open this file. Choose a valid JSON snapshot for this service (up to 512 KiB / 500 tasks). The previous list is unchanged.',loaded:'Task list opened locally.',reading:'Opening task list…',copied:'Tree copied.',copyFailed:'Copy is unavailable. Select the tree text below.',close:'Close',cleared:'This window’s task data was cleared.',stale:'Historical snapshot — not the current execution state',light:'Light theme',dark:'Dark theme'},ja:{stateChecked:'状態確認日時',stateCoverage:'操作ボタンから確認できた会話',stateFailed:'状態を取得できません。必要に応じて拡張機能をv1.26.0へ更新してください。',stateUpdate:'状態取得には拡張機能v1.26.0以降が必要です。',observed:'状態観測日時',notOpen:'会話のタブが開かれていません',noSignal:'状態を示す操作ボタンがありません',stateConflict:'複数タブの状態が一致しません',stateStale:'観測結果の有効期限切れ',stateUnavailable:'状態を取得できません',liveRunning:'応答生成中',liveIdle:'応答待機',automatic:'自動取得',refresh:'一覧を更新',fetching:'公式サイドバーを取得中…',autoLoaded:'公式サイドバーの一覧を更新しました。',autoFailed:'一覧を取得できません。前回一覧を保持します。ログインと拡張機能の更新を確認してください。',pair:'メインモニターで拡張機能を接続してください。',autoSource:'公式サイドバー · 一部の一覧',autoCoverage:'画面に表示された一覧に限定。明示されない実行状態は未確認。プロジェクト名がIDの場合があります。デスクトップCodexのタスクは含みません。',code:'Claude Code',cowork:'Cowork',taskDetails:'タスク詳細',notConnected:'タスク情報は未接続',boundary:'拡張機能からログイン済みの公式サイドバー一覧を1分ごとに取得します。会話本文・入力中の内容・認証情報は収集せず、開いている会話の操作ボタンは約5秒ごとに確認し、一覧と状態をこの窓内だけで扱います。',import:'タスク一覧を開く（JSON）',demo:'サンプル表示',expand:'全て展開',collapse:'全て閉じる',copy:'ツリーをコピー',clear:'消去',legend:'開いている会話の操作ボタンを約5秒ごとに確認します。応答待機は完了を意味しません。閉じた会話や根拠のない状態は未確認です。',empty:'タスク一覧を開くと、プロジェクトとチャットを表示します。',noResults:'該当するタスクはありません。',search:'タスク・プロジェクトを検索',filter:'状態で絞り込み',all:'全ての状態',running:'実行中（取得時点）',idle:'待機（取得時点）',waiting:'待機中',completed:'完了（報告値）',failed:'失敗（報告値）',unknown:'状態未確認',local:'端末内の取得済み一覧 · 自動接続なし',sample:'サンプル · 架空のデータ',captured:'一覧取得日時',updated:'最終更新',unassigned:'プロジェクト未所属',chat:'通常チャット',codex:'Codex / Work',open:'元のチャットを開く',badFile:'読み込めませんでした。このサービス用のJSON一覧（512 KiB・500件以内）を指定してください。前回の一覧は保持しています。',loaded:'タスク一覧を端末内で読み込みました。',reading:'タスク一覧を読込中…',copied:'ツリーをコピーしました。',copyFailed:'コピーできません。下のツリーを選択してコピーしてください。',close:'閉じる',cleared:'この窓のタスク情報を消去しました。',stale:'過去の一覧です。現在の実行状態ではありません',light:'標準モード',dark:'ダークモード'}};
 const t=key=>COPY[language][key]||key;
 function el(tag,text,className){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node}
 const when=value=>value?new Date(value).toLocaleString(language==='ja'?'ja-JP':'en-US',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}):'—';
 const stateLabel=task=>task.stateObservedAt&&['running','idle'].includes(task.status)?t(task.status==='running'?'liveRunning':'liveIdle'):t(task.status);
 const reasonLabel=task=>t({'not-open':'notOpen','no-signal':'noSignal',conflict:'stateConflict',stale:'stateStale',unavailable:'stateUnavailable'}[task.stateReason]||'unknown');
 function node(task,children,opened,filtering){
  const item=el('li',undefined,'task-node'),detail=el('details');detail.dataset.taskId=task.id;detail.open=filtering||opened.has('task:'+task.id);
  const summary=el('summary'),title=el('span',task.title,'task-title'),badge=el('span',stateLabel(task),'task-state');badge.dataset.status=task.status;if(task.status==='unknown'&&task.stateReason)badge.title=reasonLabel(task);summary.append(title,badge);detail.append(summary);
  const meta=el('div',undefined,'task-meta');meta.append(el('p',`${t('updated')}: ${when(task.updatedAt)}`));if(task.stateObservedAt)meta.append(el('p',`${t('observed')}: ${when(task.stateObservedAt)}`,'task-observed'));else if(task.stateReason)meta.append(el('p',reasonLabel(task)));if(task.summary)meta.append(el('p',task.summary));
  if(task.url){const link=el('a',t('open')+' ↗');link.href=task.url;link.target='_blank';link.rel='noopener noreferrer';meta.append(link)}detail.append(meta);
  if(children.get(task.id)?.length){const list=el('ul',undefined,'task-list');for(const child of children.get(task.id))list.append(node(child,children,opened,filtering));detail.append(list)}item.append(detail);return item;
 }
 function render(){
  snapshot=M.expireStates(snapshot);const scroll=window.scrollY,focused=document.activeElement?.closest('details[data-task-id]')?.dataset.taskId;
  const opened=new Set([...$('tree').querySelectorAll('details[open]')].map(d=>d.dataset.taskId?'task:'+d.dataset.taskId:'group:'+d.dataset.groupId));
  const initialized=$('tree').dataset.rendered==='true';
  document.documentElement.lang=language;document.documentElement.dataset.theme=theme;
  $('task-brand-title').textContent=`LLMs Monitor - ${names[service][0]}`;
  document.title=$('task-brand-title').textContent;
  document.documentElement.style.setProperty('--provider',names[service][2]);$('heading').textContent=names[service][0];$('service-mark').textContent=names[service][1];
  document.querySelectorAll('[data-copy]').forEach(n=>{n.textContent=t(n.dataset.copy)});$('language').textContent=language==='ja'?'🇯🇵JP':'🌍EN';$('theme').textContent=theme==='dark'?'☼':'◐';$('theme').title=t(theme==='dark'?'light':'dark');$('theme').setAttribute('aria-label',$('theme').title);
  $('search').placeholder=t('search');$('search').setAttribute('aria-label',t('search'));$('status').setAttribute('aria-label',t('filter'));for(const option of $('status').options)option.textContent=snapshot?.source==='official-sidebar'&&['running','idle'].includes(option.value)?t(option.value==='running'?'liveRunning':'liveIdle'):t(option.value);$('tree').setAttribute('aria-label',t('taskDetails'));
  $('source').textContent=snapshot?t(snapshot.source==='demo'?'sample':snapshot.source==='official-sidebar'?'autoSource':'local'):t('notConnected');document.body.dataset.source=snapshot?.source||'none';
  const stale=snapshot&&Date.now()-Date.parse(snapshot.capturedAt)>300000;
  $('capture').textContent=snapshot?`${t('captured')}: ${when(snapshot.capturedAt)}${stale?' · '+t('stale'):''}`:'';$('coverage').textContent=snapshot?.source==='demo'?'':snapshot?.source==='official-sidebar'?t('autoCoverage'):snapshot?.coverage||'';
  updateStateText();
  const tasks=snapshot?M.select(snapshot,$('search').value,$('status').value):[];
  $('count').textContent=snapshot?`${tasks.length} / ${snapshot.tasks.length}`:'0';$('count').title=t('taskDetails');
  $('copy').disabled=!tasks.length;$('clear').disabled=reading||!snapshot;$('demo').disabled=reading;$('task-file').disabled=reading;
  $('notice').textContent=noticeKey?t(noticeKey):'';$('auto').textContent=t('automatic')+' '+(automatic?'ON':'OFF');$('auto').setAttribute('aria-pressed',String(automatic));$('task-refresh').textContent=t('refresh');$('task-refresh').disabled=acquiring;
  if(!tasks.length){$('tree').replaceChildren(el('p',t(snapshot?'noResults':'empty'),'task-empty'));$('tree').dataset.rendered='false';return}
  const filtering=!!$('search').value.trim()||$('status').value!=='all',children=new Map();for(const task of tasks){const key=task.parentId||'';if(!children.has(key))children.set(key,[]);children.get(key).push(task)}
  const fragment=document.createDocumentFragment();
  for(const group of M.groups(tasks)){
   const project=el('details',undefined,'task-project');project.dataset.groupId=group.key;project.open=filtering||!initialized||opened.has('group:'+group.key);
   const summary=el('summary',group.projectTitle||t('unassigned'));summary.append(el('small',`${t(group.kind)} · ${group.tasks.length}`));project.append(summary);
   const list=el('ul',undefined,'task-list');for(const task of group.tasks.filter(t=>!t.parentId))list.append(node(task,children,opened,filtering));project.append(list);fragment.append(project);
  }$('tree').replaceChildren(fragment);$('tree').dataset.rendered='true';if(focused){const detail=[...$('tree').querySelectorAll('details[data-task-id]')].find(d=>d.dataset.taskId===focused);detail?.querySelector('summary')?.focus({preventScroll:true})}window.scrollTo({top:scroll,behavior:'instant'});
 }
 async function importFile(file){if(!file||reading)return;automatic=false;autoGeneration++;reading=true;noticeKey='reading';render();
  try{if(file.size>M.MAX_BYTES)throw Error('size');const next=M.parse(await file.text(),service);next.source='local-export';snapshot=next;stateNotice='';noticeKey='loaded';$('search').value='';$('status').value='all';$('tree').dataset.rendered='false'}catch{noticeKey='badFile'}finally{reading=false;$('task-file').value='';render()}
 }
 function textTree(){
  if(!snapshot)return '';const selected=M.select(snapshot,$('search').value,$('status').value),out=[`${names[service][0]} — ${t('taskDetails')}`,`${t('captured')}: ${when(snapshot.capturedAt)}`,t(snapshot.source==='demo'?'sample':snapshot.source==='official-sidebar'?'autoSource':'local')];
  const visit=(tasks,prefix)=>tasks.forEach((task,i)=>{const last=i===tasks.length-1;out.push(`${prefix}${last?'└─':'├─'} ${task.title} [${stateLabel(task)}]`);visit(selected.filter(x=>x.parentId===task.id),prefix+(last?'   ':'│  '))});
  M.groups(selected).forEach((group,i,groups)=>{const last=i===groups.length-1;out.push(`${last?'└─':'├─'} ${group.projectTitle||t('unassigned')} (${t(group.kind)})`);visit(group.tasks.filter(x=>!x.parentId),last?'   ':'│  ')});return out.join('\n');
 }
 $('task-file').onchange=e=>importFile(e.target.files[0]);$('search').oninput=render;$('status').onchange=render;
 $('language').onclick=()=>{language=language==='ja'?'en':'ja';render()};$('theme').onclick=()=>{theme=theme==='dark'?'standard':'dark';render()};
 $('demo').onclick=()=>{automatic=false;autoGeneration++;snapshot=M.demo(service);stateNotice='';$('search').value='';$('status').value='all';noticeKey='';$('tree').dataset.rendered='false';render()};
 $('clear').onclick=()=>{automatic=false;autoGeneration++;snapshot=null;stateNotice='';noticeKey='cleared';$('search').value='';$('status').value='all';render()};
 $('expand').onclick=()=>$('tree').querySelectorAll('details').forEach(d=>{d.open=true});$('collapse').onclick=()=>$('tree').querySelectorAll('details').forEach(d=>{d.open=false});
 $('copy').onclick=async()=>{try{await navigator.clipboard.writeText(textTree());noticeKey='copied';render()}catch{noticeKey='copyFailed';render();const dialog=el('dialog'),area=el('textarea'),close=el('button',t('close'));dialog.setAttribute('aria-label',t('taskDetails'));area.readOnly=true;area.value=textTree();area.setAttribute('aria-label',t('taskDetails'));close.onclick=()=>{dialog.close();dialog.remove()};dialog.append(area,close);document.body.append(dialog);dialog.showModal();area.focus();area.select();dialog.addEventListener('close',()=>dialog.remove(),{once:true})}};
 async function acquire(){
  if(acquiring||reading)return;const generation=autoGeneration;acquiring=true;noticeKey='fetching';render();
  try{const result=await LLMTaskBridge.read(service);if(generation!==autoGeneration)return;
   if(result.status==='ready'){const next=M.normalize(result.snapshot,service);snapshot=next;noticeKey='autoLoaded'}else if(result.status!=='cooldown')noticeKey=result.status==='not-connected'?'pair':'autoFailed';else noticeKey='';
  }catch{if(generation===autoGeneration)noticeKey='autoFailed'}finally{acquiring=false;render();if(automatic)checkStates()}
 }
 function updateStateText(){
  const text=snapshot?.source==='official-sidebar'?(stateNotice?t(stateNotice):`${t('stateCoverage')}: ${snapshot.tasks.filter(t=>t.stateObservedAt&&t.status!=='unknown').length} / ${snapshot.tasks.length}${snapshot.stateCheckedAt?' · '+t('stateChecked')+': '+when(snapshot.stateCheckedAt):''}`):'';
  if($('state-check').textContent!==text)$('state-check').textContent=text;
  for(const detail of $('tree').querySelectorAll('details[data-task-id]')){const task=snapshot?.tasks.find(t=>t.id===detail.dataset.taskId),observed=detail.querySelector('.task-observed');if(task?.stateObservedAt&&observed)observed.textContent=`${t('observed')}: ${when(task.stateObservedAt)}`}
 }
 const stateSignature=value=>JSON.stringify(value?.tasks.map(t=>[t.id,t.status,t.stateReason,!!t.stateObservedAt]));
 async function checkStates(){
  if(stateReading||!automatic||document.hidden||snapshot?.source!=='official-sidebar')return;const generation=autoGeneration,base=snapshot;stateReading=true;
  try{const result=await LLMTaskBridge.states(service);if(generation!==autoGeneration||snapshot!==base)return;if(result.status==='cooldown')return;
   const before=stateSignature(snapshot);snapshot=M.states(snapshot,result);stateNotice=result.status==='ready'?'':result.status==='unsupported'?'stateUpdate':'stateFailed';if(before!==stateSignature(snapshot))render();else updateStateText();
  }catch{if(generation===autoGeneration&&snapshot===base){snapshot=M.states(snapshot,null);stateNotice='stateFailed';render()}}finally{stateReading=false}
 }
 $('auto').onclick=()=>{automatic=!automatic;autoGeneration++;render();if(automatic){acquire();checkStates()}};$('task-refresh').onclick=acquire;
 render();acquire();setInterval(()=>{if(automatic&&!document.hidden)acquire()},60000);setInterval(()=>{const before=snapshot;snapshot=M.expireStates(snapshot);if(before!==snapshot&&!document.hidden)render();checkStates()},5000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();checkStates()}});
})();
