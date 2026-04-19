#!/usr/bin/env bash
#
# Build a CapRover deployment tarball from the current git HEAD.
#
# Usage:
#   ./deploy.sh                  # creates ./deploy.tar
#   ./deploy.sh my-release.tar   # creates ./my-release.tar
#
# The tarball contains exactly what git tracks (no node_modules, .next,
# .env, etc.), with `captain-definition` and `Dockerfile` at the root,
# ready to upload via the CapRover dashboard or `caprover deploy -t`.

set -euo pipefail

cd "$(dirname "$0")"

OUTPUT="${1:-deploy.tar}"

if ! command -v git >/dev/null 2>&1; then
  echo "error: git is required" >&2
  exit 1
fi

require_tracked() {
  local file="$1"
  if [ ! -f "$file" ]; then
    echo "error: $file not found in $(pwd)" >&2
    exit 1
  fi
  if ! git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
    echo "error: $file exists but is NOT committed to git." >&2
    echo "       'git archive HEAD' only includes tracked files, so CapRover" >&2
    echo "       would reject the tarball with 'Captain Definition file does not exist!'" >&2
    echo "       Run: git add $file && git commit -m 'add $file'" >&2
    exit 1
  fi
}

require_tracked captain-definition
require_tracked Dockerfile

if [ -n "$(git status --porcelain)" ]; then
  echo "warning: working tree has uncommitted changes; archiving committed HEAD only" >&2
fi

rm -f "$OUTPUT"

echo "==> Creating $OUTPUT from git HEAD"
git archive --format=tar -o "$OUTPUT" HEAD

if ! tar -tf "$OUTPUT" | grep -qx 'captain-definition'; then
  echo "error: $OUTPUT does not contain captain-definition at its root." >&2
  echo "       Aborting so CapRover doesn't reject this upload." >&2
  exit 1
fi

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo "==> Done: $OUTPUT ($SIZE)"
echo
echo "Next steps:"
echo "  - CapRover UI: Apps -> <your-app> -> Deployment -> Method 2 (tarball) -> upload $OUTPUT"
echo "  - or CLI:      caprover deploy -t $OUTPUT"
