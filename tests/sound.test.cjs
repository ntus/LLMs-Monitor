const {test}=require('node:test');const assert=require('node:assert/strict');const {createNotifier}=require('../dist/sound.js');const {createTracker}=require('../dist/changes.js');
test('同時に変わった複数の数値は1秒に1音、10秒後に停止、同値取得で延長しない',async()=>{
 let time=0,task=null,tones=0;
 class Audio {state='running';currentTime=0;destination={};async resume(){}createOscillator(){return {frequency:{},connect(){},start(){tones++},stop(){},disconnect(){}}}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}}
 const tracker=createTracker(),n=createNotifier({active:t=>tracker.active(t),AudioContextClass:Audio,now:()=>time,schedule:(fn,delay)=>{task={fn,at:time+delay};return task},cancel:t=>{if(task===t)task=null}});
 tracker.observe('claude','session','90%',0);tracker.observe('gemini','session','70%',0);await n.enable();assert.equal(tones,1); // Explicit enablement previews the quiet tone.
 time=900;tracker.observe('claude','session','85%',time);tracker.observe('gemini','session','60%',time);
 for(let second=1;second<=10;second++){time=second*1000;assert.equal(task.at,time);task.fn();if(second===5)tracker.observe('claude','session','85%',time)}
 assert.equal(tones,11);time=11000;task.fn();assert.equal(tones,11);n.disable();assert.equal(task,null);assert.equal(n.isEnabled(),false);
});
test('音声を有効にする前は再生せず、非対応ブラウザは説明できるエラー',async()=>{const n=createNotifier({active:()=>true,AudioContextClass:null});assert.equal(n.isEnabled(),false);await assert.rejects(n.enable(),/通知音に対応/);});
