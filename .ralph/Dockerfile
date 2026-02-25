# Ralph Worker Container — isolated execution environment for AI coding agents.
#
# This image contains everything a ralph worker needs to run autonomously:
#   - Bun (package manager + runtime)
#   - Node.js (Playwright test runner)
#   - Git (commits inside the mounted worktree)
#   - Claude CLI (AI agent)
#   - Playwright Chromium (E2E tests, headless)
#   - jq (PRD parsing)
#
# The host's git worktree is bind-mounted at /workspace. The container runs
# the agent session, which may spawn Playwright, Chromium, test servers, etc.
# When the container is killed (docker kill), cgroups guarantee ALL child
# processes die atomically — no orphans, no pattern matching, no cleanup loops.
#
# Build:  docker build -t ralph-worker -f .ralph/Dockerfile .
# Usage:  (managed by ralph.sh — not invoked directly)

# --- Stage 1: Base system with all runtimes ---

FROM node:22-bookworm-slim AS base

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# System dependencies for Chromium (Playwright) and general tooling
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    git \
    jq \
    # Chromium runtime dependencies (headless mode still needs these libs)
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libwayland-client0 \
    # Git operations may need ssh for some remote configurations
    openssh-client \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# --- Install Bun ---
# Pin to the version matching the project's engines requirement (>= 1.3.9)
ENV BUN_INSTALL=/usr/local/bun
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.3.9" \
    && ln -sf /usr/local/bun/bin/bun /usr/local/bin/bun \
    && ln -sf /usr/local/bun/bin/bunx /usr/local/bin/bunx

# --- Install Claude CLI ---
# Claude Code is distributed as a standalone binary via npm.
# Install globally so it's available as `claude` in PATH.
RUN npm install -g @anthropic-ai/claude-code@latest \
    && claude --version

# --- Install Playwright Chromium ---
# Install just chromium (not firefox/webkit) to keep the image small.
# The version must match the @playwright/test version in the project.
# npx playwright install handles downloading the correct browser build.
RUN npx playwright@1.58.2 install chromium --with-deps

# --- Container configuration ---

# Git needs a user identity for commits inside the container
RUN git config --global user.email "ralph@opentabs.dev" \
    && git config --global user.name "Ralph Worker" \
    # Mark all directories as safe (worktree mounts from the host)
    && git config --global --add safe.directory '*'

# Default entrypoint — ralph.sh overrides the command for each worker
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["echo 'Ralph worker container ready. This container is managed by ralph.sh.'"]
