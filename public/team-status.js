/* Offline, optional self-reported team capacity. No network, tokens or bus writes. */
(function(root){
 const IDS=['chatgpt','claude','codex','grok','muse'],LEVELS=['available','caution','low','unknown'],KEY='llms-team-status-v1',MAX_BYTES=32768;
 const plain=x=>x&&typeof x==='object'&&!Array.isArray(x),keys=(x,allowed)=>plain(x)&&Object.keys(x).every(k=>allowed.includes(k));
 function time(v){if(typeof v!=='string')return null;const m=v.match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(?:\.\d{1,3})?(Z|[+-]\d\d:\d\d)$/);if(!m)return null;const [y,mo,d,h,mi,se]=m.slice(1,7).map(Number),date=new Date(Date.UTC(y,mo-1,d)),zone=m[7];if(y<2000||date.getUTCFullYear()!==y||date.getUTCMonth()!==mo-1||date.getUTCDate()!==d||h>23||mi>59||se>59||zone!=='Z'&&(Number(zone.slice(1,3))>23||Number(zone.slice(4))>59))return null;const n=Date.parse(v);return Number.isFinite(n)?n:null;}

 function parse(text,now=Date.now()){
  if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('invalid');const d=JSON.parse(text);
  if(!keys(d,['schemaVersion','source','collectedAt','complete','agents'])||d.schemaVersion!==1||!keys(d.source,['repository','commit'])||d.source.repository!=='ntus/ai-bus'||!/^[a-f0-9]{40}$/.test(d.source.commit)||!time(d.collectedAt)||time(d.collectedAt)>now+300000||typeof d.complete!=='boolean'||!Array.isArray(d.agents)||d.agents.length>5)throw Error('invalid');
  const seen=new Set(),agents=d.agents.map(a=>{if(!keys(a,['id','level','updatedAt','resetAt'])||!IDS.includes(a.id)||seen.has(a.id)||!LEVELS.includes(a.level)||(a.updatedAt!==null&&!time(a.updatedAt))||(a.resetAt!==null&&!time(a.resetAt)))throw Error('invalid');seen.add(a.id);return {id:a.id,level:a.level,updatedAt:a.updatedAt,resetAt:a.resetAt}});if(d.complete&&seen.size!==IDS.length)throw Error('invalid');
  return {schemaVersion:1,source:{repository:'ntus/ai-bus',commit:d.source.commit},collectedAt:d.collectedAt,complete:d.complete,agents};
 }
 function view(d,now=Date.now()){const globalStale=!d||now-time(d.collectedAt)>86400000;return IDS.map(id=>{const a=d?.agents.find(a=>a.id===id),t=time(a?.updatedAt),fresh=!globalStale&&t!==null&&t<=now+300000&&now-t<=86400000;return {id,level:fresh?a.level:'unknown',updatedAt:a?.updatedAt||null,resetAt:fresh?a.resetAt:null,stale:!fresh}})}
 function presentation(d,now=Date.now()){
  const snapshotOld=!!d&&now-time(d.collectedAt)>86400000;
  return view(d,now).map(row=>{const a=d?.agents.find(a=>a.id===row.id),t=time(a?.updatedAt),reason=!d?'disconnected':!a?'missing':snapshotOld?'snapshot-stale':t===null?'undated':t>now+300000?'future':now-t>86400000?'stale':a.level==='unknown'?'unknown-level':'current';return {...row,reason};});
 }
 function mount(doc){
  const header=doc.querySelector('.header-web-links'),anchor=header||doc.querySelector('.top-actions');if(!anchor)return;
  const lang=()=>root.GlanceLocale?.language()==='ja',say=(ja,en)=>lang()?ja:en;
  let data=null,error='',paintKey='';try{const s=localStorage.getItem(KEY);if(s)data=parse(s)}catch{}
  const button=doc.createElement('button');button.type='button';button.id='team-status-open';button.className='team-status-open';button.setAttribute('aria-haspopup','dialog');anchor.prepend(button);
  const dialog=doc.createElement('dialog');dialog.className='team-status-panel';dialog.setAttribute('aria-labelledby','team-status-title');doc.body.append(dialog);
  const name=id=>({chatgpt:'ChatGPT',claude:'Claude',codex:'Codex',grok:'Grok',muse:'Muse'})[id];
  const label=l=>({available:say('余裕あり','Available'),caution:say('注意','Caution'),low:say('枯渇に近い','Near limit'),unknown:say('未確認','Unconfirmed')})[l];
  const stamp=t=>t?new Date(t).toLocaleString(lang()?'ja-JP':'en-US',{hour12:false}):say('時刻なし','No timestamp');
  const reasonText=r=>({disconnected:say('未接続','Disconnected'),missing:say('今回のファイルに申告なし','Missing from this file'),'snapshot-stale':say('読込み元データが24時間超','Snapshot older than 24h'),undated:say('申告時刻を確認できません','Report time unavailable'),future:say('申告時刻が未来のため未確認','Future report time; unconfirmed'),stale:say('申告から24時間超','Report older than 24h'),'unknown-level':say('状態が未確認または未対応','Unknown or unsupported state'),current:say('24時間以内の自己申告','Self-report within 24h')})[r];
  const nextAction=row=>row.reason!=='current'?say('元の状態ファイルを更新し、新しいJSONを読み込んでください。','Update the source status and import a new JSON.'):({available:say('作業候補を相談できます。開始前に担当AIが残量・権限を再確認します。','Discuss a task candidate; the assigned AI must recheck capacity and authorization before starting.'),caution:say('短い作業から検討し、大きな作業は分割を相談してください。','Consider a short task; discuss splitting larger work.'),low:say('重い新規作業は避け、安全な区切りと引継ぎを優先してください。','Avoid heavy new work; prioritize a safe checkpoint and handoff.')})[row.level];
  function element(tag,text,css){const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;if(css)n.className=css;return n}
  function link(text,url){const n=element('a',text);n.href=url;n.target='_blank';n.rel='noopener noreferrer';return n}
  function paint(){
   const rows=presentation(data),counts=Object.fromEntries(LEVELS.map(l=>[l,rows.filter(r=>r.level===l).length]));
   button.textContent=data?say('チーム：接続済み','Team: connected'):say('チーム：未接続','Team: disconnected');button.dataset.connected=String(!!data);button.title=data?LEVELS.map(l=>label(l)+' '+counts[l]).join(' · '):say('チーム状態：未接続（任意）','Team status: disconnected (optional)');button.setAttribute('aria-label',say('チーム状況を開く · ','Open team status · ')+button.title);
   if(!dialog.open)return;const nextKey=JSON.stringify([lang(),data,rows,error]);if(nextKey===paintKey&&dialog.children.length)return;paintKey=nextKey;dialog.replaceChildren();
   const top=element('div',undefined,'team-panel-head'),h=element('h2',say('チーム状況','Team status'));h.id='team-status-title';const close=element('button','×');close.type='button';close.setAttribute('aria-label',say('閉じる','Close'));close.onclick=()=>dialog.close();top.append(h,close);dialog.append(top);
   dialog.append(element('p',say('ai-busの自己申告を端末内で確認します。通常の残量モニターとは独立した任意機能です。','Read ai-bus self-reports locally. This optional feature is independent of the normal quota monitor.')));
   if(!data){const empty=element('section',undefined,'team-empty');empty.append(element('h3',say('まず状態JSONを読み込み','Start with a status JSON')),element('p',say('①既存のai-busからローカル出力 → ②JSONを選択 → ③状態と鮮度を確認。未接続のままでもモニターは利用できます。','1. Export from your existing local ai-bus. 2. Choose JSON. 3. Review capacity and freshness. The monitor remains usable without connecting.')));dialog.append(empty)}
   else{
    const summary=element('div',undefined,'team-summary');for(const level of LEVELS){const badge=element('span',label(level)+' '+counts[level],'team-capacity team-level-'+level);summary.append(badge)}dialog.append(summary);
    const provenance=element('section',undefined,'team-provenance');provenance.append(element('p',say('データ収集：','Snapshot collected: ')+stamp(data.collectedAt)),element('p',data.complete?say('5つの固定受け口を読取り済み。申告の鮮度は個別に判定します。','All five fixed receivers read; report freshness is evaluated separately.'):say('⚠ 一部取得。欠けた申告は未確認で、0や正常として扱いません。','⚠ Partial read. Missing reports are unconfirmed, never zero or healthy.')),link('ntus/ai-bus · '+data.source.commit.slice(0,12)+' ↗','https://github.com/ntus/ai-bus/tree/'+data.source.commit+'/status'));dialog.append(provenance);
    const list=element('div',undefined,'team-agent-grid');for(const row of rows){const card=element('article',undefined,'team-agent team-level-'+row.level),heading=element('div',undefined,'team-agent-head');heading.append(element('h3',name(row.id)),element('span',label(row.level),'team-capacity'));card.append(heading,element('p',reasonText(row.reason),'team-freshness'));
     const dates=element('dl');for(const [key,value]of [[say('申告時刻','Reported'),stamp(row.updatedAt)],[say('申告リセット','Reported reset'),row.resetAt?stamp(row.resetAt):say('未確認','Unconfirmed')]])dates.append(element('dt',key),element('dd',value));card.append(dates,element('p',nextAction(row),'team-next-action'),link(say('元の状態ファイル ↗','Source status file ↗'),'https://github.com/ntus/ai-bus/blob/'+data.source.commit+'/status/'+row.id+'.md'));list.append(card)}dialog.append(list);
   }
   const busButton=element('button',say('Bus参考日時を読み込む','Import Bus reference time'));busButton.type='button';busButton.onclick=()=>{dialog.close();root.GlanceBetaTools?.bus();};dialog.append(busButton);
   dialog.append(element('p',say('実行中・完了・障害を示すものではありません。リセット予定が過ぎても回復とは判定しません。','This is not live execution, completion or incidents. A reset estimate passing does not confirm recovery.'),'team-status-note'));
   const controls=element('section',undefined,'team-import');controls.append(element('h3',say(data?'状態を更新する':'状態JSONの読込み',data?'Update snapshot':'Import status JSON')),element('p',say('自動同期はありません。ファイルはサーバーへ送らず、このブラウザーだけに保存します。本文・認証情報を含むファイルは読み込まないでください。','No automatic sync. Files stay in this browser and are never uploaded. Do not import messages or credentials.')));
   const input=doc.createElement('input');input.type='file';input.accept='.json,application/json';input.setAttribute('aria-label',say('状態JSONを選択','Choose status JSON'));input.onchange=async()=>{const f=input.files?.[0];if(!f)return;try{if(f.size>MAX_BYTES)throw Error();const next=parse(await f.text());localStorage.setItem(KEY,JSON.stringify(next));data=next;error=''}catch{error=say('形式が不正、または保存できませんでした。前の状態を保持しました。','Invalid format or storage unavailable; previous state retained.')}paint()};controls.append(input);
   const message=element('p',error);message.setAttribute('role','status');controls.append(message);
   const actions=element('div',undefined,'team-actions');actions.append(link(say('手順を確認 ↗','Instructions ↗'),'https://llmsmonitor.ntus.org/docs/TEAM_STATUS.md'),link(say('ローカル出力ツール ↗','Offline export tool ↗'),'https://llmsmonitor.ntus.org/tools/ai-bus/snapshot.py'));actions.append(link(say('協業ガイド ↗','Collaboration guide ↗'),'https://github.com/ntus/LLMs-Monitor/blob/docs/team-collaboration-20261101/docs/team/README.md'),link(say('作業提案・相談 ↗','Propose or discuss work ↗'),'https://github.com/ntus/LLMs-Monitor/issues/31'));const clear=element('button',say('接続データを消去','Clear local data'));clear.type='button';clear.disabled=!data;clear.onclick=()=>{try{localStorage.removeItem(KEY);data=null;error=''}catch{error=say('消去できませんでした。状態は保持しています。','Could not clear storage; previous state retained.')}paint()};actions.append(clear);controls.append(actions);dialog.append(controls);
  }
  button.onclick=()=>{dialog.showModal();paint()};root.addEventListener('storage',e=>{if(e.key===KEY){try{data=e.newValue?parse(e.newValue):null}catch{data=null}paint()}});doc.querySelector('#language-toggle')?.addEventListener('click',()=>queueMicrotask(paint));setInterval(paint,60000);paint();
 }

 root.GlanceTeamStatus={parse,view,presentation,IDS,LEVELS,MAX_BYTES};if(typeof module!=='undefined')module.exports=root.GlanceTeamStatus;if(typeof document!=='undefined')mount(document);
})(globalThis);
