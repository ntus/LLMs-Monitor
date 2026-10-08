const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const approved=['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site'];

function background(){
 const stored={data:{claude:{status:'ready',windows:[{label:'現在のセッション',remaining:98}]}},history:{claude:{session:[{at:1,remaining:98}]}},settings:{language:'ja'},historyVersion:1};
 let external;
 const event=()=>({addListener(){}});
 const chrome={runtime:{getURL:name=>'chrome-extension://'+'a'.repeat(32)+'/'+name,getManifest:()=>({version:'1.23.0'}),onMessage:event(),onMessageExternal:{addListener(fn){external=fn}},onInstalled:event(),onStartup:event()},
  action:{onClicked:event()},alarms:{onAlarm:event()},tabs:{onRemoved:event()},windows:{onRemoved:event()},notifications:{onClicked:event()},i18n:{getUILanguage:()=> 'ja'},
  storage:{local:{get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,structuredClone(stored[k])])),set:async values=>Object.assign(stored,structuredClone(values))}}};
 const context=vm.createContext({chrome,URL,setTimeout,clearTimeout,AbortController,console});
 context.importScripts=(...files)=>{for(const file of files)vm.runInContext(fs.readFileSync(path.join(root,'extension',file),'utf8'),context,{filename:file})};
 vm.runInContext(fs.readFileSync(path.join(root,'extension/background.js'),'utf8'),context);
 return {stored,send:(url,message)=>new Promise(resolve=>{assert.equal(external(message,{url,tab:{id:1}},resolve),true)})};
}

test('both published monitor origins connect through the real external message handler without losing history',async()=>{
 const b=background(),history=structuredClone(b.stored.history);
 for(const origin of approved){
  const result=await b.send(origin+'/?v=1230',{type:'GET'});
  assert.equal(result.error,undefined);
  assert.equal(result.extensionVersion,'1.23.0');
  assert.equal(result.data.claude.windows[0].remaining,98);
  assert.deepEqual(b.stored.history,history);
  assert(!('diagnostics' in result));
  const changed=await b.send(origin+'/index.html',{type:'SETTINGS',settings:{language:'en',enabled:true}});
  assert.equal(changed.ok,true);
  assert.equal(b.stored.settings.language,'en');
 }
});

test('unapproved origins cannot read private usage or change settings',async()=>{
 const b=background(),before=structuredClone(b.stored);
 const urls=['http://llmsmonitor.ntus.info/','https://llmsmonitor.ntus.info.evil.test/','https://other.ntus.info/','https://llmsmonitor.ntus.info:8443/','https://llmsmonitor.ntus.info@evil.test/','http://localhost:4173/','https://unrelated.chatgpt.site/','invalid URL'];
 for(const url of urls)for(const message of [{type:'GET'},{type:'SETTINGS',settings:{language:'en'}}])assert.match((await b.send(url,message)).error,/許可されていません/);
 assert.deepEqual(b.stored,before);
});

test('manifest, runtime allowlist, canonical links and intelligence endpoint agree on the exact approved origins',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'extension/manifest.json')));
 const ledger=JSON.parse(fs.readFileSync(path.join(root,'spec/requirements.json')));
 assert.deepEqual(manifest.externally_connectable.matches,approved.map(origin=>origin+'/*'));
 assert.deepEqual(ledger.product.companion_origins,approved);
 assert.equal(ledger.product.production_companion_origin,approved[0]);
 for(const origin of approved)assert(manifest.host_permissions.includes(origin+'/*'));
 assert(fs.readFileSync(path.join(root,'extension/intelligence.js'),'utf8').includes(approved[0]+'/api/intelligence.json'));
 assert(fs.readFileSync(path.join(root,'dist/index.html'),'utf8').includes(approved[0]+'/product.html'));
});
