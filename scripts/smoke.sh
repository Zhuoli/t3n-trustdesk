#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export TRUSTDESK_MODE="${TRUSTDESK_MODE:-stub}"
echo "== TrustDesk smoke (mode=$TRUSTDESK_MODE) =="
npm run auth
npm run agent:register
npm run tee
npm run demo
echo "== smoke OK =="
