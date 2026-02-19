---
title: What is OpenTabs?
description: OpenTabs is a Chrome extension + MCP server that gives AI agents access to web applications through your authenticated browser session.
---

OpenTabs is a Chrome extension + MCP server that gives AI agents access to web applications through your authenticated browser session.

## The Problem

AI agents like Claude Code are powerful, but they can't interact with web applications. To use Slack, Datadog, or any internal tool, you need API tokens, bot accounts, and admin approval. For many tools, there's no API at all.

## The Solution

OpenTabs bridges this gap. It uses your existing browser sessions — the ones where you're already logged in — and exposes them as MCP tools that AI agents can call.

```
┌─────────────┐  Streamable HTTP  ┌─────────────┐  WebSocket  ┌──────────────────┐
│  AI Agent   │ ←───────────────→ │ MCP Server  │ ←─────────→ │ Chrome Extension │
│(Claude Code)│  /mcp             │ (localhost)  │             │   (Background)   │
└─────────────┘                   └─────────────┘             └────────┬─────────┘
                                                                       │
                                                              ┌────────▼─────────┐
                                                              │  Adapter Scripts  │
                                                              │  (injected into   │
                                                              │   matching tabs)  │
                                                              └────────┬─────────┘
                                                                       │ Same-origin
                                                              ┌────────▼─────────┐
                                                              │   Web APIs        │
                                                              │ (your session)    │
                                                              └──────────────────┘
```

## Key Concepts

### Zero Tokens, Full Access

No API keys. No bot accounts. No OAuth configuration. If you can access it in your browser, OpenTabs can give your AI agent access to it.

### Plugin-Based Architecture

OpenTabs uses a plugin system. Each plugin adds support for a web application (like Slack) by defining:

- **Tools** — MCP tools that AI agents can call (e.g., `slack_send_message`)
- **Adapters** — JavaScript that runs in the page context to call web APIs using your session
- **URL patterns** — which pages the plugin should activate on

### MCP Native

OpenTabs speaks [Model Context Protocol (MCP)](https://modelcontextprotocol.io/), the open standard for connecting AI agents to tools. Any MCP-compatible client works out of the box.

## Next Steps

- [Getting Started](/guide/getting-started/) — Install and set up OpenTabs in 5 minutes
- [How It Works](/guide/how-it-works/) — Deeper dive into the architecture
- [Creating a Plugin](/plugins/creating-a-plugin/) — Build a plugin for any web app
