(function(root){
'use strict';
// Local draft only: no collector, credential, transport or automatic submission.
const SERVICES=Object.freeze(['chatgpt','claude','gemini','grok','muse','copilot','deepseek','perplexity','genspark']);
const ERRORS=Object.freeze(['unavailable','login-required','permission-required','loading','stale','layout','other']);
const OS=Object.freeze(['macOS','Windows','Linux','unknown']);
const VERSION=/^\d{1,3}\.\d{1,3}\.\d{1,3}$/;
function diagnostics(input={},selected=[]){
 const out={};
 if(!input||typeof input!=='object'||Array.isArray(input)||!Array.isArray(selected))return out;
 for(const key of selected){
  const value=input[key];
  if((key==='appVersion'||key==='extensionVersion')&&typeof value==='string'&&VERSION.test(value))out[key]=value;
  else if(key==='service'&&SERVICES.includes(value))out[key]=value;
  else if(key==='error'&&ERRORS.includes(value))out[key]=value;
  else if(key==='os'&&OS.includes(value))out[key]=value;
 }
 return out;
}
function preview(input,selected){
 const fields=diagnostics(input,selected);
 return ['# LLMs Monitor — support draft','',
  'Local draft only. Nothing has been sent. Review every field before sharing.',
  'No balances, account identifiers, credentials, conversation content or screenshots are collected.',
  '',...Object.entries(fields).map(([k,v])=>`- ${k}: ${v}`),'',
  '## Expected behavior','[Write manually after reviewing for private information.]','',
  '## Actual behavior / reproduction','[Write manually after reviewing for private information.]','',
  '## Screenshot','[Optional: crop/redact locally and review before attaching yourself.]',''].join('\n');
}
const api={SERVICES,ERRORS,OS,diagnostics,preview};root.GlanceSupportDraft=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
