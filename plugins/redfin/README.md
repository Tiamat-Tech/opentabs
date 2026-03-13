# Redfin

OpenTabs plugin for Redfin real estate — gives AI agents access to Redfin through your authenticated browser session.

## Install

```bash
opentabs plugin install redfin
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-redfin
```

## Setup

1. Open [redfin.com](https://www.redfin.com) in Chrome and log in
2. Open the OpenTabs side panel — the Redfin plugin should appear as **ready**

## Tools (12)

### Search (2)

| Tool | Description | Type |
|---|---|---|
| `search_locations` | Search cities, zips, and neighborhoods | Read |
| `search_properties` | Search properties by region with filters | Read |

### Properties (8)

| Tool | Description | Type |
|---|---|---|
| `get_property_details` | Get full details for a property | Read |
| `get_property_estimate` | Get Redfin Estimate and comparable homes | Read |
| `get_property_history` | Get price and listing history | Read |
| `get_property_schools` | Get nearby schools and ratings | Read |
| `get_property_risk_factors` | Get climate and environmental risk data | Read |
| `get_property_amenities` | Get property amenities and features | Read |
| `get_property_parcel_info` | Get parcel and assessor data | Read |
| `get_comparable_rentals` | Find comparable rental listings nearby | Read |

### Account (2)

| Tool | Description | Type |
|---|---|---|
| `get_current_user` | Get current user profile | Read |
| `get_favorites` | Get saved/favorited homes | Read |

## How It Works

This plugin runs inside your Redfin tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
