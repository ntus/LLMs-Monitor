/* Static manual: no usage state, account connection, analytics or periodic work. */
(()=>{
 const choose=lang=>{const ja=lang==='ja';document.documentElement.lang=lang;document.title=ja?'LLMsモニター 取扱説明書':'LLMs Monitor user guide';document.getElementById('manual-monitor').textContent=ja?'モニターを開く':'Open monitor';document.getElementById('manual-print').textContent=ja?'印刷／PDF':'Print / PDF';for(const b of document.querySelectorAll('[data-manual-lang]'))b.setAttribute('aria-pressed',String(b.dataset.manualLang===lang));globalThis.LLMProductGuide.render(lang);};
 for(const b of document.querySelectorAll('[data-manual-lang]'))b.addEventListener('click',()=>{history.replaceState(null,'','#'+b.dataset.manualLang);choose(b.dataset.manualLang);});document.getElementById('manual-print').onclick=()=>window.print();choose(location.hash==='#ja'?'ja':location.hash==='#en'?'en':navigator.language.startsWith('ja')?'ja':'en');
})();
