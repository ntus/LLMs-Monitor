const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const read=name=>readFileSync(join(__dirname,'..',name),'utf8');

test('floating and PiP have no application height cap and retain opened history across refresh',()=>{
 const css=read('extension/style-v1190.css');
 assert.match(css,/\.floating-body \.widget,\.pip-body \.widget\{max-height:none!important/);
 for(const file of ['extension/floating.js','extension/app.js','extension/content.js'])assert.match(read(file),/widget-history\[open\]/);
 assert.match(read('extension/app.js'),/style-v1190\.css/);
});

test('Claude zero verification checks the official usage page and leaves the 20:50 reset independent of weekly',()=>{
 const background=read('extension/background.js');
 assert.match(background,/ensureClaudeUsageReader/);
 assert.match(background,/closeClaudeProbeTab/);
 const state=read('extension/state.js');
 assert.match(state,/api-zero-unverified/);
 assert.match(read('extension/history.js'),/typeof w\.remaining!=='number'/);
});
