---
title: How It Works
description: OpenTabs has three components that work together — the MCP server, the Chrome extension, and plugins.
---

OpenTabs has three components that work together: the MCP server, the Chrome extension, and plugins.

## Architecture Overview

```
┌─────────────┐  Streamable HTTP  ┌─────────────┐  WebSocket  ┌──────────────────┐
│  AI Agent   │ ←───────────────→ │ MCP Server  │ ←─────────→ │ Chrome Extension │
│(Claude Code)│  /mcp             │ (localhost)  │             │   (Background)   │
└─────────────┘                   └──────┬──────┘             └────────┬─────────┘
                                         │                             │
                                  ┌──────▼──────┐            ┌────────▼─────────┐
                                  │   Plugin    │            │  Adapter IIFEs   │
                                  │  Discovery  │            │  (per plugin,    │
                                  │ (npm + local│            │   injected into  │
                                  │  paths)     │            │   matching tabs) │
                                  └─────────────┘            └────────┬─────────┘
                                                                      │ Same-origin
                                                             ┌────────▼─────────┐
                                                             │   Web APIs       │
                                                             │ (user's session) │
                                                             └──────────────────┘
```

## The Flow of a Tool Call

When an AI agent calls an OpenTabs tool, here's what happens:

1. **AI agent** sends a tool call via MCP (e.g., `slack_send_message`)
2. **MCP server** receives it, identifies which plugin owns the tool, and forwards it to the Chrome extension via WebSocket
3. **Chrome extension** finds the matching tab (one with Slack open) and dispatches the call to the adapter running in that tab
4. **Adapter** executes the action using the page's web APIs and the user's authenticated session
5. **Response** flows back through the same chain to the AI agent

## MCP Server

The MCP server is the bridge between AI agents and the browser. It:

- **Discovers plugins** from npm packages and local paths
- **Registers MCP tools** from each plugin's tool definitions
- **Relays tool calls** between MCP clients and the Chrome extension
- **Supports hot reload** — rebuild the server and tools update without restarting

The server runs on `localhost:3000` and exposes a Streamable HTTP endpoint at `/mcp`.

## Chrome Extension

The Chrome extension (Manifest V3) manages the browser side:

- **Connects to the MCP server** via WebSocket (through an offscreen document for persistence)
- **Registers content scripts** dynamically based on plugin URL patterns
- **Injects adapter scripts** into matching tabs in the MAIN world (same execution context as the page)
- **Routes tool calls** to the correct tab's adapter

## Plugins

Each plugin adds support for a web application. A plugin contains:

- **`opentabs-plugin.json`** — manifest with metadata, URL patterns, and tool definitions
- **`dist/adapter.iife.js`** — bundled adapter script injected into matching pages
- **Tool definitions** — Zod schemas defining inputs, outputs, and descriptions

### Plugin Discovery

The MCP server finds plugins in two ways:

1. **npm packages** — any package matching `opentabs-plugin-*` or with the `opentabs-plugin` keyword
2. **Local paths** — directories listed in `~/.opentabs/config.json`

### Tab State Machine

Each plugin's tab has three possible states:

| State         | Meaning                                                        |
| ------------- | -------------------------------------------------------------- |
| `closed`      | No matching tab exists                                         |
| `unavailable` | Tab exists but `isReady()` returns false (e.g., not logged in) |
| `ready`       | Tab exists and authenticated — tools can be called             |

## Hot Reload

The MCP server runs with `bun --hot`. When you rebuild, Bun re-evaluates modules while keeping the process alive. All WebSocket connections, MCP sessions, and client connections are preserved. Tools update in-place and clients receive a `notifications/tools/list_changed` notification automatically.

## Next Steps

- [Getting Started](/guide/getting-started/) — Set up OpenTabs
- [Creating a Plugin](/plugins/creating-a-plugin/) — Build a plugin for any web app
- [Configuration Reference](/reference/config/) — All configuration options
