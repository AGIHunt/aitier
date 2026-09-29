#!/usr/bin/env bash
# 构建并部署到 claw（aitier.agihunt.info）。用法：npm run deploy
set -euo pipefail
cd "$(dirname "$0")/.."
HOST=${DEPLOY_HOST:-claw}
DIR=/var/www/aitier.agihunt.info

npm run build
rsync -az --delete dist/ "$HOST:$DIR.new/"
# 原子切换：先传到 .new，再整体替换，避免访问到半新半旧的文件
ssh "$HOST" "rm -rf $DIR.old && { [ -d $DIR ] && mv $DIR $DIR.old || true; } && mv $DIR.new $DIR && rm -rf $DIR.old"
echo "已部署到 https://aitier.agihunt.info"
