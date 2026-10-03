const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=file=>fs.readFileSync(file,'utf8');

test('公式障害情報は1分ごとに確認し10分へ戻さない',()=>{
 const background=read('extension/background.js');
 assert(background.includes("chrome.alarms.create('llms-provider-status',{periodInMinutes:1})"));
 assert(!background.includes("'llms-provider-status',{periodInMinutes:10}"));
});

test('Claude週間枠とクラウドセッションクレジットにセッション区切りを描く',()=>{
 const shared=read('extension/shared.js');
 assert(shared.includes("id==='claude'&&e.label==='クラウドセッションクレジット'"));
 assert(shared.includes("extra-track${cloudGuide?' weekly-track':''}"));
 assert(shared.includes("Math.max(id==='claude'?8:4"));
});

test('変化音の再生要求を完了してから新しい値を公開する',()=>{
 const background=read('extension/background.js');
 const start=background.indexOf('async function accept');
 const end=background.indexOf('function timebox',start);
 const accept=background.slice(start,end);
 assert(accept.indexOf("await (typeof notify==='function'?notify(level):playChangeSound(level))")<accept.indexOf('data[id]=next'));
 assert(background.includes('playChangeSound(bestLevel)'));
 assert(background.includes('setTimeout(()=>resolve(playChangeSound(bestLevel)),180)'));
});
