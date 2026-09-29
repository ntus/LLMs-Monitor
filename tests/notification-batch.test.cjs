const {test}=require('node:test');
const assert=require('node:assert/strict');
const Batch=require('../extension/notification-batch.js');

test('1回のrefreshで複数サービスが変化しても通知を1回だけ発火する',()=>{
 let calls=0;
 const results=[{status:'fulfilled',value:true},{status:'fulfilled',value:true},{status:'fulfilled',value:false}];
 assert.equal(Batch.notifyOnce(results,()=>calls++),true);
 assert.equal(calls,1);
});

test('変化なし・取得失敗だけなら通知しない',()=>{
 let calls=0;
 const results=[{status:'fulfilled',value:false},{status:'rejected',reason:Error('取得失敗')}];
 assert.equal(Batch.notifyOnce(results,()=>calls++),false);
 assert.equal(calls,0);
});
