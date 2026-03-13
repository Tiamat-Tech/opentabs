# Tumblr

OpenTabs plugin for Tumblr — gives AI agents access to Tumblr through your authenticated browser session.

## Install

```bash
opentabs plugin install tumblr
```

Or install globally via npm:

```bash
npm install -g @opentabs-dev/opentabs-plugin-tumblr
```

## Setup

1. Open [tumblr.com](https://www.tumblr.com) in Chrome and log in
2. Open the OpenTabs side panel — the Tumblr plugin should appear as **ready**

## Tools (32)

### Account (9)

| Tool | Description | Type |
|---|---|---|
| `get_current_user` | Get your Tumblr profile | Read |
| `get_user_limits` | Get your Tumblr rate limits | Read |
| `get_user_likes` | Get your liked posts | Read |
| `get_user_following` | Get blogs you follow | Read |
| `follow_blog` | Follow a blog | Write |
| `unfollow_blog` | Unfollow a blog | Write |
| `get_filtered_tags` | Get your filtered tags | Read |
| `add_filtered_tag` | Filter a tag from your dashboard | Write |
| `remove_filtered_tag` | Unfilter a tag | Write |

### Dashboard (1)

| Tool | Description | Type |
|---|---|---|
| `get_dashboard` | Get your Tumblr dashboard | Read |

### Posts (11)

| Tool | Description | Type |
|---|---|---|
| `get_post` | Get a post | Read |
| `create_post` | Create a post | Write |
| `edit_post` | Edit a post | Write |
| `delete_post` | Delete a post | Write |
| `reblog_post` | Reblog a post | Write |
| `like_post` | Like a post | Write |
| `unlike_post` | Unlike a post | Write |
| `get_post_notes` | Get notes on a post | Read |
| `get_draft_posts` | List draft posts | Read |
| `get_queued_posts` | Get queued posts for a blog | Read |
| `get_submissions` | Get submitted posts for a blog | Read |

### Blogs (6)

| Tool | Description | Type |
|---|---|---|
| `get_blog_info` | Get blog details | Read |
| `get_blog_posts` | List blog posts | Read |
| `get_blog_followers` | List blog followers | Read |
| `get_blog_following` | List followed blogs | Read |
| `get_blog_likes` | List liked posts | Read |
| `get_blog_notifications` | List blog notifications | Read |

### Explore (2)

| Tool | Description | Type |
|---|---|---|
| `search_tagged` | Search posts by tag | Read |
| `get_recommended_blogs` | Discover recommended blogs | Read |

### Moderation (3)

| Tool | Description | Type |
|---|---|---|
| `get_blocks` | List blocked blogs | Read |
| `block_blog` | Block a blog | Write |
| `unblock_blog` | Unblock a blog | Write |

## How It Works

This plugin runs inside your Tumblr tab through the [OpenTabs](https://opentabs.dev) Chrome extension. It uses your existing browser session — no API tokens or OAuth apps required. All operations happen as you, with your permissions.

## License

MIT
