let sequence=0,context=null;
function beep(volume,frequency=880,duration=.12){context??=new AudioContext();const oscillator=context.createOscillator(),gain=context.createGain(),now=context.currentTime;oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.01,Math.min(.5,Number(volume||18)/100)),now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);oscillator.connect(gain).connect(context.destination);oscillator.start(now);oscillator.stop(now+duration+.01);}
function changeBeat(message){if(message.level==='critical'){beep(message.volume,660,.19);setTimeout(()=>beep(message.volume,440,.23),230)}else if(message.level==='low'){beep(message.volume,740,.18);setTimeout(()=>beep(message.volume,590,.18),210)}else beep(message.volume);}
chrome.runtime.onMessage.addListener((message,_,reply)=>{
 if(!['PLAY_STATUS_ALERT','PLAY_CHANGE_SOUND'].includes(message?.type))return false;
 const id=++sequence;let cancelled=false;
 const timer=setTimeout(()=>{cancelled=true;reply({played:false})},1100);
 (async()=>{context??=new AudioContext();if(context.state==='suspended')await context.resume();if(cancelled)return;if(Number.isFinite(message.expiresAt)&&Date.now()>message.expiresAt){clearTimeout(timer);reply({played:false});return}if(id!==sequence){clearTimeout(timer);reply({played:false});return}
  if(message.type==='PLAY_CHANGE_SOUND'){changeBeat(message);[1000,2000].forEach(delay=>setTimeout(()=>{if(id===sequence)changeBeat(message)},delay));}
  else {beep(message.volume,990);setTimeout(()=>{if(id===sequence)beep(message.volume,660)},320);}
  clearTimeout(timer);reply({played:true});
 })().catch(()=>{clearTimeout(timer);if(!cancelled)reply({played:false})});return true;
});
