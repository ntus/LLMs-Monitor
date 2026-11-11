// One shared clock for all changed values; suspended tabs never replay missed beats.
(function(root){
 function createNotifier({active,eventId=()=>0,alertLevel=()=> 'normal',onState=()=>{},AudioContextClass=root.AudioContext||root.webkitAudioContext,now=()=>Date.now(),schedule=setTimeout,cancel=clearTimeout}){
  let context=null,enabled=false,timer=null,volume=.18,lastEvent=0,played=0,generation=0;const oscillators=new Set();
  function tone(frequency,delay=0,duration=.22,preview=false){if((!enabled&&!preview)||context?.state!=='running')return;const t=context.currentTime+delay,osc=context.createOscillator(),gain=context.createGain();oscillators.add(osc);osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(volume,t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain);gain.connect(context.destination);osc.start(t);osc.stop(t+duration+.01);osc.onended=()=>{oscillators.delete(osc);osc.disconnect();gain.disconnect()};}
  function beep(preview=false){const level=alertLevel();if(level==='critical'){tone(660,0,.19,preview);tone(440,.23,.23,preview)}else if(level==='low'){tone(740,0,.18,preview);tone(590,.21,.18,preview)}else tone(880,0,.22,preview);}
  function tick(){timer=null;if(!enabled)return;const id=eventId();if(id!==lastEvent){lastEvent=id;played=0}if(active(now())&&played<3){beep();played++}timer=schedule(tick,1000-now()%1000);}
  async function enable(){if(!AudioContextClass)throw Error('このブラウザは通知音に対応していません');const id=generation;context??=new AudioContextClass();await context.resume();if(id!==generation)return;if(context.state!=='running')throw Error('通知音を有効にできませんでした。もう一度クリックしてください');enabled=true;context.onstatechange=()=>onState(enabled&&context.state==='running');onState(true);cancel(timer);timer=schedule(tick,1000-now()%1000);}
  function disable(){generation++;enabled=false;cancel(timer);timer=null;for(const osc of oscillators)try{osc.stop()}catch{}oscillators.clear();onState(false);}
  function isEnabled(){return enabled&&context?.state==='running';}
  function setVolume(v){volume=Math.min(.5,Math.max(.01,Number(v)||.18));}
  async function test(){if(!AudioContextClass)throw Error('このブラウザは通知音に対応していません');const id=generation;context??=new AudioContextClass();await context.resume();if(id===generation)beep(true);}
  return {enable,disable,isEnabled,setVolume,test};
 }
 root.GlanceSound={createNotifier};if(typeof module!=='undefined')module.exports=root.GlanceSound;
})(globalThis);
