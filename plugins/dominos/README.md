# Domino's

OpenTabs plugin for Domino's Pizza — gives AI agents access to Domino's through your authenticated browser session.

## Install

```bash
opentabs plugin install dominos
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-dominos
```

## Setup

1. Open [dominos.com](https://www.dominos.com) in Chrome and log in
2. Open the OpenTabs side panel — the Domino's plugin should appear as **ready**

## Tools (20)

### Account (5)

| Tool | Description | Type |
|---|---|---|
| `get_customer` | Get your Domino's account profile | Read |
| `get_saved_addresses` | List your saved delivery addresses | Read |
| `get_saved_cards` | List your saved payment cards | Read |
| `get_loyalty_points` | Check your loyalty point balance | Read |
| `get_loyalty_rewards` | Check available loyalty rewards | Read |

### Stores (2)

| Tool | Description | Type |
|---|---|---|
| `search_address` | Autocomplete an address for store search | Read |
| `find_stores_by_address` | Find stores near a specific address | Read |

### Menu (4)

| Tool | Description | Type |
|---|---|---|
| `get_menu_categories` | List menu categories | Read |
| `get_category_products` | List products in a menu category | Read |
| `get_product` | Get details for a specific menu item | Read |
| `get_deal` | Get details for a specific deal/coupon | Read |

### Cart (9)

| Tool | Description | Type |
|---|---|---|
| `create_cart` | Start a new carryout order at a store | Write |
| `get_cart` | View your current cart | Read |
| `add_product_to_cart` | Add a menu item to your cart | Write |
| `update_product_quantity` | Change quantity of a cart item | Write |
| `add_deal_to_cart` | Apply a deal/coupon to your cart | Write |
| `remove_deal_from_cart` | Remove a deal/coupon from your cart | Write |
| `get_checkout_summary` | Review your order before checkout | Read |
| `navigate_to_checkout` | Open the checkout page to place your order | Write |
| `place_order_cash` | Place your order and pay cash at pickup | Write |

## How It Works

This plugin runs inside your Domino's tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
