from pathlib import Path
import shutil, zipfile
root = Path(__file__).resolve().parent
for name in ['index.html', 'style.css', 'shared.js', 'app.js']:
    shutil.copy2(root / 'dist' / name, root / 'extension' / name)
shutil.copy2(root / 'README.md', root / 'extension' / 'README.md')
with zipfile.ZipFile(root / 'dist' / 'glance-extension.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted((root / 'extension').iterdir()):
        if path.is_file(): archive.write(path, path.name)
print('Extension package created.')
