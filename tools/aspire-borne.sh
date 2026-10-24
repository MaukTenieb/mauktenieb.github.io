#!/bin/sh
# Copie les programmes d'Insert Koin (dépôt insertkoin, intact) dans borne/, le site d'essai de la borne.
# Usage : sh tools/aspire-borne.sh [commit]   (par défaut : main)
set -e
REF=${1:-main}
TMP=$(mktemp -d)
git clone -q https://github.com/MaukTenieb/insertkoin "$TMP/ik"
git -C "$TMP/ik" checkout -q "$REF"
SHA=$(git -C "$TMP/ik" rev-parse --short HEAD)
mkdir -p borne
git -C "$TMP/ik" ls-files \
 | grep -v -E '^(\.github/|notes/|tools/|README\.md$|build-fr\.py$|sitemap\.xml$|llms\.txt$|robots\.txt$)' \
 | while read -r f; do
     case "$f" in borne-*) continue;; esac   # fichiers propres à la borne : jamais écrasés
     d="$f"; [ "$f" = index.html ] && d=insertkoin.html   # borne/index.html : la borne elle-même
     mkdir -p "borne/$(dirname "$d")"; cp "$TMP/ik/$f" "borne/$d"
   done
printf 'insertkoin %s\n' "$SHA" > borne/ASPIRE.txt
rm -rf "$TMP"
python3 borne/borne-build.py
echo "borne/ : copie d'insertkoin $SHA"
