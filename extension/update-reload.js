/* Only a validated local updater marker can request a newer on-disk version reload. */
(function(root){
 let pending=null;
 const version=s=>typeof s==='string'&&/^\d{1,5}\.\d{1,5}\.\d{1,5}$/.test(s)?s.split('.').map(Number):null;
 function newer(a,b){a=version(a);b=version(b);if(!a||!b||a.some(n=>n>65535)||b.some(n=>n>65535))return false;for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i]}return false;}
 function check(){if(pending)return pending;pending=(async()=>{try{
  const read=async path=>{const r=await fetch(chrome.runtime.getURL(path),{cache:'no-store'});if(!r.ok)throw Error('No marker');const text=await r.text();if(text.length>100000)throw Error('Too large');return JSON.parse(text)};
  const marker=await read('llms-monitor-update-request.json');if(marker.schemaVersion!==1||!/^[a-f0-9]{32}$/.test(marker.nonce)||!newer(marker.version,chrome.runtime.getManifest().version))return false;
  const disk=await read('manifest.json'),loaded=chrome.runtime.getManifest();return disk.manifest_version===3&&disk.version===marker.version&&disk.name===loaded.name&&disk.key===loaded.key&&disk.background?.service_worker===loaded.background?.service_worker;
 }catch{return false}})().finally(()=>{pending=null});return pending;}
 root.GlanceUpdateReload={check,newer};
})(globalThis);
