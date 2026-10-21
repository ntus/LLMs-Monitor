const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
function fixture(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'llms-guide-build-'));try{fs.copyFileSync('build.py',path.join(dir,'build.py'));fs.mkdirSync(path.join(dir,'native'));fs.mkdirSync(path.join(dir,'dist/docs'),{recursive:true});fs.writeFileSync(path.join(dir,'native/README.md'),'Synthetic helper guide');for(const name of ['index.html','LLMs-Monitor-v1.33.0.zip','LLMs-Monitor-Codex-Helper-v1.30.0.zip','RELEASE-CHECKSUMS.txt'])fs.writeFileSync(path.join(dir,'dist',name),'preserve '+name);fs.writeFileSync(path.join(dir,'dist/docs/PRIVACY.md'),'Unchanged guide');fn(dir)}finally{fs.rmSync(dir,{recursive:true,force:true})}}
const run=(dir,args)=>cp.spawnSync('python3',['build.py',...args],{cwd:dir,encoding:'utf8'});
test('manual-only build succeeds without any app/manifest inputs and preserves app/ZIP/unnamed guide bytes',()=>fixture(dir=>{
 const r=run(dir,['--manuals-only','CODEX_HELPER.md']);assert.equal(r.status,0,r.stderr);assert.match(fs.readFileSync(path.join(dir,'dist/docs/CODEX_HELPER.md'),'utf8'),/main\/native\/README\.md\n\nSynthetic helper guide$/);
 for(const name of ['index.html','LLMs-Monitor-v1.33.0.zip','LLMs-Monitor-Codex-Helper-v1.30.0.zip','RELEASE-CHECKSUMS.txt'])assert.equal(fs.readFileSync(path.join(dir,'dist',name),'utf8'),'preserve '+name);
 assert.equal(fs.readFileSync(path.join(dir,'dist/docs/PRIVACY.md'),'utf8'),'Unchanged guide');assert.equal(fs.existsSync(path.join(dir,'extension')),false);
}));
test('manual-only build rejects empty/unknown/traversal/mixed scope before writing even a valid selected guide',()=>fixture(dir=>{
 for(const args of [['--manuals-only'],['--manuals-only','CODEX_HELPER.md','../native/README.md'],['--manuals-only','CODEX_HELPER.md','--package'],['--manuals-only','CODEX_HELPER.md','--codex-helper'],['--package','--manuals-only','CODEX_HELPER.md']]){const r=run(dir,args);assert.notEqual(r.status,0);assert.equal(fs.existsSync(path.join(dir,'dist/docs/CODEX_HELPER.md')),false)}
}));


test('Mac updater manual alias builds from its canonical source without an app manifest',()=>fixture(dir=>{
 fs.mkdirSync(path.join(dir,'tools/mac-updater'),{recursive:true});fs.writeFileSync(path.join(dir,'tools/mac-updater/README.md'),'Synthetic updater guide');
 const r=run(dir,['--manuals-only','MAC_UPDATER.md']);assert.equal(r.status,0,r.stderr);
 assert.match(fs.readFileSync(path.join(dir,'dist/docs/MAC_UPDATER.md'),'utf8'),/main\/tools\/mac-updater\/README\.md\n\nSynthetic updater guide$/);
 assert.equal(fs.readFileSync(path.join(dir,'dist/LLMs-Monitor-v1.33.0.zip'),'utf8'),'preserve LLMs-Monitor-v1.33.0.zip');
}));
