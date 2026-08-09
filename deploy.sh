#!/usr/bin/env bash
# deploy.sh: Black Pixel Records
# Creates route-directory index.html fallbacks and rsyncs the site to NAS over SSH.
set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=../gorfednet.github/scripts/nas-ssh-deploy.sh
source "${SITE_ROOT}/../gorfednet.github/scripts/nas-ssh-deploy.sh"

nas_ssh_load_env "${SITE_ROOT}"
NAS_SITE_DIR="${NAS_SITE_DIR:-blackpixelrecords.com}"
REMOTE_TARGET="$(nas_ssh_target "${NAS_SITE_DIR}")"
RSYNC_SHELL="$(nas_ssh_rsync_shell)"

PAGES=()
while IFS= read -r page; do
  PAGES+=("$page")
done < <(
  for file in "$SITE_ROOT"/*.html; do
    base="$(basename "$file")"
    [[ "$base" == "index.html" ]] && continue
    echo "${base%.html}"
  done | sort
)

echo "==> Creating route-directory fallbacks in $SITE_ROOT"
if [[ ${#PAGES[@]} -eq 0 ]]; then
  echo "    INFO: No non-index .html pages found at repo root."
else
  for page in "${PAGES[@]}"; do
    dir="$SITE_ROOT/$page"
    src="$SITE_ROOT/${page}.html"
    dest="$dir/index.html"

    if [[ ! -f "$src" ]]; then
      echo "    WARN: $src not found, skipping $page/"
      continue
    fi

    mkdir -p "$dir"
    cp "$src" "$dest"
    echo "    OK  $page/index.html"
  done
fi

if [[ -f "$SITE_ROOT/index.html" ]]; then
  echo "    OK  index.html (root)"
fi

echo ""
echo "==> Fallback generation complete."
echo "==> Deploying to ${REMOTE_TARGET}"

nas_ssh_preflight "${NAS_SITE_DIR}"
rsync -avz --delete -e "${RSYNC_SHELL}" \
  --exclude='.git' \
  --exclude='*.php' \
  --exclude='deploy.sh' \
  --exclude='smoke-test.sh' \
  --exclude='nginx-routes.conf' \
  "${SITE_ROOT}/" "${REMOTE_TARGET}"

echo "==> Deploy complete."
