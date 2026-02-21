#!/usr/bin/env bash
#
# Publish @opentabs-dev platform packages to npm (private).
#
# Requires:
#   - ~/.npmrc          — session token (from `npm login`) for reading
#   - ~/.npmrc.publish  — granular token for publishing (bypass 2FA)
#
# Setup (one-time):
#   1. Run `npm login --scope=@opentabs-dev` to create ~/.npmrc with session token
#   2. Create a granular access token at https://www.npmjs.com/settings/tokens/create
#      - Permissions: Read and Write, Packages: @opentabs-dev/*, Bypass 2FA enabled
#   3. Save it: echo '//registry.npmjs.org/:_authToken=<TOKEN>' > ~/.npmrc.publish
#
# Usage:
#   ./scripts/publish.sh <version>
#   ./scripts/publish.sh 0.0.3
#
set -euo pipefail

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/publish.sh <version>"
  echo "Example: ./scripts/publish.sh 0.0.3"
  exit 1
fi

PUBLISH_NPMRC="$HOME/.npmrc.publish"
SESSION_NPMRC="$HOME/.npmrc"

if [ ! -f "$PUBLISH_NPMRC" ]; then
  echo "Error: $PUBLISH_NPMRC not found."
  echo ""
  echo "Create it with your granular access token:"
  echo "  echo '//registry.npmjs.org/:_authToken=<YOUR_TOKEN>' > ~/.npmrc.publish"
  exit 1
fi

if [ ! -f "$SESSION_NPMRC" ]; then
  echo "Error: $SESSION_NPMRC not found. Run 'npm login --scope=@opentabs-dev' first."
  exit 1
fi

echo "==> Building platform packages..."
bun run build

echo ""
echo "==> Bumping versions to $VERSION..."
for pkg in platform/shared platform/plugin-sdk platform/plugin-tools platform/cli; do
  sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$pkg/package.json"
  echo "  $pkg/package.json → $VERSION"
done

# Update cross-references to new version
for pkg in platform/plugin-sdk platform/plugin-tools platform/cli; do
  sed -i '' "s/\"@opentabs-dev\/shared\": \"\\^[^\"]*\"/\"@opentabs-dev\/shared\": \"^$VERSION\"/" "$pkg/package.json"
done
for pkg in platform/plugin-tools platform/cli; do
  sed -i '' "s/\"@opentabs-dev\/plugin-sdk\": \"\\^[^\"]*\"/\"@opentabs-dev\/plugin-sdk\": \"^$VERSION\"/" "$pkg/package.json"
done
sed -i '' "s/\"@opentabs-dev\/plugin-tools\": \"\\^[^\"]*\"/\"@opentabs-dev\/plugin-tools\": \"^$VERSION\"/" platform/cli/package.json

echo ""
echo "==> Rebuilding with new versions..."
bun run build

echo ""
echo "==> Switching to publish token..."
cp "$SESSION_NPMRC" "$SESSION_NPMRC.bak"
cp "$PUBLISH_NPMRC" "$SESSION_NPMRC"

cleanup() {
  echo "==> Restoring session token..."
  cp "$SESSION_NPMRC.bak" "$SESSION_NPMRC"
  rm -f "$SESSION_NPMRC.bak"
}
trap cleanup EXIT

echo "==> Publishing packages (dependency order)..."
echo ""

echo "  Publishing @opentabs-dev/shared@$VERSION..."
npm publish --access restricted -w platform/shared

echo "  Publishing @opentabs-dev/plugin-sdk@$VERSION..."
npm publish --access restricted -w platform/plugin-sdk

echo "  Publishing @opentabs-dev/plugin-tools@$VERSION..."
npm publish --access restricted -w platform/plugin-tools

echo "  Publishing @opentabs-dev/cli@$VERSION..."
npm publish --access restricted -w platform/cli

echo ""
echo "==> Published all packages at v$VERSION"
echo ""
echo "Next steps:"
echo "  1. Update plugin dependencies: sed -i '' 's/\"\\^[0-9.]*\"/\"^$VERSION\"/' plugins/*/package.json"
echo "  2. Rebuild plugins: cd plugins/slack && bun install && bun run build"
echo "  3. Commit the version bump"
