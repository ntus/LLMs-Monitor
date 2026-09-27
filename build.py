from pathlib import Path
import shutil, zipfile
root = Path(__file__).resolve().parent
for name in ['index.html', 'style.css', 'changes.js', 'shared.js', 'sound.js', 'app.js']:
    shutil.copy2(root / 'dist' / name, root / 'extension' / name)
for name in ['README.md', 'PRIVACY.md']:
    shutil.copy2(root / name, root / 'extension' / name)
for legacy_name in ['glance-extension.zip', 'LLMs-Token-Usage-Monitor-v1.3.0.zip', 'LLMs-Token-Usage-Monitor-v1.3.1.zip', 'LLMs-Token-Usage-Monitor-v1.3.2.zip']:
    legacy = root / 'dist' / legacy_name
    if legacy.exists(): legacy.unlink()
with zipfile.ZipFile(root / 'dist' / 'LLMs-Token-Usage-Monitor-v1.3.3.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted((root / 'extension').rglob('*')):
        if path.is_file(): archive.write(path, path.relative_to(root / 'extension'))
print('LLMs Token Usage Monitor v1.3.3 package created.')
