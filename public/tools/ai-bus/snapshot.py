#!/usr/bin/env python3
"""Offline status-only exporter. Never fetches, writes to Git, or reads envelopes."""
import argparse, datetime as dt, json, os, re, subprocess, tempfile
from pathlib import Path
IDS = ('chatgpt', 'claude', 'codex', 'grok', 'muse')
LEVELS = {'余裕あり': 'available', '注意': 'caution', '枯渇に近い': 'low', '未確認': 'unknown'}
def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), '--no-pager', *args], stderr=subprocess.DEVNULL, timeout=10)
def timestamp(value):
    if not isinstance(value,str) or not re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?(?:Z|[+-]\d\d:\d\d)',value): return None
    try: dt.datetime.fromisoformat(value.replace('Z','+00:00')); return value
    except ValueError: return None
def status(blob, ident):
    unknown={'id':ident,'level':'unknown','updatedAt':None,'resetAt':None}
    if len(blob)>16384: return unknown
    try: lines=blob.decode('utf-8').splitlines()
    except UnicodeError: return unknown
    # Only a flat frontmatter prefix is interpreted. Duplicates/tags/aliases fail closed.
    if not lines or lines[0]!='---': return unknown
    fields={}
    for line in lines[1:]:
        if line=='---': break
        if not line.strip() or line.lstrip().startswith('#'): continue
        m=re.fullmatch(r'([a-z_]+):\s*(.*?)\s*',line)
        if not m or m[1] in fields: return unknown
        raw=m[2]
        if raw.startswith(('!','&','*','[','{','|','>')): return unknown
        fields[m[1]]=raw[1:-1] if len(raw)>1 and raw[0]==raw[-1] and raw[0] in "\"'" else raw
    else: return unknown
    return {'id':ident,'level':LEVELS.get(fields.get('level'),'unknown'),'updatedAt':timestamp(fields.get('updated_at')),'resetAt':timestamp(fields.get('reset_at'))}
def collect(repo, ref='origin/main'):
    if not re.fullmatch(r'[A-Za-z0-9_./-]{1,120}',ref) or ref.startswith('-') or '..' in ref: raise ValueError('Invalid ref')
    remote=git(repo,'config','--get','remote.origin.url').decode().strip()
    if not re.fullmatch(r'(?:https://github\.com/ntus/ai-bus(?:\.git)?|git@github\.com:ntus/ai-bus(?:\.git)?)',remote): raise ValueError('Expected ntus/ai-bus origin')
    commit=git(repo,'rev-parse','--verify',ref+'^{commit}').decode().strip()
    if not re.fullmatch(r'[a-f0-9]{40}',commit): raise ValueError('Invalid commit')
    agents=[];complete=True
    for ident in IDS:
        try:
            obj=commit+':status/'+ident+'.md'
            if int(git(repo,'cat-file','-s',obj))>16384: raise ValueError('Oversized status')
            blob=git(repo,'show','--no-ext-diff','--no-textconv',obj); row=status(blob,ident)
        except (subprocess.SubprocessError,OSError,ValueError): complete=False; row={'id':ident,'level':'unknown','updatedAt':None,'resetAt':None}
        agents.append(row)
    return {'schemaVersion':1,'source':{'repository':'ntus/ai-bus','commit':commit},'collectedAt':dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'),'complete':complete,'agents':agents}
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',required=True,type=Path);p.add_argument('--ref',default='origin/main');p.add_argument('--output',type=Path);a=p.parse_args()
    try:
        value=json.dumps(collect(a.repo,a.ref),ensure_ascii=False,indent=2)+'\n'
        if a.output:
            if a.output.exists() or a.output.is_symlink(): raise ValueError('Output already exists; choose a new file')
            fd,name=tempfile.mkstemp(prefix='.team-status-',dir=a.output.parent)
            try:
                with os.fdopen(fd,'w') as f: f.write(value)
                os.link(name,a.output) # Atomic no-clobber; no following an existing symlink.
            finally: os.unlink(name)
        else: print(value,end='')
    except (ValueError,subprocess.SubprocessError,OSError): p.exit(1,'Could not export a verified local ai-bus snapshot. No source data was printed.\n')
if __name__=='__main__': main()
