# Cloudflare

OpenTabs plugin for Cloudflare — gives AI agents access to Cloudflare through your authenticated browser session.

## Install

```bash
opentabs plugin install cloudflare
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-cloudflare
```

## Setup

1. Open [dash.cloudflare.com](https://dash.cloudflare.com) in Chrome and log in
2. Open the OpenTabs side panel — the Cloudflare plugin should appear as **ready**

## Tools (30)

### Zones (2)

| Tool | Description | Type |
|---|---|---|
| `list_zones` | List all domains/zones | Read |
| `get_zone` | Get zone details | Read |

### Settings (2)

| Tool | Description | Type |
|---|---|---|
| `get_zone_settings` | Get all zone settings | Read |
| `update_zone_setting` | Update a zone setting | Write |

### DNS (4)

| Tool | Description | Type |
|---|---|---|
| `list_dns_records` | List DNS records for a zone | Read |
| `create_dns_record` | Create a DNS record | Write |
| `update_dns_record` | Update a DNS record | Write |
| `delete_dns_record` | Delete a DNS record | Write |

### Security (4)

| Tool | Description | Type |
|---|---|---|
| `list_rulesets` | List zone rulesets | Read |
| `get_ruleset` | Get ruleset with rules | Read |
| `list_firewall_rules` | List classic firewall rules | Read |
| `list_rules_lists` | List IP/rules lists | Read |

### Rules (1)

| Tool | Description | Type |
|---|---|---|
| `list_page_rules` | List page rules | Read |

### SSL (1)

| Tool | Description | Type |
|---|---|---|
| `list_ssl_certificates` | List SSL certificate packs | Read |

### Cache (1)

| Tool | Description | Type |
|---|---|---|
| `purge_cache` | Purge zone cache | Write |

### Workers (2)

| Tool | Description | Type |
|---|---|---|
| `list_workers` | List Workers scripts | Read |
| `list_worker_routes` | List Workers routes for a zone | Read |

### Pages (1)

| Tool | Description | Type |
|---|---|---|
| `list_pages_projects` | List Pages projects | Read |

### Storage (3)

| Tool | Description | Type |
|---|---|---|
| `list_kv_namespaces` | List KV namespaces | Read |
| `list_d1_databases` | List D1 databases | Read |
| `list_queues` | List Cloudflare Queues | Read |

### AI (2)

| Tool | Description | Type |
|---|---|---|
| `list_ai_models` | List Workers AI models | Read |
| `list_vectorize_indexes` | List Vectorize indexes | Read |

### Network (1)

| Tool | Description | Type |
|---|---|---|
| `list_tunnels` | List Cloudflare Tunnels | Read |

### Email (2)

| Tool | Description | Type |
|---|---|---|
| `list_email_routing_rules` | List email routing rules | Read |
| `list_email_addresses` | List email routing destinations | Read |

### Traffic (1)

| Tool | Description | Type |
|---|---|---|
| `list_waiting_rooms` | List Waiting Rooms | Read |

### Notifications (1)

| Tool | Description | Type |
|---|---|---|
| `list_alerting_policies` | List alerting policies | Read |

### Analytics (1)

| Tool | Description | Type |
|---|---|---|
| `graphql_query` | Execute a GraphQL analytics query | Write |

### Account (1)

| Tool | Description | Type |
|---|---|---|
| `get_user` | Get current user profile | Read |

## How It Works

This plugin runs inside your Cloudflare tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
