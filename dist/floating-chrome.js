(function(root){
 const L=root.GlanceLocale;
 const text=(ja,en)=>L.language()==='ja'?ja:en;
 function fitTitle(node){
  node.style.fontSize='14px';
  // Measure the actual localized title; viewport width alone cannot predict its fit.
  for(let size=14;size>6&&node.scrollWidth>node.clientWidth;size-=.5)node.style.fontSize=`${size-.5}px`;
 }
 function mount(win,pinned=false){
  const doc=win.document,header=doc.createElement('header');header.className='floating-header';
  const title=doc.createElement('strong');title.className='floating-title';
  const details=doc.createElement('details');details.className='floating-size';
  const summary=doc.createElement('summary');summary.textContent='↔';details.append(summary);
  const controls=doc.createElement('div');controls.className='floating-size-controls';
  const buttons=[[0,120,'高さ＋','Taller'],[0,-120,'高さ−','Shorter'],[60,0,'幅＋','Wider'],[-60,0,'幅−','Narrower']].map(([x,y,ja,en])=>{
   const button=doc.createElement('button');button.type='button';button.onclick=()=>{try{win.resizeBy(x,y)}catch{}paintSize()};controls.append(button);return {button,ja,en};
  });
  const size=doc.createElement('output');size.setAttribute('aria-live','polite');controls.append(size);details.append(controls);header.append(title,details);doc.body.prepend(header);
  function paintSize(){size.textContent=`${win.innerWidth} × ${win.innerHeight}`;fitTitle(title)}
  function update(){doc.title=L.t('appTitle');title.textContent=L.t('appTitle');title.title=L.t('appTitle');title.dataset.pinned=String(pinned);summary.title=text('外枠をドラッグ／サイズ調整','Drag the window edge / Resize');summary.setAttribute('aria-label',summary.title);for(const {button,ja,en}of buttons)button.textContent=text(ja,en);size.title=text('実際の表示サイズ。上限はブラウザ・OSが決定します','Actual viewport size. Browser and OS bounds apply');paintSize()}
  win.addEventListener('resize',paintSize);win.addEventListener('pagehide',()=>win.removeEventListener('resize',paintSize),{once:true});update();return {update,header};
 }
 root.GlanceFloatingChrome={mount,fitTitle};
 if(typeof module!=='undefined')module.exports=root.GlanceFloatingChrome;
})(globalThis);
