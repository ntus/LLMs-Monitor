/* Public intelligence and bounded provider notices share the existing connection row. */
(function(root){
 function messages(data,feed,language,visible=['chatgpt','claude','gemini']){
  const I=root.GlanceIntelligence,ja=language==='ja',rows=[];
  for(const id of visible){const text=data?.[id]?.providerNotice;if(text)rows.push({id:'notice:'+id,label:id==='claude'?'Claude':id==='gemini'?'Gemini':'ChatGPT',text:String(text).slice(0,280),warning:true});}
  const f=I.normalize(feed),mark=I.tiboDetails(f,language),row=f.alerts.find(a=>mark&&a.url===mark.url)||f.alerts[0],tibo=!!row&&/^@thsottiaux(?: · OpenAI staff)?$/.test(row.account);
  if(row)rows.push({id:'tibo:'+row.id,label:tibo?(mark?'⚠︎ Tibo 𝕏':'Tibo 𝕏'):(row.account||row.provider),text:mark?.label||[row.title,row.summary].filter(Boolean).join(' · ').slice(0,360),url:mark?.url||row.url,title:mark?.title||row.summary,warning:!!mark});
  return rows;
 }
 root.GlanceConnectionFeed={messages};if(typeof module!=='undefined')module.exports=root.GlanceConnectionFeed;
})(globalThis);
