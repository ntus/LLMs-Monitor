/* Public intelligence and bounded provider notices share the existing connection row. */
(function(root){
 const HELP_ID='connection-public-help';
 function help(row,language='en'){
  const I=root.GlanceIntelligence,url=I.safeUrl(row?.url);if(!url||!row?.profileUrl)return null;
  const ja=language==='ja',label=ja?'投稿の詳細・取得条件':'Post details and reading conditions';
  const conditions=ja?'表示済みの本人公開投稿と確認できた補足のみを読み取ります。未表示の新着投稿は自動巡回・再読込しません。告知は個人の残量回復を保証しません。':'Reads rendered public author posts and verified replies only. Unseen new posts are not crawled or reloaded automatically. Announcements do not confirm personal quota recovery.';
  const text=String(row.title||row.text||'').slice(0,2400),escape=I.escape||((value)=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  return {title:label+' · '+text+' · '+conditions,trigger:`<button type="button" class="connection-help" data-connection-help popovertarget="${HELP_ID}" title="${escape(label+' · '+text+' · '+conditions)}" aria-label="${escape(label)}">ⓘ</button>`,body:`<h2>${escape(row.label)} · ${escape(label)}</h2><p>${escape(text)}</p><p>${escape(conditions)}</p><a href="${url}" target="_blank" rel="noopener noreferrer">${ja?'出典の投稿を確認 ↗':'Open source post ↗'}</a><button type="button" popovertarget="${HELP_ID}" popovertargetaction="hide">${ja?'閉じる':'Close'}</button>`};
 }
 function messages(data,feed,language,visible=['chatgpt','claude','gemini']){
  const I=root.GlanceIntelligence,ja=language==='ja',rows=[];
  for(const id of visible){const text=data?.[id]?.providerNotice;if(text)rows.push({id:'notice:'+id,label:id==='claude'?'Claude':id==='gemini'?'Gemini':'ChatGPT',text:String(text).slice(0,280),title:(ja?'確認 ':'Checked ')+I.stamp(data[id].capturedAt,language)+' · '+String(text).slice(0,280),url:({chatgpt:'https://chatgpt.com/settings/usage?tab=overview',claude:'https://claude.ai/settings/usage',gemini:'https://gemini.google.com/usage'})[id],warning:true});}
  const f=I.visibleFeed(feed),mark=I.tiboDetails(f,language),selected=[];
  for(const provider of ['openai','anthropic','google']){const row=f.alerts.find(a=>a.provider===provider);if(row)selected.push(row)}
  for(const row of selected){const tibo=/^@thsottiaux(?: · OpenAI staff)?$/.test(row.account),dated=tibo&&row.url===mark?.url?mark:null;
   rows.push({id:'post:'+row.id,isNew:I.isNew(row.url),label:(I.isNew(row.url)?(ja?'新着 · ':'NEW · '):'')+(tibo?(dated?'⚠︎ Tibo 𝕏':'Tibo 𝕏'):(row.account||row.provider)),profileUrl:tibo?'https://x.com/thsottiaux':/^@ClaudeDevs(?: ·.*)?$/.test(row.account)?'https://x.com/ClaudeDevs':null,text:(ja?'投稿 ':'Posted ')+I.stamp(row.publishedAt,language)+' · '+(dated?.label||[row.title,row.summary].filter(Boolean).join(' · ').slice(0,360)),url:dated?.url||row.url,title:dated?.title||I.details(row,language,f.checkedAt),warning:!!dated});
  }
  return rows;
 }
 root.GlanceConnectionFeed={messages,help,HELP_ID};if(typeof module!=='undefined')module.exports=root.GlanceConnectionFeed;
})(globalThis);
