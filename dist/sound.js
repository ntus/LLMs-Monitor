// One shared clock for all changed values; suspended tabs never replay missed beats.
(function(root){
 function createNotifier({active,onState=()=>{},AudioContextClass=root.AudioContext||root.webkitAudioContext,now=()=>Date.now(),schedule=setTimeout,cancel=clearTimeout}){
  let context=null,enabled=false,timer=null;
  function beep(){if(!enabled||context?.state!=='running')return;const t=context.currentTime,osc=context.createOscillator(),gain=context.createGain();osc.type='sine';osc.frequency.value=880;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.035,t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+.075);osc.connect(gain);gain.connect(context.destination);osc.start(t);osc.stop(t+.08);osc.onended=()=>{osc.disconnect();gain.disconnect()};}
  function tick(){timer=null;if(!enabled)return;if(active(now()))beep();timer=schedule(tick,1000-now()%1000);}
  async function enable(){if(!AudioContextClass)throw Error('このブラウザは通知音に対応していません');context??=new AudioContextClass();await context.resume();if(context.state!=='running')throw Error('通知音を有効にできませんでした。もう一度クリックしてください');enabled=true;context.onstatechange=()=>onState(enabled&&context.state==='running');onState(true);beep();cancel(timer);timer=schedule(tick,1000-now()%1000);}
  function disable(){enabled=false;cancel(timer);timer=null;onState(false);}
  function isEnabled(){return enabled&&context?.state==='running';}
  return {enable,disable,isEnabled};
 }
 root.GlanceSound={createNotifier};if(typeof module!=='undefined')module.exports=root.GlanceSound;
})(globalThis);
