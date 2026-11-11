/* Local ZIP packaging only. Exact runtime ID; no server requests or host access. */
(function(root){
 'use strict';
 const encoder=new TextEncoder();
 function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0;}
 function zip(files){
  if(!Array.isArray(files)||files.length<1||files.length>8)throw Error('Invalid helper files');
  const chunks=[],central=[];let offset=0,centralSize=0;const seen=new Set();
  for(const f of files){if(!/^[a-zA-Z0-9_.-]{1,80}$/.test(f.name)||seen.has(f.name))throw Error('Invalid helper filename');seen.add(f.name);const name=encoder.encode(f.name),data=typeof f.data==='string'?encoder.encode(f.data):f.data;if(!(data instanceof Uint8Array)||data.length>200000)throw Error('Invalid helper content');const crc=crc32(data),header=new Uint8Array(30+name.length),v=new DataView(header.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x0800,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);header.set(name,30);chunks.push(header,data);
   const c=new Uint8Array(46+name.length),cv=new DataView(c.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,0x0314,true);cv.setUint16(6,20,true);cv.setUint16(8,0x0800,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,name.length,true);cv.setUint32(38,((f.name==='Install.command'?0o100755:0o100644)<<16)>>>0,true);cv.setUint32(42,offset,true);c.set(name,46);central.push(c);centralSize+=c.length;offset+=header.length+data.length;
  }
  const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);const out=new Uint8Array(offset+centralSize+22);let p=0;for(const b of [...chunks,...central,end]){out.set(b,p);p+=b.length;}return out;
 }
 function personal(files,id){if(!/^[a-p]{32}$/.test(id))throw Error('Invalid extension ID');return zip([...files,{name:'extension-id.json',data:JSON.stringify({extension_id:id})+'\n'}]);}
 root.LLMHelperPackage={zip,personal,crc32};if(typeof module!=='undefined')module.exports=root.LLMHelperPackage;
})(globalThis);
