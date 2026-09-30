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
 assert.equal(ledger.product.package_filename,`LLMs-Monitor-v${version}.zip`);
 for(const file of ['dist/index.html','dist/shared.js','SPECIFICATION.md','STORE_SUBMISSION.md'])assert(read(file).includes(version),`${file} の版番号が未同期です`);
 assert(read('dist/index.html').includes(`style-v${digits}.css`));
 assert(read('dist/index.html').includes(`shared.js?v=${digits}`));
 assert(read('dist/index.html').includes(`app.js?v=${digits}`));
 assert(fs.existsSync(path.join(root,`dist/style-v${digits}.css`)));
});

test('本番manifestの外部接続先と権限を最小範囲に保つ',()=>{
 const manifest=JSON.parse(read('extension/manifest.json'));
 assert.deepEqual(manifest.externally_connectable.matches,['https://ai-usage-glance.ntusnog.chatgpt.site/*']);
 assert.deepEqual(manifest.permissions,['storage','alarms','offscreen','notifications']);
 assert(!JSON.stringify(manifest).includes('localhost'));
 assert(!JSON.stringify(manifest).includes('127.0.0.1'));
 assert(manifest.host_permissions.includes('https://one.google.com/*'));
});

test('フルスクリーンでも履歴を隠さず長期履歴ステータスを表示する',()=>{
 const css=read('dist/style-v151.css')+read(`dist/style-v${ledger.product.version.replaceAll('.','')}.css`),html=read('dist/index.html');
 assert(!css.includes('html:fullscreen .card-note,html:fullscreen .history{display:none'));
 assert(css.includes('html:fullscreen .history{display:flex!important'));
 assert(html.includes('id="history-status"'));
});

test('公開画面とインストール済み拡張機能の版違いを通知する',()=>{
 const background=read('extension/background.js'),app=read('extension/app.js'),locale=read('extension/locale.js');
 assert(background.includes('extensionVersion:chrome.runtime.getManifest().version'));
 assert(app.includes("L.t('versionUpdate')"));
 assert(locale.includes("versionUpdate:'拡張機能の更新が必要'"));
 assert(locale.includes("versionUpdate:'Extension update required'"));
 assert(app.includes('extensionVersion!==G.APP_VERSION'));
});

test('日英切替とフローティング同期・透明度を全表示面へ実装する',()=>{
 const html=read('extension/index.html'),manifest=JSON.parse(read('extension/manifest.json')),background=read('extension/background.js'),floating=read('extension/floating.js'),css=read('extension/style-v152.css');
 assert(html.includes('id="language-toggle"'));
 assert(manifest.content_scripts[0].js.includes('locale.js'));
 assert(background.includes("message.type==='MONITOR_READY'"));
 assert(background.includes("message.type==='MONITOR_CLOSED'"));
 assert(background.includes('width:180'));
 assert(floating.includes("document.title=GlanceLocale.t('appTitle')"));
 assert(floating.includes("document.body.style.setProperty('--alpha',alpha)"));
 assert(css.includes('.floating-body .widget .history-log'));
 assert(css.includes('html:fullscreen .card h2{font-size:21px}'));
});
