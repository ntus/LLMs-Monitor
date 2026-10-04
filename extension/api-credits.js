(function(root){
 const PROVIDERS={
  chatgpt:{name:'OpenAI API',origin:'https://platform.openai.com',url:'https://platform.openai.com/settings/organization/billing/overview',path:/^\/settings\/organization\/billing(?:\/|$)/,labels:/^(?:API credit balance|Credit balance|APIクレジット残高|クレジット残高)$/i},
  claude:{name:'Claude API',origin:'https://platform.claude.com',url:'https://platform.claude.com/settings/billing',path:/^\/settings\/billing(?:\/|$)/,labels:/^(?:Credit balance|Remaining credits|Available credits|クレジット残高|利用可能なクレジット)$/i},
  gemini:{name:'Gemini API',origin:'https://aistudio.google.com',url:'https://aistudio.google.com/billing',path:/^\/(?:u\/\d+\/)?billing(?:\/|$)/,labels:/^(?:Available credits|Prepay credit balance|Prepaid credit balance|利用可能なクレジット|前払いクレジット残高)$/i}
 };
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function provider(url){try{const u=new URL(url);return Object.keys(PROVIDERS).find(id=>PROVIDERS[id].origin===u.origin&&PROVIDERS[id].path.test(u.pathname))||null}catch{return null}}
 function money(text){
  const value=String(text).trim().replace(/\u00a0/g,' '),m=value.match(/^(?:(USD|EUR|JPY|GBP|[$€¥£])\s*(-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,6})?)|(-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,6})?)\s*(USD|EUR|JPY|GBP))$/i);
  if(!m)return null;const currency=({'$':'USD','€':'EUR','¥':'JPY','£':'GBP'})[m[1]||m[4]]||(m[1]||m[4]).toUpperCase(),amount=Number((m[2]||m[3]).replaceAll(',',''));return Number.isFinite(amount)&&Math.abs(amount)<=1e9?{amount,currency}:null;
 }
 function parse(text,id){
  if(!Object.hasOwn(PROVIDERS,id))return {status:'unavailable'};
  const lines=String(text).split(/\n/).map(x=>x.trim()).filter(Boolean),balances=[];
  for(let i=0;i<lines.length;i++)if(PROVIDERS[id].labels.test(lines[i])){
   // Accept a single explicitly labelled amount, never a budget, spend or auto-reload threshold.
   for(let j=i+1;j<Math.min(i+4,lines.length);j++){const found=money(lines[j]);if(found){balances.push(found);break}if(/(?:auto.?reload|buy|purchase|spent|spend|limit|budget|invoice|自動|購入|請求額)/i.test(lines[j]))break;}
  }
  if(balances.length===1)return {status:'ready',...balances[0]};
  if(balances.length>1)return {status:'unavailable'};
  if(/^(?:Postpay|Postpaid|Invoice billing|後払い|請求書払い)$/im.test(String(text)))return {status:'postpaid'};
  return {status:'unavailable'};
 }
 function sanitize(input={},now=Date.now()){
  const status=['ready','login','unavailable','postpaid'].includes(input.status)?input.status:'unavailable',valid=typeof input.amount==='number'&&Number.isFinite(input.amount)&&Math.abs(input.amount)<=1e9&&['USD','EUR','JPY','GBP'].includes(input.currency);
  return {status:status==='ready'&&!valid?'unavailable':status,amount:status==='ready'&&valid?input.amount:null,currency:status==='ready'&&valid?input.currency:null,scope:/^[a-f0-9]{8}$/.test(input.scope||'')?input.scope:'',capturedAt:now};
 }
 function accept(old={},incoming={},now=Date.now()){
  const next={...sanitize(incoming,now),enabled:old.enabled===true};
  // An unavailable reader never turns into zero. Previous values are retained only within a known billing scope.
  if(next.status!=='ready'&&next.status!=='login'&&next.scope&&next.scope===old.scope){const last=old.status==='ready'?old:old.previous;if(last?.status==='ready')next.previous={status:'ready',amount:last.amount,currency:last.currency,capturedAt:last.capturedAt};}
  return next;
 }
 function format(row,language){return new Intl.NumberFormat(language==='ja'?'ja-JP':'en-US',{style:'currency',currency:row.currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(row.amount)}
 let state={};function set(value){state=value&&typeof value==='object'?value:{}}
 function view(id){
  if(!Object.hasOwn(PROVIDERS,id))return '';const p=PROVIDERS[id];const ja=root.GlanceLocale?.language()!=='en',row=state[id]||{},enabled=row.enabled===true,stale=Date.now()-(row.capturedAt||0)>125000;
  const title=ja?'APIクレジット残高':'API credit balance',value=enabled&&row.status==='ready'&&typeof row.amount==='number'?format(row,ja?'ja':'en'):row.status==='postpaid'&&enabled?(ja?'後払い':'Postpaid'):'—';
  const note=!enabled?(ja?'API連携から個別に有効化':'Enable each provider in API connections'):row.status==='login'?(ja?'公式API請求画面でログイン':'Sign in on the official API billing page'):row.status==='postpaid'?(ja?'前払い残高は適用されません':'Prepaid balance does not apply'):row.status==='ready'&&!stale?(ja?'請求画面の表示値（プラン枠とは別）':'Billing page value; separate from plan limits'):(ja?'請求画面を開いて更新してください':'Open the billing page to update');
  const last=enabled&&row.previous?`<small>${esc(ja?'前回':'Previous')} ${esc(format(row.previous,ja?'ja':'en'))} · ${esc(new Date(row.previous.capturedAt).toLocaleString(ja?'ja-JP':'en-US',{hour12:false}))}</small>`:'';
  return `<div class="api-credit-row" data-api-provider="${id}"><div class="extra-line"><a href="${p.url}" target="_blank" rel="noopener noreferrer">${esc(title)} <small>${esc(p.name)}</small></a><b${stale&&enabled&&row.status==='ready'?' class="api-credit-stale"':''}>${esc(value)}</b></div><small>${esc(note)}</small>${last}</div>`;
 }
 root.GlanceApiCredits={PROVIDERS,provider,money,parse,sanitize,accept,format,set,view};
 if(typeof module!=='undefined')module.exports=root.GlanceApiCredits;
})(globalThis);
