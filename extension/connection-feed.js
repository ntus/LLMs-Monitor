/* Public intelligence and bounded provider notices share the existing connection row. */
(function(root){
 function messages(data,feed,language,visible=['chatgpt','claude','gemini']){
  const I=root.GlanceIntelligence,ja=language==='ja',rows=[];
  for(const id of visible){const text=data?.[id]?.providerNotice;if(text)rows.push({id:'notice:'+id,label:id==='claude'?'Claude':id==='gemini'?'Gemini':'ChatGPT',text:String(text).slice(0,280),title:(ja?'確認 ':'Checked ')+I.stamp(data[id].capturedAt,language)+' · '+String(text).slice(0,280),url:({chatgpt:'https://chatgpt.com/settings/usage?tab=overview',claude:'https://claude.ai/settings/usage',gemini:'https://gemini.google.com/usage'})[id],warning:true});}
  const f=I.normalize(feed),mark=I.tiboDetails(f,language),selected=[];
  for(const provider of ['openai','anthropic','google']){const row=f.alerts.find(a=>provider==='openai'&&mark&&a.url===mark.url)||f.alerts.find(a=>a.provider===provider);if(row)selected.push(row)}
  for(const row of selected){const tibo=/^@thsottiaux(?: · OpenAI staff)?$/.test(row.account),dated=tibo?mark:null;
   rows.push({id:'post:'+row.id,label:tibo?(dated?'⚠︎ Tibo 𝕏':'Tibo 𝕏'):(row.account||row.provider),profileUrl:tibo?'https://x.com/thsottiaux':null,text:(ja?'投稿 ':'Posted ')+I.stamp(row.publishedAt,language)+' · '+(dated?.label||[row.title,row.summary].filter(Boolean).join(' · ').slice(0,360)),url:dated?.url||row.url,title:dated?.title||I.details(row,language,f.checkedAt),warning:!!dated});
  }
  return rows;
 }
 root.GlanceConnectionFeed={messages};if(typeof module!=='undefined')module.exports=root.GlanceConnectionFeed;
})(globalThis);
