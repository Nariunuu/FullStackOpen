#!/usr/bin/env bash
set -euo pipefail

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$BACKEND_DIR/../part2/phonebook"

echo "Building frontend in $FRONTEND_DIR..."
cd "$FRONTEND_DIR"
npm run build

echo "Copying dist to $BACKEND_DIR/dist..."
rm -rf "$BACKEND_DIR/dist"
cp -r "$FRONTEND_DIR/dist" "$BACKEND_DIR/dist"

echo "Done."
