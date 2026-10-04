from pathlib import Path
import json, shutil, zipfile, sys
root = Path(__file__).resolve().parent
manifest = json.loads((root / 'extension' / 'manifest.json').read_text())
version = manifest['version']
version_css = 'style-v' + version.replace('.', '') + '.css'
(root / 'dist' / 'floating-chrome.js').unlink(missing_ok=True)
for legacy_css in (root / 'dist').glob('style-v*.css'):
    if legacy_css.name not in {version_css, 'style-v151.css', 'style-v152.css', 'style-v153.css', 'style-v160.css', 'style-v161.css', 'style-v162.css', 'style-v163.css', 'style-v164.css', 'style-v170.css', 'style-v1140.css', 'style-v1150.css', 'style-v1160.css', 'style-v1170.css', 'style-v1171.css', 'style-v1180.css','style-v1190.css', 'style-v1200.css', 'style-v1210.css'}: legacy_css.unlink()
for name in ['index.html', 'privacy.html', 'style.css', 'style-v151.css', 'style-v152.css', 'style-v153.css', 'style-v160.css', 'style-v161.css', 'style-v162.css', 'style-v163.css', 'style-v164.css', 'style-v170.css', 'style-v1140.css', 'style-v1150.css', 'style-v1160.css', 'style-v1170.css', 'style-v1171.css', 'style-v1180.css', 'style-v1190.css', 'style-v1200.css', 'style-v1210.css', version_css, 'locale.js', 'preferences.js', 'provider-status.js', 'intelligence.js', 'changes.js', 'shared.js', 'api-credits.js', 'sound.js', 'advice.js', 'app.js']:
    shutil.copy2(root / 'extension' / name, root / 'dist' / name)
# Standalone bilingual product page and its promotional artwork.
for name in ['product.html', 'product.css', 'product.js', 'app-web.css', 'app-web.js']:
    shutil.copy2(root / 'web' / name, root / 'dist' / name)
(root / 'dist' / 'promotional').mkdir(exist_ok=True)
shutil.copy2(root / 'assets' / 'promotional' / 'llms-monitor-a4-landscape-flyer-v1.png', root / 'dist' / 'promotional' / 'llms-monitor-a4-landscape-flyer-v1.png')
(root / 'dist' / 'api').mkdir(exist_ok=True)
(root / 'dist' / 'api' / 'intelligence.json').write_text(json.dumps({'status':'unconfigured','checkedAt':0,'alerts':[]}, separators=(',', ':')) + '\n')
for html_name in ['index.html', 'privacy.html']:
    target = root / 'dist' / html_name
    html = target.read_text()
    for asset in ['style.css', 'style-v151.css', 'style-v152.css', 'style-v153.css', 'style-v160.css', 'style-v161.css', 'style-v162.css', 'style-v163.css', 'style-v164.css', 'style-v170.css', 'style-v1140.css', 'style-v1150.css', 'style-v1160.css', 'style-v1170.css', 'style-v1171.css', 'style-v1180.css', 'style-v1190.css', 'style-v1200.css', 'style-v1210.css', version_css, 'locale.js', 'preferences.js', 'provider-status.js', 'intelligence.js', 'changes.js', 'shared.js', 'api-credits.js', 'sound.js', 'advice.js', 'app.js']:
        html = html.replace(f'"{asset}"', f'"{asset}?v={version.replace(".", "")}"')
    if html_name == 'index.html':
        html = html.replace('</head>', f'<link rel="stylesheet" href="app-web.css?v={version.replace('.', '')}"></head>')
        html = html.replace('</body>', f'<script src="app-web.js?v={version.replace('.', '')}"></script></body>')
    target.write_text(html)
requirements = json.loads((root / 'spec' / 'requirements.json').read_text())
checks = {
    'dist/index.html': [version, version_css, f'LLMs-Monitor-v{version}.zip'],
    'dist/shared.js': [f"const APP_VERSION='{version}'"],
    'SPECIFICATION.md': [f'対象製品版: {version}'],
    'STORE_SUBMISSION.md': [version],
}
if requirements.get('product', {}).get('version') != version:
    raise SystemExit('spec/requirements.json product.version does not match manifest.version')
if requirements.get('product', {}).get('package_filename') != f'LLMs-Monitor-v{version}.zip':
    raise SystemExit('spec/requirements.json package_filename does not match manifest.version')
for relative, needles in checks.items():
    source = (root / relative).read_text()
    for needle in needles:
        if needle not in source:
            raise SystemExit(f'{relative} is missing version contract: {needle}')
package = root / 'dist' / f'LLMs-Monitor-v{version}.zip'
if '--package' in sys.argv:
    for name in ['README.md', 'PRIVACY.md', 'CHANGELOG.md', 'SECURITY_REVIEW.md']:
        shutil.copy2(root / name, root / 'extension' / name)
    for legacy in (root / 'dist').glob('LLMs-*-v*.zip'):
        if legacy != package: legacy.unlink()
    with zipfile.ZipFile(package, 'w', zipfile.ZIP_DEFLATED) as archive:
        for path in sorted((root / 'extension').rglob('*')):
            if path.is_file() and path.name != '.DS_Store': archive.write(path, path.relative_to(root / 'extension'))
    print(f'LLMs Monitor v{version} package created.')
else:
    print(f'LLMs Monitor web assets built; store package v{version} preserved.')
