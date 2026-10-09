/* Web-only launcher: deliberately independent of quota/RPC/floating modules. */
(()=>{
 'use strict';
 const services=['chatgpt','claude','gemini'];
 function target(service){const url=new URL('tasks.html',location.href);url.searchParams.set('service',service);url.searchParams.set('lang',document.documentElement.lang.startsWith('ja')?'ja':'en');url.searchParams.set('theme',document.documentElement.dataset.theme==='standard'?'standard':'dark');return url.href}
 function mount(){const cards=document.getElementById('cards');if(!cards)return;
  for(const card of cards.querySelectorAll('.card')){const usage=card.querySelector('.card-bottom button[data-service]'),service=usage?.dataset.service;if(!services.includes(service))continue;
   let link=card.querySelector('.task-details-link');if(!link){link=document.createElement('a');link.className='task-details-link';link.dataset.taskService=service;link.target='_blank';link.rel='noopener noreferrer';
    const actions=document.createElement('div');actions.className='task-launch-actions';usage.before(actions);actions.append(link,usage)}
   link.href=target(service);link.textContent=document.documentElement.lang.startsWith('ja')?'タスク詳細':'Task details';link.setAttribute('aria-label',`${service==='chatgpt'?'ChatGPT':service==='claude'?'Claude':'Gemini'} ${link.textContent}`);
  }
 }
 function init(){mount();const cards=document.getElementById('cards');if(cards)new MutationObserver(mount).observe(cards,{childList:true});new MutationObserver(mount).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-theme']});
  document.addEventListener('click',e=>{const link=e.target.closest('.task-details-link');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
   link.href=target(link.dataset.taskService);try{const child=window.open(link.href,'_blank','popup=yes,width=420,height=780,resizable=yes,scrollbars=yes');if(child){child.opener=null;e.preventDefault()}}catch{/* The ordinary safe anchor remains available if popup opening fails. */}
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
