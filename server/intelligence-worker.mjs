const ACCOUNTS={
 OpenAI:{provider:'openai',role:'official'},OpenAIDevs:{provider:'openai',role:'official'},ChatGPTapp:{provider:'openai',role:'official'},OpenAINewsroom:{provider:'openai',role:'official'},
 thsottiaux:{provider:'openai',role:'staff'},AnthropicAI:{provider:'anthropic',role:'official'},claudeai:{provider:'anthropic',role:'official'},GoogleAI:{provider:'google',role:'official'},GeminiApp:{provider:'google',role:'official'}
};
const QUERY=`(${Object.keys(ACCOUNTS).map(name=>`from:${name}`).join(' OR ')}) -is:retweet`;
const SIGNALS={reset:/\breset(?:s|ting)?\b|リセット|refresh(?:ed)?\s+(?:the\s+)?(?:limit|quota)/i,usage:/usage\s+(?:limit|cap|quota)|rate\s*limit|token\s+(?:limit|cap|quota)|credit(?:s)?|利用(?:量|枠|上限)|上限|クレジット|quota|allowance/i,recovery:/\brecover(?:ed|y)?\b|restor(?:ed|ing)|復旧|回復/i};
const clean=value=>String(value??'').replace(/\s+/g,' ').trim().slice(0,360);
function power(text){for(const match of String(text).matchAll(/(\d{2,3}(?:\.\d+)?)\s*%/g)){const value=Number(match[1]);if(value>=0&&value<=200)return value}return null}
function classify(post,user,now=Date.now()){
 const raw=String(post?.note_tweet?.text||post?.text||'').slice(0,25000),text=clean(raw),account=Object.keys(ACCOUNTS).find(name=>name.toLowerCase()===String(user?.username||'').toLowerCase()),config=ACCOUNTS[account];if(!config||!/^\d{1,25}$/.test(String(post?.id||'')))return null;
 let kind='';if(SIGNALS.reset.test(raw)&&!(/password|credential|パスワード|認証/i.test(raw))&&(SIGNALS.usage.test(raw)||/\bCodex\b/i.test(raw)||account==='thsottiaux'&&(/\bglobal\s+reset\b/i.test(raw)||/^Day\s+\d{1,3}\s*\/\s*Reset[.!\s]*$/i.test(raw))))kind='reset';else if(SIGNALS.recovery.test(raw)&&SIGNALS.usage.test(raw))kind='recovery';else if(SIGNALS.usage.test(raw))kind='usage';else return null;
 const currentPower=null,severity=kind==='reset'||kind==='usage'?'warning':'info';
 return {id:String(post.id),provider:config.provider,kind,severity,account:`@${account}${config.role==='staff'?' · OpenAI staff':' · official'}`,title:kind==='reset'?'Usage reset update':kind==='recovery'?'Usage recovery update':'Usage-limit update',summary:text,url:`https://x.com/${account}/status/${post.id}`,publishedAt:Date.parse(post.created_at)||null,detectedAt:now,currentPower};
}
async function readFeed(env){const value=await env.INTELLIGENCE_CACHE?.get('feed','json');return value&&Array.isArray(value.alerts)?value:{status:'unconfigured',checkedAt:0,alerts:[]}}
async function refresh(env){
 if(!env.X_BEARER_TOKEN||!env.INTELLIGENCE_CACHE)return {status:'unconfigured',checkedAt:Date.now(),alerts:[]};
 const endpoint=new URL('https://api.x.com/2/tweets/search/recent');endpoint.searchParams.set('query',QUERY);endpoint.searchParams.set('max_results','100');endpoint.searchParams.set('tweet.fields','created_at,author_id,note_tweet');endpoint.searchParams.set('expansions','author_id');endpoint.searchParams.set('user.fields','username,name,verified_type');
 const prior=await readFeed(env),merged=new Map(prior.alerts.map(row=>[row.id,row])),cursor=await env.INTELLIGENCE_CACHE.get('cursor');
 if(/^\d{1,25}$/.test(String(cursor||'')))endpoint.searchParams.set('since_id',cursor);else endpoint.searchParams.set('start_time',new Date(Date.now()-86400000).toISOString());
 let newest=/^\d{1,25}$/.test(String(cursor||''))?String(cursor):'';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 let next='',pages=0;
 try{do{
  if(next)endpoint.searchParams.set('next_token',next);
  const response=await fetch(endpoint,{signal:controller.signal,redirect:'error',headers:{authorization:`Bearer ${env.X_BEARER_TOKEN}`,accept:'application/json'}});
  if(!response.ok)throw Error('X API request failed');
  if(Number(response.headers.get('content-length'))>3000000)throw Error('X response too large');
  const reader=response.body.getReader(),chunks=[];let size=0;
  try{while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>3000000)throw Error('X response too large');chunks.push(part.value);}}finally{await reader.cancel().catch(()=>{});}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  const body=JSON.parse(new TextDecoder().decode(bytes));
  if(body.errors?.length||!body.meta||!Number.isInteger(body.meta.result_count)||body.meta.result_count<0||body.meta.result_count>100||body.meta.result_count!==((body.data||[]).length)||body.data&&!Array.isArray(body.data)||body.includes?.users&&!Array.isArray(body.includes.users))throw Error('Invalid X response');
  const users=new Map((body.includes?.users||[]).map(user=>[String(user.id),user]));
  for(const post of body.data||[]){if(!/^\d{1,25}$/.test(String(post.id||''))||!users.has(String(post.author_id))||typeof post.text!=='string')throw Error('Incomplete X post metadata');if(!newest||BigInt(post.id)>BigInt(newest))newest=String(post.id);const row=classify(post,users.get(String(post.author_id)));if(row&&!merged.has(row.id))merged.set(row.id,row);}
  next=body.meta.next_token||'';if(typeof next!=='string'||next.length>2048)throw Error('Invalid X cursor');
  if(++pages>=4&&next)throw Error('Incomplete X coverage');
 }while(next);}finally{clearTimeout(timer);}
 const feed={status:'ready',checkedAt:Date.now(),alerts:[...merged.values()].sort((a,b)=>b.publishedAt-a.publishedAt).slice(0,50)};await env.INTELLIGENCE_CACHE.put('feed',JSON.stringify(feed),{expirationTtl:604800});if(newest)await env.INTELLIGENCE_CACHE.put('cursor',newest,{expirationTtl:604800});return feed;
}
function json(body,status=200,origin=''){const headers={'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=30, stale-while-revalidate=90','x-content-type-options':'nosniff'};if(['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site','https://aimon.ntus.info'].includes(origin))headers['access-control-allow-origin']=origin;return new Response(JSON.stringify(body),{status,headers})}
export default {
 async scheduled(_event,env,ctx){ctx.waitUntil(refresh(env).catch(async()=>{const prior=await readFeed(env);await env.INTELLIGENCE_CACHE?.put('feed',JSON.stringify({...prior,status:'unavailable',checkedAt:Date.now()}),{expirationTtl:604800})}))},
 async fetch(request,env,ctx){const url=new URL(request.url);if(!['/api/intelligence','/api/intelligence.json'].includes(url.pathname))return new Response('Not found',{status:404});let feed=await readFeed(env);if(!feed.checkedAt||Date.now()-feed.checkedAt>90000)ctx.waitUntil(refresh(env).catch(()=>{}));if(feed.status==='ready'&&Date.now()-feed.checkedAt>125000)feed={...feed,status:'unavailable'};return json(feed,200,request.headers.get('origin')||'')}
};
export {ACCOUNTS,QUERY,SIGNALS,power,classify,refresh};
