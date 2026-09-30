(()=>{
 const marks={chatgpt:['◎','#61dbc2'],gemini:['✦','#86a7ff'],claude:['✳','#f7a27d'],deepseek:['◇','#739cff'],grok:['𝕏','#d5dae5'],perplexity:['⌕','#54c8c2'],copilot:['◫','#8f8cff'],meta:['∞','#4388ff'],poe:['◉','#b58cff'],lechat:['M','#ff9f68']};
 function enhance(){
  const header=document.querySelector('body>header');
  if(header&&!header.querySelector('.header-product-link')){const box=document.createElement('div');box.className='header-web-links';const link=document.createElement('a');link.className='header-product-link';link.href='product.html';link.textContent=(document.documentElement.lang||'').startsWith('ja')?'商品説明':'Product';box.append(link);const local=header.querySelector('.local');if(local)box.append(local);header.append(box)}
  document.querySelectorAll('.llm-directory article').forEach(article=>{if(article.querySelector('.llm-icon'))return;const key=(article.dataset.llm||article.querySelector('h3')?.textContent||'').toLowerCase().replaceAll(' ','').replace('microsoft','').replace('ai','');const found=Object.entries(marks).find(([name])=>key.includes(name));if(!found)return;const icon=document.createElement('span');icon.className='llm-icon';icon.setAttribute('aria-hidden','true');icon.style.setProperty('--icon',found[1][1]);icon.textContent=found[1][0];article.querySelector('h3')?.before(icon)});
 }
 document.addEventListener('DOMContentLoaded',enhance);new MutationObserver(enhance).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
