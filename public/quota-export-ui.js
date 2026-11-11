/* Explicit local preview/save. No network, polling, storage or automatic download. */
(function(root){
 let url=null;
 const release=()=>{if(url){URL.revokeObjectURL(url);url=null;}};
 function attach(host,english=false){
  const doc=host.ownerDocument,say=(ja,en)=>english?en:ja,el=(tag,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  const section=el('section');section.className='quota-export-section';
  const open=el('button',say('Gateway向け利用枠JSONを確認（試作）','Preview quota JSON for Gateway (prototype)'));open.type='button';section.append(open);host.append(section);
  open.onclick=()=>{
   release();section.replaceChildren(open);
   try{
    const source=root.opener;if(!source||source.closed||source.location.origin!==root.location.origin)throw Error('source unavailable');
    const input=source.GlanceUsageReports?.readCurrentQuota?.();if(!input)throw Error('source unavailable');
    const result=root.GlanceCurrentQuota.fromSnapshots(structuredClone(input)),payload=JSON.stringify(result.envelope,null,2);
    section.append(el('h3',say('保存する内容を確認','Review before saving')),el('p',say('購読枠のみ・一覧は部分的・アカウント未照合です。リセット日時の根拠は未確認。会話・認証・金銭残高は含まず、自動送信しません。古い値や取得元未確認は現在値にしません。','Subscription pools only; partial inventory and unverified accounts. Reset evidence is unknown. No conversation, credentials or money balances; no automatic transfer. Stale or unverified values are not current capacity.')));
    const pre=el('pre',payload);pre.className='quota-export-preview';pre.tabIndex=0;section.append(pre);
    const save=el('button',say('このJSONを端末に保存','Save this JSON locally'));save.type='button';save.onclick=()=>{release();url=URL.createObjectURL(new Blob([payload],{type:'application/json'}));const a=el('a');a.href=url;a.download='LLMs-Monitor-current-quota-v1-draft.json';a.click();save.textContent=say('保存を開始しました（送信なし）','Save started (not sent)');};
    const close=el('button',say('プレビューを閉じる','Close preview'));close.type='button';close.onclick=()=>{release();section.replaceChildren(open);};section.append(save,close);
   }catch{section.append(el('p',say('取得元を確認できません。モニターからレポートを開き直してください。JSONは保存していません。','Source unavailable or ambiguous. Reopen this report from the monitor. No JSON saved.')));}
  };
 }
 root.GlanceQuotaExportUI=Object.freeze({attach});root.addEventListener('pagehide',release);
})(globalThis);
