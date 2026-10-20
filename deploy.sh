#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

git pull origin main
npm ci
npm run build
if command -v pm2 >/dev/null 2>&1; then
  pm2 startOrReload ecosystem.config.cjs
  pm2 save
else
  echo "PM2 is not installed. Run: npm i -g pm2 && pm2 start ecosystem.config.cjs && pm2 save && pm2 startup"
fi
