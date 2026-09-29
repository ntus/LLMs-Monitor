const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');

test('human-readable documents start in English and link to a later Japanese section',()=>{
 for(const file of ['README.md','SPECIFICATION.md','AGENTS.md','PRIVACY.md','STORE_SUBMISSION.md','CHANGELOG.md','SECURITY_REVIEW.md']){
  const body=fs.readFileSync(path.join(root,file),'utf8');
  assert(body.includes('href="#en"')||body.includes('](#en)'),`${file}: EN link`);
  assert(body.includes('href="#ja"')||body.includes('](#ja)'),`${file}: JP link`);
  assert(body.indexOf('<a id="en"></a>')<body.indexOf('<a id="ja"></a>'),`${file}: English first`);
  assert(body.indexOf('<a id="ja"></a>')>body.indexOf('<a id="en"></a>')+100,`${file}: Japanese later`);
 }
 const html=fs.readFileSync(path.join(root,'extension/privacy.html'),'utf8');
 assert(html.indexOf('id="en"')<html.indexOf('id="ja"'));
 assert(html.includes('href="#en"')&&html.includes('href="#ja"'));
});
