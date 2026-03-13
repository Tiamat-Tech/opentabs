# TikTok

OpenTabs plugin for TikTok — gives AI agents access to TikTok through your authenticated browser session.

## Install

```bash
opentabs plugin install tiktok
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-tiktok
```

## Setup

1. Open [tiktok.com](https://www.tiktok.com) in Chrome and log in
2. Open the OpenTabs side panel — the TikTok plugin should appear as **ready**

## Tools (9)

### Account (2)

| Tool | Description | Type |
|---|---|---|
| `get_current_user` | Get the authenticated user profile | Read |
| `get_notifications` | Get recent notifications | Read |

### Users (3)

| Tool | Description | Type |
|---|---|---|
| `get_user_profile` | Get a user profile by username | Read |
| `get_following` | Get accounts a user follows | Read |
| `get_followers` | Get followers of a user | Read |

### Videos (1)

| Tool | Description | Type |
|---|---|---|
| `get_video` | Get video details by ID | Read |

### Feed (1)

| Tool | Description | Type |
|---|---|---|
| `get_for_you_feed` | Get personalized For You video feed | Read |

### Search (2)

| Tool | Description | Type |
|---|---|---|
| `search_videos` | Search for videos by keyword | Read |
| `search_users` | Search for users by name or username | Read |

## How It Works

This plugin runs inside your TikTok tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
