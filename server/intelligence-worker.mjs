const ACCOUNTS={
 OpenAI:{provider:'openai',role:'official'},OpenAIDevs:{provider:'openai',role:'official'},ChatGPTapp:{provider:'openai',role:'official'},OpenAINewsroom:{provider:'openai',role:'official'},
 thsottiaux:{provider:'openai',role:'staff'},AnthropicAI:{provider:'anthropic',role:'official'},claudeai:{provider:'anthropic',role:'official'},GoogleAI:{provider:'google',role:'official'},GeminiApp:{provider:'google',role:'official'},
 bridgemindai:{provider:'bridgebench',role:'independent'},bridgebench:{provider:'bridgebench',role:'independent'}
};
const QUERY=`(${Object.keys(ACCOUNTS).map(name=>`from:${name}`).join(' OR ')}) -is:retweet`;
const SIGNALS={reset:/\breset(?:s|ting)?\b|リセット|refresh(?:ed)?\s+(?:the\s+)?(?:limit|quota)/i,usage:/usage\s+(?:limit|cap|quota)|rate\s*limit|token\s+(?:limit|cap|quota)|credit(?:s)?|利用(?:量|枠|上限)|上限|クレジット|quota|allowance/i,nerf:/\bnerf(?:ed|ing)?\b|nerf\s*bench|launch\s+power|model\s+power|性能(?:低下|劣化)/i,recovery:/\brecover(?:ed|y)?\b|restor(?:ed|ing)|復旧|回復/i};
const clean=value=>String(value??'').replace(/\s+/g,' ').trim().slice(0,360);
function power(text){for(const match of String(text).matchAll(/(\d{2,3}(?:\.\d+)?)\s*%/g)){const value=Number(match[1]);if(value>=0&&value<=200)return value}return null}
function classify(post,user,now=Date.now()){
 const text=clean(post.text),account=String(user?.username||''),config=ACCOUNTS[account];if(!config)return null;
 let kind='';if(config.provider==='bridgebench'&&SIGNALS.nerf.test(text))kind='nerf';else if(SIGNALS.reset.test(text))kind='reset';else if(SIGNALS.usage.test(text))kind='usage';else if(SIGNALS.recovery.test(text)&&(SIGNALS.usage.test(text)||SIGNALS.nerf.test(text)))kind='recovery';else return null;
 const currentPower=kind==='nerf'?power(text):null,severity=kind==='nerf'&&currentPower!==null&&currentPower<90?'critical':kind==='nerf'||kind==='reset'||kind==='usage'?'warning':'info';
 return {id:String(post.id),provider:config.provider,kind,severity,account:`@${account}${config.role==='staff'?' · OpenAI staff':config.role==='independent'?' · independent benchmark':' · official'}`,title:kind==='nerf'?'NerfBench model-power update':kind==='reset'?'Usage reset update':'Usage-limit update',summary:text,url:`https://x.com/${account}/status/${post.id}`,publishedAt:Date.parse(post.created_at)||now,detectedAt:now,currentPower};
}
async function readFeed(env){const value=await env.INTELLIGENCE_CACHE?.get('feed','json');return value&&Array.isArray(value.alerts)?value:{status:'unconfigured',checkedAt:0,alerts:[]}}
async function refresh(env){
 if(!env.X_BEARER_TOKEN||!env.INTELLIGENCE_CACHE)return {status:'unconfigured',checkedAt:Date.now(),alerts:[]};
 const endpoint=new URL('https://api.x.com/2/tweets/search/recent');endpoint.searchParams.set('query',QUERY);endpoint.searchParams.set('max_results','100');endpoint.searchParams.set('tweet.fields','created_at,author_id');endpoint.searchParams.set('expansions','author_id');endpoint.searchParams.set('user.fields','username,name,verified_type');
 const response=await fetch(endpoint,{headers:{authorization:`Bearer ${env.X_BEARER_TOKEN}`,accept:'application/json'}});if(!response.ok)throw Error(`X API ${response.status}`);
 const body=await response.json(),users=new Map((body.includes?.users||[]).map(user=>[String(user.id),user])),prior=await readFeed(env),merged=new Map(prior.alerts.map(row=>[row.id,row]));
 for(const post of body.data||[]){const row=classify(post,users.get(String(post.author_id)));if(row)merged.set(row.id,row)}
 const feed={status:'ready',checkedAt:Date.now(),alerts:[...merged.values()].sort((a,b)=>b.publishedAt-a.publishedAt).slice(0,50)};await env.INTELLIGENCE_CACHE.put('feed',JSON.stringify(feed),{expirationTtl:604800});return feed;
}
function json(body,status=200,origin=''){const headers={'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=30, stale-while-revalidate=90','x-content-type-options':'nosniff'};if(['https://llmsmonitor.ntusnog.chatgpt.site','https://aimon.ntus.info'].includes(origin))headers['access-control-allow-origin']=origin;return new Response(JSON.stringify(body),{status,headers})}
export default {
 async scheduled(_event,env,ctx){ctx.waitUntil(refresh(env).catch(async()=>{const prior=await readFeed(env);await env.INTELLIGENCE_CACHE?.put('feed',JSON.stringify({...prior,status:'unavailable',checkedAt:Date.now()}),{expirationTtl:604800})}))},
 async fetch(request,env,ctx){const url=new URL(request.url);if(!['/api/intelligence','/api/intelligence.json'].includes(url.pathname))return new Response('Not found',{status:404});let feed=await readFeed(env);if(!feed.checkedAt||Date.now()-feed.checkedAt>90000)ctx.waitUntil(refresh(env).catch(()=>{}));return json(feed,200,request.headers.get('origin')||'')}
};
export {ACCOUNTS,QUERY,SIGNALS,power,classify};
