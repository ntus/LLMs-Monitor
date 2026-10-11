// OFF cancels scheduled beats, oscillators and an in-flight AudioContext resume.
let sequence=0,context=null;const beats=new Set(),oscillators=new Set();
function stopNotificationSound(){sequence++;for(const timer of beats)clearTimeout(timer);beats.clear();for(const osc of oscillators)try{osc.stop()}catch{}oscillators.clear();}
function later(fn,delay,id){const timer=setTimeout(()=>{beats.delete(timer);if(id===sequence)fn()},delay);beats.add(timer);}
function beep(volume,frequency=880,duration=.12){context??=new AudioContext();const oscillator=context.createOscillator(),gain=context.createGain(),now=context.currentTime;oscillators.add(oscillator);oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.01,Math.min(.5,Number(volume||18)/100)),now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);oscillator.connect(gain).connect(context.destination);oscillator.onended=()=>{oscillators.delete(oscillator);oscillator.disconnect();gain.disconnect()};oscillator.start(now);oscillator.stop(now+duration+.01);}
function changeBeat(message,id){if(message.level==='critical'){beep(message.volume,660,.19);later(()=>beep(message.volume,440,.23),230,id)}else if(message.level==='low'){beep(message.volume,740,.18);later(()=>beep(message.volume,590,.18),210,id)}else beep(message.volume);}
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.settings?.newValue?.sound===false)stopNotificationSound()});
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
 if(sender.id!==chrome.runtime.id||sender.url&&!sender.url.startsWith(chrome.runtime.getURL('')))return false;
 if(message?.type==='STOP_NOTIFICATION_SOUND'){stopNotificationSound();reply({stopped:true});return false;}
 if(!['PLAY_STATUS_ALERT','PLAY_CHANGE_SOUND'].includes(message?.type))return false;
 const id=++sequence;let cancelled=false;
 const timer=setTimeout(()=>{cancelled=true;reply({played:false})},1100);
 (async()=>{const saved=await chrome.storage.local.get('settings');if(saved.settings?.sound===false){clearTimeout(timer);reply({played:false});return}context??=new AudioContext();if(context.state==='suspended')await context.resume();if(cancelled)return;const latest=await chrome.storage.local.get('settings');if(cancelled)return;if(latest.settings?.sound===false||id!==sequence||Number.isFinite(message.expiresAt)&&Date.now()>message.expiresAt){clearTimeout(timer);reply({played:false});return}
  if(message.type==='PLAY_CHANGE_SOUND'){changeBeat(message,id);[1000,2000].forEach(delay=>later(()=>changeBeat(message,id),delay,id));}
  else {beep(message.volume,990);later(()=>beep(message.volume,660),320,id);}
  clearTimeout(timer);reply({played:true});
 })().catch(()=>{clearTimeout(timer);if(!cancelled)reply({played:false})});return true;
});
