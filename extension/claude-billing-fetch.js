/* Read-only Console session adapter. No page rendering, cookie extraction or API key. */
(function(root){
 const ORIGIN='https://platform.claude.com',MAX_BODY=524288;
 const problem=code=>Object.assign(Error('Console billing unavailable'),{code});
 function fingerprint(id){let hash=2166136261;for(const c of 'console:'+id)hash=Math.imul(hash^c.charCodeAt(0),16777619);return (hash>>>0).toString(16).padStart(8,'0')}
 function organization(rows){
  if(!Array.isArray(rows)||rows.length>100)throw problem('format');
  const api=rows.filter(r=>r&&Array.isArray(r.capabilities)&&r.capabilities.includes('api'));
  // Never probe every organization or choose the first readable account.
  if(api.length!==1)throw problem(api.length?'ambiguous':'no-api-organization');
  if(typeof api[0].uuid!=='string'||!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(api[0].uuid))throw problem('format');
  return api[0].uuid;
 }
 function parse(value,now=Date.now()){
  if(!value||typeof value!=='object'||Array.isArray(value))throw problem('format');
  const currency=value.currency;
  if(!['USD','EUR','JPY','GBP'].includes(currency))throw problem('format');
  const exponent=value.balance?.credits?.exponent??2;
  if(!Number.isInteger(exponent)||exponent<0||exponent>4||!Number.isSafeInteger(value.amount))throw problem('format');
  const lane=key=>{
   const rows=value[key];if(rows===undefined||rows===null)return {status:'unavailable'};
   if(!Array.isArray(rows)||rows.length>100)throw problem('format');
   const valid=[];
   for(const row of rows){
    if(!row||row.currency!==undefined&&row.currency!==currency||!Number.isSafeInteger(row.remaining_amount_minor_units)||row.remaining_amount_minor_units<0||!Number.isSafeInteger(row.granted_amount_minor_units)||row.granted_amount_minor_units<=0||row.remaining_amount_minor_units>row.granted_amount_minor_units)throw problem('format');
    const expiry=typeof row.expires_at==='string'?Date.parse(row.expires_at):NaN;
    if(Number.isFinite(expiry)&&expiry<=now)continue;
    const amount=row.remaining_amount_minor_units/(10**exponent);
    if(amount>1e9)throw problem('format');valid.push({status:'ready',amount,currency});
   }
   // Keep explicit individual lanes separate; never sum grants or subtract promo from total.
   return valid.length===1?valid[0]:{status:'unavailable'};
  };
  return {...lane('tranches'),promotional:lane('promo_tranches')};
 }
 async function read(fetcher=root.fetch,now=Date.now()){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);let scope='';
  async function get(path){
   const url=ORIGIN+path,response=await fetcher(url,{method:'GET',credentials:'include',cache:'no-store',redirect:'error',headers:{Accept:'application/json'},signal:controller.signal});
   if(response.status===401||response.status===403)throw problem('login');
   if(response.status===429)throw problem('rate-limited');
   if(response.status!==200||response.url&&response.url!==url)throw problem('http');
   if(!/application\/json/i.test(response.headers.get('content-type')||''))throw problem('format');
   if(Number(response.headers.get('content-length'))>MAX_BODY)throw problem('format');
   const reader=response.body.getReader();let size=0,body='';const decoder=new TextDecoder();
   try{for(;;){const item=await reader.read();if(item.done)break;size+=item.value.byteLength;if(size>MAX_BODY)throw problem('format');body+=decoder.decode(item.value,{stream:true})}body+=decoder.decode();return JSON.parse(body)}
   finally{await reader.cancel().catch(()=>{});reader.releaseLock()}
  }
  try{const id=organization(await get('/api/organizations'));scope=fingerprint(id);return {...parse(await get('/api/organizations/'+id+'/prepaid/credits'),now),scope}}
  catch(error){const failure=error.code?error:problem(error.name==='AbortError'?'timeout':'transport');if(scope)failure.scope=scope;throw failure}
  finally{clearTimeout(timer)}
 }
 root.GlanceClaudeBilling={read,parse,organization};if(typeof module!=='undefined')module.exports=root.GlanceClaudeBilling;
})(globalThis);
