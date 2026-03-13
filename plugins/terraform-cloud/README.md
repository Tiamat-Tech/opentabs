# HCP Terraform

OpenTabs plugin for HCP Terraform (Terraform Cloud) — gives AI agents access to HCP Terraform through your authenticated browser session.

## Install

```bash
opentabs plugin install terraform-cloud
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-terraform-cloud
```

## Setup

1. Open [app.terraform.io](https://app.terraform.io) in Chrome and log in
2. Open the OpenTabs side panel — the HCP Terraform plugin should appear as **ready**

## Tools (38)

### Account (1)

| Tool | Description | Type |
|---|---|---|
| `get_current_user` | Get your Terraform Cloud profile | Read |

### Organizations (3)

| Tool | Description | Type |
|---|---|---|
| `list_organizations` | List your organizations | Read |
| `get_organization` | Get organization details | Read |
| `list_organization_members` | List organization members | Read |

### Projects (5)

| Tool | Description | Type |
|---|---|---|
| `list_projects` | List projects in an organization | Read |
| `get_project` | Get project details | Read |
| `create_project` | Create a new project | Write |
| `update_project` | Update project settings | Write |
| `delete_project` | Delete a project | Write |

### Workspaces (7)

| Tool | Description | Type |
|---|---|---|
| `list_workspaces` | List workspaces in an organization | Read |
| `get_workspace` | Get workspace details | Read |
| `create_workspace` | Create a new workspace | Write |
| `update_workspace` | Update workspace settings | Write |
| `delete_workspace` | Delete a workspace | Write |
| `lock_workspace` | Lock a workspace | Write |
| `unlock_workspace` | Unlock a workspace | Write |

### Runs (6)

| Tool | Description | Type |
|---|---|---|
| `list_runs` | List runs for a workspace | Read |
| `get_run` | Get run details | Read |
| `create_run` | Queue a new run | Write |
| `apply_run` | Apply a planned run | Write |
| `cancel_run` | Cancel a run | Write |
| `discard_run` | Discard a planned run | Write |

### Plans (2)

| Tool | Description | Type |
|---|---|---|
| `get_plan` | Get plan details | Read |
| `get_plan_json_output` | Get plan output as JSON | Read |

### Applies (1)

| Tool | Description | Type |
|---|---|---|
| `get_apply` | Get apply details | Read |

### State (2)

| Tool | Description | Type |
|---|---|---|
| `list_state_versions` | List state versions for a workspace | Read |
| `get_current_state_version` | Get current state version | Read |

### Variables (4)

| Tool | Description | Type |
|---|---|---|
| `list_workspace_variables` | List variables for a workspace | Read |
| `create_variable` | Create a workspace variable | Write |
| `update_variable` | Update a workspace variable | Write |
| `delete_variable` | Delete a workspace variable | Write |

### Variable Sets (4)

| Tool | Description | Type |
|---|---|---|
| `list_variable_sets` | List variable sets in an organization | Read |
| `get_variable_set` | Get variable set details | Read |
| `create_variable_set` | Create a variable set | Write |
| `delete_variable_set` | Delete a variable set | Write |

### Teams (3)

| Tool | Description | Type |
|---|---|---|
| `list_teams` | List teams in an organization | Read |
| `get_team` | Get team details | Read |
| `list_team_access` | List team access for a workspace | Read |

## How It Works

This plugin runs inside your HCP Terraform tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
