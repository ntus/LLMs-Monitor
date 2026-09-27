from pathlib import Path
import shutil, zipfile
root = Path(__file__).resolve().parent
for name in ['index.html', 'style.css', 'changes.js', 'shared.js', 'sound.js', 'app.js']:
    shutil.copy2(root / 'dist' / name, root / 'extension' / name)
for name in ['README.md', 'PRIVACY.md']:
    shutil.copy2(root / name, root / 'extension' / name)
legacy = root / 'dist' / 'glance-extension.zip'
if legacy.exists(): legacy.unlink()
with zipfile.ZipFile(root / 'dist' / 'LLMs-Token-Usage-Monitor-v1.3.0.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted((root / 'extension').rglob('*')):
        if path.is_file(): archive.write(path, path.relative_to(root / 'extension'))
print('LLMs Token Usage Monitor v1.3.0 package created.')
