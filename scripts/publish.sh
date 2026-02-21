#!/usr/bin/env bash
#
# Publish @opentabs-dev platform packages to npm (private).
#
# Requires:
#   - ~/.npmrc with a token that has read+write access to @opentabs-dev packages.
#
# Setup (one-time):
#   1. Create a granular access token at https://www.npmjs.com/settings/tokens/create
#      - Permissions: Read and Write, Packages: @opentabs-dev/*, Bypass 2FA enabled
#   2. Save it: echo '//registry.npmjs.org/:_authToken=<TOKEN>' > ~/.npmrc
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

if [ -n "$(git status --porcelain)" ]; then
  echo "Warning: git working directory has uncommitted changes."
  read -p "Continue anyway? [y/N] " confirm
  [[ "$confirm" == [yY] ]] || exit 1
fi

echo "==> Verifying npm authentication..."
NPM_USER=$(npm whoami 2>&1) || {
  echo "Error: npm authentication failed."
  echo ""
  echo "Ensure ~/.npmrc has a valid token with read+write access."
  echo "Run 'npm login --scope=@opentabs-dev' or add a granular token to ~/.npmrc."
  exit 1
}
echo "  Authenticated as: $NPM_USER"

echo ""
echo "==> Bumping versions to $VERSION..."
for pkg in platform/shared platform/plugin-sdk platform/plugin-tools platform/cli; do
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$pkg/package.json" && rm "$pkg/package.json.bak"
  echo "  $pkg/package.json → $VERSION"
done

# Update cross-references to new version
for pkg in platform/plugin-sdk platform/plugin-tools platform/cli; do
  sed -i.bak "s/\"@opentabs-dev\/shared\": \"\\^[^\"]*\"/\"@opentabs-dev\/shared\": \"^$VERSION\"/" "$pkg/package.json" && rm "$pkg/package.json.bak"
done
for pkg in platform/plugin-tools platform/cli; do
  sed -i.bak "s/\"@opentabs-dev\/plugin-sdk\": \"\\^[^\"]*\"/\"@opentabs-dev\/plugin-sdk\": \"^$VERSION\"/" "$pkg/package.json" && rm "$pkg/package.json.bak"
done
sed -i.bak "s/\"@opentabs-dev\/plugin-tools\": \"\\^[^\"]*\"/\"@opentabs-dev\/plugin-tools\": \"^$VERSION\"/" platform/cli/package.json && rm platform/cli/package.json.bak

echo ""
echo "==> Rebuilding with new versions..."
bun run build

echo ""
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
echo "==> Creating release commit and tag..."
git add platform/shared/package.json platform/plugin-sdk/package.json platform/plugin-tools/package.json platform/cli/package.json
git commit -m "release: v$VERSION"
git tag "v$VERSION"

echo ""
echo "==> Release v$VERSION committed and tagged."
echo ""
echo "Next steps:"
echo "  1. git push && git push --tags"
echo "  2. Update plugin dependencies: sed -i.bak 's/\"\\^[0-9.]*\"/\"^$VERSION\"/' plugins/*/package.json && rm plugins/*/package.json.bak"
echo "  3. Rebuild plugins: cd plugins/<name> && bun install && bun run build"
