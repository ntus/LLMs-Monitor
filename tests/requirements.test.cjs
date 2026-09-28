const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const ledger=JSON.parse(read('spec/requirements.json'));

test('要件台帳のID・必須項目・実装証跡を機械検証する',()=>{
 const ids=ledger.requirements.map(item=>item.id);
 assert.equal(new Set(ids).size,ids.length,'要件IDが重複しています');
 for(const required of ['CHATGPT-003','CLAUDE-002','GEMINI-002','HISTORY-002','SOUND-001','FLOAT-003','ADVICE-001','DIST-001'])assert(ids.includes(required),`${required} がありません`);
 for(const item of ledger.requirements){assert(item.normative_requirement);assert(item.acceptance_criteria.length);for(const evidence of item.implementation_evidence||[])assert(fs.existsSync(path.join(root,evidence.path)),`${item.id}: ${evidence.path} がありません`);}
});

test('製品版・ZIP名・CSS・画面表示・仕様書が同期している',()=>{
 const manifest=JSON.parse(read('extension/manifest.json')),version=manifest.version,digits=version.replaceAll('.','');
 assert.equal(ledger.product.version,version);
 assert.equal(ledger.product.package_filename,`LLMs-Token-Usage-Monitor-v${version}.zip`);
 for(const file of ['dist/index.html','dist/shared.js','SPECIFICATION.md','STORE_SUBMISSION.md'])assert(read(file).includes(version),`${file} の版番号が未同期です`);
 assert(read('dist/index.html').includes(`style-v${digits}.css`));
 assert(fs.existsSync(path.join(root,`dist/style-v${digits}.css`)));
});

test('本番manifestの外部接続先と権限を最小範囲に保つ',()=>{
 const manifest=JSON.parse(read('extension/manifest.json'));
 assert.deepEqual(manifest.externally_connectable.matches,['https://ai-usage-glance.ntusnog.chatgpt.site/*']);
 assert.deepEqual(manifest.permissions,['storage','alarms','offscreen']);
 assert(!JSON.stringify(manifest).includes('localhost'));
 assert(!JSON.stringify(manifest).includes('127.0.0.1'));
});
