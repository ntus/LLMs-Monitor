const A=GlanceApiCredits,L=GlanceLocale,text=(ja,en)=>L.language()==='ja'?ja:en;
async function paint(){
 const state=await chrome.runtime.sendMessage({type:'GET'});L.setLanguage(state.settings?.language||L.detect());document.documentElement.lang=L.language();document.documentElement.dataset.theme=state.settings?.theme||'dark';document.title=L.t('appTitle')+' · API';document.querySelector('h1').textContent=text('APIクレジット連携','API credit connections');document.querySelector('#api-help').textContent=text('月額プランとは別のAPI残高です。各社の請求画面へのアクセスを個別に許可すると、ログイン中の画面の表示値を60秒ごとに読み取ります。請求画面を開いておく必要があります。パスワード・APIキー・決済情報は保存せず、購入や設定変更は行いません。後払い・未取得・複数残高を合算して0円や推定残高にしません。','API balances are separate from monthly plan limits. Grant access to each official billing site individually to read its signed-in display every 60 seconds. Keep the billing page open. Passwords, API keys and payment details are not saved; no purchases or billing changes are made. Postpaid, missing or multiple balances are never treated as zero or estimated.');
 document.querySelector('#api-providers').innerHTML=Object.entries(A.PROVIDERS).map(([id,p])=>{const on=state.apiCredits?.[id]?.enabled;return `<section><h2>${p.name}</h2><div>${A.view(id)}</div><div class="api-setup-actions"><button type="button" data-enable="${id}" data-on="${on?'true':'false'}">${on?text('連携を解除','Disconnect'):text('アクセスを許可して連携','Allow access and connect')}</button><a href="${p.url}" target="_blank" rel="noopener noreferrer">${text('公式請求画面を開く','Open official billing')} ↗</a></div></section>`}).join('');document.querySelector('#api-back').textContent=L.t('appTitle')+' ↗';
}
document.querySelector('#api-providers').addEventListener('click',async event=>{
 const button=event.target.closest('[data-enable]');if(!button)return;const id=button.dataset.enable,on=button.dataset.on==='true',origins=[A.PROVIDERS[id].origin+'/*'];
 try{
  // Request must be the first asynchronous operation in the user click, preserving user activation.
  if(!on&&!await chrome.permissions.request({permissions:['scripting'],origins}))return;
  button.disabled=true;const result=await chrome.runtime.sendMessage({type:'API_CREDITS_CONFIGURE',service:id,enabled:!on});if(result.error)throw Error(result.error);
  if(on)await chrome.permissions.remove({origins});
  A.set((await chrome.runtime.sendMessage({type:'GET'})).apiCredits);await paint();document.querySelector('#api-result').textContent=text(on?'連携を解除しました':'連携を有効化しました。公式請求画面を開いて残高を取得してください',on?'Disconnected':'Connected. Open the official billing page to read the balance');
 }catch{button.disabled=false;document.querySelector('#api-result').textContent=text('連携できませんでした。権限と拡張機能を確認してください','Connection failed. Check permissions and the extension')}
});
chrome.runtime.sendMessage({type:'GET'}).then(state=>{A.set(state.apiCredits);return paint()});
