#!/bin/sh
cd "$(dirname "$0")" || exit 1
python3 install.py
printf '\nPress Enter to close / Enterで閉じます: '
read -r answer
