#!/usr/bin/env bash
# deploy.sh: Black Pixel Records
# Creates route-directory index.html fallbacks (for hosts without Nginx rewrite support)
# and rsyncs the site to the target server.
#
# Usage:
#   ./deploy.sh [user@host:/remote/path]
#   ./deploy.sh                          # dry-run: only creates local fallbacks
#
set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")" && pwd)"
REMOTE="${1:-}"

# ---------------------------------------------------------------------------
# Page routes discovered from existing root-level .html files.
# Keeps fallback generation aligned with real pages in this repo.
# ---------------------------------------------------------------------------
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

# Root index fallback (Nginx tries $uri/index.html for /)
if [[ -f "$SITE_ROOT/index.html" ]]; then
  # Already at root; nothing to do. Nginx serves index.html for /
  echo "    OK  index.html (root)"
fi

echo ""
echo "==> Fallback generation complete."

# ---------------------------------------------------------------------------
# Optional rsync deploy
# ---------------------------------------------------------------------------
if [[ -n "$REMOTE" ]]; then
  echo ""
  echo "==> Deploying to $REMOTE"
  rsync -avz --delete \
    --exclude='.git' \
    --exclude='*.php'   \
    --exclude='deploy.sh' \
    --exclude='smoke-test.sh' \
    --exclude='nginx-routes.conf' \
    "$SITE_ROOT/" "$REMOTE"
  echo "==> Deploy complete."
else
  echo "==> No remote specified; local fallbacks only."
  echo "    To deploy: ./deploy.sh user@host:/var/www/blackpixelrecords"
fi
