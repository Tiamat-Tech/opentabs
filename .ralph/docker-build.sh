#!/bin/bash
# Build the ralph-worker Docker image.
#
# Usage:
#   .ralph/docker-build.sh           # Build (uses cache)
#   .ralph/docker-build.sh --force   # Build without cache
#
# The image is tagged as `ralph-worker:latest`. Ralph.sh checks for this
# image at startup and prompts to build if missing.

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

IMAGE_NAME="ralph-worker"
DOCKERFILE="$SCRIPT_DIR/Dockerfile"

if [[ "${1:-}" == "--force" ]]; then
  echo "Building $IMAGE_NAME (no cache)..."
  docker build \
    --no-cache \
    -t "$IMAGE_NAME:latest" \
    -f "$DOCKERFILE" \
    "$PROJECT_DIR"
else
  echo "Building $IMAGE_NAME..."
  docker build \
    -t "$IMAGE_NAME:latest" \
    -f "$DOCKERFILE" \
    "$PROJECT_DIR"
fi

echo ""
echo "Image built: $IMAGE_NAME:latest"
docker images "$IMAGE_NAME:latest" --format "  Size: {{.Size}}  Created: {{.CreatedSince}}"
