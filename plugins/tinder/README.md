# Tinder

OpenTabs plugin for Tinder — gives AI agents access to Tinder through your authenticated browser session.

## Install

```bash
opentabs plugin install tinder
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-tinder
```

## Setup

1. Open [tinder.com](https://tinder.com) in Chrome and log in
2. Open the OpenTabs side panel — the Tinder plugin should appear as **ready**

## Tools (16)

### Profile (2)

| Tool | Description | Type |
|---|---|---|
| `get_current_user` | Get your Tinder profile | Read |
| `update_profile` | Update your Tinder profile | Write |

### Discovery (4)

| Tool | Description | Type |
|---|---|---|
| `get_recommendations` | Get profiles to swipe on | Read |
| `like_user` | Like a user | Write |
| `pass_user` | Pass on a user | Write |
| `super_like_user` | Super Like a user | Write |

### Matches (2)

| Tool | Description | Type |
|---|---|---|
| `list_matches` | List your matches | Read |
| `unmatch` | Remove a match | Write |

### Messages (2)

| Tool | Description | Type |
|---|---|---|
| `send_message` | Send a message to a match | Write |
| `like_message` | Like a message | Write |

### Users (1)

| Tool | Description | Type |
|---|---|---|
| `get_user` | Get a user profile | Read |

### Account (2)

| Tool | Description | Type |
|---|---|---|
| `get_metadata` | Get account metadata | Read |
| `get_updates` | Get recent activity updates | Read |

### Location (1)

| Tool | Description | Type |
|---|---|---|
| `update_location` | Update your location | Write |

### Fast Match (2)

| Tool | Description | Type |
|---|---|---|
| `get_fast_match_count` | Get count of people who liked you | Read |
| `get_fast_match_preview` | Preview people who liked you | Read |

## How It Works

This plugin runs inside your Tinder tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
