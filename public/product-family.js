/* User-opened navigation drawer. Native dialog manages focus and Escape. */
(()=>{
 const dialog=document.getElementById('product-family-dialog');
 const open=document.getElementById('product-family-open');
 const close=document.getElementById('product-family-close');
 if(!dialog||!open||!close)return;
 open.addEventListener('click',()=>{if(!dialog.open)dialog.showModal();});
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
 for(const action of dialog.querySelectorAll('a,#gateway-open,#gateway-link'))action.addEventListener('click',()=>dialog.close());
})();
