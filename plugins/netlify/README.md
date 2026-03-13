# Netlify

OpenTabs plugin for Netlify — gives AI agents access to Netlify through your authenticated browser session.

## Install

```bash
opentabs plugin install netlify
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-netlify
```

## Setup

1. Open [app.netlify.com](https://app.netlify.com) in Chrome and log in
2. Open the OpenTabs side panel — the Netlify plugin should appear as **ready**

## Tools (40)

### Account (4)

| Tool | Description | Type |
|---|---|---|
| `get_current_user` | Get authenticated user profile | Read |
| `list_accounts` | List all accounts | Read |
| `get_account` | Get account details by ID | Read |
| `list_audit_events` | List account audit log events | Read |

### Members (2)

| Tool | Description | Type |
|---|---|---|
| `list_members` | List account team members | Read |
| `get_member` | Get member details by ID | Read |

### Sites (5)

| Tool | Description | Type |
|---|---|---|
| `list_sites` | List sites in an account | Read |
| `get_site` | Get site details by ID | Read |
| `create_site` | Create a new site | Write |
| `update_site` | Update site settings | Write |
| `delete_site` | Delete a site permanently | Write |

### Deploys (6)

| Tool | Description | Type |
|---|---|---|
| `list_deploys` | List site deploys | Read |
| `get_deploy` | Get deploy details by ID | Read |
| `lock_deploy` | Lock a deploy to prevent auto-publish | Write |
| `unlock_deploy` | Unlock a deploy to re-enable auto-publish | Write |
| `restore_deploy` | Restore a previous deploy | Write |
| `rollback_deploy` | Rollback site to previous deploy | Write |

### Builds (2)

| Tool | Description | Type |
|---|---|---|
| `list_builds` | List site builds | Read |
| `create_build` | Trigger a new site build | Write |

### Environment (5)

| Tool | Description | Type |
|---|---|---|
| `list_env_vars` | List environment variables | Read |
| `get_env_var` | Get environment variable by key | Read |
| `create_env_vars` | Create environment variables | Write |
| `update_env_var` | Update an environment variable | Write |
| `delete_env_var` | Delete an environment variable | Write |

### DNS (6)

| Tool | Description | Type |
|---|---|---|
| `list_dns_zones` | List DNS zones | Read |
| `get_dns_zone` | Get DNS zone details by ID | Read |
| `create_dns_zone` | Create a new DNS zone | Write |
| `list_dns_records` | List DNS records in a zone | Read |
| `create_dns_record` | Create a DNS record | Write |
| `delete_dns_record` | Delete a DNS record | Write |

### Hooks (5)

| Tool | Description | Type |
|---|---|---|
| `list_hooks` | List site notification hooks | Read |
| `delete_hook` | Delete a notification hook | Write |
| `list_build_hooks` | List site build hooks | Read |
| `create_build_hook` | Create a build hook | Write |
| `delete_build_hook` | Delete a build hook | Write |

### Deploy Keys (2)

| Tool | Description | Type |
|---|---|---|
| `list_deploy_keys` | List deploy keys | Read |
| `create_deploy_key` | Create a new deploy key | Write |

### Forms (3)

| Tool | Description | Type |
|---|---|---|
| `list_forms` | List site forms | Read |
| `list_form_submissions` | List form submissions | Read |
| `delete_submission` | Delete a form submission | Write |

## How It Works

This plugin runs inside your Netlify tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
