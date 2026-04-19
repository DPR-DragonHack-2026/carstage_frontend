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

if [ ! -f captain-definition ]; then
  echo "error: captain-definition not found in $(pwd)" >&2
  exit 1
fi

if [ ! -f Dockerfile ]; then
  echo "error: Dockerfile not found in $(pwd)" >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "warning: working tree has uncommitted changes; archiving committed HEAD only" >&2
fi

echo "==> Creating $OUTPUT from git HEAD"
git archive --format=tar -o "$OUTPUT" HEAD

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo "==> Done: $OUTPUT ($SIZE)"
echo
echo "Next steps:"
echo "  - CapRover UI: Apps -> <your-app> -> Deployment -> Method 2 (tarball) -> upload $OUTPUT"
echo "  - or CLI:      caprover deploy -t $OUTPUT"
