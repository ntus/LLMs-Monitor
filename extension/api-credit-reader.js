(()=>{
 if(globalThis.llmsApiCreditReader)return;globalThis.llmsApiCreditReader=true;
 const A=GlanceApiCredits;let scheduled=null,lastRead=0;
 const visible=node=>node.getClientRects().length>0;
 function scope(){
  const nodes=[...document.querySelectorAll('button,[role="combobox"],[aria-current="true"]')].filter(visible),selected=nodes.map(n=>(n.innerText||'').trim()).filter(s=>/(?:Organization|Billing account|請求先アカウント|組織)/i.test(s)&&s.length<160).join('|');
  if(!selected)return '';let hash=2166136261;for(const c of selected)hash=Math.imul(hash^c.charCodeAt(0),16777619);return (hash>>>0).toString(16).padStart(8,'0');
 }
 async function read(){
  const id=A.provider(location.href);if(!id||Date.now()-lastRead<1500)return;lastRead=Date.now();
  const nodes=[...document.querySelectorAll('h1,h2,h3,h4,h5,p,span,div')].filter(visible),p=A.PROVIDERS[id],matches=nodes.filter(n=>p.labels.test((n.innerText||'').trim())&&![...n.children].some(c=>p.labels.test((c.innerText||'').trim()))),values=[];
  for(const node of matches){let parent=node;for(let depth=0;parent&&depth<4;depth++,parent=parent.parentElement){const text=parent.innerText||'';if(text.length>1200)break;const parsed=A.parse(text,id);if(parsed.status==='ready'){values.push(parsed);break}}}
  let result=matches.length===1&&values.length===1?values[0]:{status:'unavailable'};
  if(!matches.length){const text=document.body.innerText.slice(0,24000);result=A.parse(text,id);if(/(?:^|\n)(?:Sign in|Log in|Continue with Google|ログイン|Googleで続行)(?:\n|$)/i.test(text))result={status:'login'};}
  // Do not transmit page text, account names, API keys, credentials or payment details.
  try{await chrome.runtime.sendMessage({type:'API_CREDIT_SNAPSHOT',service:id,...result,scope:scope()})}catch{}
 }
 chrome.runtime.onMessage.addListener((message,_,reply)=>{if(message?.type!=='API_CREDIT_READ')return false;lastRead=0;read().then(()=>reply({ready:true}),()=>reply({ready:false}));return true});
 const observer=new MutationObserver(()=>{clearTimeout(scheduled);scheduled=setTimeout(read,1200)});observer.observe(document.body,{subtree:true,childList:true,characterData:true});setTimeout(read,1500);setInterval(read,60000);
})();
