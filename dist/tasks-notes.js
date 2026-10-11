/* User-authored handoffs only. Isolated from provider observations, usage storage and RPC. */
(function(root){
 'use strict';
 const KEY='llms-task-notes-v1',MAX_BYTES=1048576,MAX_NOTES=500;
 const clean=(v,n)=>typeof v==='string'?v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').slice(0,n).trim():'';
 function validate(v){
  if(!v||!root.LLMTaskModel.SERVICES.includes(v.service)||!root.LLMTaskModel.noteURL(v.url,v.service))throw Error('note route');
  const workspace=clean(v.workspace,80);if(!workspace)throw Error('workspace');
  const title=clean(v.title,200);if(!title)throw Error('title');
  return {service:v.service,url:v.url,workspace,title,phase:['working','review','blocked','done'].includes(v.phase)?v.phase:'working',purpose:clean(v.purpose,2000),current:clean(v.current,4000),next:clean(v.next,2000),waiting:clean(v.waiting,2000),cautions:clean(v.cautions,2000),checklist:(Array.isArray(v.checklist)?v.checklist:[]).slice(0,50).map(x=>({text:clean(x.text,300),done:x.done===true})).filter(x=>x.text),updatedAt:typeof v.updatedAt==='string'&&Number.isFinite(Date.parse(v.updatedAt))?v.updatedAt:null,revision:Number.isSafeInteger(v.revision)&&v.revision>=0?v.revision:0};
 }
 const key=v=>JSON.stringify([v.service,v.workspace,v.url]);
 function decode(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('size');const v=JSON.parse(text);if(v?.schemaVersion!==1||!Array.isArray(v.notes)||v.notes.length>MAX_NOTES)throw Error('schema');const notes=v.notes.map(validate);if(new Set(notes.map(key)).size!==notes.length)throw Error('duplicate');return notes;}
 function create(storage){
  const read=()=>{const text=storage.getItem(KEY);return text?decode(text):[]};
  const write=notes=>{const text=JSON.stringify({schemaVersion:1,notes});if(new TextEncoder().encode(text).length>MAX_BYTES||notes.length>MAX_NOTES)throw Error('size');storage.setItem(KEY,text)};
  return {all:read,get:(service,workspace,url)=>read().find(n=>key(n)===key({service,workspace,url})),save:(value,expected=0)=>{const v=validate(value),notes=read(),i=notes.findIndex(n=>key(n)===key(v)),old=i<0?null:notes[i];if((old?.revision||0)!==expected)throw Error('conflict');v.revision=expected+1;v.updatedAt=new Date().toISOString();if(i<0)notes.push(v);else notes[i]=v;write(notes);return v},remove:(v,expected)=>{const notes=read(),i=notes.findIndex(n=>key(n)===key(v));if(i<0)return;if(notes[i].revision!==expected)throw Error('conflict');notes.splice(i,1);write(notes)},export:()=>JSON.stringify({schemaVersion:1,notes:read()},null,2),import:text=>{const incoming=decode(text),notes=read();for(const n of incoming){if(notes.some(x=>key(x)===key(n)))throw Error('import conflict');notes.push({...n,revision:1})}write(notes);return incoming.length}};
 }
 function handoff(v,language='en'){
  const n=validate(v),ja=language==='ja',labels=ja?['目的','現在の状況','次の作業','確認待ち','再開時の注意']:['Purpose','Current situation','Next actions','Waiting for','Resume cautions'];
  return [`${ja?'作業引継ぎ':'Work handoff'} — ${n.title}`,`${n.service}: ${n.url}`,`${ja?'手動の作業状態':'Manual work state'}: ${n.phase}`,`${ja?'メモ更新':'Note updated'}: ${n.updatedAt||'—'}`,...['purpose','current','next','waiting','cautions'].map((k,i)=>`${labels[i]}:\n${n[k]||'—'}`),`${ja?'チェックリスト':'Checklist'}:\n${n.checklist.map(x=>`- [${x.done?'x':' '}] ${x.text}`).join('\n')||'—'}`,ja?'上記は保存された作業メモです。公式の実行状態とは別で、内容を確認してから再開してください。':'These are saved work notes, separate from observed execution state. Review before resuming.'].join('\n\n');
 }
 const api={KEY,MAX_BYTES,MAX_NOTES,validate,key,decode,create,handoff};root.LLMTaskNotes=Object.freeze(api);if(typeof module!=='undefined')module.exports=api;
})(globalThis);
