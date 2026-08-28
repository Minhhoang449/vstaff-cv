#!/bin/bash
# Chạy trên cPanel Terminal sau khi Git clone + cấu hình env vars Node.js App.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> npm install"
npm install

echo "==> prisma generate"
npm run db:generate

echo "==> next build"
npm run build

echo "==> upload dir"
mkdir -p public/uploads/avatars
chmod 755 public/uploads/avatars

echo "Done. Restart Node.js App trong cPanel (npm start)."
