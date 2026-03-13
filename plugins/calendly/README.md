# Calendly

OpenTabs plugin for Calendly — gives AI agents access to Calendly through your authenticated browser session.

## Install

```bash
opentabs plugin install calendly
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-calendly
```

## Setup

1. Open [calendly.com](https://calendly.com) in Chrome and log in
2. Open the OpenTabs side panel — the Calendly plugin should appear as **ready**

## Tools (15)

### Users (2)

| Tool | Description | Type |
|---|---|---|
| `get_current_user` | Get the authenticated user profile | Read |
| `get_user_permissions` | Get current user permissions and capabilities | Read |

### Organization (2)

| Tool | Description | Type |
|---|---|---|
| `get_organization` | Get the current organization details | Read |
| `get_organization_statistics` | Get organization seat statistics | Read |

### Event Types (8)

| Tool | Description | Type |
|---|---|---|
| `list_event_types` | List your scheduling event types | Read |
| `get_event_type` | Get event type details by ID | Read |
| `create_event_type` | Create a new scheduling event type | Write |
| `update_event_type` | Update an event type | Write |
| `delete_event_type` | Delete an event type permanently | Write |
| `clone_event_type` | Clone an event type | Write |
| `activate_event_type` | Activate an event type for booking | Write |
| `deactivate_event_type` | Deactivate an event type | Write |

### Scheduled Events (1)

| Tool | Description | Type |
|---|---|---|
| `list_scheduled_events` | List your scheduled meetings | Read |

### Calendars (2)

| Tool | Description | Type |
|---|---|---|
| `list_calendar_accounts` | List connected calendar accounts | Read |
| `get_user_busy_times` | Get busy time slots for a date range | Read |

## How It Works

This plugin runs inside your Calendly tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
