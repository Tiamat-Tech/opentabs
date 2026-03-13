# Pinterest

OpenTabs plugin for Pinterest — gives AI agents access to Pinterest through your authenticated browser session.

## Install

```bash
opentabs plugin install pinterest
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-pinterest
```

## Setup

1. Open [pinterest.com](https://www.pinterest.com) in Chrome and log in
2. Open the OpenTabs side panel — the Pinterest plugin should appear as **ready**

## Tools (24)

### Account (2)

| Tool | Description | Type |
|---|---|---|
| `get_current_user` | Get the authenticated user profile | Read |
| `get_notification_counts` | Get notification badge counts | Read |

### Users (1)

| Tool | Description | Type |
|---|---|---|
| `get_user_profile` | Get a user profile by username | Read |

### Boards (9)

| Tool | Description | Type |
|---|---|---|
| `list_boards` | List boards for a user | Read |
| `get_board_pins` | Get pins from a board | Read |
| `get_board_sections` | Get sections for a board | Read |
| `create_board` | Create a new board | Write |
| `update_board` | Update a board | Write |
| `delete_board` | Delete a board | Write |
| `create_board_section` | Create a section in a board | Write |
| `delete_board_section` | Delete a board section | Write |
| `search_boards` | Search for boards by keyword | Read |

### Pins (8)

| Tool | Description | Type |
|---|---|---|
| `get_pin` | Get pin details by ID | Read |
| `create_pin` | Create a new pin on a board | Write |
| `save_pin` | Save an existing pin to a board | Write |
| `delete_pin` | Delete a pin | Write |
| `get_home_feed` | Get the personalized home feed | Read |
| `get_related_pins` | Get pins related to a specific pin | Read |
| `search_pins` | Search for pins by keyword | Read |
| `get_user_pins` | Get pins created by a user | Read |

### Social (4)

| Tool | Description | Type |
|---|---|---|
| `follow_user` | Follow a Pinterest user | Write |
| `unfollow_user` | Unfollow a Pinterest user | Write |
| `list_followers` | List followers of a user | Read |
| `list_following` | List users a user is following | Read |

## How It Works

This plugin runs inside your Pinterest tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
