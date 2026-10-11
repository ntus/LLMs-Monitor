/* Read only the chosen thread heading or exact sidebar link; never pane/body text. */
(function(root){
 const clean=v=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f\ue000-\uf8ff]/g,' ').replace(/\s+/g,' ').trim().slice(0,200):'';
 const visible=e=>e&&!e.closest('[hidden],[aria-hidden="true"]')&&e.getClientRects().length>0;
 function title(document,url,service){
  let u;try{u=new URL(url)}catch{return ''}
  if(service==='claude'&&/^\/code\/project\//.test(u.pathname)){
   const thread=u.searchParams.get('thread');if(!/^cmsg_[a-zA-Z0-9_-]+$/.test(thread||''))return '';
   const panes=[...document.querySelectorAll('[data-tile-host]')].filter(e=>e.getAttribute('data-tile-host')==='thread:'+thread&&visible(e));
   if(panes.length!==1)return '';
   const heads=[...panes[0].querySelectorAll('[data-pane-root][role="region"][aria-label][data-perf-screen="project_thread"]')].filter(visible);
   return heads.length===1?clean(heads[0].getAttribute('aria-label')):'';
  }
  const names=new Set();for(const selector of [root.LLMTaskList.SIDEBARS[service]]){for(const sidebar of document.querySelectorAll(selector)){if(!visible(sidebar))continue;for(const a of sidebar.querySelectorAll('a[href]')){if(!visible(a))continue;let href;try{href=new URL(a.getAttribute('href'),u.origin).href}catch{continue}const link=root.LLMTaskList.link(href,service);if(link?.url===url){const name=clean(a.getAttribute('title')||a.getAttribute('aria-label')||a.textContent);if(name)names.add(name)}}}}
  if(names.size===1)return [...names][0];if(names.size>1)return '';
  const name=clean(document.title).replace(/\s*[-–—|]\s*(ChatGPT|Claude(?: Code)?|Gemini)\s*$/i,'').trim();return /^(ChatGPT|Claude(?: Code)?|Gemini)$/i.test(name)?'':name;
 }
 root.LLMTaskNoteMetadata={title};if(typeof module!=='undefined')module.exports=root.LLMTaskNoteMetadata;
})(globalThis);
